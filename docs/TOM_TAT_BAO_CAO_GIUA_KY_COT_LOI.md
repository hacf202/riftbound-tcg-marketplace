# TÀI LIỆU CỐT LÕI ÔN TẬP VÀ VẤN ĐÁP: RIFTBOUND TCG MARKETPLACE
> **Phong cách trình bày**: Ngôn ngữ trực quan, bình dân, sử dụng các hình ảnh đời thực gần gũi thay vì công thức máy móc để sinh viên nắm bắt bản chất công nghệ trong 10 phút và tự tin đối đáp mọi câu hỏi vấn đáp của Giảng viên.

---

## 1. DỰ ÁN NÀY LÀ GÌ? (GIẢI THÍCH KIỂU ĐỜI THƯỜNG)

Hãy tưởng tượng bạn đang chơi một game sưu tầm thẻ bài (như Pokemon, Yu-Gi-Oh! hay Liên Minh Huyền Thoại), nhưng thay vì mua bài giấy ngoài đời:

* **Ở Game truyền thống (Web2 - Hearthstone, FIFA Online, Genshin Impact)**:
  * Toàn bộ thẻ bài, đồ đạc bạn bỏ hàng chục triệu ra mở hòm thực chất **chẳng bao giờ thuộc về bạn**. Chúng chỉ là các dòng dữ liệu nằm trong máy chủ của công ty game.
  * Giống như bạn **đi thuê nhà trọ**: Chủ trọ thích đuổi lúc nào thì đuổi, công ty game phá sản hoặc khóa tài khoản là toàn bộ công sức bốc hơi về con số 0.
  * Muốn bán lại cho người chơi khác thì bị cấm, giao dịch chui ngoài chợ đen thì 90% bị lừa đảo quỵt tiền.
* **Ở Dự án Riftbound TCG (Web3 - Blockchain)**:
  * Mỗi lá bài được biến thành một tài sản số có quyền sở hữu độc lập (gọi là **NFT**).
  * Giống như bạn **mua đứt một mảnh đất có Sổ Đỏ**: Lá bài nằm trong **ví cá nhân (MetaMask)** của bạn, được bảo vệ bằng mật mã học. Công ty game có sập máy chủ, thẻ bài vẫn nguyên vẹn trong ví của bạn trên mạng blockchain toàn cầu.
  * Bạn có toàn quyền mang lên sàn giao dịch mua bán lấy tiền thật một cách an toàn tuyệt đối thông qua **Hợp đồng thông minh (Smart Contract)**, không ai có thể giật đồ hay bùng kèo.

---

## 2. BẢN CHẤT CÁC CƠ CHẾ KỸ THUẬT QUA VÍ DỤ ĐỜI THỰC

### 1. Smart Contract (Hợp đồng thông minh) là gì?
* **Ví von**: **Cây Bán Nước Tự Động**.
  * Ở đời thực, mua hàng qua người bán thì người đó có thể thối thiếu tiền hoặc đưa nhầm đồ.
  * Cây bán nước tự động thì khác: Bạn nhét đúng 10.000đ và bấm nút lon Coca, lò xo xoay và lon Coca rơi xuống. Nếu nhét thiếu tiền, máy nhả tiền lại; nếu nhét thừa, máy thối đúng số dư. Không ai can thiệp được, cứ đúng quy tắc cài sẵn là máy tự chạy.
  * **Smart Contract trong dự án** chính là "cây bán hàng tự động bằng mã nguồn": Người mua đưa tiền -> Hợp đồng tự động chuyển thẻ bài sang ví người mua, đồng thời chia tiền cho người bán và tác giả mà không cần bất kỳ bên trung gian nào đứng giữa.

---

### 2. Ví MetaMask, Địa Chỉ Ví & Private Key là gì?
* **Ví von**: **Chiếc Két Sắt Riêng Biệt** mà chìa khóa duy nhất nằm trong túi bạn.
  * **Địa chỉ ví (Address, ví dụ `0x0730...19F1C`)**: Giống như **Số tài khoản ngân hàng** hoặc số nhà của bạn. Bạn có thể công khai cho bất kỳ ai để họ gửi tiền hay gửi thẻ bài cho bạn.
  * **Private Key (hoặc 12 từ khóa khôi phục)**: Giống như **Chìa khóa mở két sắt** hoặc mã PIN thẻ ATM. Ai giữ chìa này sẽ lấy được toàn bộ tài sản trong két. Trong Web3, **không có nút "Quên mật khẩu"** và không ai cấp lại được nếu bạn làm mất khóa.

