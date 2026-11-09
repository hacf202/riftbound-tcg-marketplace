# Hướng Dẫn Sử Dụng Remix IDE (https://app.remix.live/)

Tài liệu này hướng dẫn bạn hoặc Giảng viên cách biên dịch và triển khai các hợp đồng thông minh của dự án Riftbound TCG trực tiếp trên trình duyệt bằng [Remix Ethereum IDE](https://app.remix.live/).

---

## 1. Thứ tự Triển khai (Deployment Order)
Bắt buộc triển khai theo thứ tự sau để cung cấp địa chỉ hợp đồng phụ thuộc:
1. **`RiftToken.sol`**: Tiền tệ $RIFT (Truyền tham số `initialOwner` là địa chỉ ví của bạn).
2. **`RiftCardNFT.sol`**: Thẻ bài NFT:
   - `initialOwner`: Địa chỉ ví của bạn.
   - `baseURI`: `http://localhost:5000/api/v1/cards/metadata/` (hoặc link IPFS).
   - `royaltyReceiver`: Địa chỉ ví nhận tiền bản quyền (ví của bạn).
   - `royaltyFeeNumerator`: `250` (Tương đương 2.5% phí bản quyền).
3. **`RiftBoosterPack.sol`**: Hợp đồng mở gói bài:
   - `initialOwner`: Ví của bạn.
   - `_riftToken`: Địa chỉ `RiftToken` vừa deploy ở Bước 1.
   - `_cardNFT`: Địa chỉ `RiftCardNFT` vừa deploy ở Bước 2.
   - `_treasury`: Ví nhận tiền bán gói bài (ví của bạn).
4. **Cấp quyền Minter cho BoosterPack**:
   - Mở contract `RiftCardNFT` đã deploy trên Remix.
   - Gọi hàm `setAuthorizedMinter`:
     - `minter`: Địa chỉ contract `RiftBoosterPack`.
     - `status`: `true`.
5. **`RiftMarketplace.sol`**: Sàn giao dịch:
   - `initialOwner`: Ví của bạn.
   - `_paymentToken`: Địa chỉ `RiftToken`.
   - `_treasury`: Địa chỉ ví nhận phí sàn 2%.

---

## 2. Cách Thực Hiện Trên Giao Diện Remix IDE
1. Truy cập **https://app.remix.live/** trên trình duyệt Chrome/Edge (đã cài extension MetaMask).
2. Ở cột trái **File Explorer**, tạo thư mục `contracts/` và tạo 4 file:
   - `RiftToken.sol`
   - `RiftCardNFT.sol`
   - `RiftBoosterPack.sol`
   - `RiftMarketplace.sol`
3. Copy toàn bộ mã nguồn tương ứng trong thư mục `d:\BlockChain\contracts\contracts\` dán vào Remix.
4. Ở tab **Solidity Compiler**:
   - Chọn Compiler version: `0.8.24` hoặc `0.8.26`.
   - Chọn Advanced Configurations -> EVM Version: `cancun`.
   - Bấm **Compile**.
5. Ở tab **Deploy & Run Transactions**:
   - Environment: Chọn **Injected Provider - MetaMask** (Remix sẽ tự kết nối mạng Sepolia hoặc Base Sepolia trong ví bạn).
   - Lần lượt Deploy theo đúng thứ tự 1 -> 5 ở trên.
