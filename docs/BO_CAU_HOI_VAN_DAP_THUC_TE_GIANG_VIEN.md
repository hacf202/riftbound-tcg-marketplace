# BỘ CÂU HỎI VẤN ĐÁP THỰC TẾ & BẢN ĐỒ PHẢN XẠ PHÒNG THI
## DỰ ÁN: RIFTBOUND TCG WEB3 MARKETPLACE
> **Mục tiêu tài liệu**: Trang bị câu trả lời trực diện, đúng trọng tâm cho những câu hỏi mà Giảng viên thực sự hỏi khi chấm đồ án (soi code trực tiếp, bắt demo 2 ví, hỏi xoáy vào các tình huống lỗi và xung đột dữ liệu).

---

## PHẦN 1: CÁC CÂU HỎI SOI CODE TRỰC TIẾP (CODE WALKTHROUGH)

### Câu 1: "Chỉ cho thầy đoạn code nào thực hiện việc mua bán thẻ, chia tiền và chuyển NFT?"
* **Vị trí file Smart Contract**: `contracts/RiftMarketplace.sol` -> Hàm `buyItem(uint256 listingId, uint256 quantity)`
* **Cách chỉ code và giải thích**:
  1. **Kiểm tra kho**: `require(item.quantity >= quantity, "Not enough quantity");` đảm bảo người bán còn đủ số lượng thẻ trên sàn.
  2. **Chống tự mua bài**: `require(item.seller != msg.sender, "Cannot buy own item");` ngăn chặn wash trading.
  3. **Tính toán chia tiền 3 dòng**:
     * Phí sàn: `uint256 protocolFee = (totalPrice * 200) / 10000;` (2.0%)
     * Phí bản quyền: `uint256 royaltyFee = (totalPrice * 250) / 10000;` (2.5%)
     * Người bán nhận: `uint256 sellerPayout = totalPrice - protocolFee - royaltyFee;` (95.5%)
  4. **Chuyển tiền $RIFT**: Hợp đồng gọi `riftToken.transferFrom(msg.sender, ...)` để tự động cắt tiền chuyển về ví người bán, ví quỹ sàn (`treasury`) và ví tác giả (`creator`).
  5. **Chuyển quyền sở hữu NFT**: Gọi `nftContract.safeTransferFrom(address(this), msg.sender, item.cardId, quantity, "");` chuyển thẳng thẻ từ kho ký gửi của sàn sang ví người mua.
* **Vị trí file Frontend**: `frontend/src/context/Web3Context.jsx` -> Hàm `buyCard(...)` xử lý giao diện, gọi ví MetaMask và đồng bộ cơ sở dữ liệu.

---

### Câu 2: "Hàm bốc bài ngẫu nhiên Gacha nằm ở đâu? Làm sao chứng minh không bịp người chơi?"
* **Vị trí file**: `contracts/RiftBoosterPack.sol` -> Hàm `openPack(uint256 packId)`
* **Cách trả lời**:
  * **Thuật toán sinh số ngẫu nhiên on-chain**:
    ```solidity
    uint256 seed = uint256(keccak256(abi.encodePacked(
        block.timestamp,
        block.prevrandao,
        msg.sender,
        nonce++
    )));
    ```
  * **Chứng minh tính minh bạch**:
    * Số ngẫu nhiên được nhào nặn từ thời gian đóng block, hạt ngẫu nhiên của toàn mạng (`prevrandao`) và địa chỉ ví người chơi.
    * Tỷ lệ rớt bài được cố định sẵn trong hợp đồng: **70% Thường (Common), 25% Hiếm (Rare), 5% Thần Thoại (Mythic)**.
    * Toàn bộ mã nguồn chạy công khai trên Blockchain, nhà phát hành không thể bí mật can thiệp giảm tỷ lệ hay tráo bài cho người quen.

---

