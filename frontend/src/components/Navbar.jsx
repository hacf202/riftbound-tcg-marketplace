import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import CurrencyConverterModal from './CurrencyConverterModal';
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
  ArrowLeftRight,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

export default function Navbar() {
  const {
    account,
    shortAccount,
    walletType,
    balanceRift,
    balanceEth,
    chainId,
    isConnecting,
    isExchangeModalOpen,
    setIsExchangeModalOpen,
    activeTab,
    setActiveTab,
    connectMetaMask,
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
    <>
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

          {/* Right Controls: Currency Converter & Faucet & MetaMask Login */}
          <div className="flex items-center space-x-2">
            
            {/* Quick Currency Converter Button (ETH ↔ $RIFT) */}
            <button
              onClick={() => setIsExchangeModalOpen(true)}
              title="Mở bảng quy đổi tỷ giá ETH ↔ $RIFT"
              className="flex items-center space-x-1.5 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/40 text-purple-300 hover:text-purple-200 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden md:inline">Quy Đổi Tiền Tệ</span>
              <span className="md:hidden text-[11px]">Tỷ Giá</span>
            </button>

            {/* 1-Click Faucet (+1,000 $RIFT) */}
            <button
              onClick={claimFaucet}
              title="Nhận ngay 1,000 $RIFT thử nghiệm"
              className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/50 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm hover:scale-[1.02] active:scale-95"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">+1,000 $RIFT</span>
              <span className="sm:hidden text-[11px]">+1K</span>
            </button>

            {/* Wallet Section: Mandatory MetaMask Only */}
            {!account ? (
              <button
                onClick={connectMetaMask}
                disabled={isConnecting}
                className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/25 active:scale-95 border border-amber-400/50"
              >
                <Wallet className="w-4 h-4 text-slate-950" />
                <span>{isConnecting ? 'Đang Kết Nối...' : 'Kết Nối MetaMask'}</span>
              </button>
            ) : (
              <div className="relative">
                <div
                  onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                  className="flex items-center space-x-2.5 bg-slate-950/90 border border-rift-border hover:border-amber-500/50 px-3 py-1.5 rounded-xl cursor-pointer transition select-none shadow"
                >
                  {/* Balances Display: Dual ETH & $RIFT */}
                  <div className="text-right">
                    <div className="flex items-center justify-end space-x-1 text-xs font-black text-amber-400 tabular-nums">
                      <span>{Number(balanceRift).toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 font-bold">$RIFT</span>
                    </div>
                    <div className="text-[10px] text-cyan-400 font-mono font-medium leading-none">
                      {balanceEth} ETH
                    </div>
                  </div>

                  <div className="h-5 w-[1px] bg-rift-border"></div>

                  {/* Connected Account Badge */}
                  <div className="flex items-center space-x-1.5 text-xs font-medium text-slate-300">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse" />
                    <span className="font-mono text-[11px] hidden sm:inline font-bold text-slate-200">
                      {shortAccount}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>

                {/* Account Details Dropdown */}
                {walletDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-rift-border rounded-2xl p-3.5 shadow-2xl z-50 animate-fade-in text-xs space-y-3">
                    
                    {/* Header: Address and Network */}
                    <div className="pb-2.5 border-b border-rift-border/80">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center space-x-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Ví MetaMask Đã Kết Nối</span>
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {chainId ? `Chain ${chainId}` : 'EVM'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-rift-border">
                        <div className="font-mono text-slate-200 font-bold text-xs truncate max-w-[180px]">
                          {account}
                        </div>
                        <button
                          onClick={handleCopyAddress}
                          title="Sao chép địa chỉ ví"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        >
                          {copied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Balances Summary in Dropdown */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-rift-border/60">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Token Trong Game</div>
                        <div className="font-black text-amber-400 text-sm">
                          {Number(balanceRift).toLocaleString()} <span className="text-[10px] text-slate-400">$RIFT</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Ethereum Gas</div>
                        <div className="font-black text-cyan-400 text-sm">
                          {balanceEth} <span className="text-[10px] text-slate-400">ETH</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Link: Converter Modal */}
                    <button
                      onClick={() => {
                        setIsExchangeModalOpen(true);
                        setWalletDropdownOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-xl bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/30 flex items-center space-x-2 text-purple-200 transition"
                    >
                      <ArrowLeftRight className="w-4 h-4 text-purple-400" />
                      <div>
                        <div className="font-bold text-xs">Mở Bảng Quy Đổi Tỷ Giá</div>
                        <div className="text-[10px] text-purple-300/70">1 ETH = 10,000 $RIFT Token</div>
                      </div>
                    </button>

                    {/* Disconnect Button */}
                    <div className="pt-2 border-t border-rift-border/80">
                      <button
                        onClick={() => {
                          disconnectWallet();
                          setWalletDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-center space-x-1.5 py-1.5 rounded-xl text-xs text-rose-400 hover:bg-rose-950/40 border border-rose-900/30 transition font-bold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Ngắt Kết Nối Ví (Disconnect)</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            )}

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

      {/* Currency Converter Modal Component */}
      <CurrencyConverterModal
        isOpen={isExchangeModalOpen}
        onClose={() => setIsExchangeModalOpen(false)}
      />
    </>
  );
}
