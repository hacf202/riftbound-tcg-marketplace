import { DEFAULT_CARDS, DEFAULT_PACKS, DEFAULT_LISTINGS } from '../data/defaultData';
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

  // 3. Cards Catalog
  if (pathname.startsWith('/cards')) {
    return {
      success: true,
      status: 'success',
      total: DEFAULT_CARDS.length,
      data: DEFAULT_CARDS,
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

  // 7. Marketplace Actions
  if (pathname.startsWith('/marketplace/sync-listing') && method === 'POST') {
    const stored = localStorage.getItem(MKT_LISTINGS_KEY);
    const listings = stored ? JSON.parse(stored) : DEFAULT_LISTINGS;
    const card = DEFAULT_CARDS.find((c) => c.id === Number(body.cardId)) || DEFAULT_CARDS[0];
    const newListing = {
      listingId: body.listingId || Date.now() % 100000,
      cardId: body.cardId,
      quantity: body.quantity,
      pricePerItem: body.pricePerItem,
      seller: body.seller,
      card: card,
    };
    listings.unshift(newListing);
    localStorage.setItem(MKT_LISTINGS_KEY, JSON.stringify(listings));
    return { success: true, message: 'Niêm yết thành công', data: newListing };
  }

  if (pathname.startsWith('/marketplace/sync-sale') && method === 'POST') {
    const stored = localStorage.getItem(MKT_LISTINGS_KEY);
    let listings = stored ? JSON.parse(stored) : DEFAULT_LISTINGS;
    const target = listings.find((l) => Number(l.listingId) === Number(body.listingId));
    if (target) {
      target.quantity -= Number(body.quantity || 1);
      if (target.quantity <= 0) {
        listings = listings.filter((l) => Number(l.listingId) !== Number(body.listingId));
      }
      localStorage.setItem(MKT_LISTINGS_KEY, JSON.stringify(listings));
    }
    return { success: true, message: 'Mua thẻ thành công' };
  }

  if (pathname.startsWith('/marketplace/sync-cancel') && method === 'POST') {
    const stored = localStorage.getItem(MKT_LISTINGS_KEY);
    let listings = stored ? JSON.parse(stored) : DEFAULT_LISTINGS;
    listings = listings.filter((l) => Number(l.listingId) !== Number(body.listingId));
    localStorage.setItem(MKT_LISTINGS_KEY, JSON.stringify(listings));
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
