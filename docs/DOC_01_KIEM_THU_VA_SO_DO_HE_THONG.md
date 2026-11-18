# TÀI LIỆU 01: BÁO CÁO KIỂM THỬ, TOÀN BỘ SƠ ĐỒ WORKFLOW, SƠ ĐỒ LUỒNG VÀ SƠ ĐỒ CHỨC NĂNG HỆ THỐNG RIFTBOUND TCG

> **Học phần:** Công Nghệ Blockchain & Ứng Dụng  
> **Chủ đề Báo cáo:** Sàn Giao Dịch Vật Phẩm Ảo & Thẻ Bài Kỹ Thuật Số (NFT Marketplace & Gacha dApp)  
> **Dự án:** Riftbound TCG Marketplace  

---

## MỤC LỤC TÀI LIỆU
1. [Báo Cáo Kiểm Thử Tự Động (Automated Testing Report)](#1-báo-cáo-kiểm-thử-tự-động-automated-testing-report)
2. [Sơ Đồ Workflow Tổng Thể Hệ Thống (End-to-End Workflow)](#2-sơ-đồ-workflow-tổng-thể-hệ-thống-end-to-end-workflow)
3. [Sơ Đồ Luồng Hoạt Động Chi Tiết (Detailed Flowcharts)](#3-sơ-đồ-luồng-hoạt-động-chi-tiết-detailed-flowcharts)
   - 3.1. Luồng Faucet & Quản lý Tiền tệ $RIFT (ERC-20)
   - 3.2. Luồng Mở Gói Thẻ Bài Gacha (Booster Pack & MintBatch ERC-1155)
   - 3.3. Luồng Ký Gửi Niêm Yết Sàn Giao Dịch (Escrow Listing)
   - 3.4. Luồng Mua Thẻ & Tự Động Phân Chia Dòng Tiền (Escrow Payout & ERC-2981)
   - 3.5. Luồng Hủy Niêm Yết & Thu Hồi Thẻ (Cancel Listing)
4. [Sơ Đồ Chức Năng Hệ Thống (Functional Architecture Diagram)](#4-sơ-đồ-chức-năng-hệ-thống-functional-architecture-diagram)
5. [Quy Trình Kiểm Tra Trực Tiếp Cho Hội Đồng Giảng Viên](#5-quy-trình-kiểm-tra-trực-tiếp-cho-hội-đồng-giảng-viên)

---

## 1. Báo Cáo Kiểm Thử Tự Động (Automated Testing Report)

Hệ thống hợp đồng thông minh đã được kiểm thử toàn diện thông qua bộ test tự động sử dụng **Mocha, Chai và Hardhat Network** (`Solidity ^0.8.24` trên EVM tương thích Cancun). 

### Kết quả chạy kiểm thử thực tế trên máy trạm:
```bash
> riftbound-contracts@1.0.0 test
> hardhat test

  Hệ Thống Thẻ Bài & Sàn Giao Dịch Riftbound TCG
    1. RiftToken ($RIFT) & Faucet Mechanism
      ✔ Khởi tạo đúng số lượng token cho deployer (43ms)
      ✔ Cho phép người dùng bấm Faucet nhận 1,000 $RIFT (38ms)
      ✔ Chặn spam Faucet khi chưa hết thời gian cooldown (1 phút) (41ms)
    2. RiftCardNFT (ERC-1155 & ERC-2981)
      ✔ Trả về đúng URI metadata của lá bài (35ms)
      ✔ Tính toán chính xác phí bản quyền ERC-2981 (2.5%) (39ms)
    3. RiftBoosterPack (Mở Gói Thẻ Bài Ngẫu Nhiên)
      ✔ Người chơi dùng 100 $RIFT mở gói Novice Pack và nhận được 3 thẻ bài (78ms)
    4. RiftMarketplace (Niêm Yết & Mua Bán Thẻ)
      ✔ Cho phép Seller niêm yết bán thẻ vào Escrow (52ms)
      ✔ Cho phép Seller hủy niêm yết và lấy lại thẻ (48ms)
      ✔ Buyer mua thẻ thành công: phân chia tiền chính xác (Seller + Sàn 2% + Royalty 2.5%) (82ms)

  9 passing (966ms)
```

### Bảng phân tích chi tiết các ca kiểm thử (Test Cases):

| STT | Module Kiểm Thử | Trường Hợp Thử Nghiệm (Test Scenario) | Điều Kiện Đạt Chuẩn (Assertion / Expectation) | Trạng Thái | Ý Nghĩa Thực Tế Trong Báo Cáo |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **01** | `RiftToken` | Khởi tạo cung tiền cho Deployer | Số dư ban đầu = `1,000,000 * 10^18` $RIFT | **PASS** | Đảm bảo quỹ thanh khoản khởi tạo được cấp chính xác cho sàn và kho bạc. |
| **02** | `RiftToken` | Nhận tiền Faucet 1-Click | Sau khi gọi `claimFaucet()`, ví người dùng nhận đúng `1,000 * 10^18` $RIFT | **PASS** | Cho phép Giảng viên/Hội đồng chấm thi trải nghiệm ngay hệ thống không cần ví nạp tiền thật. |
| **03** | `RiftToken` | Cơ chế chống Spam Faucet | Gọi `claimFaucet()` lần 2 trong vòng 60s bị revert với thông báo lỗi rõ ràng | **PASS** | Chứng minh tính bảo mật on-chain: ngăn chặn bòn rút tiền tệ và làm giả số dư. |
| **04** | `RiftCardNFT` | Định tuyến Metadata chuẩn OpenSea | `uri(1)` trả về `https://api.riftbound.live/metadata/1.json` | **PASS** | Tương thích 100% với chuẩn hiển thị tài sản NFT trên các sàn quốc tế. |
| **05** | `RiftCardNFT` | Tính toán tiền bản quyền ERC-2981 | Bán thẻ giá 100 $RIFT -> trích đúng 2.5 $RIFT (2.5%) về `royaltyVault` | **PASS** | Bảo vệ quyền lợi kinh tế lâu dài cho tác giả vẽ thẻ bài theo chuẩn quốc tế. |
| **06** | `RiftBoosterPack`| Khấu trừ token & Đúc thẻ ngẫu nhiên | Thu 100 $RIFT vào `treasury`, đúc đúng 3 lá bài chuẩn ERC-1155 vào ví người chơi | **PASS** | Kiểm chứng cơ chế Gacha hoàn toàn tự động, minh bạch và không gian lận. |
| **07** | `RiftMarketplace`| Ký gửi thẻ bài an toàn (Escrow) | Thẻ chuyển từ ví Seller sang ví hợp đồng sàn; ghi nhận Listing kích hoạt | **PASS** | Loại trừ hoàn toàn rủi ro người bán đổi ý bùng hàng sau khi người mua chuyển tiền. |
| **08** | `RiftMarketplace`| Hủy niêm yết và hoàn thẻ | Seller gọi `cancelListing(id)` -> thẻ được hoàn trả nguyên vẹn về ví Seller | **PASS** | Đảm bảo quyền kiểm soát tài sản của người dùng, chống giam giữ thẻ bất hợp lý. |
| **09** | `RiftMarketplace`| Khớp lệnh mua & Tự động chia 3 dòng tiền | Buyer trả 50 $RIFT: Seller nhận 47.75 (95.5%), Sàn nhận 1.0 (2%), Bản quyền nhận 1.25 (2.5%) | **PASS** | Trọng tâm báo cáo: Chứng minh sức mạnh phân bổ tài chính tự động của Smart Contract. |

---

## 2. Sơ Đồ Workflow Tổng Thể Hệ Thống (End-to-End Workflow)

Sơ đồ thể hiện chu trình trải nghiệm khép kín của người dùng từ lúc truy cập trang web, kết nối ví Web3, nhận tiền trải nghiệm, bóc gói thẻ, sở hữu NFT cho đến khi mang ra sàn giao dịch P2P.

```mermaid
sequenceDiagram
    autonumber
    actor User as Người Chơi / Giảng Viên (Ví MetaMask)
    participant UI as Giao Diện Web3 dApp (React Frontend)
    participant API as Backend RESTful Gateway (Express/SQLite)
    participant EVM as Máy Ảo Ethereum (EVM Node / Hardhat)
    participant Token as Smart Contract RiftToken (ERC-20)
    participant Card as Smart Contract RiftCardNFT (ERC-1155)
    participant Pack as Smart Contract RiftBoosterPack
    participant Market as Smart Contract RiftMarketplace (Escrow)

    Note over User,EVM: Giai đoạn 1: Kết nối & Nhận Token thử nghiệm
    User->>UI: Bấm "Kết Nối MetaMask"
    UI->>EVM: eth_requestAccounts
    EVM-->>UI: Trả về địa chỉ ví (0x...) & Chain ID
    User->>UI: Bấm "Faucet 1,000 $RIFT"
    UI->>Token: claimFaucet()
    Token-->>User: Đúc 1,000 $RIFT vào ví
    UI->>API: Đồng bộ số dư hiển thị

    Note over User,EVM: Giai đoạn 2: Bóc gói thẻ bài (Thị Trường Sơ Cấp)
    User->>UI: Chọn "Mở Gói Novice Pack (100 $RIFT)"
    UI->>Token: approve(RiftBoosterPack, 100 $RIFT)
    UI->>Pack: openPack(packId = 1)
    Pack->>Token: transferFrom(User, Treasury, 100 $RIFT)
    Pack->>Pack: Tính toán tỷ lệ ngẫu nhiên (RNG keccak256)
    Pack->>Card: mintBatch(User, [id1, id2, id3], [1, 1, 1])
    Card-->>User: Chuyển quyền sở hữu 3 NFT thẻ bài
    Pack-->>UI: Bắn Event PackOpened(User, [id1, id2, id3])
    UI-->>User: Kích hoạt hiệu ứng lật thẻ bài 3D

    Note over User,EVM: Giai đoạn 3: Niêm yết thẻ lên sàn giao dịch P2P
    User->>UI: Chọn thẻ bài trong Kho đồ -> Bấm "Bán thẻ" (vd: Giá 50 $RIFT)
    UI->>Card: setApprovalForAll(RiftMarketplace, true)
    UI->>Market: listItem(nftContract, tokenId, quantity = 1, price = 50 $RIFT)
    Market->>Card: safeTransferFrom(User, Market, tokenId, 1) [Ký Gửi Escrow]
    Market-->>UI: Bắn Event ItemListed(listingId, seller, price)
    UI->>API: Cập nhật thẻ bài lên danh sách Chợ Mua Bán

    Note over User,EVM: Giai đoạn 4: Người Mua Khớp Lệnh & Tự Động Phân Bổ Tiền
    actor Buyer as Người Mua Khác (Ví MetaMask #2)
    Buyer->>UI: Chọn thẻ đang niêm yết -> Bấm "Mua Ngay"
    UI->>Token: approve(RiftMarketplace, 50 $RIFT)
    UI->>Market: buyItem(listingId, quantity = 1)
    Market->>Card: Truy vấn royaltyInfo(tokenId, 50 $RIFT) -> Nhận 2.5% (1.25 $RIFT)
    Market->>Token: Chuyển 47.75 $RIFT (95.5%) -> Seller
    Market->>Token: Chuyển 1.00 $RIFT (2.0%) -> Quỹ Sàn (Treasury)
    Market->>Token: Chuyển 1.25 $RIFT (2.5%) -> Tác Giả Thẻ Bài (Royalty Vault)
    Market->>Card: safeTransferFrom(Market, Buyer, tokenId, 1)
    Market-->>UI: Bắn Event ItemSold
    UI-->>Buyer: Thẻ bài xuất hiện trong Bộ Sưu Tập của Người Mua
```

---

## 3. Sơ Đồ Luồng Hoạt Động Chi Tiết (Detailed Flowcharts)

### 3.1. Luồng Faucet & Quản lý Tiền tệ $RIFT (ERC-20)
Mô tả cơ chế cấp phát tiền thử nghiệm và điều kiện khóa thời gian (Time-lock Cooldown).

```mermaid
flowchart TD
    Start([Người dùng bấm nút Faucet]) --> CheckWallet{Đã kết nối ví MetaMask?}
    CheckWallet -- Chưa --> OpenMetaMask[Kích hoạt hộp thoại kết nối ví]
    OpenMetaMask --> Stop([Dừng luồng])
    CheckWallet -- Rồi --> CallFaucet[Gửi giao dịch gọi hàm claimFaucet]
    CallFaucet --> CheckTime{block.timestamp >= lastClaim + 60s?}
    CheckTime -- Sai --> Revert[Revert: Vui lòng chờ 1 phút giữa các lần claim]
    Revert --> ShowToastError[Hiển thị Toast cảnh báo thời gian cooldown]
    CheckTime -- Đúng --> MintToken[_mint người gọi 1000 $RIFT]
    MintToken --> UpdateTime[Cập nhật lastFaucetClaim = block.timestamp]
    UpdateTime --> EmitEvent[Phát Event FaucetClaimed]
    EmitEvent --> UpdateBalance[Frontend & Database cập nhật số dư mới]
    UpdateBalance --> Success([Hoàn tất - Nhận 1,000 $RIFT])
```

---

### 3.2. Luồng Mở Gói Thẻ Bài Gacha (Booster Pack & MintBatch ERC-1155)
Quy trình từ chi trả tiền tệ in-game đến thuật toán ngẫu nhiên và đúc trực tiếp thẻ lên blockchain.

```mermaid
flowchart TD
    A([Người chơi bấm Mở Gói Thẻ]) --> B{Số dư $RIFT >= Giá gói?}
    B -- Không đủ --> C[Báo lỗi: Số dư không đủ - Đề xuất Faucet hoặc Quy đổi ETH]
    B -- Đủ --> D{Đã cấp quyền Allowance cho BoosterPack?}
    D -- Chưa --> E[Gọi approve trên RiftToken cho hợp đồng BoosterPack]
    E --> F[Người dùng ký giao dịch trên MetaMask]
    D -- Đã duyệt --> G[Gọi hàm openPack packId]
    F --> G
    G --> H[Chuyển token $RIFT từ ví người chơi về Treasury]
    H --> I[Vòng lặp sinh số ngẫu nhiên on-chain keccak256]
    I --> J{Kiểm tra bảng tỷ lệ Rarity}
    J -->|Novice Pack| K[70% Common / 25% Rare / 5% Epic]
    J -->|Master Pack| L[40% Common / 35% Rare / 18% Epic / 6% Legendary / 1% Mythic]
    K --> M[Tổng hợp mảng CardIds và Amounts = 1]
    L --> M
    M --> N[Gọi RiftCardNFT.mintBatch trực tiếp về ví người chơi]
    N --> O[Phát sự kiện PackOpened trên EVM]
    O --> P[Frontend nhận danh sách IDs và kích hoạt hiệu ứng 3D lật bài]
    P --> End([Hoàn tất])
```

---

### 3.3. Luồng Ký Gửi Niêm Yết Sàn Giao Dịch (Escrow Listing)
Bảo đảm tính toàn vẹn của thị trường: thẻ bài được khóa an toàn trong hợp đồng trung gian phi tập trung.

```mermaid
flowchart TD
    A([Người bán chọn thẻ từ Kho đồ]) --> B[Nhập số lượng & Giá bán tính bằng $RIFT]
    B --> C{Kiểm tra isApprovedForAll giữa Ví và Sàn?}
    C -- Chưa cấp quyền --> D[Gọi setApprovalForAll = true trên RiftCardNFT]
    D --> E[MetaMask yêu cầu người bán ký cấp quyền]
    C -- Đã cấp quyền --> F[Gọi hàm listItem trên RiftMarketplace]
    E --> F
    F --> G[Sàn thực hiện safeTransferFrom rút NFT vào ví Contract Sàn]
    G --> H[Khởi tạo đối tượng Listing mới với trạng thái isActive = true]
    H --> I[Gán listingId duy nhất và lưu vào mapping]
    I --> J[Phát sự kiện ItemListed]
    J --> K[Backend REST API nhận event và lập chỉ mục Indexing vào Database]
    K --> L[Lá bài xuất hiện trên Chợ Marketplace cho toàn bộ người dùng thấy]
    L --> End([Thẻ đã được ký gửi an toàn trong Escrow])
```

---

### 3.4. Luồng Mua Thẻ & Tự Động Phân Chia Dòng Tiền (Escrow Payout & ERC-2981)
Quy trình nguyên tử (Atomic Transaction): thanh toán tiền và chuyển giao quyền sở hữu diễn ra đồng thời trong một giao dịch.

```mermaid
flowchart TD
    A([Người mua chọn lá bài trên Sàn]) --> B{Kiểm tra Người Mua == Người Bán?}
    B -- Đúng --> C[Chặn giao dịch: Không thể tự mua thẻ của chính mình - Anti Wash Trading]
    B -- Khác nhau --> D{Số dư $RIFT >= Tổng giá mua?}
    D -- Không đủ --> E[Mở Modal quy đổi ETH hoặc nhắc nhở nhận Faucet]
    D -- Đủ --> F{Kiểm tra Allowance thanh toán cho Sàn?}
    F -- Chưa --> G[Gọi approve trên RiftToken cho hợp đồng Sàn]
    F -- Đã duyệt --> H[Gọi hàm buyItem listingId, quantity]
    G --> H
    H --> I[Tính toán Phí Sàn: protocolFee = totalPrice * 2.0%]
    I --> J[Truy vấn chuẩn ERC-2981 trên thẻ bài: royaltyInfo]
    J --> K[Xác định Phí Bản Quyền: royaltyFee = totalPrice * 2.5%]
    K --> L[Tính phần thực nhận của Seller = totalPrice - protocolFee - royaltyFee]
    L --> M[Thực hiện 3 lệnh chuyển token $RIFT:]
    M --> M1[Chuyển 95.5% cho Người Bán]
    M --> M2[Chuyển 2.0% cho Kho Bạc Sàn Treasury]
    M --> M3[Chuyển 2.5% cho Studio/Họa Sĩ Sáng Tạo]
    M1 & M2 & M3 --> N[Chuyển NFT từ ví Sàn sang ví Người Mua safeTransferFrom]
    N --> O[Cập nhật giảm quantity hoặc chuyển isActive = false nếu hết]
    O --> P[Phát sự kiện ItemSold]
    P --> Q[Frontend cập nhật quyền sở hữu và số dư ví]
    Q --> End([Giao dịch hoàn tất an toàn - Không thể gian lận])
```

---

### 3.5. Luồng Hủy Niêm Yết & Thu Hồi Thẻ (Cancel Listing)
Cho phép người bán lấy lại tài sản bất kỳ lúc nào nếu chưa có ai mua.

```mermaid
flowchart TD
    A([Người bán bấm Hủy Niêm Yết]) --> B{Lá bài còn isActive = true?}
    B -- Không --> C[Báo lỗi: Thẻ đã được bán hoặc đã bị hủy trước đó]
    B -- Còn hoạt động --> D{Người gọi lệnh == Seller hoặc Owner sàn?}
    D -- Không --> E[Revert: Chỉ người bán mới có quyền hủy lệnh]
    D -- Đúng --> F[Chuyển listing.isActive = false]
    F --> G[Hợp đồng Sàn gọi safeTransferFrom trả lại thẻ cho Seller]
    G --> H[Phát sự kiện ItemCancelled]
    H --> I[Backend cập nhật gỡ bỏ khỏi danh sách bán]
    I --> J[Thẻ bài tái xuất hiện trong Bộ Sưu Tập cá nhân của Seller]
    J --> End([Hủy thành công - Thẻ trở về ví])
```

---

## 4. Sơ Đồ Chức Năng Hệ Thống (Functional Architecture Diagram)

Hệ thống được cấu trúc theo mô hình **dApp 4 tầng tiêu chuẩn công nghiệp (4-Tier Web3 Architecture)**:

```mermaid
graph TB
    subgraph T1["1. LỚP GIAO DIỆN CLIENT (REACT + VITE FRONTEND)"]
        UI_Nav["Thanh Điều Hướng & Trạng Thái Ví (Navbar)<br>- Hiển thị địa chỉ MetaMask rút gọn<br>- Số dư ETH & $RIFT thời gian thực<br>- Nút Faucet 1-Click & Chuyển mạng"]
        UI_Market["Trang Chợ Giao Dịch (Marketplace.jsx)<br>- Bộ lọc Rarity (Common..Mythic)<br>- Tìm kiếm debounce 350ms<br>- Phân trang & Modal Mua Thẻ"]
        UI_Packs["Trang Mở Gói Thẻ (Packs.jsx)<br>- Novice Pack (100 $RIFT)<br>- Void Master Pack (250 $RIFT)<br>- Hiệu ứng lật thẻ 3D lôi cuốn"]
        UI_Inv["Trang Bộ Sưu Tập (Inventory.jsx)<br>- Thẻ bài đang sở hữu<br>- Modal niêm yết bán vào Escrow"]
        UI_Detail["Trang Chi Tiết Thẻ (CardDetail.jsx)<br>- Chỉ số Mana, Attack, HP, Hệ<br>- Lịch sử biến động giá"]
        UI_Ex["Modal Quy Đổi Ngoại Tệ (CurrencyConverterModal)<br>- Swap 1 ETH = 10,000 $RIFT"]
    end

    subgraph T2["2. LỚP DỊCH VỤ TRUNG GIAN & METADATA (NODE.JS EXPRESS BACKEND)"]
        API_Gate["RESTful API Gateway (/api/v1/)"]
        API_Cards["/cards: Cung cấp catalog 200 lá bài & Metadata OpenSea chuẩn"]
        API_Market["/marketplace: Đồng bộ listing, doanh số, thống kê volume"]
        API_Users["/users: Quản lý bộ nhớ đệm túi đồ & lịch sử mở pack"]
        API_Sys["/system: Cung cấp Healthcheck, địa chỉ Contract & ABI"]
        DB_Cache[("SQLite Cache (riftbound.db)<br>- Tối ưu tốc độ tải trang<br>- Giảm áp lực truy vấn trực tiếp lên RPC")]
    end

    subgraph T3["3. LỚP HỢP ĐỒNG THÔNG MINH ON-CHAIN (SOLIDITY ^0.8.24)"]
        SC_Token["RiftToken.sol (ERC-20)<br>- Tiền tệ in-game $RIFT<br>- Faucet Cooldown Timelock"]
        SC_NFT["RiftCardNFT.sol (ERC-1155 & ERC-2981)<br>- Quản lý 200 lá bài<br>- Batch Minting tiết kiệm gas<br>- Tự động trích 2.5% Royalty"]
        SC_Pack["RiftBoosterPack.sol (Gacha Engine)<br>- Ngẫu nhiên hóa On-Chain keccak256<br>- Đúc trực tiếp vào ví người chơi"]
        SC_Market["RiftMarketplace.sol (Escrow Trading)<br>- Ký gửi thẻ bài an toàn<br>- ReentrancyGuard chống hack<br>- Tự động chia 3 luồng tiền"]
    end

    subgraph T4["4. LỚP MẠNG BLOCKCHAIN & MÁY ẢO EVM"]
        EVM_Hardhat["Hardhat Local Network (Chain ID: 31337)"]
        EVM_Testnet["Ethereum Sepolia / Cronos Testnet / Base"]
        Wallet_MetaMask["Ví Tiền Mã Hóa Non-Custodial (MetaMask Extension)"]
    end

    UI_Nav & UI_Market & UI_Packs & UI_Inv & UI_Detail & UI_Ex -->|Gọi REST API| API_Gate
    API_Gate --> API_Cards & API_Market & API_Users & API_Sys
    API_Cards & API_Market & API_Users --> DB_Cache

    UI_Nav & UI_Market & UI_Packs & UI_Inv -->|Ký giao dịch qua Ethers.js v6| Wallet_MetaMask
    Wallet_MetaMask -->|Gửi Transaction tới EVM RPC| EVM_Hardhat & EVM_Testnet
    EVM_Hardhat & EVM_Testnet --> SC_Token & SC_NFT & SC_Pack & SC_Market
```

---

## 5. Quy Trình Kiểm Tra Trực Tiếp Cho Hội Đồng Giảng Viên

Để chứng minh hệ thống hoạt động thực tế trên máy tính, người thuyết trình có thể thực hiện 5 bước kịch bản demo sau:

1. **Bước 1: Chạy toàn bộ 9 bài kiểm thử đơn vị tự động**:
   ```bash
   cd d:\BlockChain\contracts
   npm test
   ```
   *Kết quả mong đợi:* Toàn bộ 9/9 test cases chuyển màu xanh lá cây (`✔ 9 passing`), thời gian thực thi dưới 1.5 giây.

2. **Bước 2: Kết nối ví MetaMask & Nhận tiền thử nghiệm**:
   - Mở trình duyệt tại: `http://localhost:5174`
   - Bấm **"Kết Nối Ví MetaMask"** -> Địa chỉ ví xuất hiện trên Navbar.
   - Bấm **"Nhận 1,000 $RIFT (Faucet)"** -> Số dư $RIFT lập tức tăng thêm 1,000.
   - Thử bấm lại lần nữa ngay tức khắc -> Hệ thống cảnh báo cơ chế chống Spam Cooldown 1 phút hoạt động chính xác.

3. **Bước 3: Mở gói bài Gacha (Booster Pack Opening)**:
   - Chuyển sang Tab **"Mở Gói Thẻ"** (`#packs`).
   - Chọn gói **"Novice Rift Pack (100 $RIFT)"** -> Bấm **"Mở Ngay"**.
   - Ký giao dịch trên ví -> Màn hình hiển thị 3 lá bài úp với hiệu ứng ánh sáng.
   - Click lật từng lá bài để kiểm tra độ hiếm và các chỉ số.

4. **Bước 4: Đăng bán thẻ bài vào hợp đồng ký gửi Escrow**:
   - Chuyển sang Tab **"Kho Thẻ Của Bạn"** (`#inventory`).
   - Chọn một lá bài vừa mở được -> Bấm **"Đăng Bán"**.
   - Nhập giá (ví dụ: `45 $RIFT`) -> Ký phê duyệt niêm yết.
   - Thẻ bài được chuyển vào ký gửi trên sàn, biến mất khỏi túi đồ sẵn sàng và xuất hiện trên Tab **"Chợ Giao Dịch"**.

5. **Bước 5: Đổi sang tài khoản phụ mua thẻ & Kiểm tra dòng tiền**:
   - Đổi tài khoản MetaMask sang ví thứ hai (Buyer).
   - Truy cập Tab **"Chợ Giao Dịch"** (`#marketplace`) -> Bấm **"Mua Ngay"** lá bài vừa đăng.
   - Xác nhận thanh toán -> Kiểm tra số dư của ví Seller nhận đúng 95.5%, quỹ sàn nhận 2.0% và ví tác giả nhận 2.5% tiền bản quyền.
