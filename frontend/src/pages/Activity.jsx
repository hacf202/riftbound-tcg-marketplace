import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  Filter,
  ExternalLink,
  ShieldCheck,
  User,
  Globe,
  Coins,
  Tag,
  Package,
} from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';

export default function Activity() {
  const { API_BASE, account, dataVersion, triggerRefresh, shortAccount } = useWeb3();
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

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTransactions(data.data || []);
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
            text: 'MUA THẺ (Khớp Lệnh)',
            cls: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
            sign: '-',
            color: 'text-amber-400',
          };
        }
        if (isSeller) {
          return {
            text: 'BÁN THẺ (Đã Khớp)',
            cls: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
            sign: '+',
            color: 'text-emerald-400',
          };
        }
        return {
          text: 'KHỚP LỆNH SÀN',
          cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
          sign: '',
          color: 'text-slate-100',
        };
      case 'LISTING':
        return {
          text: 'RAO BÁN SÀN',
          cls: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
          sign: '',
          color: 'text-slate-300',
        };
      case 'PACK_OPEN':
        return {
          text: 'MỞ GÓI THẺ',
          cls: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
          sign: '-',
          color: 'text-purple-300',
        };
      case 'FAUCET':
        return {
          text: 'NHẬN FAUCET',
          cls: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
          sign: '+',
          color: 'text-cyan-300',
        };
      case 'EXCHANGE':
        return {
          text: 'ĐỔI ETH SANG $RIFT',
          cls: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
          sign: '+',
          color: 'text-amber-400',
        };
      case 'CANCEL':
        return {
          text: 'HỦY NIÊM YẾT',
          cls: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
          sign: '',
          color: 'text-rose-400',
        };
      default:
        return {
          text: tx.type,
          cls: 'bg-slate-700 text-slate-300 border-slate-600',
          sign: '',
          color: 'text-slate-200',
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-rift-border/60 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-2">
            <History className="w-3.5 h-3.5" />
            <span>SQLite Database Ledger • Đồng Bộ Tài Khoản Thời Gian Thực</span>
          </div>
          <h1 className="font-cinzel text-3xl font-black text-slate-100 tracking-wide">
            LỊCH SỬ GIAO DỊCH
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Ghi nhận chính xác từng lệnh mua, bán, xé gói và faucet lưu trữ vĩnh viễn trong cơ sở dữ liệu.
          </p>
        </div>

        <button
          onClick={() => {
            fetchTransactions();
            triggerRefresh();
          }}
          className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-rift-border text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition shadow"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Làm Mới</span>
        </button>
      </div>

      {/* Scope Switcher: Giao dịch của tôi vs Toàn bộ sàn */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950/80 p-2 rounded-2xl border border-rift-border">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewScope('my')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              viewScope === 'my'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>Giao Dịch Của Tôi ({shortAccount})</span>
          </button>

          <button
            onClick={() => setViewScope('all')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              viewScope === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Toàn Bộ Sàn Giao Dịch</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 px-2">
          Đang xem:{' '}
          <strong className="text-slate-200 font-mono">
            {viewScope === 'my' ? (account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Chưa kết nối ví') : 'Toàn bộ mạng lưới'}
          </strong>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {[
          { id: 'ALL', label: 'Tất Cả' },
          { id: 'EXCHANGE', label: '⚡ Quy Đổi ETH' },
          { id: 'SALE', label: 'Mua / Bán Thẻ' },
          { id: 'LISTING', label: 'Rao Bán Sàn' },
          { id: 'PACK_OPEN', label: 'Mở Gói Thẻ' },
          { id: 'CANCEL', label: 'Hủy Niêm Yết' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilterType(t.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
              filterType === t.id
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 border-rift-border hover:bg-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="bg-rift-card border border-rift-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-rift-border bg-slate-950/70 text-[10px] text-slate-400 uppercase font-semibold">
                <th className="py-3 px-4">Mã GD</th>
                <th className="py-3 px-4">Hành Động</th>
                <th className="py-3 px-4">Ví Thực Hiện</th>
                <th className="py-3 px-4">Thẻ Bài / Nội Dung</th>
                <th className="py-3 px-4">Số Lượng</th>
                <th className="py-3 px-4">Giá Trị ($RIFT)</th>
                <th className="py-3 px-4">Phí Sàn & Royalty</th>
                <th className="py-3 px-4 text-right">Thời Gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rift-border/40">
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
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">#{tx.id}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md border text-[10px] font-extrabold uppercase ${badge.cls}`}>
                        {badge.text}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
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
                    <td className="py-3 px-4 font-medium text-slate-200">
                      <div className="font-bold text-slate-100">{tx.card_name || 'Vật phẩm TCG'}</div>
                      {tx.details && (
                        <div className="text-[10px] text-slate-500 truncate max-w-xs">{tx.details}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-300">
                      {tx.quantity ? `x${tx.quantity}` : '—'}
                    </td>
                    <td className="py-3 px-4 font-mono text-sm font-black">
                      <span className={badge.color}>
                        {badge.sign}
                        {tx.total_price || tx.price || 0} $RIFT
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[10px] text-slate-400 font-mono">
                      {tx.protocol_fee ? (
                        <span>
                          Sàn: {tx.protocol_fee} • Bản quyền: {tx.royalty_fee}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400 font-mono text-[11px]">
                      {tx.created_at}
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
              ? 'Tài khoản này chưa có giao dịch nào trong danh mục đã chọn.'
              : 'Chưa có giao dịch nào trong danh mục đã chọn.'}
          </div>
        )}
      </div>
    </div>
  );
}
