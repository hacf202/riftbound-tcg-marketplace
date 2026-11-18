import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import CardItem from '../components/CardItem';
import { useWeb3 } from '../context/Web3Context';
import { universalFetch, API_BASE } from '../utils/api';

export default function Codex() {
  const { contractsConfig } = useWeb3();
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [domain, setDomain] = useState('');
  const [rarity, setRarity] = useState('');
  const [scope, setScope] = useState('primary'); // 'primary' (50 cards) | 'all' (352 cards)
  const [selectedCard, setSelectedCard] = useState(null);
  const [showTechModal, setShowTechModal] = useState(false);

  // Search debounce (350ms - Rule 9)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const limit = scope === 'all' ? 400 : 200;
    universalFetch(`${API_BASE}/cards?scope=${scope}&limit=${limit}`)
      .then((data) => {
        if (data && (data.success || data.status === 'success')) {
          setCards(data.data || []);
        }
      })
      .catch((err) => console.error(err));
  }, [scope]);

  const filteredCards = cards.filter((c) => {
    const q = debouncedSearch.toLowerCase();
    const matchSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      (c.ability && c.ability.toLowerCase().includes(q)) ||
      (c.scrydex_id && c.scrydex_id.toLowerCase().includes(q)) ||
      (c.public_code && c.public_code.toLowerCase().includes(q)) ||
      (c.printed_number && c.printed_number.includes(q));
    const matchDomain = !domain || c.domain.toLowerCase() === domain.toLowerCase() || (c.thematicDomain && c.thematicDomain.toLowerCase() === domain.toLowerCase());
    const matchRarity = !rarity || c.rarity.toLowerCase() === rarity.toLowerCase();
    return matchSearch && matchDomain && matchRarity;
  });

  const domains = [
    { name: 'Tất Cả', value: '' },
    { name: 'Fury', value: 'Fury' },
    { name: 'Calm', value: 'Calm' },
    { name: 'Mind', value: 'Mind' },
    { name: 'Body', value: 'Body' },
    { name: 'Chaos', value: 'Chaos' },
    { name: 'Order', value: 'Order' },
    { name: 'Colorless', value: 'Colorless' },
  ];

  const endpoints = [
    { method: 'GET', path: '/api/v1/cards', desc: 'Danh sách thẻ bài: Hỗ trợ tìm kiếm, lọc hệ, độ hiếm' },
    { method: 'GET', path: '/api/v1/cards/:identifier', desc: 'Tra cứu thẻ theo ID hoặc mã định danh' },
    { method: 'GET', path: '/api/v1/cards/expansions/:code', desc: 'Thẻ bài theo bộ mở rộng' },
    { method: 'GET', path: '/api/v1/marketplace/listings', desc: 'Danh sách các thẻ bài đang niêm yết bán' },
    { method: 'GET', path: '/api/v1/marketplace/stats', desc: 'Thống kê tổng quan sàn: Giá sàn, Volume' },
    { method: 'GET', path: '/api/v1/packs', desc: 'Danh sách các gói thẻ bài' },
    { method: 'GET', path: '/api/v1/users/:address/inventory', desc: 'Kho thẻ bài cá nhân theo địa chỉ ví' },
    { method: 'GET', path: '/api/v1/marketplace/activities', desc: 'Lịch sử giao dịch on-chain & off-chain' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-5 animate-fade-in space-y-4">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-100 tracking-wide">
            Bách Khoa Thẻ Bài (Codex)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Tra cứu toàn bộ thẻ bài, chỉ số chiến đấu và kỹ năng.
          </p>
        </div>

        <button
          onClick={() => setShowTechModal(true)}
          className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 px-3.5 py-2 rounded-lg text-xs font-bold transition"
        >
          Thông Số Kỹ Thuật (API & Contracts)
        </button>
      </div>

      {/* Scope Switcher */}
      <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl w-fit">
        <button
          onClick={() => setScope('primary')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            scope === 'primary'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          200 Thẻ Sàn Giao Dịch
        </button>
        <button
          onClick={() => setScope('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            scope === 'all'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Toàn Bộ Kho Dữ Liệu (352 Thẻ)
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2.5 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo tên thẻ, kỹ năng, mã..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={rarity}
              onChange={(e) => setRarity(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer w-full sm:w-auto"
            >
              <option value="">Tất Cả Độ Hiếm</option>
              <option value="Common">Common</option>
              <option value="Uncommon">Uncommon</option>
              <option value="Rare">Rare</option>
              <option value="Epic">Epic</option>
              <option value="Mythic">Mythic</option>
            </select>
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-800 no-scrollbar">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider hidden sm:inline mr-1">
            Hệ Tộc:
          </span>
          {domains.map((d) => (
            <button
              key={d.value}
              onClick={() => setDomain(d.value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap border ${
                domain === d.value
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Catalog */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            Hiển thị {filteredCards.length} thẻ
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredCards.map((card) => (
            <CardItem
              key={card.id || card.scrydex_id}
              card={card}
              mode="codex"
            />
          ))}
        </div>
      </div>

      {/* Tech Specifications Modal */}
      {showTechModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl overflow-y-auto max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="font-cinzel text-base font-bold text-slate-100">Thông Số Kỹ Thuật & API</h2>
              <button
                onClick={() => setShowTechModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* RESTful API Specs */}
            <div className="space-y-3">
              <h3 className="font-cinzel text-xs font-bold text-amber-400 uppercase tracking-wider">
                Danh Mục RESTful API Gateway
              </h3>
              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-semibold">
                    <tr>
                      <th className="p-2.5">Method</th>
                      <th className="p-2.5">Endpoint</th>
                      <th className="p-2.5">Chức Năng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                    {endpoints.map((ep, i) => (
                      <tr key={i} className="hover:bg-slate-950/40">
                        <td className="p-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${ep.method === 'GET' ? 'bg-amber-500/15 text-amber-400' : 'bg-slate-800 text-slate-300'}`}>
                            {ep.method}
                          </span>
                        </td>
                        <td className="p-2 text-slate-300">{ep.path}</td>
                        <td className="p-2 font-sans text-slate-400">{ep.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