---

### 3. Đồng Tiền $RIFT (Chuẩn ERC-20) vs Tiền Tệ Gốc (ETH / TCRO)
* **Ví von**: **Đồng Xèng ở khu vui chơi Timezone / Vincom**.
  * Bạn cầm tiền mặt (ETH hoặc TCRO) đến quầy nạp để đổi lấy một nắm xèng ($RIFT).
  * Bạn dùng xèng $RIFT này để tham gia các hoạt động trong game: bóc gói thẻ bài (Gacha), mua bán thẻ trên chợ.
* **Tại sao game phải tạo đồng $RIFT riêng thay vì dùng thẳng ETH/TCRO?**
  1. **Tránh biến động giá bên ngoài**: Giá đồng ETH ngoài đời tăng giảm từng ngày theo thị trường tài chính. Nếu định giá thẻ bài bằng ETH, hôm nay thẻ giá 100.000đ, ngày mai ETH sốt giá thì thẻ vọt lên 200.000đ, người chơi mới không thể tiếp cận được.
  2. **Tự chủ nền kinh tế game (Tokenomics)**: Đội ngũ phát triển có thể tự do cân đối lạm phát, phát hành phần thưởng giải đấu, điều chỉnh giá thẻ bài ổn định mà không phụ thuộc vào mạng ngoài.

---

### 4. Các Lá Bài Giống Nhau Hoạt Động Ra Sao? (Chuẩn ERC-1155 Semi-Fungible)
*Câu hỏi giảng viên hay hỏi*: *"Nếu có 1,000 lá bài 'Yasuo Lôi Kiếm' phát hành cho 1,000 người, hệ thống phân biệt và quản lý thế nào?"*

* **Ví von**: **Vé Xem Phim Suất Chiếu 19h của rạp CGV** hoặc **1,000 cuốn sách tái bản lần 1**.
  * Cả 1,000 chiếc vé đều có chung một mã phim (ví dụ: `Phim ID = 101`).
  * Tất cả hình ảnh, diễn viên, thời lượng của phim gắn chung vào mã `101` này.
  * Người xem A giữ 2 vé (Số dư Balance = 2), người xem B giữ 1 vé (Balance = 1). Chúng có giá trị sử dụng thay thế cho nhau tương đương (gọi là *Semi-Fungible*).
* **Cơ chế kỹ thuật trong game**:
  * Mỗi chủng loại thẻ bài có một mã số định danh duy nhất: `Token ID` (ví dụ: Token ID 1 là Yasuo, Token ID 2 là Ahri).
  * Tất cả các bản in của Token ID 1 đều dùng chung hình ảnh, tên gọi và chỉ số sức mạnh. Hợp đồng chỉ cần lưu một con số: *Địa chỉ ví X đang giữ bao nhiêu bản in của Token ID 1*.
* **Tại sao dùng ERC-1155 mà không dùng chuẩn cũ ERC-721?**
  * **ERC-721 (Chuẩn cũ)**: Giống như **Tờ Sổ Đỏ Nhà Đất** (độc bản 1-of-1). Nếu muốn mở một gói ra 5 lá bài, hợp đồng phải thực hiện **5 thủ tục công chứng riêng biệt**, tốn 5 lần phí mạng (Gas). Rất đắt và gây nghẽn mạng.
  * **ERC-1155 (Chuẩn hiện đại)**: Cho phép gom cả 5 lá bài nhét chung vào **1 chiếc phong bì chuyển phát nhanh (`mintBatch`)** và gửi đi trong 1 lần duy nhất, giúp **tiết kiệm tới 80% tiền phí Gas**.

---

### 5. Gói Lá Bài (Booster Pack) Cụ Thể Thế Nào? Từ Đâu Ra Và Ai Quản Lý?
*Câu hỏi giảng viên hay hỏi*: *"Các gói thẻ bài từ đâu mà có? Ai quản lý việc tạo ra gói bài và bốc thẻ?"*

* **Gói bài từ đâu mà có?**
  * Gói bài được tạo ra từ hợp đồng thông minh **`RiftBoosterPack.sol`** theo quy chuẩn phát hành ban đầu của dự án.
  * Giống như các bọc thẻ bài Pokemon nguyên seal được nhà máy niêm phong xuất xưởng, các gói bài trong game (Gói Tân Thủ, Gói Chiến Binh, Gói Thần Thoại) được định nghĩa sẵn trong mã nguồn với mức giá niêm yết bằng $RIFT.
