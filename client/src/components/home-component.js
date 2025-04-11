import React from "react";
import { useNavigate } from "react-router-dom";

const HomeComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleBuyerButtonClick = () => {
    if (currentUser && currentUser.user.role === "廠商") {
      window.alert("請先登入買家帳號");
      return;
    }
    handleNavigate("/product");
  };

  return (
    <main>
      <div className="container py-4">
        <div className="p-5 mb-4 bg-light rounded-3">
          <div className="container-fluid py-5">
            <h1 className="display-5 fw-bold">輔料報價系統</h1>
            <p className="col-md-8 fs-4">
              廠商可在網站上報上最實惠德價格，讓我們的買家可登記購買。
            </p>
            <button
              onClick={() => {
                handleNavigate("/product");
              }}
              className="btn btn-primary btn-lg"
              type="button"
            >
              查看報價
            </button>
          </div>
        </div>

        <div className="row align-items-md-stretch">
          <div className="col-md-6">
            <div className="h-100 p-5 text-white bg-dark rounded-3">
              <h2>買家</h2>
              <p>
                買家可以選擇喜歡的產品。
                <br />
                本網站僅供練習之用，請勿提供任何個人資料，例如信用卡號碼。
              </p>
              <button
                onClick={handleBuyerButtonClick}
                className="btn btn-outline-light"
                type="button"
              >
                登錄會員、或者註冊一個帳號
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <div className="h-100 p-5 bg-light border rounded-3">
              <h2>廠商</h2>
              <p>
                您可以註冊成爲廠商，並開始報價您的商品。
                <br />
                本網站僅供練習之用，請勿提供任何個人資料，例如信用卡號碼。
              </p>
              <button
                onClick={() => {
                  handleNavigate("/postProduct");
                }}
                className="btn btn-outline-secondary"
                type="button"
              >
                提供您的報價
              </button>
            </div>
          </div>
        </div>

        <footer className="pt-3 mt-4 text-muted border-top">
          &copy; 2025 Nap
        </footer>
      </div>
    </main>
  );
};

export default HomeComponent;
