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
    depositEthForRift,
    connectMetaMask,
  } = useWeb3();

  const [ethInput, setEthInput] = useState('0.1');
  const [riftInput, setRiftInput] = useState('1000');
  const [isSwapping, setIsSwapping] = useState(false);

  if (!isOpen) return null;

  const presets = [
    { eth: '0.05', rift: '500', label: 'Tân Thủ' },
    { eth: '0.1', rift: '1,000', label: '⭐ Phổ Biến' },
    { eth: '0.25', rift: '2,500', label: 'Chiến Binh' },
    { eth: '0.5', rift: '5,000', label: 'Cao Cấp' },
    { eth: '1.0', rift: '10,000', label: '👑 Hoàng Gia' },
  ];

  const handleEthChange = (val) => {
    setEthInput(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setRiftInput(Math.round(num * RIFT_PER_ETH).toString());
    } else {
      setRiftInput('');
    }
  };

  const handleRiftChange = (val) => {
    setRiftInput(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setEthInput((num / RIFT_PER_ETH).toFixed(4));
    } else {
      setEthInput('');
    }
  };

  const handleSelectPreset = (ethVal, riftVal) => {
    setEthInput(ethVal);
    setRiftInput(riftVal.replace(/,/g, ''));
  };

  const handleExecuteSwap = async () => {
    if (!account) {
      await connectMetaMask();
      return;
    }
    const num = parseFloat(ethInput);
    if (isNaN(num) || num <= 0) return;

    setIsSwapping(true);
    const success = await depositEthForRift(num);
    setIsSwapping(false);
    if (success) {
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  const hasEnoughEth = parseFloat(balanceEth || '0') >= (parseFloat(ethInput) || 0);

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
            <h2 className="font-cinzel text-xl font-bold text-white">Nạp $RIFT Bằng Đồng ETH</h2>
          </div>
        </div>

        {/* Tỷ giá định chuẩn Banner */}
        <div className="bg-slate-950/90 border border-amber-500/30 rounded-2xl p-3.5 mb-5 shadow-inner">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">Tỷ giá định chuẩn hệ sinh thái:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-black text-xs border border-amber-500/40">
              1 ETH = 10,000 $RIFT
            </span>
          </div>
          <div className="text-[11px] text-slate-400 leading-relaxed flex items-center justify-between">
            <span>💡 1 $RIFT = 0.0001 ETH</span>
            <span className="text-cyan-300 font-mono text-[11px]">Số dư ví: <strong>{balanceEth} ETH</strong></span>
          </div>
        </div>

        {/* Quick Presets Selection */}
        <div className="mb-4">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Gói Nhanh Đề Xuất
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(p.eth, p.rift)}
                className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-between ${
                  ethInput === p.eth
                    ? 'bg-purple-600/30 border-purple-400 text-white shadow-md shadow-purple-500/20'
                    : 'bg-slate-950/70 border-rift-border hover:border-slate-600 text-slate-300'
                }`}
              >
                <span className="text-[10px] font-bold text-cyan-300">{p.eth} ETH</span>
                <span className="text-[11px] font-black text-amber-400 my-0.5">+{p.rift}</span>
                <span className="text-[8px] text-slate-400 truncate max-w-full">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Swap Form */}
        <div className="space-y-3 mb-5">
          {/* ETH Input (Chi trả) */}
          <div className="bg-slate-950 rounded-2xl p-3.5 border border-rift-border focus-within:border-cyan-500 transition">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Bạn Chi Trả (Từ Ví MetaMask)</span>
              <span>Khả dụng: <strong className="text-cyan-300">{balanceEth} ETH</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="0.01"
                min="0.001"
                value={ethInput}
                onChange={(e) => handleEthChange(e.target.value)}
                className="bg-transparent text-2xl font-black text-cyan-400 w-full focus:outline-none font-mono"
                placeholder="0.0"
              />
              <span className="text-xs font-black px-2.5 py-1.5 bg-cyan-950/80 text-cyan-300 border border-cyan-800 rounded-xl flex items-center space-x-1 flex-shrink-0">
                <Coins className="w-3.5 h-3.5" />
                <span>ETH</span>
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
          <div className="bg-slate-950 rounded-2xl p-3.5 border border-rift-border focus-within:border-amber-500 transition">
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

        {/* Warning if insufficient ETH */}
        {account && !hasEnoughEth && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center space-x-2">
            <span className="font-bold">⚠️ Số dư ETH không đủ ({balanceEth} ETH). Vui lòng chọn số lượng nhỏ hơn!</span>
          </div>
        )}

        {/* Action Button: Swap via MetaMask */}
        <div className="space-y-2">
          {!account ? (
            <button
              onClick={connectMetaMask}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black py-3.5 rounded-2xl text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/25 active:scale-95 flex items-center justify-center space-x-2"
            >
              <Wallet className="w-4 h-4" />
              <span>Kết Nối Ví MetaMask Để Quy Đổi</span>
            </button>
          ) : (
            <button
              onClick={handleExecuteSwap}
              disabled={isSwapping || !hasEnoughEth || !parseFloat(ethInput)}
              className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-40 text-white font-black py-3.5 rounded-2xl text-xs md:text-sm uppercase tracking-wider transition shadow-xl shadow-purple-600/30 active:scale-95 flex items-center justify-center space-x-2 border border-purple-400/40"
            >
              {isSwapping ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang Ký Ví MetaMask & Xác Nhận Block...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>
                    Xác Nhận Đổi {ethInput} ETH ➔ {Number(riftInput || 0).toLocaleString()} $RIFT
                  </span>
                </>
              )}
            </button>
          )}

          <div className="text-[10px] text-center text-slate-400 pt-1">
            Giao dịch chuyển ETH được xác thực bởi MetaMask • Token $RIFT cộng trực tiếp vào ví
          </div>
        </div>

      </div>
    </div>
  );
}
