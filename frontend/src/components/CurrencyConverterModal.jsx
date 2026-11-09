import React, { useState } from 'react';
import {
  ArrowLeftRight,
  X,
  Sparkles,
  Coins,
  Zap,
  Info,
  ShieldCheck,
  Wallet,
  CheckCircle2,
} from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';

export default function CurrencyConverterModal({ isOpen, onClose }) {
  const {
    account,
    balanceEth,
    balanceRift,
    RIFT_PER_ETH,
    depositCryptoForRift,
    connectMetaMask,
  } = useWeb3();

  // Currency Selection: 'ETH' (Ethereum / Localhost) hoặc 'TCRO' (Cronos Testnet)
  const [currency, setCurrency] = useState('ETH');
  const [inputVal, setInputVal] = useState('0.1');
  const [riftInput, setRiftInput] = useState('1000');
  const [isSwapping, setIsSwapping] = useState(false);

  if (!isOpen) return null;

  const currentRate = currency === 'TCRO' ? 100 : RIFT_PER_ETH; // 1 TCRO = 100 $RIFT, 1 ETH = 10,000 $RIFT

  const presetsETH = [
    { val: '0.05', rift: '500', label: 'Tân Thủ' },
    { val: '0.1', rift: '1,000', label: '⭐ Phổ Biến' },
    { val: '0.25', rift: '2,500', label: 'Chiến Binh' },
    { val: '0.5', rift: '5,000', label: 'Cao Cấp' },
    { val: '1.0', rift: '10,000', label: '👑 Hoàng Gia' },
  ];

  const presetsTCRO = [
    { val: '5', rift: '500', label: 'Tân Thủ' },
    { val: '10', rift: '1,000', label: '⭐ Phổ Biến' },
    { val: '25', rift: '2,500', label: 'Chiến Binh' },
    { val: '50', rift: '5,000', label: 'Cao Cấp' },
    { val: '100', rift: '10,000', label: '👑 Hoàng Gia' },
  ];

  const activePresets = currency === 'TCRO' ? presetsTCRO : presetsETH;

  const handleCurrencySwitch = (newCurr) => {
    setCurrency(newCurr);
    if (newCurr === 'TCRO') {
      setInputVal('10');
      setRiftInput('1000');
    } else {
      setInputVal('0.1');
      setRiftInput('1000');
    }
  };

  const handleInputChange = (val) => {
    setInputVal(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setRiftInput(Math.round(num * currentRate).toString());
    } else {
      setRiftInput('');
    }
  };

  const handleRiftChange = (val) => {
    setRiftInput(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setInputVal((num / currentRate).toFixed(currency === 'TCRO' ? 1 : 4));
    } else {
      setInputVal('');
    }
  };

  const handleSelectPreset = (pVal, riftVal) => {
    setInputVal(pVal);
    setRiftInput(riftVal.replace(/,/g, ''));
  };

  const handleExecuteSwap = async () => {
    if (!account) {
      await connectMetaMask();
      return;
    }
    const num = parseFloat(inputVal);
    if (isNaN(num) || num <= 0) return;

    setIsSwapping(true);
    const success = await depositCryptoForRift(num, currency);
    setIsSwapping(false);
    if (success) {
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-slate-900 border border-purple-500/50 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100 overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-purple-600 to-amber-500 p-[2px] shadow-lg shadow-purple-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="text-[10px] text-purple-400 uppercase font-black tracking-wider flex items-center space-x-1.5">
              <span>CỔNG QUY ĐỔI TIỀN TỆ WEB3</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <h2 className="font-cinzel text-xl font-bold text-white">Nạp $RIFT Bằng Crypto</h2>
          </div>
        </div>

        {/* Chọn Đồng Tiền Nạp (ETH vs TCRO Cronos) */}
        <div className="flex p-1 bg-slate-950 rounded-2xl border border-rift-border mb-4">
          <button
            type="button"
            onClick={() => handleCurrencySwitch('ETH')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
              currency === 'ETH'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Ethereum (ETH)</span>
          </button>

          <button
            type="button"
            onClick={() => handleCurrencySwitch('TCRO')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
              currency === 'TCRO'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cronos Testnet (TCRO)</span>
          </button>
        </div>

        {/* Tỷ giá định chuẩn Banner */}
        <div className="bg-slate-950/90 border border-amber-500/30 rounded-2xl p-3 mb-4 shadow-inner">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium">Tỷ giá định chuẩn:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-black text-xs border border-amber-500/40">
              {currency === 'TCRO' ? '1 TCRO = 100 $RIFT' : '1 ETH = 10,000 $RIFT'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 leading-relaxed flex items-center justify-between">
            <span>💡 {currency === 'TCRO' ? 'Nạp Cronos đổi ngay thẻ bài' : '1 $RIFT = 0.0001 ETH'}</span>
            <span className="text-cyan-300 font-mono text-[11px]">
              Số dư: <strong>{currency === 'TCRO' ? `${balanceEth} TCRO` : `${balanceEth} ETH`}</strong>
            </span>
          </div>
        </div>

        {/* Quick Presets Selection */}
        <div className="mb-4">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Gói Nạp Đề Xuất ({currency})
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {activePresets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(p.val, p.rift)}
                className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-between ${
                  inputVal === p.val
                    ? 'bg-purple-600/30 border-purple-400 text-white shadow-md shadow-purple-500/20'
                    : 'bg-slate-950/70 border-rift-border hover:border-slate-600 text-slate-300'
                }`}
              >
                <span className="text-[10px] font-bold text-cyan-300">{p.val} {currency}</span>
                <span className="text-[11px] font-black text-amber-400 my-0.5">+{p.rift}</span>
                <span className="text-[8px] text-slate-400 truncate max-w-full">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Swap Form */}
        <div className="space-y-3 mb-5">
          {/* Input Chi Trả */}
          <div className="bg-slate-950 rounded-2xl p-3 border border-rift-border focus-within:border-cyan-500 transition">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Bạn Chi Trả (Từ Ví MetaMask)</span>
              <span>Đang kết nối: <strong className="text-cyan-300">{account ? `${account.slice(0, 6)}...` : 'Chưa có'}</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step={currency === 'TCRO' ? '1' : '0.01'}
                min="0.001"
                value={inputVal}
                onChange={(e) => handleInputChange(e.target.value)}
                className="bg-transparent text-2xl font-black text-cyan-400 w-full focus:outline-none font-mono"
                placeholder="0.0"
              />
              <span className="text-xs font-black px-2.5 py-1.5 bg-cyan-950/80 text-cyan-300 border border-cyan-800 rounded-xl flex items-center space-x-1 flex-shrink-0">
                <span>{currency}</span>
              </span>
            </div>
          </div>

          {/* Direction Divider */}
          <div className="flex justify-center -my-2 relative z-10">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg border-2 border-slate-900">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
          </div>

          {/* $RIFT Input (Nhận được) */}
          <div className="bg-slate-950 rounded-2xl p-3 border border-rift-border focus-within:border-amber-500 transition">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Bạn Nhận Được (Token Trong Game)</span>
              <span>Số dư hiện tại: <strong className="text-amber-400">{Number(balanceRift).toLocaleString()} $RIFT</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="10"
                min="1"
                value={riftInput}
                onChange={(e) => handleRiftChange(e.target.value)}
                className="bg-transparent text-2xl font-black text-amber-400 w-full focus:outline-none font-mono"
                placeholder="0"
              />
              <span className="text-xs font-black px-2.5 py-1.5 bg-amber-950/80 text-amber-300 border border-amber-800 rounded-xl flex items-center space-x-1 flex-shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
                <span>$RIFT</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Button: Swap via MetaMask */}
        <div className="space-y-2">
          {!account ? (
            <button
              onClick={connectMetaMask}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black py-3 rounded-2xl text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/25 active:scale-95 flex items-center justify-center space-x-2"
            >
              <Wallet className="w-4 h-4" />
              <span>Kết Nối Ví MetaMask Để Quy Đổi</span>
            </button>
          ) : (
            <button
              onClick={handleExecuteSwap}
              disabled={isSwapping || !parseFloat(inputVal)}
              className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-40 text-white font-black py-3 rounded-2xl text-xs uppercase tracking-wider transition shadow-xl shadow-purple-600/30 active:scale-95 flex items-center justify-center space-x-2 border border-purple-400/40"
            >
              {isSwapping ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang Ký Ví MetaMask & Chuyển Tiền...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>
                    Xác Nhận Đổi {inputVal} {currency} ➔ {Number(riftInput || 0).toLocaleString()} $RIFT
                  </span>
                </>
              )}
            </button>
          )}

          <div className="text-[10px] text-center text-slate-400 pt-0.5">
            Giao dịch chuyển tiền được xác thực bởi MetaMask • Token $RIFT cộng trực tiếp vào ví
          </div>
        </div>

      </div>
    </div>
  );
}
