import React from 'react';
import { Eye, ShoppingCart, XCircle, UserCheck } from 'lucide-react';
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
        return 'bg-rose-950/80 text-rose-300 border-rose-800';
      case 'Legendary':
        return 'bg-amber-950/80 text-amber-300 border-amber-800';
      case 'Epic':
        return 'bg-purple-950/80 text-purple-300 border-purple-800';
      case 'Rare':
        return 'bg-sky-950/80 text-sky-300 border-sky-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getDomainColor = (domain) => {
    switch (domain) {
      case 'Fury':
      case 'Inferno':
        return 'text-rose-400 bg-rose-950/50 border-rose-900';
      case 'Mind':
      case 'Calm':
      case 'Astral':
        return 'text-cyan-400 bg-cyan-950/50 border-cyan-900';
      case 'Body':
      case 'Abyssal':
        return 'text-emerald-400 bg-emerald-950/50 border-emerald-900';
      case 'Chaos':
      case 'Void':
        return 'text-purple-400 bg-purple-950/50 border-purple-900';
      case 'Order':
        return 'text-amber-400 bg-amber-950/50 border-amber-900';
      default:
        return 'text-slate-400 bg-slate-950 border-slate-800';
    }
  };

  const printedNum = card.public_code || (card.printed_number ? `#${card.printed_number}` : `#${String(card.id).padStart(3, '0')}`);
  const cardIdRef = card.scrydex_id || card.id;
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
    <div className="group relative bg-slate-900 rounded-lg border border-slate-800 hover:border-slate-700 transition duration-150 flex flex-col justify-between p-2 shadow-sm">
      
      {/* 1. TCG Card Art Frame - Hiển Thị Đầy Đủ Ảnh Không Bị Cắt */}
      <div
        onClick={handleCardClick}
        className="relative cursor-pointer aspect-[744/1039] w-full rounded-md overflow-hidden bg-slate-950 flex items-center justify-center group/img select-none"
      >
        {/* Own Listing Badge */}
        {isOwnListing && (
          <div className="absolute top-1.5 left-1.5 z-20 px-1.5 py-0.5 rounded bg-purple-950/90 text-purple-200 border border-purple-800 text-[9px] font-bold uppercase tracking-wider flex items-center space-x-1">
            <UserCheck className="w-2.5 h-2.5 text-purple-400" />
            <span>Của bạn</span>
          </div>
        )}

        <img
          src={cardImageSrc}
          alt={card.name}
          className="w-full h-full object-contain rounded"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/14a52a367fd41fd84745e050e62d1f281f733467-1038x744.png';
          }}
        />

        {/* Hover Quick-View Overlay */}
        <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex flex-col items-center justify-center gap-1.5 rounded">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
            <Eye className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-amber-300">
            Xem Chi Tiết
          </span>
        </div>
      </div>

      {/* 2. Card Meta Info */}
      <div className="pt-2 px-0.5">
        {/* Name & Collector Number */}
        <div className="flex items-center justify-between gap-1 mb-1">
          <h3
            onClick={handleCardClick}
            title={card.name}
            className="font-cinzel text-xs font-bold text-slate-100 hover:text-amber-400 transition cursor-pointer truncate flex-1"
          >
            {card.name}
          </h3>
          <span className="text-[9px] font-mono text-slate-400 font-semibold bg-slate-950 px-1 py-0.2 rounded border border-slate-800 flex-shrink-0">
            {printedNum}
          </span>
        </div>

        {/* Rarity & Domain Pill */}
        <div className="flex items-center space-x-1 mb-2">
          <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded border ${getRarityBadge(card.rarity)}`}>
            {card.rarity}
          </span>
          <span className={`text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded border ${getDomainColor(card.domain)}`}>
            {card.domain}
          </span>
          {card.cost !== undefined && (
            <span className="text-[9px] font-bold text-amber-300 bg-amber-950/40 px-1 py-0.2 rounded border border-amber-800/40 ml-auto font-mono">
              ⚡ {card.cost}
            </span>
          )}
        </div>

        {/* 3. Action Section */}
        {mode === 'marketplace' && (
          <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between gap-2">
            <div>
              <div className="text-[9px] text-slate-400 uppercase font-medium">Giá Sàn</div>
              <div className="text-xs font-bold text-amber-400 font-mono">
                {listing ? listing.pricePerItem : (card.marketFloorPrice || 10)} $RIFT
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={handleCardClick}
                className="px-2 py-1 rounded-md text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
              >
                Chi Tiết
              </button>
              {isOwnListing ? (
                <button
                  onClick={() => cancelListing && cancelListing(listing.id || listing.listingId)}
                  title="Bạn là người bán lá bài này. Bấm để hủy niêm yết."
                  className="bg-rose-950 border border-rose-800 text-rose-300 font-bold px-2 py-1 rounded-md text-xs transition flex items-center space-x-1"
                >
                  <XCircle className="w-3 h-3 text-rose-400" />
                  <span>Hủy</span>
                </button>
              ) : (
                listing && onBuy && (
                  <button
                    onClick={() => onBuy(listing, card)}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded-md text-xs transition flex items-center space-x-1"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    <span>Mua</span>
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {mode === 'inventory' && (
          <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between gap-2">
            <div>
              <div className="text-[9px] text-slate-400 uppercase font-medium">Sở Hữu</div>
              <div className="text-xs font-bold text-slate-200">
                x{quantity || 1}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={handleCardClick}
                className="px-2 py-1 rounded-md text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
              >
                Chi Tiết
              </button>
              {onSell && (
                <button
                  onClick={() => onSell(card, quantity)}
                  className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold px-2 py-1 rounded-md text-xs transition"
                >
                  Rao Bán
                </button>
              )}
            </div>
          </div>
        )}

        {mode === 'codex' && (
          <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <div>
              <span className="text-[9px] text-slate-400 uppercase block font-medium">Giá Sàn</span>
              <strong className="text-amber-400 font-bold block font-mono">
                {card.marketFloorPrice || (card.market && card.market.floor_price_rift) || 10} $RIFT
              </strong>
            </div>
            <button
              onClick={handleCardClick}
              className="text-amber-400 hover:text-amber-300 text-xs font-bold transition"
            >
              Xem Chi Tiết →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
