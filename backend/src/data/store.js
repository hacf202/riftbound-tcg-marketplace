const { CARDS } = require("./cards");
const { run, get, all, initDatabase } = require("../db/database");

// 12 Diverse Thematic Booster Packs (Mở rộng từ 6 lên 12 gói theo yêu cầu)
// 100% Sử dụng hình ảnh chính thức từ kho API Riot Games / Scrydex
const PACKS = [
  {
    id: 1,
    name: "Tập Sự Vết Nứt",
    subtitle: "Novice Rift Pack",
    description: "Gói tân thủ khám phá không gian vết nứt. Chứa 3 lá bài phổ biến, cơ hội mở được các thẻ Rare hỗ trợ.",
    price: 50,
    cardCount: 3,
    tier: "Tân Thủ",
    domainFocus: "Đa Tộc",
    color: "#64748b",
    glowColor: "rgba(148, 163, 184, 0.4)",
    dropRates: [
      { rarity: "Common", rate: "75%" },
      { rarity: "Rare", rate: "25%" },
      { rarity: "Epic", rate: "0%" },
      { rarity: "Mythic", rate: "0%" },
    ],
    image: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/8231ced23eaf22ca3bf62ec8cb86b83a3e222da6-744x1039.png",
    popular: false,
  },
  {
    id: 2,
    name: "Tiếng Vọng Tinh Tú",
    subtitle: "Astral Echoes Pack",
    description: "Hào quang của các chòm sao hộ thể. Chứa 4 lá bài chuyên về Phép Thuật, Khiên Bảo Vệ và Hồi Máu.",
    price: 150,
    cardCount: 4,
    tier: "Phép Thuật",
    domainFocus: "Calm",
    color: "#06b6d4",
    glowColor: "rgba(6, 182, 212, 0.4)",
    dropRates: [
      { rarity: "Common", rate: "50%" },
      { rarity: "Rare", rate: "35%" },
      { rarity: "Epic", rate: "12%" },
      { rarity: "Mythic", rate: "3%" },
    ],
    image: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/822b8bc7987a47498550708b18ef166b121fd620-744x1039.png",
    popular: false,
  },
  {
    id: 3,
    name: "Hỏa Ngục Rực Cháy",
    subtitle: "Infernal Pyre Pack",
    description: "Sức mạnh thiêu đốt từ lò rèn nham thạch. Chứa 4 lá bài chuyên về Sát Thương Công Kích cực đại (High ATK).",
    price: 200,
    cardCount: 4,
    tier: "Chiến Tranh",
    domainFocus: "Fury",
    color: "#ef4444",
    glowColor: "rgba(239, 68, 68, 0.4)",
    dropRates: [
      { rarity: "Common", rate: "40%" },
      { rarity: "Rare", rate: "40%" },
      { rarity: "Epic", rate: "15%" },
      { rarity: "Mythic", rate: "5%" },
    ],
    image: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/532d75dc36a16eb5954253a77366fcceac7aec62-744x1039.png",
    popular: false,
  },
  {
    id: 4,
    name: "Bí Mật Vực Sâu",
    subtitle: "Abyssal Depths Pack",
    description: "Kho báu nguyền rủa từ rãnh biển Bilgewater. Chứa 5 lá bài hải tặc, quái vật biển và hiệu ứng cướp bóc.",
    price: 300,
    cardCount: 5,
    tier: "Thần Bí",
    domainFocus: "Body",
    color: "#10b981",
    glowColor: "rgba(168, 185, 129, 0.4)",
    dropRates: [
      { rarity: "Common", rate: "35%" },
      { rarity: "Rare", rate: "35%" },
      { rarity: "Epic", rate: "22%" },
      { rarity: "Mythic", rate: "8%" },
    ],
    image: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/ab71d92c94bf609e2fa6efc8fec06fe1e8b10108-744x1039.png",
    popular: true,
  },
  {
    id: 5,
    name: "Bá Chủ Hư Không",
    subtitle: "Void Sovereign Pack",
    description: "Sức mạnh bẻ gãy không gian chiều thứ tư. Chứa 5 lá bài hắc ám với tỷ lệ thẻ Legendary cao vượt trội.",
    price: 500,
    cardCount: 5,
    tier: "Huyền Thoại",
    domainFocus: "Colorless",
    color: "#a855f7",
    glowColor: "rgba(168, 85, 247, 0.5)",
    dropRates: [
      { rarity: "Common", rate: "20%" },
      { rarity: "Rare", rate: "35%" },
      { rarity: "Epic", rate: "30%" },
      { rarity: "Mythic", rate: "15%" },
    ],
    image: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/14a52a367fd41fd84745e050e62d1f281f733467-1038x744.png",
    popular: true,
  },
  {
    id: 6,
    name: "Thần Khí Tối Thượng",
    subtitle: "Godpack of the Ancients",
    description: "Gói bài Hoàng Gia Cực Hiếm: Cam kết 100% các lá bài từ cấp Sử Thi (Epic) trở lên, cơ hội trúng Thần Khí Mythic cực cao!",
    price: 1000,
    cardCount: 6,
    tier: "Hoàng Gia",
    domainFocus: "Toàn Năng (All-Stars)",
    color: "#fbbf24",
    glowColor: "rgba(251, 191, 36, 0.6)",
    dropRates: [
      { rarity: "Common", rate: "0%" },
      { rarity: "Rare", rate: "0%" },
      { rarity: "Epic", rate: "50%" },
      { rarity: "Mythic", rate: "50%" },
    ],
    image: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/ae8e68af43400f61f7391c0a6ee339fd718a7540-1488x2078.png",
    popular: true,
  },
  // GÓI MỚI THÊM (PACKS 7 - 12)
  {
    id: 7,
    name: "Cuồng Nộ Hỏa Long",
    subtitle: "Fury Dragonfire Booster",
    description: "Được tôi luyện từ lửa rồng cuồng bạo. Chứa 4 lá bài chuyên hệ Fury với khả năng xuyên giáp và hủy diệt bàn đấu.",
    price: 220,
    cardCount: 4,
    tier: "Chiến Trận",
    domainFocus: "Fury",
    color: "#f97316",
    glowColor: "rgba(249, 115, 22, 0.4)",
    dropRates: [
      { rarity: "Common", rate: "40%" },
      { rarity: "Rare", rate: "40%" },
      { rarity: "Epic", rate: "15%" },
      { rarity: "Mythic", rate: "5%" },
    ],
    image: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/9019c449004f246de6607bf1829f4f3cabcda200-744x1039.png",
    popular: false,
  },
  {
    id: 8,
    name: "Tâm Trí Bí Thuật",
    subtitle: "Mind Arcane Academy",
    description: "Bí mật tri thức từ học viện pháp thuật tối cao. Chứa 4 lá bài hệ Mind với khả năng bốc thêm bài và kiểm soát năng lượng.",
    price: 260,
    cardCount: 4,
    tier: "Học Giả",
    domainFocus: "Mind",
    color: "#3b82f6",
    glowColor: "rgba(59, 130, 246, 0.4)",
    dropRates: [
      { rarity: "Common", rate: "35%" },
      { rarity: "Rare", rate: "45%" },
      { rarity: "Epic", rate: "15%" },
      { rarity: "Mythic", rate: "5%" },
    ],
    image: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/913236dabf1e4f71650bbba46870fff8163e2eff-744x1039.png",
    popular: false,
  },
  {
    id: 9,
    name: "Hoa Linh Lục Địa",
    subtitle: "Calm Spirit Blossom",
    description: "Vũ điệu của những linh hồn thanh tịnh tại Ionia. Chứa 4 lá bài hệ Calm đem lại khả năng phản đòn và né tránh tuyệt đỉnh.",
    price: 280,
    cardCount: 4,
    tier: "Tâm Linh",
    domainFocus: "Calm",
    color: "#ec4899",
    glowColor: "rgba(236, 72, 153, 0.4)",
    dropRates: [
      { rarity: "Common", rate: "30%" },
      { rarity: "Rare", rate: "45%" },
      { rarity: "Epic", rate: "18%" },
      { rarity: "Mythic", rate: "7%" },
    ],
    image: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/dc89c6a2415debd5bf504ed46843f5dcc1d9b815-1488x2078.png",
    popular: false,
  },
  {
    id: 10,
    name: "Tiên Phong Demacia",
    subtitle: "Demacia Vanguard Cache",
    description: "Giáp kháng ma thuật và ý chí bất khuất. Chứa 5 lá bài hệ Body với chỉ số Phòng Thủ (DEF) và lượng Máu cực khủng.",
    price: 350,
    cardCount: 5,
    tier: "Thiết Giáp",
    domainFocus: "Body",
    color: "#eab308",
    glowColor: "rgba(234, 179, 8, 0.4)",
    dropRates: [
      { rarity: "Common", rate: "30%" },
      { rarity: "Rare", rate: "40%" },
      { rarity: "Epic", rate: "20%" },
      { rarity: "Mythic", rate: "10%" },
    ],
    image: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/cbf2c12d69a86566e4cda07050b2d4495e40187e-744x1039.png",
    popular: true,
  },
  {
    id: 11,
    name: "Hải Trình Bilgewater",
    subtitle: "Bilgewater Buccaneer Stash",
    description: "Rương vàng vớt lên từ đáy biển sâu Bilgewater Market. Cơ hội cực cao trúng thẻ tướng hải tặc và thẻ lấp lánh (Foil).",
    price: 450,
    cardCount: 5,
    tier: "Hải Tặc",
    domainFocus: "Body",
    color: "#14b8a6",
    glowColor: "rgba(20, 184, 166, 0.4)",
    dropRates: [
      { rarity: "Common", rate: "25%" },
      { rarity: "Rare", rate: "40%" },
      { rarity: "Epic", rate: "25%" },
      { rarity: "Mythic", rate: "10%" },
    ],
    image: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/8a7dbbed04133926e58843f1d586f51178ef2ebd-1488x2078.png",
    popular: true,
  },
  {
    id: 12,
    name: "Bản Giao Hưởng Origins",
    subtitle: "Origins Collector Edition",
    description: "Bộ sưu tập tối thượng 7 lá bài cao cấp nhất từ set Origins OGN. Đảm bảo 100% trúng tối thiểu 2 thẻ Epic và 1 thẻ Mythic Showcase!",
    price: 850,
    cardCount: 7,
    tier: "Collector",
    domainFocus: "Toàn Năng (All-Stars)",
    color: "#8b5cf6",
    glowColor: "rgba(139, 92, 246, 0.6)",
    dropRates: [
      { rarity: "Common", rate: "10%" },
      { rarity: "Rare", rate: "25%" },
      { rarity: "Epic", rate: "40%" },
      { rarity: "Mythic", rate: "25%" },
    ],
    image: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/34aa11c88735be28266dbc61486a557454fd6b4c-1488x2078.png",
    popular: true,
  },
];

