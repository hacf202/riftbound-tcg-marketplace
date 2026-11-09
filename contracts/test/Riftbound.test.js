const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Hệ Thống Thẻ Bài & Sàn Giao Dịch Riftbound TCG", function () {
  let owner, seller, buyer, treasury, royaltyVault;
  let riftToken, cardNFT, boosterPack, marketplace;

  const BASE_URI = "https://api.riftbound.live/metadata/";
  const ROYALTY_BPS = 250; // 2.5%

  beforeEach(async function () {
    [owner, seller, buyer, treasury, royaltyVault] = await ethers.getSigners();

    // 1. Deploy RiftToken ($RIFT)
    const RiftTokenFactory = await ethers.getContractFactory("RiftToken");
    riftToken = await RiftTokenFactory.deploy(owner.address);
    await riftToken.waitForDeployment();

    // 2. Deploy RiftCardNFT
    const RiftCardNFTFactory = await ethers.getContractFactory("RiftCardNFT");
    cardNFT = await RiftCardNFTFactory.deploy(
      owner.address,
      BASE_URI,
      royaltyVault.address,
      ROYALTY_BPS
    );
    await cardNFT.waitForDeployment();

    // 3. Deploy RiftBoosterPack
    const RiftBoosterPackFactory = await ethers.getContractFactory("RiftBoosterPack");
    boosterPack = await RiftBoosterPackFactory.deploy(
      owner.address,
      await riftToken.getAddress(),
      await cardNFT.getAddress(),
      treasury.address
    );
    await boosterPack.waitForDeployment();

    // Cấp quyền MINTER cho BoosterPack contract
    await cardNFT.setAuthorizedMinter(await boosterPack.getAddress(), true);

    // 4. Deploy RiftMarketplace
    const RiftMarketplaceFactory = await ethers.getContractFactory("RiftMarketplace");
    marketplace = await RiftMarketplaceFactory.deploy(
      owner.address,
      await riftToken.getAddress(),
      treasury.address
    );
    await marketplace.waitForDeployment();
  });

  describe("1. RiftToken ($RIFT) & Faucet Mechanism", function () {
    it("Khởi tạo đúng số lượng token cho deployer", async function () {
      const balance = await riftToken.balanceOf(owner.address);
      expect(balance).to.equal(ethers.parseEther("1000000"));
    });

    it("Cho phép người dùng bấm Faucet nhận 1,000 $RIFT", async function () {
      await riftToken.connect(buyer).claimFaucet();
      const balance = await riftToken.balanceOf(buyer.address);
      expect(balance).to.equal(ethers.parseEther("1000"));
    });

    it("Chặn spam Faucet khi chưa hết thời gian cooldown (1 phút)", async function () {
      await riftToken.connect(buyer).claimFaucet();
      await expect(
        riftToken.connect(buyer).claimFaucet()
      ).to.be.revertedWith("Faucet: Vui long cho 1 phut giua cac lan claim");
    });
  });

  describe("2. RiftCardNFT (ERC-1155 & ERC-2981)", function () {
    it("Trả về đúng URI metadata của lá bài", async function () {
      const uri = await cardNFT.uri(1);
      expect(uri).to.equal(BASE_URI + "1.json");
    });

    it("Tính toán chính xác phí bản quyền ERC-2981 (2.5%)", async function () {
      const salePrice = ethers.parseEther("100");
      const [receiver, royaltyAmount] = await cardNFT.royaltyInfo(1, salePrice);
      expect(receiver).to.equal(royaltyVault.address);
      expect(royaltyAmount).to.equal(ethers.parseEther("2.5"));
    });
  });

  describe("3. RiftBoosterPack (Mở Gói Thẻ Bài Ngẫu Nhiên)", function () {
    it("Người chơi dùng 100 $RIFT mở gói Novice Pack và nhận được 3 thẻ bài", async function () {
      // Cấp tiền cho người chơi
      await riftToken.connect(buyer).claimFaucet();
      const packPrice = ethers.parseEther("100");

      // Approve $RIFT cho BoosterPack contract
      await riftToken.connect(buyer).approve(await boosterPack.getAddress(), packPrice);

      // Mở gói bài ID 1 (Novice Pack)
      const tx = await boosterPack.connect(buyer).openPack(1);
      const receipt = await tx.wait();

      // Kiểm tra Treasury nhận đúng 100 $RIFT
      const treasuryBalance = await riftToken.balanceOf(treasury.address);
      expect(treasuryBalance).to.equal(packPrice);

      // Kiểm tra số dư thẻ trong ví người chơi (tổng 3 lá)
      let totalCards = 0n;
      for (let id = 1; id <= 7; id++) {
        const bal = await cardNFT.balanceOf(buyer.address, id);
        totalCards += bal;
      }
      expect(totalCards).to.equal(3n);
    });
  });

  describe("4. RiftMarketplace (Niêm Yết & Mua Bán Thẻ)", function () {
    const CARD_ID = 3; // Riftblade Vanguard (Rare)
    const CARD_AMOUNT = 2;
    const PRICE_PER_CARD = ethers.parseEther("50");

    beforeEach(async function () {
      // Đúc thẻ cho seller
      await cardNFT.mint(seller.address, CARD_ID, CARD_AMOUNT, "0x");

      // Cấp tiền $RIFT cho buyer
      await riftToken.connect(buyer).claimFaucet();
    });

    it("Cho phép Seller niêm yết bán thẻ vào Escrow", async function () {
      // Cấp quyền cho Marketplace chuyển NFT
      await cardNFT.connect(seller).setApprovalForAll(await marketplace.getAddress(), true);

      // Niêm yết thẻ
      await expect(
        marketplace.connect(seller).listItem(await cardNFT.getAddress(), CARD_ID, CARD_AMOUNT, PRICE_PER_CARD)
      ).to.emit(marketplace, "ItemListed");

      const listing = await marketplace.listings(1);
      expect(listing.seller).to.equal(seller.address);
      expect(listing.tokenId).to.equal(CARD_ID);
      expect(listing.quantity).to.equal(CARD_AMOUNT);
      expect(listing.pricePerItem).to.equal(PRICE_PER_CARD);
      expect(listing.isActive).to.be.true;

      // Đảm bảo thẻ đã được ký gửi vào Marketplace
      const marketCardBal = await cardNFT.balanceOf(await marketplace.getAddress(), CARD_ID);
      expect(marketCardBal).to.equal(CARD_AMOUNT);
    });

    it("Cho phép Seller hủy niêm yết và lấy lại thẻ", async function () {
      await cardNFT.connect(seller).setApprovalForAll(await marketplace.getAddress(), true);
      await marketplace.connect(seller).listItem(await cardNFT.getAddress(), CARD_ID, CARD_AMOUNT, PRICE_PER_CARD);

      await marketplace.connect(seller).cancelListing(1);

      const listing = await marketplace.listings(1);
      expect(listing.isActive).to.be.false;

      // Thẻ bài được hoàn trả lại cho Seller
      const sellerBal = await cardNFT.balanceOf(seller.address, CARD_ID);
      expect(sellerBal).to.equal(CARD_AMOUNT);
    });

    it("Buyer mua thẻ thành công: phân chia tiền chính xác (Seller + Sàn 2% + Royalty 2.5%)", async function () {
      await cardNFT.connect(seller).setApprovalForAll(await marketplace.getAddress(), true);
      await marketplace.connect(seller).listItem(await cardNFT.getAddress(), CARD_ID, 1, PRICE_PER_CARD);

      // Buyer approve $RIFT cho marketplace
      await riftToken.connect(buyer).approve(await marketplace.getAddress(), PRICE_PER_CARD);

      // Số dư ban đầu
      const initialSellerRift = await riftToken.balanceOf(seller.address);
      const initialTreasuryRift = await riftToken.balanceOf(treasury.address);
      const initialRoyaltyRift = await riftToken.balanceOf(royaltyVault.address);

      // Buyer thực hiện mua
      await marketplace.connect(buyer).buyItem(1, 1);

      // Tính toán lý thuyết:
      // Tổng giá = 50 $RIFT
      // Phí sàn = 2% của 50 = 1 $RIFT
      // Phí bản quyền = 2.5% của 50 = 1.25 $RIFT
      // Seller nhận = 50 - 1 - 1.25 = 47.75 $RIFT
      const protocolFee = ethers.parseEther("1");
      const royaltyFee = ethers.parseEther("1.25");
      const sellerPayout = ethers.parseEther("47.75");

      expect((await riftToken.balanceOf(seller.address)) - initialSellerRift).to.equal(sellerPayout);
      expect((await riftToken.balanceOf(treasury.address)) - initialTreasuryRift).to.equal(protocolFee);
      expect((await riftToken.balanceOf(royaltyVault.address)) - initialRoyaltyRift).to.equal(royaltyFee);

      // Buyer nhận được NFT
      const buyerCardBal = await cardNFT.balanceOf(buyer.address, CARD_ID);
      expect(buyerCardBal).to.equal(1n);
    });
  });
});