* **Cơ chế bốc bài (Gacha RNG) hoạt động ra sao?**
  1. Người chơi trả phí $RIFT (ví dụ: 100 $RIFT) cho hợp đồng `RiftBoosterPack`.
  2. Hợp đồng lập tức kích hoạt thuật toán sinh số ngẫu nhiên on-chain. Con số này được kết hợp từ: Thời gian đóng khối (`block.timestamp`), hạt ngẫu nhiên của chuỗi Ethereum (`block.prevrandao`), và địa chỉ ví người bốc (`msg.sender`).
  3. Dựa trên số ngẫu nhiên, hợp đồng xác định độ hiếm theo tỷ lệ công khai: **70% Thường (Common), 25% Hiếm (Rare), 5% Thần Thoại (Mythic)**.
  4. Hợp đồng gọi hàm `mintBatch` của `RiftCardNFT` để đúc mới các lá bài trúng thưởng và chuyển thẳng vào ví người chơi.
* **Ai quản lý gói bài?**
  * Hợp đồng thông minh quản lý tự động 100% bằng quy tắc toán học bất biến.
  * Nhà phát hành (Admin) chỉ có quyền nạp thêm danh mục ID thẻ bài mới hoặc điều chỉnh giá bán gói, nhưng **tuyệt đối không thể can thiệp tráo bài, gian lận hay giữ bài xịn cho tài khoản quen biết**. Bất kỳ ai cũng có thể đọc code và kiểm chứng tính công bằng.

---

### 6. Phí Sàn (Protocol Fee) Là Gì? Ai Thu Và Dùng Để Làm Gì?
* **Ví von**: **Phí bảo trì và quản lý chợ / Trung tâm thương mại**.
* **Bản chất**:
  * Khi hai người chơi mua bán thành công một lá bài trên sàn, Smart Contract tự động trích ra **2.0% giá trị giao dịch** chuyển về **Ví Kho Bạc (Treasury)** của dự án.
* **Mục đích sử dụng**:
  1. Duy trì chi phí vận hành máy chủ, dịch vụ CDN lưu trữ hình ảnh thẻ bài và kết nối node RPC.
  2. Tạo nguồn quỹ tài trợ giải đấu game định kỳ cho cộng đồng người chơi.
  3. Cung cấp thanh khoản dự phòng cho sàn giao dịch.
* **Tính minh bạch**: Mức phí 2.0% được ghi cứng trong mã nguồn hợp đồng, không một ai có thể tự ý thu thêm hoặc ém nhẹm tiền phí.

---

### 7. Tiền Bản Quyền (Royalty Fee) Chuyển Cho Ai? Họa Sĩ Hay Người Sở Hữu Đầu Tiên?
*Câu hỏi cốt lõi giảng viên kiểm tra kiến thức về chuẩn ERC-2981:*

* **Ví von**: **Tiền tác quyền bài hát của Nhạc sĩ**.
  * Ở ngoài đời truyền thống: Họa sĩ vẽ một bức tranh bán đứt cho người đầu tiên giá 5 triệu. 10 năm sau người đó bán lại cho đại gia giá 5 tỷ, người họa sĩ nghèo vẫn không được thêm một xu nào.
  * Ở chuẩn **ERC-2981** của dự án: Quyền lợi người sáng tạo được bảo vệ trọn đời.
* **Cơ chế chuyển tiền**:
  * Tiền bản quyền (2.5%) được chuyển thẳng về **VÍ CỦA HỌA SĨ / NGƯỜI SÁNG TẠO LÁ BÀI (Creator/Artist)**, **KHÔNG PHẢI** người sở hữu đầu tiên (First Owner).
* **Ví dụ thực tế**:
  1. Họa sĩ Nam vẽ lá bài "Rồng Sấm Sét" và khai báo ví của mình là địa chỉ nhận bản quyền trên hợp đồng.
  2. Người chơi A mở gói bài trúng lá này (A là người sở hữu đầu tiên).
  3. A bán lá bài cho B với giá 100 $RIFT:
     * **A (người bán)** nhận: **95.5 $RIFT** (95.5%).
     * **Sàn** nhận phí duy trì: **2.0 $RIFT** (2.0%).
     * **Họa sĩ Nam (Creator)** nhận tiền tác quyền: **2.5 $RIFT** (2.5%).
  4. Sau này B bán lại cho C với giá 1,000 $RIFT: B nhận 955 $RIFT, còn Họa sĩ Nam tiếp tục nhận thêm 25 $RIFT. Dù lá bài sang tay hàng ngàn lần qua nhiều năm, tác giả luôn nhận được hoa hồng tự động.