### Câu 3: "Đoạn code nào chặn người bán tự mua bài của chính mình (chống gian lận Wash Trading)?"
* **Cách trả lời**: Hệ thống chặn 2 lớp (Cả trên Smart Contract và Frontend):
  1. **Lớp bảo mật tuyệt đối trên Smart Contract** (`contracts/RiftMarketplace.sol`):
     ```solidity
     require(item.seller != msg.sender, "Cannot buy own item");
     ```
     Nếu người bán dùng chính ví đang niêm yết để mua, giao dịch bị mạng blockchain hủy bỏ ngay lập tức (`revert`).
  2. **Lớp chặn trải nghiệm trên Frontend** (`frontend/src/components/BuyModal.jsx`):
     * Nếu phát hiện ví hiện tại trùng với người bán, nút Mua bị ẩn và thay bằng thông báo: *"Bạn là người bán lá bài này, hãy bấm Hủy Niêm Yết để nhận lại thẻ bài"*.

---

## PHẦN 2: CÁC CÂU HỎI BẪY VỀ KIẾN TRÚC & XUNG ĐỘT DỮ LIỆU

### Câu 4: "Website có dùng SQLite / LocalStorage. Đã có Database rồi thì gắn Blockchain vào làm gì cho tốn tiền gas?"
* **Câu trả lời trọng tâm**:
  * **Blockchain là Sổ cái chân lý (Single Source of Truth)**: Lưu trữ tài sản bất biến, quyền sở hữu của người dùng, số dư tiền tệ và lịch sử giao dịch. Không ai có quyền sửa xóa hay làm giả số dư.
  * **Database / LocalStorage chỉ là Bộ nhớ đệm (Cache Indexer)**: Giống như các dịch vụ The Graph / Subgraph ngoài đời. Dùng để tìm kiếm full-text, lọc theo độ hiếm, lọc hệ phái và hiển thị 352 lá bài siêu tốc.
  * **Nếu máy chủ Database sập hoặc bị hack**: Tài sản người dùng không mất 1 xu. Hệ thống chỉ cần quét lại lịch sử sự kiện (`Events`) trên Blockchain là tái tạo lại toàn bộ cơ sở dữ liệu trong vài giây.

---

### Câu 5: "Nếu hai người cùng bấm Mua một lá bài trong cùng 1 giây thì hệ thống xử lý ra sao?"
* **Câu trả lời trọng tâm**:
  * Blockchain xử lý giao dịch theo thứ tự tuần tự trong khối (Block):
    * Giao dịch nào đến trước (hoặc trả phí gas cao hơn) sẽ được xử lý trước.
    * **Người thứ nhất**: Mua thành công, thẻ bài chuyển về ví người này, số lượng trên sàn giảm về 0.
    * **Người thứ hai**: Khi Smart Contract chạy lệnh của người thứ hai, dòng kiểm tra `require(item.quantity >= quantity)` thấy số lượng bằng 0 sẽ lập tức hoàn tác (`revert`).
    * **Kết quả**: Người thứ hai không bị trừ tiền $RIFT, không bị mất thẻ, đảm bảo an toàn tuyệt đối.

---

### Câu 6: "Nếu người bán bấm Hủy bán (Cancel) đúng lúc người mua bấm Mua thì cái gì xảy ra trước?"
* **Câu trả lời trọng tâm**:
  * Tùy thuộc vào giao dịch nào được đóng vào khối block trước:
    * **Nếu lệnh Hủy vào trước**: Thẻ bài đã được rút về túi đồ người bán. Giao dịch Mua đến sau sẽ bị `revert` vì thẻ không còn trên sàn (Người mua không mất tiền).
    * **Nếu lệnh Mua vào trước**: Thẻ bài đã bán thành công và tiền đã chuyển cho người bán. Giao dịch Hủy đến sau sẽ bị `revert` vì không còn bài để hủy (Người bán nhận tiền bán, không bị mất mát).

---

### Câu 7: "Ví người dùng không có đồng ETH hoặc TCRO để trả gas thì có giao dịch được không?"
* **Câu trả lời trọng tâm**:
  * **Về nguyên tắc On-Chain**: Bắt buộc phải có đồng coin gốc (ETH/TCRO) làm phí gas cho các Validator xác nhận giao dịch. Nếu số dư gas bằng 0, ví MetaMask sẽ báo lỗi `Insufficient funds for gas`.
  * **Giải pháp trong đồ án**:
    1. Cung cấp cổng Faucet 1-click nhận ngay 1,000 $RIFT vào ví để trải nghiệm không cần tốn phí.
    2. Cung cấp link vòi nước nhận coin testnet miễn phí (Cronos Faucet / Sepolia Faucet) trực tiếp trên giao diện để người dùng lấy gas thử nghiệm.

