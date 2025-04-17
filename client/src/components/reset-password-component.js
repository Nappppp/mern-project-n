import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const ResetPasswordComponent = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("兩次輸入的密碼不一致");
      return;
    }

    try {
      console.log("發送重置密碼請求，token:", token);
      console.log("API URL:", `${API_URL}/api/auth/reset-password/${token}`);
      const response = await axios.post(
        `${API_URL}/api/user/reset-password/${token}`,
        { password }
      );
      console.log("重置密碼響應:", response.data);
      setMessage(response.data);
      setError("");
      // 3秒後跳轉到登入頁面
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("重置密碼錯誤:", err.response?.data || err);
      setError(err.response?.data || "重置密碼時發生錯誤");
      setMessage("");
    }
  };

  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      <div>
        <h2>重置密碼</h2>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">新密碼：</label>
            <input
              onChange={handlePassword}
              type="password"
              className="form-control"
              name="password"
              required
            />
          </div>
          <br />
          <div className="form-group">
            <label htmlFor="confirmPassword">確認新密碼：</label>
            <input
              onChange={handleConfirmPassword}
              type="password"
              className="form-control"
              name="confirmPassword"
              required
            />
          </div>
          <br />
          <button type="submit" className="btn btn-primary">
            重置密碼
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordComponent;