---

### 8. Cơ Chế Ký Gửi (Escrow) Trên Sàn: Chống Bùng Kèo Ra Sao?
* **Ví von**: **Giao dịch qua Bác Bảo Vệ công chứng cực kỳ nghiêm khắc**.
  * **Chợ đen truyền thống**: A bảo B "Chuyển khoản trước cho tao 500k rồi tao đưa tài khoản game". B chuyển tiền xong thì A chặn tin nhắn. B mất trắng.
  * **Cơ chế Ký gửi (Escrow) của Riftbound**:
    1. Khi A muốn đăng bán lá bài: A buộc phải đưa thẻ bài cho Smart Contract Sàn (Bác Bảo Vệ) cầm giữ trước. Thẻ bị khóa niêm phong trong tủ ký gửi của sàn.
    2. B muốn mua: B nạp đủ số tiền $RIFT theo giá niêm yết vào Smart Contract.
    3. Ngay trong tích tắc đó, Smart Contract thực hiện động tác **Hoán đổi đồng thời (Atomic Swap)**: Giao thẻ cho B, đồng thời chia tiền cho A, Sàn và Họa sĩ.
    4. Nếu B không đủ tiền: Giao dịch lập tức bị hủy bỏ, thẻ bài vẫn nằm an toàn trong tủ hoặc hoàn trả về cho A. Không một bên nào có thể lừa đảo bên nào.

---

### 9. Chống Tự Mua Thẻ Của Chính Mình (Anti-Wash Trading)
* **Vấn đề gian lận**: Kẻ gian tạo 2 tài khoản, tự bán tự mua một lá bài với giá 1,000,000 $RIFT để tạo cơn sốt ảo, thổi phồng giá trị thẻ bài nhằm lừa người chơi mới mua lại giá cao.
* **Cách dự án ngăn chặn**:
  * Tại Smart Contract sàn giao dịch: Kiểm tra ngay điều kiện tiên quyết:
    `if (listing.seller == msg.sender) revert("Khong the tu mua the cua chinh minh");`
  * Người bán nếu không muốn bán nữa chỉ có một cách duy nhất là bấm nút **"Hủy niêm yết" (Cancel Listing)** để rút thẻ bài về túi đồ, hoàn toàn không thể tự kích hoạt giao dịch mua bán ảo.

---

### 10. Phí Gas (Gas Fee) Là Gì? Ai Nhận Và Tại Sao Phải Có?
* **Ví von**: **Cước phí gửi xe / Phí qua trạm thu phí BOT**.
* **Ai nhận phí gas?**
  * Sàn Riftbound **hoàn toàn không nhận** khoản phí này.
  * Phí gas được trả cho các máy tính đào/xác thực (Validators/Miners) trên toàn cầu để họ tiêu tốn điện năng và phần cứng xác nhận giao dịch của bạn vào khối block.
* **Tại sao bắt buộc phải có phí gas?**
  * **Chống nghẽn mạng và tấn công từ chối dịch vụ (Anti-DoS)**: Nếu việc gửi lệnh lên blockchain hoàn toàn miễn phí, kẻ xấu có thể viết đoạn mã gửi hàng tỷ giao dịch rác trong 1 giây làm sập toàn bộ hệ thống. Bắt buộc trả phí gas giúp ngăn chặn triệt để hành vi phá hoại này.

---

### 11. On-Chain vs Off-Chain: Hình Ảnh Thẻ Bài Nặng Vài Megabyte Lưu Ở Đâu?
*Câu hỏi giảng viên hay hỏi*: *"Toàn bộ hình ảnh thẻ bài có lưu trực tiếp trong Smart Contract không?"*

* **Câu trả lời**: **KHÔNG lưu trực tiếp file ảnh trên chuỗi (On-chain)**.
* **Lý do**:
  * Không gian lưu trữ trên Blockchain rất đắt đỏ. Lưu 1 Megabyte dữ liệu trực tiếp trên mạng Ethereum có thể tốn hàng chục triệu đồng tiền phí gas!
