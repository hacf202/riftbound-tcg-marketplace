// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RiftToken ($RIFT)
 * @dev Tiền tệ trong hệ sinh thái game thẻ bài Riftbound TCG.
 * Tích hợp Faucet 1-Click phục vụ việc chấm điểm, demo báo cáo học phần.
 */
contract RiftToken is ERC20, ERC20Burnable, Ownable {
    uint256 public constant FAUCET_AMOUNT = 1000 * 10 ** 18; // 1,000 $RIFT
    uint256 public constant FAUCET_COOLDOWN = 1 minutes;      // 1 phút cooldown để tiện test

    mapping(address => uint256) public lastFaucetClaim;

    event FaucetClaimed(address indexed recipient, uint256 amount);

    constructor(address initialOwner) ERC20("Riftbound Token", "RIFT") Ownable(initialOwner) {
        // Đúc 1,000,000 $RIFT cho deployer phục vụ thanh khoản và testnet treasury
        _mint(initialOwner, 1_000_000 * 10 ** 18);
    }

    /**
     * @dev Nút nhận tiền thử nghiệm miễn phí cho Giảng viên & Người kiểm thử
     */
    function claimFaucet() external {
        require(
            block.timestamp >= lastFaucetClaim[msg.sender] + FAUCET_COOLDOWN,
            "Faucet: Vui long cho 1 phut giua cac lan claim"
        );
        lastFaucetClaim[msg.sender] = block.timestamp;
        _mint(msg.sender, FAUCET_AMOUNT);
        emit FaucetClaimed(msg.sender, FAUCET_AMOUNT);
    }

    /**
     * @dev Đúc thêm token cho Treasury hoặc Rewards (Chỉ Owner)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
