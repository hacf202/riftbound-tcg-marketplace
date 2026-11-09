import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Layers,
  Sparkles,
  Zap,
  Flame,
  RotateCcw,
  Eye,
  ArrowRight,
  CheckCircle2,
  Volume2,
  VolumeX,
  Coins,
  Crown,
  Trophy,
  Star,
  Search,
  SlidersHorizontal,
  Info,
  X,
  Shield,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import CardItem from '../components/CardItem';
import {
  playChargeHum,
  playFoilTear,
  playCardFlip,
  playRarityFanfare,
  getAudioMuted,
  toggleAudioMuted,
} from '../utils/soundEffects';

export default function Packs() {
  const {
    account,
    balanceRift,
    balanceEth,
    formatEthEquivalent,
    setIsExchangeModalOpen,
    openPack,
    claimFaucet,
    API_BASE,
    showToast,
    setActiveTab,
    viewCardDetail,
  } = useWeb3();
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Audio state
  const [soundEnabled, setSoundEnabled] = useState(!getAudioMuted());

  // Filters & Search
  const [filterCategory, setFilterCategory] = useState('all'); // 'all' | 'popular' | 'starter' | 'domain' | 'mythic'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'price-asc' | 'price-desc' | 'cards-desc'

  // Opening Flow: 'idle' | 'shaking' | 'tearing' | 'revealed'
  const [openingStage, setOpeningStage] = useState('idle');
  const [selectedPack, setSelectedPack] = useState(null);
  const [revealedCards, setRevealedCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [isAutoRevealing, setIsAutoRevealing] = useState(false);

  // Modal for Drop Rates
  const [oddsModalPack, setOddsModalPack] = useState(null);

  // Sound toggle handler
  const handleToggleSound = () => {
    const isMutedNow = toggleAudioMuted();
    setSoundEnabled(!isMutedNow);
    showToast(isMutedNow ? '🔇 Đã tắt âm thanh' : '🔊 Đã bật âm thanh hiệu ứng', 'info');
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/packs`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPacks(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [API_BASE]);

  // Featured Spotlight Pack (Default to highest tier pack or popular pack like ID 6 or 12)
  const featuredPack = useMemo(() => {
    if (!packs || packs.length === 0) return null;
    return packs.find((p) => p.id === 6) || packs.find((p) => p.popular) || packs[0];
  }, [packs]);

  // Filtered and Sorted Packs
  const displayedPacks = useMemo(() => {
    let list = [...packs];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.domainFocus.toLowerCase().includes(q) ||
          p.tier.toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (filterCategory === 'popular') {
      list = list.filter((p) => p.popular);
    } else if (filterCategory === 'starter') {
      list = list.filter((p) => p.price <= 200 || p.tier === 'Tân Thủ' || p.tier === 'Phép Thuật');
    } else if (filterCategory === 'domain') {
      list = list.filter((p) => ['Fury', 'Mind', 'Calm', 'Body'].includes(p.domainFocus));
    } else if (filterCategory === 'mythic') {
      list = list.filter(
        (p) => p.price >= 500 || p.tier === 'Hoàng Gia' || p.tier === 'Huyền Thoại' || p.tier === 'Collector'
      );
    }

    // 3. Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'cards-desc') {
      list.sort((a, b) => b.cardCount - a.cardCount);
    }

    return list;
  }, [packs, searchQuery, filterCategory, sortBy]);

  // Start Pack Opening Sequence
  const startOpenPack = async (pack) => {
    if (Number(balanceRift) < pack.price) {
      showToast(
        `Số dư ví (${balanceRift} $RIFT) không đủ mở gói (${pack.price} $RIFT). Hãy bấm +1,000 Faucet để nhận thêm!`,
        'warning'
      );
      return;
    }

    setSelectedPack(pack);
    setOpeningStage('shaking');
    setRevealedCards([]);
    setFlippedIndices([]);
    setIsAutoRevealing(false);

    // Audio: Energy Charge Hum
    playChargeHum();

    // Stage 1: Shaking energy gathering (1.2s)
    setTimeout(() => {
      setOpeningStage('tearing');
      // Audio: Foil Tear / Laser Slice Sound
      playFoilTear();
    }, 1200);

    // Stage 2: Tearing & Fetching Cards (approx 1.2s after tearing)
    setTimeout(async () => {
      let cardIds = [];
      if (account) {
        cardIds = await openPack(pack.id, pack.price);
      }

      if (!cardIds || cardIds.length === 0) {
        // Fallback or demo simulation
        try {
          const res = await fetch(`${API_BASE}/packs/simulate-open`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ packId: pack.id }),
          });
          const data = await res.json();
          if (data.success && data.data?.cards) {
            setRevealedCards(data.data.cards);
            setOpeningStage('revealed');
            return;
          }
        } catch (err) {
          console.error(err);
        }
      }

      // Fetch cards details
      if (cardIds && cardIds.length > 0) {
        const promises = cardIds.map((id) =>
          fetch(`${API_BASE}/cards/${id}`).then((r) => r.json())
        );
        const results = await Promise.all(promises);
        const validCards = results.filter((r) => r.success).map((r) => r.data);
        setRevealedCards(validCards);
      }

      setOpeningStage('revealed');
    }, 2400);
  };

  // Flip individual card
  const handleCardClick = (index, card) => {
    if (!flippedIndices.includes(index)) {
      playCardFlip();
      if (card?.rarity) {
        playRarityFanfare(card.rarity);
      }
      setFlippedIndices((prev) => [...prev, index]);
    }
  };

  // Reveal all cards with a cinematic cascading delay
  const revealAllCards = () => {
    if (isAutoRevealing) return;
    setIsAutoRevealing(true);

    const unrevealed = revealedCards
      .map((_, i) => i)
      .filter((i) => !flippedIndices.includes(i));

    if (unrevealed.length === 0) {
      setIsAutoRevealing(false);
      return;
    }

    unrevealed.forEach((idx, step) => {
      setTimeout(() => {
        setFlippedIndices((prev) => {
          if (!prev.includes(idx)) {
            playCardFlip();
            const card = revealedCards[idx];
            if (card?.rarity) {
              playRarityFanfare(card.rarity);
            }
            return [...prev, idx];
          }
          return prev;
        });

        if (step === unrevealed.length - 1) {
          setIsAutoRevealing(false);
        }
      }, (step + 1) * 220);
    });
  };

  const resetPackOpening = () => {
    setOpeningStage('idle');
    setSelectedPack(null);
    setRevealedCards([]);
    setFlippedIndices([]);
    setIsAutoRevealing(false);
  };

  // Quick re-open current pack
  const handleReopenSamePack = () => {
    if (!selectedPack) return;
    resetPackOpening();
    setTimeout(() => {
      startOpenPack(selectedPack);
    }, 100);
  };

  // Compute highest rarity pulled
  const highestPull = useMemo(() => {
    if (!revealedCards || revealedCards.length === 0) return null;
    const rarityRank = { Mythic: 4, Legendary: 3, Epic: 2, Rare: 1, Common: 0 };
    let best = revealedCards[0];
    revealedCards.forEach((c) => {
      if ((rarityRank[c.rarity] || 0) > (rarityRank[best?.rarity] || 0)) {
        best = c;
      }
    });
    return best;
  }, [revealedCards]);

  const allRevealed = revealedCards.length > 0 && flippedIndices.length === revealedCards.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in relative min-h-screen">
      
      {/* ========================================================
          TOP UTILITY & WALLET BAR
      ======================================================== */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/80 border border-rift-border/80 backdrop-blur-xl rounded-2xl p-4 mb-8 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-cinzel text-sm font-bold text-slate-100">RIFTBOUND ARENA</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-black bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 border border-amber-500/30">
                12 Gói Chính Thức
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Công nghệ mở thẻ minh bạch chuẩn Web3 • Cam kết tỷ lệ rơi ngẫu nhiên
            </p>
          </div>
        </div>

        {/* Live Wallet & Controls */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          {/* Balance Pill */}
          <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl px-3.5 py-2 flex items-center space-x-2.5 shadow-inner">
            <Coins className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 leading-none">Số Dư Khả Dụng</div>
              <div className="text-sm font-black text-amber-400 leading-tight">
                {Number(balanceRift).toLocaleString()} <span className="text-[11px] font-semibold text-slate-300">$RIFT</span>
              </div>
              <div className="text-[10px] text-cyan-400 font-mono font-medium leading-none mt-0.5">
                {balanceEth} ETH (~{formatEthEquivalent ? formatEthEquivalent(balanceRift) : '0 ETH'})
              </div>
            </div>
          </div>

          {/* Quick Currency Converter Button */}
          {setIsExchangeModalOpen && (
            <button
              onClick={() => setIsExchangeModalOpen(true)}
              title="Quy đổi tỷ giá ETH ↔ $RIFT"
              className="bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/40 text-purple-300 hover:text-purple-200 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Tỷ Giá ETH</span>
            </button>
          )}

          {/* Quick Faucet Button */}
          <button
            onClick={claimFaucet}
            title="Nhận ngay 1,000 $RIFT thử nghiệm"
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center space-x-1.5 whitespace-nowrap"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>+1,000 Faucet</span>
          </button>

          {/* Sound Toggle Button */}
          <button
            onClick={handleToggleSound}
            title={soundEnabled ? 'Tắt âm thanh hiệu ứng' : 'Bật âm thanh hiệu ứng'}
            className={`p-2 rounded-xl border transition ${
              soundEnabled
                ? 'bg-purple-950/40 border-purple-500/50 text-purple-300 hover:bg-purple-900/40'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* View Inventory Shortcut */}
          <button
            onClick={() => setActiveTab('inventory')}
            className="hidden sm:flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-500 font-bold px-3 py-2 rounded-xl text-xs transition"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Túi Đồ</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          HERO ARENA BANNER & SPOTLIGHT
      ======================================================== */}
      {openingStage === 'idle' && featuredPack && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-900 border border-purple-500/40 p-6 md:p-8 mb-10 shadow-2xl">
          {/* Ambient light blobs */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 left-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left 3D Pack Preview Mockup */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative group cursor-pointer" onClick={() => startOpenPack(featuredPack)}>
                {/* Aura Glow */}
                <div
                  className="absolute inset-0 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition duration-500"
                  style={{ backgroundColor: featuredPack.glowColor || 'rgba(168, 85, 247, 0.4)' }}
                ></div>

                {/* 3D Vertical Booster Pack Wrapper */}
                <div
                  className="relative w-56 md:w-64 rounded-2xl border-2 overflow-hidden shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2 flex flex-col justify-between"
                  style={{
                    backgroundColor: '#090d16',
                    borderColor: featuredPack.color || '#a855f7',
                    boxShadow: `0 10px 40px ${featuredPack.glowColor || 'rgba(168, 85, 247, 0.3)'}`,
                  }}
                >
                  {/* Top Crimp Strip with Hanger Slot */}
                  <div className="foil-crimp h-5 w-full flex items-center justify-center border-b border-white/10 relative">
                    <div className="w-8 h-2 rounded-full bg-slate-950/80 border border-white/20"></div>
                  </div>

                  {/* Foil Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>

                  {/* Pack Inner Body */}
                  <div className="p-4 flex flex-col items-center text-center">
                    <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-black uppercase text-amber-300 tracking-wider mb-2">
                      <Crown className="w-3 h-3" />
                      <span>{featuredPack.tier}</span>
                    </div>

                    <h3 className="font-cinzel text-lg font-black text-white leading-tight">
                      {featuredPack.name}
                    </h3>
                    <p className="text-[10px] text-slate-300 font-medium tracking-wide mb-3">
                      {featuredPack.subtitle}
                    </p>

                    {/* Artwork Window */}
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-white/20 relative shadow-inner mb-3">
                      <img
                        src={featuredPack.image}
                        alt={featuredPack.name}
                        className="w-full h-full object-cover object-top group-hover:scale-110 transition duration-700"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/14a52a367fd41fd84745e050e62d1f281f733467-1038x744.png';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>
                      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[10px] font-bold text-amber-300">
                        <span>⚡ {featuredPack.cardCount} Lá Bài</span>
                        <span className="px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-white">
                          {featuredPack.domainFocus}
                        </span>
                      </div>
                    </div>

                    {/* Guarantee Callout */}
                    <div className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg p-1.5 text-[10px] text-purple-200 font-semibold mb-2">
                      ✨ Đảm bảo 100% Epic hoặc Mythic!
                    </div>

                    <div className="text-amber-400 font-black text-lg tracking-wide">
                      {featuredPack.price} $RIFT
                    </div>
                  </div>

                  {/* Bottom Crimp Strip */}
                  <div className="foil-crimp h-5 w-full border-t border-white/10 flex items-center justify-center">
                    <span className="text-[8px] tracking-widest text-white/50 uppercase font-mono">
                      AUTHENTIC RIFTBOUND TCG FOIL
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Spotlight Details & CTA */}
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <Crown className="w-4 h-4" />
                <span>Gói Thẻ Hoàng Gia Tối Thượng • Giới Hạn</span>
              </div>

              <h1 className="font-cinzel text-3xl md:text-5xl font-black text-slate-100 tracking-wide leading-tight">
                Mở Phong Ấn <br className="hidden md:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400">
                  {featuredPack.name}
                </span>
              </h1>

              <p className="text-xs md:text-sm text-slate-300 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                {featuredPack.description} Sở hữu các lá bài có chỉ số ATK và DEF vô song, hỗ trợ kỹ năng thức tỉnh và hào quang hiệu triệu cực hiếm trong vũ trụ Riftbound.
              </p>

              {/* Highlight Perks Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-900/80 border border-rift-border rounded-xl p-3 text-center">
                  <div className="text-amber-400 font-black text-sm md:text-base">{featuredPack.cardCount} Lá</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Số lượng thẻ</div>
                </div>
                <div className="bg-slate-900/80 border border-rift-border rounded-xl p-3 text-center">
                  <div className="text-rose-400 font-black text-sm md:text-base">50%</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Tỉ Lệ Mythic</div>
                </div>
                <div className="bg-slate-900/80 border border-rift-border rounded-xl p-3 text-center">
                  <div className="text-purple-400 font-black text-sm md:text-base">50%</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Tỉ Lệ Epic</div>
                </div>
                <div className="bg-slate-900/80 border border-rift-border rounded-xl p-3 text-center">
                  <div className="text-emerald-400 font-black text-sm md:text-base">100%</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Cấp Cao Nhất</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => startOpenPack(featuredPack)}
                  className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-xs md:text-sm uppercase tracking-wider transition shadow-xl shadow-amber-500/25 active:scale-95 flex items-center space-x-2"
                >
                  <Layers className="w-4 h-4 fill-slate-950" />
                  <span>Xé Gói Thần Khí Ngay ({featuredPack.price} $RIFT ~ {formatEthEquivalent ? formatEthEquivalent(featuredPack.price) : '0 ETH'})</span>
                </button>

                <button
                  onClick={() => setOddsModalPack(featuredPack)}
                  className="bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 px-4 py-3 rounded-2xl text-xs font-bold transition flex items-center space-x-1.5"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Xem Bảng Tỉ Lệ Rơi Thẻ</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          FILTER & CATEGORY SELECTION TABS
      ======================================================== */}
      {openingStage === 'idle' && (
        <div className="space-y-4 mb-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: `Tất Cả (${packs.length})`, icon: Layers },
                { id: 'popular', label: '⭐ Thịnh Hành', icon: Star },
                { id: 'starter', label: '🔰 Tân Thủ & Phổ Thông', icon: Shield },
                { id: 'domain', label: '⚡ Hệ Tộc Chuyên Sâu', icon: Flame },
                { id: 'mythic', label: '👑 Thần Khí & Hoàng Gia', icon: Crown },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = filterCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setFilterCategory(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                        : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-rift-border'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search and Sort controls */}
            <div className="flex items-center space-x-3 w-full md:w-auto">
              {/* Search input */}
              <div className="relative flex-1 md:w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm gói theo tên, hệ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-rift-border rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Sorter */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-900 border border-rift-border rounded-xl px-3 py-1.5 text-xs font-medium text-slate-300 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="default">Sắp Xếp: Mặc Định</option>
                  <option value="price-asc">Giá: Thấp Đến Cao</option>
                  <option value="price-desc">Giá: Cao Đến Thấp</option>
                  <option value="cards-desc">Số Lượng Thẻ: Nhiều Nhất</option>
                </select>
              </div>

            </div>

          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Hiển thị {displayedPacks.length} trên tổng số {packs.length} gói thẻ bài</span>
            <span>💡 Nhấn vào thẻ để xem tỉ lệ rơi thẻ chi tiết</span>
          </div>

        </div>
      )}

      {/* ========================================================
          ANIMATION CUTSCENE: SHAKING & TEARING
      ======================================================== */}
      {(openingStage === 'shaking' || openingStage === 'tearing') && selectedPack && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/92 backdrop-blur-2xl animate-fade-in select-none">
          
          {/* Energy aura glow in the background */}
          <div
            className="w-[450px] h-[450px] rounded-full blur-[100px] absolute pointer-events-none transition-all duration-700 animate-pulse"
            style={{
              backgroundColor: selectedPack.color || '#a855f7',
              opacity: openingStage === 'tearing' ? 0.8 : 0.4,
            }}
          ></div>

          {/* Booster Pack 3D Visual in Opening Stage */}
          <div className="relative z-10 flex flex-col items-center">
            
            {/* Top Light Laser Slice Effect on Tearing */}
            {openingStage === 'tearing' && (
              <>
                <div className="absolute -top-32 w-16 h-72 bg-gradient-to-t from-white via-amber-300 to-transparent blur-md animate-beam-burst z-30"></div>
                <div className="absolute top-12 left-1/2 -translate-x-1/2 w-80 h-1.5 bg-white shadow-[0_0_25px_#fbbf24] animate-laser-tear z-40"></div>
              </>
            )}

            {/* The Floating Foil Booster Pack */}
            <div
              className={`w-72 md:w-80 rounded-3xl overflow-hidden shadow-2xl border-4 relative flex flex-col justify-between transition-all duration-300 ${
                openingStage === 'shaking' ? 'animate-pack-shake' : 'scale-105'
              }`}
              style={{
                backgroundColor: '#090d16',
                borderColor: selectedPack.color || '#a855f7',
                boxShadow: `0 0 60px ${selectedPack.glowColor || 'rgba(168, 85, 247, 0.6)'}`,
              }}
            >
              {/* Top Crimp Seam with Slot */}
              <div className="foil-crimp h-6 w-full flex items-center justify-center border-b border-white/20 relative">
                <div className="w-10 h-2 rounded-full bg-slate-950 border border-white/30"></div>
                {openingStage === 'tearing' && (
                  <div className="absolute inset-0 bg-amber-400/30 animate-pulse"></div>
                )}
              </div>

              {/* Shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>

              {/* Inner Pack Content */}
              <div className="p-6 flex flex-col items-center text-center">
                <span
                  className="text-[10px] uppercase font-black px-3 py-1 rounded-full border shadow-sm tracking-widest mb-3"
                  style={{
                    backgroundColor: `${selectedPack.color}25`,
                    borderColor: selectedPack.color,
                    color: selectedPack.color,
                  }}
                >
                  {selectedPack.tier}
                </span>

                <h3 className="font-cinzel text-2xl font-black text-white">{selectedPack.name}</h3>
                <p className="text-xs text-slate-300 font-medium mb-4">{selectedPack.subtitle}</p>

                {/* Pack Image */}
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/20 relative shadow-2xl mb-4">
                  <img
                    src={selectedPack.image}
                    alt={selectedPack.name}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/14a52a367fd41fd84745e050e62d1f281f733467-1038x744.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-2 left-3 right-3 flex justify-between text-xs font-bold text-amber-300">
                    <span>⚡ {selectedPack.cardCount} Lá Bài</span>
                    <span>{selectedPack.domainFocus}</span>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-2 text-amber-300 text-sm font-bold uppercase tracking-wider animate-pulse">
                    <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                    <span>
                      {openingStage === 'shaking'
                        ? '⚡ Đang tập hợp ma thuật...'
                        : '💥 Đang xé mở phong ấn!'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {openingStage === 'shaking' ? 'Chuẩn bị giải phóng sức mạnh các chòm sao' : 'Thẻ bài đang tràn ra đấu trường...'}
                  </p>
                </div>
              </div>

              {/* Bottom Crimp */}
              <div className="foil-crimp h-6 w-full border-t border-white/20 flex items-center justify-center">
                <span className="text-[9px] tracking-widest text-white/50 uppercase font-mono font-bold">
                  RIFTBOUND TCG VERIFIED PACK
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          REVEAL SCREEN: THE VELVET RUNIC ARENA TABLE
      ======================================================== */}
      {openingStage === 'revealed' && selectedPack && (
        <div className="bg-gradient-to-b from-slate-900/95 via-purple-950/20 to-slate-950 border border-purple-500/50 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden animate-fade-in text-center">
          
          {/* Subtle cosmic background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-96 bg-purple-600/10 blur-[120px] pointer-events-none"></div>

          {/* Reveal Header & Action Bar */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5 mb-8 pb-6 border-b border-rift-border">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Đã Xé Phong Ấn: {selectedPack.name}</span>
              </div>
              <h2 className="font-cinzel text-2xl md:text-3xl font-black text-slate-100">
                Thu Thập Được {revealedCards.length} Thẻ Bài Mới!
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Đã lật mở: <span className="text-amber-400 font-bold">{flippedIndices.length}/{revealedCards.length}</span> thẻ
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Reveal All Button */}
              {!allRevealed && (
                <button
                  onClick={revealAllCards}
                  disabled={isAutoRevealing}
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-purple-500/25 active:scale-95 flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>{isAutoRevealing ? 'Đang Lật Mở...' : 'Lật Mở Tất Cả'}</span>
                </button>
              )}

              {/* Re-Open Same Pack */}
              <button
                onClick={handleReopenSamePack}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-500 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Mở Tiếp Gói Này</span>
              </button>

              {/* Return to Packs Store */}
              <button
                onClick={resetPackOpening}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition"
              >
                <span>Cửa Hàng Gói</span>
              </button>

              {/* View in Collection */}
              <button
                onClick={() => setActiveTab('inventory')}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center space-x-1.5 transition shadow-md shadow-amber-500/20"
              >
                <span>Bộ Sưu Tập</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Hint text */}
          {!allRevealed && (
            <div className="relative z-10 inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-purple-500/30 text-purple-300 text-xs font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Rê chuột lên thẻ úp để cảm nhận hào quang độ hiếm • Bấm để lật mở</span>
            </div>
          )}

          {/* Celebration Banner for High Rarity Pulls */}
          {allRevealed && highestPull && (highestPull.rarity === 'Mythic' || highestPull.rarity === 'Legendary') && (
            <div className="relative z-10 bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 border border-amber-500/40 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in shadow-xl">
              <div className="flex items-center space-x-3 text-left">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
                  <Trophy className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <div className="text-amber-400 font-black text-sm uppercase tracking-wider">
                    🎉 CHÚC MỪNG BẠN MỞ TRÚNG THẺ {highestPull.rarity.toUpperCase()} CỰC HIẾM!
                  </div>
                  <div className="text-xs text-slate-200">
                    Lá bài <strong className="text-amber-300 font-bold">{highestPull.name}</strong> đã được thêm vĩnh viễn vào Bộ Sưu Tập của bạn.
                  </div>
                </div>
              </div>

              <button
                onClick={() => viewCardDetail(highestPull.scrydex_id || highestPull.id)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition whitespace-nowrap"
              >
                Chi Tiết Thẻ Này
              </button>
            </div>
          )}

          {/* Cards Grid with Interactive 3D Flip */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-center">
            {revealedCards.map((card, index) => {
              const isFlipped = flippedIndices.includes(index);
              const isHighRarity = card.rarity === 'Legendary' || card.rarity === 'Mythic';

              // Hidden rarity glow color for face-down card hover
              const getHiddenAura = () => {
                switch (card.rarity) {
                  case 'Mythic':
                    return 'hover:border-rose-500 hover:shadow-2xl hover:shadow-rose-500/50';
                  case 'Legendary':
                    return 'hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-400/50';
                  case 'Epic':
                    return 'hover:border-purple-400 hover:shadow-xl hover:shadow-purple-400/50';
                  case 'Rare':
                    return 'hover:border-sky-400 hover:shadow-lg hover:shadow-sky-400/40';
                  default:
                    return 'hover:border-slate-500 hover:shadow-slate-500/30';
                }
              };

              return (
                <div
                  key={index}
                  onClick={() => handleCardClick(index, card)}
                  className="cursor-pointer perspective-1000 group select-none"
                >
                  {isFlipped ? (
                    /* Face-Up Revealed Card */
                    <div className="animate-fade-in transform hover:scale-[1.03] transition-all duration-300 relative">
                      {isHighRarity && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-amber-400 via-rose-500 to-amber-400 text-slate-950 text-[10px] uppercase font-black px-3 py-0.5 rounded-full shadow-lg shadow-amber-500/50 whitespace-nowrap animate-bounce">
                          ✨ {card.rarity}! ✨
                        </div>
                      )}
                      <CardItem card={card} mode="codex" isRecentlyUpdated={true} />
                    </div>
                  ) : (
                    /* Face-Down Mystical Card Back */
                    <div
                      className={`aspect-[744/1039] rounded-2xl bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 border-2 border-purple-500/40 p-5 flex flex-col items-center justify-between text-center shadow-2xl ${getHiddenAura()} hover:scale-105 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden`}
                    >
                      {/* Card Back Intricate Runic Border */}
                      <div className="absolute inset-2 border border-purple-500/20 rounded-xl pointer-events-none"></div>
                      <div className="absolute inset-4 border border-amber-500/10 rounded-lg pointer-events-none"></div>

                      {/* Top Branding */}
                      <div className="pt-2">
                        <span className="font-cinzel text-[11px] font-black text-amber-400 tracking-widest block">
                          RIFTBOUND
                        </span>
                        <span className="text-[9px] uppercase font-mono text-purple-300/70 tracking-widest">
                          TRADING CARD
                        </span>
                      </div>

                      {/* Center Rune Emblem */}
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-900/60 to-slate-900/80 border-2 border-purple-400/50 flex items-center justify-center group-hover:rotate-45 transition-transform duration-500 shadow-inner">
                        <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
                      </div>

                      {/* Bottom Prompt */}
                      <div className="pb-2">
                        <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-200 tracking-wider group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                          BẤM ĐỂ LẬT
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================
          PACKS SELECTION STOREFRONT (AUTHENTIC 3D FOIL WRAPPERS)
      ======================================================== */}
      {openingStage === 'idle' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedPacks.map((pack) => {
            const canAfford = Number(balanceRift) >= pack.price;

            return (
              <div
                key={pack.id}
                className="relative group rounded-3xl p-1 transition-all duration-300 flex flex-col justify-between"
              >
                {/* 3D Vertical Booster Pack Wrapper */}
                <div
                  className="w-full h-full rounded-2xl border-2 flex flex-col justify-between overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl relative"
                  style={{
                    backgroundColor: '#0a0e1a',
                    borderColor: pack.popular ? '#a855f7' : '#1e2c45',
                    boxShadow: pack.popular
                      ? `0 10px 30px ${pack.glowColor || 'rgba(168, 85, 247, 0.2)'}`
                      : '0 4px 20px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  
                  {/* TOP FOIL CRIMP STRIP WITH HANGER HOLE */}
                  <div className="foil-crimp h-5 w-full flex items-center justify-center border-b border-white/10 relative">
                    <div className="w-7 h-1.5 rounded-full bg-slate-950/90 border border-white/20"></div>
                  </div>

                  {/* Shimmer on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none group-hover:via-white/15 transition-all"></div>

                  {/* Hot/Popular Tag */}
                  {pack.popular && (
                    <div className="absolute top-7 right-3 z-20 bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 text-[9px] uppercase font-black px-2 py-0.5 rounded-full shadow-md">
                      HOT PACK
                    </div>
                  )}

                  {/* MAIN CONTENT BODY */}
                  <div className="p-4 flex flex-col justify-between flex-1">
                    
                    <div>
                      {/* Tier & Domain Badges */}
                      <div className="flex items-center space-x-2 mb-2">
                        <span
                          className="text-[9px] uppercase font-black px-2 py-0.5 rounded-md border"
                          style={{
                            borderColor: pack.color,
                            color: pack.color,
                            backgroundColor: `${pack.color}15`,
                          }}
                        >
                          {pack.tier}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold truncate">
                          {pack.domainFocus}
                        </span>
                      </div>

                      {/* Pack Title */}
                      <h3 className="font-cinzel text-lg font-black text-slate-100 group-hover:text-amber-400 transition leading-snug">
                        {pack.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium mb-3">
                        {pack.subtitle}
                      </p>

                      {/* Art Frame */}
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-950 border border-white/10 mb-3 shadow-inner">
                        <img
                          src={pack.image}
                          alt={pack.name}
                          className="w-full h-full object-cover object-top group-hover:scale-110 transition duration-700"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/14a52a367fd41fd84745e050e62d1f281f733467-1038x744.png';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>
                        
                        {/* Card Count Pill */}
                        <div className="absolute bottom-2 left-2 bg-slate-950/90 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-black text-amber-300 border border-amber-500/30 flex items-center space-x-1">
                          <Layers className="w-3 h-3 text-amber-400" />
                          <span>{pack.cardCount} Lá Bài</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-[11px] text-slate-300/80 leading-relaxed line-clamp-2 mb-3">
                        {pack.description}
                      </p>

                      {/* Compact Drop Rates Matrix */}
                      <div className="bg-slate-950/60 border border-rift-border/70 rounded-xl p-2 mb-3">
                        <div className="flex items-center justify-between text-[9px] uppercase font-bold text-slate-400 mb-1 px-0.5">
                          <span>Tỉ Lệ Mở Thẻ</span>
                          <button
                            onClick={() => setOddsModalPack(pack)}
                            className="text-purple-400 hover:text-purple-300 hover:underline inline-flex items-center space-x-0.5"
                          >
                            <span>Chi tiết</span>
                            <Info className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-4 gap-1 text-center">
                          {pack.dropRates.map((d, i) => (
                            <div
                              key={i}
                              className="bg-slate-900/90 rounded-md p-1 border border-rift-border/40"
                            >
                              <div className="text-[8px] text-slate-400 truncate">{d.rarity}</div>
                              <div
                                className={`text-[10px] font-black mt-0.5 ${
                                  d.rarity === 'Mythic'
                                    ? 'text-rose-400'
                                    : d.rarity === 'Epic'
                                    ? 'text-purple-400'
                                    : d.rarity === 'Rare'
                                    ? 'text-sky-400'
                                    : 'text-slate-300'
                                }`}
                              >
                                {d.rate}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Purchase Footer */}
                    <div className="pt-2 border-t border-rift-border/60 flex items-center justify-between mt-auto">
                      <div>
                        <div className="text-[9px] text-slate-400 uppercase font-bold">Giá Gói</div>
                        <div className="text-base font-black text-amber-400 leading-tight">
                          {pack.price} <span className="text-[10px] font-bold text-slate-300">$RIFT</span>
                        </div>
                        <div className="text-[10px] text-cyan-400/90 font-mono font-medium leading-none mt-0.5">
                          ~{formatEthEquivalent ? formatEthEquivalent(pack.price) : '0 ETH'}
                        </div>
                      </div>

                      <button
                        onClick={() => startOpenPack(pack)}
                        disabled={!canAfford}
                        className={`font-black px-3.5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition flex items-center space-x-1.5 active:scale-95 ${
                          canAfford
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>{canAfford ? 'Xé Gói Ngay' : 'Thiếu $RIFT'}</span>
                      </button>
                    </div>

                  </div>

                  {/* BOTTOM FOIL CRIMP STRIP */}
                  <div className="foil-crimp h-5 w-full border-t border-white/10 flex items-center justify-center">
                    <span className="text-[8px] tracking-widest text-white/40 uppercase font-mono">
                      SEALED FOIL PACK
                    </span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================
          MODAL: DETAILED VERIFIABLE DROP RATES & INFO
      ======================================================== */}
      {oddsModalPack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            
            <button
              onClick={() => setOddsModalPack(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: oddsModalPack.color }}
              >
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">{oddsModalPack.tier}</span>
                <h3 className="font-cinzel text-xl font-bold text-white">{oddsModalPack.name}</h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              {oddsModalPack.description}
            </p>

            <div className="bg-slate-950 rounded-2xl p-4 border border-rift-border mb-6">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Xác Suất Rơi Thẻ (Provably Fair TCG)
              </div>
              <div className="space-y-2.5">
                {oddsModalPack.dropRates.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300">{d.rarity}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: d.rate,
                            backgroundColor:
                              d.rarity === 'Mythic'
                                ? '#f43f5e'
                                : d.rarity === 'Epic'
                                ? '#c084fc'
                                : d.rarity === 'Rare'
                                ? '#38bdf8'
                                : '#94a3b8',
                          }}
                        ></div>
                      </div>
                      <span className="font-black text-amber-400 w-10 text-right">{d.rate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-400">
                Giá mở: <strong className="text-amber-400 font-bold">{oddsModalPack.price} $RIFT</strong> / gói
              </div>
              <button
                onClick={() => {
                  const p = oddsModalPack;
                  setOddsModalPack(null);
                  startOpenPack(p);
                }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition"
              >
                Mở Gói Này Ngay
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
