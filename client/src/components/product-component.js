import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; //檢查是否有登入
import ProductService from "../services/product.service";

const ProductComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    let _id;
    if (currentUser) {
      _id = currentUser.user._id;
      if (currentUser.user.role === "廠商") {
        ProductService.get(_id)
          .then((data) => {
            setProductData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      } else if (currentUser.user.role === "買家") {
        ProductService.getEnrolledProducts(_id)
          .then((data) => {
            console.log(data);
            setProductData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  }, [currentUser]);

  const handleTakeToLogin = () => {
    navigate("/login");
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>您必須先登入才能看到產品</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          >
            回到登入頁面
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role === "廠商" && (
        <div>
          <h1>歡迎來到廠商的產品頁面</h1>
        </div>
      )}
      {currentUser && currentUser.user.role === "買家" && (
        <div>
          <h1>歡迎來到買家的產品頁面</h1>
        </div>
      )}
      {currentUser && productData && productData.length !== 0 && (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {productData.map((product) => {
            return (
              <div className="card" style={{ width: "18rem", margin: "1rem" }}>
                <div className="card-body">
                  <h5 className="card-title">產品名稱:{product.title}</h5>
                  <p style={{ margin: "0.5rem 0rem" }} className="card-text">
                    {product.description}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    買家人數: {product.buyer.length}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    產品價格: {product.price}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductComponent;
