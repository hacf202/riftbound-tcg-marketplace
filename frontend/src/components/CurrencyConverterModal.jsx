import React, { useState } from 'react';
import { ArrowLeftRight, X, Sparkles, Coins, Zap, Info, ExternalLink } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';

export default function CurrencyConverterModal({ isOpen, onClose }) {
  const { balanceEth, balanceRift, RIFT_PER_ETH, account } = useWeb3();
  const [ethInput, setEthInput] = useState('0.1');
  const [riftInput, setRiftInput] = useState('1000');

  if (!isOpen) return null;

  const handleEthChange = (val) => {
    setEthInput(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setRiftInput((num * RIFT_PER_ETH).toString());
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-purple-400 uppercase font-black tracking-wider">CƠ CHẾ QUY ĐỔI TIỀN TỆ WEB3</div>
            <h2 className="font-cinzel text-xl font-bold text-white">Quy Đổi ETH ↔ $RIFT Token</h2>
          </div>
        </div>

        {/* Exchange Rate Badge */}
        <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-4 mb-5 shadow-inner">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400">Tỷ giá định chuẩn hệ sinh thái:</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-black text-[11px] border border-amber-500/40">
              1 ETH = 10,000 $RIFT
            </span>
          </div>
          <div className="text-[11px] text-slate-400 leading-relaxed">
            💡 Tương đương: <strong className="text-cyan-300">1 $RIFT = 0.0001 ETH</strong> (100,000 Gwei trên Ethereum EVM).
          </div>
        </div>

        {/* Live Converter Form */}
        <div className="space-y-4 mb-6">
          {/* ETH Input */}
          <div className="bg-slate-950 rounded-2xl p-3 border border-rift-border focus-within:border-cyan-500 transition">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Đồng Ethereum (ETH)</span>
              <span>Ví của bạn: <strong className="text-slate-200">{balanceEth} ETH</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="0.001"
                min="0"
                value={ethInput}
                onChange={(e) => handleEthChange(e.target.value)}
                className="bg-transparent text-xl font-black text-cyan-400 w-full focus:outline-none"
                placeholder="0.0"
              />
              <span className="text-xs font-black px-2 py-1 bg-cyan-950/80 text-cyan-300 border border-cyan-800 rounded-lg">
                ETH
              </span>
            </div>
          </div>

          <div className="flex justify-center -my-2 relative z-10">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg border-2 border-slate-900">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
          </div>

          {/* $RIFT Input */}
          <div className="bg-slate-950 rounded-2xl p-3 border border-rift-border focus-within:border-amber-500 transition">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Tiền Tệ Trong Game ($RIFT)</span>
              <span>Ví của bạn: <strong className="text-amber-300">{Number(balanceRift).toLocaleString()} $RIFT</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="1"
                min="0"
                value={riftInput}
                onChange={(e) => handleRiftChange(e.target.value)}
                className="bg-transparent text-xl font-black text-amber-400 w-full focus:outline-none"
                placeholder="0"
              />
              <span className="text-xs font-black px-2 py-1 bg-amber-950/80 text-amber-300 border border-amber-800 rounded-lg">
                $RIFT
              </span>
            </div>
          </div>
        </div>

        {/* Explanatory Info Box */}
        <div className="bg-purple-950/20 border border-purple-500/30 rounded-2xl p-3.5 text-xs space-y-2 mb-6">
          <div className="flex items-center space-x-1.5 font-bold text-purple-300">
            <Info className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span>Quy Đổi Trên Mạng Blockchain & Remix:</span>
          </div>
          <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
            <li><strong>Trên Remix IDE / Hardhat Node</strong>: Tài khoản khởi tạo nhận sẵn <strong>10,000 ETH</strong> để trả phí Gas giao dịch.</li>
            <li><strong>Trong Game Riftbound TCG</strong>: Dùng tiền tệ nội bộ <strong>$RIFT (ERC-20)</strong> để mua bán thẻ bài và mở gói mà không lo biến động giá ETH.</li>
            <li><strong>Cơ Chế Kháng Lạm Phát</strong>: Khi người chơi dùng $RIFT mở gói bài, token được thu hồi hoặc tiêu hủy (Burn Mechanism).</li>
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 transition"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
