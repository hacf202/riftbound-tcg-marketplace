import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import CurrencyConverterModal from './CurrencyConverterModal';
import {
  Sparkles,
  Wallet,
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
  ArrowUpRight,
  Flame,
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
    getNetworkInfo,
  } = useWeb3();

  const netInfo = getNetworkInfo ? getNetworkInfo(chainId) : { name: 'Mạng Nội Bộ', badge: 'Mạng Nội Bộ' };

  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Thanh điều hướng chính tinh gọn - 3 mục cốt lõi
  const navItems = [
    { id: 'marketplace', label: 'Sàn Giao Dịch', icon: ShoppingBag },
    { id: 'packs', label: 'Gói Thẻ', icon: Layers },
    { id: 'codex', label: 'Codex Thẻ Bài', icon: BookOpen },
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

          {/* 2. THANH ĐIỀU HƯỚNG CHÍNH ĐƠN GIẢN, DỄ NHÌN (3 MỤC CỐT LÕI) */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-rift-border shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-bold transition duration-200 ${
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

          {/* 3. KHU VỰC VÍ & TÀI KHOẢN (GỌN GÀNG, THÂN THIỆN) */}
          <div className="flex items-center space-x-3">
            
            {/* BADGE MẠNG NỘI BỘ (ĐƠN GIẢN, KHÔNG GÂY RỐI MẮT) */}
            <div className="hidden sm:flex items-center space-x-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl text-[11px] text-slate-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
              <span>{netInfo.badge || 'Mạng Nội Bộ'}</span>
            </div>

            {/* TRẠNG THÁI VÍ */}
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
                {/* WALLET / ACCOUNT PILL GỌN GÀNG */}
                <button
                  onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                  className="flex items-center space-x-2.5 bg-slate-900/90 border border-rift-border hover:border-amber-500/50 rounded-xl px-3 py-1.5 transition shadow group select-none text-left"
                >
                  {/* Số Dư $RIFT */}
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-black text-amber-400 font-mono tabular-nums">
                      {Number(balanceRift).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">$RIFT</span>
                  </div>

                  <div className="h-4 w-[1px] bg-rift-border"></div>

                  {/* Địa Chỉ Rút Gọn */}
                  <div className="flex items-center space-x-1.5">
                    <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-[10px] shadow-inner">
                      🦊
                    </div>
                    <span className="font-mono text-[11px] hidden sm:inline font-bold text-slate-200 group-hover:text-amber-300 transition">
                      {shortAccount}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${walletDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* DROPDOWN MENU TÀI KHOẢN (NƠI CHỨA BỘ SƯU TẬP, QUY ĐỔI TIỀN & NHẬT KÝ GIAO DỊCH) */}
                {walletDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-rift-border rounded-2xl p-4 shadow-2xl z-50 animate-fade-in text-xs space-y-3.5">
                    
                    {/* Header: Thông tin tài khoản ví */}
                    <div className="pb-3 border-b border-rift-border/80">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center space-x-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Tài Khoản Ví Của Bạn</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                          {netInfo.badge || 'Mạng Nội Bộ'}
                        </span>
                      </div>

                      {/* Địa Chỉ Ví & Nút Sao Chép */}
                      <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-rift-border">
                        <div className="font-mono text-slate-200 font-bold text-xs truncate max-w-[200px]" title={account}>
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

                    {/* Số Dư Tài Sản */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-3 rounded-xl border border-rift-border/60">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Token Trong Game</div>
                        <div className="font-black text-amber-400 text-sm font-mono truncate">
                          {Number(balanceRift).toLocaleString()} <span className="text-[10px] text-slate-400 font-bold">$RIFT</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Gas Khả Dụng</div>
                        <div className="font-black text-cyan-400 text-sm font-mono truncate">
                          {balanceEth} <span className="text-[10px] text-slate-400 font-bold">ETH/CRO</span>
                        </div>
                      </div>
                    </div>

                    {/* 1. MỤC BỘ SƯU TẬP CỦA TÔI (CHUYỂN VÀO MỤC TÀI KHOẢN) */}
                    <button
                      onClick={() => {
                        setActiveTab('inventory');
                        setWalletDropdownOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition ${
                        activeTab === 'inventory'
                          ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-sm'
                          : 'bg-slate-950/60 hover:bg-slate-800 border-rift-border/60 text-slate-200 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                          <Flame className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-xs flex items-center space-x-1.5">
                            <span>Bộ Sưu Tập Của Tôi</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">Kho Bài</span>
                          </div>
                          <div className="text-[10px] text-slate-400">Quản lý lá bài sở hữu & đăng bán</div>
                        </div>
                      </div>
                      <span className="text-slate-400 text-xs">➔</span>
                    </button>

                    {/* 2. CỔNG QUY ĐỔI TIỀN TỆ (GỘP TẠI 1 CHỖ DUY NHẤT) */}
                    <button
                      onClick={() => {
                        setIsExchangeModalOpen(true);
                        setWalletDropdownOpen(false);
                      }}
                      className="w-full p-2.5 rounded-xl bg-gradient-to-r from-purple-950/70 via-indigo-950/70 to-cyan-950/70 hover:from-purple-900/80 hover:to-cyan-900/80 border border-purple-500/30 text-white flex items-center justify-between transition shadow-sm group"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform">
                          <Zap className="w-4 h-4 fill-amber-300 text-amber-300 animate-pulse" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-xs flex items-center space-x-1.5">
                            <span>Quy Đổi Tiền Tệ</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/30 text-purple-200 font-mono">ETH & TCRO</span>
                          </div>
                          <div className="text-[10px] text-purple-200/70">Đổi ETH hoặc Cronos sang $RIFT</div>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-purple-300" />
                    </button>

                    {/* 3. NHẬT KÝ GIAO DỊCH */}
                    <button
                      onClick={() => {
                        setActiveTab('activity');
                        setWalletDropdownOpen(false);
                      }}
                      className={`w-full p-2 rounded-xl text-left flex items-center justify-between text-xs transition ${
                        activeTab === 'activity'
                          ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300'
                          : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <History className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Nhật Ký Giao Dịch Của Ví</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Xem lịch sử →</span>
                    </button>

                    {/* 4. NGẮT KẾT NỐI VÍ */}
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

        {/* 4. MOBILE NAVIGATION TABS (CHỈ 3 MỤC CHÍNH, GỌN GÀNG) */}
        <div className="md:hidden flex border-t border-rift-border/60 px-2 py-1.5 justify-around bg-slate-950/90">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                  isActive ? 'text-amber-300 bg-amber-500/15 border border-amber-500/30' : 'text-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Currency Converter Modal Component (ETH & Cronos TCRO ➔ $RIFT) */}
      <CurrencyConverterModal
        isOpen={isExchangeModalOpen}
        onClose={() => setIsExchangeModalOpen(false)}
      />
    </>
  );
}
