import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductService from "../services/product.service";

const PostProductComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [price, setPrice] = useState(0);
  let [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleTakeToLogin = () => {
    navigate("/login");
  };

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleChangeDesciption = (e) => {
    setDescription(e.target.value);
  };

  const handleChangePrice = (e) => {
    setPrice(e.target.value);
  };

  const postProduct = () => {
    ProductService.post(title, description, price)
      .then(() => {
        window.alert("新產品已建立");
        navigate("/product");
      })
      .catch((error) => {
        console.log(error.response);
        setMessage(error.response.data);
      });
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>在發布新產品之前，您必須先登錄。</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          >
            帶我進入登錄頁面。
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role !== "廠商" && (
        <div>
          <p>只有廠商可以發布新產品。</p>
        </div>
      )}
      {currentUser && currentUser.user.role === "廠商" && (
        <div>
          <h2>發布新產品</h2>
          {message && <div className="alert alert-danger">{message}</div>}
          <div className="form-group">
            <label htmlFor="title">產品名稱</label>
            <input
              onChange={handleChangeTitle}
              type="text"
              className="form-control"
              name="title"
            />
          </div>
          <br />
          <div className="form-group">
            <label htmlFor="description">產品描述</label>
            <input
              onChange={handleChangeDesciption}
              type="text"
              className="form-control"
              name="description"
            />
          </div>
          <br />
          <div className="form-group">
            <label htmlFor="price">價格</label>
            <input
              onChange={handleChangePrice}
              type="number"
              className="form-control"
              name="price"
            />
          </div>
          <br />
          <button onClick={postProduct} className="btn btn-primary">
            <span>發布產品</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PostProductComponent;
