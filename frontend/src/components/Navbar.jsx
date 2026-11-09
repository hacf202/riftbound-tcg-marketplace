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
  LogOut,
  ShieldCheck,
  Zap,
  Plus,
  ArrowUpRight,
} from 'lucide-react';

export default function Navbar() {
  const {
    account,
    shortAccount,
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
    { id: 'marketplace', label: 'Sàn Giao Dịch', icon: ShoppingBag },
    { id: 'packs', label: 'Gói Thẻ', icon: Layers },
    { id: 'inventory', label: 'Bộ Sưu Tập', icon: Flame },
    { id: 'codex', label: 'Codex Thẻ Bài', icon: BookOpen },
    { id: 'activity', label: 'Lịch Sử GD', icon: History },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-rift-border/80 shadow-lg shadow-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* 1. BRAND LOGO */}
          <div
            onClick={() => setActiveTab('marketplace')}
            className="flex items-center space-x-2.5 cursor-pointer group flex-shrink-0 select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-purple-600 to-cyan-500 p-[2px] shadow-md shadow-amber-500/20 group-hover:shadow-amber-500/50 transition">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5 leading-none">
                <span className="font-cinzel text-lg font-black tracking-wider text-slate-100 group-hover:text-amber-400 transition">
                  RIFTBOUND
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  TCG
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide font-medium mt-0.5 leading-none hidden sm:block">
                Bilgewater Marketplace
              </p>
            </div>
          </div>

          {/* 2. CHUẨN HÓA THANH ĐIỀU HƯỚNG CHÍNH (DESKTOP) */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-rift-border shadow-inner">
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

          {/* 3. KHU VỰC VÍ WEB3 & TRẠNG THÁI TÀI KHOẢN (RIGHT CONTROLS) */}
          <div className="flex items-center space-x-2.5">
            
            {/* THẺ MẠNG BLOCKCHAIN (NETWORK BADGE) */}
            <div className="hidden sm:flex items-center space-x-1.5 bg-slate-900/70 border border-rift-border/80 px-2.5 py-1.5 rounded-xl text-[11px] text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse"></span>
              <span>{chainId ? `Hardhat ${chainId}` : 'Localhost EVM'}</span>
            </div>

            {/* VÍ METAMASK */}
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
                {/* WALLET PROFILE PILL */}
                <div className="flex items-center bg-slate-900/90 border border-rift-border hover:border-amber-500/50 rounded-xl transition shadow">
                  
                  {/* Balance Display with Quick Deposit "+" Button */}
                  <div
                    onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 cursor-pointer hover:bg-slate-800/40 rounded-l-xl transition"
                    title="Bấm để xem chi tiết số dư & nạp tiền"
                  >
                    <span className="text-xs font-black text-amber-400 font-mono tabular-nums">
                      {Number(balanceRift).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">$RIFT</span>
                  </div>

                  {/* Nút Nạp Nhanh "+" mở Modal Đổi ETH */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExchangeModalOpen(true);
                    }}
                    title="Nạp thêm $RIFT bằng đồng ETH"
                    className="p-1 px-1.5 mr-1 bg-purple-600/30 hover:bg-purple-600/60 text-purple-300 hover:text-white rounded-lg border border-purple-500/40 text-[10px] font-bold transition flex items-center space-x-0.5"
                  >
                    <Plus className="w-3 h-3" />
                    <span className="hidden md:inline">Nạp</span>
                  </button>

                  <div className="h-5 w-[1px] bg-rift-border"></div>

                  {/* Account Address & Dropdown Trigger */}
                  <div
                    onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                    className="flex items-center space-x-1.5 px-2.5 py-1.5 cursor-pointer hover:bg-slate-800/40 rounded-r-xl transition text-xs select-none"
                  >
                    <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shadow-inner">
                      🦊
                    </div>
                    <span className="font-mono text-[11px] hidden sm:inline font-bold text-slate-200">
                      {shortAccount}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${walletDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* WALLET PROFILE DROPDOWN (NƠI ĐẶT CÁC TÍNH NĂNG QUẢN LÝ VÍ & QUY ĐỔI TIỀN) */}
                {walletDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-rift-border rounded-2xl p-4 shadow-2xl z-50 animate-fade-in text-xs space-y-3.5">
                    
                    {/* Header: Address, Status & Copy */}
                    <div className="pb-3 border-b border-rift-border/80">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center space-x-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Ví MetaMask Đã Kết Nối</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                          Chain {chainId || 31337}
                        </span>
                      </div>

                      <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-rift-border">
                        <div className="font-mono text-slate-200 font-bold text-xs truncate max-w-[200px]">
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

                    {/* Tài Sản & Số Dư Trong Ví */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-3 rounded-xl border border-rift-border/60">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Token Trong Game</div>
                        <div className="font-black text-amber-400 text-base font-mono">
                          {Number(balanceRift).toLocaleString()} <span className="text-[10px] text-slate-400 font-bold">$RIFT</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Ethereum Gas</div>
                        <div className="font-black text-cyan-400 text-base font-mono">
                          {balanceEth} <span className="text-[10px] text-slate-400 font-bold">ETH</span>
                        </div>
                      </div>
                    </div>

                    {/* VỊ TRÍ CHUẨN CỦA NÚT NẠP / QUY ĐỔI TIỀN TỆ WEB3 */}
                    <button
                      onClick={() => {
                        setIsExchangeModalOpen(true);
                        setWalletDropdownOpen(false);
                      }}
                      className="w-full p-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 border border-purple-400/40 text-white flex items-center justify-between shadow-lg shadow-purple-600/20 transition active:scale-98"
                    >
                      <div className="flex items-center space-x-2 text-left">
                        <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                          <Zap className="w-4 h-4 fill-amber-300 text-amber-300 animate-pulse" />
                        </div>
                        <div>
                          <div className="font-black text-xs">Nạp $RIFT Bằng Đồng ETH</div>
                          <div className="text-[10px] text-purple-200/80">Tỷ giá: 1 ETH = 10,000 $RIFT</div>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-purple-200" />
                    </button>

                    {/* Lối Tắt Nhanh Quản Lý Cá Nhân */}
                    <div className="space-y-1 pt-1">
                      <button
                        onClick={() => {
                          setActiveTab('inventory');
                          setWalletDropdownOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between transition text-xs"
                      >
                        <span className="flex items-center space-x-2">
                          <Flame className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Bộ Sưu Tập Của Tôi</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Xem kho thẻ →</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('activity');
                          setWalletDropdownOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between transition text-xs"
                      >
                        <span className="flex items-center space-x-2">
                          <History className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Nhật Ký Giao Dịch Của Ví</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Xem lịch sử →</span>
                      </button>
                    </div>

                    {/* Ngắt Kết Nối Ví */}
                    <div className="pt-2 border-t border-rift-border/80">
                      <button
                        onClick={() => {
                          disconnectWallet();
                          setWalletDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/40 border border-rose-900/30 transition font-bold"
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

        {/* 4. MOBILE NAVIGATION TABS (GỌN GÀNG, DỄ CUỘN) */}
        <div className="lg:hidden flex border-t border-rift-border/60 px-2 py-1.5 justify-around bg-slate-950/90 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1 text-[11px] font-bold px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
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
