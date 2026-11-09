import React from 'react';
import { Web3Provider, useWeb3 } from './context/Web3Context';
import Navbar from './components/Navbar';
import Marketplace from './pages/Marketplace';
import Packs from './pages/Packs';
import Inventory from './pages/Inventory';
import Codex from './pages/Codex';
import CardDetail from './pages/CardDetail';
import Activity from './pages/Activity';

function AppContent() {
  const { activeTab, setActiveTab, selectedCardId } = useWeb3();

  return (
    <div className="flex flex-col min-h-screen bg-rift-darkest text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar />

      <main className="flex-1 pb-16">
        {activeTab === 'marketplace' && <Marketplace />}
        {activeTab === 'packs' && <Packs />}
        {activeTab === 'inventory' && <Inventory />}
        {activeTab === 'activity' && <Activity />}
        {activeTab === 'codex' && <Codex />}
        {activeTab === 'card-detail' && (
          <CardDetail
            cardId={selectedCardId || 1}
            onBack={() => setActiveTab('marketplace')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-rift-border/60 bg-rift-dark/70 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-cinzel font-bold text-amber-400">RIFTBOUND TCG</span>
            <span>— Sàn Giao Dịch Vật Phẩm Ảo & 200 Thẻ Bài NFT Chuẩn Scrydex</span>
          </div>
          <div className="text-slate-500">
            Ứng dụng công nghệ Blockchain EVM • Chuẩn ERC-20, ERC-1155 & ERC-2981 • Bilgewater Marketplace Edition
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab('activity')}
              className="text-cyan-400 hover:text-cyan-300 underline transition"
            >
              Nhật Ký Giao Dịch
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('codex')}
              className="text-amber-400 hover:text-amber-300 underline transition"
            >
              Bách Khoa Toàn Thư (Codex)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Web3Provider>
      <AppContent />
    </Web3Provider>
  );
}
