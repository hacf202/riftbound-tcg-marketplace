import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import CardItem from '../components/CardItem';
import SellModal from '../components/SellModal';
import { Layers, RefreshCw } from 'lucide-react';
import { universalFetch, API_BASE } from '../utils/api';

export default function Inventory() {
  const { account, dataVersion, triggerRefresh, setActiveTab, formatEthEquivalent, setIsExchangeModalOpen } = useWeb3();
  const [inventory, setInventory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sell Modal State
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const fetchInventory = () => {
    const address = account || '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
    setIsLoading(true);
    universalFetch(`${API_BASE}/users/${address}/inventory`)
      .then((data) => {
        if (data && data.success && data.data) {
          setInventory(data.data);
        }
      })
      .catch((err) => console.error('Lỗi tải túi đồ:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchInventory();
  }, [account, dataVersion]);

  const handleOpenSell = (card, qty) => {
    setSelectedCard(card);
    setSelectedQuantity(qty);
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-5 animate-fade-in space-y-4">
      {/* Portfolio Header Banner */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 sm:p-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-100">
              Bộ Sưu Tập Của Tôi
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Địa chỉ ví:{' '}
              <strong className="text-amber-400 font-mono text-xs">
                {account || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'}
              </strong>
            </p>
          </div>

          {/* Portfolio Metrics */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            {inventory && (
              <>
                <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-lg flex-1 md:flex-none">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Tổng Thẻ</div>
                  <div className="text-lg font-bold text-slate-100">{inventory.totalCardsCount}</div>
                </div>
                <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-lg flex-1 md:flex-none">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Ước Tính Giá Trị</div>
                  <div className="text-lg font-bold text-amber-400 leading-tight">
                    {inventory.estimatedPortfolioValueRift} <span className="text-xs font-semibold text-slate-400">$RIFT</span>
                  </div>
                </div>
              </>
            )}
            <button
              onClick={() => {
                fetchInventory();
                triggerRefresh();
              }}
              title="Làm mới túi đồ"
              className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {isLoading && !inventory ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-400 text-xs font-medium">Đang tải thẻ bài...</p>
        </div>
      ) : !inventory || !inventory.cards || inventory.cards.length === 0 ? (
        <div className="py-16 text-center bg-slate-900 rounded-xl border border-slate-800 p-6">
          <Layers className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <h3 className="font-cinzel text-base font-bold text-slate-200 mb-1">Ví chưa sở hữu lá bài nào</h3>
          <p className="text-slate-400 text-xs mb-5 max-w-sm mx-auto">
            Bạn có thể mở gói bài mới hoặc mua trực tiếp thẻ bài từ người chơi khác trên sàn.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => setActiveTab('packs')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs uppercase transition"
            >
              Mở Gói Thẻ
            </button>
            <button
              onClick={() => setIsExchangeModalOpen && setIsExchangeModalOpen(true)}
              className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-amber-400 font-bold px-4 py-2 rounded-lg text-xs uppercase transition"
            >
              Nạp $RIFT
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold px-4 py-2 rounded-lg text-xs uppercase transition"
            >
              Sàn Giao Dịch
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {(inventory?.cards || []).map((item, index) => (
            <CardItem
              key={item.cardId || index}
              card={item.card}
              quantity={item.quantity}
              onSell={handleOpenSell}
              mode="inventory"
              isRecentlyUpdated={index === 0}
            />
          ))}
        </div>
      )}

      {/* Sell Modal */}
      {selectedCard && (
        <SellModal
          card={selectedCard}
          ownedQuantity={selectedQuantity}
          onClose={() => setSelectedCard(null)}
          onSuccess={() => {
            fetchInventory();
            triggerRefresh();
          }}
        />
      )}
    </div>
  );
}
