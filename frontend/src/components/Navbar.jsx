import React, { useState, useEffect, useRef } from 'react';
import { useWeb3 } from '../context/Web3Context';
import CurrencyConverterModal from './CurrencyConverterModal';
import {
  Wallet,
  ChevronDown,
  Copy,
  Check,
  LogOut,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Flame,
  History,
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

  // Navbar các mục: chỉ cần chữ, không icon, không bo viền
  const navItems = [
    { id: 'marketplace', label: 'Sàn Giao Dịch' },
    { id: 'packs', label: 'Gói Thẻ' },
    { id: 'codex', label: 'Codex Thẻ Bài' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          
          {/* 1. BRAND LOGO - Tinh Gọn, Đơn Giản */}
          <div
            onClick={() => setActiveTab('marketplace')}
            className="flex items-center space-x-2 cursor-pointer group flex-shrink-0 select-none"
          >
            <div className="w-7 h-7 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-xs font-cinzel">
              R
            </div>
            <span className="font-cinzel text-base font-black tracking-wider text-slate-100 group-hover:text-amber-400 transition">
              RIFTBOUND
            </span>
          </div>

          {/* 2. THANH ĐIỀU HƯỚNG TRUNG TÂM - CHỈ CẦN CHỮ, GẠCH CHÂN VÀ CHỮ VÀNG KHI ACTIVE */}
          <nav className="hidden md:flex items-center space-x-8 h-full">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`h-full flex items-center text-sm font-semibold transition-colors duration-150 border-b-2 ${
                    isActive
                      ? 'text-amber-400 border-amber-400'
                      : 'text-slate-400 hover:text-amber-300 border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* 3. KHU VỰC VÍ & TÀI KHOẢN (GỌN GÀNG, BO GÓC NHẸ) */}
          <div className="flex items-center space-x-2.5">
            
            {/* BADGE MẠNG NỘI BỘ (TỐI GIẢN) */}
            <div className="hidden sm:flex items-center space-x-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md text-[11px] text-slate-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>{netInfo.badge || 'Mạng Nội Bộ'}</span>
            </div>

            {/* TRẠNG THÁI VÍ */}
            {!account ? (
              <button
                onClick={connectMetaMask}
                disabled={isConnecting}
                className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider transition active:scale-95"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>{isConnecting ? 'Đang Nối...' : 'Kết Nối Ví'}</span>
              </button>
            ) : (
              <div className="relative" ref={dropdownRef}>
                {/* WALLET / ACCOUNT PILL */}
                <button
                  onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                  className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-lg px-2.5 py-1.5 transition select-none text-left"
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
                    <span className="font-mono text-[11px] hidden sm:inline font-semibold text-slate-200">
                      {shortAccount}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${walletDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* DROPDOWN MENU TÀI KHOẢN (BO GÓC VỪA PHẢI, VIỀN ĐƠN GIẢN) */}
                {walletDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-xl z-50 animate-fade-in text-xs space-y-2.5">
                    
                    {/* Header: Thông tin tài khoản ví */}
                    <div className="pb-2 border-b border-slate-800">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center space-x-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Tài Khoản Ví</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-emerald-300 border border-slate-800">
                          {netInfo.badge || 'Mạng Nội Bộ'}
                        </span>
                      </div>

                      {/* Địa Chỉ Ví & Nút Sao Chép */}
                      <div className="flex items-center justify-between bg-slate-950 px-2 py-1.5 rounded-lg border border-slate-800">
                        <div className="font-mono text-slate-200 font-semibold text-xs truncate max-w-[180px]" title={account}>
                          {account}
                        </div>
                        <button
                          onClick={handleCopyAddress}
                          title="Sao chép địa chỉ ví"
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
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
                    <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
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
                      className={`w-full p-2 rounded-lg border flex items-center justify-between transition ${
                        activeTab === 'inventory'
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                          : 'bg-slate-950/60 hover:bg-slate-800 border-slate-800 text-slate-200 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-semibold text-xs">Bộ Sưu Tập Của Tôi</span>
                      </div>
                      <span className="text-slate-400 text-xs">➔</span>
                    </button>

                    {/* 2. CỔNG QUY ĐỔI TIỀN TỆ */}
                    <button
                      onClick={() => {
                        setIsExchangeModalOpen(true);
                        setWalletDropdownOpen(false);
                      }}
                      className="w-full p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white flex items-center justify-between transition"
                    >
                      <div className="flex items-center space-x-2">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-semibold text-xs">Quy Đổi Tiền Tệ (ETH & TCRO)</span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {/* 3. NHẬT KÝ GIAO DỊCH */}
                    <button
                      onClick={() => {
                        setActiveTab('activity');
                        setWalletDropdownOpen(false);
                      }}
                      className={`w-full p-2 rounded-lg text-left flex items-center justify-between text-xs transition ${
                        activeTab === 'activity'
                          ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300'
                          : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <History className="w-3.5 h-3.5 text-slate-400" />
                        <span>Nhật Ký Giao Dịch</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Xem →</span>
                    </button>

                    {/* 4. NGẮT KẾT NỐI VÍ */}
                    <div className="pt-2 border-t border-slate-800">
                      <button
                        onClick={() => {
                          disconnectWallet();
                          setWalletDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-center space-x-1.5 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-950/30 border border-rose-900/30 transition font-semibold"
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

        {/* 4. MOBILE NAVIGATION TABS - CHỈ CẦN CHỮ, GẠCH CHÂN VÀ CHỮ VÀNG KHI ACTIVE */}
        <div className="md:hidden flex border-t border-slate-800 px-4 py-1.5 justify-around bg-slate-950">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`text-xs font-semibold py-1 border-b-2 transition-colors ${
                  isActive
                    ? 'text-amber-400 border-amber-400'
                    : 'text-slate-400 hover:text-slate-200 border-transparent'
                }`}
              >
                {item.label}
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