* **Cách giải quyết chuẩn công nghiệp**:
  * **On-Chain (Lưu trên chuỗi)**: Chỉ lưu thông tin nhẹ mang tính pháp lý: Mã thẻ bài (`Token ID`), số lượng sở hữu, lịch sử giao dịch và một đường link mã hóa (`tokenURI`).
  * **Off-Chain (Lưu ngoài chuỗi)**: File ảnh chất lượng cao, hình động 3D, âm thanh và cốt truyện được lưu trên hệ thống lưu trữ phi tập trung **IPFS** hoặc mạng phân phối nội dung **CDN**. Smart contract chỉ cần trỏ đường link tới file ảnh này.

---

### 12. Smart Contract Có Sửa Được Không? Nếu Có Lỗi (Bug) Thì Sao?
* **Bản chất**: Sau khi triển khai lên blockchain, Smart Contract có tính **Bất biến (Immutability)** — không một ai, kể cả lập trình viên viết ra nó, có thể sửa đổi mã nguồn đã chạy trên khối.
* **Nếu phát hiện lỗi logic thì xử lý thế nào?**
  1. **Giải pháp di cư (Migration)**: Triển khai một bản hợp đồng mới đã vá lỗi, sau đó chuyển giao số dư và dữ liệu từ hợp đồng cũ sang hợp đồng mới.
  2. **Giải pháp nâng cấp (Proxy Pattern - ERC-1967)**: Tách hệ thống làm 2 hợp đồng: Hợp đồng chứa dữ liệu (Proxy) và Hợp đồng chứa logic xử lý (Implementation). Khi cần sửa logic, lập trình viên chỉ cần trỏ hợp đồng Proxy sang bản logic mới mà toàn bộ dữ liệu thẻ bài và số dư người chơi vẫn giữ nguyên vẹn.

---

### 13. Phân Biệt Testnet và Mainnet
* **Testnet (Mạng thử nghiệm - ví dụ: Cronos Testnet, Sepolia)**:
  * Là môi trường giả lập dành cho lập trình viên và người dùng chạy thử tính năng.
  * Tiền tệ (TCRO, Sepolia ETH) được cấp miễn phí từ các vòi phát (Faucet) và **không có giá trị quy đổi kinh tế ngoài đời thực**.
* **Mainnet (Mạng chính thức - ví dụ: Ethereum Mainnet, Cronos Mainnet)**:
  * Là môi trường chạy thật nơi tài sản có giá trị tài chính thực tế được giao dịch bằng tiền thật (USD, VND).

---

## 3. BẢNG ĐỐI ĐÁP PHẢN XẠ NHANH 30 GIÂY KHI GIẢNG VIÊN VẤN ĐÁP

