const express = require("express");
const router = express.Router();
const { CARDS, ALL_SCRYDEX_CARDS } = require("../data/cards");
const store = require("../data/store");

/**
 * @route   GET /api/v1/cards
 * @desc    Tìm kiếm & lấy danh sách thẻ bài tuân thủ 100% chuẩn Scrydex Riftbound API:
 *          https://scrydex.com/docs/riftbound/cards#search-cards
 * @params  q, page, page_size, pageSize, per_page, limit, select, include, domain, rarity, type, orderBy, sortBy, order, scope
 */
router.get("/", (req, res) => {
  try {
    let {
      q = "",
      page = 1,
      page_size,
      pageSize,
      per_page,
      limit,
      select = "",
      include = "",
      domain = "",
      rarity = "",
      type = "",
      minCost,
      maxCost,
      orderBy,
      sortBy = "id",
      order = "asc",
      scope = "primary", // 'primary' (50 cards) | 'all' (394 cards)
    } = req.query;

    const actualPageSize = parseInt(page_size || pageSize || per_page || limit || 20);
    const currentPage = parseInt(page) || 1;

    // Use ALL_SCRYDEX_CARDS if requested or if search query targets entire set
    let sourcePool = scope === "all" ? ALL_SCRYDEX_CARDS : CARDS;
    let filtered = [...sourcePool];

    // 1. Phân tích tham số tìm kiếm `q` (Chuẩn Scrydex Advanced Filter Lucene-like)
    if (q && q.trim()) {
      // If user searches broadly, expand pool to ALL_SCRYDEX_CARDS so cards like Void Gate or champions are always found
      if (scope !== "primary_only") {
        filtered = [...ALL_SCRYDEX_CARDS];
      }

      // Regex to split by spaces, preserving quoted strings e.g. name:"Void Gate"
      const parts = q.trim().match(/(?:[^\s"]+|"[^"]*")+/g) || [];

      for (const rawPart of parts) {
        const part = rawPart.replace(/"/g, "");
        if (part.includes(":")) {
          const [fieldRaw, valRaw] = part.split(":");
          const isExact = fieldRaw.startsWith("!");
          const field = isExact ? fieldRaw.slice(1).toLowerCase() : fieldRaw.toLowerCase();
          const valLower = valRaw.toLowerCase();
          const isWildcard = valLower.endsWith("*");
          const prefix = isWildcard ? valLower.slice(0, -1) : valLower;

          if (field === "name") {
            filtered = filtered.filter((c) => {
              const cName = c.name.toLowerCase();
              if (isExact) return cName === valLower;
              if (isWildcard) return cName.startsWith(prefix);
              return cName.includes(valLower);
            });
          } else if (field === "domain") {
            filtered = filtered.filter(
              (c) =>
                c.domain.toLowerCase() === valLower ||
                (c.thematicDomain && c.thematicDomain.toLowerCase() === valLower)
            );
          } else if (field === "rarity") {
            filtered = filtered.filter((c) => c.rarity.toLowerCase() === valLower);
          } else if (field === "type") {
            filtered = filtered.filter((c) => c.type.toLowerCase() === valLower);
          } else if (field === "cost") {
            filtered = filtered.filter((c) => c.cost === parseInt(valRaw));
          } else if (field === "expansion.id" || field === "set") {
            filtered = filtered.filter(
              (c) =>
                (c.expansion && c.expansion.id.toLowerCase() === valLower) ||
                (c.expansion && c.expansion.code.toLowerCase() === valLower)
            );
          } else if (field === "scrydex_id" || field === "id") {
            filtered = filtered.filter(
              (c) =>
                (c.scrydex_id && c.scrydex_id.toLowerCase() === valLower) ||
                c.id.toString() === valRaw
            );
          }
        } else {
          // Free text search
          const searchVal = part.toLowerCase();
          filtered = filtered.filter(
            (c) =>
              c.name.toLowerCase().includes(searchVal) ||
              c.title.toLowerCase().includes(searchVal) ||
              (c.ability && c.ability.toLowerCase().includes(searchVal)) ||
              c.domain.toLowerCase().includes(searchVal) ||
              (c.scrydex_id && c.scrydex_id.toLowerCase().includes(searchVal)) ||
              (c.artist && c.artist.toLowerCase().includes(searchVal)) ||
              c.rarity.toLowerCase().includes(searchVal)
          );
        }
      }
    }

    // 2. Lọc theo Domain trực tiếp
    if (domain) {
      filtered = filtered.filter(
        (c) =>
          c.domain.toLowerCase() === domain.toLowerCase() ||
          (c.thematicDomain && c.thematicDomain.toLowerCase() === domain.toLowerCase())
      );
    }

    // 3. Lọc theo Rarity trực tiếp
    if (rarity) {
      filtered = filtered.filter(
        (c) => c.rarity.toLowerCase() === rarity.toLowerCase()
      );
    }

    // 4. Lọc theo Type
    if (type) {
      filtered = filtered.filter(
        (c) => c.type.toLowerCase() === type.toLowerCase()
      );
    }

    // 5. Lọc theo Mana Cost
    if (minCost !== undefined) {
      filtered = filtered.filter((c) => c.cost >= parseInt(minCost));
    }
    if (maxCost !== undefined) {
      filtered = filtered.filter((c) => c.cost <= parseInt(maxCost));
    }

    // 6. Sắp xếp (Sorting - Hỗ trợ cả orderBy theo chuẩn Scrydex và sortBy)
    const sortField = orderBy || sortBy || "id";
    filtered.sort((a, b) => {
      let valA = a[sortField] !== undefined ? a[sortField] : a.id;
      let valB = b[sortField] !== undefined ? b[sortField] : b.id;

      if (typeof valA === "string") {
        return order === "desc"
          ? valB.localeCompare(valA)
          : valA.localeCompare(valB);
      }
      return order === "desc" ? valB - valA : valA - valB;
    });

    // 7. Phân trang Scrydex
    const total = filtered.length;
    const totalPages = Math.ceil(total / actualPageSize) || 1;
    const startIndex = (currentPage - 1) * actualPageSize;
    let paginated = filtered.slice(startIndex, startIndex + actualPageSize);

    // 8. Hỗ trợ phép chiếu trường `select` (Ví dụ: ?select=id,name,images,market)
    if (select.trim()) {
      const fields = select.split(",").map((f) => f.trim());
      paginated = paginated.map((card) => {
        const selected = {};
        for (const f of fields) {
          if (card[f] !== undefined) selected[f] = card[f];
        }
        return selected;
      });
    }

    // Trả về cấu trúc kết hợp cả chuẩn Scrydex ('status': 'success', 'page', 'pageSize', 'totalCount')
    // và chuẩn REST của dự án ('success': true, 'data', 'pagination')
    return res.status(200).json({
      status: "success",
      success: true,
      data: paginated,
      page: currentPage,
      pageSize: actualPageSize,
      totalCount: total,
      pagination: {
        page: currentPage,
        per_page: actualPageSize,
        total: total,
        total_pages: totalPages,
        has_next: currentPage < totalPages,
        has_prev: currentPage > 1,
      },
      meta: {
        total,
        page: currentPage,
        limit: actualPageSize,
        totalPages,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      success: false,
      message: "Lỗi máy chủ khi lấy danh sách thẻ bài Scrydex",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/v1/cards/expansions/:code
 * @desc    Lấy toàn bộ thẻ bài theo mã mở rộng chuẩn Scrydex (Ví dụ: OGN - Origins)
 */
router.get("/expansions/:code", (req, res) => {
  const code = req.params.code.toUpperCase();
  const matched = ALL_SCRYDEX_CARDS.filter(
    (c) => c.expansion && (c.expansion.id === code || c.expansion.code === code)
  );

  return res.status(200).json({
    status: "success",
    success: true,
    expansion: code,
    totalCount: matched.length,
    data: matched,
  });
});

/**
 * @route   GET /api/v1/cards/:identifier/market
 * @desc    Lấy dữ liệu chi tiết thị trường, danh sách niêm yết & lịch sử giá (chuẩn Bilgewater Market)
 */
router.get("/:identifier/market", async (req, res) => {
  try {
    const idParam = req.params.identifier.toLowerCase();

    const card = ALL_SCRYDEX_CARDS.find((c) => {
      return (
        c.id.toString() === idParam ||
        (c.scrydex_id && c.scrydex_id.toLowerCase() === idParam) ||
        (c.public_code && c.public_code.toLowerCase() === idParam) ||
        c.name.toLowerCase() === idParam
      );
    });

    if (!card) {
      return res.status(404).json({
        status: "error",
        success: false,
        message: `Không tìm thấy thẻ bài với định danh '${req.params.identifier}'`,
      });
    }

    // Lấy các lệnh niêm yết hiện tại từ SQLite DB
    const activeListings = await store.getListingsByCardId(card.id);

    // Lấy lịch sử giao dịch liên quan đến thẻ này từ SQLite DB
    const recentSales = await store.getTransactionsByCardId(card.id, 10);

    // Tính toán Floor Price
    const floorPrice = activeListings.length > 0 
      ? Math.min(...activeListings.map(l => l.pricePerItem))
      : card.marketFloorPrice;

    // Chuẩn bị các biến thể (Variations: Normal, Foil, Signature)
    const variations = [
      {
        id: "normal",
        name: "Normal Print",
        type: "Standard",
        floorPrice: floorPrice,
        usdPrice: Number((floorPrice * 0.15).toFixed(2)),
        isAvailable: true,
      },
      {
        id: "foil",
        name: "Holographic Foil",
        type: "Foil",
        floorPrice: Math.round(floorPrice * 1.8),
        usdPrice: Number((floorPrice * 1.8 * 0.15).toFixed(2)),
        isAvailable: card.foilAvailable,
      },
      {
        id: "signature",
        name: "Artist Signature Edition",
        type: "Signature / Showcase",
        floorPrice: Math.round(floorPrice * 3.5),
        usdPrice: Number((floorPrice * 3.5 * 0.15).toFixed(2)),
        isAvailable: card.rarity === "Mythic" || card.rarity === "Legendary",
      },
    ];

    return res.status(200).json({
      status: "success",
      success: true,
      data: {
        card,
        floorPrice,
        activeListings,
        recentSales,
        variations,
        marketStats: {
          totalMinted: card.totalMinted,
          activeListingsCount: activeListings.length,
          totalVolume: recentSales.reduce((acc, s) => acc + (s.total_price || 0), 0),
          lastSalePrice: recentSales[0] ? recentSales[0].price : floorPrice,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      success: false,
      message: "Lỗi đọc dữ liệu thị trường thẻ bài",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/v1/cards/:identifier
 * @desc    Lấy chi tiết 1 lá bài theo ID số (1, 2, ...) hoặc Scrydex ID (OGN-296, ogn-296-298, ...)
 */
router.get("/:identifier", (req, res) => {
  const idParam = req.params.identifier.toLowerCase();

  // Search across ALL_SCRYDEX_CARDS to ensure all cards can be viewed
  const card = ALL_SCRYDEX_CARDS.find((c) => {
    return (
      c.id.toString() === idParam ||
      (c.scrydex_id && c.scrydex_id.toLowerCase() === idParam) ||
      (c.public_code && c.public_code.toLowerCase() === idParam) ||
      c.name.toLowerCase() === idParam
    );
  });

  if (!card) {
    return res.status(404).json({
      status: "error",
      success: false,
      message: `Không tìm thấy thẻ bài với định danh '${req.params.identifier}'`,
    });
  }

  return res.status(200).json({
    status: "success",
    success: true,
    data: card,
  });
});

/**
 * @route   GET /api/v1/cards/metadata/:file
 * @desc    Chuẩn Metadata ERC-1155 OpenSea phục vụ ví Web3 hiển thị ảnh và thuộc tính
 */
router.get("/metadata/:file", (req, res) => {
  const file = req.params.file;
  const id = parseInt(file.replace(".json", ""));
  const card = CARDS.find((c) => c.id === id) || ALL_SCRYDEX_CARDS.find((c) => c.id === id);

  if (!card) {
    return res.status(404).json({
      name: "Unknown Card",
      description: "Card not found in Riftbound Codex",
      image: "https://via.placeholder.com/600x800?text=Card+Not+Found",
      attributes: [],
    });
  }

  return res.status(200).json({
    name: `${card.name} - ${card.title}`,
    description: `${card.lore}\n\nAbility: ${card.ability}`,
    image: card.image,
    external_url: `http://localhost:5174/card/${card.id}`,
    scrydex_id: card.scrydex_id,
    attributes: [
      { trait_type: "Public Code", value: card.public_code },
      { trait_type: "Printed Number", value: card.printed_number },
      { trait_type: "Domain", value: card.domain },
      { trait_type: "Rarity", value: card.rarity },
      { trait_type: "Type", value: card.type },
      { trait_type: "Cost (Energy)", value: card.cost },
      { trait_type: "Power (ATK)", value: card.power },
      { trait_type: "Might (DEF)", value: card.might },
      { trait_type: "Expansion", value: card.expansion.name },
      { trait_type: "Artist", value: card.artist },
      { trait_type: "Foil Available", value: card.foilAvailable ? "Yes" : "No" },
    ],
  });
});

module.exports = router;
