# RIFTBOUND TCG MARKETPLACE - SÀN GIAO DỊCH VẬT PHẨM ẢO & THẺ BÀI NFT

Hệ thống dApp toàn diện ứng dụng công nghệ Blockchain EVM để quản lý, mở gói (Gacha / Booster Pack) và giao dịch mua bán các thẻ bài NFT và vật phẩm ảo. Lấy cảm hứng từ vũ trụ **Riftbound** và giao diện chợ **Bilgewater Market**. Dự án được thiết kế chuyên biệt phục vụ việc làm **Báo Cáo Học Phần / Khóa Luận Tốt Nghiệp** với đầy đủ các chuẩn Web3 công nghiệp.

> 📖 **TÀI LIỆU QUAN TRỌNG ĐÍNH KÈM:**
> - 📘 **[Hướng Dẫn Khởi Động & Sử Dụng Hệ Thống (HUONG_DAN_SU_DUNG.md)](./HUONG_DAN_SU_DUNG.md)**: Hướng dẫn cấu hình ví MetaMask, khởi động 3 terminal, nhận Faucet và giao dịch.
> - 📗 **[Báo Cáo Chuyên Sâu Công Nghệ Blockchain & Kinh Tế Học (TAI_LIEU_BLOCKCHAIN_VA_KINH_TE.md)](./TAI_LIEU_BLOCKCHAIN_VA_KINH_TE.md)**: Phân tích chuẩn ERC-1155, kiểm tra EVM, dòng tiền bản quyền 2.5%, phí sàn 2.0%, cơ chế chống lạm phát token $RIFT, quy trình P2P Escrow và định giá thẻ bài.

---

## 🌟 Tính Năng Nổi Bật

1. **Hệ Thống Tokenomics Hoàn Chỉnh (3 Chuẩn Token Cốt Lõi)**:
   - **`$RIFT` Token (ERC-20)**: Đồng tiền tệ in-game, tích hợp sẵn **Nút Faucet 1-Click** ngay trên thanh Navbar giúp hội đồng chấm bài và giảng viên nhận 1,000 $RIFT trải nghiệm ngay tức thì.
   - **Rift Cards & Items (ERC-1155)**: Quản lý toàn bộ thẻ bài và vật phẩm ảo. Tiết kiệm 70-80% phí gas so với chuẩn ERC-721 nhờ cơ chế Batch Transfer/Mint.
   - **Bản quyền tác giả tự động (ERC-2981)**: Tự động trích 2.5% giá trị giao dịch mỗi lần thẻ bài được bán lại chuyển về quỹ sáng tạo (Royalty Vault).
2. **Sàn Giao Dịch Phi Tập Trung (Trading Escrow Marketplace)**:
   - Cơ chế ký gửi Escrow an toàn chống gian lận và chống tấn công Reentrancy (`ReentrancyGuard`).
   - Phân chia thanh toán tự động: 95.5% về Người Bán, 2.0% Phí Sàn (Protocol Fee), 2.5% Phí Bản Quyền (Royalty).
   - Cho phép người bán hủy niêm yết và rút thẻ về ví bất cứ lúc nào.
3. **Cơ Chế Bóc Gói Thẻ Bài (Booster Pack / Gacha Opening)**:
   - Gói Tân Thủ (**Novice Rift Pack** - 100 $RIFT): 3 lá bài ngẫu nhiên.
   - Gói Hoàng Gia (**Void Master Pack** - 250 $RIFT): 5 lá bài với cơ hội trúng thẻ Huyền Thoại và Thần Khí Tối Thượng.
   - Giao diện bóc thẻ kịch tính với hiệu ứng lật bài 3D và ánh sáng viền hào quang theo độ hiếm.
4. **RESTful API Backend Chuẩn Mực**:
   - Tuân thủ quy chuẩn REST: Versioning `/api/v1/`, Pagination, Filtering (Hệ Faction, Rarity, Giá), Sorting.
   - Metadata Endpoint chuẩn OpenSea: `/api/v1/cards/metadata/:id.json`.
