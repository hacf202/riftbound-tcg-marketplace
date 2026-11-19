import { DEFAULT_CARDS, DEFAULT_PACKS, DEFAULT_LISTINGS } from '../data/defaultData';
import allCards from '../data/allCards.json';
import primaryCards from '../data/primaryCards.json';
import defaultContractsConfig from '../config/contracts-config.json';
import defaultContractsAbi from '../config/contracts-abi.json';

const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_BASE = isLocalhost
  ? 'http://localhost:5000/api/v1'
  : '/api/v1'; // On Vercel, handled client-side

// LocalStorage Keys
const getInvKey = (addr) => `rift_inv_${addr?.toLowerCase() || 'default'}`;
const getBalKey = (addr) => `rift_bal_${addr?.toLowerCase() || 'default'}`;
const MKT_LISTINGS_KEY = 'rift_mkt_listings';
const ACTIVITIES_KEY = 'rift_activities';

export const getDefaultActivities = (userAddr) => {
  const myAddr = (userAddr || '0x0730f3b21bf61d31d7db9e9094fb8c8b6d419f1c').toLowerCase();
  return [
    {
      id: 108,
      type: 'SALE',
      user_address: myAddr,
      seller_address: '0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc',
      card_id: 25,
      card_name: 'Relentless Storm',
      quantity: 1,
      price: 220,
      total_price: 220,
      details: 'Khớp lệnh mua thẻ Relentless Storm',
      created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    },
    {
      id: 107,
      type: 'EXCHANGE',
      user_address: myAddr,
      seller_address: null,
      card_id: null,
      card_name: 'Token $RIFT',
      quantity: null,
      price: 10,
      total_price: 1000,
      details: 'Quy đổi 10 TCRO (Cronos Testnet) sang 1,000 $RIFT',
      created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: 106,
      type: 'FAUCET',
      user_address: myAddr,
      seller_address: null,
      card_id: null,
      card_name: 'Token $RIFT',
      quantity: null,
      price: 1000,
      total_price: 1000,
      details: 'Nhận 1,000 $RIFT miễn phí từ Faucet',
      created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
    {
      id: 105,
      type: 'LISTING',
      user_address: '0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc',
      seller_address: '0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc',
      card_id: 25,
      card_name: 'Relentless Storm',
      quantity: 1,
      price: 220,
      total_price: 220,
      details: 'Niêm yết thẻ lên sàn giao dịch',
      created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
    {
      id: 104,
      type: 'PACK_OPEN',
      user_address: '0x15d34aaf54267db7d7c367839aaf71a00a2c6a65',
      seller_address: null,
      card_id: null,
      card_name: 'Origins Core Pack',
      quantity: 1,
      price: 100,
      total_price: 100,
      details: 'Mở gói Origins Core Pack nhận 5 thẻ bài',
      created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    },
    {
      id: 103,
      type: 'SALE',
      user_address: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
      seller_address: '0x15d34aaf54267db7d7c367839aaf71a00a2c6a65',
      card_id: 1,
      card_name: "Doran's Blade",
      quantity: 1,
      price: 25,
      total_price: 25,
      details: 'Khớp lệnh mua thẻ bài thành công trên sàn',
      created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    },
    {
      id: 102,
      type: 'LISTING',
      user_address: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
      seller_address: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
      card_id: 3,
      card_name: 'Strikers Epiphany',
      quantity: 2,
      price: 45,
      total_price: 90,
      details: 'Niêm yết thẻ lên sàn giao dịch',
      created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    },
    {
      id: 101,
      type: 'SALE',
      user_address: '0x90f79bf6eb2c4f870365e785982e1f101e93b906',
      seller_address: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
      card_id: 2,
      card_name: 'Void Gate',
      quantity: 1,
      price: 60,
      total_price: 60,
      details: 'Khớp lệnh mua thẻ bài thành công trên sàn',
      created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    },
    {
      id: 100,
      type: 'CANCEL',
      user_address: '0x15d34aaf54267db7d7c367839aaf71a00a2c6a65',
      seller_address: '0x15d34aaf54267db7d7c367839aaf71a00a2c6a65',
      card_id: 5,
      card_name: 'Might of Demacia - Starter',
      quantity: 1,
      price: 35,
      total_price: 35,
      details: 'Hủy niêm yết thẻ bài trên sàn',
      created_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    },
  ];
};

export const getStoredActivities = (userAddr) => {
  if (typeof window === 'undefined') return getDefaultActivities(userAddr);
  const stored = localStorage.getItem(ACTIVITIES_KEY);
  if (!stored) {
    const defaults = getDefaultActivities(userAddr);
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(defaults));
    return defaults;
  }
  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      if (userAddr) {
        const uLower = userAddr.toLowerCase();
        const hasUserTx = parsed.some(
          (t) =>
            (t.user_address && t.user_address.toLowerCase() === uLower) ||
            (t.seller_address && t.seller_address.toLowerCase() === uLower)
        );
        if (!hasUserTx) {
          const userSeed = getDefaultActivities(userAddr).filter(
            (t) => t.user_address?.toLowerCase() === uLower
          );
          const combined = [...userSeed, ...parsed];
          localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(combined));
          return combined;
        }
      }
      return parsed;
    }
  } catch {}
  const defaults = getDefaultActivities(userAddr);
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(defaults));
  return defaults;
};

