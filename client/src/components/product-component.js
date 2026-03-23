import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  const handleEdit = (_id) => {
    // 導向修改頁面，並帶上產品 ID (這需要你另外建立 EditProduct 路由)
    navigate(`/editProduct/${_id}`);
  };

  const handleDelete = (_id) => {
    if (window.confirm("確定要刪除這件商品嗎？")) {
      ProductService.delete(_id)
        .then(() => {
          window.alert("商品已刪除");
          // 重新整理頁面資料
          setProductData(productData.filter((p) => p._id !== _id));
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };


  //買家可以取消產品登記
  const handleUnenroll = (_id) => {
  if (window.confirm("確定要取消登記這件商品嗎？")) {
    ProductService.unenroll(_id)
      .then(() => {
        window.alert("已取消登記");
        setProductData(productData.filter((p) => p._id !== _id));
      })
      .catch((e) => console.log(e));
  }
};


  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>您必須先登入才能看到產品</p>
          <button className="btn btn-primary btn-lg" onClick={handleTakeToLogin}>
            回到登入頁面
          </button>
        </div>
      )}

      {currentUser && (
        <h1>歡迎來到 {currentUser.user.role} 的產品頁面</h1>
      )}

      {currentUser && productData && productData.length !== 0 && (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {productData.map((product) => {
            return (
              <div key={product._id} className="card" style={{ width: "18rem", margin: "1rem" }}>
                <div className="card-body">
                  <h5 className="card-title">產品名稱: {product.title}</h5>
                  <p className="card-text">{product.description}</p>
                  <p>買家人數: {product.buyer.length}</p>
                  <p>產品價格: {product.price}</p>

                  {currentUser.user.role === "廠商" && (
                    <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                      <button 
                        onClick={() => handleEdit(product._id)} 
                        className="btn btn-warning"
                      >
                        修改內容
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id)} 
                        className="btn btn-outline-danger"
                      >
                        刪除商品
                      </button>
                    </div>
                  )}

                {currentUser.user.role === "買家" && (
                  <div style={{ marginTop: "1rem" }}>
                    <button onClick={() => handleUnenroll(product._id)} className="btn btn-outline-danger">
                      取消登記
                    </button>
                  </div>
                )}
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
