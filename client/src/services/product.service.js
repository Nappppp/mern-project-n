import axios from "axios";
const API_URL = "https://mern-project-n.onrender.com/api/products";

class ProductService {
  // 把取 token 的邏輯抽出來，避免重複
  // 有可能有token有可能沒有
  getToken() {
    if (localStorage.getItem("user")) {
      return JSON.parse(localStorage.getItem("user")).token;
    }
    return "";
  }

  getHeaders() {
    return { Authorization: this.getToken() };
  }

  post(title, description, price) {
    return axios.post(
      API_URL,
      { title, description, price },
      { headers: this.getHeaders() }
    );
  }

  // 使用廠商 id，來找到廠商擁有的產品
  get(_id) {
    return axios.get(API_URL + "/manufacturer/" + _id, {
      headers: this.getHeaders(),
    });
  }

  // 使用買家id，找到買家註冊的產品
  getEnrolledProducts(_id) {
    return axios.get(API_URL + "/buyer/" + _id, {
      headers: this.getHeaders(),
    });
  }

  getProductByName(name) {
    return axios.get(API_URL + "/findByName/" + name, {
      headers: this.getHeaders(),
    });
  }

  // 用產品 ID 取得單一產品（EditProductComponent 需要）
  getById(_id) {
    return axios.get(API_URL + "/" + _id, {
      headers: this.getHeaders(),
    });
  }
 // 搜尋全部 
  getAll() {
    return axios.get(API_URL, {
      headers: this.getHeaders(),
    });
  }

  enroll(_id) {
    return axios.post(API_URL + "/enroll/" + _id, {}, {
      headers: this.getHeaders(),
    });
  }
  
  //取消登記產品
  unenroll(_id) {
    return axios.post(API_URL + "/unenroll/" + _id, {}, {
      headers: this.getHeaders(),
    });
  }

  // 更新產品（EditProductComponent 需要）
  patch(_id, productData) {
    return axios.patch(API_URL + "/" + _id, productData, {
      headers: this.getHeaders(),
    });
  }

  //刪除產品（ProductComponent 需要）
  delete(_id) {
    return axios.delete(API_URL + "/" + _id, {
      headers: this.getHeaders(),
    });
  }
}

const productServiceInstance = new ProductService();
export default productServiceInstance;
