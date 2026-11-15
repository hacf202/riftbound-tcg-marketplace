import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Layers, ChevronLeft, ChevronRight, ArrowRight, Sparkles, Zap, Package } from 'lucide-react';
import CardItem from '../components/CardItem';
import BuyModal from '../components/BuyModal';
import { useWeb3 } from '../context/Web3Context';

export default function Marketplace() {
  const { API_BASE, dataVersion, setActiveTab, setIsExchangeModalOpen } = useWeb3();
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

  // Banner Carousel State (10s auto rotate)
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const SLIDES = [
    {
      id: 'marketplace',
      tag: 'SÀN GIAO DỊCH ON-CHAIN',
      tagColor: 'text-amber-300 bg-amber-500/15 border-amber-500/30',
      titleMain: 'Sàn Giao Dịch',
      titleAccent: 'RIFTBOUND',
      accentColor: 'text-amber-400',
      description: 'Mua bán, chuyển nhượng 200+ lá bài NFT chuẩn ERC-1155. Ký quỹ Escrow 100% minh bạch trên mạng blockchain EVM.',
      bgImage: 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/364af10bac81e6ffb8658b0dc0db551608d207ce-1038x744.png', // Reaver's Row
      buttonLabel: 'Khám Phá Sàn Thẻ Bài',
      buttonIcon: ArrowRight,
      buttonAction: () => {
        const el = document.getElementById('search-filter-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
      type: 'stats',
    },
    {
      id: 'packs',
      tag: 'TÍNH NĂNG MỞ GÓI THẺ',
      tagColor: 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30',
      titleMain: 'Khai Mở Gói Thẻ',
      titleAccent: 'BOOSTER PACKS',
      accentColor: 'text-cyan-400',
      description: 'Nhận ngay 5 lá bài ngẫu nhiên từ 12 bộ gói chủ đề. Tỉ lệ trúng thẻ Epic, Legendary & Mythic được bảo chứng trên Smart Contract.',
      bgImage: 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/2392529560dc9af72596c6fc65b4c0356bbc44d1-1038x744.png', // Altar to Unity
      buttonLabel: 'Mở Gói Thẻ Ngay',
      buttonIcon: Package,
      buttonAction: () => setActiveTab('packs'),
      type: 'packs',
    },
    {
      id: 'exchange',
      tag: 'THANH KHOẢN CRYPTO TỨC THÌ',
      tagColor: 'text-purple-300 bg-purple-500/15 border-purple-500/30',
      titleMain: 'Cổng Quy Đổi',
      titleAccent: 'ETH & CRONOS',
      accentColor: 'text-purple-400',
      description: 'Đổi đồng ETH hoặc Cronos Testnet (TCRO) sang token $RIFT tức thì. Tỷ giá định chuẩn: 1 ETH = 10,000 $RIFT, 1 TCRO = 100 $RIFT.',
      bgImage: 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/3e9f659a32e390b45bc87a01bdd6af4a8a3565f7-1038x744.png', // Back-Alley Bar
      buttonLabel: 'Quy Đổi Tiền Tệ Ngay',
      buttonIcon: Zap,
      buttonAction: () => setIsExchangeModalOpen(true),
      type: 'exchange',
    },
  ];

  // Auto rotate slide every 10 seconds (10,000ms)
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

  const slide = SLIDES[currentSlide];
  const ButtonIcon = slide.buttonIcon;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* 1. HERO BANNER SECTION CAROUSEL (TỰ ĐỘNG CHUYỂN MỖI 10S) */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative bg-slate-900 border border-slate-800 rounded-xl mb-6 overflow-hidden shadow-sm group select-none transition-all duration-300"
      >
        {/* Background Image Layer with Smooth Fade */}
        <div
          key={slide.id}
          className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none transition-all duration-700 ease-in-out scale-100 group-hover:scale-105"
          style={{ backgroundImage: `url('${slide.bgImage}')` }}
        />
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/65 pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 p-5 md:p-7 min-h-[200px] flex flex-col justify-between">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Left Content Column */}
            <div className="max-w-xl animate-fade-in">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider mb-2.5 backdrop-blur-sm">
                <span className={`px-1.5 py-0.5 rounded ${slide.tagColor}`}>{slide.tag}</span>
                <span className="text-slate-400 font-mono text-[9px] hidden sm:inline">Tự động chuyển mỗi 10s</span>
              </div>

              <h1 className="font-cinzel text-2xl md:text-3xl font-black text-slate-100 tracking-wide leading-tight">
                {slide.titleMain} <span className={slide.accentColor}>{slide.titleAccent}</span>
              </h1>
              
              <p className="text-xs md:text-sm text-slate-300 mt-2 font-medium leading-relaxed">
                {slide.description}
              </p>

              <div className="mt-4 flex items-center space-x-3">
                <button
                  onClick={slide.buttonAction}
                  className="inline-flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs uppercase tracking-wider transition active:scale-95 shadow-sm"
                >
                  <ButtonIcon className="w-3.5 h-3.5" />
                  <span>{slide.buttonLabel}</span>
                </button>
              </div>
            </div>

            {/* Right Metric Cards / Features Column */}
            <div className="flex-shrink-0 animate-fade-in">
              {slide.type === 'stats' && stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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

              {slide.type === 'packs' && (
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-900/90 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-2.5">
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Bộ Gói</div>
                    <div className="text-base font-black text-cyan-300 font-mono">12 Gói</div>
                    <div className="text-[9px] text-slate-500 mt-0.5">Origins & Special</div>
                  </div>
                  <div className="bg-slate-900/90 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-2.5">
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Giá Từ</div>
                    <div className="text-base font-black text-amber-400 font-mono">50 $RIFT</div>
                    <div className="text-[9px] text-slate-500 mt-0.5">5 Thẻ / Gói</div>
                  </div>
                  <div className="bg-slate-900/90 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-2.5">
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Tỉ Lệ Hiếm</div>
                    <div className="text-base font-black text-emerald-400 font-mono">100%</div>
                    <div className="text-[9px] text-slate-500 mt-0.5">Minh Bạch On-Chain</div>
                  </div>
                </div>
              )}

              {slide.type === 'exchange' && (
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-900/90 backdrop-blur-sm border border-purple-500/20 rounded-lg p-2.5">
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Ethereum</div>
                    <div className="text-sm md:text-base font-black text-purple-300 font-mono">1 ETH</div>
                    <div className="text-[9px] text-slate-400 font-bold mt-0.5">= 10,000 $RIFT</div>
                  </div>
                  <div className="bg-slate-900/90 backdrop-blur-sm border border-purple-500/20 rounded-lg p-2.5">
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Cronos Testnet</div>
                    <div className="text-sm md:text-base font-black text-cyan-300 font-mono">1 TCRO</div>
                    <div className="text-[9px] text-slate-400 font-bold mt-0.5">= 100 $RIFT</div>
                  </div>
                  <div className="bg-slate-900/90 backdrop-blur-sm border border-purple-500/20 rounded-lg p-2.5">
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Phí Đổi</div>
                    <div className="text-base font-black text-emerald-400 font-mono">0%</div>
                    <div className="text-[9px] text-slate-500 mt-0.5">Nhận Ngay Tức Thì</div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Carousel Footer: Prev/Next & Dots Indicator */}
          <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            
            {/* Dots navigation */}
            <div className="flex items-center space-x-2">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  title={`Chuyển đến: ${s.titleMain}`}
                  className={`h-1.5 transition-all duration-300 rounded-full ${
                    currentSlide === idx
                      ? 'w-6 bg-amber-400 shadow-sm shadow-amber-400/50'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                />
              ))}
              <span className="text-[10px] text-slate-400 font-mono ml-2">
                {currentSlide + 1} / {SLIDES.length}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-1.5">
              <button
                onClick={prevSlide}
                title="Phiên trước"
                className="p-1 rounded-md bg-slate-950/80 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={nextSlide}
                title="Phiên tiếp theo"
                className="p-1 rounded-md bg-slate-950/80 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BỘ LỌC & TÌM KIẾM */}
      <div id="search-filter-section" className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 mb-6 space-y-3">
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
