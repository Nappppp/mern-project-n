import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/auth.service";

const LoginComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [message, setMessage] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      let response = await AuthService.login(email, password);
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
        setCurrentUser(response.data);
        window.alert("登入成功。您現在將被重新導向到個人資料頁面。");
        navigate("/profile");
      }
    } catch (e) {
      console.log("登入錯誤：", e);
      if (e.response && e.response.data) {
        setMessage(e.response.data);
      } else {
        setMessage("登入失敗，請檢查您的網路連線或稍後再試");
      }
    }
  };

  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      <div>
        {/* 當輸入錯誤顯示錯誤訊息 */}
        {message && <div className="alert alert-danger">{message}</div>}
        <div className="form-group">
          <label htmlFor="email">電子信箱：</label>
          <input
            onChange={handleEmail}
            type="text"
            className="form-control"
            name="email"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">密碼：</label>
          <input
            onChange={handlePassword}
            type="password"
            className="form-control"
            name="password"
          />
        </div>
        <br />
        <button onClick={handleLogin} className="btn btn-primary">
          <span>登入</span>
        </button>
        <br />
        <br />
        <Link to="/forgot-password">忘記密碼？</Link>
      </div>
    </div>
  );
};

export default LoginComponent;
