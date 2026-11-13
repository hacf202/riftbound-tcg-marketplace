# QUY TRÌNH LÀM VIỆC GIT 2 TÀI KHOẢN & 2 NHÁNH RIÊNG BIỆT

Tài liệu này ghi nhớ quy chuẩn vận hành Git cho dự án khi phát triển song song với 2 tài khoản GitHub trên cùng một máy tính.

---

## 1. Thông Tin Định Tuyến & Xác Thực 2 Tài Khoản

| Thông tin | Tài Khoản 1 (Dreamer) | Tài Khoản 2 (TinhTramNam) |
| :--- | :--- | :--- |
| **Email** | `dreamernam2106@gmail.com` | `tinhtramnam202@gmail.com` |
| **GitHub Username** | `LeHoangNam216` | `<username-acc2>` (vd: `hacf202`) |
| **SSH Host Alias** | `github-dreamer` | `github-tinhtramnam` |
| **SSH Key Private** | `~/.ssh/id_ed25519_dreamer` | `~/.ssh/id_ed25519_tinhtramnam` |
| **Quy ước Nhánh** | `feat/dreamer` (hoặc nhánh riêng của Nam) | `main` / `feat/tinhtramnam` |

---

## 2. Quy Trình Làm Việc Trên 2 Nhánh Riêng

### 🔹 Khi làm việc trên nhánh của Tài khoản 1 (`LeHoangNam216`):
1. **Chuyển tác giả và sang nhánh riêng:**
   ```bash
   git config --local user.name "LeHoangNam216"
   git config --local user.email "dreamernam2106@gmail.com"
   git checkout -b feat/dreamer   # (nếu chưa có nhánh) hoặc: git checkout feat/dreamer
   ```
2. **Push code lên đúng nhánh riêng qua SSH Host `github-dreamer`:**
   ```bash
   git push git@github-dreamer:LeHoangNam216/riftbound-tcg-marketplace.git feat/dreamer
   ```

---

### 🔹 Khi làm việc trên nhánh của Tài khoản 2 (`tinhtramnam202`):
1. **Chuyển tác giả và sang nhánh riêng:**
   ```bash
   git config --local user.name "tinhtramnam202"
   git config --local user.email "tinhtramnam202@gmail.com"
   git checkout main   # hoặc nhánh riêng của tài khoản 2
   ```
2. **Push code lên đúng nhánh riêng qua SSH Host `github-tinhtramnam`:**
   ```bash
   git push git@github-tinhtramnam:<username-acc2>/riftbound-tcg-marketplace.git main
   ```

---

## 3. Nguyên Tắc Cốt Lõi Khi AI Hỗ Trợ
- Luôn kiểm tra nhánh hiện tại (`git branch --show-current`) trước khi commit và push.
- Đảm bảo `user.email` và `user.name` tương thích chính xác với tài khoản sở hữu nhánh đó.
- Tuyệt đối không push đè chéo sang nhánh của tài khoản còn lại trừ khi có yêu cầu merge cụ thể từ người dùng.
