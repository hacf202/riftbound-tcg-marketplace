# 🎴 HƯỚNG DẪN KHỞI ĐỘNG VÀ SỬ DỤNG DỰ ÁN RIFTBOUND TCG DAPP

Tài liệu này cung cấp hướng dẫn từng bước từ cài đặt môi trường, khởi chạy hệ thống (Localhost / Smart Contracts / Backend / Frontend) đến cách trải nghiệm toàn bộ các tính năng Web3 trong **Riftbound TCG Marketplace**.

---

## 📋 MỤC LỤC
1. [Yêu Cầu Môi Trường](#1-yêu-cầu-môi-trường)
2. [Hướng Dẫn Khởi Động Nhanh (3 Bước Đơn Giản)](#2-hướng-dẫn-khởi-động-nhanh-3-bước-đơn-giản)
3. [Cấu Hình Ví MetaMask (Tùy Chọn)](#3-cấu-hình-ví-metamask-tùy-chọn)
4. [Hướng Dẫn Sử Dụng Các Tính Năng dApp](#4-hướng-dẫn-sử-dụng-các-tính-năng-dapp)
5. [Tích Hợp Remix IDE & Kiểm Tra Smart Contracts](#5-tích-hợp-remix-ide--kiểm-tra-smart-contracts)
6. [Cấu Trúc Thư Mục & Vai Trò Các Thành Phần](#6-cấu-trúc-thư-mục--vai-trò-các-thành-phần)
7. [Xử Lý Sự Cố Thường Gặp (Troubleshooting)](#7-xử-lý-sự-cố-thường-gặp-troubleshooting)

---

## 1. Yêu Cầu Môi Trường
Trước khi khởi chạy, máy tính của bạn cần có:
- **Node.js**: Phiên bản `v18.x`, `v20.x` hoặc mới hơn. ([Tải Node.js tại đây](https://nodejs.org/))
- **Git**: Đã cài đặt trên máy.
- **Trình duyệt Web**: Google Chrome, Brave, hoặc Microsoft Edge.
- **Ví Web3**: Tiện ích mở rộng **MetaMask** ([Tải MetaMask tại đây](https://metamask.io/download/)). Hệ thống sử dụng chuẩn xác thực Web3 nghiêm ngặt bằng chữ ký số qua MetaMask.

> 💡 **Xem thêm:** Để tìm hiểu sâu về kiến trúc máy ảo EVM, ERC-1155, dòng tiền bản quyền và cơ chế chống lạm phát token $RIFT, vui lòng đọc: **[Tài Liệu Chuyên Sâu Công Nghệ Blockchain & Kinh Tế Học (TAI_LIEU_BLOCKCHAIN_VA_KINH_TE.md)](./TAI_LIEU_BLOCKCHAIN_VA_KINH_TE.md)**.

---

## 2. Hướng Dẫn Khởi Động Nhanh (3 Bước Đơn Giản)

Để dApp hoạt động trọn vẹn (gồm Blockchain Node, Backend SQLite API và Giao diện Frontend), bạn mở **3 cửa sổ Terminal**:

```
[Terminal 1: Blockchain Node]  ---> Chạy Hardhat Node & Deploy Smart Contracts (Cổng 8545)
[Terminal 2: Backend Server]   ---> Chạy Express API & SQLite Database (Cổng 5000)
[Terminal 3: Frontend dApp]    ---> Chạy Giao diện React + Vite (Cổng 5174)
```

### 🔹 Bước 1: Khởi Chạy Blockchain Node & Deploy Hợp Đồng (Terminal 1)
```bash
# 1. Di chuyển vào thư mục contracts
cd d:\BlockChain\contracts

# 2. Cài đặt thư viện (nếu mới clone dự án lần đầu)
npm install

# 3. Khởi động mạng Blockchain cục bộ (Hardhat Node)
npx hardhat node
```
> *Giữ nguyên Terminal 1 đang chạy.* Mở tiếp một tab Terminal mới tại `d:\BlockChain\contracts` và chạy lệnh deploy hợp đồng:
```bash
# Triển khai 4 Smart Contracts và tự động lưu cấu hình
npm run deploy
```
*(Lệnh này sẽ deploy $RIFT Token, Thẻ NFT, Gói bài Gacha, Sàn giao dịch và tự động cập nhật địa chỉ mới vào Frontend & Backend).*

---

### 🔹 Bước 2: Khởi Chạy Backend API Server (Terminal 2)
```bash
# 1. Di chuyển vào thư mục backend
cd d:\BlockChain\backend

# 2. Cài đặt thư viện (nếu lần đầu)
npm install

# 3. Khởi động máy chủ API
node src/server.js
```
Khi thấy thông báo:
```
🚀 Riftbound RESTful API Server đang chạy tại: http://localhost:5000
✅ Đã kết nối SQLite Database thành công tại: riftbound.db
```
Nghĩa là Backend và Cơ sở dữ liệu SQLite đã sẵn sàng phục vụ.

---

### 🔹 Bước 3: Khởi Chạy Frontend dApp (Terminal 3)
```bash
# 1. Di chuyển vào thư mục frontend
cd d:\BlockChain\frontend

# 2. Cài đặt thư viện (nếu lần đầu)
npm install

# 3. Khởi chạy giao diện người dùng
npm run dev
# Hoặc: npx vite --port 5174
```
Truy cập ngay vào đường link hiển thị trên terminal:
👉 **`http://localhost:5174`**

---

## 3. Cấu Hình Ví MetaMask (Bắt Buộc Chuẩn Web3)

Hệ thống vận hành theo chuẩn Web3 thực thụ, yêu cầu xác thực bằng ví **MetaMask**:

### Thêm Mạng Hardhat Localhost Vào MetaMask:
- **Tên mạng (Network Name)**: `Hardhat Localhost`
- **RPC URL**: `http://127.0.0.1:8545`
- **Mã chuỗi (Chain ID)**: `31337`
- **Ký hiệu tiền tệ (Currency Symbol)**: `ETH`

### Nhập Tài Khoản Thử Nghiệm Có Sẵn Tiền:
Bạn có thể import Private Key của tài khoản Hardhat vào MetaMask để nhận ngay **10,000 ETH** (trả gas & quy đổi $RIFT):
- **Private Key**: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- **Địa chỉ ví**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`

---

## 4. Hướng Dẫn Sử Dụng Các Tính Năng dApp

Sau khi mở trình duyệt tại `http://localhost:5174`:

### ⚡ 1. Quy Đổi Tiền Tệ Bằng Đồng ETH (Web3 Exchange Modal)
- Ở góc trên bên phải thanh Navbar (hoặc tại trang Gói Thẻ & Chi Tiết Thẻ), nhấp vào nút **`⚡ Đổi ETH Sang $RIFT`**.
- Chọn một trong các gói nhanh (`0.05 ETH ➔ 500 $RIFT`, `0.1 ETH ➔ 1,000 $RIFT`, `0.5 ETH ➔ 5,000 $RIFT`...) hoặc nhập số ETH tùy ý.
- Tỷ giá quy đổi định chuẩn: **1 ETH = 10,000 $RIFT** (tương đương 1 $RIFT = 0.0001 ETH).
- Nhấp **"Xác Nhận Đổi ETH ➔ $RIFT"**: Ví MetaMask sẽ mở cửa sổ yêu cầu ký duyệt giao dịch chuyển ETH on-chain, sau đó số dư token $RIFT được cộng trực tiếp vào ví của bạn.

### 🛒 2. Chợ Giao Dịch Thẻ Bài (Marketplace)
- Chuyển sang tab **"Sàn Giao Dịch"**.
- Xem danh sách các lá bài đang được niêm yết bởi người chơi khác.
- Lọc theo **Hệ Tộc (Fury, Calm, Mind, Body, Chaos...)**, **Độ Hiếm (Common, Rare, Epic, Legendary, Mythic)** hoặc theo **Khoảng Giá**.
- Bấm **"MUA NGAY"** ➔ Chọn số lượng ➔ Bấm **"Xác Nhận Thanh Toán"**.
- Số dư $RIFT sẽ được trừ tự động, thẻ bài ngay lập tức được chuyển vào **Túi Đồ** của bạn, và giao dịch được ghi vĩnh viễn vào lịch sử SQLite Database.

### 📦 3. Đấu Trường Mở Gói Thẻ Bài (Booster Pack Arena)
- Chuyển sang tab **"Gói Thẻ Bài"** (`#packs`).
- Khám phá 12 gói thẻ bài ma thuật chuẩn 3D Foil (Tập Sự, Tiếng Vọng Tinh Tú, Hỏa Ngục, Bá Chủ Hư Không, Thần Khí Tối Thượng...).
- Bấm **"Xé Gói Ngay"**:
  1. **Hoạt cảnh Tích tụ Ma thuật**: Gói thẻ bài bay lên giữa không gian vũ trụ, rung lắc cộng hưởng âm thanh ma thuật.
  2. **Tia Laser Xé Bao Bì**: Vết cắt laser xé mép dập kim loại bung tỏa ánh hào quang rực rỡ.
  3. **Đấu Trường Lật Thẻ**: Các lá bài bay ra úp mặt trên bàn nhung. Rê chuột lên thẻ để cảm nhận hào quang độ hiếm ẩn giấu.
  4. Bấm vào từng lá bài để lật mở hoặc bấm **"Lật Mở Tất Cả"** để chiêm ngưỡng toàn bộ bộ bài vừa nhận được.
- Toàn bộ thẻ bài mở trúng sẽ tự động lưu vào Bộ sưu tập cá nhân.

### 🎒 4. Quản Lý Túi Đồ & Đăng Bán Thẻ (Inventory)
- Chuyển sang tab **"Túi Đồ"** (`#inventory`).
- Xem toàn bộ danh mục thẻ bài bạn đang sở hữu. Các thẻ bài mới mua hoặc vừa mở gói sẽ được ghim lên đầu và gắn huy hiệu **`✨ MỚI NHẬN`**.
- **Đăng bán thẻ lên sàn**:
  - Nhấp vào nút **"Bán Thẻ"** trên lá bài bạn muốn bán.
  - Nhập số lượng và đặt giá bán theo $RIFT.
  - Bấm **"Xác Nhận Niêm Yết"**. Thẻ bài sẽ lập tức xuất hiện công khai trên sàn Marketplace để người khác mua.

### 📖 5. Tra Cứu Thẻ Bài & Xem Chi Tiết (Codex & Card Detail)
- Chuyển sang tab **"Kho Thẻ Bài (Codex)"**:
  - Tra cứu toàn bộ 200 lá bài chính thức chuẩn Web3 hoặc 352 lá bài thuộc bộ mở rộng Origins Riot Games.
  - Hỗ trợ cú pháp tìm kiếm Lucene nâng cao: `name:void`, `domain:Fury`, `type:Battlefield`...
- Bấm vào bất kỳ lá bài nào để chuyển sang trang **Chi Tiết Thẻ Bài** (xem artwork độ phân giải cao chuẩn tỉ lệ vật lý 744x1039, chỉ số ATK, DEF, hiệu ứng chiến trường và biểu đồ lịch sử giá).

### 📜 6. Theo Dõi Lịch Sử Giao Dịch (Activity)
- Chuyển sang tab **"Lịch Sử Hoạt Động"** (`#activity`).
- Xem toàn bộ dòng tiền, lịch sử mua bán, bóc gói và nhận faucet được đồng bộ theo thời gian thực từ SQLite Database.

### 📑 7. Xem Báo Cáo Kỹ Thuật (Dành Cho Hội Đồng Chấm Bài)
- Trên thanh Navbar, bấm nút **"Báo Cáo Kỹ Thuật"**.
- Xem nhanh:
  - Địa chỉ 4 Smart Contracts đang hoạt động trên Blockchain.
  - Mã ABI JSON chính thức.
  - Danh mục toàn bộ các Endpoint RESTful API Backend.

---

## 5. Tích Hợp Remix IDE & Kiểm Tra Smart Contracts

Dự án tương thích 100% với **Remix IDE**:
`https://app.remix.live/#lang=en&optimize&runs=200&evmVersion&version=soljson-v0.8.34+commit.80d5c536.js`

### Cách Kết Nối Trực Tiếp Qua `remixd`:
1. Mở Terminal tại thư mục `contracts`:
   ```bash
   cd d:\BlockChain\contracts
   npm run remixd
   ```
2. Mở trình duyệt vào link Remix phía trên.
3. Tại tab **File Explorer** của Remix, nhấp vào menu **Workspaces** ➔ Chọn **`- connect to localhost -`** ➔ Bấm **Connect**.
4. Toàn bộ thư mục hợp đồng sẽ xuất hiện trên giao diện Remix.

### Thư Mục Hợp Đồng Flatten Sẵn:
Trong thư mục [`contracts/flattened/`](file:///d:/BlockChain/contracts/flattened/), đã gộp sẵn toàn bộ thư viện OpenZeppelin:
- `RiftToken_flat.sol`
- `RiftCardNFT_flat.sol`
- `RiftBoosterPack_flat.sol`
- `RiftMarketplace_flat.sol`

---

## 6. Cấu Trúc Thư Mục & Vai Trò Các Thành Phần

```
d:\BlockChain\
├── contracts/                  # Smart Contracts (Hardhat, Solidity 0.8.24)
│   ├── contracts/              # Mã nguồn gốc 4 hợp đồng (RiftToken, RiftCardNFT, RiftBoosterPack, RiftMarketplace)
│   ├── flattened/              # 4 file hợp đồng gộp sẵn cho Remix IDE
│   ├── scripts/                # Scripts deploy (deploy.js, deploy_remix.js, save_deployed.js, flatten_all.js)
│   └── hardhat.config.js       # Cấu hình compiler, optimizer runs: 200 và networks
│
├── backend/                    # RESTful API Server (Node.js, Express, SQLite)
│   ├── data/                   # File cơ sở dữ liệu riftbound.db và dữ liệu gốc Scrydex
│   ├── src/                    # Routes (cards, marketplace, packs, users, system), Database schema
│   └── package.json
│
├── frontend/                   # Web3 dApp (React 18, Vite, Tailwind CSS, Ethers.js)
│   ├── src/
│   │   ├── components/         # Navbar, CardItem, BuyModal, SellModal
│   │   ├── context/            # Web3Context (Đồng bộ số dư, ví, MetaMask, giao dịch)
│   │   ├── pages/              # Marketplace, Packs, Inventory, Codex, Activity, CardDetail
│   │   └── utils/              # soundEffects.js (Bộ tổng hợp âm thanh Web Audio API Native)
│   └── package.json
│
├── shared/                     # Điểm chia sẻ tự động giữa Contracts, Backend và Frontend
│   ├── contracts-config.json   # Địa chỉ các hợp đồng đã deploy
│   └── contracts-abi.json      # Toàn bộ mã ABI của 4 hợp đồng
│
├── HUONG_DAN_SU_DUNG.md        # File tài liệu hướng dẫn này
└── README.md                   # Tổng quan đồ án tốt nghiệp
```

---

## 7. Xử Lý Sự Cố Thường Gặp (Troubleshooting)

### ❓ 1. Xung đột cổng (Port already in use 5173 / 5174 / 5000 / 8545)
- **Khắc phục**: 
  - Đóng các terminal hoặc tiến trình node cũ đang chạy ngầm bằng Task Manager hoặc PowerShell:
    ```powershell
    Get-Process node | Stop-Process -Force
    ```
  - Sau đó khởi động lại theo 3 bước ở Mục 2.

### ❓ 2. Lỗi giao dịch MetaMask: "Nonce too high" hoặc giao dịch bị treo
- **Khắc phục**: Khi bạn khởi động lại mạng Hardhat (`npx hardhat node`), số thứ tự giao dịch (nonce) sẽ được reset về 0.
  - Trên MetaMask: Vào **Cài đặt (Settings)** ➔ **Nâng cao (Advanced)** ➔ Bấm **"Xóa dữ liệu hoạt động tab" (Clear activity tab data)**.
  - Sau đó thực hiện lại giao dịch bình thường.

### ❓ 3. Font chữ hoặc hình ảnh không hiển thị đúng
- **Khắc phục**: Dự án đã tích hợp sẵn bộ font Google Fonts **`Playfair Display`** kết hợp **`Be Vietnam Pro`** hỗ trợ 100% tiếng Việt bản địa, cùng cơ chế `onError` fallback ảnh từ CDN Riot Games chính thức. Nếu gặp vấn đề về hiển thị, bạn chỉ cần nhấn tổ hợp phím **`Ctrl + Shift + R`** (hoặc `Cmd + Shift + R`) để tải lại toàn bộ tài nguyên trình duyệt.

---

*Chúc bạn có trải nghiệm tuyệt vời và bảo vệ thành công đồ án với Riftbound TCG dApp!*
