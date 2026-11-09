import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import CardItem from '../components/CardItem';
import SellModal from '../components/SellModal';
import { Wallet, Sparkles, Layers, ShieldCheck, Flame, RefreshCw, ShoppingCart } from 'lucide-react';

export default function Inventory() {
  const { account, dataVersion, triggerRefresh, API_BASE, setActiveTab, formatEthEquivalent, setIsExchangeModalOpen } = useWeb3();
  const [inventory, setInventory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sell Modal State
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const fetchInventory = () => {
    const address = account || '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
    setIsLoading(true);
    fetch(`${API_BASE}/users/${address}/inventory`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      {/* Portfolio Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rift-card via-slate-900 to-rift-dark border border-rift-border p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-3">
              <Flame className="w-3.5 h-3.5" />
              <span>Kho Thẻ Bài Cá Nhân (Deck & Binder) • SQLite DB</span>
            </div>
            <h1 className="font-cinzel text-3xl font-black text-slate-100">
              Bộ Sưu Tập Của Tôi
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Đồng bộ dữ liệu thời gian thực theo ví:{' '}
              <strong className="text-amber-400 font-mono text-[13px]">
                {account || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'}
              </strong>
            </p>
          </div>

          {/* Portfolio Metrics */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {inventory && (
              <>
                <div className="bg-slate-900/80 border border-rift-border px-4 py-3 rounded-2xl flex-1 md:flex-none">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Tổng Thẻ Sở Hữu</div>
                  <div className="text-2xl font-black text-slate-100">{inventory.totalCardsCount} Thẻ</div>
                </div>
                <div className="bg-slate-900/80 border border-rift-border px-4 py-3 rounded-2xl flex-1 md:flex-none">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Định Giá Portfolio</div>
                  <div className="text-2xl font-black text-amber-400 leading-tight">
                    {inventory.estimatedPortfolioValueRift} <span className="text-sm font-semibold text-slate-400">$RIFT</span>
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono font-medium leading-none mt-0.5">
                    ~{formatEthEquivalent ? formatEthEquivalent(inventory.estimatedPortfolioValueRift) : '0 ETH'}
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
              className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-rift-border text-slate-300 hover:text-white transition shadow"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {isLoading && !inventory ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm font-semibold">Đang đồng bộ kho thẻ từ cơ sở dữ liệu SQLite...</p>
        </div>
      ) : !inventory || inventory.cards.length === 0 ? (
        <div className="py-20 text-center bg-rift-card/40 rounded-3xl border border-rift-border/60 p-8">
          <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="font-cinzel text-lg font-bold text-slate-200 mb-1">Ví này chưa sở hữu lá bài nào</h3>
          <p className="text-slate-400 text-xs mb-6 max-w-md mx-auto">
            Bạn chưa có thẻ bài trong tài khoản này. Hãy xé các gói thẻ bài tại tab "Gói Thẻ" hoặc mua trực tiếp từ "Sàn Giao Dịch".
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('packs')}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center space-x-1.5 shadow-lg shadow-purple-600/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Đi Mở Gói Thẻ</span>
            </button>
            <button
              onClick={() => setIsExchangeModalOpen && setIsExchangeModalOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center space-x-1.5 shadow-lg shadow-purple-600/20 border border-purple-400/40"
            >
              <Wallet className="w-3.5 h-3.5 text-amber-300" />
              <span>Đổi ETH Lấy $RIFT</span>
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition flex items-center space-x-1.5 shadow-lg shadow-amber-500/20"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Xem Sàn Giao Dịch</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {inventory.cards.map((item, index) => (
            <CardItem
              key={item.cardId}
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
