import React, { useState, useEffect } from 'react';
import { RefreshCw, User, Globe } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { universalFetch, API_BASE } from '../utils/api';

export default function Activity() {
  const { account, dataVersion, triggerRefresh, shortAccount } = useWeb3();
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  const [viewScope, setViewScope] = useState('my'); // 'my' (ví của tôi) | 'all' (toàn sàn)
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = () => {
    setIsLoading(true);
    const currentAddr = account || '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
    const url =
      viewScope === 'my'
        ? `${API_BASE}/marketplace/activities?user=${encodeURIComponent(currentAddr)}&limit=50`
        : `${API_BASE}/marketplace/activities?limit=50`;

    universalFetch(url)
      .then((data) => {
        if (data && data.success) {
          setTransactions(data.data || []);
        } else {
          setTransactions([]);
        }
      })
      .catch((err) => console.error('Lỗi tải lịch sử giao dịch:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchTransactions();
  }, [account, dataVersion, viewScope]);

  const filtered = transactions.filter((tx) => {
    if (filterType === 'ALL') return true;
    return tx.type === filterType;
  });

  const getActionBadge = (tx) => {
    const isBuyer = tx.user_address && account && tx.user_address.toLowerCase() === account.toLowerCase();
    const isSeller = tx.seller_address && account && tx.seller_address.toLowerCase() === account.toLowerCase();

    switch (tx.type) {
      case 'SALE':
        if (isBuyer) {
          return {
            text: 'MUA THẺ',
            cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
            sign: '-',
            color: 'text-amber-400',
          };
        }
        if (isSeller) {
          return {
            text: 'BÁN THẺ',
            cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
            sign: '+',
            color: 'text-emerald-400',
          };
        }
        return {
          text: 'KHỚP LỆNH',
          cls: 'bg-slate-800 text-slate-300 border-slate-700',
          sign: '',
          color: 'text-slate-100',
        };
      case 'LISTING':
        return {
          text: 'RAO BÁN',
          cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          sign: '',
          color: 'text-slate-300',
        };
      case 'PACK_OPEN':
        return {
          text: 'MỞ GÓI',
          cls: 'bg-slate-800 text-slate-200 border-slate-700',
          sign: '-',
          color: 'text-slate-300',
        };
      case 'FAUCET':
        return {
          text: 'FAUCET',
          cls: 'bg-slate-800 text-slate-200 border-slate-700',
          sign: '+',
          color: 'text-slate-300',
        };
      case 'EXCHANGE':
        return {
          text: 'NẠP $RIFT',
          cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          sign: '+',
          color: 'text-amber-400',
        };
      case 'CANCEL':
        return {
          text: 'HỦY BÁN',
          cls: 'bg-rose-950/60 text-rose-300 border-rose-500/30',
          sign: '',
          color: 'text-rose-400',
        };
      default:
        return {
          text: tx.type,
          cls: 'bg-slate-800 text-slate-300 border-slate-700',
          sign: '',
          color: 'text-slate-200',
        };
    }
  };

  const formatTxTime = (timeStr) => {
    if (!timeStr) return '—';
    try {
      const d = new Date(timeStr);
      if (isNaN(d.getTime())) return timeStr;
      const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
      if (diffSec < 60) return 'Vừa xong';
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)} phút trước`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} giờ trước`;
      return d.toLocaleDateString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
      });
    } catch {
      return timeStr;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-5 animate-fade-in space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-100 tracking-wide">
            Lịch Sử Giao Dịch
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Ghi nhận các lệnh mua bán, quy đổi và mở gói thẻ.
          </p>
        </div>

        <button
          onClick={() => {
            fetchTransactions();
            triggerRefresh();
          }}
          className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Làm Mới</span>
        </button>
      </div>

      {/* Scope Switcher: Giao dịch của tôi vs Toàn bộ sàn */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 bg-slate-900 p-2 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setViewScope('my')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewScope === 'my'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Ví Của Tôi ({shortAccount})</span>
          </button>

          <button
            onClick={() => setViewScope('all')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewScope === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Toàn Bộ Sàn</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 px-1">
          {viewScope === 'my' ? (account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Chưa kết nối ví') : 'Toàn bộ sàn'}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'ALL', label: 'Tất Cả' },
          { id: 'EXCHANGE', label: 'Quy Đổi Token' },
          { id: 'SALE', label: 'Mua / Bán Thẻ' },
          { id: 'LISTING', label: 'Rao Bán' },
          { id: 'PACK_OPEN', label: 'Mở Gói' },
          { id: 'CANCEL', label: 'Hủy Niêm Yết' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilterType(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap border ${
              filterType === t.id
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/50 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-[10px] text-slate-400 uppercase font-semibold">
                <th className="py-2.5 px-3">Mã GD</th>
                <th className="py-2.5 px-3">Hành Động</th>
                <th className="py-2.5 px-3">Ví Thực Hiện</th>
                <th className="py-2.5 px-3">Thẻ Bài / Nội Dung</th>
                <th className="py-2.5 px-3">Số Lượng</th>
                <th className="py-2.5 px-3">Giá Trị</th>
                <th className="py-2.5 px-3 text-right">Thời Gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((tx) => {
                const badge = getActionBadge(tx);
                const isMyTx =
                  account &&
                  ((tx.user_address && tx.user_address.toLowerCase() === account.toLowerCase()) ||
                    (tx.seller_address && tx.seller_address.toLowerCase() === account.toLowerCase()));

                return (
                  <tr
                    key={tx.id}
                    className={`hover:bg-slate-800/40 transition ${isMyTx ? 'bg-amber-500/5' : ''}`}
                  >
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">#{tx.id}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${badge.cls}`}>
                        {badge.text}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-300">
                      {tx.user_address ? (
                        <span
                          title={tx.user_address}
                          className={
                            account && tx.user_address.toLowerCase() === account.toLowerCase()
                              ? 'text-amber-400 font-bold'
                              : 'text-slate-400'
                          }
                        >
                          {tx.user_address.slice(0, 6)}...{tx.user_address.slice(-4)}
                          {account && tx.user_address.toLowerCase() === account.toLowerCase() && ' (Bạn)'}
                        </span>
                      ) : (
                        'Hệ thống'
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-200">
                      <div className="font-bold text-slate-100">{tx.card_name || 'Vật phẩm TCG'}</div>
                      {tx.details && (
                        <div className="text-[10px] text-slate-500 truncate max-w-xs">{tx.details}</div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-300">
                      {tx.quantity ? `x${tx.quantity}` : '—'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-xs font-bold">
                      <span className={badge.color}>
                        {badge.sign}
                        {tx.total_price || tx.price || 0} $RIFT
                      </span>
                    </td>
                    <td
                      className="py-2.5 px-3 text-right text-slate-400 font-mono text-[11px]"
                      title={tx.created_at ? new Date(tx.created_at).toLocaleString('vi-VN') : ''}
                    >
                      {formatTxTime(tx.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs">
            {viewScope === 'my'
              ? 'Tài khoản chưa có giao dịch nào trong danh mục đã chọn.'
              : 'Chưa có giao dịch nào trong danh mục đã chọn.'}
          </div>
        )}
      </div>
    </div>
  );
}
