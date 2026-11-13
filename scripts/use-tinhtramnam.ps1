# Script chuyển sang tài khoản: tinhtramnam202@gmail.com
git config --local user.name "tinhtramnam202"
git config --local user.email "tinhtramnam202@gmail.com"
Write-Host "✅ Đã chuyển tác giả commit sang: tinhtramnam202 (tinhtramnam202@gmail.com)" -ForegroundColor Green
git config --local --get user.name
git config --local --get user.email
