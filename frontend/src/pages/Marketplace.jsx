import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Layers } from 'lucide-react';
import CardItem from '../components/CardItem';
import BuyModal from '../components/BuyModal';
import { useWeb3 } from '../context/Web3Context';

export default function Marketplace() {
  const { API_BASE, dataVersion } = useWeb3();
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
    { name: 'Fury', value: 'Fury' },
    { name: 'Mind', value: 'Mind' },
    { name: 'Calm', value: 'Calm' },
    { name: 'Body', value: 'Body' },
    { name: 'Chaos', value: 'Chaos' },
    { name: 'Order', value: 'Order' },
    { name: 'Colorless', value: 'Colorless' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* 1. HERO BANNER - CÓ ẢNH NỀN FANTASY TCG KÈM LỚP PHỦ TỐI GIẢN */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 mb-6 overflow-hidden shadow-sm">
        {/* Ảnh Nền Banner (Reaver's Row - Bilgewater Port) */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none"
          style={{
            backgroundImage: `url('https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/364af10bac81e6ffb8658b0dc0db551608d207ce-1038x744.png')`,
          }}
        />
        {/* Lớp phủ chuyển sắc tối giúp chữ nổi bật và sắc nét */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/65 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <h1 className="font-cinzel text-2xl md:text-3xl font-black text-slate-100 tracking-wide">
              Sàn Giao Dịch <span className="text-amber-400">RIFTBOUND</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-lg font-medium">
              Mua bán, chuyển nhượng thẻ bài NFT chuẩn ERC-1155 và ký gửi Escrow on-chain.
            </p>
          </div>

          {/* Market Stats Counters - Tinh gọn, số liệu trực quan */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-lg px-3 py-2 text-center sm:text-left">
                <div className="text-[10px] text-slate-400 uppercase font-medium">Giá Sàn</div>
                <div className="text-sm md:text-base font-black text-amber-400 font-mono">{stats.floorPrice} $RIFT</div>
              </div>
              <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-lg px-3 py-2 text-center sm:text-left">
                <div className="text-[10px] text-slate-400 uppercase font-medium">Đang Rao Bán</div>
                <div className="text-sm md:text-base font-black text-slate-200 font-mono">{stats.activeListingsCount} Thẻ</div>
              </div>
              <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-lg px-3 py-2 text-center sm:text-left">
                <div className="text-[10px] text-slate-400 uppercase font-medium">Volume Sàn</div>
                <div className="text-sm md:text-base font-black text-cyan-400 font-mono">{stats.totalVolumeRift} $RIFT</div>
              </div>
              <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-lg px-3 py-2 text-center sm:text-left">
                <div className="text-[10px] text-slate-400 uppercase font-medium">Phí Bản Quyền</div>
                <div className="text-sm md:text-base font-black text-emerald-400 font-mono">{stats.royaltyFeeBps / 100}%</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. BỘ LỌC & TÌM KIẾM - THIẾT KẾ ĐƠN GIẢN, KHÔNG RỐI MẮT */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 mb-6 space-y-3">
        <div className="flex flex-col md:flex-row gap-2.5 items-center justify-between">
          
          {/* Ô Tìm Kiếm */}
          <div className="relative w-full md:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Tìm theo tên thẻ, kỹ năng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* Dropdowns */}
          <div className="flex w-full md:w-auto items-center gap-2 overflow-x-auto">
            <select
              value={rarity}
              onChange={(e) => setRarity(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="">Tất Cả Độ Hiếm</option>
              <option value="Common">Common</option>
              <option value="Rare">Rare</option>
              <option value="Epic">Epic</option>
              <option value="Legendary">Legendary</option>
              <option value="Mythic">Mythic</option>
            </select>

            <select
              value={`${sortBy}-${order}`}
              onChange={(e) => {
                const [sb, ord] = e.target.value.split('-');
                setSortBy(sb);
                setOrder(ord);
              }}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
              <option value="id-desc">Mới Niêm Yết</option>
            </select>

            <button
              onClick={fetchMarketplace}
              title="Làm mới sàn"
              className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Hệ Tộc */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider hidden sm:inline mr-1">
            Hệ Tộc:
          </span>
          {domains.map((d) => (
            <button
              key={d.value}
              onClick={() => setDomain(d.value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap border ${
                domain === d.value
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3. CARD GRID - HIỂN THỊ ĐẦY ĐỦ THẺ */}
      {isLoading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-400 text-xs font-medium">Đang tải danh sách thẻ bài...</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="py-16 text-center bg-slate-900 border border-slate-800 rounded-xl">
          <Layers className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <h3 className="font-cinzel text-base font-bold text-slate-200 mb-1">Không tìm thấy lá bài nào</h3>
          <p className="text-slate-400 text-xs">Hãy thử đổi từ khóa tìm kiếm hoặc lọc lại các thuộc tính.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
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
