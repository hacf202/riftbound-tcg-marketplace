# TÀI LIỆU 02: CÁC THÀNH PHẦN CẤU THÀNH VÀ CƠ CHẾ CỐT LÕI CỦA BLOCKCHAIN TRONG HỆ THỐNG RIFTBOUND TCG

> **Học phần:** Công Nghệ Blockchain & Ứng Dụng  
> **Chủ đề Báo cáo:** Kiến Trúc Kỹ Thuật dApp & Các Cơ Chế Cốt Lõi Trên Máy Ảo Ethereum (EVM)  
> **Dự án:** Riftbound TCG Marketplace  

---

## MỤC LỤC TÀI LIỆU
1. [Tổng Quan Kiến Trúc dApp 4 Tầng](#1-tổng-quan-kiến-trúc-dapp-4-tầng)
2. [Chi Tiết Các Thành Phần Cấu Thành Hệ Thống](#2-chi-tiết-các-thành-phần-cấu-thành-hệ-thống)
   - 2.1. Lớp Giao Diện Người Dùng (Frontend dApp Layer)
   - 2.2. Lớp Cổng Giao Tiếp Dữ Liệu & Bộ Đệm (Backend API & Indexer Layer)
   - 2.3. Lớp Hợp Đồng Thông Minh (Smart Contracts On-Chain Layer)
   - 2.4. Lớp Hạ Tầng Mạng EVM & Ví Tiền Điện Tử (Blockchain & Wallet Layer)
3. [Các Cơ Chế Cốt Lõi Của Blockchain Được Ứng Dụng](#3-các-cơ-chế-cốt-lõi-của-blockchain-được-ứng-dụng)
   - 3.1. Chuẩn Token Đa Mục Đích ERC-1155 & Tối Ưu Phí Gas
   - 3.2. Tiền Tệ Nội Bộ ERC-20 & Cơ Chế Khóa Thời Gian Smart Faucet
   - 3.3. Chuẩn Bản Quyền Tác Giả Tự Động ERC-2981 (On-Chain Royalty)
   - 3.4. Mô Hình Ký Gửi Phi Tập Trung (Trustless Escrow) & Chống Tấn Công Reentrancy
   - 3.5. Thuật Toán Ngẫu Nhiên Hóa On-Chain (On-Chain Pseudo-RNG & Prevrandao)
   - 3.6. Quyền Sở Hữu Kỹ Thuật Số Thực Thụ (True Digital Ownership) & Tính Bất Biến

---

## 1. Tổng Quan Kiến Trúc dApp 4 Tầng

Khác với các ứng dụng Web2 truyền thống chỉ bao gồm Client và Server CSDL tập trung, **Riftbound TCG Marketplace** được xây dựng theo kiến trúc **Hybrid Web3 dApp** hiện đại. Mô hình này kết hợp giữa sức mạnh lưu trữ phi tập trung, bất biến của Blockchain và tốc độ phản hồi nhanh nhạy của Web2.

```
+-----------------------------------------------------------------------+
| 1. FRONTEND dAPP LAYER (React 18 + Vite + Tailwind CSS + Ethers.js v6) |
|    - Quản lý trạng thái Web3 (Web3Context Provider)                   |
|    - Tương tác ví MetaMask (Injected Provider)                         |
|    - Visual Thẻ bài 3D, Âm thanh Audio FX, Tra cứu Debounce           |
+-----------------------------------------------------------------------+
                                    |                           |
                       (Tra cứu REST API)         (Ký giao dịch Web3)
                                    v                           v
+---------------------------------------+   +---------------------------+
| 2. BACKEND API & CACHE LAYER          |   | 4. BLOCKCHAIN EVM LAYER   |
|    - Node.js Express Gateway (/v1/)   |   |    - Hardhat Local (31337)|
|    - Chuẩn Metadata JSON OpenSea      |   |    - Sepolia / Cronos Test|
|    - SQLite Indexing & High-Speed     |   |    - EVM State & Storage  |
+---------------------------------------+   +---------------------------+
                                                                ^
                                                                |
                                             (Thực thi Logic & State)
                                                                |
+---------------------------------------------------------------+-------+
| 3. ON-CHAIN SMART CONTRACTS (Solidity ^0.8.24)                        |
|    - RiftToken.sol (ERC-20 + Smart Faucet)                            |
|    - RiftCardNFT.sol (ERC-1155 Multi-Token + ERC-2981 Royalty)        |
|    - RiftBoosterPack.sol (Gacha Pack Opening Engine)                  |
|    - RiftMarketplace.sol (Escrow P2P Trading + Anti-Reentrancy)       |
+-----------------------------------------------------------------------+
```

---

## 2. Chi Tiết Các Thành Phần Cấu Thành Hệ Thống

### 2.1. Lớp Giao Diện Người Dùng (Frontend dApp Layer)
Được phát triển trên nền tảng **React 18**, sử dụng công cụ đóng gói siêu tốc **Vite** và bộ khung giao diện tiện ích **Tailwind CSS**.

* **`Web3Context.jsx` (Trọng tâm quản lý trạng thái)**:
  * Đóng gói toàn bộ logic kết nối ví MetaMask (`window.ethereum`).
  * Tự động bắt sự kiện `accountsChanged` (khi người dùng chuyển ví) và `chainChanged` (khi đổi mạng) để cập nhật giao diện mà không gây vỡ ứng dụng.
  * Cung cấp các hàm tương tác Web3 trực tiếp: `claimFaucet()`, `openPack()`, `listCard()`, `buyCard()`, `cancelListing()`, `depositCryptoForRift()`.
  * Tích hợp cơ chế đồng bộ 2 chiều: Ưu tiên dữ liệu on-chain, sau đó đối soát với cache backend để đạt tốc độ hiển thị tức thì (Optimistic UI Update).

* **Các Component & Trang Chức Năng**:
  * **`Navbar.jsx`**: Thanh trạng thái hiển thị địa chỉ ví rút gọn (`0x1234...abcd`), số dư đồng thời cả ETH và $RIFT, nút bấm chuyển mạng 1-Click sang Hardhat (Chain `31337`) và nút nhận Faucet nhanh.
  * **`Marketplace.jsx`**: Giao diện sàn giao dịch cho phép duyệt danh mục thẻ bài đang niêm yết, tích hợp bộ lọc độ hiếm (Common, Rare, Epic, Legendary, Mythic), ô tìm kiếm có cơ chế debounce 350ms và modal thanh toán.
  * **`Packs.jsx`**: Khu vực thị trường sơ cấp bóc gói bài Gacha với 2 loại gói thẻ. Tích hợp hiệu ứng lật thẻ 3D hồi hộp và tia sáng viền hào quang theo màu phẩm chất thẻ.
  * **`Inventory.jsx`**: Kho lưu trữ thẻ bài thuộc quyền sở hữu của ví đang kết nối. Cho phép người dùng trực tiếp mở Modal đăng bán thẻ vào Escrow.
  * **`CardItem.jsx`**: Component render thẻ bài với hiệu ứng phủ bóng Holographic Foil ánh kim lấp lánh khi di chuột, hiển thị chi tiết các thuộc tính Game (Mana, Tấn công, Máu, Phe phái Faction).
  * **`CurrencyConverterModal.jsx`**: Công cụ quy đổi tỷ giá định chuẩn giữa ETH và $RIFT (1 ETH = 10,000 $RIFT).

### 2.2. Lớp Cổng Giao Tiếp Dữ Liệu & Bộ Đệm (Backend API & Indexer Layer)
Xây dựng trên nền tảng **Node.js** và **Express.js**, hoạt động tại cổng `5000`.

* **Nhiệm vụ cốt lõi**:
  1. **Cung cấp Metadata chuẩn OpenSea**: Endpoint `/api/v1/cards/metadata/:id.json` trả về cấu trúc chuẩn quốc tế:
     ```json
     {
       "name": "Ahri Chín Đuôi",
       "description": "Thẻ bài Thần Thoại thuộc phe Ionia trong vũ trụ Riftbound.",
       "image": "http://localhost:5000/assets/cards/ahri.png",
       "attributes": [
         { "trait_type": "Faction", "value": "Ionia" },
         { "trait_type": "Rarity", "value": "Mythic" },
         { "trait_type": "Mana Cost", "value": 7 },
         { "trait_type": "Attack", "value": 8 },
         { "trait_type": "Health", "value": 6 }
       ]
     }
     ```
  2. **Bộ đệm tốc độ cao (In-Memory & SQLite Cache)**: Lưu trữ trạng thái niêm yết của các lá bài, giúp giao diện người dùng tải danh sách trong vài phần nghìn giây (`< 15ms`) mà không phải thực hiện hàng trăm lệnh gọi `eth_call` liên tục lên node Blockchain gây nghẽn mạng.
  3. **RESTful Routes phân định rõ ràng**:
     * `/api/v1/cards`: Danh mục 200 thẻ bài, hỗ trợ phân trang, lọc theo hệ và sắp xếp.
     * `/api/v1/marketplace`: Dữ liệu các phiên niêm yết mua bán và thống kê thanh khoản.
     * `/api/v1/packs`: Cấu hình giá, số lượng lá và tỷ lệ mở gói.
     * `/api/v1/users`: Quản lý kho đồ cá nhân theo địa chỉ ví.
     * `/api/v1/system`: Cung cấp thông tin địa chỉ hợp đồng và ABI đã biên dịch.

### 2.3. Lớp Hợp Đồng Thông Minh (Smart Contracts On-Chain Layer)
Bao gồm 4 hợp đồng thông minh được viết bằng ngôn ngữ **Solidity `^0.8.24`**, kế thừa các thư viện chuẩn mực từ tổ chức bảo mật **OpenZeppelin**:

1. **`RiftToken.sol`**:
   * Chuẩn: ERC-20, ERC-20 Burnable, Ownable.
   * Quản lý đồng tiền tệ giao dịch `$RIFT` (Tổng cung khởi tạo: 1,000,000 $RIFT).
   * Tích hợp hàm `claimFaucet()` cấp phát 1,000 $RIFT với cơ chế khóa thời gian Cooldown 1 phút (`FAUCET_COOLDOWN = 1 minutes`).

2. **`RiftCardNFT.sol`**:
   * Chuẩn: ERC-1155 Multi-Token, ERC-1155 Supply, ERC-2981 Royalty Standard, Ownable.
   * Quản lý toàn bộ 200 mẫu thẻ bài và vật phẩm ảo trong game.
   * Quản lý danh sách các địa chỉ được cấp quyền đúc thẻ (`authorizedMinters`), cho phép hợp đồng mở gói bài có quyền gọi `mintBatch`.
   * Cài đặt mức phí bản quyền mặc định 2.5% (`royaltyFeeNumerator = 250 / 10000`).

3. **`RiftBoosterPack.sol`**:
   * Chuẩn: ReentrancyGuard, Ownable.
   * Đóng vai trò là cỗ máy bóc thẻ Gacha (Thị trường sơ cấp).
   * Thu tiền `$RIFT` của người chơi chuyển về quỹ kho bạc dự án (`treasury`).
   * Sử dụng thuật toán băm ngẫu nhiên `keccak256` kết hợp `block.prevrandao` để sinh ngẫu nhiên thẻ bài theo phân phối xác suất độ hiếm, sau đó gọi `mintBatch` trao thẻ cho người chơi.

4. **`RiftMarketplace.sol`**:
   * Chuẩn: ReentrancyGuard, Pausable, Ownable, ERC-1155 Holder.
   * Đóng vai trò là sàn giao dịch phi tập trung P2P (Thị trường thứ cấp).
   * Vận hành theo mô hình ký gửi Escrow: Người bán khóa NFT trong hợp đồng sàn; người mua thanh toán `$RIFT`.
   * Tự động trích xuất và phân chia 3 dòng tiền trong một giao dịch nguyên tử (Atomic Transaction):
     * 95.5% về Người Bán.
     * 2.0% Phí giao thức sàn (Protocol Fee) về Quỹ Kho Bạc.
     * 2.5% Phí bản quyền (Royalty Fee) về Ví Tác Giả/Studio Sáng Tạo.

### 2.4. Lớp Hạ Tầng Mạng EVM & Ví Tiền Điện Tử (Blockchain & Wallet Layer)
* **Máy ảo Ethereum (EVM)**: Môi trường thực thi phi tập trung thực hiện tính toán bytecode của các hợp đồng thông minh. Đảm bảo trạng thái toàn vẹn (State Integrity) và ngăn chặn việc tiêu lặp (Double Spending).
* **Mạng thử nghiệm (Local / Testnet)**:
  * Mạng phát triển cục bộ **Hardhat Node** (Chain ID: `31337`, RPC: `http://127.0.0.1:8545`).
  * Tương thích hoàn toàn khi triển khai lên các mạng công cộng như **Ethereum Sepolia**, **Base Sepolia** hoặc **Cronos Testnet**.
* **MetaMask (Injected Web3 Provider)**: Tiện ích mở rộng đóng vai trò quản lý khóa bí mật (Private Key) an toàn. Người dùng tự ký (Sign) và phê duyệt mọi biến động tài sản mà không cần tiết lộ Private Key cho trang web.

---

## 3. Các Cơ Chế Cốt Lõi Của Blockchain Được Ứng Dụng

### 3.1. Chuẩn Token Đa Mục Đích ERC-1155 & Tối Ưu Phí Gas

#### So sánh bài toán ERC-721 vs ERC-1155 trong Game Thẻ Bài:
* **Hạn chế nghiêm trọng của ERC-721**: ERC-721 sinh ra cho các vật phẩm độc bản (1-of-1) như tranh ảnh nghệ thuật. Trong game thẻ bài TCG, một lá bài phổ thông như *Binh Lính Tiên Phong* có thể phát hành 10,000 bản sao cho 10,000 người chơi. Nếu dùng ERC-721:
  * Mỗi lá bài phải sở hữu một địa chỉ lưu trữ trạng thái độc lập (`ownerOf[tokenId]`).
  * Khi người chơi bóc một gói bài trúng 5 lá, hợp đồng phải thực hiện 5 giao dịch `mint()` riêng biệt, tiêu tốn lượng gas khổng lồ và làm chậm mạng lưới.
* **Đột phá từ ERC-1155 (Multi-Token Standard)**:
  * ERC-1155 định nghĩa một bảng băm lồng nhau: `mapping(uint256 => mapping(address => uint256)) private _balances`. Điều này cho phép một Smart Contract duy nhất quản lý đồng thời cả triệu thẻ bài khác nhau.
  * Hỗ trợ thao tác hàng loạt (**Batch Operations**): Bằng cách sử dụng `_mintBatch` và `safeBatchTransferFrom`, hệ thống chuyển cùng lúc 5 lá bài trong **duy nhất 1 giao dịch**.
  * **Hiệu quả thực tế**: Giảm từ **70% đến 80% chi phí Gas** so với chuẩn ERC-721 cũ.

```solidity
// Trích xuất mã nguồn thực tế trong RiftCardNFT.sol:
function mintBatch(
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
) external onlyAuthorizedMinter {
    _mintBatch(to, ids, amounts, data);
}
```

---

### 3.2. Tiền Tệ Nội Bộ ERC-20 & Cơ Chế Khóa Thời Gian Smart Faucet

Đồng `$RIFT` đại diện cho tiền tệ thanh toán xuyên suốt nền kinh tế game. Để giải quyết bài toán trải nghiệm người dùng trong môi trường học thuật và demo sản phẩm, cơ chế **Smart Faucet** được tích hợp trực tiếp vào mã nguồn của hợp đồng:

* **Logic chống gian lận & bòn rút (Rate-limit Time-lock)**:
  * Mapping `mapping(address => uint256) public lastFaucetClaim` lưu lại dấu thời gian (`block.timestamp`) của lần nhận tiền gần nhất.
  * Khi người dùng kích hoạt `claimFaucet()`, hợp đồng bắt buộc kiểm tra điều kiện:
    $$\text{block.timestamp} \ge \text{lastFaucetClaim}[\text{msg.sender}] + 60\text{ giây}$$
  * Nếu người dùng cố tình spam liên tục, giao dịch bị máy ảo EVM Revert ngay lập tức, bảo toàn tính cân bằng tiền tệ.

---

### 3.3. Chuẩn Bản Quyền Tác Giả Tự Động ERC-2981 (On-Chain Royalty)

Trong thị trường nghệ thuật truyền thống, họa sĩ chỉ nhận được tiền công một lần duy nhất khi bán tranh lần đầu. Khi bức tranh được bán qua tay hàng chục lần trên thị trường thứ cấp với giá gấp hàng trăm lần, tác giả hoàn toàn không được hưởng bất kỳ phần trăm nào.

Dự án Riftbound áp dụng chuẩn **ERC-2981**:
* Hàm `royaltyInfo(uint256 tokenId, uint256 salePrice)` được chuẩn hóa quốc tế:
  * Khi bất kỳ sàn giao dịch nào khớp lệnh bán thẻ bài có giá `salePrice`, sàn sẽ gọi hàm này để nhận về địa chỉ ví của tác giả (`receiver`) và số tiền bản quyền phải trích trả (`royaltyAmount`).
* Trong `RiftMarketplace.sol`, việc khấu trừ 2.5% được thực thi cưỡng chế ở cấp độ hợp đồng thông minh:
  ```solidity
  (address receiver, uint256 amount) = IERC2981(listing.nftContract).royaltyInfo(
      listing.tokenId,
      totalPrice
  );
  if (receiver != address(0) && amount > 0) {
      paymentToken.safeTransferFrom(msg.sender, receiver, amount);
  }
  ```
* **Ý nghĩa nhân văn & kinh tế**: Đảm bảo nguồn thu nhập thụ động bền vững, trọn đời cho các họa sĩ và studio sáng tạo nội dung.

---

### 3.4. Mô Hình Ký Gửi Phi Tập Trung (Trustless Escrow) & Chống Tấn Công Reentrancy

#### 1. Cơ Chế Ký Gửi (Escrow):
Thay vì giữ thẻ bài ở ví cá nhân của người bán rồi đợi khi có người mua mới gửi yêu cầu chuyển thẻ (dễ phát sinh gian lận nếu người bán tẩu tán thẻ trước đó), hợp đồng `RiftMarketplace.sol` áp dụng cơ chế Ký Gửi:
* Khi Seller bấm **"Đăng bán"**, NFT được chuyển thẳng vào quyền lưu ký của hợp đồng sàn (`address(this)`).
* Khi Buyer thanh toán, tiền chuyển cho Seller và NFT chuyển cho Buyer diễn ra trong cùng một tích tắc (Nguyên tử hóa - Atomicity). Nếu bất kỳ khâu nào thất bại (ví dụ số dư người mua không đủ), toàn bộ giao dịch bị hủy và trạng thái được rollback về ban đầu.

#### 2. Phòng Ngự Tấn Công Tái Nhập (Reentrancy Guard & Checks-Effects-Interactions):
Tấn công Reentrancy (tương tự vụ hack The DAO lịch sử năm 2016 làm thất thoát 60 triệu USD) xảy ra khi hợp đồng gọi ra địa chỉ bên ngoài trước khi cập nhật số dư nội bộ.

Hệ thống Riftbound áp dụng 2 lớp bảo vệ tuyệt đối:
* **Lớp 1: Kế thừa `ReentrancyGuard` của OpenZeppelin**: Áp dụng modifier `nonReentrant` cho toàn bộ các hàm nhạy cảm (`listItem`, `buyItem`, `cancelListing`, `openPack`). Cơ chế sử dụng một cờ khóa trạng thái (`_status`), chặn đứng mọi nỗ lực gọi lặp vòng trước khi lệnh trước kết thúc.
* **Lớp 2: Mô hình CEI (Checks - Effects - Interactions)**:
  * **Checks**: Kiểm tra điều kiện đầu vào (`require(listing.isActive)`, `require(quantity > 0)`).
  * **Effects**: Cập nhật trạng thái hợp đồng trước (`listing.quantity -= buyQuantity;` hoặc `listing.isActive = false;`).
  * **Interactions**: Cuối cùng mới thực hiện chuyển tiền và chuyển NFT (`safeTransferFrom`).

---

### 3.5. Thuật Toán Ngẫu Nhiên Hóa On-Chain (On-Chain Pseudo-RNG & Prevrandao)

Trong `RiftBoosterPack.sol`, việc quyết định người chơi nhận được thẻ Common, Rare, Epic hay Thần Thoại Mythic được tính toán trực tiếp trên EVM thông qua hàm băm mật mã:

```solidity
uint256 randomNum = uint256(
    keccak256(
        abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender,
            _nonce,
            i
        )
    )
) % 100; // Sinh số nguyên ngẫu nhiên từ 0 đến 99
```

* **Các yếu tố Entropy đầu vào**:
  * `block.timestamp`: Thời điểm thợ đào/validator đóng block.
  * `block.prevrandao`: Giá trị ngẫu nhiên bất biến được cung cấp trực tiếp từ Beacon Chain (Ethereum PoS).
  * `msg.sender`: Địa chỉ ví độc nhất của người chơi.
  * `_nonce`: Biến đếm trạng thái tăng dần sau mỗi lần bốc thẻ, triệt tiêu nguy cơ 2 lá bài trong cùng một gói nhận kết quả giống hệt nhau.
* **Tỷ lệ phân phối xác suất**:
  * **Novice Pack**: 70% Common (ID 1,2), 25% Rare (ID 3,4), 5% Epic (ID 5).
  * **Void Master Pack**: 40% Common, 35% Rare, 18% Epic, 6% Legendary (ID 6), 1% Mythic (ID 7).

---

### 3.6. Quyền Sở Hữu Kỹ Thuật Số Thực Thụ (True Digital Ownership) & Tính Bất Biến

* **Phi lưu ký (Non-Custodial)**: Không một quản trị viên hay máy chủ nào nắm giữ Private Key của người chơi. Thẻ bài NFT thuộc quyền sở hữu độc quyền của địa chỉ ví người dùng.
* **Tính bất biến (Immutability)**:
  * Lịch sử giao dịch, số lượng thẻ in ra, địa chỉ ví từng sở hữu đều được ghi nhận vĩnh viễn trên sổ cái Blockchain.
  * Nhà phát hành không thể tùy tiện chỉnh sửa dữ liệu, không thể tự ý xóa bỏ thẻ bài trong ví người chơi hay can thiệp vào số dư `$RIFT` như trong cơ sở dữ liệu game Web2.
* **Khả năng tương tác mở rộng (Interoperability)**: Vì thẻ bài tuân thủ chuẩn ERC-1155 quốc tế, người chơi hoàn toàn có thể mang thẻ bài này lên các sàn giao dịch bên thứ ba (như OpenSea, Rarible, LooksRare) hoặc sử dụng trong các tựa game Web3 khác trong tương lai.
