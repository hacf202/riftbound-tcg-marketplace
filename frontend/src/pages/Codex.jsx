import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Sparkles, ShieldCheck, Terminal, ExternalLink, Code2, Cpu, X, Filter, Globe } from 'lucide-react';
import CardItem from '../components/CardItem';
import { useWeb3 } from '../context/Web3Context';

export default function Codex() {
  const { API_BASE, contractsConfig } = useWeb3();
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('');
  const [rarity, setRarity] = useState('');
  const [scope, setScope] = useState('primary'); // 'primary' (50 cards) | 'all' (352 cards)
  const [selectedCard, setSelectedCard] = useState(null);
  
  // Modal dành riêng cho Giảng viên / Đồ án học phần
  const [showTechModal, setShowTechModal] = useState(false);

  useEffect(() => {
    const limit = scope === 'all' ? 360 : 200;
    fetch(`${API_BASE}/cards?scope=${scope}&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success || data.status === 'success') {
          setCards(data.data);
        }
      })
      .catch((err) => console.error(err));
  }, [scope]);

  const filteredCards = cards.filter((c) => {
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.ability && c.ability.toLowerCase().includes(search.toLowerCase())) ||
      (c.scrydex_id && c.scrydex_id.toLowerCase().includes(search.toLowerCase())) ||
      (c.public_code && c.public_code.toLowerCase().includes(search.toLowerCase())) ||
      (c.printed_number && c.printed_number.includes(search));
    const matchDomain = !domain || c.domain.toLowerCase() === domain.toLowerCase() || (c.thematicDomain && c.thematicDomain.toLowerCase() === domain.toLowerCase());
    const matchRarity = !rarity || c.rarity.toLowerCase() === rarity.toLowerCase();
    return matchSearch && matchDomain && matchRarity;
  });

  const domains = [
    { name: 'Tất Cả', value: '' },
    { name: 'Fury (Cuồng Nộ)', value: 'Fury' },
    { name: 'Calm (Thanh Tịnh)', value: 'Calm' },
    { name: 'Mind (Tâm Trí)', value: 'Mind' },
    { name: 'Body (Thể Lực)', value: 'Body' },
    { name: 'Chaos (Hỗn Loạn)', value: 'Chaos' },
    { name: 'Order (Trật Tự)', value: 'Order' },
    { name: 'Colorless (Vô Sắc)', value: 'Colorless' },
  ];

  const endpoints = [
    { method: 'GET', path: '/api/v1/cards', desc: 'Chuẩn Scrydex: Hỗ trợ q, select, include, domain, rarity, phân trang' },
    { method: 'GET', path: '/api/v1/cards/:identifier', desc: 'Tra cứu theo ID số (1) hoặc mã Scrydex (OGN-296)' },
    { method: 'GET', path: '/api/v1/cards/expansions/:code', desc: 'Lấy toàn bộ thẻ bài theo mã bộ mở rộng (OGN, OGS)' },
    { method: 'GET', path: '/api/v1/cards/metadata/:id.json', desc: 'Chuẩn OpenSea Metadata cho NFT ERC-1155' },
    { method: 'GET', path: '/api/v1/marketplace/listings', desc: 'Danh sách các thẻ bài đang niêm yết bán trên sàn (SQLite)' },
    { method: 'GET', path: '/api/v1/marketplace/stats', desc: 'Thống kê tổng quan: Floor price, Volume, Fees' },
    { method: 'POST', path: '/api/v1/marketplace/sync-listing', desc: 'Đồng bộ lệnh niêm yết vừa tạo vào Database' },
    { method: 'POST', path: '/api/v1/marketplace/sync-sale', desc: 'Đồng bộ giao dịch mua vừa khớp vào Database' },
    { method: 'GET', path: '/api/v1/packs', desc: 'Danh sách 6 gói bài mở bán & tỉ lệ rơi thẻ (Drop rates)' },
    { method: 'GET', path: '/api/v1/users/:address/inventory', desc: 'Lấy túi đồ thẻ bài & định giá Portfolio của ví' },
    { method: 'GET', path: '/api/v1/marketplace/activities', desc: 'Lấy lịch sử giao dịch từ bảng transactions trong SQLite' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-rift-border/60 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Thư Viện Thẻ Bài Chuẩn Scrydex Riftbound API</span>
          </div>
          <h1 className="font-cinzel text-3xl md:text-4xl font-black text-slate-100 tracking-wide">
            RIFTBOUND CODEX
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Tra cứu toàn bộ 200 lá bài ma thuật chuẩn quốc tế Scrydex & Bilgewater Market, chỉ số chiến đấu, kỹ năng và artwork độc bản.
          </p>
        </div>

        {/* Nút mở Báo Cáo Kỹ Thuật (Dành riêng cho Thầy cô / Báo cáo) */}
        <button
          onClick={() => setShowTechModal(true)}
          className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-rift-border hover:border-amber-500/50 text-amber-300 px-4 py-2.5 rounded-2xl text-xs font-bold transition shadow-sm"
        >
          <Code2 className="w-4 h-4 text-amber-400" />
          <span>Báo Cáo Kỹ Thuật (Smart Contracts & API)</span>
        </button>
      </div>

      {/* Scope Switcher: 50 Core Web3 Cards vs Full 352 Scrydex Cards */}
      <div className="flex items-center space-x-3 bg-rift-card border border-rift-border p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setScope('primary')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            scope === 'primary'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>200 Thẻ Web3 & Sàn Giao Dịch</span>
        </button>
        <button
          onClick={() => setScope('all')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            scope === 'all'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Kho Dữ Liệu Scrydex Origins (352 Thẻ)</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-rift-card border border-rift-border rounded-2xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Tìm theo Scrydex: Void Gate, OGN-296, Annie, Draven..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-rift-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={rarity}
              onChange={(e) => setRarity(e.target.value)}
              className="bg-slate-900 border border-rift-border rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer w-full sm:w-auto"
            >
              <option value="">Tất Cả Độ Hiếm</option>
              <option value="Common">Common (Phổ Thông)</option>
              <option value="Uncommon">Uncommon (Không Phổ Biến)</option>
              <option value="Rare">Rare (Hiếm)</option>
              <option value="Epic">Epic (Sử Thi)</option>
              <option value="Mythic">Mythic / Showcase (Thần Thoại)</option>
            </select>
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-rift-border/50">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:inline mr-1">
            Hệ Tộc Scrydex:
          </span>
          {domains.map((d) => (
            <button
              key={d.value}
              onClick={() => setDomain(d.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
                domain === d.value
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-rift-border hover:bg-slate-800'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Catalog */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Hiển thị {filteredCards.length} / {scope === 'all' ? '352 Thẻ Scrydex Origins' : '200 Thẻ Web3'} Chuẩn Quốc Tế
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              onClick={() => setSelectedCard(card)}
              className="cursor-pointer transition-transform hover:-translate-y-1.5"
            >
              <CardItem card={card} mode="codex" />
            </div>
          ))}
        </div>
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-rift-card border border-rift-border rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden">
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-56 aspect-[744/1039] rounded-2xl overflow-hidden border border-rift-border bg-slate-950 p-1 shadow-xl flex-shrink-0">
                <img
                  src={selectedCard.image}
                  alt={selectedCard.name}
                  className="w-full h-full object-contain object-center rounded-xl"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/14a52a367fd41fd84745e050e62d1f281f733467-1038x744.png';
                  }}
                />
              </div>

              <div className="flex-1 text-left space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">{selectedCard.domain}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {selectedCard.rarity}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/50">
                    {selectedCard.public_code || selectedCard.printed_number || `#${String(selectedCard.id).padStart(3, '0')}`}
                  </span>
                </div>

                <h2 className="font-cinzel text-2xl font-bold text-slate-100">{selectedCard.name}</h2>
                <p className="text-xs text-slate-400 italic">{selectedCard.title}</p>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-rift-border text-xs text-slate-300 leading-relaxed">
                  <strong>Kỹ Năng:</strong> {selectedCard.ability}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  <strong>Mô Tả / Luật:</strong> {selectedCard.lore}
                </p>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-rift-border/60 text-[11px] grid grid-cols-2 gap-2 text-slate-300">
                  <div>Mã Scrydex: <strong className="text-cyan-400 font-mono">{selectedCard.scrydex_id || selectedCard.public_code}</strong></div>
                  <div>Bộ Mở Rộng: <strong className="text-slate-100">{selectedCard.expansion?.name || 'Origins (OGN)'}</strong></div>
                  <div>Giá Sàn Thị Trường: <strong className="text-amber-400">{selectedCard.marketFloorPrice} $RIFT</strong> (~${selectedCard.market?.usd_price || 2.5} USD)</div>
                  <div>Họa Sĩ (Artist): <strong className="text-slate-100">{selectedCard.artist}</strong></div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-rift-border text-xs text-slate-300 font-semibold">
                  <span>Mana: <strong className="text-amber-400">{selectedCard.cost}</strong></span>
                  <span>Công: <strong className="text-rose-400">{selectedCard.power} ATK</strong></span>
                  <span>Thủ: <strong className="text-cyan-400">{selectedCard.might} DEF</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL KỸ THUẬT DÀNH RIÊNG CHO BÁO CÁO HỌC PHẦN
      ======================================================== */}
      {showTechModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-rift-card border border-rift-border rounded-3xl p-6 md:p-8 shadow-2xl overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-rift-border">
              <div className="flex items-center space-x-2.5">
                <Cpu className="w-5 h-5 text-amber-400" />
                <h2 className="font-cinzel text-xl font-bold text-slate-100">
                  Báo Cáo Kỹ Thuật Đồ Án (Scrydex API, Smart Contracts & SQLite)
                </h2>
              </div>
              <button
                onClick={() => setShowTechModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrydex API Standards Note */}
            <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between text-xs">
              <div className="text-cyan-200">
                <strong>Tuân thủ chuẩn Scrydex Riftbound API:</strong> Backend hỗ trợ đầy đủ cấu trúc card model, tham số <code>q</code> (advanced search), <code>select</code>, <code>pagination</code>, <code>market</code> theo đặc tả tại <a href="https://scrydex.com/docs/riftbound/cards" target="_blank" rel="noreferrer" className="underline font-bold text-cyan-400">scrydex.com/docs/riftbound/cards</a>.
              </div>
              <a
                href="https://scrydex.com/docs/riftbound/cards"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs whitespace-nowrap ml-4 transition"
              >
                <span>Xem Docs</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Smart Contracts Grid */}
            <div>
              <h3 className="font-cinzel text-sm font-bold text-amber-300 mb-3 uppercase tracking-wider">
                1. Hệ Thống Smart Contracts (EVM Cancun / Solidity 0.8.24)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-rift-border">
                  <div className="flex justify-between font-bold text-amber-300 mb-1">
                    <span>RiftToken.sol ($RIFT)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20">ERC-20</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mb-2">Tiền tệ mua gói bài và giao dịch chợ, có hàm Faucet 1-Click.</p>
                  <div className="font-mono text-[10px] text-slate-300 bg-slate-950 p-1.5 rounded truncate">
                    {contractsConfig?.contracts?.RiftToken || '0x5FbDB2315678afecb367f032d93F642f64180aa3'}
                  </div>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-rift-border">
                  <div className="flex justify-between font-bold text-cyan-300 mb-1">
                    <span>RiftCardNFT.sol</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20">ERC-1155 + ERC-2981</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mb-2">Quản lý thẻ bài NFT, chia 2.5% phí bản quyền tự động.</p>
                  <div className="font-mono text-[10px] text-slate-300 bg-slate-950 p-1.5 rounded truncate">
                    {contractsConfig?.contracts?.RiftCardNFT || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'}
                  </div>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-rift-border">
                  <div className="flex justify-between font-bold text-purple-300 mb-1">
                    <span>RiftBoosterPack.sol</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20">Gacha Engine</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mb-2">Hợp đồng mở 6 gói thẻ ngẫu nhiên theo xác suất on-chain.</p>
                  <div className="font-mono text-[10px] text-slate-300 bg-slate-950 p-1.5 rounded truncate">
                    {contractsConfig?.contracts?.RiftBoosterPack || '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'}
                  </div>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-rift-border">
                  <div className="flex justify-between font-bold text-emerald-300 mb-1">
                    <span>RiftMarketplace.sol</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20">Trading Escrow</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mb-2">Sàn ký gửi Escrow an toàn, chia 95.5% Seller, 2% Phí sàn, 2.5% Bản quyền.</p>
                  <div className="font-mono text-[10px] text-slate-300 bg-slate-950 p-1.5 rounded truncate">
                    {contractsConfig?.contracts?.RiftMarketplace || '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'}
                  </div>
                </div>
              </div>

              {/* Remix IDE Notice */}
              <div className="mt-3 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between text-xs">
                <span className="text-amber-200">
                  Tương thích 100% với trình biên dịch trực tuyến <strong>Remix IDE</strong>.
                </span>
                <a
                  href="https://app.remix.live/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1 text-amber-400 hover:underline font-bold"
                >
                  <span>Mở Remix IDE</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* RESTful API Specs */}
            <div>
              <h3 className="font-cinzel text-sm font-bold text-cyan-300 mb-3 uppercase tracking-wider">
                2. Danh Mục RESTful API Gateway (Chuẩn Scrydex & SQLite)
              </h3>
              <div className="overflow-x-auto border border-rift-border rounded-xl">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-900 text-slate-400 font-bold uppercase">
                    <tr>
                      <th className="p-2.5">Method</th>
                      <th className="p-2.5">Endpoint</th>
                      <th className="p-2.5">Mô tả Chức Năng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rift-border font-mono">
                    {endpoints.map((ep, i) => (
                      <tr key={i} className="hover:bg-slate-900/50">
                        <td className="p-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${ep.method === 'GET' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {ep.method}
                          </span>
                        </td>
                        <td className="p-2 text-cyan-300">{ep.path}</td>
                        <td className="p-2 font-sans text-slate-300">{ep.desc}</td>
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
