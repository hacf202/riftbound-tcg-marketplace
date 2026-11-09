# 🌐 Hướng Dẫn Kết Nối Remix IDE & Deploy Lưu Smart Contracts

Tài liệu này hướng dẫn chi tiết cách kết nối mã nguồn Solidity với **Remix IDE** theo liên kết cấu hình của bạn:
`https://app.remix.live/#lang=en&optimize&runs=200&evmVersion&version=soljson-v0.8.34+commit.80d5c536.js`

---

## 🚀 CÁCH 1: Kết Nối Trực Tiếp Bằng Remixd (Khuyên Dùng - Đồng Bộ 2 Chiều)

Công cụ `remixd` cho phép Remix IDE trên web mở, đọc, chỉnh sửa và deploy trực tiếp mã nguồn trong máy của bạn mà không cần copy dán.

### Bước 1: Mở Terminal tại thư mục `contracts` và khởi chạy remixd
```bash
cd d:\BlockChain\contracts
npm run remixd
```
*(Hoặc: `npx @remix-project/remixd -s . --remix-ide https://app.remix.live`)*

### Bước 2: Kết nối trên trình duyệt Remix
1. Mở trình duyệt tại đường link Remix:
   👉 **`https://app.remix.live/#lang=en&optimize&runs=200&evmVersion&version=soljson-v0.8.34+commit.80d5c536.js`**
2. Tại cột bên trái (**File Explorer**), nhấp vào biểu tượng menu hoặc mục **Workspaces** -> Chọn **"Connect to localhost"**.
3. Bấm **"Connect"** ở hộp thoại xác nhận.
4. Toàn bộ thư mục `contracts/`, `flattened/`, `scripts/` trên máy tính sẽ hiển thị trực tiếp trong Remix.

---

## 📄 CÁCH 2: Dùng 4 File Đã Flatten Sẵn (Không Cần Cài Đặt, 100% Không Lỗi Import)

Nếu bạn muốn copy dán trực tiếp từng file vào Remix mà không lo thiếu thư viện `@openzeppelin`:
Hệ thống đã tự động gộp (flatten) sẵn 4 hợp đồng hoàn chỉnh trong thư mục **`contracts/flattened/`**:

| Hợp Đồng | File Flatten Sẵn | Mô Tả |
| :--- | :--- | :--- |
| **RiftToken** | `contracts/flattened/RiftToken_flat.sol` | Tiền tệ $RIFT (ERC-20, Faucet 1-Click) |
| **RiftCardNFT** | `contracts/flattened/RiftCardNFT_flat.sol` | Thẻ bài NFT (ERC-1155, Royalties ERC-2981) |
| **RiftBoosterPack** | `contracts/flattened/RiftBoosterPack_flat.sol` | Gói bài Gacha mở thưởng ngẫu nhiên |
| **RiftMarketplace** | `contracts/flattened/RiftMarketplace_flat.sol` | Sàn giao dịch P2P niêm yết và mua bán thẻ |

*(Để cập nhật lại các file này bất cứ lúc nào, chỉ cần chạy: `npm run flatten`)*

---

## 🛠️ CÁCH 3: Chạy Script Deploy & Tự Động Lưu Cấu Hình Vào Dự Án

### Phương Án A: Deploy Trực Tiếp Bằng Script Hardhat (Nhanh Nhất)
Từ thư mục `contracts`, bạn chỉ cần chạy 1 lệnh duy nhất:
```bash
cd d:\BlockChain\contracts
npm run deploy
```
*Script sẽ tự động:*
1. Deploy 4 hợp đồng theo thứ tự chuẩn.
2. Cấp quyền Minter cho `RiftBoosterPack`.
3. Đúc 50 lá bài khởi tạo cho Deployer và niêm yết mẫu lên sàn.
4. **TỰ ĐỘNG LƯU** địa chỉ contract và ABI vào:
   - `shared/contracts-config.json`
   - `shared/contracts-abi.json`
   - `frontend/src/config/`
   - `backend/src/config/`
*(Frontend & Backend sẽ nhận diện contract mới ngay lập tức mà không cần khởi động lại).*

---

### Phương Án B: Deploy Trên Giao Diện Remix IDE & Lưu Bằng Script

Nếu bạn deploy trên giao diện web Remix (qua MetaMask hoặc Remix VM):
Sau khi deploy xong 4 contract và có 4 địa chỉ ví, bạn chỉ cần mở terminal và chạy lệnh:

```bash
cd d:\BlockChain\contracts
node scripts/save_deployed.js --token 0x... --nft 0x... --pack 0x... --market 0x... --chainId 31337
```

**Ví dụ thực tế:**
```bash
node scripts/save_deployed.js \
  --token 0x5FbDB2315678afecb367f032d93F642f64180aa3 \
  --nft 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 \
  --pack 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 \
  --market 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9 \
  --chainId 31337
```

---

### Phương Án C: Chạy Script Deploy Ngay Trong Remix (`scripts/deploy_remix.js`)
Trong Remix File Explorer:
1. Chuột phải vào file **`scripts/deploy_remix.js`** -> Chọn **"Run"**.
2. Script sẽ tự động chạy qua tab Terminal của Remix, deploy 4 contract, set quyền Minter và in ra bảng JSON cùng dòng lệnh lưu contract để bạn paste vào terminal máy tính!
