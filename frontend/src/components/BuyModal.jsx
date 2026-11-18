import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';

export default function BuyModal({ listing, card, onClose, onSuccess }) {
  const { buyCard, balanceRift, setActiveTab, setIsExchangeModalOpen, account, cancelListing } = useWeb3();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  if (!listing || !card) return null;

  const isOwnListing = Boolean(
    listing.seller && account && listing.seller.toLowerCase() === account.toLowerCase()
  );

  const maxQty = listing.quantity || 1;
  const totalPrice = Number(listing.pricePerItem) * quantity;
  const protocolFee = (totalPrice * 0.02).toFixed(2);
  const royaltyFee = (totalPrice * 0.025).toFixed(2);
  const sellerPayout = (totalPrice - protocolFee - royaltyFee).toFixed(2);

  const handleBuy = async () => {
    if (isOwnListing) return;
    setIsLoading(true);
    const listingIdToBuy = listing.id || listing.listingId;
    const success = await buyCard(listingIdToBuy, listing.pricePerItem, quantity, listing.seller);
    setIsLoading(false);
    if (success) {
      if (onSuccess) onSuccess();
      onClose();
      setActiveTab('inventory');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-slate-100">Xác Nhận Mua Thẻ</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Card Info */}
        <div className="flex items-center space-x-3.5 my-4 p-3 bg-slate-950 border border-slate-800 rounded-xl">
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
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-medium">
                {card.rarity}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-100 truncate">{card.name}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{listing.pricePerItem} $RIFT / thẻ</p>
          </div>
        </div>

        {/* Quantity Select */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Số lượng mua</span>
            <span>Tối đa: {maxQty}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-9 h-9 rounded-lg bg-slate-950 hover:bg-slate-800 disabled:opacity-40 font-bold text-sm text-slate-200 border border-slate-800 flex items-center justify-center transition"
            >
              -
            </button>
            <span className="text-sm font-bold text-amber-400 w-10 text-center font-mono">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
              disabled={quantity >= maxQty}
              className="w-9 h-9 rounded-lg bg-slate-950 hover:bg-slate-800 disabled:opacity-40 font-bold text-sm text-slate-200 border border-slate-800 flex items-center justify-center transition"
            >
              +
            </button>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs mb-4">
          <div className="flex justify-between text-slate-400">
            <span>Đơn giá</span>
            <span className="font-mono">{listing.pricePerItem} $RIFT</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Phí sàn (2%)</span>
            <span className="font-mono">{protocolFee} $RIFT</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Phí tác quyền (2.5%)</span>
            <span className="font-mono">{royaltyFee} $RIFT</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Người bán nhận (95.5%)</span>
            <span className="font-mono">{sellerPayout} $RIFT</span>
          </div>
          <div className="h-[1px] bg-slate-800 my-1"></div>
          <div className="flex justify-between text-xs font-bold text-slate-100">
            <span>Tổng thanh toán</span>
            <span className="text-amber-400 text-sm font-mono">{totalPrice} $RIFT</span>
          </div>
        </div>

        {/* Own Listing Notice */}
        {isOwnListing && (
          <div className="mb-4 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs">
            Bạn đang là người bán lá bài này. Bạn có thể bấm nút Hủy để rút thẻ về túi đồ.
          </div>
        )}

        {/* Insufficient Balance */}
        {!isOwnListing && Number(balanceRift) < totalPrice && (
          <div className="mb-4 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
            <span className="text-slate-400">
              Số dư không đủ ({balanceRift} $RIFT)
            </span>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (setIsExchangeModalOpen) setIsExchangeModalOpen(true);
              }}
              className="text-amber-400 hover:text-amber-300 font-semibold"
            >
              Nạp thêm
            </button>
          </div>
        )}

        {/* Action Button */}
        {isOwnListing ? (
          <button
            type="button"
            onClick={async () => {
              setIsLoading(true);
              const listingIdToCancel = listing.id || listing.listingId;
              const ok = await cancelListing(listingIdToCancel);
              setIsLoading(false);
              if (ok) {
                if (onSuccess) onSuccess();
                onClose();
              }
            }}
            disabled={isLoading}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition active:scale-95"
          >
            {isLoading ? 'Đang hủy...' : 'Hủy Niêm Yết'}
          </button>
        ) : (
          <button
            onClick={handleBuy}
            disabled={isLoading || Number(balanceRift) < totalPrice}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition active:scale-95"
          >
            {isLoading ? 'Đang xử lý...' : `Thanh toán (${totalPrice} $RIFT)`}
          </button>
        )}
      </div>
    </div>
  );
}
