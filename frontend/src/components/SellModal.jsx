import React, { useState } from 'react';
import { X, Tag, ShieldCheck } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';

export default function SellModal({ card, ownedQuantity, onClose, onSuccess }) {
  const { listCard } = useWeb3();
  const [quantity, setQuantity] = useState(1);
  const [pricePerItem, setPricePerItem] = useState(card ? card.marketFloorPrice : 50);
  const [isLoading, setIsLoading] = useState(false);

  if (!card) return null;

  const maxQty = ownedQuantity || 1;
  const totalPrice = Number(pricePerItem) * quantity;
  const protocolFee = (totalPrice * 0.02).toFixed(2);
  const royaltyFee = (totalPrice * 0.025).toFixed(2);
  const netEarnings = (totalPrice - protocolFee - royaltyFee).toFixed(2);

  const handleSell = async () => {
    if (!pricePerItem || pricePerItem <= 0) return;
    setIsLoading(true);
    const success = await listCard(card.id, quantity, pricePerItem);
    setIsLoading(false);
    if (success) {
      if (onSuccess) onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-rift-card border border-rift-border rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-rift-border">
          <div className="flex items-center space-x-2">
            <Tag className="w-5 h-5 text-amber-400" />
            <h2 className="font-cinzel text-lg font-bold text-slate-100">Niêm Yết Bán Thẻ Lên Sàn</h2>
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
            <p className="text-xs text-slate-400">Đang sở hữu: <strong className="text-amber-300">x{maxQty}</strong></p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Số Lượng Bán
            </label>
            <input
              type="number"
              min="1"
              max={maxQty}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(maxQty, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full bg-slate-900 border border-rift-border rounded-xl px-4 py-2.5 text-slate-100 font-bold focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Đơn Giá ($RIFT / Thẻ)
            </label>
            <input
              type="number"
              min="1"
              value={pricePerItem}
              onChange={(e) => setPricePerItem(Math.max(1, parseFloat(e.target.value) || 1))}
              className="w-full bg-slate-900 border border-rift-border rounded-xl px-4 py-2.5 text-amber-400 font-bold focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-2 p-4 bg-slate-900/60 border border-rift-border/60 rounded-2xl text-xs mb-6">
          <div className="flex justify-between text-slate-400">
            <span>Tổng Giá Trị Rao Bán</span>
            <span>{totalPrice} $RIFT</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Phí Sàn (2%)</span>
            <span>-{protocolFee} $RIFT</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Phí Bản Quyền ERC-2981 (2.5%)</span>
            <span>-{royaltyFee} $RIFT</span>
          </div>
          <div className="h-[1px] bg-rift-border/80 my-1"></div>
          <div className="flex justify-between text-sm font-extrabold text-slate-100">
            <span>Bạn Thực Nhận (Khi Bán Xong)</span>
            <span className="text-emerald-400 text-base">+{netEarnings} $RIFT</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSell}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-slate-950 font-bold py-3.5 rounded-2xl text-sm uppercase tracking-wider transition shadow-lg shadow-amber-500/25 active:scale-[0.99] flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Xác Nhận Niêm Yết Thẻ Bài</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
