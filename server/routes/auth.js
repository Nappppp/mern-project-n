const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").user;
const jwt = require("jsonwebtoken");
const passport = require("passport");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

router.use((req, res, next) => {
  console.log("正在接收一個跟auth有關的請求");
  next();
});

router.get("/testAPI", (req, res) => {
  return res.send("成功連結auth route...");
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.post("/register", async (req, res) => {
  //確認數據是否符合規範
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // 確認信箱是否被註冊過
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("此信箱已經被註冊過了。。。");

  // 製作新用戶
  let { email, username, password, role } = req.body;
  let newUser = new User({ email, username, password, role });
  try {
    let savedUser = await newUser.save();
    return res.send({
      msg: "使用者成功儲存。",
      savedUser,
    });
  } catch (e) {
    return res.status(500).send("無法儲存使用者。。。");
  }
});

router.post("/login", async (req, res) => {
  //確認數據是否符合規範
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // 確認信箱是否被註冊過
  const foundUser = await User.findOne({ email: req.body.email });
  if (!foundUser) {
    return res.status(401).send("無法找到使用者。請確認信箱是否正確。");
  }

  foundUser.comparePassword(req.body.password, (err, isMatch) => {
    if (err) return res.status(500).send(err);

    if (isMatch) {
      // 製作json web token
      const tokenObject = { _id: foundUser._id, email: foundUser.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
      return res.send({
        message: "成功登入",
        token: "JWT " + token,
        user: foundUser,
      });
    } else {
      return res.status(401).send("密碼錯誤");
    }
  });
});

router.get(
  "/google/redirect",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    console.log("進入redirect區域");
    // 製作json web token
    const tokenObject = { _id: req.user._id, email: req.user.email };
    const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);

    // 將用戶資料和 token 儲存到 localStorage
    const userData = {
      message: "成功登入",
      token: "JWT " + token,
      user: {
        _id: req.user._id,
        username: req.user.username || req.user.name,
        email: req.user.email,
        role: req.user.role,
        googleID: req.user.googleID,
        thumbnail: req.user.thumbnail,
      },
    };

    // 將用戶資料編碼後作為 URL 參數傳遞
    const encodedData = encodeURIComponent(JSON.stringify(userData));
    return res.redirect(
      `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/profile?data=${encodedData}`
    );
  }
);

// 忘記密碼 - 發送重置郵件
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("找不到該電子郵件地址的用戶");
    }

    // 生成重置 token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1小時後過期

    // 更新用戶資料
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // 創建郵件傳輸器
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // 郵件內容
    const mailOptions = {
      from: `"系統管理員" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "密碼重置請求",
      html: `
        <h2>您請求重置密碼</h2>
        <p>請點擊以下連結重置您的密碼：</p>
        <a href="https://classy-crepe-291cef.netlify.app/reset-password/${resetToken}">重置密碼</a>
        <p>此連結將在1小時後過期</p>
        <p>如果您沒有請求重置密碼，請忽略此郵件。</p>
      `,
    };

    // 發送郵件
    await transporter.sendMail(mailOptions);
    res.send("密碼重置郵件已發送");
  } catch (error) {
    console.error("發送重置郵件時發生錯誤：", error);
    res.status(500).send("發送重置郵件時發生錯誤");
  }
});

// 重置密碼
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send("密碼重置連結無效或已過期");
    }

    // 更新密碼
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.send("密碼已成功重置");
  } catch (error) {
    console.error("重置密碼時發生錯誤：", error);
    res.status(500).send("重置密碼時發生錯誤");
  }
});

module.exports = router;
