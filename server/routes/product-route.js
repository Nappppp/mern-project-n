const router = require("express").Router();
const Product = require("../models").product;
const productValidation = require("../validation").productValidation;

router.use((req, res, next) => {
  console.log("product route正在接受一個request...");
  next();
});

// 獲得系統中的所有產品
router.get("/", async (req, res) => {
  try {
    let productFound = await Product.find({})
      .populate("manufacturer", ["username", "email"])
      .exec();
    return res.send(productFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用廠商id來尋找產品
router.get("/manufacturer/:_manufacturer_id", async (req, res) => {
  let { _manufacturer_id } = req.params;
  try {
    let productsFound = await Product.find({ manufacturer: _manufacturer_id })
      .populate("manufacturer", ["username", "email"])
      .exec();
    return res.send(productsFound);
  } catch (e) {
    console.error("獲取廠商產品錯誤:", e);
    return res.status(500).send(e);
  }
});

// 用買家id來尋找註冊過的產品
router.get("/buyer/:_buyer_id", async (req, res) => {
  let { _buyer_id } = req.params;
  let productsFound = await Product.find({ buyer: _buyer_id })
    .populate("manufacturer", ["username", "email"])
    .exec();
  return res.send(productsFound);
});

// 用產品稱尋找產品
router.get("/findByName/:name", async (req, res) => {
  let { name } = req.params;
  try {
    let productFound = await Product.find({ title: name })
      .populate("manufacturer", ["email", "username"])
      .exec();
    return res.send(productFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用產品id尋找產品
router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let productFound = await Product.findOne({ _id })
      .populate("manufacturer", ["email"])
      .exec();
    return res.send(productFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 新增產品
router.post("/", async (req, res) => {
  // 驗證數據符合規範
  let { error } = productValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.user.isBuyer()) {
    return res
      .status(400)
      .send("只有廠商才能刊登新產品。若你已經是廠商，請透過廠商帳號登入。");
  }

  let { title, description, price } = req.body;
  try {
    let newProduct = new Product({
      title,
      description,
      price,
      manufacturer: req.user._id,
    });
    let savedProduct = await newProduct.save();
    return res.send("新商品已經保存");
  } catch (e) {
    return res.status(500).send("無法創建商品。。。");
  }
});

// 讓買家透過產品id來登記想要的產品
router.post("/enroll/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let product = await Product.findOne({ id }).exec();
    product.buyer.push(req.user._id);
    await product.save();
    return res.send("登記完成");
  } catch (e) {
    return res.send(e);
  }
});

// 更改產品
router.patch("/:_id", async (req, res) => {
  // 驗證數據符合規範
  let { error } = productValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { _id } = req.params;
  // 確認產品存在
  try {
    let productFound = await Product.findOne({ _id });
    if (!productFound) {
      return res.status(400).send("找不到產品。無法更新產品內容。");
    }

    // 使用者必須是此產品廠商，才能編輯產品
    if (productFound.manufacturer.equals(req.user._id)) {
      let updatedProduct = await Product.findOneAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      });
      return res.send({
        message: "產品已經被更新成功",
        updatedProduct,
      });
    } else {
      return res.status(403).send("只有此產品的廠商才能編輯這個產品。");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  // 確認產品存在
  try {
    let productFound = await Product.findOne({ _id }).exec();
    if (!productFound) {
      return res.status(400).send("找不到商品。無法刪除商品。");
    }

    // 使用者必須是此產品廠商，才能刪除產品
    if (productFound.manufacturer.equals(req.user._id)) {
      await Product.deleteOne({ _id }).exec();
      return res.send("商品已被刪除。");
    } else {
      return res.status(403).send("只有此商品的廠商才能刪除商品。");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
