import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import productService from "../services/product.service";

const EnrollComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  let [searchInput, setSearchInput] = useState("");
  let [searchResult, setSearchResult] = useState(null);

  const handleTakeToLogin = () => {
    navigate("/login");
  };

  const handleChangeInput = (e) => {
    setSearchInput(e.target.value);
  };

  // --- 核心：監聽 searchInput 變化，延遲 500ms 後才搜尋 ---
  useEffect(() => {
    // 如果輸入框是空的，清空結果不送請求
    if (searchInput.trim() === "") {
      setSearchResult(null);
      return;
    }

    const timer = setTimeout(() => {
      productService
        .getProductByName(searchInput)
        .then((data) => {
          setSearchResult(data.data);
        })
        .catch((e) => console.log(e));
    }, 500); // 停止輸入 500ms 後才發請求

    // 清除上一次的 timer，避免還沒到 500ms 又觸發
    return () => clearTimeout(timer);
  }, [searchInput]);
  // -------------------------------------------------------

  const handleEnroll = (e) => {
    productService
      .enroll(e.target.id)
      .then(() => {
        window.alert("產品登記成功,重新導向到產品頁面");
        navigate("/product");
      })
      .catch((e) => console.log(e));
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>您必須先登入才能開始登記產品</p>
          <button className="btn btn-primary btn-lg" onClick={handleTakeToLogin}>
            回到登入頁面
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role === "廠商" && (
        <div>
          <h1>只有買家才能登記產品</h1>
        </div>
      )}
      {currentUser && currentUser.user.role === "買家" && (
        // 搜尋按鈕可以拿掉，或保留都沒關係
        <div className="search input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="輸入產品名稱即時搜尋..."
            onChange={handleChangeInput}
          />
        </div>
      )}
      {currentUser && searchResult && searchResult.length !== 0 && (
        <div>
          <p>找到您想要的產品</p>
          {searchResult.map((product) => {
            return (
              <div key={product._id} className="card" style={{ width: "18rem" }}>
                <div className="card-body">
                  <h5 className="card-title">產品名稱:{product.title}</h5>
                  <p style={{ margin: "0.5rem 0rem" }} className="card-text">
                    {product.description}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>買家人數: {product.buyer.length}</p>
                  <p style={{ margin: "0.5rem 0rem" }}>產品價格: {product.price}</p>
                  <p style={{ margin: "0.5rem 0rem" }}>廠商資訊: {product.manufacturer.username}</p>
                  
                    href="#"
                    id={product._id}
                    className="card-text btn btn-primary"
                    onClick={handleEnroll}
                  >
                    登記產品
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 搜尋過但沒有結果時提示 */}
      {currentUser && searchResult && searchResult.length === 0 && (
        <p>找不到符合的產品</p>
      )}
    </div>
  );
};

export default EnrollComponent;
