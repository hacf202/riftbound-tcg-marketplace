# TÀI LIỆU ÔN TẬP CỐT LÕI: RIFTBOUND TCG MARKETPLACE
> **Phong cách trình bày**: Ngôn ngữ tự nhiên, bình dân, sử dụng các hình ảnh đời thực để bất kỳ ai dù không rành kỹ thuật cũng có thể hiểu thấu đáo bản chất của Blockchain trong vòng 10 phút.

---

## 1. DỰ ÁN NÀY LÀ CÁI GÌ? (GIẢI THÍCH KIỂU "NÓI CHUYỆN ĐỜI THƯỜNG")

Hãy tưởng tượng bạn đang chơi một game thẻ bài ma thuật (như Yu-Gi-Oh! hay Pokemon), nhưng thay vì mua bài giấy ngoài đời:
* **Ở Game truyền thống (Web2 - Hearthstone, FIFA)**: Thẻ bài bạn nạp tiền triệu ra mở được thực chất **chẳng phải của bạn**. Nó nằm trên máy chủ của công ty game. Ngày mai công ty game phá sản, hoặc admin "ngứa mắt" khóa tài khoản bạn, toàn bộ thẻ bài bốc hơi thành con số 0. Muốn bán lại cho người khác thì bị cấm, bán chui trên mạng thì 90% bị lừa đảo quỵt tiền.
* **Ở Dự án Riftbound TCG (Web3)**: Mỗi lá bài được biến thành một món tài sản số (gọi là **NFT**). Nó nằm trong **ví cá nhân (MetaMask)** của chính bạn. Công ty game có sập thì thẻ bài vẫn nằm trong túi bạn mãi mãi. Bạn có thể mang lên chợ bán lấy tiền thật, và hệ thống giao dịch tự động bảo vệ bạn 100%, không một ai có thể bùng tiền hay cướp bài của bạn.

---

## 2. NHỮNG KHÁI NIỆM KỸ THUẬT "KHÓ HIỂU" ĐƯỢC VÍ VON RA SAO?

### 1. Smart Contract (Hợp đồng thông minh) là gì?
* **Ví von**: Nó giống hệt như một **Cây Bán Nước Tự Động**.
  * Ở ngoài đời, bạn muốn mua nước phải có người bán hàng (bên trung gian), người đó có thể thối thiếu tiền hoặc lừa bạn.
  * Cây bán nước tự động thì khác: Bạn nhét đúng 10.000đ và bấm nút, cái lò xo xoay và lon nước ngọt rơi xuống. Nếu nhét thiếu tiền, máy nhả tiền lại. Không ai can thiệp được, không cần tin tưởng ai, cứ đúng quy tắc cài sẵn là máy tự làm.
  * **Smart Contract trong dự án** chính là một "cây bán hàng tự động" viết bằng code: Người mua đưa tiền -> Máy tự nhả thẻ bài và tự chia tiền cho người bán.

---

### 2. Ví MetaMask & Private Key là gì?
* **Ví von**: Giống như **Chiếc Két Sắt Riêng Biệt** mà chìa khóa duy nhất nằm trong túi bạn.
  * Web2 giống như bạn để đồ trong tủ ở phòng trọ: Chủ trọ luôn có chìa khóa sơ cua, họ thích mở lúc nào cũng được, đuổi bạn lúc nào cũng xong.
  * Web3 là bạn tự mua két sắt mang theo người. Chỉ bạn có mật mã (Private Key). Kể cả trang web sàn giao dịch có bị mất điện sập nguồn, thẻ bài trong két của bạn vẫn nguyên vẹn 100%.

---

### 3. Đồng Tiền $RIFT (Chuẩn ERC-20) là gì?
* **Ví von**: Giống như **Đồng Xèng ở khu vui chơi Timezone / Vincom**.
  * Bạn cầm tiền mặt (ETH) đến quầy đổi lấy một nắm xèng ($RIFT).
  * Bạn dùng xèng đó nhét vào máy để chơi trò bóc gói thẻ bài (Gacha), hoặc dùng xèng để mua thẻ bài của những người chơi khác trong sàn.
