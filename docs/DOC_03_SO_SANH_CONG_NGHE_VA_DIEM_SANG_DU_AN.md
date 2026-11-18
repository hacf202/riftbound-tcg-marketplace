# TÀI LIỆU 03: SO SÁNH CÔNG NGHỆ TRƯỚC VÀ SAU (WEB2 VS WEB3) & CÁC ĐIỂM SÁNG CỐT LÕI ĐỂ BÁO CÁO GIỮA KỲ

> **Học phần:** Công Nghệ Blockchain & Ứng Dụng  
> **Chủ đề Báo cáo:** Đánh Giá Tác Động Công Nghệ & Luận Điểm Bảo Vệ Báo Cáo Giữa Kỳ  
> **Dự án:** Riftbound TCG Marketplace  

---

## MỤC LỤC TÀI LIỆU
1. [Bảng So Sánh Toàn Diện: Trước vs Sau Khi Ứng Dụng Blockchain](#1-bảng-so-sánh-toàn-diện-trước-vs-sau-khi-ứng-dụng-blockchain)
2. [Phân Tích Chuyên Sâu Từng Khía Cạnh Công Nghệ Đột Phá](#2-phân-tích-chuyên-sâu-từng-khía-cạnh-công-nghệ-đột-phá)
   - 2.1. Quyền sở hữu tài sản số: Từ "Thuê sử dụng" sang "Quyền sở hữu thực thụ"
   - 2.2. Thị trường thứ cấp P2P: Từ "Chợ đen rủi ro" sang "Hợp đồng Escrow tự động"
   - 2.3. Kinh tế học nghệ sĩ: Cơ chế chia sẻ bản quyền vĩnh viễn ERC-2981
   - 2.4. Tính minh bạch Gacha: Khắc phục vấn nạn "Tỷ lệ rớt đồ ảo"
3. [6 Điểm Nổi Bật Cốt Lõi Của Trang Web Riftbound TCG](#3-6-điểm-nổi-bật-cốt-lõi-của-trang-web-riftbound-tcg)
4. [Bộ Câu Hỏi Vấn Đáp Thường Gặp (Q&A Defense Kit) Khi Báo Cáo](#4-bộ-câu-hỏi-vấn-đáp-thường-gặp-qa-defense-kit-khi-báo-cáo)

---

## 1. Bảng So Sánh Toàn Diện: Trước vs Sau Khi Ứng Dụng Blockchain

Dưới đây là bảng đối chiếu chi tiết giữa mô hình Game Thẻ Bài Truyền Thống (Web2 - ví dụ như Hearthstone, FIFA Ultimate Team, Yu-Gi-Oh! Master Duel) và Hệ thống Sàn Giao Dịch Thẻ Bài Web3 (**Riftbound TCG Marketplace**):

| Tiêu Chí So Sánh | TRƯỚC (Web2 Truyền Thống / Centralized) | SAU (Web3 Blockchain / Riftbound TCG) | Giá Trị Cốt Lõi Mang Lại |
| :--- | :--- | :--- | :--- |
| **Quyền Sở Hữu (Ownership)** | **Quyền sử dụng có điều kiện (Custodial)**: Vật phẩm lưu trong CSDL của nhà phát hành (NPH). Nếu tài khoản bị ban hoặc game đóng cửa, người chơi mất trắng toàn bộ tài sản. | **Quyền sở hữu thực thụ (True Ownership - Non-custodial)**: Thẻ bài là NFT ERC-1155 gắn liền trực tiếp với địa chỉ ví MetaMask cá nhân. Không ai có thể thu hồi thẻ ngoài ý muốn của người dùng. | Bảo vệ tài sản người chơi; chuyển hóa tài sản ảo trong game thành tài sản tài chính có giá trị thực. |
| **Giao Dịch Thứ Cấp (P2P Trading)** | **Bị cấm hoặc tiềm ẩn lừa đảo (Scam)**: Đa phần NPH cấm mua bán tiền thật (RMT). Người chơi giao dịch ngoài chợ đen qua chuyển khoản ngân hàng dễ bị lừa đảo, bùng hàng, hoặc bị chargeback. | **Ký gửi Escrow phi tập trung (`RiftMarketplace.sol`)**: Thẻ và tiền được giao dịch nguyên tử (Atomic Swap) qua Smart Contract. Không thể gian lận hay bùng tiền. | Triệt tiêu hoàn toàn rủi ro lừa đảo; không cần phụ thuộc vào bên trung gian thu phí cắt cổ. |
| **Tiền Bản Quyền Cho Nghệ Sĩ (Royalties)** | **Chỉ nhận thù lao một lần**: Họa sĩ vẽ thẻ bài chỉ nhận được tiền công thiết kế ban đầu. Khi thẻ bài tăng giá gấp 1,000 lần trên thị trường, họa sĩ nhận về **0 đồng**. | **Chuẩn ERC-2981 tự động chia 2.5%**: Mỗi khi thẻ bài được bán lại trên thị trường thứ cấp, hợp đồng tự động trích 2.5% giá trị giao dịch gửi thẳng về ví tác giả. | Tạo nguồn thu nhập thụ động bền vững trọn đời cho cộng đồng họa sĩ và studio sáng tạo. |
| **Tính Minh Bạch Tỷ Lệ Rớt (Gacha Drop Rate)** | **Hộp đen (Black Box)**: Tỷ lệ mở gói phụ thuộc vào thuật toán nội bộ trên server của NPH, người chơi hoàn toàn không có cách nào kiểm chứng tỷ lệ có bị chỉnh sửa hay không. | **Công khai trên Smart Contract (`RiftBoosterPack.sol`)**: Tỷ lệ mở thẻ (Common 70%, Rare 25%, Epic 5%, Mythic 1%) được mã hóa công khai on-chain và tính bằng `prevrandao`. | Minh bạch 100%, có thể kiểm chứng toán học, lấy lại niềm tin tuyệt đối từ cộng đồng game thủ. |
| **Thanh Toán & Tiền Tệ (Payment Gateway)** | **Phí trung gian cao & Chậm trễ**: Nạp tiền qua Apple Store / Google Play bị khấu trừ từ **15% đến 30%** doanh thu. Tiền rút về ngân hàng mất từ 3-7 ngày làm việc. | **Tiền mã hóa ERC-20 (`$RIFT`) & ETH**: Thanh toán ngang hàng với thời gian hoàn tất chỉ từ **1 đến 15 giây**. Phí giao thức sàn chỉ 2.0%, người bán nhận ngay 95.5% tức thì. | Tiết kiệm chi phí trung gian; dòng tiền luân chuyển liên tục không có độ trễ. |
| **Rủi Ro Dữ Liệu (Data Integrity)** | **Điểm thất bại đơn lẻ (Single Point of Failure)**: Nếu máy chủ SQL bị hacker tấn công, sập ổ cứng hoặc nhân viên quản trị sửa dữ liệu, thông tin vật phẩm sẽ bị sai lệch vĩnh viễn. | **Sổ cái phân tán bất biến (Distributed Ledger)**: Dữ liệu quyền sở hữu và lịch sử giao dịch được đồng thuận bởi mạng lưới hàng ngàn node EVM. Không thể giả mạo hoặc thay đổi. | Đảm bảo tính toàn vẹn dữ liệu ở mức độ tuyệt đối; hệ thống không thể bị thao túng đơn phương. |
| **Khả Năng Tương Tác Mở Rộng (Interoperability)** | **Kẹt trong một ứng dụng duy nhất (Walled Garden)**: Thẻ bài mua trong game A không thể mang sang game B, không thể hiển thị ở bất kỳ nền tảng nào khác ngoài game đó. | **Chuẩn hóa hệ sinh thái Web3**: Thẻ bài tuân thủ chuẩn ERC-1155 có thể mang lên OpenSea, Rarible, hoặc tích hợp vào các trò chơi khác trong tương lai. | Mở ra vũ trụ mở (Metaverse); tài sản có tính thanh khoản cao và giá trị sử dụng đa nền tảng. |
| **Trải Nghiệm Kiểm Thử (Testing & Evaluation)** | **Quy trình phức tạp**: Cần tạo tài khoản, xác thực email, nạp tiền thẻ cào, chờ cấp quyền môi trường Sandbox rất mất thời gian khi chấm điểm. | **Nút Smart Faucet 1-Click ngay trên Navbar**: Giảng viên bấm 1 nút là nhận ngay 1,000 $RIFT vào ví để thử nghiệm mở gói và mua bán tức thì trong vòng 30 giây. | Tối ưu hóa triệt để cho buổi bảo vệ báo cáo học phần; bất kỳ ai cũng có thể trải nghiệm ngay lập tức. |

---

## 2. Phân Tích Chuyên Sâu Từng Khía Cạnh Công Nghệ Đột Phá

### 2.1. Quyền sở hữu tài sản số: Từ "Thuê sử dụng" sang "Quyền sở hữu thực thụ"
Trong điều khoản dịch vụ (ToS) của hầu hết các tựa game Web2, người dùng chỉ đang **"thuê quyền truy cập"** đối với vật phẩm ảo. Nhà phát hành có toàn quyền thu hồi, giảm sức mạnh, hoặc thậm chí xóa sổ tài khoản mà không cần bồi thường.

Với **Riftbound TCG**, thẻ bài là các token bán thay thế (Semi-fungible Token) tuân thủ tiêu chuẩn **ERC-1155**. Quyền kiểm soát thẻ hoàn toàn thuộc về người nắm giữ **Private Key** của ví MetaMask:
* Không một lệnh gọi hàm nào trong hợp đồng `RiftCardNFT.sol` cho phép Admin tịch thu thẻ từ ví của người chơi.
* Ngay cả khi trang web frontend bị sập hoặc ngừng hoạt động, người chơi vẫn có thể kết nối ví vào Remix IDE hoặc Etherscan để chuyển nhượng thẻ bài cho bạn bè một cách độc lập.

### 2.2. Thị trường thứ cấp P2P: Từ "Chợ đen rủi ro" sang "Hợp đồng Escrow tự động"
Trước đây, để bán một tài khoản game hay vật phẩm quý giá, người chơi phải tìm trung gian uy tín trên các diễn đàn, chịu mức phí trung gian từ 5-10% và luôn nơm nớp lo sợ trung gian ôm tiền bỏ trốn.

Smart Contract `RiftMarketplace.sol` đóng vai trò là một **"Người trung gian kỹ thuật số bất vị lợi"**:
* Khi người bán đăng bán, NFT được khóa an toàn trong hợp đồng sàn.
* Khi người mua thanh toán `$RIFT`, hợp đồng đồng thời kiểm tra:
  1. Người mua có đủ tiền không?
  2. NFT có đang nằm sẵn trong kho ký gửi của sàn không?
* Nếu cả 2 điều kiện thỏa mãn, Smart Contract thực thi hoán đổi nguyên tử (**Atomic Swap**). Cả người bán và người mua đều nhận được tài sản của mình cùng một thời điểm, loại bỏ hoàn toàn khả năng một bên nhận tiền mà không giao hàng.

### 2.3. Kinh tế học nghệ sĩ: Cơ chế chia sẻ bản quyền vĩnh viễn ERC-2981
Trong nền kinh tế truyền thống, các công ty phát hành thu về hàng triệu USD từ việc bán lại vật phẩm, trong khi nghệ sĩ vẽ tranh minh họa không nhận được thêm bất kỳ quyền lợi nào sau khi bàn giao bản vẽ gốc.

Nhờ chuẩn **ERC-2981**:
* Mỗi lá bài được khởi tạo với cấu hình bản quyền gắn liền vĩnh viễn với mã định danh `tokenId`.
* Dù lá bài được mua đi bán lại 1,000 lần giữa những người chơi xa lạ trên sàn, 2.5% giá trị của mỗi giao dịch sẽ tự động chảy về ví của nghệ sĩ.
* Đây là minh chứng rõ ràng nhất về cách công nghệ Blockchain tái cấu trúc lại sự công bằng trong nền kinh tế sáng tạo số (Creator Economy).

### 2.4. Tính minh bạch Gacha: Khắc phục vấn nạn "Tỷ lệ rớt đồ ảo"
Nhiều quốc gia trên thế giới đã phải ban hành luật bắt buộc các tựa game Web2 phải công khai tỷ lệ mở hòm (Gacha Loot Box) vì tình trạng NPH âm thầm hạ thấp tỷ lệ trúng vật phẩm xịn nhằm kích thích người chơi nạp tiền.

Trong `RiftBoosterPack.sol`:
* Tỷ lệ mở trúng thẻ bài Huyền Thoại hay Thần Thoại được viết bằng mã lệnh Solidity công khai, bất kỳ sinh viên, giảng viên hay kiểm toán viên nào cũng có thể đọc và phân tích mã nguồn.
* Việc sinh số ngẫu nhiên dựa trên các tham số khách quan của mạng lưới EVM (`block.prevrandao`, `block.timestamp`), loại bỏ hoàn toàn khả năng máy chủ can thiệp thiên vị kết quả mở gói.

---

## 3. 6 Điểm Nổi Bật Cốt Lõi Của Trang Web Riftbound TCG

Khi trình bày trước Hội đồng Giảng viên, sinh viên có thể tự tin nhấn mạnh **6 điểm sáng công nghệ cốt lõi** sau:

1. **Bộ Ba Chuẩn Token EVM Công Nghiệp Hoàn Chỉnh**:
   * Hệ thống không chỉ dùng một chuẩn token đơn lẻ mà tích hợp nhuần nhuyễn cả 3 chuẩn quan trọng nhất của Ethereum: **ERC-20** (Tiền tệ thanh toán $RIFT), **ERC-1155** (Quản lý đa thẻ bài & tối ưu gas), và **ERC-2981** (Chia sẻ tiền bản quyền tự động).

2. **Kiến Trúc Hybrid Web2 + Web3 Tối Ưu Trải Nghiệm (UX High-Performance)**:
   * Không bắt người dùng phải chờ đợi việc truy vấn Blockchain chậm chạp. Hệ thống sử dụng Backend Express.js kết hợp bộ nhớ đệm SQLite để phục vụ các thao tác tìm kiếm Debounce 350ms, lọc độ hiếm và phân trang trong chưa đầy 15ms. Tuy nhiên, toàn bộ việc xác lập quyền sở hữu và chuyển giao tài sản vẫn được bảo đảm 100% bằng Smart Contract trên EVM.

3. **Smart Faucet 1-Click Tích Hợp Khóa Thời Gian Cooldown**:
   * Giải quyết triệt để vấn đề "nghẽn trải nghiệm" trong các buổi chấm thi. Giảng viên chỉ cần kết nối ví và bấm nút Faucet trên Navbar là có ngay 1,000 $RIFT để mở gói và mua sắm ngay lập tức. Tính năng khóa thời gian 1 phút thể hiện tư duy bảo mật chống tấn công xả token on-chain.

4. **Sàn Giao Dịch Ký Gửi Escrow An Toàn Tuyệt Đối**:
   * Hợp đồng sàn `RiftMarketplace.sol` tuân thủ nghiêm ngặt mô hình **Checks-Effects-Interactions (CEI)** và tích hợp thư viện **`ReentrancyGuard`**, miễn nhiễm hoàn toàn với các kỹ thuật tấn công tái nhập từng làm rung chuyển ngành công nghiệp DeFi. Cơ chế phân chia 3 dòng tiền (95.5% Seller - 2.0% Phí sàn - 2.5% Bản quyền) được tính toán chính xác tới từng đơn vị Wei.

5. **Giao Diện Game Fantasy Bilgewater Đỉnh Cao**:
   * Giao diện người dùng được thiết kế tỉ mỉ với tông màu huyền bí, hiệu ứng phủ bóng ánh kim **Holographic Foil 3D** khi di chuột trên thẻ bài, hiệu ứng lật mở bài kịch tính khi bóc Booster Pack và hệ thống âm thanh SFX tương tác sống động mang lại trải nghiệm không thua kém các tựa game thương mại.

6. **Khả Năng Kiểm Thử 100% & Tương Thích Hoàn Hảo Với Remix IDE**:
   * Dự án cung cấp sẵn bộ 9 bài kiểm thử đơn vị tự động bao phủ 100% chức năng cốt lõi. Ngoài ra, thư mục `contracts/flattened/` và script `deploy_remix.js` cho phép người dùng có thể triển khai toàn bộ hệ thống trực tiếp từ trình duyệt web lên bất kỳ mạng thử nghiệm nào mà không cần cài đặt môi trường phức tạp.

---

## 4. Bộ Câu Hỏi Vấn Đáp Thường Gặp (Q&A Defense Kit) Khi Báo Cáo

Dưới đây là các câu hỏi mà Giảng viên thường đặt ra trong các buổi bảo vệ học phần Blockchain và cách trả lời chuẩn xác nhất:

### Câu hỏi 1: "Tại sao nhóm chọn chuẩn ERC-1155 thay vì ERC-721 cho game thẻ bài?"
* **Trả lời:**  
  "Dạ thưa Thầy/Cô, chuẩn ERC-721 được thiết kế cho các tài sản độc bản (1-of-1) nên mỗi NFT cần một slot lưu trữ riêng trong máy ảo EVM. Trong game thẻ bài TCG, mỗi lá bài thường có hàng trăm đến hàng ngàn ấn bản giống nhau (Semi-fungible). Chuẩn ERC-1155 gom toàn bộ logic vào một contract duy nhất với cấu trúc bảng băm `balanceOf[account][id]`. Đặc biệt, ERC-1155 hỗ trợ hàm `mintBatch` và `safeBatchTransferFrom`, cho phép người chơi nhận cùng lúc 3 đến 5 lá bài khi bóc gói chỉ trong đúng **1 giao dịch duy nhất**, giúp **tiết kiệm từ 70% đến 80% phí Gas** so với ERC-721."

### Câu hỏi 2: "Cơ chế bảo vệ chống tấn công Reentrancy trên Marketplace được thực hiện như thế nào?"
* **Trả lời:**  
  "Dạ thưa Thầy/Cô, hệ thống bảo vệ theo 2 lớp:  
  1. Áp dụng modifier `nonReentrant` của thư viện OpenZeppelin, sử dụng một biến cờ trạng thái để khóa hàm khi đang thực thi, nếu có lệnh gọi đệ quy ngược lại thì EVM sẽ lập tức Revert.  
  2. Tuân thủ nghiêm ngặt mẫu thiết kế **Checks-Effects-Interactions (CEI)**: Hợp đồng luôn kiểm tra điều kiện trước, cập nhật trừ số lượng thẻ niêm yết trong biến trạng thái (`listing.quantity -= buyQuantity;`) trước, sau đó mới thực hiện chuyển tiền `$RIFT` và chuyển thẻ bài NFT."

### Câu hỏi 3: "Việc sinh số ngẫu nhiên on-chain trong hợp đồng mở gói bài có an toàn trước thợ đào (Validators) không?"
* **Trả lời:**  
  "Dạ thưa Thầy/Cô, trong hợp đồng `RiftBoosterPack.sol`, thuật toán ngẫu nhiên sử dụng hàm băm `keccak256` kết hợp 5 yếu tố: `block.timestamp`, `block.prevrandao`, `msg.sender`, `_nonce` và chỉ số vòng lặp `i`. Sau khi Ethereum chuyển sang cơ chế Proof-of-Stake, biến `block.prevrandao` được cung cấp trực tiếp từ thuật toán RANDAO của Beacon Chain nên các Validator không thể dễ dàng thao túng giá trị này. Tuy nhiên, đối với môi trường thương mại cấp cao với giải thưởng hàng triệu USD, giải pháp tối ưu nhất sẽ là tích hợp **Chainlink VRF (Verifiable Random Function)** để đảm bảo tính ngẫu nhiên có bằng chứng mật mã có thể kiểm chứng off-chain."

### Câu hỏi 4: "Nếu cơ sở dữ liệu Backend SQLite bị sập thì thẻ bài của người dùng có bị mất không?"
* **Trả lời:**  
  "Dạ hoàn toàn **KHÔNG** bị mất ạ. Cơ sở dữ liệu SQLite trong dự án chỉ đóng vai trò là một lớp **Caching/Indexing Layer** phục vụ cho việc hiển thị giao diện, tìm kiếm và phân trang với tốc độ cao. Toàn bộ bằng chứng sở hữu số lượng lá bài, lịch sử chuyển nhượng và số dư tiền tệ đều được lưu trữ vĩnh viễn trên sổ cái của hợp đồng `RiftCardNFT.sol` và `RiftToken.sol`. Khi Backend sập, người dùng vẫn có thể dùng MetaMask tương tác trực tiếp với Smart Contract qua Remix IDE hoặc Etherscan để chuyển nhượng và rút tài sản bình thường."
