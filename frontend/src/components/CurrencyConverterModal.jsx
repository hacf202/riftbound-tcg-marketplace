import React, { useState } from 'react';
import { X, ArrowDown } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';

export default function CurrencyConverterModal({ isOpen, onClose }) {
  const {
    account,
    balanceEth,
    balanceRift,
    RIFT_PER_ETH,
    depositCryptoForRift,
    connectMetaMask,
    claimFaucet,
    chainId,
  } = useWeb3();

  const isCronos =
    Number(chainId) === 338 ||
    (typeof window !== 'undefined' && window.location.hostname !== 'localhost');

  const [currency, setCurrency] = useState(() => (isCronos ? 'TCRO' : 'ETH'));
  const [inputVal, setInputVal] = useState(() => (isCronos ? '10' : '0.1'));
  const [riftInput, setRiftInput] = useState(() => (isCronos ? '1000' : '1000'));
  const [isSwapping, setIsSwapping] = useState(false);

  React.useEffect(() => {
    if (isCronos) {
      setCurrency('TCRO');
      setInputVal('10');
      setRiftInput('1000');
    }
  }, [chainId, isCronos, isOpen]);

  if (!isOpen) return null;

  const currentRate = currency === 'TCRO' ? 100 : RIFT_PER_ETH;

  const presetsETH = [
    { val: '0.05', rift: '500' },
    { val: '0.1', rift: '1,000' },
    { val: '0.25', rift: '2,500' },
    { val: '0.5', rift: '5,000' },
    { val: '1.0', rift: '10,000' },
  ];

  const presetsTCRO = [
    { val: '2', rift: '200' },
    { val: '5', rift: '500' },
    { val: '10', rift: '1,000' },
    { val: '25', rift: '2,500' },
    { val: '50', rift: '5,000' },
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
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-xl relative text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-100">Quy Đổi Tiền Tệ</h2>
          <p className="text-xs text-slate-400">Nạp token $RIFT bằng tiền tệ blockchain</p>
        </div>

        {/* Currency Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-3.5">
          <button
            type="button"
            onClick={() => handleCurrencySwitch('TCRO')}
            className={`py-1.5 rounded-lg text-xs font-semibold transition ${
              currency === 'TCRO'
                ? 'bg-slate-800 text-amber-300 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cronos Testnet (TCRO)
          </button>

          <button
            type="button"
            onClick={() => handleCurrencySwitch('ETH')}
            className={`py-1.5 rounded-lg text-xs font-semibold transition ${
              currency === 'ETH'
                ? 'bg-slate-800 text-amber-300 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ethereum (ETH)
          </button>
        </div>

        {/* Rate & Balance */}
        <div className="flex items-center justify-between text-xs py-2 px-3 bg-slate-950 rounded-xl border border-slate-800 mb-3.5">
          <span className="text-slate-400 font-medium">
            Tỷ giá: <span className="text-slate-200 font-mono">{currency === 'TCRO' ? '1 TCRO = 100 $RIFT' : '1 ETH = 10,000 $RIFT'}</span>
          </span>
          <span className="text-slate-400 font-mono">
            Số dư: <span className="text-amber-400 font-semibold">{balanceEth} {currency}</span>
          </span>
        </div>

        {/* Quick Presets */}
        <div className="mb-3.5">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Mức nạp nhanh
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {activePresets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(p.val, p.rift)}
                className={`py-1.5 px-1 rounded-lg border text-center transition ${
                  inputVal === p.val
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <div className="text-[11px] font-mono leading-tight">{p.val}</div>
                <div className="text-[9px] text-slate-400">+{p.rift}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-2 mb-4">
          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 focus-within:border-amber-500/60 transition">
            <div className="text-[11px] text-slate-400 mb-1">Chi trả ({currency})</div>
            <div className="flex items-center justify-between">
              <input
                type="number"
                step={currency === 'TCRO' ? '1' : '0.01'}
                min="0.001"
                value={inputVal}
                onChange={(e) => handleInputChange(e.target.value)}
                className="bg-transparent text-xl font-bold text-slate-100 w-full focus:outline-none font-mono"
                placeholder="0.0"
              />
              <span className="text-xs font-semibold text-slate-400 ml-2 font-mono">{currency}</span>
            </div>
          </div>

          <div className="flex justify-center -my-1">
            <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center border border-slate-700">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 focus-within:border-amber-500/60 transition">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Nhận được ($RIFT)</span>
              <span>Hiện có: <strong className="text-amber-400 font-mono">{Number(balanceRift).toLocaleString()}</strong></span>
            </div>
            <div className="flex items-center justify-between">
              <input
                type="number"
                step="10"
                min="1"
                value={riftInput}
                onChange={(e) => handleRiftChange(e.target.value)}
                className="bg-transparent text-xl font-bold text-amber-400 w-full focus:outline-none font-mono"
                placeholder="0"
              />
              <span className="text-xs font-semibold text-amber-400 ml-2 font-mono">$RIFT</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-2.5">
          {!account ? (
            <button
              onClick={connectMetaMask}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition active:scale-95"
            >
              Kết nối ví MetaMask
            </button>
          ) : (
            <button
              onClick={handleExecuteSwap}
              disabled={isSwapping || !parseFloat(inputVal)}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition active:scale-95"
            >
              {isSwapping ? 'Đang xử lý...' : 'Xác Nhận Đổi Token'}
            </button>
          )}

          {/* Quick Faucet Links */}
          <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
            <a
              href="https://cronos.org/faucet"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-slate-400 hover:text-slate-200 transition"
            >
              Nhận tCRO miễn phí (Faucet)
            </a>

            <button
              type="button"
              onClick={async () => {
                await claimFaucet();
              }}
              className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition"
            >
              Nhận 1,000 $RIFT (Faucet)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