* **Nút Faucet 1-Click (Vòi nước thử nghiệm)**:
  * Giống như **Quầy phát mẫu thử nước ngọt miễn phí ngoài siêu thị**. Giảng viên chỉ cần bấm 1 cái là nhận ngay 1,000 xèng $RIFT để test game.
  * *Khóa thời gian Cooldown 1 phút*: Giống như bảo vệ quy định "mỗi người chỉ được nhận 1 lon miễn phí, muốn lấy tiếp phải xếp hàng chờ 1 phút sau", tránh việc một người đứng bấm liên tục làm hết sạch xèng của hội trường.

---

### 4. Chuẩn ERC-1155 vs ERC-721: "Tại sao không dùng chuẩn cũ 721?"
*(Đây là câu hỏi "bẫy" mà 90% Giảng viên sẽ hỏi để kiểm tra bạn có hiểu bài không)*

* **Ví von sự khác nhau**:
  * **ERC-721 (Chuẩn cũ)**: Giống như **Bức tranh Mona Lisa** hoặc **Tờ Sổ Đỏ Nhà Đất**. Mỗi vật phẩm là độc nhất vô nhị trên đời.
  * **ERC-1155 (Chuẩn dự án dùng)**: Giống như **Vé Xem Phim Suất Chiếu 19h của rạp CGV**. Rạp in ra 500 cái vé giống hệt nhau, ai cầm vé đó cũng vào xem đúng bộ phim đó (thuật ngữ gọi là *Semi-fungible* - Bán thay thế).
* **Bài toán thực tế trong game bài**:
  * Lá bài "Ahri Chín Đuôi" phát hành cho 1,000 người chơi. Cả 1,000 lá này có sức mạnh, hình ảnh và công dụng y hệt nhau.
  * Nếu dùng ERC-721: Muốn tặng người chơi 5 lá bài khi mở gói, hợp đồng phải làm **5 thủ tục công chứng riêng biệt**, tốn 5 lần tiền phí mạng (Gas). Rất đắt đỏ và nghẽn mạng!
  * Dùng ERC-1155: Gom cả 5 lá bài nhét chung vào **1 chiếc phong bì chuyển phát nhanh (`mintBatch`)** và gửi đi trong 1 lần duy nhất -> **Tiết kiệm đến 80% tiền phí Gas**.

---

### 5. Chuẩn ERC-2981: Tiền Bản Quyền Cho Họa Sĩ Hoạt Động Ra Sao?
* **Ví von**: Chuyện bản quyền bài hát của Nhạc sĩ.
  * Ở đời thực: Họa sĩ vẽ một bức tranh bán đứt cho phòng tranh giá 5 triệu. Sau này phòng tranh bán lại cho đại gia giá 5 tỷ, họa sĩ chỉ biết đứng nhìn mà **không được thêm một xu nào**.
  * Ở dự án này (ERC-2981): Hợp đồng thông minh được cài một điều luật vĩnh viễn: "Cứ mỗi lần thẻ bài này được bán lại trên sàn, máy sẽ **tự động cắt 2.5% giá bán** bắn thẳng vào tài khoản ngân hàng (ví) của người họa sĩ đã vẽ ra nó". Dù lá bài có sang tay qua 10,000 người thì họa sĩ vẫn nhận tiền bản quyền trọn đời.

---

