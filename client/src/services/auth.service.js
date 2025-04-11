import axios from "axios";
const API_URL = "https://mern-project-n.onrender.com/api/user";

//使用class就像「服務中心」的概念，AuthService 負責所有「認證」功能。
class AuthService {
  login(email, password) {
    return axios.post(API_URL + "/login", {
      email,
      password,
    });
  }
  logout() {
    localStorage.removeItem("user"); //刪除LocalStorage就會登出
  }
  //使用axios,當使用到AuthService時axios就會return一個promise,以下為post到之前apiRUL製作出的route
  //post資料要放在最後一個逗號
  register(username, email, password, role) {
    return axios.post(API_URL + "/register", {
      username,
      email,
      password,
      role,
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;
