// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RiftMarketplace
 * @dev Sàn giao dịch phi tập trung mua bán các vật phẩm ảo & thẻ bài NFT Riftbound.
 * Hỗ trợ thanh toán bằng $RIFT Token, bảo vệ Reentrancy, và chi trả bản quyền ERC-2981.
 */
contract RiftMarketplace is ReentrancyGuard, Pausable, Ownable, ERC1155Holder {
    using SafeERC20 for IERC20;

    IERC20 public immutable paymentToken;
    address public treasury;
    uint256 public protocolFeeBps = 200; // 2.0% (200 / 10000)

    struct Listing {
        uint256 listingId;
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 quantity;
        uint256 pricePerItem; // Giá mỗi thẻ tính bằng $RIFT
        bool isActive;
    }

    uint256 public nextListingId = 1;
    mapping(uint256 => Listing) public listings;

    event ItemListed(
        uint256 indexed listingId,
        address indexed seller,
        address indexed nftContract,
        uint256 tokenId,
        uint256 quantity,
        uint256 pricePerItem
    );

    event ItemCancelled(uint256 indexed listingId, address indexed seller);

    event ItemSold(
        uint256 indexed listingId,
        address indexed buyer,
        address indexed seller,
        uint256 tokenId,
        uint256 quantity,
        uint256 pricePerItem,
        uint256 protocolFee,
        uint256 royaltyFee
    );

    event ProtocolFeeUpdated(uint256 newFeeBps);
    event TreasuryUpdated(address newTreasury);

    constructor(
        address initialOwner,
        address _paymentToken,
        address _treasury
    ) Ownable(initialOwner) {
        paymentToken = IERC20(_paymentToken);
        treasury = _treasury;
    }

    /**
     * @dev Niêm yết thẻ bài lên sàn giao dịch (Ký gửi Escrow an toàn)
     */
    function listItem(
        address nftContract,
        uint256 tokenId,
        uint256 quantity,
        uint256 pricePerItem
    ) external whenNotPaused nonReentrant returns (uint256) {
        require(quantity > 0, "So luong phai lon hon 0");
        require(pricePerItem > 0, "Gia ban phai lon hon 0");
        require(nftContract != address(0), "Dia chi NFT khong hop le");

        uint256 listingId = nextListingId++;

        // Chuyển NFT từ ví người bán vào hợp đồng sàn (Escrow an toàn)
        IERC1155(nftContract).safeTransferFrom(
            msg.sender,
            address(this),
            tokenId,
            quantity,
            ""
        );

        listings[listingId] = Listing({
            listingId: listingId,
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            quantity: quantity,
            pricePerItem: pricePerItem,
            isActive: true
        });

        emit ItemListed(
            listingId,
            msg.sender,
            nftContract,
            tokenId,
            quantity,
            pricePerItem
        );

        return listingId;
    }

    /**
     * @dev Người bán hủy niêm yết và nhận lại thẻ bài
     */
    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Item khong ton tai hoac da ban het");
        require(listing.seller == msg.sender || msg.sender == owner(), "Chi nguoi ban moi co quyen huy");

        listing.isActive = false;

        // Trả lại NFT cho người bán
        IERC1155(listing.nftContract).safeTransferFrom(
            address(this),
            listing.seller,
            listing.tokenId,
            listing.quantity,
            ""
        );

        emit ItemCancelled(listingId, listing.seller);
    }

    /**
     * @dev Người mua thanh toán $RIFT để sở hữu thẻ bài
     */
    function buyItem(uint256 listingId, uint256 buyQuantity) external whenNotPaused nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Item khong con hoat dong");
        require(buyQuantity > 0 && buyQuantity <= listing.quantity, "So luong mua khong hop le");
        require(msg.sender != listing.seller, "Khong the tu mua the cua chinh minh");

        uint256 totalPrice = listing.pricePerItem * buyQuantity;
        uint256 protocolFee = (totalPrice * protocolFeeBps) / 10000;
        uint256 royaltyFee = 0;
        address royaltyReceiver = address(0);

        // Kiểm tra xem NFT có hỗ trợ chuẩn ERC-2981 chia sẻ bản quyền không
        try IERC165(listing.nftContract).supportsInterface(type(IERC2981).interfaceId) returns (bool supported) {
            if (supported) {
                (address receiver, uint256 amount) = IERC2981(listing.nftContract).royaltyInfo(
                    listing.tokenId,
                    totalPrice
                );
                if (receiver != address(0) && amount > 0 && (protocolFee + amount) < totalPrice) {
                    royaltyReceiver = receiver;
                    royaltyFee = amount;
                }
            }
        } catch {}

        uint256 sellerPayout = totalPrice - protocolFee - royaltyFee;

        // 1. Phân phối tiền thanh toán $RIFT
        // Gửi tiền cho người bán
        paymentToken.safeTransferFrom(msg.sender, listing.seller, sellerPayout);

        // Gửi phí sàn về Treasury
        if (protocolFee > 0 && treasury != address(0)) {
            paymentToken.safeTransferFrom(msg.sender, treasury, protocolFee);
        }

        // Gửi tiền bản quyền cho Card Creator / Studio
        if (royaltyFee > 0 && royaltyReceiver != address(0)) {
            paymentToken.safeTransferFrom(msg.sender, royaltyReceiver, royaltyFee);
        }

        // 2. Chuyển NFT từ hợp đồng sàn sang người mua
        IERC1155(listing.nftContract).safeTransferFrom(
            address(this),
            msg.sender,
            listing.tokenId,
            buyQuantity,
            ""
        );

        // 3. Cập nhật số lượng còn lại
        listing.quantity -= buyQuantity;
        if (listing.quantity == 0) {
            listing.isActive = false;
        }

        emit ItemSold(
            listingId,
            msg.sender,
            listing.seller,
            listing.tokenId,
            buyQuantity,
            listing.pricePerItem,
            protocolFee,
            royaltyFee
        );
    }

    function setProtocolFee(uint256 _newFeeBps) external onlyOwner {
        require(_newFeeBps <= 1000, "Phi san toi da la 10%");
        protocolFeeBps = _newFeeBps;
        emit ProtocolFeeUpdated(_newFeeBps);
    }

    function setTreasury(address _newTreasury) external onlyOwner {
        require(_newTreasury != address(0), "Dia chi Treasury khong hop le");
        treasury = _newTreasury;
        emit TreasuryUpdated(_newTreasury);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