export const recordActivity = (activity) => {
  if (typeof window === 'undefined') return;
  const list = getStoredActivities(activity.user_address);
  const maxId = list.reduce((max, item) => Math.max(max, Number(item.id) || 0), 108);
  const newTx = {
    id: maxId + 1,
    created_at: new Date().toISOString(),
    ...activity,
  };
  list.unshift(newTx);
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(list.slice(0, 100)));
  return newTx;
};

// Initialize mock store in localStorage if needed
export const initLocalStore = (address) => {
  if (typeof window === 'undefined') return;

  const addr = address?.toLowerCase() || '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';

  // 1. Initial Balance
  if (!localStorage.getItem(getBalKey(addr))) {
    localStorage.setItem(getBalKey(addr), '1000');
  }

  // 2. Initial Listings
  if (!localStorage.getItem(MKT_LISTINGS_KEY)) {
    localStorage.setItem(MKT_LISTINGS_KEY, JSON.stringify(DEFAULT_LISTINGS));
  }

  // 3. Initial Inventory
  if (!localStorage.getItem(getInvKey(addr))) {
    const starterCards = DEFAULT_CARDS.slice(0, 8).map((c) => ({
      cardId: c.id,
      card: c,
      quantity: 2,
    }));
    const initialInv = {
      totalCardsCount: 16,
      uniqueCards: 8,
      estimatedPortfolioValueRift: 580,
      cards: starterCards,
    };
    localStorage.setItem(getInvKey(addr), JSON.stringify(initialInv));
  }
};

/**
 * Universal Mock Client Handler when backend is not running or on Vercel
 */
