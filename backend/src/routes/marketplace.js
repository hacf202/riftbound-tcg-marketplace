const express = require("express");
const router = express.Router();
const store = require("../data/store");

/**
 * @route   GET /api/v1/marketplace/listings
 * @desc    Lấy danh sách các thẻ đang rao bán trên sàn (truy vấn từ SQLite DB)
 */
router.get("/listings", async (req, res) => {
  try {
    let {
      search = "",
      domain = "",
      rarity = "",
      minPrice,
      maxPrice,
      sortBy = "price",
      order = "asc",
      page = 1,
      limit = 48,
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    let listings = await store.getListings();

    // 1. Search
    if (search.trim()) {
      const q = search.toLowerCase();
      listings = listings.filter(
        (l) =>
          l.card &&
          (l.card.name.toLowerCase().includes(q) ||
            l.card.title.toLowerCase().includes(q) ||
            l.card.ability.toLowerCase().includes(q))
      );
    }

    // 2. Filter Domain
    if (domain) {
      listings = listings.filter(
        (l) => l.card && l.card.domain.toLowerCase() === domain.toLowerCase()
      );
    }

    // 3. Filter Rarity
    if (rarity) {
      listings = listings.filter(
        (l) => l.card && l.card.rarity.toLowerCase() === rarity.toLowerCase()
      );
    }

    // 4. Price range
    if (minPrice !== undefined) {
      listings = listings.filter((l) => l.pricePerItem >= parseFloat(minPrice));
    }
    if (maxPrice !== undefined) {
      listings = listings.filter((l) => l.pricePerItem <= parseFloat(maxPrice));
    }

    // 5. Sort
    listings.sort((a, b) => {
      let valA = sortBy === "price" ? a.pricePerItem : a.id;
      let valB = sortBy === "price" ? b.pricePerItem : b.id;
      return order === "desc" ? valB - valA : valA - valB;
    });

    const total = listings.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = listings.slice((page - 1) * limit, page * limit);

    return res.status(200).json({
      success: true,
      data: paginated,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ khi lấy danh sách niêm yết từ DB",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/v1/marketplace/listings/:id
 */
router.get("/listings/:id", async (req, res) => {
  try {
    const listing = await store.getListingById(req.params.id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy niêm yết #${req.params.id}`,
      });
    }
    return res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/v1/marketplace/sync-listing
 * @desc    Đồng bộ lệnh niêm yết mới và lưu vào SQLite Database
 */
router.post("/sync-listing", async (req, res) => {
  try {
    const { listingId, cardId, seller, quantity, pricePerItem } = req.body;
    if (!cardId || !seller || !quantity || !pricePerItem) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc (cardId, seller, quantity, pricePerItem)",
      });
    }

    const newListing = await store.addListing({
      listingId,
      cardId,
      seller,
      quantity,
      pricePerItem,
    });

    return res.status(201).json({
      success: true,
      message: "Đã lưu niêm yết vào SQLite Database thành công",
      data: newListing,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/v1/marketplace/sync-sale
 * @desc    Ghi nhận giao dịch mua thẻ và lưu vào SQLite Database
 */
router.post("/sync-sale", async (req, res) => {
  try {
    const { listingId, quantity, buyer } = req.body;
    if (!listingId || !quantity || !buyer) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc (listingId, quantity, buyer)",
      });
    }

    const listing = await store.getListingById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Niêm yết không tồn tại hoặc đã hết hàng",
      });
    }

    if (listing.seller && buyer && listing.seller.toLowerCase() === buyer.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: "Bạn không thể tự mua thẻ bài do chính mình đăng bán! Hãy bấm 'Hủy Niêm Yết' để nhận lại thẻ.",
      });
    }

    const result = await store.buyListing(listingId, quantity, buyer);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Niêm yết không tồn tại hoặc đã hết hàng",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Đã khớp lệnh & lưu giao dịch vào SQLite Database",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Lỗi xử lý giao dịch",
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/v1/marketplace/sync-cancel
 * @desc    Ghi nhận hủy niêm yết trong Database
 */
router.post("/sync-cancel", async (req, res) => {
  try {
    const { listingId, seller } = req.body;
    if (!listingId || !seller) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc (listingId, seller)",
      });
    }

    const success = await store.cancelListing(listingId, seller);
    return res.status(200).json({
      success,
      message: success ? "Đã hủy niêm yết thành công trong DB" : "Không tìm thấy niêm yết",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/v1/marketplace/stats
 * @desc    Thống kê tổng quan sàn giao dịch tính toán từ Database
 */
router.get("/stats", async (req, res) => {
  try {
    const activeListings = await store.getListings();
    const prices = activeListings.map((l) => l.pricePerItem);
    const floorPrice = prices.length ? Math.min(...prices) : 0;
    const highestPrice = prices.length ? Math.max(...prices) : 0;

    const txs = await store.getTransactions(100);
    const sales = txs.filter((t) => t.type === "SALE");
    const totalVolume = sales.reduce((acc, s) => acc + (s.total_price || 0), 2450);

    return res.status(200).json({
      success: true,
      data: {
        activeListingsCount: activeListings.length,
        floorPrice: floorPrice,
        highestPrice: highestPrice,
        totalVolumeRift: totalVolume,
        currency: "$RIFT",
        protocolFeeBps: 200,
        royaltyFeeBps: 250,
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
 * @route   GET /api/v1/marketplace/activities
 * @desc    Lấy toàn bộ lịch sử giao dịch từ bảng transactions trong SQLite (có hỗ trợ lọc theo user)
 */
router.get("/activities", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const user = req.query.user || req.query.address || null;
    const transactions = await store.getTransactions(limit, user);
    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
