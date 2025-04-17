const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const productsRoute = require("./routes").product;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");

//db
mongoose
  .connect(process.env.MONGODB_CONNECTION)
  .then(() => {
    console.log("已經連上mongoDB");
  })
  .catch((e) => {
    console.log(e);
  });

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cors());

app.use("/api/user", authRoute);
// product route應該被jwt保護
// 如果request header內部沒有jwt，則request就會被視為是unauthorized
app.use(
  "/api/products",
  passport.authenticate("jwt", { session: false }),
  productsRoute
);

app.listen(8080, () => {
  console.log("後端伺服器正在聆聽port:8080");
});
