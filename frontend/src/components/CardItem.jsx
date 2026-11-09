import React from 'react';
import { Sparkles, Eye, ShoppingCart, Tag, XCircle, UserCheck } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';

export default function CardItem({
  card,
  listing,
  quantity,
  onBuy,
  onSell,
  mode = 'marketplace', // 'marketplace' | 'inventory' | 'codex'
  isRecentlyUpdated = false,
}) {
  const { viewCardDetail, formatEthEquivalent, account, cancelListing } = useWeb3();

  if (!card) return null;

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
        return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
    }
  };

  const getBorderGlow = (rarity) => {
    switch (rarity) {
      case 'Mythic':
        return 'hover:border-rose-500/80 hover:shadow-xl hover:shadow-rose-500/20 border-slate-800';
      case 'Legendary':
        return 'hover:border-amber-500/80 hover:shadow-xl hover:shadow-amber-500/20 border-slate-800';
      case 'Epic':
        return 'hover:border-purple-500/80 hover:shadow-xl hover:shadow-purple-500/20 border-slate-800';
      case 'Rare':
        return 'hover:border-sky-500/80 hover:shadow-lg hover:shadow-sky-500/20 border-slate-800';
      default:
        return 'border-slate-800/80 hover:border-slate-600';
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
      default:
        return 'text-slate-400 bg-slate-900 border-slate-700';
    }
  };

  // Printed card number: e.g. "OGN-251/298"
  const printedNum = card.public_code || (card.printed_number ? `#${card.printed_number}` : `#${String(card.id).padStart(3, '0')}`);
  const cardIdRef = card.scrydex_id || card.id;
  const isBattlefield = card.type === 'Battlefield';
  const isOwnListing = Boolean(
    listing?.seller && account && listing.seller.toLowerCase() === account.toLowerCase()
  );

  const handleCardClick = () => {
    if (viewCardDetail) {
      viewCardDetail(cardIdRef);
    }
  };

  const cardImageSrc = card.image || (card.images && (card.images.medium || card.images.front || card.images.small));

  return (
    <div
      className={`group relative bg-slate-900/90 rounded-2xl border ${getBorderGlow(
        card.rarity
      )} overflow-hidden transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between p-2.5 shadow-lg shadow-black/40`}
    >
      {/* 1. TCG Card Art Frame - 100% Full Uncropped View */}
      <div
        onClick={handleCardClick}
        className="relative cursor-pointer aspect-[744/1039] rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center p-1 group/img select-none"
      >
        {/* Own Listing Badge */}
        {isOwnListing && (
          <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-md bg-purple-950/90 text-purple-200 border border-purple-500/60 text-[9px] font-black uppercase tracking-wider shadow-lg flex items-center space-x-1 backdrop-blur-md">
            <UserCheck className="w-3 h-3 text-purple-400" />
            <span>Thẻ Của Bạn</span>
          </div>
        )}

        <img
          src={cardImageSrc}
          alt={card.name}
          className="w-full h-full object-contain object-center rounded-lg group-hover/img:scale-[1.03] transition-transform duration-300 drop-shadow-md"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/14a52a367fd41fd84745e050e62d1f281f733467-1038x744.png';
          }}
        />

        {/* Hover Quick-View Overlay */}
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-300 shadow-lg">
            <Eye className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-amber-300 tracking-wide uppercase">
            Xem Chi Tiết Thẻ
          </span>
          <span className="text-[10px] text-slate-300 font-mono">
            Bilgewater Market Spec
          </span>
        </div>

        {/* Battlefield badge if landscape */}
        {isBattlefield && (
          <div className="absolute top-2 left-2 bg-slate-900/90 border border-purple-500/50 text-purple-300 text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">
            Battlefield
          </div>
        )}

        {/* Recently Updated / Acquired Badge */}
        {isRecentlyUpdated && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow-lg shadow-amber-500/30 animate-pulse z-10 flex items-center space-x-1">
            <Sparkles className="w-2.5 h-2.5" />
            <span>Mới Nhận</span>
          </div>
        )}

        {/* Foil Shimmer Badge */}
        {card.foilAvailable && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-400/30 to-purple-400/30 backdrop-blur-sm p-1 rounded-md border border-white/30 text-amber-200 shadow">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* 2. Sleek Card Meta Info */}
      <div className="pt-2.5 px-0.5">
        {/* Name & Collector Number */}
        <div className="flex items-center justify-between gap-1 mb-1">
          <h3
            onClick={handleCardClick}
            title={card.name}
            className="font-cinzel text-sm font-bold text-slate-100 hover:text-amber-400 transition cursor-pointer truncate flex-1"
          >
            {card.name}
          </h3>
          <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 flex-shrink-0">
            {printedNum}
          </span>
        </div>

        {/* Rarity & Domain Pill */}
        <div className="flex items-center space-x-1.5 mb-2.5">
          <span
            className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-md border ${getRarityBadge(
              card.rarity
            )}`}
          >
            {card.rarity}
          </span>
          <span
            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getDomainColor(
              card.domain
            )}`}
          >
            {card.domain}
          </span>
          {card.cost !== undefined && (
            <span className="text-[9px] font-bold text-amber-300 bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-500/40 ml-auto">
              ⚡ {card.cost} Mana
            </span>
          )}
        </div>

        {/* 3. Action Section Depending on Mode */}
        {mode === 'marketplace' && (
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
            <div>
              <div className="text-[9px] text-slate-400 uppercase font-semibold">Giá Bán Sàn</div>
              <div className="text-xs font-black text-amber-400">
                {listing ? listing.pricePerItem : (card.marketFloorPrice || 10)} $RIFT
              </div>
              <div className="text-[10px] text-cyan-400/90 font-mono font-medium leading-none mt-0.5">
                ~{formatEthEquivalent ? formatEthEquivalent(listing ? listing.pricePerItem : (card.marketFloorPrice || 10)) : '0 ETH'}
              </div>
            </div>
            <div className="flex items-center space-x-1.5">
              <button
                onClick={handleCardClick}
                className="px-2 py-1.5 rounded-xl text-[11px] font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
              >
                Chi Tiết
              </button>
              {isOwnListing ? (
                <button
                  onClick={() => cancelListing && cancelListing(listing.id || listing.listingId)}
                  title="Bạn là người bán lá bài này. Bấm để hủy niêm yết và nhận lại thẻ."
                  className="bg-rose-950/70 hover:bg-rose-900 border border-rose-500/50 text-rose-300 font-bold px-2.5 py-1.5 rounded-xl text-xs uppercase tracking-wider transition active:scale-95 flex items-center space-x-1 shadow-md shadow-rose-950/30"
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Hủy Bán</span>
                </button>
              ) : (
                listing && onBuy && (
                  <button
                    onClick={() => onBuy(listing, card)}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-3 py-1.5 rounded-xl text-xs uppercase tracking-wider transition shadow-md shadow-amber-500/20 active:scale-95 flex items-center space-x-1"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Mua</span>
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {mode === 'inventory' && (
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
            <div>
              <div className="text-[9px] text-slate-400 uppercase font-semibold">Sở Hữu</div>
              <div className="text-xs font-bold text-slate-200">
                x{quantity || 1} Thẻ Bài
              </div>
            </div>
            <div className="flex items-center space-x-1.5">
              <button
                onClick={handleCardClick}
                className="px-2 py-1.5 rounded-xl text-[11px] font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
              >
                Chi Tiết
              </button>
              {onSell && (
                <button
                  onClick={() => onSell(card, quantity)}
                  className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:border-amber-500/70 font-bold px-2.5 py-1.5 rounded-xl text-xs transition"
                >
                  Rao Bán
                </button>
              )}
            </div>
          </div>
        )}

        {mode === 'codex' && (
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <div>
              <span className="text-[9px] text-slate-400 uppercase block">Giá Sàn</span>
              <strong className="text-amber-400 font-bold block">
                {card.marketFloorPrice || (card.market && card.market.floor_price_rift) || 10} $RIFT
              </strong>
              <span className="text-[9px] text-cyan-400/90 font-mono font-medium block">
                ~{formatEthEquivalent ? formatEthEquivalent(card.marketFloorPrice || (card.market && card.market.floor_price_rift) || 10) : '0 ETH'}
              </span>
            </div>
            <button
              onClick={handleCardClick}
              className="text-amber-400 hover:text-amber-300 text-xs font-bold transition flex items-center space-x-1"
            >
              <span>Xem Specs</span>
              <span>→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
