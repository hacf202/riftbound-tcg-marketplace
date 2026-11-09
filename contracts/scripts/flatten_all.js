const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const contractsDir = path.join(__dirname, "../contracts");
const outputDir = path.join(__dirname, "../flattened");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const contractFiles = [
  "RiftToken.sol",
  "RiftCardNFT.sol",
  "RiftBoosterPack.sol",
  "RiftMarketplace.sol"
];

console.log("==================================================");
console.log("🔨 Đang tạo các file Solidity Flattened cho Remix IDE...");
console.log("URL Remix: https://app.remix.live/#lang=en&optimize&runs=200&evmVersion&version=soljson-v0.8.34+commit.80d5c536.js");
console.log("==================================================");

for (const file of contractFiles) {
  const filePath = path.join(contractsDir, file);
  const baseName = path.basename(file, ".sol");
  const destPath = path.join(outputDir, `${baseName}_flat.sol`);

  console.log(`-> Flattening ${file}...`);
  try {
    const rawFlattened = execSync(`npx hardhat flatten contracts/${file}`, {
      cwd: path.join(__dirname, ".."),
      maxBuffer: 10 * 1024 * 1024,
      encoding: "utf-8"
    });

    // Clean duplicate SPDX licenses and redundant pragmas to prevent Remix compile warnings
    const lines = rawFlattened.split("\n");
    let hasSPDX = false;
    let hasPragma = false;
    const cleanLines = [];

    cleanLines.push("// SPDX-License-Identifier: MIT");
    cleanLines.push("// Flattened source ready for Remix IDE (Solidity 0.8.24 / 0.8.34)");
    cleanLines.push("// Optimized with runs=200");
    cleanLines.push("pragma solidity ^0.8.24;\n");

    for (const line of lines) {
      if (line.includes("SPDX-License-Identifier")) continue;
      if (line.trim().startsWith("pragma solidity")) continue;
      cleanLines.push(line);
    }

    fs.writeFileSync(destPath, cleanLines.join("\n"), "utf-8");
    console.log(`✅ Xuất thành công: contracts/flattened/${baseName}_flat.sol`);
  } catch (err) {
    console.error(`❌ Lỗi khi flatten ${file}:`, err.message);
  }
}

console.log("==================================================");
console.log("✨ Đã tạo xong toàn bộ 4 file flattened trong thư mục contracts/flattened/");
console.log("Bạn có thể copy paste trực tiếp từng file vào Remix IDE mà không sợ thiếu thư viện OpenZeppelin!");
console.log("==================================================");
