import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import {
  Sparkles,
  Wallet,
  Flame,
  Layers,
  BookOpen,
  ShoppingBag,
  History,
  ChevronDown,
  Copy,
  Check,
  Coins,
} from 'lucide-react';

export default function Navbar() {
  const {
    account,
    shortAccount,
    walletType,
    balanceRift,
    activeTab,
    setActiveTab,
    connectMetaMask,
    connectDemoWallet,
    disconnectWallet,
    claimFaucet,
  } = useWeb3();

  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const navItems = [
    { id: 'marketplace', label: 'Sàn Giao Dịch', icon: ShoppingBag, color: 'amber' },
    { id: 'packs', label: 'Gói Thẻ (12 Packs)', icon: Layers, color: 'purple' },
    { id: 'inventory', label: 'Bộ Sưu Tập', icon: Flame, color: 'cyan' },
    { id: 'activity', label: 'Lịch Sử GD', icon: History, color: 'emerald' },
    { id: 'codex', label: 'Codex 200 Thẻ', icon: BookOpen, color: 'blue' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-rift-dark/95 backdrop-blur-md border-b border-rift-border/80 shadow-lg shadow-black/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('marketplace')}
          className="flex items-center space-x-2.5 cursor-pointer group flex-shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-purple-600 to-cyan-500 p-[2px] shadow-md shadow-amber-500/20 group-hover:shadow-amber-500/50 transition">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center space-x-1.5">
              <span className="font-cinzel text-lg font-black tracking-wider text-slate-100 group-hover:text-amber-400 transition">
                RIFTBOUND
              </span>
              <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                TCG
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wide font-medium leading-none">
              Bilgewater Marketplace
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-1 bg-slate-950/80 p-1 rounded-xl border border-rift-border/70 shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition duration-200 ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Faucet & Balance & Wallet */}
        <div className="flex items-center space-x-2">
          {/* 1-Click Faucet */}
          <button
            onClick={claimFaucet}
            title="Nhận ngay 1,000 $RIFT thử nghiệm"
            className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/50 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm hover:scale-[1.02] active:scale-95"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">+1,000 $RIFT</span>
            <span className="sm:hidden text-[11px]">+1K</span>
          </button>

          {/* Balance & Wallet Display */}
          <div className="relative">
            <div
              onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
              className="flex items-center space-x-2 bg-slate-950/90 border border-rift-border hover:border-slate-600 px-2.5 py-1.5 rounded-xl cursor-pointer transition select-none shadow"
            >
              {/* Balance */}
              <div className="text-right">
                <span className="text-xs font-black text-amber-400 tabular-nums">
                  {balanceRift.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 font-bold ml-1">$RIFT</span>
              </div>

              <div className="h-4 w-[1px] bg-rift-border"></div>

              {/* Wallet Pill */}
              <div className="flex items-center space-x-1.5 text-xs font-medium text-slate-300">
                <div
                  className={`w-2 h-2 rounded-full ${
                    walletType === 'metamask' ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'
                  }`}
                />
                <span className="font-mono text-[11px] hidden sm:inline">{shortAccount}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            </div>

            {/* Wallet Dropdown */}
            {walletDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-rift-border rounded-2xl p-3 shadow-2xl z-50 animate-fade-in text-xs space-y-2.5">
                <div className="pb-2 border-b border-rift-border/80 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Tài Khoản Hiện Tại</div>
                    <div className="font-mono text-slate-200 font-bold text-xs truncate max-w-[150px]">
                      {account}
                    </div>
                  </div>
                  <button
                    onClick={handleCopyAddress}
                    title="Sao chép địa chỉ ví"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="space-y-1.5">
                  <button
                    onClick={() => {
                      connectMetaMask();
                      setWalletDropdownOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-800 flex items-center space-x-2 text-slate-200 transition"
                  >
                    <Wallet className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="font-semibold text-xs">Ví MetaMask Web3</div>
                      <div className="text-[10px] text-slate-400">Kết nối ví Web3 extension</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      connectDemoWallet();
                      setWalletDropdownOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-800 flex items-center space-x-2 text-slate-200 transition"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="font-semibold text-xs">Ví Demo Sẵn Có</div>
                      <div className="text-[10px] text-slate-400">Trải nghiệm ngay lập tức</div>
                    </div>
                  </button>
                </div>

                <div className="pt-2 border-t border-rift-border/80">
                  <button
                    onClick={() => {
                      disconnectWallet();
                      setWalletDropdownOpen(false);
                    }}
                    className="w-full text-center py-1 rounded-lg text-[11px] text-rose-400 hover:bg-rose-950/40 transition font-semibold"
                  >
                    Khởi Tạo Lại Phiên (Reset)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Tabs */}
      <div className="lg:hidden flex border-t border-rift-border/60 px-2 py-1.5 justify-around bg-slate-950/90 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-1 text-[11px] font-bold px-2 py-1 rounded-lg transition whitespace-nowrap ${
                isActive ? 'text-amber-300 bg-amber-500/15 border border-amber-500/30' : 'text-slate-400'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