---

## PHẦN 3: KỊCH BẢN THỰC HÀNH DEMO ĂN TRỌN ĐIỂM (LIVE DEMO)

### Bước 1: Chứng minh chất lượng code bằng bài Test tự động
* Mở terminal tại thư mục dự án và chạy lệnh:
  ```bash
  npm test
  ```
* **Chỉ cho Giảng viên thấy**: Toàn bộ **9 bài kiểm thử xanh lá cây PASS 100%** trong chưa đầy 1 giây:
  1. `RiftToken Deployment & Initial Supply` (Khởi tạo tiền tệ)
  2. `RiftToken Faucet with Cooldown` (Cấp phát và chống spam)
  3. `RiftCardNFT Minting` (Đúc thẻ bài chuẩn ERC-1155)
  4. `Marketplace Listing` (Ký gửi Escrow)
  5. `Marketplace Buy & 3-way Split` (Mua thẻ và chia tiền 95.5% - 2% - 2.5%)
  6. `Marketplace Anti-Wash Trading` (Chống tự mua bài của chính mình)
  7. `Marketplace Cancel Listing` (Hủy niêm yết an toàn)
  8. `Booster Pack Gacha RNG` (Bốc bài ngẫu nhiên minh bạch)
  9. `Reentrancy Guard Protection` (Chống hack tái nhập)

---

### Bước 2: Kịch bản Demo 2 Ví mua bán trực tiếp trên máy
1. **Chuẩn bị**:
   * Màn hình chính: Trình duyệt thường (Tài khoản A - `0x0730...`).
   * Màn hình phụ: Tab ẩn danh hoặc trình duyệt khác (Tài khoản B - `0x9965...`).
2. **Thao tác**:
   * **Tài khoản A**: Mở Túi đồ (Inventory), chọn 1 lá bài bấm "Niêm Yết Bán" với giá 100 $RIFT.
   * **Kiểm tra**: Thẻ bài rời khỏi túi đồ của A và xuất hiện ngay trên Marketplace.
   * **Tài khoản B**: Mở Marketplace, tìm thấy lá bài A vừa đăng bán và bấm "Xác Nhận Mua Thẻ".
   * **Kết quả**:
     * Thẻ bài lập tức xuất hiện trong Túi đồ của B.
     * Số dư tài khoản B bị trừ đúng 100 $RIFT.
     * Mở tài khoản A: Thấy số dư được cộng thêm 95.5 $RIFT.
     * Mở trang Lịch sử giao dịch (Activity Log): Chỉ cho Giảng viên dòng ghi nhận phân bổ 3 dòng tiền: Người bán nhận 95.5%, Quỹ sàn nhận 2.0%, Tác giả nhận 2.5%.

---

## PHẦN 4: PHÂN CHIA VAI TRÒ & ĐÓNG GÓP THÀNH VIÊN TRONG NHÓM

| Thành viên | Trách nhiệm chính trong đồ án | Các module phụ trách cụ thể |
| :--- | :--- | :--- |
| **Thành viên 1** (toancntt1122004 / LeHoangNam216) | **Smart Contracts & Kiến Trúc Web3 Nền Tảng** | - Soạn thảo 4 hợp đồng: `RiftToken`, `RiftCardNFT`, `RiftMarketplace`, `RiftBoosterPack`<br>- Viết trọn bộ 9 kịch bản kiểm thử tự động Mocha/Chai (Pass 100%)<br>- Thiết lập bảo mật ReentrancyGuard, quy chuẩn ERC-1155 & ERC-2981 |
| **Thành viên 2** (hacf202 / tinhtramnam202) | **Frontend dApp, Tích hợp Mạng & Báo Cáo** | - Phát triển giao diện React/Vite, tích hợp ethers.js v6 kết nối MetaMask<br>- Tích hợp đa mạng (Hardhat Localhost, Cronos Testnet, Ethereum Sepolia)<br>- Xây dựng cổng đổi tiền, bộ lọc 352 thẻ bài Codex và deploy Vercel Production<br>- Soạn thảo toàn bộ hồ sơ báo cáo giữa kỳ Word và Markdown |