// Helper: Pick card matching rarity & domain
function pickCard(rarity, domainFocus) {
  let pool = CARDS.filter((c) => c.rarity === rarity);
  if (domainFocus && domainFocus !== "Đa Tộc" && domainFocus !== "Toàn Năng (All-Stars)") {
    const domainName = domainFocus.toLowerCase();
    const domainPool = pool.filter(
      (c) =>
        c.domain.toLowerCase() === domainName ||
        (c.thematicDomain && c.thematicDomain.toLowerCase() === domainName)
    );
    if (domainPool.length > 0) pool = domainPool;
  }
  if (pool.length === 0) pool = CARDS.filter((c) => c.rarity === rarity);
  if (pool.length === 0) pool = CARDS;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Seed initial database records: 36+ diverse active listings across the 200 cards!
 */
const seedDatabase = async () => {
  await initDatabase();

  const countRow = await get("SELECT COUNT(*) as count FROM listings WHERE is_active = 1");
  if (!countRow || countRow.count < 20) {
    console.log("🌱 Đang làm đầy sàn giao dịch (Marketplace) với 36+ thẻ bài phong phú...");

    // Xóa các listings cũ nếu ít để nạp bộ 36 listings sống động
    await run(`DELETE FROM listings`);

    const demoSellers = [
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", // Deployer
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Trader Bilgewater
      "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", // Merchant Noxus
      "0x90F79bf6EB2c4f870365E785982E1f101E93b906", // Collector Ionia
      "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", // Whale Piltover
      "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc", // Shadow Isles Vault
    ];

    // Tạo 36 lệnh niêm yết phủ rộng khắp các hệ và độ hiếm từ kho 200 lá bài
    const sampleCardsForListing = [
      { card_id: 1, qty: 8, price: 25 },   // Void Gate
      { card_id: 2, qty: 3, price: 65 },   // Dark Child Annie
      { card_id: 3, qty: 4, price: 70 },   // Wuju Bladesman Master Yi
      { card_id: 4, qty: 2, price: 60 },   // Lady of Luminosity Lux
      { card_id: 5, qty: 5, price: 75 },   // Might of Demacia Garen
      { card_id: 6, qty: 2, price: 90 },   // Glorious Executioner Draven
      { card_id: 7, qty: 3, price: 85 },   // Blade Dancer Irelia
      { card_id: 8, qty: 2, price: 110 },  // Emperor of the Sands Azir
      { card_id: 9, qty: 4, price: 95 },   // Chem-Baroness Renata Glasc
      { card_id: 10, qty: 3, price: 80 },  // Battle Mistress Sivir
      { card_id: 11, qty: 1, price: 550 }, // Daughter of the Void Kai'Sa
      { card_id: 12, qty: 2, price: 520 }, // Loose Cannon Jinx
      { card_id: 13, qty: 1, price: 480 }, // The Boss Sett
      { card_id: 14, qty: 1, price: 1200 },// Mythic Showcase
      { card_id: 16, qty: 4, price: 30 },
      { card_id: 18, qty: 5, price: 20 },
      { card_id: 22, qty: 3, price: 150 },
      { card_id: 25, qty: 4, price: 40 },
      { card_id: 28, qty: 2, price: 180 },
      { card_id: 32, qty: 6, price: 15 },
      { card_id: 36, qty: 3, price: 220 },
      { card_id: 42, qty: 2, price: 310 },
      { card_id: 48, qty: 1, price: 650 },
      { card_id: 55, qty: 4, price: 55 },
      { card_id: 64, qty: 3, price: 75 },
      { card_id: 72, qty: 5, price: 35 },
      { card_id: 88, qty: 2, price: 190 },
      { card_id: 96, qty: 1, price: 850 },
      { card_id: 105, qty: 3, price: 45 },
      { card_id: 118, qty: 2, price: 240 },
      { card_id: 132, qty: 4, price: 60 },
      { card_id: 145, qty: 1, price: 950 },
      { card_id: 158, qty: 5, price: 25 },
      { card_id: 174, qty: 2, price: 320 },
      { card_id: 188, qty: 3, price: 140 },
      { card_id: 200, qty: 1, price: 1100 },
    ];

    let listingIdCounter = 1;
    for (const item of sampleCardsForListing) {
      const seller = demoSellers[listingIdCounter % demoSellers.length];
      const card = CARDS.find((c) => c.id === item.card_id) || CARDS[0];

      await run(
        `INSERT INTO listings (listing_id, card_id, seller, quantity, price_per_item, is_active)
         VALUES (?, ?, ?, ?, ?, 1)`,
        [listingIdCounter, item.card_id, seller, item.qty, item.price]
      );

      await run(
        `INSERT INTO transactions (type, user_address, seller_address, card_id, card_name, quantity, price, total_price, details)
         VALUES ('LISTING', ?, ?, ?, ?, ?, ?, ?, 'Niêm yết bán thẻ ban đầu')`,
        [seller, seller, item.card_id, card.name, item.qty, item.price, item.price * item.qty]
      );

      listingIdCounter++;
    }

    // Seed Deployer Demo Inventory & Balance
    const deployer = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
    await run(`INSERT OR REPLACE INTO user_balances (address, balance) VALUES (?, 1000000)`, [deployer]);

    const demoCards = [
      { card_id: 1, quantity: 5 },
      { card_id: 2, quantity: 3 },
      { card_id: 3, quantity: 2 },
      { card_id: 4, quantity: 4 },
      { card_id: 5, quantity: 3 },
      { card_id: 6, quantity: 2 },
      { card_id: 7, quantity: 2 },
      { card_id: 8, quantity: 1 },
      { card_id: 9, quantity: 2 },
      { card_id: 10, quantity: 3 },
      { card_id: 11, quantity: 1 },
      { card_id: 12, quantity: 1 },
      { card_id: 13, quantity: 2 },
    ];
    for (const dc of demoCards) {
      await run(
        `INSERT OR REPLACE INTO user_inventory (address, card_id, quantity) VALUES (?, ?, ?)`,
        [deployer, dc.card_id, dc.quantity]
      );
    }

    console.log(`✅ Đã nạp thành công ${sampleCardsForListing.length} lệnh niêm yết mới vào SQLite Database!`);
  }
};

// Auto seed on import
seedDatabase().catch((e) => console.error("Lỗi seedDatabase:", e));

module.exports = {
  // 1. Quản lý Listings từ DB
  getListings: async () => {
    const rows = await all(`SELECT * FROM listings WHERE is_active = 1 ORDER BY id DESC`);
    return rows.map((r) => ({
      id: r.id,
      listingId: r.listing_id,
      cardId: r.card_id,
      card: CARDS.find((c) => c.id === r.card_id),
      seller: r.seller,
      quantity: r.quantity,
      pricePerItem: r.price_per_item,
      isActive: r.is_active === 1,
      createdAt: r.created_at,
    }));
  },

  getListingById: async (id) => {
    const r = await get(`SELECT * FROM listings WHERE id = ? OR listing_id = ?`, [Number(id), Number(id)]);
    if (!r) return null;
    return {
      id: r.id,
      listingId: r.listing_id,
      cardId: r.card_id,
      card: CARDS.find((c) => c.id === r.card_id),
      seller: r.seller,
      quantity: r.quantity,
      pricePerItem: r.price_per_item,
      isActive: r.is_active === 1,
      createdAt: r.created_at,
    };
  },

  getListingsByCardId: async (cardId) => {
    const rows = await all(`SELECT * FROM listings WHERE card_id = ? AND is_active = 1 ORDER BY price_per_item ASC`, [Number(cardId)]);
    return rows.map((r) => ({
      id: r.id,
      listingId: r.listing_id,
      cardId: r.card_id,
      seller: r.seller,
      quantity: r.quantity,
      pricePerItem: r.price_per_item,
      isActive: r.is_active === 1,
      createdAt: r.created_at,
    }));
  },

  addListing: async (listingData) => {
    const cardId = Number(listingData.cardId);
    const qty = Number(listingData.quantity);
    const pricePerItem = Number(listingData.pricePerItem);
    const seller = (listingData.seller || "").toLowerCase();
    const listingId = Number(listingData.listingId) || Date.now() % 100000;
    const card = CARDS.find((c) => c.id === cardId);

    // Lưu vào bảng listings
    const res = await run(
      `INSERT INTO listings (listing_id, card_id, seller, quantity, price_per_item, is_active) VALUES (?, ?, ?, ?, ?, 1)`,
      [listingId, cardId, seller, qty, pricePerItem]
    );

    // Trừ số lượng trong kho thẻ người bán
    await run(
      `UPDATE user_inventory SET quantity = MAX(0, quantity - ?) WHERE address = ? AND card_id = ?`,
      [qty, seller, cardId]
    );

    // Ghi nhận lịch sử giao dịch vào bảng transactions
    await run(
      `INSERT INTO transactions (type, user_address, seller_address, card_id, card_name, quantity, price, total_price, details)
       VALUES ('LISTING', ?, ?, ?, ?, ?, ?, ?, 'Niêm yết thẻ lên sàn giao dịch')`,
      [seller, seller, cardId, card ? card.name : "Card", qty, pricePerItem, pricePerItem * qty]
    );

    return {
      id: res.lastID,
      listingId,
      cardId,
      card,
      seller,
      quantity: qty,
      pricePerItem,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
  },

  buyListing: async (listingId, quantity, buyer) => {
    let l = await get(`SELECT * FROM listings WHERE id = ? AND is_active = 1`, [Number(listingId)]);
    if (!l) {
      l = await get(`SELECT * FROM listings WHERE listing_id = ? AND is_active = 1`, [Number(listingId)]);
    }
    if (!l) return null;

    const buyerLower = (buyer || "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266").toLowerCase();
    const sellerLower = (l.seller || "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266").toLowerCase();

    // CHỐNG TỰ MUA BÁN THẺ CỦA CHÍNH MÌNH (WASH TRADING PREVENTION)
    if (buyerLower === sellerLower) {
      throw new Error("Bạn không thể tự mua thẻ bài do chính mình đăng bán! Hãy bấm 'Hủy Niêm Yết' để nhận lại thẻ.");
    }

    const boughtQty = Math.min(Number(quantity), l.quantity);
    const newQty = l.quantity - boughtQty;
    const isActive = newQty > 0 ? 1 : 0;

    // Cập nhật listing
    await run(`UPDATE listings SET quantity = ?, is_active = ? WHERE id = ?`, [newQty, isActive, l.id]);
    const totalPrice = l.price_per_item * boughtQty;
    const protocolFee = totalPrice * 0.02;
    const royaltyFee = totalPrice * 0.025;
    const sellerPayout = totalPrice - protocolFee - royaltyFee;

    // Trừ tiền buyer, cộng tiền seller
    await run(`UPDATE user_balances SET balance = MAX(0, balance - ?) WHERE LOWER(address) = LOWER(?)`, [totalPrice, buyerLower]);
    await run(`UPDATE user_balances SET balance = balance + ? WHERE LOWER(address) = LOWER(?)`, [sellerPayout, sellerLower]);

    // Thêm thẻ vào túi đồ buyer
    const existingInv = await get(`SELECT quantity FROM user_inventory WHERE LOWER(address) = LOWER(?) AND card_id = ?`, [buyerLower, l.card_id]);
    if (existingInv) {
      await run(`UPDATE user_inventory SET quantity = quantity + ?, updated_at = CURRENT_TIMESTAMP WHERE LOWER(address) = LOWER(?) AND card_id = ?`, [boughtQty, buyerLower, l.card_id]);
    } else {
      await run(`INSERT INTO user_inventory (address, card_id, quantity, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`, [buyerLower, l.card_id, boughtQty]);
    }

    const card = CARDS.find((c) => Number(c.id) === Number(l.card_id));

    // Ghi nhận giao dịch vào bảng transactions trong SQLite
    await run(
      `INSERT INTO transactions (type, user_address, seller_address, card_id, card_name, quantity, price, total_price, protocol_fee, royalty_fee, seller_payout, details)
       VALUES ('SALE', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Khớp lệnh mua thẻ bài')`,
      [buyerLower, sellerLower, l.card_id, card ? card.name : "Card", boughtQty, l.price_per_item, totalPrice, protocolFee, royaltyFee, sellerPayout]
    );

    return {
      listing: { ...l, quantity: newQty, isActive: isActive === 1 },
      boughtQty,
      totalPrice,
      protocolFee,
      royaltyFee,
      sellerPayout,
    };
  },

  cancelListing: async (listingId, seller) => {
    let l = await get(`SELECT * FROM listings WHERE id = ? AND is_active = 1`, [Number(listingId)]);
    if (!l) {
      l = await get(`SELECT * FROM listings WHERE listing_id = ? AND is_active = 1`, [Number(listingId)]);
    }
    if (!l) return false;

    await run(`UPDATE listings SET is_active = 0 WHERE id = ?`, [l.id]);

    const sellerLower = (seller || l.seller || "").toLowerCase();

    // Hoàn trả thẻ vào túi đồ seller
    const existing = await get(`SELECT quantity FROM user_inventory WHERE address = ? AND card_id = ?`, [sellerLower, l.card_id]);
    if (existing) {
      await run(`UPDATE user_inventory SET quantity = quantity + ? WHERE address = ? AND card_id = ?`, [l.quantity, sellerLower, l.card_id]);
    } else {
      await run(`INSERT INTO user_inventory (address, card_id, quantity) VALUES (?, ?, ?)`, [sellerLower, l.card_id, l.quantity]);
    }

    const card = CARDS.find((c) => c.id === l.card_id);

    await run(
      `INSERT INTO transactions (type, user_address, seller_address, card_id, card_name, quantity, details)
       VALUES ('CANCEL', ?, ?, ?, ?, ?, 'Hủy niêm yết thẻ bài')`,
      [sellerLower, sellerLower, l.card_id, card ? card.name : "Card", l.quantity]
    );

    return true;
  },

  // 2. Quản lý Kho Thẻ Bài User từ DB
  getUserInventory: async (address) => {
    const addr = (address || "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266").toLowerCase();
    let rows = await all(`SELECT card_id, quantity, updated_at FROM user_inventory WHERE LOWER(address) = LOWER(?) AND quantity > 0 ORDER BY updated_at DESC, id DESC`, [addr]);
    
    // Nếu ví mới chưa có thẻ nào -> cấp bộ khởi đầu 6 lá bài
    if (rows.length === 0) {
      const defaultStarter = [
        { card_id: 1, quantity: 2 },
        { card_id: 2, quantity: 1 },
        { card_id: 3, quantity: 2 },
        { card_id: 4, quantity: 1 },
        { card_id: 5, quantity: 2 },
        { card_id: 6, quantity: 1 },
      ];
      for (const d of defaultStarter) {
        await run(`INSERT OR REPLACE INTO user_inventory (address, card_id, quantity, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`, [addr, d.card_id, d.quantity]);
      }
      rows = await all(`SELECT card_id, quantity, updated_at FROM user_inventory WHERE LOWER(address) = LOWER(?) AND quantity > 0 ORDER BY updated_at DESC, id DESC`, [addr]);
    }

    return rows.map((r) => ({
      cardId: r.card_id,
      quantity: r.quantity,
      updatedAt: r.updated_at,
      card: CARDS.find((c) => Number(c.id) === Number(r.card_id)),
    }));
  },

  // 3. Quản lý Số Dư User từ DB
  getUserBalance: async (address) => {
    const addr = (address || "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266").toLowerCase();
    const row = await get(`SELECT balance FROM user_balances WHERE LOWER(address) = LOWER(?)`, [addr]);
    if (!row) {
      await run(`INSERT INTO user_balances (address, balance) VALUES (?, 1000)`, [addr]);
      return 1000;
    }
    return row.balance;
  },

  claimFaucet: async (address) => {
    const addr = (address || "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266").toLowerCase();
    const row = await get(`SELECT balance FROM user_balances WHERE LOWER(address) = LOWER(?)`, [addr]);
    const currentBal = row ? row.balance : 1000;
    const newBal = currentBal + 1000;

    await run(`INSERT OR REPLACE INTO user_balances (address, balance) VALUES (?, ?)`, [addr, newBal]);

    await run(
      `INSERT INTO transactions (type, user_address, price, total_price, details)
       VALUES ('FAUCET', ?, 1000, 1000, 'Nhận 1,000 $RIFT từ Faucet')`,
      [addr]
    );

    return newBal;
  },

  depositEthForRift: async (address, ethAmount, riftAmount, txHash) => {
    const addr = (address || "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266").toLowerCase();
    const row = await get(`SELECT balance FROM user_balances WHERE LOWER(address) = LOWER(?)`, [addr]);
    const currentBal = row ? row.balance : 0;
    const newBal = currentBal + Number(riftAmount);

    await run(`INSERT OR REPLACE INTO user_balances (address, balance) VALUES (?, ?)`, [addr, newBal]);

    await run(
      `INSERT INTO transactions (type, user_address, price, total_price, details)
       VALUES ('EXCHANGE', ?, ?, ?, ?)`,
      [
        addr,
        Number(ethAmount),
        Number(riftAmount),
        `Quy đổi ${ethAmount} ETH sang ${Number(riftAmount).toLocaleString()} $RIFT (Tx: ${txHash ? txHash.slice(0, 10) + '...' : 'EVM Localhost'})`
      ]
    );

    return newBal;
  },

  deductBalance: async (address, amount) => {
    const addr = (address || "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266").toLowerCase();
    await run(`UPDATE user_balances SET balance = MAX(0, balance - ?) WHERE LOWER(address) = LOWER(?)`, [amount, addr]);
    const row = await get(`SELECT balance FROM user_balances WHERE LOWER(address) = LOWER(?)`, [addr]);
    return row ? row.balance : 0;
  },

  // 4. Lưu phần thưởng mở gói vào DB
  recordPackOpening: async (address, packId, cardIds, price) => {
    const addr = (address || "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266").toLowerCase();
    const pack = PACKS.find((p) => p.id === Number(packId)) || PACKS[0];

    // Trừ tiền
    if (price > 0) {
      await run(`UPDATE user_balances SET balance = MAX(0, balance - ?) WHERE LOWER(address) = LOWER(?)`, [price, addr]);
    }

    // Cộng thẻ vào túi đồ
    for (const cid of cardIds) {
      const existing = await get(`SELECT quantity FROM user_inventory WHERE LOWER(address) = LOWER(?) AND card_id = ?`, [addr, cid]);
      if (existing) {
        await run(`UPDATE user_inventory SET quantity = quantity + 1, updated_at = CURRENT_TIMESTAMP WHERE LOWER(address) = LOWER(?) AND card_id = ?`, [addr, cid]);
      } else {
        await run(`INSERT INTO user_inventory (address, card_id, quantity, updated_at) VALUES (?, ?, 1, CURRENT_TIMESTAMP)`, [addr, cid]);
      }
    }

    // Lưu vào bảng pack_history
    await run(
      `INSERT INTO pack_history (user_address, pack_id, pack_name, price, card_ids) VALUES (?, ?, ?, ?, ?)`,
      [addr, pack.id, pack.name, price, JSON.stringify(cardIds)]
    );

    // Lưu vào bảng transactions
    await run(
      `INSERT INTO transactions (type, user_address, price, total_price, details)
       VALUES ('PACK_OPEN', ?, ?, ?, ?)`,
      [addr, price, price, `Mở gói ${pack.name} nhận ${cardIds.length} thẻ bài`]
    );
  },

  // 5. Lịch sử giao dịch truy vấn từ DB (Hỗ trợ lọc theo userAddress)
  getTransactions: async (limit = 50, userAddress = null) => {
    if (userAddress) {
      const addr = userAddress.toLowerCase();
      return await all(
        `SELECT * FROM transactions WHERE LOWER(user_address) = LOWER(?) OR LOWER(seller_address) = LOWER(?) ORDER BY id DESC LIMIT ?`,
        [addr, addr, Number(limit)]
      );
    }
    return await all(`SELECT * FROM transactions ORDER BY id DESC LIMIT ?`, [Number(limit)]);
  },

  getTransactionsByCardId: async (cardId, limit = 15) => {
    return await all(
      `SELECT * FROM transactions WHERE card_id = ? ORDER BY id DESC LIMIT ?`,
      [Number(cardId), Number(limit)]
    );
  },

  getPacks: () => PACKS,

  generatePackCards: (packId) => {
    const pack = PACKS.find((p) => p.id === Number(packId)) || PACKS[0];
    const cards = [];

    for (let i = 0; i < pack.cardCount; i++) {
      const rand = Math.random() * 100;
      let rarity = "Common";

      if (pack.id === 1) {
        rarity = rand < 75 ? "Common" : "Rare";
      } else if (pack.id === 2 || pack.id === 7 || pack.id === 8) {
        if (rand < 45) rarity = "Common";
        else if (rand < 80) rarity = "Rare";
        else if (rand < 95) rarity = "Epic";
        else rarity = "Mythic";
      } else if (pack.id === 3 || pack.id === 9) {
        if (rand < 35) rarity = "Common";
        else if (rand < 75) rarity = "Rare";
        else if (rand < 93) rarity = "Epic";
        else rarity = "Mythic";
      } else if (pack.id === 4 || pack.id === 10 || pack.id === 11) {
        if (rand < 30) rarity = "Common";
        else if (rand < 65) rarity = "Rare";
        else if (rand < 90) rarity = "Epic";
        else rarity = "Mythic";
      } else if (pack.id === 5) {
        if (rand < 20) rarity = "Common";
        else if (rand < 55) rarity = "Rare";
        else if (rand < 85) rarity = "Epic";
        else rarity = "Mythic";
      } else if (pack.id === 6 || pack.id === 12) {
        // Godpack & Collector Pack
        if (rand < 40) rarity = "Epic";
        else if (rand < 75) rarity = "Rare";
        else rarity = "Mythic";
      }

      const card = pickCard(rarity, pack.domainFocus);
      if (card) cards.push(card);
    }

    return cards;
  },
};
