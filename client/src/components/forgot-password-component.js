import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPasswordComponent = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://mern-project-n.onrender.com/api/user/forgot-password",
        { email }
      );
      setMessage(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data || "發送重置郵件時發生錯誤");
      setMessage("");
    }
  };

  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      <div>
        <h2>忘記密碼</h2>
        <p>請輸入您的電子郵件地址，我們將發送重置密碼的連結給您。</p>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">電子郵件：</label>
            <input
              onChange={handleEmail}
              type="email"
              className="form-control"
              name="email"
              required
            />
          </div>
          <br />
          <button type="submit" className="btn btn-primary">
            發送重置連結
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordComponent;
