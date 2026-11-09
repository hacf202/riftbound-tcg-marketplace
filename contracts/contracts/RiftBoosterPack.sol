// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RiftCardNFT.sol";

/**
 * @title RiftBoosterPack
 * @dev Hợp đồng bán và mở các gói thẻ bài ngẫu nhiên (Gacha / Booster Packs) bằng đồng $RIFT.
 */
contract RiftBoosterPack is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable riftToken;
    RiftCardNFT public immutable cardNFT;
    address public treasury;

    // Cấu hình các gói thẻ
    struct PackConfig {
        string name;
        uint256 price;      // Giá tính bằng $RIFT (Wei)
        uint256 cardCount;  // Số lượng thẻ trong 1 gói
        bool active;
    }

    mapping(uint256 => PackConfig) public packs;
    uint256 public nextPackId = 1;
    uint256 private _nonce;

    event PackConfigured(uint256 indexed packId, string name, uint256 price, uint256 cardCount);
    event PackOpened(address indexed player, uint256 indexed packId, uint256[] cardIds);

    constructor(
        address initialOwner,
        address _riftToken,
        address _cardNFT,
        address _treasury
    ) Ownable(initialOwner) {
        riftToken = IERC20(_riftToken);
        cardNFT = RiftCardNFT(_cardNFT);
        treasury = _treasury;

        // Khởi tạo 2 gói bài tiêu chuẩn của Riftbound
        _configurePack(1, "Novice Rift Pack", 100 * 10 ** 18, 3, true);
        _configurePack(2, "Void Master Pack", 250 * 10 ** 18, 5, true);
        nextPackId = 3;
    }

    function configurePack(
        uint256 packId,
        string memory name,
        uint256 price,
        uint256 cardCount,
        bool active
    ) external onlyOwner {
        _configurePack(packId, name, price, cardCount, active);
    }

    function _configurePack(
        uint256 packId,
        string memory name,
        uint256 price,
        uint256 cardCount,
        bool active
    ) internal {
        packs[packId] = PackConfig({
            name: name,
            price: price,
            cardCount: cardCount,
            active: active
        });
        emit PackConfigured(packId, name, price, cardCount);
    }

    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Dia chi treasury khong hop le");
        treasury = _treasury;
    }

    /**
     * @dev Mua và bóc gói bài ngay lập tức
     */
    function openPack(uint256 packId) external nonReentrant returns (uint256[] memory) {
        PackConfig memory pack = packs[packId];
        require(pack.active, "Goi bai chua duoc mo ban");
        require(pack.cardCount > 0, "So luong the phai lon hon 0");

        // 1. Chuyển tiền $RIFT từ người chơi về Treasury của Game
        riftToken.safeTransferFrom(msg.sender, treasury, pack.price);

        // 2. Sinh ngẫu nhiên các lá bài theo tỷ lệ Rarity
        uint256 count = pack.cardCount;
        uint256[] memory cardIds = new uint256[](count);
        uint256[] memory amounts = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            _nonce++;
            uint256 randomNum = uint256(
                keccak2org(
                    abi.encodePacked(
                        block.timestamp,
                        block.prevrandao,
                        msg.sender,
                        _nonce,
                        i
                    )
                )
            ) % 100; // Random từ 0 - 99

            if (packId == 1) {
                // Novice Pack: 70% Common (ID 1,2), 25% Rare (ID 3,4), 5% Epic (ID 5)
                if (randomNum < 70) {
                    cardIds[i] = (randomNum % 2 == 0) ? 1 : 2;
                } else if (randomNum < 95) {
                    cardIds[i] = (randomNum % 2 == 0) ? 3 : 4;
                } else {
                    cardIds[i] = 5;
                }
            } else {
                // Master Pack: 40% Common, 35% Rare, 18% Epic, 6% Legendary (ID 6), 1% Mythic (ID 7)
                if (randomNum < 40) {
                    cardIds[i] = (randomNum % 2 == 0) ? 1 : 2;
                } else if (randomNum < 75) {
                    cardIds[i] = (randomNum % 2 == 0) ? 3 : 4;
                } else if (randomNum < 93) {
                    cardIds[i] = 5;
                } else if (randomNum < 99) {
                    cardIds[i] = 6;
                } else {
                    cardIds[i] = 7;
                }
            }
            amounts[i] = 1;
        }

        // 3. Đúc trực tiếp các lá bài trúng được vào ví của người chơi
        cardNFT.mintBatch(msg.sender, cardIds, amounts, "");

        emit PackOpened(msg.sender, packId, cardIds);
        return cardIds;
    }

    // Helper tạo hash keccak256
    function keccak2org(bytes memory data) internal pure returns (bytes32) {
        return keccak256(data);
    }
}