| Giảng viên hỏi | Câu trả lời trọng tâm, ngắn gọn và tự tin |
| :--- | :--- |
| **"Tại sao em lại chọn chuẩn ERC-1155 thay vì ERC-721?"** | *"Dạ thưa Thầy/Cô, ERC-721 chỉ phù hợp cho vật phẩm độc bản 1-of-1. Thẻ bài trong game có hàng ngàn bản in giống hệt nhau (Semi-fungible). ERC-1155 gom chung vào 1 hợp đồng duy nhất và cho phép chuyển nhiều thẻ cùng lúc (`mintBatch`), giúp **tiết kiệm tới 80% phí Gas** cho người chơi ạ."* |
| **"Cơ chế ký gửi Escrow trên sàn của em hoạt động thế nào?"** | *"Dạ, người bán phải chuyển thẻ vào Smart Contract Sàn ký gửi trước. Khi người mua nạp tiền, hợp đồng thực hiện **hoán đổi đồng thời (Atomic Swap)**: Tiền sang tay người bán thì thẻ mới sang tay người mua trong cùng một tích tắc. Không ai có cơ hội bùng kèo ạ."* |
| **"Tiền bản quyền tác giả 2.5% được chuyển cho ai?"** | *"Dạ theo chuẩn ERC-2981, tiền bản quyền được chuyển thẳng về **ví của Họa sĩ/Creator sáng tác ra thẻ bài**, chứ không phải người mua đầu tiên. Mỗi khi thẻ bài được bán lại trên thị trường thứ cấp, họa sĩ luôn nhận được 2.5% trọn đời ạ."* |
| **"Gói thẻ bài Booster Pack từ đâu ra và ai quản lý?"** | *"Dạ gói bài do hợp đồng `RiftBoosterPack` phát hành với tỷ lệ rớt đồ minh bạch (70% Thường, 25% Hiếm, 5% Thần Thoại). Khi người chơi mua gói, hợp đồng dùng hàm ngẫu nhiên on-chain bốc thẻ và đúc trực tiếp vào ví người chơi. Nhà phát hành không thể can thiệp tráo bài ạ."* |
| **"Phí sàn 2% dùng để làm gì và ai giữ?"** | *"Dạ phí sàn 2% được tự động trích nộp về ví Quỹ Kho Bạc (Treasury) nhằm chi trả chi phí hạ tầng máy chủ, lưu trữ dữ liệu và tài trợ giải đấu cho cộng đồng người chơi ạ."* |
| **"Nếu website máy chủ SQLite bị sập thì thẻ của người dùng có mất không?"** | *"Dạ hoàn toàn không mất ạ. Backend SQLite chỉ là bộ nhớ đệm hiển thị giao diện cho mượt. Quyền sở hữu thẻ và tiền đều nằm trên sổ cái Blockchain. Kể cả trang web sập vĩnh viễn, người chơi vẫn cắm ví MetaMask vào Remix IDE hoặc Etherscan để lấy lại thẻ bài bình thường ạ."* |
| **"Làm sao em chống việc người bán tự mua bài của mình để thổi giá (Wash Trading)?"** | *"Dạ Smart Contract có dòng kiểm tra điều kiện tiên quyết: nếu địa chỉ người mua trùng với địa chỉ người bán thì giao dịch lập tức bị hủy bỏ (`revert`). Người bán chỉ có thể chọn hủy niêm yết để nhận lại thẻ ạ."* |
| **"Làm thế nào hợp đồng của em chống tấn công Reentrancy?"** | *"Dạ em dùng modifier `nonReentrant` của OpenZeppelin để khóa hàm khi đang chạy, kết hợp tuân thủ mô hình thiết kế **Checks-Effects-Interactions**: kiểm tra điều kiện, trừ số lượng thẻ trước rồi mới thực hiện chuyển tiền ra ngoài ạ."* |
| **"Tại sao hình ảnh thẻ bài không lưu trực tiếp trên Blockchain?"** | *"Dạ vì phí gas lưu trữ trên chuỗi rất đắt (1 MB tốn hàng trăm đến hàng nghìn USD). Do đó chuỗi chỉ lưu mã Token ID và đường dẫn mã hóa `tokenURI`, còn file ảnh gốc được lưu trữ phi tập trung trên mạng IPFS/CDN ạ."* |

---

## 4. KỊCH BẢN 4 BƯỚC DEMO THỰC HÀNH GHI ĐIỂM TUYỆT ĐỐI

1. **Bước 1 (Chứng minh độ chuẩn chỉ mã nguồn)**:
   * Mở terminal gõ: `npx hardhat test` (hoặc `npm test`).
   * Chỉ cho Giảng viên thấy **toàn bộ bài test xanh lá cây PASS 100% trong chưa đầy 1 giây**, bao gồm test Mint thẻ, test Mua bán Escrow, test Chia 3 dòng tiền và test Chống Wash Trading.
2. **Bước 2 (Demo tiền tệ & Faucet an toàn)**:
   * Mở giao diện web trên Production, bấm nút **Nhận 1,000 $RIFT Miễn Phí (Không tốn gas)**.
   * Khoe số dư tăng ngay lập tức lên 1,000 $RIFT mà ví MetaMask không bị trừ bất kỳ 1 xu TCRO phí gas nào.
3. **Bước 3 (Demo mở gói Gacha Booster Pack)**:
   * Vào mục Mở Gói Thẻ Bài, chọn một gói thẻ (ví dụ: Gói Chiến Binh 100 $RIFT).
   * Bấm mở gói, trải nghiệm hiệu ứng lật mở 5 lá bài ngẫu nhiên và giải thích cơ chế tỷ lệ rớt đồ minh bạch của Smart Contract.
4. **Bước 4 (Demo Sàn giao dịch & Chia 3 dòng tiền)**:
   * Lấy lá bài vừa bóc được đăng bán lên Sàn Marketplace với giá 100 $RIFT.
   * Dùng tài khoản ví thứ hai vào mua lá bài.
   * Mở bảng lịch sử giao dịch (Activity Log) để chỉ rõ: Người bán nhận đủ 95.5 $RIFT, Quỹ nhận 2.0 $RIFT và Họa sĩ sáng tác nhận 2.5 $RIFT.