### 6. Cơ Chế Ký Gửi (Escrow) Trên Sàn: Chống Bùng Kèo Như Thế Nào?
* **Ví von**: Bác Bảo Vệ Giữ Đồ Trung Gian cực kỳ khó tính.
  * **Cách mua bán chợ đen truyền thống**: Ông A bảo ông B "Mày chuyển khoản cho tao 500k trước rồi tao gửi mã thẻ game cho". Ông B chuyển tiền xong thì ông A lập tức chặn Facebook. Mất trắng tiền!
  * **Cách Sàn Riftbound vận hành (Escrow)**:
    1. Người bán muốn rao bán thẻ giá 50 $RIFT -> Bắt buộc phải đưa thẻ bài cho **Bác Bảo Vệ (Smart Contract Sàn)** cầm giữ trước. Thẻ bị khóa trong tủ của Sàn.
    2. Người mua bước tới bấm "Mua" -> Bác Bảo Vệ yêu cầu đưa đủ 50 $RIFT.
    3. Ngay khi tiền vừa chạm tay, Bác Bảo Vệ thực hiện động tác **Đổi Chéo Đồng Thời (Atomic Swap)**: Đưa thẻ cho người mua, đồng thời đưa tiền cho người bán.
    4. Nếu người mua không đủ tiền: Tủ không mở, thẻ vẫn trả về cho người bán. Không ai có thể gian lận hay giật đồ của ai!

---

### 7. Công Thức Chia Tiền 3 Dòng Tự Động: 95.5% - 2.0% - 2.5%
Khi người mua trả 100 $RIFT mua một lá bài, Smart Contract tự động xé dòng tiền làm 3 mảnh ngay tại chỗ:
* **95.5 $RIFT (95.5%)** -> Chuyển thẳng về ví **Người Bán** (thực nhận gần như trọn vẹn).
* **2.0 $RIFT (2.0%)** -> Chuyển vào **Quỹ Kho Bạc Sàn (Treasury)** (dùng duy trì máy chủ, tổ chức giải đấu game).
* **2.5 $RIFT (2.5%)** -> Chuyển vào ví **Họa Sĩ Sáng Tạo Thẻ Bài** (tiền bản quyền ERC-2981).
* *Điểm hay*: Toàn bộ diễn ra trong 1 giây, không cần kế toán ngồi cộng sổ hay chuyển khoản tay cuối tháng.

---

### 8. Chống Hack Reentrancy (Tấn Công Tái Nhập) Là Chống Cái Gì?
* **Ví von**: **Tên trộm đứng rút tiền ở Cây ATM trước khi máy kịp trừ tiền trong tài khoản**.
  * Lỗi Reentrancy xảy ra khi cây ATM nhả tiền ra ngoài trước rồi mới ghi sổ tài khoản về 0đ. Tên trộm viết một con bot siêu nhanh: Tiền vừa thò ra mép máy, nó gửi tiếp lệnh "Rút tiền tiếp!" cả ngàn lần trong 1 phần triệu giây khi máy chưa kịp ghi sổ. Thế là cây ATM bị rút cạn sạch tiền!
  * **Cách dự án khắc phục (Quy tắc CEI - Checks-Effects-Interactions)**:
    * Khi người dùng mua hoặc rút thẻ: Sàn sẽ **Gạch sổ trừ số lượng thẻ trước (Effects)** rồi sau đó mới tiến hành chuyển tiền/chuyển thẻ (Interactions).
    * Kèm theo một ổ khóa cửa (`nonReentrant`): Khi một người đang bước vào phòng giao dịch, cửa tự động khóa chốt trong. Người đó phải xong xuôi đi ra thì người khác mới được vào. Triệt tiêu 100% nguy cơ bị hack cạn kho thẻ.

---

### 9. Thuật Toán Bóc Gói Thẻ Bài (Gacha RNG): Có Bị Nhà Game Bịp Không?
* **Ví von**: **Quay Xổ Số Kiến Thiết Trực Tiếp Trên Tivi**.
  * Game Web2: Bạn bấm mở hòm, vòng quay quay tít trên màn hình nhưng thực chất kết quả trúng hay trượt đã được máy chủ bí mật sắp đặt từ trước. Nhà phát hành có thể bí mật chỉnh tỷ lệ rớt đồ xuống 0.0001% mà bạn không hề hay biết.
  * Hợp đồng `RiftBoosterPack.sol`: Con số ngẫu nhiên được nhào nặn từ các nguyên liệu công khai: Giờ giấc đóng block (`timestamp`), hạt xúc xắc ngẫu nhiên của toàn mạng Ethereum (`prevrandao`) và địa chỉ ví của bạn. Tỷ lệ 70% bài Thường, 25% bài Hiếm, 5% Sử Thi được viết thẳng vào code. Bất kỳ ai cũng có thể mở code ra soi, minh bạch tuyệt đối!

