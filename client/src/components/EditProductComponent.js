import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductService from "../services/product.service";

const EditProductComponent = ({ currentUser }) => {
  const { _id } = useParams(); // 取得網址上的 ID
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: 0,
  });

  // 初始化：抓取舊資料
  useEffect(() => {
    ProductService.getById(_id) // 確保你的 Service 有這個方法
      .then((data) => {
        setProduct(data.data);
      })
      .catch((err) => console.log(err));
  }, [_id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    ProductService.patch(_id, product) // 呼叫更新 API
      .then(() => {
        window.alert("更新成功！");
        navigate("/product"); // 回到產品清單
      })
      .catch((err) => console.log(err));
  };

  return (
    <div style={{ padding: "3rem" }}>
      <h2>修改產品資訊</h2>
      <div className="form-group">
        <label>產品名稱：</label>
        <input name="title" className="form-control" value={product.title} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>描述：</label>
        <textarea name="description" className="form-control" value={product.description} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>價格：</label>
        <input name="price" type="number" className="form-control" value={product.price} onChange={handleChange} />
      </div>
      <button className="btn btn-primary" onClick={handleUpdate}>更新產品</button>
    </div>
  );
};

export default EditProductComponent;
