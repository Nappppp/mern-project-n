import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "./components/Layout";
import HomeComponent from "./components/home-component";
import RegisterComponent from "./components/register-component";
import LoginComponent from "./components/login-component";
import ProfileComponent from "./components/profile-component";
import PostProductComponent from "./components/postProduct-component";
import ProductComponent from "./components/product-component";
import AuthService from "./services/auth.service";
import EnrollComponent from "./components/enroll-component";
import ForgotPasswordComponent from "./components/forgot-password-component";
import ResetPasswordComponent from "./components/reset-password-component";

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const userData = AuthService.getCurrentUser();
    return userData ? userData.user : null;
  });

  // 處理 Google 登入重定向
  useEffect(() => {
    const handleGoogleLogin = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const data = urlParams.get("data");
      if (data) {
        try {
          const userData = JSON.parse(decodeURIComponent(data));
          if (userData.token && userData.user) {
            localStorage.setItem("user", JSON.stringify(userData));
            setCurrentUser(userData.user);
            // 清除 URL 參數
            window.history.replaceState({}, document.title, "/profile");
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    };

    handleGoogleLogin();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout currentUser={currentUser} setCurrentUser={setCurrentUser} />
          }
        >
          <Route
            index
            element={
              <HomeComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          ></Route>
          <Route path="register" element={<RegisterComponent />}></Route>
          <Route
            path="login"
            element={
              <LoginComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          ></Route>
          <Route
            path="forgot-password"
            element={<ForgotPasswordComponent />}
          ></Route>
          <Route
            path="reset-password/:token"
            element={
              <ResetPasswordComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          ></Route>
          <Route
            path="profile"
            element={
              <ProfileComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          ></Route>
          <Route
            path="postProduct"
            element={
              <PostProductComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          ></Route>
          <Route
            path="enroll"
            element={
              <EnrollComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          ></Route>
          <Route
            path="product"
            element={
              <ProductComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
