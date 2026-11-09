/**
 * Script lưu cấu hình Contract sau khi Deploy trên Remix IDE hoặc Hardhat
 * 
 * Cách dùng 1 (Tham số dòng lệnh):
 *   node scripts/save_deployed.js --token 0x... --nft 0x... --pack 0x... --market 0x... --chainId 31337 --network localhost
 * 
 * Cách dùng 2 (Từ file JSON xuất ra từ Remix):
 *   node scripts/save_deployed.js --file remix-deployed.json
 * 
 * Cách dùng 3 (Tự động cập nhật ABI từ artifacts):
 *   node scripts/save_deployed.js --sync-abi
 */

const fs = require("fs");
const path = require("path");

const sharedDir = path.join(__dirname, "../../shared");
const configPath = path.join(sharedDir, "contracts-config.json");
const abiPath = path.join(sharedDir, "contracts-abi.json");
const artifactsDir = path.join(__dirname, "../artifacts/contracts");

// Phân tích tham số CLI
const args = process.argv.slice(2);
const params = {};
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith("--")) {
    const key = args[i].replace(/^--/, "");
    const value = args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : true;
    params[key] = value;
  }
}

// 1. Đọc cấu hình hiện tại
let currentConfig = {
  network: "localhost",
  chainId: 31337,
  contracts: {
    RiftToken: "",
    RiftCardNFT: "",
    RiftBoosterPack: "",
    RiftMarketplace: ""
  },
  treasury: "",
  deployedAt: new Date().toISOString()
};

if (fs.existsSync(configPath)) {
  try {
    currentConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  } catch (e) {
    console.warn("Chưa có config cũ, tạo mới...");
  }
}

// 2. Cập nhật từ file nếu có --file
if (params.file && fs.existsSync(params.file)) {
  try {
    const fileData = JSON.parse(fs.readFileSync(params.file, "utf-8"));
    if (fileData.contracts) {
      currentConfig.contracts = { ...currentConfig.contracts, ...fileData.contracts };
    }
    if (fileData.chainId) currentConfig.chainId = Number(fileData.chainId);
    if (fileData.network) currentConfig.network = fileData.network;
    if (fileData.treasury) currentConfig.treasury = fileData.treasury;
    console.log("-> Đã nạp dữ liệu từ file:", params.file);
  } catch (err) {
    console.error("Lỗi đọc file JSON:", err.message);
  }
}

// 3. Cập nhật từ tham số dòng lệnh
if (params.token) currentConfig.contracts.RiftToken = params.token;
if (params.nft) currentConfig.contracts.RiftCardNFT = params.nft;
if (params.pack) currentConfig.contracts.RiftBoosterPack = params.pack;
if (params.market) currentConfig.contracts.RiftMarketplace = params.market;
if (params.chainId) currentConfig.chainId = Number(params.chainId);
if (params.network) currentConfig.network = params.network;
if (params.treasury) currentConfig.treasury = params.treasury;

currentConfig.deployedAt = new Date().toISOString();

// Đảm bảo thư mục shared tồn tại
if (!fs.existsSync(sharedDir)) {
  fs.mkdirSync(sharedDir, { recursive: true });
}

// 4. Lưu contracts-config.json
fs.writeFileSync(configPath, JSON.stringify(currentConfig, null, 2), "utf-8");
console.log("==================================================");
console.log("✅ ĐÃ LƯU THÀNH CÔNG contracts-config.json TẠI /shared:");
console.log(JSON.stringify(currentConfig, null, 2));

// 5. Trích xuất và lưu ABIs mới nhất từ Artifacts
try {
  const abis = {};
  const contractList = [
    { name: "RiftToken", file: "RiftToken.sol/RiftToken.json" },
    { name: "RiftCardNFT", file: "RiftCardNFT.sol/RiftCardNFT.json" },
    { name: "RiftBoosterPack", file: "RiftBoosterPack.sol/RiftBoosterPack.json" },
    { name: "RiftMarketplace", file: "RiftMarketplace.sol/RiftMarketplace.json" }
  ];

  for (const c of contractList) {
    const artPath = path.join(artifactsDir, c.file);
    if (fs.existsSync(artPath)) {
      const art = JSON.parse(fs.readFileSync(artPath, "utf-8"));
      abis[c.name] = art.abi;
    }
  }

  if (Object.keys(abis).length > 0) {
    fs.writeFileSync(abiPath, JSON.stringify(abis, null, 2), "utf-8");
    console.log("✅ Đã cập nhật contracts-abi.json với đủ 4 Smart Contracts.");
  }
} catch (err) {
  console.warn("Lưu ý: Không thể xuất ABI từ artifacts (chưa compile?):", err.message);
}

// Đồng bộ vào frontend/src/config và backend/src/config nếu có
const frontendConfigDir = path.join(__dirname, "../../frontend/src/config");
const backendConfigDir = path.join(__dirname, "../../backend/src/config");

for (const targetDir of [frontendConfigDir, backendConfigDir]) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.writeFileSync(path.join(targetDir, "contracts-config.json"), JSON.stringify(currentConfig, null, 2), "utf-8");
  if (fs.existsSync(abiPath)) {
    fs.copyFileSync(abiPath, path.join(targetDir, "contracts-abi.json"));
  }
}

console.log("==================================================");
console.log("🚀 Frontend và Backend sẽ tự động nhận diện địa chỉ contract mới ngay lập tức!");
console.log("==================================================");
