import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import CardItem from '../components/CardItem';
import BuyModal from '../components/BuyModal';
import { useWeb3 } from '../context/Web3Context';
import { universalFetch, API_BASE } from '../utils/api';

export default function Marketplace() {
  const { dataVersion, setActiveTab, setIsExchangeModalOpen } = useWeb3();
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [domain, setDomain] = useState('');
  const [rarity, setRarity] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [order, setOrder] = useState('asc');

  // Modal State
  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  // Banner Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Debounce search input (Rule 9: 350ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const SLIDES = [
    {
      id: 'marketplace',
      tag: 'THỊ TRƯỜNG',
      titleMain: 'Sàn Giao Dịch',
      titleAccent: 'RIFTBOUND',
      description: 'Giao dịch thẻ bài NFT với cơ chế ký quỹ thông minh.',
      bgImage: 'https://dd.b.pvp.net/latest/set4/en_us/img/cards/04BW013-full.png',
      buttonLabel: 'Khám Phá Sàn',
      buttonAction: () => {
        const el = document.getElementById('search-filter-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
      type: 'stats',
    },
    {
      id: 'packs',
      tag: 'GÓI BÀI',
      titleMain: 'Mở Gói Thẻ',
      titleAccent: 'BOOSTER PACKS',
      description: 'Nhận 5 thẻ ngẫu nhiên từ 12 bộ sưu tập theo chủ đề.',
      bgImage: 'https://dd.b.pvp.net/latest/set3/en_us/img/cards/03DE010-full.png',
      buttonLabel: 'Mở Gói Ngay',
      buttonAction: () => setActiveTab('packs'),
      type: 'packs',
    },
    {
      id: 'exchange',
      tag: 'QUY ĐỔI',
      titleMain: 'Nạp Token',
      titleAccent: 'CRONOS & ETH',
      description: 'Đổi TCRO hoặc ETH sang $RIFT với tỷ giá cố định.',
      bgImage: 'https://dd.b.pvp.net/latest/set3/en_us/img/cards/03MT054-full.png',
      buttonLabel: 'Quy Đổi Token',
      buttonAction: () => setIsExchangeModalOpen(true),
      type: 'exchange',
    },
  ];

  // Auto rotate slide every 10 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [isPaused, SLIDES.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  const fetchMarketplace = () => {
    setIsLoading(true);
    const query = new URLSearchParams({
      search: debouncedSearch,
      domain,
      rarity,
      sortBy,
      order,
    }).toString();

    universalFetch(`${API_BASE}/marketplace/listings?${query}`)
      .then((data) => {
        if (data && data.success) {
          setListings(data.data || []);
        }
      })
      .catch((err) => console.error('Lỗi tải sàn:', err))
      .finally(() => setIsLoading(false));

    universalFetch(`${API_BASE}/marketplace/stats`)
      .then((data) => {
        if (data && data.success) {
          setStats(data.data);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchMarketplace();
  }, [debouncedSearch, domain, rarity, sortBy, order, dataVersion]);

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

  const slide = SLIDES[currentSlide];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      
      {/* 1. HERO BANNER */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative bg-slate-950 border border-slate-800 rounded-xl mb-4 overflow-hidden shadow-lg select-none min-h-[160px] md:h-[152px] flex flex-col justify-between"
      >
        <div
          key={slide.id}
          className="absolute inset-0 bg-cover bg-center opacity-85 group-hover:opacity-95 pointer-events-none transition-opacity duration-700 ease-out"
          style={{ backgroundImage: `url('${slide.bgImage}')` }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 p-2.5 sm:p-3 md:px-5 md:py-2.5 flex-1 flex flex-col justify-between">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Cột trái: Tiêu đề & Mô tả */}
            <div className="max-w-lg animate-fade-in">
              <div className="flex items-center space-x-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-md text-amber-300 bg-amber-500/15 border border-amber-500/30">
                  {slide.tag}
                </span>
              </div>

              <h1 className="font-cinzel text-lg sm:text-xl md:text-2xl font-black text-slate-100 tracking-wide leading-tight drop-shadow-md">
                {slide.titleMain} <span className="text-amber-400">{slide.titleAccent}</span>
              </h1>
              
              <p className="text-xs text-slate-200 mt-0.5 font-medium leading-relaxed drop-shadow line-clamp-1 max-w-md">
                {slide.description}
              </p>

              <div className="mt-2 flex items-center space-x-2">
                <button
                  onClick={slide.buttonAction}
                  className="inline-flex items-center bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-1 rounded-lg text-xs uppercase tracking-wider transition active:scale-95 shadow-sm"
                >
                  {slide.buttonLabel}
                </button>
              </div>
            </div>

            {/* Cột phải: 4 ô số liệu định hình kích thước đồng nhất */}
            <div className="flex-shrink-0 w-full sm:w-[280px] animate-fade-in">
              {slide.type === 'stats' && (
                <div className="grid grid-cols-2 gap-1.5 text-center sm:text-left">
                  <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg p-1.5 px-2">
                    <div className="text-[9px] text-slate-400 uppercase font-semibold">Giá Sàn</div>
                    <div className="text-xs sm:text-sm font-black text-amber-400 font-mono">{stats?.floorPrice || 25} $RIFT</div>
                  </div>
                  <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg p-1.5 px-2">
                    <div className="text-[9px] text-slate-400 uppercase font-semibold">Đang Bán</div>
                    <div className="text-xs sm:text-sm font-black text-slate-200 font-mono">{stats?.activeListingsCount || 33} Thẻ</div>
                  </div>
                  <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg p-1.5 px-2">
                    <div className="text-[9px] text-slate-400 uppercase font-semibold">Volume Sàn</div>
                    <div className="text-xs sm:text-sm font-black text-amber-300 font-mono">{stats?.totalVolumeRift || 5405} $RIFT</div>
                  </div>
                  <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg p-1.5 px-2">
                    <div className="text-[9px] text-slate-400 uppercase font-semibold">Phí Bản Quyền</div>
                    <div className="text-xs sm:text-sm font-black text-slate-200 font-mono">{stats?.royaltyFeeBps ? stats.royaltyFeeBps / 100 : 2.5}%</div>
                  </div>
                </div>
              )}

              {slide.type === 'packs' && (
                <div className="grid grid-cols-2 gap-1.5 text-center sm:text-left">
                  <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg p-1.5 px-2">
                    <div className="text-[9px] text-slate-400 uppercase font-semibold">Bộ Gói</div>
                    <div className="text-xs sm:text-sm font-black text-amber-300 font-mono">12 Gói</div>
                  </div>
                  <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg p-1.5 px-2">
                    <div className="text-[9px] text-slate-400 uppercase font-semibold">Giá Từ</div>
                    <div className="text-xs sm:text-sm font-black text-amber-400 font-mono">50 $RIFT</div>
                  </div>
                  <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg p-1.5 px-2">
                    <div className="text-[9px] text-slate-400 uppercase font-semibold">Số Lá / Gói</div>
                    <div className="text-xs sm:text-sm font-black text-slate-200 font-mono">5 Thẻ</div>
                  </div>
                  <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg p-1.5 px-2">
                    <div className="text-[9px] text-slate-400 uppercase font-semibold">Cơ Chế</div>
                    <div className="text-xs sm:text-sm font-black text-slate-200 font-mono">On-Chain</div>
                  </div>
                </div>
              )}

              {slide.type === 'exchange' && (
                <div className="grid grid-cols-2 gap-1.5 text-center sm:text-left">
                  <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg p-1.5 px-2">
                    <div className="text-[9px] text-slate-400 uppercase font-semibold">Ethereum</div>
                    <div className="text-xs font-black text-amber-300 font-mono">1 ETH = 10k $RIFT</div>
                  </div>
                  <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg p-1.5 px-2">
                    <div className="text-[9px] text-slate-400 uppercase font-semibold">Cronos Testnet</div>
                    <div className="text-xs font-black text-amber-400 font-mono">1 TCRO = 100 $RIFT</div>
                  </div>
                  <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg p-1.5 px-2">
                    <div className="text-[9px] text-slate-400 uppercase font-semibold">Phí Nạp</div>
                    <div className="text-xs sm:text-sm font-black text-slate-200 font-mono">0%</div>
                  </div>
                  <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg p-1.5 px-2">
                    <div className="text-[9px] text-slate-400 uppercase font-semibold">Tốc Độ</div>
                    <div className="text-xs sm:text-sm font-black text-slate-200 font-mono">Tức Thì</div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Footer Banner: Thanh chấm chuyển đổi & Mũi tên */}
          <div className="pt-1 border-t border-slate-800/60 flex items-center justify-between text-xs mt-1">
            <div className="flex items-center space-x-1.5">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  title={`Chuyển đến: ${s.titleMain}`}
                  className={`h-1 transition-all duration-300 rounded-full ${
                    currentSlide === idx
                      ? 'w-5 bg-amber-400 shadow-sm shadow-amber-400/50'
                      : 'w-1.5 bg-slate-700/80 hover:bg-slate-500'
                  }`}
                />
              ))}
              <span className="text-[9px] text-slate-400 font-mono ml-1.5">
                {currentSlide + 1} / {SLIDES.length}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={prevSlide}
                title="Phiên trước"
                className="p-0.5 px-1 rounded bg-slate-950/80 border border-slate-800 hover:bg-slate-800 text-slate-300 transition"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <button
                onClick={nextSlide}
                title="Phiên tiếp theo"
                className="p-0.5 px-1 rounded bg-slate-950/80 border border-slate-800 hover:bg-slate-800 text-slate-300 transition"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BỘ LỌC & TÌM KIẾM */}
      <div id="search-filter-section" className="bg-slate-900 border border-slate-800 rounded-xl p-3 mb-4 space-y-2.5 shadow-sm">
        <div className="flex flex-col md:flex-row gap-2.5 items-center justify-between">
          
          {/* Ô Tìm Kiếm */}
          <div className="relative w-full md:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo tên thẻ, kỹ năng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* Dropdowns */}
          <div className="flex w-full md:w-auto items-center gap-2 overflow-x-auto no-scrollbar">
            <select
              value={rarity}
              onChange={(e) => setRarity(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
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
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
              <option value="id-desc">Mới Niêm Yết</option>
            </select>

            <button
              onClick={fetchMarketplace}
              title="Làm mới sàn"
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Hệ Tộc */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-800/80 no-scrollbar">
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
