const express = require("express");
const router = express.Router();
const store = require("../data/store");

/**
 * @route   GET /api/v1/packs
 * @desc    Lấy danh sách toàn bộ 6 gói bài đang mở bán
 */
router.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    data: store.getPacks(),
  });
});

/**
 * @route   POST /api/v1/packs/simulate-open
 * @desc    Mô phỏng bóc gói bài ngẫu nhiên từ kho 50 thẻ bài
 */
router.post("/simulate-open", (req, res) => {
  const { packId = 1 } = req.body;
  const packs = store.getPacks();
  const pack = packs.find((p) => p.id === parseInt(packId)) || packs[0];

  const cards = store.generatePackCards(pack.id);

  return res.status(200).json({
    success: true,
    data: {
      packId: pack.id,
      packName: pack.name,
      subtitle: pack.subtitle,
      cards: cards,
    },
  });
});

module.exports = router;