export const mockApiHandler = async (url, options = {}) => {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};
  const pathname = url.replace(/^https?:\/\/[^/]+/, '').replace('/api/v1', '');

  // 1. System Contracts
  if (pathname.startsWith('/system/contracts')) {
    return {
      success: true,
      data: {
        config: defaultContractsConfig,
        abi: defaultContractsAbi,
      },
    };
  }

  // 2. System Health
  if (pathname.startsWith('/system/health')) {
    return { success: true, status: 'ONLINE', service: 'Riftbound Vercel Hybrid Client' };
  }

  // 3. Cards Routes: Market, Single Card, and Catalog
  const cardMarketMatch = pathname.match(/^\/cards\/([^/]+)\/market/);
  if (cardMarketMatch) {
    const idOrCode = cardMarketMatch[1].toLowerCase();
    const card =
      allCards.find(
        (c) =>
          c.id.toString() === idOrCode ||
          (c.scrydex_id && c.scrydex_id.toLowerCase() === idOrCode) ||
          (c.public_code && c.public_code.toLowerCase() === idOrCode) ||
          (c.name && c.name.toLowerCase() === idOrCode)
      ) || allCards[0];

    const stored = localStorage.getItem(MKT_LISTINGS_KEY);
    const listings = stored ? JSON.parse(stored) : DEFAULT_LISTINGS;
    const cardListings = listings.filter((l) => Number(l.cardId) === Number(card.id));
    const floorPrice =
      cardListings.length > 0
        ? Math.min(...cardListings.map((l) => Number(l.pricePerItem)))
        : card.marketFloorPrice || 35;

    const variations = [
      {
        id: 'normal',
        name: 'Bản Thường (Normal)',
        type: 'Standard',
        floorPrice: floorPrice,
        usdPrice: Number((floorPrice * 0.15).toFixed(2)),
        isAvailable: true,
      },
      {
        id: 'foil',
        name: 'Thẻ Lấp Lánh (Holo Foil)',
        type: 'Foil',
        floorPrice: Math.round(floorPrice * 1.8),
        usdPrice: Number((floorPrice * 1.8 * 0.15).toFixed(2)),
        isAvailable: true,
      },
      {
        id: 'signature',
        name: 'Chữ Ký Họa Sĩ (Signature)',
        type: 'Showcase',
        floorPrice: Math.round(floorPrice * 3.5),
        usdPrice: Number((floorPrice * 3.5 * 0.15).toFixed(2)),
        isAvailable: card.rarity === 'Mythic' || card.rarity === 'Legendary',
      },
    ];

    return {
      success: true,
      status: 'success',
      data: {
        card,
        floorPrice,
        activeListings: cardListings,
        recentSales: [
          { price: floorPrice, timestamp: Date.now() - 3600000, quantity: 1 },
        ],
        variations,
        marketStats: {
          totalMinted: card.totalMinted || 200,
          activeListingsCount: cardListings.length,
          totalVolume: floorPrice * 5,
          lastSalePrice: floorPrice,
        },
      },
    };
  }

  const singleCardMatch = pathname.match(/^\/cards\/([^/?#]+)$/);
  if (singleCardMatch && singleCardMatch[1] !== 'expansions') {
    const idOrCode = singleCardMatch[1].toLowerCase();
    const card =
      allCards.find(
        (c) =>
          c.id.toString() === idOrCode ||
          (c.scrydex_id && c.scrydex_id.toLowerCase() === idOrCode) ||
          (c.public_code && c.public_code.toLowerCase() === idOrCode) ||
          (c.name && c.name.toLowerCase() === idOrCode)
      ) || allCards[0];

    return {
      success: true,
      status: 'success',
      data: card,
    };
  }

  // 3b. Cards Catalog
  if (pathname.startsWith('/cards')) {
    const queryString = url.includes('?') ? url.split('?')[1] : '';
    const params = new URLSearchParams(queryString);
    const scope = params.get('scope') || 'primary';
    const limit = parseInt(params.get('limit') || (scope === 'all' ? '400' : '200'), 10);
    const pool = scope === 'all' ? allCards : primaryCards;

    return {
      success: true,
      status: 'success',
      total: pool.length,
      data: pool.slice(0, limit),
    };
  }

  // 4. Packs
  if (pathname === '/packs') {
    return { success: true, data: DEFAULT_PACKS };
  }

  if (pathname === '/packs/simulate-open') {
    const packId = Number(body.packId || 1);
    const count = packId === 1 ? 3 : 5;
    const cards = [];
    for (let i = 0; i < count; i++) {
      const randomIdx = Math.floor(Math.random() * DEFAULT_CARDS.length);
      cards.push(DEFAULT_CARDS[randomIdx]);
    }
    return {
      success: true,
      data: { packId, cards },
    };
  }

  // 5. Marketplace Listings
  if (pathname.startsWith('/marketplace/listings')) {
    const stored = localStorage.getItem(MKT_LISTINGS_KEY);
    const listings = stored ? JSON.parse(stored) : DEFAULT_LISTINGS;
    return { success: true, data: listings };
  }

  // 6. Marketplace Stats
  if (pathname.startsWith('/marketplace/stats')) {
    const stored = localStorage.getItem(MKT_LISTINGS_KEY);
    const listings = stored ? JSON.parse(stored) : DEFAULT_LISTINGS;
    return {
      success: true,
      data: {
        totalVolume: 18450,
        totalSales: 124,
        activeListings: listings.length,
        floorPrice: 25,
      },
    };
  }

  // 6b. Marketplace Activities
  if (pathname.startsWith('/marketplace/activities')) {
    const queryString = url.includes('?') ? url.split('?')[1] : '';
    const params = new URLSearchParams(queryString);
    const user = params.get('user') || params.get('address') || '';
    const limit = parseInt(params.get('limit') || '50', 10);

    const list = getStoredActivities(user);
    let filtered = list;
    if (user && user.trim()) {
      const uLower = user.toLowerCase();
      filtered = list.filter(
        (tx) =>
          (tx.user_address && tx.user_address.toLowerCase() === uLower) ||
          (tx.seller_address && tx.seller_address.toLowerCase() === uLower)
      );
    }
    return {
      success: true,
      status: 'success',
      total: filtered.length,
      data: filtered.slice(0, limit),
    };
  }

  // 7. Marketplace Actions
  if (pathname.startsWith('/marketplace/sync-listing') && method === 'POST') {
    const seller = (body.seller || '0x0730f3b21bf61d31d7db9e9094fb8c8b6d419f1c').toLowerCase();
    const cardId = Number(body.cardId);
    const qty = Number(body.quantity || 1);

    initLocalStore(seller);
    const rawInv = localStorage.getItem(getInvKey(seller));
    let inv = rawInv
      ? JSON.parse(rawInv)
      : { totalCardsCount: 0, uniqueCards: 0, estimatedPortfolioValueRift: 0, cards: [] };

    // Kiểm tra tồn kho thẻ bài trong túi đồ người bán
    const invIndex = inv.cards.findIndex(
      (c) => Number(c.cardId || c.id) === cardId
    );

    if (invIndex === -1 || Number(inv.cards[invIndex].quantity || 0) < qty) {
      return {
        success: false,
        message: `Số lượng thẻ trong túi đồ không đủ (${invIndex !== -1 ? inv.cards[invIndex].quantity : 0} < ${qty}) để đăng bán!`,
      };
    }

    // Trừ số lượng thẻ trong túi đồ người bán ngay lập tức
    inv.cards[invIndex].quantity = Number(inv.cards[invIndex].quantity) - qty;
    if (inv.cards[invIndex].quantity <= 0) {
      inv.cards.splice(invIndex, 1);
    }
    inv.totalCardsCount = Math.max(0, (inv.totalCardsCount || 0) - qty);
    inv.uniqueCards = inv.cards.length;
    localStorage.setItem(getInvKey(seller), JSON.stringify(inv));

    // Thêm vào danh sách niêm yết trên Sàn
    const stored = localStorage.getItem(MKT_LISTINGS_KEY);
    const listings = stored ? JSON.parse(stored) : DEFAULT_LISTINGS;
    const card =
      DEFAULT_CARDS.find((c) => c.id === cardId) ||
      allCards.find((c) => Number(c.id) === cardId) ||
      DEFAULT_CARDS[0];

    const newListing = {
      listingId: body.listingId || Date.now() % 100000,
      cardId: cardId,
      quantity: qty,
      pricePerItem: Number(body.pricePerItem),
      seller: seller,
      card: card,
    };
    listings.unshift(newListing);
    localStorage.setItem(MKT_LISTINGS_KEY, JSON.stringify(listings));

    recordActivity({
      type: 'LISTING',
      user_address: seller,
      seller_address: seller,
      card_id: card.id,
      card_name: card.name,
      quantity: qty,
      price: Number(body.pricePerItem),
      total_price: Number(body.pricePerItem) * qty,
      details: `Niêm yết ${qty} thẻ ${card.name} với giá ${body.pricePerItem} $RIFT/thẻ`,
    });

    return { success: true, message: 'Niêm yết thành công', data: newListing };
  }

  if (pathname.startsWith('/marketplace/sync-sale') && method === 'POST') {
    const stored = localStorage.getItem(MKT_LISTINGS_KEY);
    let listings = stored ? JSON.parse(stored) : DEFAULT_LISTINGS;
    const target = listings.find((l) => Number(l.listingId) === Number(body.listingId));
    if (!target) {
      return { success: false, message: 'Thẻ niêm yết không tồn tại hoặc đã được mua!' };
    }

    const qty = Number(body.quantity || 1);
    const totalPrice = Number(target.pricePerItem) * qty;
    const buyer = (body.buyer || '').toLowerCase();

    // 1. Kiểm tra & khấu trừ số dư người mua trong LocalStorage
    initLocalStore(buyer);
    const currentBuyerBal = Number(localStorage.getItem(getBalKey(buyer)) || '1000');
    if (currentBuyerBal < totalPrice) {
      return {
        success: false,
        message: `Số dư ví không đủ (${currentBuyerBal} $RIFT < ${totalPrice} $RIFT)!`,
      };
    }
    const newBuyerBal = Math.max(0, currentBuyerBal - totalPrice);
    localStorage.setItem(getBalKey(buyer), newBuyerBal.toString());

    // 2. Cộng tiền cho người bán (95.5% sau khi trừ 2% phí sàn và 2.5% phí tác giả)
    if (target.seller) {
      const seller = target.seller.toLowerCase();
      initLocalStore(seller);
      const sellerPayout = totalPrice * 0.955;
      const currentSellerBal = Number(localStorage.getItem(getBalKey(seller)) || '1000');
      localStorage.setItem(getBalKey(seller), (currentSellerBal + sellerPayout).toString());
    }

    // 2b. Cộng tiền bản quyền cho ví Họa sĩ sáng tác (2.5%)
    const artistAddress = '0xbb0911987B295BC1F112356494d8Ad0Dc37f178a'.toLowerCase();
    initLocalStore(artistAddress);
    const royaltyPayout = totalPrice * 0.025;
    const currentArtistBal = Number(localStorage.getItem(getBalKey(artistAddress)) || '0');
    localStorage.setItem(getBalKey(artistAddress), (currentArtistBal + royaltyPayout).toString());

    // 2c. Cộng tiền phí sàn cho ví Kho bạc (2.0%)
    const treasuryAddress = '0xeb301886d4C303369C1A3bfA232B30F3D1c4Ea72'.toLowerCase();
    initLocalStore(treasuryAddress);
    const protocolPayout = totalPrice * 0.02;
    const currentTreasuryBal = Number(localStorage.getItem(getBalKey(treasuryAddress)) || '0');
    localStorage.setItem(getBalKey(treasuryAddress), (currentTreasuryBal + protocolPayout).toString());

    // 3. Thêm lá bài vừa mua vào Túi đồ (Inventory) của người mua
    const rawBuyerInv = localStorage.getItem(getInvKey(buyer));
    let buyerInv = rawBuyerInv
      ? JSON.parse(rawBuyerInv)
      : { totalCardsCount: 0, uniqueCards: 0, estimatedPortfolioValueRift: 0, cards: [] };

    const cardObj =
      target.card ||
      DEFAULT_CARDS.find((c) => c.id === Number(target.cardId)) ||
      DEFAULT_CARDS[0];

    const existingInInv = buyerInv.cards.find(
      (c) => Number(c.cardId || c.id) === Number(cardObj.id)
    );

    if (existingInInv) {
      existingInInv.quantity = Number(existingInInv.quantity || 1) + qty;
    } else {
      buyerInv.cards.unshift({
        cardId: cardObj.id,
        card: cardObj,
        quantity: qty,
      });
    }

    buyerInv.totalCardsCount = (buyerInv.totalCardsCount || 0) + qty;
    buyerInv.uniqueCards = buyerInv.cards.length;
    buyerInv.estimatedPortfolioValueRift =
      (buyerInv.estimatedPortfolioValueRift || 0) + (cardObj.marketFloorPrice || 35) * qty;

    localStorage.setItem(getInvKey(buyer), JSON.stringify(buyerInv));

    // 4. Khấu trừ số lượng niêm yết trên sàn (Escrow Marketplace)
    target.quantity -= qty;
    if (target.quantity <= 0) {
      listings = listings.filter((l) => Number(l.listingId) !== Number(body.listingId));
    }
    localStorage.setItem(MKT_LISTINGS_KEY, JSON.stringify(listings));

    recordActivity({
      type: 'SALE',
      user_address: buyer,
      seller_address: (target.seller || '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc').toLowerCase(),
      creator_address: '0xbb0911987B295BC1F112356494d8Ad0Dc37f178a'.toLowerCase(),
      treasury_address: '0xeb301886d4C303369C1A3bfA232B30F3D1c4Ea72'.toLowerCase(),
      card_id: cardObj.id,
      card_name: cardObj.name,
      quantity: qty,
      price: Number(target.pricePerItem),
      total_price: totalPrice,
      protocol_fee: totalPrice * 0.02,
      royalty_fee: totalPrice * 0.025,
      seller_payout: totalPrice * 0.955,
      details: `Khớp lệnh mua ${qty} thẻ ${cardObj.name}`,
    });

    return {
      success: true,
      message: 'Mua thẻ thành công',
      data: {
        newBalance: newBuyerBal,
        card: cardObj,
        quantity: qty,
      },
    };
  }

  if (pathname.startsWith('/marketplace/sync-cancel') && method === 'POST') {
    const stored = localStorage.getItem(MKT_LISTINGS_KEY);
    let listings = stored ? JSON.parse(stored) : DEFAULT_LISTINGS;
    const target = listings.find((l) => Number(l.listingId) === Number(body.listingId));
    if (target) {
      const seller = (body.seller || target.seller || '').toLowerCase();
      const listingSeller = (target.seller || '').toLowerCase();

      // Bảo vệ: chỉ người bán mới được hủy
      if (seller && listingSeller && seller !== listingSeller) {
        return { success: false, message: 'Chỉ người bán của thẻ này mới có quyền hủy niêm yết!' };
      }

      listings = listings.filter((l) => Number(l.listingId) !== Number(body.listingId));
      localStorage.setItem(MKT_LISTINGS_KEY, JSON.stringify(listings));

      // Hoàn trả thẻ bài về Túi đồ của người bán (Tự động gộp chống trùng thẻ)
      initLocalStore(listingSeller);
      const rawInv = localStorage.getItem(getInvKey(listingSeller));
      let inv = rawInv
        ? JSON.parse(rawInv)
        : { totalCardsCount: 0, uniqueCards: 0, estimatedPortfolioValueRift: 0, cards: [] };

      const cardObj =
        target.card ||
        DEFAULT_CARDS.find((c) => c.id === Number(target.cardId)) ||
        allCards.find((c) => Number(c.id) === Number(target.cardId)) ||
        DEFAULT_CARDS[0];

      const qty = Number(target.quantity || 1);
      const existingInInv = inv.cards.find(
        (c) => Number(c.cardId || c.id) === Number(cardObj.id)
      );

      if (existingInInv) {
        existingInInv.quantity = Number(existingInInv.quantity || 0) + qty;
      } else {
        inv.cards.unshift({
          cardId: cardObj.id,
          card: cardObj,
          quantity: qty,
        });
      }

      // Tự động dọn dẹp các phần tử trùng cardId nếu có từ trước
      const consolidated = [];
      const seen = new Map();
      for (const item of inv.cards) {
        const cid = Number(item.cardId || item.id);
        if (seen.has(cid)) {
          seen.get(cid).quantity = Number(seen.get(cid).quantity || 0) + Number(item.quantity || 1);
        } else {
          const entry = { ...item, quantity: Number(item.quantity || 1) };
          seen.set(cid, entry);
          consolidated.push(entry);
        }
      }
      inv.cards = consolidated.filter((c) => Number(c.quantity) > 0);
      inv.totalCardsCount = inv.cards.reduce((sum, c) => sum + Number(c.quantity), 0);
      inv.uniqueCards = inv.cards.length;
      localStorage.setItem(getInvKey(listingSeller), JSON.stringify(inv));

      recordActivity({
        type: 'CANCEL',
        user_address: listingSeller,
        seller_address: listingSeller,
        card_id: target.cardId || 0,
        card_name: (target.card && target.card.name) || 'Thẻ bài',
        quantity: qty,
        price: Number(target.pricePerItem || 0),
        total_price: Number(target.pricePerItem || 0) * qty,
        details: 'Hủy niêm yết thẻ bài trên sàn',
      });
    }
    return { success: true, message: 'Hủy niêm yết thành công' };
  }

  // 8. User Balance
  const balanceMatch = pathname.match(/^\/users\/(0x[a-fA-F0-9]+)\/balance/);
  if (balanceMatch) {
    const addr = balanceMatch[1].toLowerCase();
    const bal = localStorage.getItem(getBalKey(addr)) || '1000';
    return { success: true, data: { address: addr, balance: Number(bal) } };
  }

  // 9. User Faucet
  const faucetMatch = pathname.match(/^\/users\/(0x[a-fA-F0-9]+)\/faucet/);
  if (faucetMatch && method === 'POST') {
    const addr = faucetMatch[1].toLowerCase();
    const current = Number(localStorage.getItem(getBalKey(addr)) || '1000');
    const updated = current + 1000;
    localStorage.setItem(getBalKey(addr), updated.toString());

    recordActivity({
      type: 'FAUCET',
      user_address: addr,
      seller_address: null,
      card_id: null,
      card_name: 'Token $RIFT',
      quantity: null,
      price: 1000,
      total_price: 1000,
      details: 'Nhận 1,000 $RIFT miễn phí từ Faucet',
    });

    return { success: true, message: 'Nhận 1,000 $RIFT thành công', data: { balance: updated } };
  }

  // 10. User Deposit ETH / TCRO
  const depositMatch = pathname.match(/^\/users\/(0x[a-fA-F0-9]+)\/deposit-eth/);
  if (depositMatch && method === 'POST') {
    const addr = depositMatch[1].toLowerCase();
    const current = Number(localStorage.getItem(getBalKey(addr)) || '1000');
    const riftAmount = Number(body.riftAmount || 1000);
    const updated = current + riftAmount;
    localStorage.setItem(getBalKey(addr), updated.toString());

    recordActivity({
      type: 'EXCHANGE',
      user_address: addr,
      seller_address: null,
      card_id: null,
      card_name: 'Token $RIFT',
      quantity: null,
      price: Number(body.ethAmount || 0),
      total_price: riftAmount,
      details: `Quy đổi ${body.ethAmount || 0} ${body.currency || 'Crypto'} sang ${riftAmount.toLocaleString()} $RIFT`,
    });

    return { success: true, message: 'Quy đổi thành công', data: { balance: updated } };
  }

  // 11. User Inventory
  const invMatch = pathname.match(/^\/users\/(0x[a-fA-F0-9]+)\/inventory/);
  if (invMatch) {
    const addr = invMatch[1].toLowerCase();
    initLocalStore(addr);
    const raw = localStorage.getItem(getInvKey(addr));
    if (raw) {
      try {
        const inv = JSON.parse(raw);
        if (Array.isArray(inv.cards)) {
          const consolidated = [];
          const seen = new Map();
          for (const item of inv.cards) {
            const cid = Number(item.cardId || item.id);
            if (seen.has(cid)) {
              seen.get(cid).quantity = Number(seen.get(cid).quantity || 0) + Number(item.quantity || 1);
            } else {
              const entry = { ...item, quantity: Number(item.quantity || 1) };
              seen.set(cid, entry);
              consolidated.push(entry);
            }
          }
          inv.cards = consolidated.filter((c) => Number(c.quantity) > 0);
          inv.totalCardsCount = inv.cards.reduce((sum, c) => sum + Number(c.quantity), 0);
          inv.uniqueCards = inv.cards.length;
        }
        return { success: true, data: inv };
      } catch {}
    }
    const starterCards = DEFAULT_CARDS.slice(0, 8).map((c) => ({
      cardId: c.id,
      card: c,
      quantity: 2,
    }));
    return {
      success: true,
      data: {
        totalCardsCount: 16,
        uniqueCards: 8,
        estimatedPortfolioValueRift: 580,
        cards: starterCards,
      },
    };
  }

  // 12. User Pack Rewards
  const packRewardsMatch = pathname.match(/^\/users\/(0x[a-fA-F0-9]+)\/pack-rewards/);
  if (packRewardsMatch && method === 'POST') {
    const addr = packRewardsMatch[1].toLowerCase();
    initLocalStore(addr);

    // Khấu trừ số dư ví khi mở gói (nếu có truyền giá gói)
    if (body.price && Number(body.price) > 0) {
      const currentBal = Number(localStorage.getItem(getBalKey(addr)) || '1000');
      const newBal = Math.max(0, currentBal - Number(body.price));
      localStorage.setItem(getBalKey(addr), newBal.toString());
    }

    const raw = localStorage.getItem(getInvKey(addr));
    let inv = raw ? JSON.parse(raw) : { totalCardsCount: 0, uniqueCards: 0, estimatedPortfolioValueRift: 0, cards: [] };
    const cardIds = body.cardIds || [];

    for (const id of cardIds) {
      const card = DEFAULT_CARDS.find((c) => c.id === Number(id)) || DEFAULT_CARDS[0];
      const existing = inv.cards.find((c) => Number(c.cardId) === Number(id));
      if (existing) {
        existing.quantity += 1;
      } else {
        inv.cards.unshift({ cardId: card.id, card: card, quantity: 1 });
      }
      inv.totalCardsCount += 1;
      inv.estimatedPortfolioValueRift += card.marketFloorPrice || 35;
    }
    inv.uniqueCards = inv.cards.length;
    localStorage.setItem(getInvKey(addr), JSON.stringify(inv));

    recordActivity({
      type: 'PACK_OPEN',
      user_address: addr,
      seller_address: null,
      card_id: null,
      card_name: body.packId ? `Gói Bài #${body.packId}` : 'Gói Thẻ Bài',
      quantity: 1,
      price: Number(body.price || 100),
      total_price: Number(body.price || 100),
      details: `Mở gói nhận ${cardIds.length} thẻ bài mới vào Túi đồ`,
    });

    return { success: true, message: 'Đã nhận thưởng gói bài' };
  }

  return { success: false, message: 'Not found' };
};

/**
 * Smart Universal Fetch
 * - On Localhost: Tries backend API first. If down, falls back to Mock Handler silently.
 * - On Vercel / Cloud: Calls Mock Handler directly. No ERR_CONNECTION_REFUSED in console!
 */
export const universalFetch = async (url, options = {}) => {
  // If not on localhost, directly use the mock client handler
  if (!isLocalhost) {
    return mockApiHandler(url, options);
  }

  // On localhost, attempt to fetch from backend
  try {
    const res = await fetch(url, options);
    return await res.json();
  } catch (err) {
    // Backend offline: seamlessly fallback to local handler
    return mockApiHandler(url, options);
  }
};
