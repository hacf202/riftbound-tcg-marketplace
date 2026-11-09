import React, { useState } from 'react';
import { X, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';

export default function BuyModal({ listing, card, onClose, onSuccess }) {
  const { buyCard, balanceRift, setActiveTab, setIsExchangeModalOpen } = useWeb3();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  if (!listing || !card) return null;

  const maxQty = listing.quantity || 1;
  const totalPrice = Number(listing.pricePerItem) * quantity;
  const protocolFee = (totalPrice * 0.02).toFixed(2);
  const royaltyFee = (totalPrice * 0.025).toFixed(2);
  const sellerPayout = (totalPrice - protocolFee - royaltyFee).toFixed(2);

  const handleBuy = async () => {
    setIsLoading(true);
    const listingIdToBuy = listing.id || listing.listingId;
    const success = await buyCard(listingIdToBuy, listing.pricePerItem, quantity);
    setIsLoading(false);
    if (success) {
      if (onSuccess) onSuccess();
      onClose();
      // Tự động chuyển qua tab Bộ Sưu Tập để người dùng chiêm ngưỡng ngay thẻ vừa mua
      setActiveTab('inventory');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-rift-card border border-rift-border rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-rift-border">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="font-cinzel text-lg font-bold text-slate-100">Xác Nhận Mua Thẻ Bài</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Info Banner */}
        <div className="flex items-center space-x-4 my-5 p-3.5 bg-rift-darkest/70 border border-rift-border/60 rounded-2xl">
          <img
            src={card.image}
            alt={card.name}
            className="w-16 h-22 aspect-[744/1039] object-contain bg-slate-950 rounded-xl border border-rift-border p-0.5 shadow"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/14a52a367fd41fd84745e050e62d1f281f733467-1038x744.png';
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{card.domain}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                {card.rarity}
              </span>
            </div>
            <h3 className="font-cinzel text-base font-bold text-slate-100 truncate">{card.name}</h3>
            <p className="text-xs text-slate-400 truncate">{card.title}</p>
          </div>
        </div>

        {/* Quantity Select */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Số Lượng Mua (Tối đa {maxQty})
          </label>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 font-bold text-lg text-slate-200 border border-rift-border flex items-center justify-center transition"
            >
              -
            </button>
            <span className="text-base font-extrabold text-amber-400 w-12 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
              disabled={quantity >= maxQty}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 font-bold text-lg text-slate-200 border border-rift-border flex items-center justify-center transition"
            >
              +
            </button>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2.5 p-4 bg-slate-900/60 border border-rift-border/60 rounded-2xl text-xs mb-6">
          <div className="flex justify-between text-slate-400">
            <span>Đơn Giá</span>
            <span>{listing.pricePerItem} $RIFT / thẻ</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Phí Sàn Giao Dịch (2%)</span>
            <span>{protocolFee} $RIFT</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Phí Bản Quyền Tác Giả ERC-2981 (2.5%)</span>
            <span>{royaltyFee} $RIFT</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Người Bán Nhận (95.5%)</span>
            <span>{sellerPayout} $RIFT</span>
          </div>
          <div className="h-[1px] bg-rift-border/80 my-1"></div>
          <div className="flex justify-between text-sm font-extrabold text-slate-100">
            <span>Tổng Cộng Thanh Toán</span>
            <span className="text-amber-400 text-base">{totalPrice} $RIFT</span>
          </div>
        </div>

        {/* Wallet Balance Warning & Quick Swap CTA */}
        {Number(balanceRift) < totalPrice && (
          <div className="mb-4 p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-purple-200 text-xs flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div>
              <div className="font-bold text-amber-300">⚠️ Số dư không đủ ({balanceRift} $RIFT)</div>
              <div className="text-[11px] text-slate-300">Cần thêm {totalPrice - Number(balanceRift)} $RIFT để mua thẻ bài này.</div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (setIsExchangeModalOpen) setIsExchangeModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider transition whitespace-nowrap shadow-md shadow-purple-600/30 active:scale-95 flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Đổi ETH Ngay</span>
            </button>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleBuy}
          disabled={isLoading || Number(balanceRift) < totalPrice}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-slate-950 font-bold py-3.5 rounded-2xl text-sm uppercase tracking-wider transition shadow-lg shadow-amber-500/25 active:scale-[0.99] flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Xác Nhận Thanh Toán ({totalPrice} $RIFT)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
