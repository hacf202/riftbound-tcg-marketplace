import React, { useState, useEffect, useRef } from 'react';
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
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setWalletDropdownOpen(false);
      }
    };
    if (walletDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [walletDropdownOpen]);

  const handleCopyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 3 tab điều hướng trung tâm cốt lõi
  const navItems = [
    { id: 'marketplace', label: 'Sàn Giao Dịch', icon: ShoppingBag },
    { id: 'packs', label: 'Gói Thẻ', icon: Layers },
    { id: 'codex', label: 'Codex Thẻ Bài', icon: BookOpen },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-rift-border/70 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-3">
          
          {/* 1. BRAND LOGO - Tinh Tế & Gọn Nhẹ */}
          <div
            onClick={() => setActiveTab('marketplace')}
            className="flex items-center space-x-2.5 cursor-pointer group flex-shrink-0 select-none py-1"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 via-purple-600 to-cyan-500 p-[1.5px] shadow-sm shadow-amber-500/20 group-hover:shadow-amber-500/40 transition">
              <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5 leading-none">
                <span className="font-cinzel text-base sm:text-lg font-black tracking-wider text-slate-100 group-hover:text-amber-400 transition">
                  RIFTBOUND
                </span>
                <span className="text-[8px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  TCG
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide font-medium mt-0.5 leading-none hidden sm:block">
                Bilgewater Marketplace
              </p>
            </div>
          </div>

          {/* 2. THANH ĐIỀU HƯỚNG TRUNG TÂM - Thiết Kế Segmented Gọn Gàng */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/70 p-1 rounded-xl border border-rift-border/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* 3. KHU VỰC VÍ & TÀI KHOẢN */}
          <div className="flex items-center space-x-2.5">
            
            {/* BADGE MẠNG NỘI BỘ (TỐI GIẢN) */}
            <div className="hidden sm:flex items-center space-x-1.5 bg-slate-900/60 border border-slate-800 px-2.5 py-1 rounded-lg text-[11px] text-slate-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>{netInfo.badge || 'Mạng Nội Bộ'}</span>
            </div>

            {/* TRẠNG THÁI VÍ */}
            {!account ? (
              <button
                onClick={connectMetaMask}
                disabled={isConnecting}
                className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs uppercase tracking-wider transition shadow-sm active:scale-95 border border-amber-400/50"
              >
                <Wallet className="w-3.5 h-3.5 text-slate-950" />
                <span>{isConnecting ? 'Đang Nối...' : 'Kết Nối Ví'}</span>
              </button>
            ) : (
              <div className="relative" ref={dropdownRef}>
                {/* WALLET / ACCOUNT PILL */}
                <button
                  onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                  className="flex items-center space-x-2 bg-slate-900/80 hover:bg-slate-800/70 border border-rift-border/80 hover:border-amber-500/40 rounded-xl px-2.5 py-1.5 transition select-none text-left"
                >
                  {/* Số Dư $RIFT */}
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-bold text-amber-400 font-mono tabular-nums">
                      {Number(balanceRift).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">$RIFT</span>
                  </div>

                  <div className="h-3.5 w-[1px] bg-slate-800"></div>

                  {/* Địa Chỉ Rút Gọn */}
                  <div className="flex items-center space-x-1.5">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-[9px]">
                      🦊
                    </div>
                    <span className="font-mono text-[11px] hidden sm:inline font-semibold text-slate-200">
                      {shortAccount}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${walletDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* DROPDOWN MENU TÀI KHOẢN */}
                {walletDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-76 bg-slate-900 border border-rift-border rounded-2xl p-3 shadow-2xl z-50 animate-fade-in text-xs space-y-3">
                    
                    {/* Header: Thông tin tài khoản ví */}
                    <div className="pb-2.5 border-b border-rift-border/60">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center space-x-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Tài Khoản Ví</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
                          {netInfo.badge || 'Mạng Nội Bộ'}
                        </span>
                      </div>

                      {/* Địa Chỉ Ví & Nút Sao Chép */}
                      <div className="flex items-center justify-between bg-slate-950 px-2.5 py-1.5 rounded-xl border border-rift-border/70">
                        <div className="font-mono text-slate-200 font-semibold text-xs truncate max-w-[190px]" title={account}>
                          {account}
                        </div>
                        <button
                          onClick={handleCopyAddress}
                          title="Sao chép địa chỉ ví"
                          className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
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
                    <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-rift-border/50">
                      <div>
                        <div className="text-[9px] text-slate-400 uppercase font-medium">Token $RIFT</div>
                        <div className="font-bold text-amber-400 text-sm font-mono truncate">
                          {Number(balanceRift).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-400 uppercase font-medium">Gas Khả Dụng</div>
                        <div className="font-bold text-cyan-400 text-sm font-mono truncate">
                          {balanceEth} <span className="text-[10px] text-slate-400 font-normal">ETH/CRO</span>
                        </div>
                      </div>
                    </div>

                    {/* 1. MỤC BỘ SƯU TẬP CỦA TÔI */}
                    <button
                      onClick={() => {
                        setActiveTab('inventory');
                        setWalletDropdownOpen(false);
                      }}
                      className={`w-full p-2 rounded-xl border flex items-center justify-between transition ${
                        activeTab === 'inventory'
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm'
                          : 'bg-slate-950/50 hover:bg-slate-800 border-rift-border/50 text-slate-200 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                          <Flame className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-xs flex items-center space-x-1.5">
                            <span>Bộ Sưu Tập Của Tôi</span>
                            <span className="text-[8px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold">Kho Thẻ</span>
                          </div>
                          <div className="text-[10px] text-slate-400">Quản lý bài sở hữu & đăng bán</div>
                        </div>
                      </div>
                      <span className="text-slate-400 text-xs">➔</span>
                    </button>

                    {/* 2. CỔNG QUY ĐỔI TIỀN TỆ */}
                    <button
                      onClick={() => {
                        setIsExchangeModalOpen(true);
                        setWalletDropdownOpen(false);
                      }}
                      className="w-full p-2 rounded-xl bg-gradient-to-r from-purple-950/60 via-indigo-950/60 to-cyan-950/60 hover:from-purple-900/70 hover:to-cyan-900/70 border border-purple-500/30 text-white flex items-center justify-between transition shadow-sm group"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform">
                          <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-xs flex items-center space-x-1.5">
                            <span>Quy Đổi Tiền Tệ</span>
                            <span className="text-[8px] px-1 py-0.2 rounded bg-purple-500/30 text-purple-200 font-mono">ETH & TCRO</span>
                          </div>
                          <div className="text-[10px] text-purple-200/70">Nạp $RIFT từ ETH hoặc Cronos</div>
                        </div>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-purple-300" />
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
                        <span>Nhật Ký Giao Dịch</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Xem →</span>
                    </button>

                    {/* 4. NGẮT KẾT NỐI VÍ */}
                    <div className="pt-2 border-t border-rift-border/60">
                      <button
                        onClick={() => {
                          disconnectWallet();
                          setWalletDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-center space-x-1.5 py-1.5 rounded-xl text-xs text-rose-400 hover:bg-rose-950/40 border border-rose-900/30 transition font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Ngắt Kết Nối Ví</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* 4. MOBILE NAVIGATION TABS (CHUẨN 3 CẤP PADDING) */}
        <div className="md:hidden flex border-t border-rift-border/50 px-2 py-1.5 justify-around bg-slate-950/95">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-1 rounded-lg transition ${
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
