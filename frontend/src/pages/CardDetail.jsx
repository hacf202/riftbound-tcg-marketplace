import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import BuyModal from '../components/BuyModal';
import { universalFetch, API_BASE } from '../utils/api';
import { DEFAULT_CARDS } from '../data/defaultData';

export default function CardDetail({ cardId, onBack }) {
  const { account, balanceRift, dataVersion, triggerRefresh, formatEthEquivalent, cancelListing } = useWeb3();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariation, setSelectedVariation] = useState('normal'); // 'normal' | 'foil' | 'signature'
  const [selectedListing, setSelectedListing] = useState(null);

  useEffect(() => {
    if (!cardId) return;
    setIsLoading(true);

    const fallbackCard = DEFAULT_CARDS.find((c) => Number(c.id) === Number(cardId)) || DEFAULT_CARDS[0];

    universalFetch(`${API_BASE}/cards/${cardId}/market`)
      .then((resData) => {
        if (
          resData &&
          resData.success &&
          resData.data &&
          !Array.isArray(resData.data) &&
          resData.data.card
        ) {
          setData(resData.data);
        } else {
          setData({
            card: fallbackCard,
            floorPrice: fallbackCard.marketFloorPrice || 35,
            activeListings: [],
            recentSales: [],
            variations: [
              { id: 'normal', name: 'Bản Thường (Normal)', type: 'Standard', floorPrice: fallbackCard.marketFloorPrice || 35, usdPrice: ((fallbackCard.marketFloorPrice || 35) * 0.15).toFixed(2), isAvailable: true },
              { id: 'foil', name: 'Thẻ Lấp Lánh (Holo Foil)', type: 'Foil', floorPrice: Math.round((fallbackCard.marketFloorPrice || 35) * 1.8), usdPrice: (Math.round((fallbackCard.marketFloorPrice || 35) * 1.8) * 0.15).toFixed(2), isAvailable: true },
              { id: 'signature', name: 'Chữ Ký Họa Sĩ (Signature)', type: 'Showcase', floorPrice: Math.round((fallbackCard.marketFloorPrice || 35) * 3.5), usdPrice: (Math.round((fallbackCard.marketFloorPrice || 35) * 3.5) * 0.15).toFixed(2), isAvailable: true },
            ],
            marketStats: {
              totalMinted: fallbackCard.totalMinted || 100,
              activeListingsCount: 0,
              totalVolume: 0,
              lastSalePrice: fallbackCard.marketFloorPrice || 35,
            },
          });
        }
      })
      .catch(() => {
        setData({
          card: fallbackCard,
          floorPrice: fallbackCard.marketFloorPrice || 35,
          activeListings: [],
          recentSales: [],
          variations: [
            { id: 'normal', name: 'Bản Thường (Normal)', type: 'Standard', floorPrice: fallbackCard.marketFloorPrice || 35, usdPrice: ((fallbackCard.marketFloorPrice || 35) * 0.15).toFixed(2), isAvailable: true },
          ],
          marketStats: {
            totalMinted: fallbackCard.totalMinted || 100,
            activeListingsCount: 0,
            totalVolume: 0,
            lastSalePrice: fallbackCard.marketFloorPrice || 35,
          },
        });
      })
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

  const fallbackCard = DEFAULT_CARDS.find((c) => Number(c.id) === Number(cardId)) || DEFAULT_CARDS[0];
  const card = (data && !Array.isArray(data) && data.card) || fallbackCard;
  const floorPrice = (data && data.floorPrice) || card?.marketFloorPrice || 35;
  const activeListings = (data && Array.isArray(data.activeListings)) ? data.activeListings : [];
  const recentSales = (data && Array.isArray(data.recentSales)) ? data.recentSales : [];
  const variations = (data && Array.isArray(data.variations) && data.variations.length > 0)
    ? data.variations
    : [
        { id: 'normal', name: 'Bản Thường (Normal)', type: 'Standard', floorPrice: floorPrice, usdPrice: (floorPrice * 0.15).toFixed(2), isAvailable: true },
        { id: 'foil', name: 'Thẻ Lấp Lánh (Holo Foil)', type: 'Foil', floorPrice: Math.round(floorPrice * 1.8), usdPrice: (Math.round(floorPrice * 1.8) * 0.15).toFixed(2), isAvailable: true },
        { id: 'signature', name: 'Chữ Ký Họa Sĩ (Signature)', type: 'Showcase', floorPrice: Math.round(floorPrice * 3.5), usdPrice: (Math.round(floorPrice * 3.5) * 0.15).toFixed(2), isAvailable: true },
      ];
  const marketStats = (data && data.marketStats) || {
    totalMinted: card?.totalMinted || 100,
    activeListingsCount: activeListings.length,
    totalVolume: 0,
    lastSalePrice: floorPrice,
  };
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
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-5 animate-fade-in space-y-5">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-400 hover:text-amber-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Sàn Giao Dịch</span>
        </button>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span>{card.expansion?.name || 'Origins'}</span>
          <span>/</span>
          <span className="font-bold text-amber-400">{card.name}</span>
        </div>
      </div>

      {/* Main Showcase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Large Card Visual */}
        <div className="lg:col-span-5 flex flex-col items-center space-y-4">
          <div className="relative w-full max-w-[340px]">
            <div
              className={`relative aspect-[744/1039] rounded-2xl overflow-hidden bg-slate-950 border p-1 shadow-xl transition-all duration-300 ${
                selectedVariation === 'signature'
                  ? 'border-rose-500'
                  : selectedVariation === 'foil'
                  ? 'border-amber-400'
                  : 'border-slate-800'
              }`}
            >
              <img
                src={card.image || (card.images && card.images.front)}
                alt={card.name}
                className="w-full h-full object-contain object-center rounded-xl"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/14a52a367fd41fd84745e050e62d1f281f733467-1038x744.png';
                }}
              />

              {(selectedVariation === 'foil' || selectedVariation === 'signature') && (
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-400/15 to-transparent pointer-events-none rounded-xl"></div>
              )}
            </div>
          </div>

          {/* Print Variation Selector */}
          <div className="w-full max-w-[340px] bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Phiên Bản In
            </div>
            <div className="grid grid-cols-3 gap-2">
              {variations.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariation(v.id)}
                  className={`p-2 rounded-lg border text-center transition flex flex-col items-center justify-center ${
                    selectedVariation === v.id
                      ? 'bg-amber-500/15 border-amber-500/70 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold truncate">{v.name.split(' ')[0]}</span>
                  <span className="text-[10px] font-mono mt-0.5 text-amber-400 font-bold">
                    {v.floorPrice} $RIFT
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Card Header & Emblems */}
          <div>
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                {card.public_code || `#${card.printed_number}`}
              </span>
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getDomainColor(card.domain)}`}>
                {card.domain}
              </span>
              <span className={`text-[11px] uppercase font-bold px-2 py-0.5 rounded border ${getRarityBadge(card.rarity)}`}>
                {card.rarity}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                {card.type}
              </span>
            </div>

            <h1 className="font-cinzel text-2xl md:text-3xl font-bold text-slate-100">
              {card.name}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {card.title} • {card.expansion?.name || 'Origins (OGN)'}
            </p>
          </div>

          {/* Market Floor Price Banner */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Giá Sàn ({currentVar.name.split(' ')[0]})
              </div>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-2xl font-black text-amber-400 font-mono">
                  {currentVar.floorPrice} $RIFT
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  (~{formatEthEquivalent ? formatEthEquivalent(currentVar.floorPrice) : '0 ETH'})
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
                    className="w-full sm:w-auto bg-rose-950/80 hover:bg-rose-900 border border-rose-500/60 text-rose-300 font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-wider transition"
                  >
                    Hủy Niêm Yết
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedListing(activeListings[0])}
                    className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-wider transition"
                  >
                    Mua Ngay ({activeListings[0].pricePerItem} $RIFT)
                  </button>
                )
              ) : (
                <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  Chưa có lệnh bán
                </div>
              )}
            </div>
          </div>

          {/* Combat Stats Ticker */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Năng Lượng</div>
              <div className="text-sm font-bold text-slate-100">{card.cost}</div>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Công</div>
              <div className="text-sm font-bold text-amber-400">{card.power} ATK</div>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Thủ</div>
              <div className="text-sm font-bold text-slate-200">{card.might} DEF</div>
            </div>
          </div>

          {/* Rules & Abilities */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              Hiệu Ứng & Kỹ Năng
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-200 leading-relaxed">
              {card.ability || (card.rules && card.rules[0])}
            </div>
            {card.lore && (
              <p className="text-[11px] text-slate-400 italic">
                "{card.lore}"
              </p>
            )}
          </div>

          {/* Specifications Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
            <div className="text-xs uppercase font-bold text-slate-300 tracking-wider">
              Thông Số Thẻ Bài
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Mã Định Danh:</span>
                <strong className="text-slate-200 font-mono">{card.scrydex_id || card.public_code}</strong>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Số Thứ Tự:</span>
                <strong className="text-slate-200">{card.printed_number}</strong>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Họa Sĩ:</span>
                <strong className="text-slate-200 truncate block">{card.artist || 'Envar Studio'}</strong>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Bộ Sưu Tập:</span>
                <strong className="text-slate-200">{card.expansion?.name} ({card.expansion?.code})</strong>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Tiêu Chuẩn Token:</span>
                <strong className="text-amber-400">ERC-1155 (#{card.id})</strong>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Phí Tác Quyền:</span>
                <strong className="text-slate-200">2.5%</strong>
              </div>
            </div>
          </div>

          {/* Active Marketplace Listings Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
            <div className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              Danh Sách Đang Rao Bán ({activeListings.length})
            </div>

            {activeListings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase font-semibold">
                      <th className="py-2 px-2">Người Bán</th>
                      <th className="py-2 px-2">Số Lượng</th>
                      <th className="py-2 px-2">Đơn Giá</th>
                      <th className="py-2 px-2 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {activeListings.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-2 px-2 font-mono text-[11px] text-slate-300">
                          {l.seller.slice(0, 6)}...{l.seller.slice(-4)}
                        </td>
                        <td className="py-2 px-2 font-bold text-slate-200">
                          x{l.quantity}
                        </td>
                        <td className="py-2 px-2 font-black text-amber-400 font-mono">
                          {l.pricePerItem} $RIFT
                        </td>
                        <td className="py-2 px-2 text-right">
                          {l.seller?.toLowerCase() === account?.toLowerCase() ? (
                            <button
                              onClick={() => cancelListing && cancelListing(l.id || l.listingId)}
                              className="bg-rose-950/70 hover:bg-rose-900 border border-rose-500/50 text-rose-300 font-bold px-2.5 py-1 rounded text-xs uppercase transition"
                            >
                              Hủy Bán
                            </button>
                          ) : (
                            <button
                              onClick={() => setSelectedListing(l)}
                              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded text-xs uppercase transition"
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
              <p className="text-xs text-slate-400 py-2 text-center">
                Chưa có ai niêm yết bán lá bài này.
              </p>
            )}
          </div>

          {/* Recent Sales History */}
          {recentSales.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
              <div className="text-xs uppercase font-bold text-slate-300 tracking-wider">
                Lịch Sử Giao Dịch
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase font-semibold">
                      <th className="py-2 px-2">Loại</th>
                      <th className="py-2 px-2">Người Mua</th>
                      <th className="py-2 px-2">Số Lượng</th>
                      <th className="py-2 px-2">Giá Trị</th>
                      <th className="py-2 px-2 text-right">Thời Gian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {recentSales.map((tx) => (
                      <tr key={tx.id} className="text-slate-300">
                        <td className="py-2 px-2 font-bold text-amber-400">{tx.type}</td>
                        <td className="py-2 px-2 font-mono text-[10px]">{tx.user_address?.slice(0, 6)}...</td>
                        <td className="py-2 px-2 font-semibold">x{tx.quantity || 1}</td>
                        <td className="py-2 px-2 font-bold text-amber-400 font-mono">{tx.total_price || tx.price} $RIFT</td>
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
            universalFetch(`${API_BASE}/cards/${cardId}/market`)
              .then((res) => res && res.success && setData(res.data));
          }}
        />
      )}
    </div>
  );
}
