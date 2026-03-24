import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import productService from "../services/product.service";

const EnrollComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const handleTakeToLogin = () => {
    navigate("/login");
  };

  const handleChangeInput = (e) => {
    setSearchInput(e.target.value);  // 更新 state，觸發下面的 useEffect
  };

  // 監聽 searchInput，停止輸入 500ms 後自動搜尋
  useEffect(() => {
    if (searchInput.trim() === "") {
      setSearchResult(null);
      return;
    }

    const timer = setTimeout(() => {
      productService
        .getProductByName(searchInput)
        .then((data) => setSearchResult(data.data))
        .catch((e) => console.log(e));
    }, 500);

    return () => clearTimeout(timer); // 每次重新輸入就取消上一個 timer
  }, [searchInput]);

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
        <div className="search input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="輸入產品名稱即時搜尋..."
            value={searchInput}
            onChange={handleChangeInput}
          />
          {/* 搜尋按鈕保留，讓使用者也可以手動按 */}
          <button
            onClick={() => productService.getProductByName(searchInput).then(d => setSearchResult(d.data))}
            className="btn btn-primary"
          >
            搜尋產品
          </button>
        </div>
      )}

      {currentUser && searchResult && searchResult.length !== 0 && (
        <div>
          <p>找到您想要的產品</p>
          {searchResult.map((product) => (
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
          ))}
        </div>
      )}

      {currentUser && searchResult && searchResult.length === 0 && (
        <p>找不到符合的產品</p>
      )}
    </div>
  );
};

export default EnrollComponent;
