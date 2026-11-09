import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  Swords, 
  Shield, 
  Zap, 
  Tag, 
  ShoppingBag, 
  Clock, 
  Layers, 
  CheckCircle2, 
  Coins, 
  Eye, 
  Share2,
  XCircle,
  UserCheck
} from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import BuyModal from '../components/BuyModal';

export default function CardDetail({ cardId, onBack }) {
  const { API_BASE, account, balanceRift, dataVersion, triggerRefresh, formatEthEquivalent, cancelListing } = useWeb3();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariation, setSelectedVariation] = useState('normal'); // 'normal' | 'foil' | 'signature'
  const [selectedListing, setSelectedListing] = useState(null);

  useEffect(() => {
    if (!cardId) return;
    setIsLoading(true);

    fetch(`${API_BASE}/cards/${cardId}/market`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          setData(resData.data);
        } else {
          // Fallback fetch regular card
          fetch(`${API_BASE}/cards/${cardId}`)
            .then((r) => r.json())
            .then((cd) => {
              if (cd.success) {
                setData({
                  card: cd.data,
                  floorPrice: cd.data.marketFloorPrice,
                  activeListings: [],
                  recentSales: [],
                  variations: [
                    { id: 'normal', name: 'Bản Thường (Normal)', type: 'Standard', floorPrice: cd.data.marketFloorPrice, usdPrice: (cd.data.marketFloorPrice * 0.15).toFixed(2), isAvailable: true },
                    { id: 'foil', name: 'Thẻ Lấp Lánh (Holo Foil)', type: 'Foil', floorPrice: Math.round(cd.data.marketFloorPrice * 1.8), usdPrice: (cd.data.marketFloorPrice * 1.8 * 0.15).toFixed(2), isAvailable: true },
                    { id: 'signature', name: 'Chữ Ký Họa Sĩ (Signature)', type: 'Showcase', floorPrice: Math.round(cd.data.marketFloorPrice * 3.5), usdPrice: (cd.data.marketFloorPrice * 3.5 * 0.15).toFixed(2), isAvailable: true },
                  ],
                  marketStats: {
                    totalMinted: cd.data.totalMinted,
                    activeListingsCount: 0,
                    totalVolume: 0,
                    lastSalePrice: cd.data.marketFloorPrice,
                  },
                });
              }
            });
        }
      })
      .catch((err) => console.error('Lỗi tải chi tiết lá bài:', err))
      .finally(() => setIsLoading(false));
  }, [cardId, dataVersion]);

  if (isLoading || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-400 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium text-xs">Đang nạp dữ liệu chi tiết thẻ bài chuẩn Scrydex & Bilgewater Market...</p>
      </div>
    );
  }

  const { card, floorPrice, activeListings, recentSales, variations, marketStats } = data;
  const currentVar = variations.find((v) => v.id === selectedVariation) || variations[0];

  const getRarityBadge = (rarity) => {
    switch (rarity) {
      case 'Mythic':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-rose-500/20';
      case 'Legendary':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-amber-500/20';
      case 'Epic':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-purple-500/20';
      case 'Rare':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-sky-500/20';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40 shadow-slate-500/10';
    }
  };

  const getDomainColor = (domain) => {
    switch (domain) {
      case 'Fury':
      case 'Inferno':
        return 'text-rose-400 bg-rose-950/60 border-rose-500/40';
      case 'Mind':
      case 'Calm':
      case 'Astral':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40';
      case 'Body':
      case 'Abyssal':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
      case 'Chaos':
      case 'Void':
        return 'text-purple-400 bg-purple-950/60 border-purple-500/40';
      case 'Order':
        return 'text-amber-400 bg-amber-950/60 border-amber-500/40';
      case 'Colorless':
        return 'text-slate-300 bg-slate-800/80 border-slate-600/50';
      default:
        return 'text-slate-400 bg-slate-900 border-slate-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between border-b border-rift-border/60 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-amber-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Chợ Thẻ / Marketplace</span>
        </button>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span>Codex</span>
          <span>/</span>
          <span className="text-slate-300">{card.expansion?.name || 'Origins (OGN)'}</span>
          <span>/</span>
          <span className="font-bold text-amber-400">{card.name}</span>
        </div>
      </div>

      {/* Main Showcase Layout (Inspired by Bilgewater Market Card View) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Large Card Visual + Foil Sheen + Variations (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center space-y-6">
          <div className="relative w-full max-w-[380px] group">
            {/* Holographic Foil Glow Effect */}
            <div
              className={`relative aspect-[744/1039] rounded-2xl overflow-hidden bg-slate-950 border-2 p-1.5 shadow-2xl transition-all duration-500 ${
                selectedVariation === 'signature'
                  ? 'border-rose-500 shadow-rose-500/40 hover:scale-[1.02]'
                  : selectedVariation === 'foil'
                  ? 'border-amber-400 shadow-amber-500/40 hover:scale-[1.02]'
                  : 'border-rift-border shadow-slate-950/80'
              }`}
            >
              {/* Full Authentic Riot Card Image */}
              <img
                src={card.image || (card.images && card.images.front)}
                alt={card.name}
                className="w-full h-full object-contain object-center rounded-xl"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/14a52a367fd41fd84745e050e62d1f281f733467-1038x744.png';
                }}
              />

              {/* Shimmer Foil Overlay */}
              {(selectedVariation === 'foil' || selectedVariation === 'signature') && (
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/20 to-amber-400/25 pointer-events-none rounded-xl animate-pulse mix-blend-overlay"></div>
              )}

              {/* Signature Badge */}
              {selectedVariation === 'signature' && (
                <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl border border-rose-500/60 text-[10px] font-black text-rose-300 flex items-center space-x-1 shadow-lg">
                  <Sparkles className="w-3 h-3 text-rose-400" />
                  <span>SIGNATURE EDITION</span>
                </div>
              )}
            </div>

            {/* Hint text */}
            <p className="text-center text-[11px] text-slate-500 mt-3">
              💡 Thẻ hiển thị nguyên bản theo tỷ lệ 744x1039 chuẩn giải đấu TCG quốc tế
            </p>
          </div>

          {/* Print Variation Selector (Bản in: Normal, Foil, Signature) */}
          <div className="w-full max-w-[380px] bg-rift-card border border-rift-border rounded-2xl p-3.5 space-y-2">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Chọn Phiên Bản In (Print Variations)
            </div>
            <div className="grid grid-cols-3 gap-2">
              {variations.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariation(v.id)}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                    selectedVariation === v.id
                      ? 'bg-amber-500/15 border-amber-500/70 text-amber-300 shadow-sm'
                      : 'bg-slate-900/60 border-rift-border text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold truncate">{v.name.split(' ')[0]}</span>
                  <span className="text-[10px] font-mono mt-0.5 text-amber-400 font-extrabold">
                    {v.floorPrice} $RIFT
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Scrydex Specs + Market Actions + Live Listings (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card Header & Emblems */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-slate-900 text-cyan-300 border border-rift-border">
                {card.public_code || `#${card.printed_number}`}
              </span>
              <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${getDomainColor(card.domain)}`}>
                {card.domain}
              </span>
              <span className={`text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-lg border ${getRarityBadge(card.rarity)}`}>
                {card.rarity}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-900 text-slate-300 border border-rift-border">
                {card.type}
              </span>
            </div>

            <h1 className="font-cinzel text-3xl md:text-4xl font-black text-slate-100 tracking-wide">
              {card.name}
            </h1>
            <p className="text-sm text-slate-400 font-medium italic mt-1">
              {card.title} • {card.expansion?.name || 'Origins (OGN)'}
            </p>
          </div>

          {/* Market Floor Price Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900/80 to-cyan-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Giá Sàn Thị Trường ({currentVar.name})
              </div>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-2xl md:text-3xl font-black text-amber-400 tracking-tight font-mono">
                  {currentVar.floorPrice} $RIFT
                </span>
                <span className="text-xs text-cyan-400 font-mono">
                  (~{formatEthEquivalent ? formatEthEquivalent(currentVar.floorPrice) : '0 ETH'} • ${currentVar.usdPrice} USD)
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              {activeListings.length > 0 ? (
                activeListings[0].seller?.toLowerCase() === account?.toLowerCase() ? (
                  <button
                    onClick={async () => {
                      await cancelListing(activeListings[0].id || activeListings[0].listingId);
                      if (onBack) onBack();
                    }}
                    className="w-full sm:w-auto bg-rose-950/80 hover:bg-rose-900 border border-rose-500/60 text-rose-300 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg active:scale-95 flex items-center justify-center space-x-1.5"
                  >
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>Thẻ Của Bạn (Hủy Niêm Yết)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedListing(activeListings[0])}
                    className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/25 active:scale-95 flex items-center justify-center space-x-1.5"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Mua Ngay ({activeListings[0].pricePerItem} $RIFT)</span>
                  </button>
                )
              ) : (
                <div className="text-xs font-semibold text-slate-400 bg-slate-900 px-3 py-2 rounded-xl border border-rift-border">
                  Hiện chưa có lệnh bán thẻ này
                </div>
              )}
            </div>
          </div>

          {/* Combat Stats Ticker */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-rift-border flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-300">
                <Zap className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Chi Phí (Energy)</div>
                <div className="text-base font-black text-slate-100">{card.cost}</div>
              </div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-rift-border flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-rose-950/80 border border-rose-500/50 flex items-center justify-center text-rose-300">
                <Swords className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Công (Power)</div>
                <div className="text-base font-black text-rose-400">{card.power} ATK</div>
              </div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-rift-border flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-300">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Thủ (Might)</div>
                <div className="text-base font-black text-cyan-400">{card.might} DEF</div>
              </div>
            </div>
          </div>

          {/* Rules & Abilities */}
          <div className="bg-rift-card border border-rift-border rounded-2xl p-4 space-y-3">
            <div className="text-xs uppercase font-bold text-amber-400 tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Hiệu Ứng & Kỹ Năng Chiến Đấu</span>
            </div>
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-rift-border/60 text-xs text-slate-200 leading-relaxed font-sans">
              {card.ability || (card.rules && card.rules[0])}
            </div>

            <div className="text-[11px] text-slate-400 italic pt-1">
              <strong>Mô tả lore:</strong> "{card.lore}"
            </div>
          </div>

          {/* Scrydex Specifications Grid Table */}
          <div className="bg-rift-card border border-rift-border rounded-2xl p-4 space-y-3">
            <div className="text-xs uppercase font-bold text-slate-300 tracking-wider flex items-center space-x-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Thông Số Kỹ Thuật (Scrydex & ERC-1155 Spec)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-900/70 p-2.5 rounded-xl border border-rift-border/50">
                <span className="text-slate-400 block text-[10px]">Mã Định Danh:</span>
                <strong className="text-cyan-300 font-mono">{card.scrydex_id || card.public_code}</strong>
              </div>
              <div className="bg-slate-900/70 p-2.5 rounded-xl border border-rift-border/50">
                <span className="text-slate-400 block text-[10px]">Số Thứ Tự In:</span>
                <strong className="text-slate-200">{card.printed_number}</strong>
              </div>
              <div className="bg-slate-900/70 p-2.5 rounded-xl border border-rift-border/50">
                <span className="text-slate-400 block text-[10px]">Họa Sĩ (Artist):</span>
                <strong className="text-slate-200 truncate block">{card.artist || 'Envar Studio'}</strong>
              </div>
              <div className="bg-slate-900/70 p-2.5 rounded-xl border border-rift-border/50">
                <span className="text-slate-400 block text-[10px]">Bộ Mở Rộng:</span>
                <strong className="text-slate-200">{card.expansion?.name} ({card.expansion?.code})</strong>
              </div>
              <div className="bg-slate-900/70 p-2.5 rounded-xl border border-rift-border/50">
                <span className="text-slate-400 block text-[10px]">Tiêu Chuẩn Token:</span>
                <strong className="text-amber-400">ERC-1155 (ID: {card.id})</strong>
              </div>
              <div className="bg-slate-900/70 p-2.5 rounded-xl border border-rift-border/50">
                <span className="text-slate-400 block text-[10px]">Phí Bản Quyền:</span>
                <strong className="text-emerald-400">2.5% (ERC-2981)</strong>
              </div>
            </div>
          </div>

          {/* Active Marketplace Listings Table for this specific Card */}
          <div className="bg-rift-card border border-rift-border rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase font-bold text-amber-300 tracking-wider flex items-center space-x-2">
                <Tag className="w-4 h-4 text-amber-400" />
                <span>Các Lệnh Bán Thẻ Này Trên Sàn ({activeListings.length})</span>
              </div>
            </div>

            {activeListings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-rift-border text-[10px] text-slate-400 uppercase font-semibold">
                      <th className="py-2 px-2">Người Bán</th>
                      <th className="py-2 px-2">Số Lượng</th>
                      <th className="py-2 px-2">Đơn Giá</th>
                      <th className="py-2 px-2 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rift-border/40">
                    {activeListings.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-2.5 px-2 font-mono text-[11px] text-slate-300">
                          {l.seller.slice(0, 6)}...{l.seller.slice(-4)}
                        </td>
                        <td className="py-2.5 px-2 font-bold text-slate-200">
                          x{l.quantity}
                        </td>
                        <td className="py-2.5 px-2 font-black text-amber-400 font-mono">
                          {l.pricePerItem} $RIFT
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          {l.seller?.toLowerCase() === account?.toLowerCase() ? (
                            <button
                              onClick={() => cancelListing && cancelListing(l.id || l.listingId)}
                              className="bg-rose-950/70 hover:bg-rose-900 border border-rose-500/50 text-rose-300 font-bold px-2.5 py-1 rounded-lg text-[11px] uppercase transition shadow-sm active:scale-95"
                            >
                              Hủy Bán
                            </button>
                          ) : (
                            <button
                              onClick={() => setSelectedListing(l)}
                              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-lg text-[11px] uppercase transition shadow-sm"
                            >
                              Mua
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-3 text-center">
                Chưa có ai niêm yết bán lá bài này. Hãy là người đầu tiên đưa lên sàn!
              </p>
            )}
          </div>

          {/* Recent Sales History for this Card */}
          {recentSales.length > 0 && (
            <div className="bg-rift-card border border-rift-border rounded-2xl p-4 space-y-3">
              <div className="text-xs uppercase font-bold text-slate-300 tracking-wider flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Lịch Sử Giao Dịch Thẻ Này (SQLite)</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] text-left">
                  <thead>
                    <tr className="border-b border-rift-border text-[10px] text-slate-400 uppercase font-semibold">
                      <th className="py-2 px-2">Loại</th>
                      <th className="py-2 px-2">Người Mua</th>
                      <th className="py-2 px-2">Số Lượng</th>
                      <th className="py-2 px-2">Tổng Giá</th>
                      <th className="py-2 px-2 text-right">Thời Gian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rift-border/30">
                    {recentSales.map((tx) => (
                      <tr key={tx.id} className="text-slate-300">
                        <td className="py-2 px-2 font-bold text-emerald-400">{tx.type}</td>
                        <td className="py-2 px-2 font-mono text-[10px]">{tx.user_address?.slice(0, 6)}...</td>
                        <td className="py-2 px-2 font-semibold">x{tx.quantity || 1}</td>
                        <td className="py-2 px-2 font-bold text-amber-400">{tx.total_price || tx.price} $RIFT</td>
                        <td className="py-2 px-2 text-right text-slate-500 text-[10px]">{tx.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Modal Mua Thẻ Bài */}
      {selectedListing && (
        <BuyModal
          listing={selectedListing}
          card={card}
          onClose={() => setSelectedListing(null)}
          onSuccess={() => {
            // Reload card market data
            fetch(`${API_BASE}/cards/${cardId}/market`)
              .then((r) => r.json())
              .then((res) => res.success && setData(res.data));
          }}
        />
      )}
    </div>
  );
}
