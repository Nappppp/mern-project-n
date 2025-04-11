import React from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";

const NavComponent = ({ currentUser, setCurrentUser }) => {
  const handleLogout = () => {
    AuthService.logout();
    window.alert("登出成功，您現在會被導向至首頁");
    setCurrentUser(null);
  };

  return (
    <div>
      <nav>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link active" to="/">
                    首頁
                  </Link>
                </li>

                {!currentUser && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/register">
                        註冊會員
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/login">
                        會員登入
                      </Link>
                    </li>
                  </>
                )}

                {currentUser && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/profile">
                        個人頁面
                      </Link>
                    </li>
                    {currentUser.user.role === "廠商" && (
                      <li className="nav-item">
                        <Link className="nav-link" to="/postProduct">
                          發布產品
                        </Link>
                      </li>
                    )}
                    <li className="nav-item">
                      <Link className="nav-link" to="/product">
                        產品頁面
                      </Link>
                    </li>
                    {currentUser && currentUser.user.role === "買家" && (
                      <li className="nav-item">
                        <Link className="nav-link" to="/enroll">
                          登記購買產品
                        </Link>
                      </li>
                    )}
                    <li className="nav-item">
                      <Link className="nav-link" to="/" onClick={handleLogout}>
                        登出系統
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </nav>
    </div>
  );
};

export default NavComponent;
