const express = require("express");
const router = express.Router();
const store = require("../data/store");

/**
 * @route   GET /api/v1/users/:address/inventory
 * @desc    Lấy danh mục thẻ bài thực tế của một địa chỉ ví từ SQLite DB
 */
router.get("/:address/inventory", async (req, res) => {
  try {
    const address = req.params.address;
    const userCards = await store.getUserInventory(address);
    const balance = await store.getUserBalance(address);

    const totalValueRift = userCards.reduce((acc, item) => {
      return acc + (item.card ? item.card.marketFloorPrice * item.quantity : 0);
    }, 0);

    return res.status(200).json({
      success: true,
      data: {
        address: address,
        cards: userCards,
        totalCardsCount: userCards.reduce((acc, i) => acc + i.quantity, 0),
        estimatedPortfolioValueRift: totalValueRift,
        balance: balance,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi đọc kho thẻ từ Database",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/v1/users/:address/balance
 * @desc    Lấy số dư $RIFT của ví từ SQLite DB
 */
router.get("/:address/balance", async (req, res) => {
  try {
    const address = req.params.address;
    const balance = await store.getUserBalance(address);
    return res.status(200).json({
      success: true,
      data: {
        address,
        balance,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/v1/users/:address/faucet
 * @desc    Nhận 1,000 $RIFT từ Faucet và lưu vào SQLite DB
 */
router.post("/:address/faucet", async (req, res) => {
  try {
    const address = req.params.address;
    const newBalance = await store.claimFaucet(address);

    return res.status(200).json({
      success: true,
      message: "Đã nhận 1,000 $RIFT từ Faucet thành công (Lưu vào DB)",
      data: {
        address,
        balance: newBalance,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/v1/users/:address/deposit-eth
 * @desc    Quy đổi ETH sang $RIFT theo tỷ giá 1 ETH = 10,000 $RIFT
 */
router.post("/:address/deposit-eth", async (req, res) => {
  try {
    const address = req.params.address;
    const { ethAmount = 0.1, riftAmount = 1000, txHash = "", currency = "ETH" } = req.body;
    const newBalance = await store.depositEthForRift(address, ethAmount, riftAmount, txHash, currency);

    return res.status(200).json({
      success: true,
      message: `Đã quy đổi thành công ${ethAmount} ${currency} sang ${riftAmount} $RIFT`,
      data: {
        address,
        ethAmount,
        currency,
        riftAmount,
        txHash,
        balance: newBalance,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/v1/users/:address/pack-rewards
 * @desc    Lưu toàn bộ thẻ bài mở được và trừ tiền trong SQLite DB
 */
router.post("/:address/pack-rewards", async (req, res) => {
  try {
    const address = req.params.address;
    const { cardIds = [], price = 0, packId = 1 } = req.body;

    await store.recordPackOpening(address, packId, cardIds, price);

    const newBalance = await store.getUserBalance(address);
    const newInventory = await store.getUserInventory(address);

    return res.status(200).json({
      success: true,
      message: "Đã lưu kết quả mở gói vào SQLite Database thành công",
      data: {
        newBalance,
        inventory: newInventory,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/v1/users/:address/activity
 * @desc    Lấy lịch sử giao dịch của ví từ SQLite
 */
router.get("/:address/activity", async (req, res) => {
  try {
    const address = (req.params.address || "").toLowerCase();
    const limit = parseInt(req.query.limit) || 50;
    const userTxs = await store.getTransactions(limit, address);

    return res.status(200).json({
      success: true,
      data: userTxs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
