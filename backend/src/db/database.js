const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_DIR = path.join(__dirname, '../../data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'riftbound.db');
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Lỗi kết nối SQLite Database:', err.message);
  } else {
    console.log('✅ Đã kết nối SQLite Database thành công tại:', DB_PATH);
  }
});

// Helper Promise wrappers for async/await
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

/**
 * Khởi tạo Schema Database lưu trữ toàn bộ lịch sử giao dịch, niêm yết và số dư
 */
const initDatabase = async () => {
  // 1. Bảng Transactions: Lưu trữ toàn bộ thông tin giao dịch trên sàn & hệ thống
  await run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      user_address TEXT NOT NULL,
      seller_address TEXT,
      card_id INTEGER,
      card_name TEXT,
      quantity INTEGER DEFAULT 1,
      price REAL DEFAULT 0,
      total_price REAL DEFAULT 0,
      protocol_fee REAL DEFAULT 0,
      royalty_fee REAL DEFAULT 0,
      seller_payout REAL DEFAULT 0,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Bảng Listings: Quản lý các lệnh rao bán thẻ trên sàn giao dịch
  await run(`
    CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      listing_id INTEGER UNIQUE,
      card_id INTEGER NOT NULL,
      seller TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price_per_item REAL NOT NULL,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 3. Bảng User Balances: Quản lý số dư $RIFT của từng ví
  await run(`
    CREATE TABLE IF NOT EXISTS user_balances (
      address TEXT PRIMARY KEY,
      balance REAL DEFAULT 1000,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 4. Bảng User Inventory: Quản lý túi đồ thẻ bài của từng ví
  await run(`
    CREATE TABLE IF NOT EXISTS user_inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      address TEXT NOT NULL,
      card_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(address, card_id)
    )
  `);

  // 5. Bảng Pack History: Lưu lịch sử từng lần bóc gói bài ngẫu nhiên
  await run(`
    CREATE TABLE IF NOT EXISTS pack_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_address TEXT NOT NULL,
      pack_id INTEGER NOT NULL,
      pack_name TEXT NOT NULL,
      price REAL NOT NULL,
      card_ids TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ SQLite Schema đã được xác thực & sẵn sàng lưu trữ giao dịch.');
};

module.exports = {
  db,
  run,
  get,
  all,
  initDatabase,
};
