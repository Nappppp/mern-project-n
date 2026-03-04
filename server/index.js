const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes").auth;
const productsRoute = require("./routes").product;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");

dotenv.config();

const port = process.env.PORT || 8080;

// 抽成獨立的連線函式
const connectDB = async () => {
  try {
    console.log("正在嘗試連線 MongoDB...");
    console.log("連線字串:", process.env.MONGODB_CONNECTION ? "已設定" : "=== 沒設定 MONGODB_CONNECTION !!! ===");

    await mongoose.connect(process.env.MONGODB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,   // 縮短等待時間，debug 更快
      socketTimeoutMS: 45000,
    });

    console.log("MongoDB 連線成功！資料庫名稱：", mongoose.connection.db.databaseName);
  } catch (err) {
    console.error("MongoDB 連線失敗：", err.name, err.message);
    console.error(err.stack);
    process.exit(1);  // 連不上就讓整個 process 結束，Render 會自動重啟
  }
};

// 主啟動流程（使用 IIFE 讓它能 await）
(async () => {
  await connectDB();  // 先確保 DB 連上

  // middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(passport.initialize());
  app.use(cors());

  app.use("/api/user", authRoute);
  app.use(
    "/api/products",
    passport.authenticate("jwt", { session: false }),
    productsRoute
  );

  app.listen(port, () => {
    console.log(`後端伺服器正在聆聽 port ${port}`);
  });
})();