---

## 3. BẢNG PHẢN XẠ NHANH 30 GIÂY KHI GIẢNG VIÊN VẤN ĐÁP

| Giảng viên hỏi | Bạn trả lời ngắn gọn, tự tin thế này: |
| :--- | :--- |
| **"Tại sao em lại chọn chuẩn ERC-1155 mà không dùng ERC-721?"** | *"Dạ thưa Thầy, ERC-721 chỉ hợp với tranh độc bản 1-of-1. Thẻ bài game có hàng ngàn bản in giống nhau (Semi-fungible). ERC-1155 gom chung vào 1 contract và cho phép gửi nhiều thẻ cùng lúc (`mintBatch`), giúp **tiết kiệm tới 80% tiền phí Gas** cho người chơi ạ."* |
| **"Cơ chế Escrow của bên em hoạt động ra sao?"** | *"Dạ, người bán phải nộp thẻ vào Smart Contract ký gửi trước. Khi người mua trả tiền, hợp đồng thực hiện **hoán đổi nguyên tử (Atomic Swap)**: Tiền sang tay người bán thì thẻ mới sang tay người mua trong cùng 1 tích tắc. Không bên nào có cơ hội lừa đảo bên nào ạ."* |
| **"Nếu máy chủ Backend SQLite bị sập thì thẻ của người dùng có mất không?"** | *"Dạ hoàn toàn không mất ạ. Backend SQLite chỉ là bộ nhớ tạm để hiển thị web cho mượt. Quyền sở hữu thẻ và tiền đều nằm vĩnh viễn trên sổ cái Blockchain. Kể cả website sập hoàn toàn, người chơi vẫn cắm ví MetaMask vào Remix IDE để lấy lại thẻ bài bình thường ạ."* |
| **"Bản quyền tác giả ERC-2981 được chia thế nào?"** | *"Dạ, mỗi khi thẻ bài được bán lại trên thị trường, hợp đồng sàn tự động trích đúng 2.5% giá trị giao dịch chuyển thẳng về ví tác giả. Việc này diễn ra tự động on-chain, không cần thông qua ban quản trị duyệt chi ạ."* |
| **"Hợp đồng của em bảo vệ chống tấn công Reentrancy thế nào?"** | *"Dạ, em dùng modifier `nonReentrant` của OpenZeppelin để khóa hàm khi đang chạy, đồng thời tuân thủ mẫu thiết kế **Checks-Effects-Interactions**: kiểm tra điều kiện, cập nhật trừ số lượng thẻ trước rồi mới thực hiện chuyển tiền ra ngoài ạ."* |

---

## 4. KỊCH BẢN 4 BƯỚC BIỂU DIỄN THỰC HÀNH ĂN TRỌN ĐIỂM

1. **Bước 1 (Show uy tín kỹ thuật)**: Bật terminal gõ `npm test`. Khoe ngay **9 bài test xanh lá cây PASS 100% trong chưa đầy 1 giây** chứng minh hợp đồng không có lỗi logic.
2. **Bước 2 (Demo tiền tệ)**: Vào web bấm **Faucet 1-Click** nhận 1,000 $RIFT. Bấm tiếp lần nữa để khoe dòng thông báo "Chặn spam Cooldown 1 phút" thể hiện tính bảo mật.
3. **Bước 3 (Demo mở gói Gacha)**: Vào mục mở gói, chọn gói 100 $RIFT, ký ví MetaMask và trải nghiệm hiệu ứng lật thẻ bài 3D sống động.
4. **Bước 4 (Demo sàn Escrow)**: Đăng bán lá bài vừa bóc được lên chợ. Lấy tài khoản thứ hai vào mua, sau đó mở kiểm tra lịch sử dòng tiền: Người bán nhận 95.5%, Quỹ nhận 2% và Tác giả nhận 2.5%.
