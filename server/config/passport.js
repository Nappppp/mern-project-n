let JwtStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require("passport-jwt").ExtractJwt;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models").user;

module.exports = (passport) => {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = process.env.PASSPORT_SECRET;

  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
      try {
        let foundUser = await User.findOne({ _id: jwt_payload._id }).exec();
        if (foundUser) {
          return done(null, foundUser); // req.user <= foundUser
        } else {
          return done(null, false);
        }
      } catch (e) {
        return done(e, false);
      }
    })
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          "https://mern-project-n.onrender.com/api/user/google/redirect",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("進入Google Strategy的區域");
        console.log("Profile:", profile);
        try {
          let foundUser = await User.findOne({ googleID: profile.id }).exec();
          if (foundUser) {
            console.log("使用者已經註冊過了。無須存入資料庫內。");
            done(null, foundUser);
          } else {
            console.log("偵測到新用戶。須將資料存入資料庫內");
            let newUser = new User({
              username: profile.displayName || "Google用戶",
              name: profile.displayName || "未命名用戶",
              googleID: profile.id,
              thumbnail: profile.photos?.[0]?.value || null,
              email: profile.emails?.[0]?.value || null,
              role: "買家",
              password: Math.random().toString(36).slice(-8), // 生成隨機密碼
            });
            let savedUser = await newUser.save();
            console.log("成功創建新用戶。");
            done(null, savedUser);
          }
        } catch (error) {
          console.error("Google Strategy 錯誤：", error);
          done(error, null);
        }
      }
    )
  );
};
