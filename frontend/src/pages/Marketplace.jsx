import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, Sparkles, TrendingUp, ShieldAlert, Layers, RefreshCw } from 'lucide-react';
import CardItem from '../components/CardItem';
import BuyModal from '../components/BuyModal';
import { useWeb3 } from '../context/Web3Context';

export default function Marketplace() {
  const { API_BASE, dataVersion, triggerRefresh } = useWeb3();
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('');
  const [rarity, setRarity] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [order, setOrder] = useState('asc');

  // Modal State
  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  const fetchMarketplace = () => {
    setIsLoading(true);
    const query = new URLSearchParams({
      search,
      domain,
      rarity,
      sortBy,
      order,
    }).toString();

    fetch(`${API_BASE}/marketplace/listings?${query}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setListings(data.data || []);
        }
      })
      .catch((err) => console.error('Lỗi tải sàn:', err))
      .finally(() => setIsLoading(false));

    fetch(`${API_BASE}/marketplace/stats`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.data);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchMarketplace();
  }, [search, domain, rarity, sortBy, order, dataVersion]);

  const handleOpenBuy = (listing, card) => {
    setSelectedListing(listing);
    setSelectedCard(card);
  };

  const domains = [
    { name: 'Tất Cả', value: '' },
    { name: 'Fury (Cuồng Nộ)', value: 'Fury' },
    { name: 'Mind (Trí Tuệ)', value: 'Mind' },
    { name: 'Calm (Tĩnh Tâm)', value: 'Calm' },
    { name: 'Body (Thể Lực)', value: 'Body' },
    { name: 'Chaos (Hỗn Loạn)', value: 'Chaos' },
    { name: 'Order (Trật Tự)', value: 'Order' },
    { name: 'Colorless (Vô Sắc)', value: 'Colorless' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-rift-card via-slate-900 to-rift-dark border border-rift-border p-6 md:p-10 mb-8 overflow-hidden shadow-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chợ Thẻ Bài Phi Tập Trung - Bilgewater Market TCG</span>
          </div>
          <h1 className="font-cinzel text-3xl md:text-5xl font-black text-slate-100 tracking-wide leading-tight mb-4">
            Sàn Giao Dịch & Vật Phẩm Ảo <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">RIFTBOUND</span>
          </h1>
          <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed">
            Mua bán, trao đổi các lá bài NFT độc bản, quái thú vết nứt và thần binh cổ đại. Bảo đảm ký gửi Escrow 100% minh bạch on-chain.
          </p>
        </div>

        {/* Market Stats Counters */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-rift-border/60">
            <div className="bg-slate-900/60 border border-rift-border/50 rounded-2xl p-3.5">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Giá Sàn (Floor)</div>
              <div className="text-xl font-black text-amber-400">{stats.floorPrice} $RIFT</div>
            </div>
            <div className="bg-slate-900/60 border border-rift-border/50 rounded-2xl p-3.5">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Đang Rao Bán</div>
              <div className="text-xl font-black text-slate-100">{stats.activeListingsCount} Thẻ</div>
            </div>
            <div className="bg-slate-900/60 border border-rift-border/50 rounded-2xl p-3.5">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Tổng Volume Sàn</div>
              <div className="text-xl font-black text-cyan-400">{stats.totalVolumeRift} $RIFT</div>
            </div>
            <div className="bg-slate-900/60 border border-rift-border/50 rounded-2xl p-3.5">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Phí Bản Quyền (ERC-2981)</div>
              <div className="text-xl font-black text-emerald-400">{stats.royaltyFeeBps / 100}%</div>
            </div>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-rift-card border border-rift-border rounded-2xl p-4 mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Tìm theo tên thẻ, kỹ năng, danh hiệu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-rift-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/80 transition"
            />
          </div>

          {/* Rarity & Sort Dropdowns */}
          <div className="flex w-full md:w-auto items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <select
              value={rarity}
              onChange={(e) => setRarity(e.target.value)}
              className="bg-slate-900 border border-rift-border rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="">Tất Cả Độ Hiếm</option>
              <option value="Common">Common (Phổ Thông)</option>
              <option value="Rare">Rare (Hiếm)</option>
              <option value="Epic">Epic (Sử Thi)</option>
              <option value="Legendary">Legendary (Huyền Thoại)</option>
              <option value="Mythic">Mythic (Thần Thoại)</option>
            </select>

            <select
              value={`${sortBy}-${order}`}
              onChange={(e) => {
                const [sb, ord] = e.target.value.split('-');
                setSortBy(sb);
                setOrder(ord);
              }}
              className="bg-slate-900 border border-rift-border rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
              <option value="id-desc">Mới Niêm Yết Nhất</option>
            </select>

            <button
              onClick={fetchMarketplace}
              title="Làm mới sàn giao dịch"
              className="p-2 rounded-xl bg-slate-900 border border-rift-border hover:bg-slate-800 text-slate-300 transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-rift-border/50">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:inline mr-2">
            Hệ Tộc:
          </span>
          {domains.map((d) => (
            <button
              key={d.value}
              onClick={() => setDomain(d.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
                domain === d.value
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-rift-border hover:bg-slate-800'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      {/* Card Grid */}
      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm font-semibold">Đang đồng bộ dữ liệu sàn từ Blockchain...</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="py-20 text-center bg-rift-card/40 rounded-3xl border border-rift-border/60">
          <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="font-cinzel text-lg font-bold text-slate-200 mb-1">Không tìm thấy lá bài nào</h3>
          <p className="text-slate-400 text-xs">Hãy thử đổi từ khóa tìm kiếm hoặc lọc lại các thuộc tính.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map((item) => (
            <CardItem
              key={item.id || item.listingId}
              card={item.card}
              listing={item}
              onBuy={handleOpenBuy}
              mode="marketplace"
            />
          ))}
        </div>
      )}

      {/* Buy Confirmation Modal */}
      {selectedListing && selectedCard && (
        <BuyModal
          listing={selectedListing}
          card={selectedCard}
          onClose={() => {
            setSelectedListing(null);
            setSelectedCard(null);
          }}
          onSuccess={fetchMarketplace}
        />
      )}
    </div>
  );
}
