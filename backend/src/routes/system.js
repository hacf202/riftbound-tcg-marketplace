const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const SHARED_DIR = path.join(__dirname, "../../../shared");

/**
 * @route   GET /api/v1/system/health
 * @desc    Kiểm tra trạng thái server
 */
router.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    status: "ONLINE",
    service: "Riftbound TCG Backend RESTful API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route   GET /api/v1/system/contracts
 * @desc    Cung cấp địa chỉ Contract và ABI cho Frontend kết nối Web3
 */
router.get("/contracts", (req, res) => {
  try {
    const configPath = path.join(SHARED_DIR, "contracts-config.json");
    const abiPath = path.join(SHARED_DIR, "contracts-abi.json");

    let config = null;
    let abi = null;

    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    }
    if (fs.existsSync(abiPath)) {
      abi = JSON.parse(fs.readFileSync(abiPath, "utf-8"));
    }

    return res.status(200).json({
      success: true,
      data: {
        config,
        abi,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Không thể đọc dữ liệu contract deployment",
      error: error.message,
    });
  }
});

module.exports = router;
