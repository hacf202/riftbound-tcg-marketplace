const express = require("express");
const cors = require("cors");
require("dotenv").config();

const cardsRoute = require("./routes/cards");
const marketplaceRoute = require("./routes/marketplace");
const packsRoute = require("./routes/packs");
const usersRoute = require("./routes/users");
const systemRoute = require("./routes/system");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger for debugging & evaluation
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// RESTful API V1 Routes
app.use("/api/v1/cards", cardsRoute);
app.use("/api/v1/marketplace", marketplaceRoute);
app.use("/api/v1/packs", packsRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/system", systemRoute);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Chào mừng đến với Riftbound TCG Backend RESTful API Gateway",
    documentation: "/api/v1/system/health",
    endpoints: [
      "/api/v1/cards",
      "/api/v1/cards/:id",
      "/api/v1/cards/metadata/:id.json",
      "/api/v1/marketplace/listings",
      "/api/v1/marketplace/stats",
      "/api/v1/packs",
      "/api/v1/users/:address/inventory",
      "/api/v1/system/contracts",
    ],
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Không tìm thấy tài nguyên: ${req.method} ${req.originalUrl}`,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Lỗi hệ thống nội bộ (Internal Server Error)",
    error: process.env.NODE_ENV === "production" ? undefined : err.message,
  });
});

app.listen(PORT, () => {
  console.log("==================================================");
  console.log(`🚀 Riftbound RESTful API Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`📦 Healthcheck: http://localhost:${PORT}/api/v1/system/health`);
  console.log(`🎴 Cards API: http://localhost:${PORT}/api/v1/cards`);
  console.log(`🛒 Marketplace API: http://localhost:${PORT}/api/v1/marketplace/listings`);
  console.log("==================================================");
});
