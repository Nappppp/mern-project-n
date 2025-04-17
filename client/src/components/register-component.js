import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; //重新導向
import AuthService from "../services/auth.service";

const RegisterComponent = () => {
  const navigate = useNavigate();
  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [role, setRole] = useState("");
  let [message, setMessage] = useState("");

  const handleuserName = (e) => {
    setUsername(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleRole = (e) => {
    setRole(e.target.value);
  };

  //當點擊註冊按鈕時連接AuthService,只要改變input下面四個state都會改
  //這是async所以後面可以.then
  const handleRegister = (e) => {
    AuthService.register(username, email, password, role)
      .then(() => {
        window.alert("註冊成功！重新導向到登入頁面");
        navigate("/login");
      })
      .catch((e) => {
        console.log("註冊錯誤：", e);
        if (e.response && e.response.data) {
          setMessage(e.response.data);
        } else {
          setMessage("註冊失敗，請檢查您的網路連線或稍後再試");
        }
      });
  };

  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      <div>
        <div>
          {/* 當輸入錯誤顯示錯誤訊息 */}
          {message && <div className="alert alert-danger">{message}</div>}
          <label htmlFor="username">用戶名稱:</label>
          <input
            onChange={handleuserName}
            type="text"
            className="form-control"
            name="username"
          />
        </div>
        <br />
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
            placeholder="長度至少超過6個英文或數字"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">您的身份：</label>
          <input
            onChange={handleRole}
            type="text"
            className="form-control"
            placeholder="只能填入「買家」或是「廠商」這兩個選項其一"
            name="role"
          />
        </div>
        <br />
        <button onClick={handleRegister} className="btn btn-primary">
          <span>註冊會員</span>
        </button>
        <hr></hr>

        <div className="col-md-12 ">
          <h4>買家</h4>
          <a
            className="btn btn-lg btn-google"
            style={{
              padding: "0.2rem 0.5rem",
              backgroundColor: " rgb(7, 7, 7)",
              color: "rgb(255, 255, 255)",
            }}
            href="hhttps://mern-project-n.onrender.com/api/user/google"
          >
            <img src="https://img.icons8.com/color/16/000000/google-logo.png" />
            透過Google登入
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterComponent;
