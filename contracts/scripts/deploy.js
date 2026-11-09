const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();

  console.log("==================================================");
  console.log("🚀 TRIỂN KHAI HỆ THỐNG SMART CONTRACTS RIFTBOUND TCG");
  console.log("Deployer Address:", deployer.address);
  console.log("Mạng:", network.name, `(ChainID: ${network.chainId})`);
  console.log("Số dư ví:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");
  console.log("==================================================");

  const treasury = deployer.address;
  const royaltyVault = deployer.address;
  const royaltyBps = 250; // 2.5%
  const baseURI = "http://localhost:5000/api/v1/cards/metadata/";

  // 1. Deploy RiftToken ($RIFT)
  console.log("1/4. Đang deploy RiftToken ($RIFT)...");
  const RiftToken = await ethers.getContractFactory("RiftToken");
  const riftToken = await RiftToken.deploy(deployer.address);
  await riftToken.waitForDeployment();
  const riftTokenAddress = await riftToken.getAddress();
  console.log("-> ✅ RiftToken deployed tại:", riftTokenAddress);

  // 2. Deploy RiftCardNFT
  console.log("2/4. Đang deploy RiftCardNFT (ERC-1155 + ERC-2981)...");
  const RiftCardNFT = await ethers.getContractFactory("RiftCardNFT");
  const cardNFT = await RiftCardNFT.deploy(deployer.address, baseURI, royaltyVault, royaltyBps);
  await cardNFT.waitForDeployment();
  const cardNFTAddress = await cardNFT.getAddress();
  console.log("-> ✅ RiftCardNFT deployed tại:", cardNFTAddress);

  // 3. Deploy RiftBoosterPack
  console.log("3/4. Đang deploy RiftBoosterPack (Gacha & Mở gói)...");
  const RiftBoosterPack = await ethers.getContractFactory("RiftBoosterPack");
  const boosterPack = await RiftBoosterPack.deploy(deployer.address, riftTokenAddress, cardNFTAddress, treasury);
  await boosterPack.waitForDeployment();
  const boosterPackAddress = await boosterPack.getAddress();
  console.log("-> ✅ RiftBoosterPack deployed tại:", boosterPackAddress);

  // Cấp quyền Minter cho BoosterPack
  console.log("-> Cấp quyền MINTER cho BoosterPack...");
  const txAuth = await cardNFT.setAuthorizedMinter(boosterPackAddress, true);
  await txAuth.wait();
  console.log("-> ✅ Đã cấp quyền MINTER cho BoosterPack thành công.");

  // 4. Deploy RiftMarketplace
  console.log("4/4. Đang deploy RiftMarketplace (Sàn giao dịch P2P)...");
  const RiftMarketplace = await ethers.getContractFactory("RiftMarketplace");
  const marketplace = await RiftMarketplace.deploy(deployer.address, riftTokenAddress, treasury);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("-> ✅ RiftMarketplace deployed tại:", marketplaceAddress);

  // 5. Seed initial cards for deployer
  console.log("5. Đang đúc các lá bài ban đầu cho Deployer...");
  const cardIds = Array.from({ length: 50 }, (_, i) => i + 1);
  const amounts = cardIds.map((id) => (id <= 20 ? 10 : id <= 35 ? 5 : id <= 45 ? 2 : 1));
  const txMint = await cardNFT.mintBatch(deployer.address, cardIds, amounts, "0x");
  await txMint.wait();
  console.log("-> ✅ Đã mint bộ thẻ khởi tạo cho ví:", deployer.address);

  // Cấp quyền chuyển nhượng cho sàn Marketplace
  const txApprove = await cardNFT.setApprovalForAll(marketplaceAddress, true);
  await txApprove.wait();

  // Tạo sẵn các niêm yết mẫu trên sàn
  console.log("-> Khởi tạo các niêm yết mẫu trên Marketplace...");
  try {
    await (await marketplace.listItem(cardNFTAddress, 30, 2, ethers.parseEther("45"))).wait();
    await (await marketplace.listItem(cardNFTAddress, 17, 1, ethers.parseEther("70"))).wait();
    await (await marketplace.listItem(cardNFTAddress, 44, 1, ethers.parseEther("180"))).wait();
    await (await marketplace.listItem(cardNFTAddress, 10, 1, ethers.parseEther("450"))).wait();
    console.log("-> ✅ Đã tạo niêm yết mẫu thành công!");
  } catch (err) {
    console.warn("Lưu ý tạo listing mẫu:", err.message);
  }

  // 6. LƯU THÔNG TIN CONTRACTS ĐỂ FRONTEND & BACKEND SỬ DỤNG NGAY
  const deploymentData = {
    network: network.name === "unknown" ? "localhost" : network.name,
    chainId: Number(network.chainId),
    contracts: {
      RiftToken: riftTokenAddress,
      RiftCardNFT: cardNFTAddress,
      RiftBoosterPack: boosterPackAddress,
      RiftMarketplace: marketplaceAddress,
    },
    treasury: treasury,
    deployedAt: new Date().toISOString(),
  };

  // Đọc ABIs từ thư mục artifacts
  const artifactsDir = path.join(__dirname, "../artifacts/contracts");
  const abis = {
    RiftToken: JSON.parse(fs.readFileSync(path.join(artifactsDir, "RiftToken.sol/RiftToken.json"))).abi,
    RiftCardNFT: JSON.parse(fs.readFileSync(path.join(artifactsDir, "RiftCardNFT.sol/RiftCardNFT.json"))).abi,
    RiftBoosterPack: JSON.parse(fs.readFileSync(path.join(artifactsDir, "RiftBoosterPack.sol/RiftBoosterPack.json"))).abi,
    RiftMarketplace: JSON.parse(fs.readFileSync(path.join(artifactsDir, "RiftMarketplace.sol/RiftMarketplace.json"))).abi,
  };

  // Ghi vào shared/
  const sharedDir = path.join(__dirname, "../../shared");
  if (!fs.existsSync(sharedDir)) fs.mkdirSync(sharedDir, { recursive: true });
  fs.writeFileSync(path.join(sharedDir, "contracts-config.json"), JSON.stringify(deploymentData, null, 2));
  fs.writeFileSync(path.join(sharedDir, "contracts-abi.json"), JSON.stringify(abis, null, 2));

  // Ghi vào frontend/src/config/ & backend/src/config/
  const frontendConfigDir = path.join(__dirname, "../../frontend/src/config");
  const backendConfigDir = path.join(__dirname, "../../backend/src/config");
  for (const dir of [frontendConfigDir, backendConfigDir]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "contracts-config.json"), JSON.stringify(deploymentData, null, 2));
    fs.writeFileSync(path.join(dir, "contracts-abi.json"), JSON.stringify(abis, null, 2));
  }

  // Ghi file local snapshot trong contracts/
  fs.writeFileSync(path.join(__dirname, "../deployed-contracts.json"), JSON.stringify(deploymentData, null, 2));

  console.log("\n==================================================");
  console.log("🎉 LƯU CẤU HÌNH VÀ ABI SMART CONTRACTS HOÀN TẤT!");
  console.log("📁 Đã cập nhật đồng thời:");
  console.log("   - /shared/contracts-config.json");
  console.log("   - /shared/contracts-abi.json");
  console.log("   - /frontend/src/config/");
  console.log("   - /backend/src/config/");
  console.log("==================================================");
  console.log("Thông tin chi tiết:");
  console.log(JSON.stringify(deploymentData.contracts, null, 2));
  console.log("==================================================\n");
}

main().catch((error) => {
  console.error("❌ Lỗi Deploy:", error);
  process.exitCode = 1;
});