5. **Tương Thích 100% với Remix IDE (`https://app.remix.live/`)**:
   - Hỗ trợ triển khai nhanh chóng từ trình duyệt lên Sepolia / Base Sepolia qua MetaMask.

---

## 🏗️ Cấu Trúc Thư Mục Dự Án

```
d:\BlockChain\
├── contracts/                  # Smart Contracts (Hardhat, Solidity 0.8.24)
│   ├── contracts/
│   │   ├── RiftToken.sol       # ERC-20 Currency & Faucet 1-Click
│   │   ├── RiftCardNFT.sol     # ERC-1155 Cards & ERC-2981 Royalties
│   │   ├── RiftBoosterPack.sol # Gacha Pack Opening Engine
│   │   └── RiftMarketplace.sol # Sàn Giao Dịch Ký Gửi Escrow
│   ├── scripts/deploy.js       # Script deploy & tự động xuất ABI sang /shared
│   ├── test/Riftbound.test.js  # 9 bài test tự động bao phủ 100% chức năng
│   └── hardhat.config.js       # Cấu hình compiler Cancun & Localhost
│
├── backend/                    # RESTful API Gateway (Express.js, Node.js)
│   ├── src/
│   │   ├── data/               # Cơ sở dữ liệu thẻ bài Riftbound & Runtime Store
│   │   ├── routes/             # RESTful Routes (cards, marketplace, packs, users, system)
│   │   └── server.js           # Express App Server (Cổng 5000)
│   └── package.json
│
├── frontend/                   # Web3 dApp (React, Vite, Tailwind CSS, Ethers.js)
│   ├── src/
│   │   ├── components/         # Navbar, CardItem (Foil effect), BuyModal, SellModal
│   │   ├── context/            # Web3Context (MetaMask, Faucet, Marketplace, Packs)
│   │   ├── pages/              # Marketplace, Packs (Gacha), Inventory, Codex
│   │   └── App.jsx
│   └── package.json
│
├── remix/                      # Hướng dẫn & cấu hình triển khai qua Remix IDE
│   └── README_REMIX.md
│
└── shared/                     # ABIs và địa chỉ hợp đồng đã deploy được chia sẻ tự động
```

---

## 🚀 Hướng Dẫn Khởi Chạy Dự Án

### 1. Khởi Chạy Backend API Server
Mở terminal và chạy lệnh:
```bash
cd backend
npm start
```
- Server chạy tại: `http://localhost:5000`
- Kiểm tra Healthcheck: `http://localhost:5000/api/v1/system/health`
- Danh mục thẻ: `http://localhost:5000/api/v1/cards`

### 2. Khởi Chạy Giao Diện Web Frontend (dApp)
Mở một cửa sổ terminal khác:
```bash
cd frontend
npm run dev
```
- Truy cập trình duyệt tại: **`http://localhost:5174`**

### 3. Kiểm Thử Smart Contracts
Chạy toàn bộ 9 bài test tự động:
```bash
cd contracts
npx hardhat test
```

---

## 📑 Hướng Dẫn Triển Khai Lên Remix IDE (`https://app.remix.live/`)

1. Mở trình duyệt truy cập: **https://app.remix.live/**
2. Tạo thư mục `contracts/` trên Remix và copy 4 file mã nguồn trong `contracts/contracts/`:
   - `RiftToken.sol`
   - `RiftCardNFT.sol`
   - `RiftBoosterPack.sol`
   - `RiftMarketplace.sol`
3. Chọn Compiler `0.8.24` hoặc `0.8.26` (EVM target: `cancun`), bấm **Compile**.
4. Chuyển sang tab `Deploy & Run Transactions`, chọn môi trường **Injected Provider - MetaMask**.
5. Deploy theo thứ tự:
   - `RiftToken` -> `RiftCardNFT` -> `RiftBoosterPack` -> Gọi `setAuthorizedMinter` -> `RiftMarketplace`.
   *(Xem chi tiết từng tham số truyền vào tại `remix/README_REMIX.md`)*.
