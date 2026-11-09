// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title RiftCardNFT
 * @dev Hợp đồng quản lý các lá bài & vật phẩm ảo Riftbound TCG chuẩn ERC-1155.
 * Tích hợp chuẩn ERC-2981 chia sẻ tiền bản quyền tự động (Royalties).
 */
contract RiftCardNFT is ERC1155Supply, ERC2981, Ownable {
    using Strings for uint256;

    string public name = "Riftbound TCG Cards";
    string public symbol = "RIFTCARD";

    // Địa chỉ các contract được phép đúc thẻ (ví dụ BoosterPack contract)
    mapping(address => bool) public authorizedMinters;

    // URI riêng cho từng tokenId (nếu có)
    mapping(uint256 => string) private _tokenURIs;
    string private _baseTokenURI;

    event MinterStatusUpdated(address indexed minter, bool status);
    event BaseURIUpdated(string newBaseURI);

    modifier onlyAuthorizedMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "RiftCardNFT: Khong co quyen duc the");
        _;
    }

    constructor(
        address initialOwner,
        string memory baseURI,
        address royaltyReceiver,
        uint96 royaltyFeeNumerator // Ví dụ 250 = 2.5%
    ) ERC1155(baseURI) Ownable(initialOwner) {
        _baseTokenURI = baseURI;
        // Thiết lập phí bản quyền mặc định cho game studio/người sáng tạo
        _setDefaultRoyalty(royaltyReceiver, royaltyFeeNumerator);
    }

    /**
     * @dev Cấp quyền đúc thẻ cho contract khác (vd: RiftBoosterPack)
     */
    function setAuthorizedMinter(address minter, bool status) external onlyOwner {
        authorizedMinters[minter] = status;
        emit MinterStatusUpdated(minter, status);
    }

    /**
     * @dev Đúc một loại thẻ bài đơn lẻ
     */
    function mint(address to, uint256 id, uint256 amount, bytes memory data) external onlyAuthorizedMinter {
        _mint(to, id, amount, data);
    }

    /**
     * @dev Đúc hàng loạt thẻ bài (Dùng khi mở gói bài hoặc phát hành mùa mới)
     */
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) external onlyAuthorizedMinter {
        _mintBatch(to, ids, amounts, data);
    }

    /**
     * @dev Cập nhật Base URI
     */
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    /**
     * @dev Đặt URI riêng cho từng tokenId
     */
    function setTokenURI(uint256 tokenId, string memory newURI) external onlyOwner {
        _tokenURIs[tokenId] = newURI;
    }

    /**
     * @dev Trả về đường dẫn Metadata JSON chuẩn OpenSea
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        string memory customURI = _tokenURIs[tokenId];
        if (bytes(customURI).length > 0) {
            return customURI;
        }
        return string(abi.encodePacked(_baseTokenURI, tokenId.toString(), ".json"));
    }

    /**
     * @dev Cập nhật phí bản quyền ERC-2981
     */
    function setDefaultRoyalty(address receiver, uint96 feeNumerator) external onlyOwner {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    // Ghi đè hàm bắt buộc từ đa kế thừa
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
