import React, { useState, useEffect, useRef } from 'react';
import { useWeb3 } from '../context/Web3Context';
import CurrencyConverterModal from './CurrencyConverterModal';
import { ChevronDown, Copy, Check, LogOut } from 'lucide-react';

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
    claimFaucet,
    switchNetworkToCronosTestnet,
  } = useWeb3();

  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef(null);

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

  const navItems = [
    { id: 'marketplace', label: 'Sàn Giao Dịch' },
    { id: 'packs', label: 'Gói Thẻ' },
    { id: 'codex', label: 'Codex' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          
          {/* 1. BRAND LOGO */}
          <div
            onClick={() => setActiveTab('marketplace')}
            className="flex items-center space-x-2 cursor-pointer select-none"
          >
            <span className="font-cinzel text-lg font-extrabold tracking-wider text-slate-100 hover:text-amber-400 transition">
              RIFTBOUND
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              TCG
            </span>
          </div>

          {/* 2. NAVIGATION TABS */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* 3. WALLET & NETWORK */}
          <div className="flex items-center space-x-2">
            
            {/* NETWORK BADGE / SWITCH */}
            {Number(chainId) === 338 ? (
              <span className="hidden sm:inline-flex items-center space-x-1.5 text-xs text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Cronos Testnet</span>
              </span>
            ) : (
              <button
                onClick={switchNetworkToCronosTestnet}
                className="hidden sm:inline-flex items-center space-x-1 text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-lg transition"
              >
                <span>Chuyển Cronos</span>
              </button>
            )}

            {/* WALLET BUTTON */}
            {!account ? (
              <button
                onClick={connectMetaMask}
                disabled={isConnecting}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs uppercase tracking-wider transition active:scale-95"
              >
                {isConnecting ? 'Đang kết nối...' : 'Kết nối ví'}
              </button>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                  className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-lg px-2.5 py-1.5 transition text-left select-none"
                >
                  <span className="text-xs font-bold text-amber-400 font-mono">
                    {Number(balanceRift).toLocaleString()} $RIFT
                  </span>
                  <div className="h-3 w-[1px] bg-slate-800"></div>
                  <span className="font-mono text-xs text-slate-200">
                    {shortAccount}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${walletDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* WALLET DROPDOWN MENU */}
                {walletDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-xl z-50 animate-fade-in text-xs space-y-2.5">
                    
                    {/* Header: Address */}
                    <div className="flex items-center justify-between bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                      <span className="font-mono text-slate-300 font-medium text-xs truncate" title={account}>
                        {account}
                      </span>
                      <button
                        onClick={handleCopyAddress}
                        title="Sao chép địa chỉ"
                        className="p-1 rounded text-slate-400 hover:text-slate-200 transition"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Balances */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <div>
                        <div className="text-[10px] text-slate-400 font-medium">Số dư $RIFT</div>
                        <div className="font-bold text-amber-400 font-mono text-xs">
                          {Number(balanceRift).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-medium">Số dư TCRO</div>
                        <div className="font-bold text-slate-200 font-mono text-xs">
                          {balanceEth}
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-1 pt-1">
                      <button
                        onClick={() => {
                          setActiveTab('inventory');
                          setWalletDropdownOpen(false);
                        }}
                        className={`w-full px-2.5 py-2 rounded-lg text-left transition ${
                          activeTab === 'inventory'
                            ? 'bg-amber-500/15 text-amber-300 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                        }`}
                      >
                        Bộ sưu tập của tôi
                      </button>

                      <button
                        onClick={() => {
                          setIsExchangeModalOpen(true);
                          setWalletDropdownOpen(false);
                        }}
                        className="w-full px-2.5 py-2 rounded-lg text-left text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition"
                      >
                        Quy đổi tiền tệ (Nạp $RIFT)
                      </button>

                      <button
                        onClick={async () => {
                          if (claimFaucet) await claimFaucet();
                          setWalletDropdownOpen(false);
                        }}
                        className="w-full px-2.5 py-2 rounded-lg text-left text-amber-400 hover:bg-amber-500/10 transition font-medium"
                      >
                        Nhận 1,000 $RIFT (Faucet)
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('activity');
                          setWalletDropdownOpen(false);
                        }}
                        className={`w-full px-2.5 py-2 rounded-lg text-left transition ${
                          activeTab === 'activity'
                            ? 'bg-amber-500/15 text-amber-300 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                        }`}
                      >
                        Nhật ký giao dịch
                      </button>
                    </div>

                    {/* Disconnect */}
                    <div className="pt-2 border-t border-slate-800">
                      <button
                        onClick={() => {
                          disconnectWallet();
                          setWalletDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-center space-x-1 py-1.5 rounded-lg text-rose-400 hover:bg-rose-950/30 transition text-xs font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Ngắt kết nối</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex border-t border-slate-800 px-2 py-1 justify-around bg-slate-950">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`text-xs font-semibold px-3 py-1 rounded transition ${
                  isActive
                    ? 'text-amber-300 bg-amber-500/15'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Currency Converter Modal */}
      <CurrencyConverterModal
        isOpen={isExchangeModalOpen}
        onClose={() => setIsExchangeModalOpen(false)}
      />
    </>
  );
}
