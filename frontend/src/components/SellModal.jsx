import React, { useState } from 'react';
import { X } from 'lucide-react';
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
    if (quantity <= 0 || (ownedQuantity !== undefined && quantity > ownedQuantity)) return;
    setIsLoading(true);
    try {
      const success = await listCard(card.id, quantity, pricePerItem);
      if (success) {
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Lỗi khi niêm yết thẻ:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="font-cinzel text-base font-bold text-slate-100">Niêm Yết Bán Thẻ</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Card Info Banner */}
        <div className="flex items-center space-x-3 my-4 p-3 bg-slate-950 border border-slate-800 rounded-xl">
          <img
            src={card.image}
            alt={card.name}
            className="w-14 h-20 aspect-[744/1039] object-contain bg-slate-900 rounded-lg border border-slate-800 p-0.5"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/14a52a367fd41fd84745e050e62d1f281f733467-1038x744.png';
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1.5 mb-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{card.domain}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                {card.rarity}
              </span>
            </div>
            <h3 className="font-cinzel text-sm font-bold text-slate-100 truncate">{card.name}</h3>
            <p className="text-xs text-slate-400">Sở hữu: <strong className="text-amber-400 font-mono">x{maxQty}</strong></p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Số Lượng
            </label>
            <input
              type="number"
              min="1"
              max={maxQty}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(maxQty, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-amber-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Đơn Giá ($RIFT)
            </label>
            <input
              type="number"
              min="1"
              value={pricePerItem}
              onChange={(e) => setPricePerItem(Math.max(1, parseFloat(e.target.value) || 1))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-amber-400 font-bold focus:outline-none focus:border-amber-500 text-sm"
            />
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-1.5 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs mb-4">
          <div className="flex justify-between text-slate-400">
            <span>Tổng Giá Rao</span>
            <span className="font-mono">{totalPrice} $RIFT</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Phí Sàn (2%)</span>
            <span className="font-mono">-{protocolFee} $RIFT</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Phí Tác Quyền (2.5%)</span>
            <span className="font-mono">-{royaltyFee} $RIFT</span>
          </div>
          <div className="h-[1px] bg-slate-800 my-1"></div>
          <div className="flex justify-between font-bold text-slate-100">
            <span>Thực Nhận</span>
            <span className="text-amber-400 font-mono text-sm">+{netEarnings} $RIFT</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSell}
          disabled={isLoading || !ownedQuantity || ownedQuantity <= 0 || quantity > ownedQuantity}
          className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition active:scale-[0.99] flex items-center justify-center"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <span>Xác Nhận Niêm Yết</span>
          )}
        </button>
      </div>
    </div>
  );
}
