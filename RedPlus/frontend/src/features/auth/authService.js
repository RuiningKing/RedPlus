import axios from "axios";
import jwt_decode from "jwt-decode";

//const API_URL = "/users/";

// Register user
const register = async (userData) => {
  const response = await axios.post("/api/users/register", userData);
  if (response.data) {
    const decoded = jwt_decode(response.data.token);
    const userObj = {
      _id: decoded._id,
      name: decoded.name,
      phone: decoded.phone,
      bloodType: decoded.bloodType,
      role: decoded.role,
      token: response.data.token
    };
    localStorage.setItem("user", JSON.stringify(userObj));
    response.data = userObj;
  }
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post("/api/users/login", userData);
  if (response.data) {
    const decoded = jwt_decode(response.data.token);
    const userObj = {
      _id: decoded._id,
      name: decoded.name,
      phone: decoded.phone,
      bloodType: decoded.bloodType,
      role: decoded.role,
      token: response.data.token
    };
    localStorage.setItem("user", JSON.stringify(userObj));
    response.data = userObj;
  }
  return response.data;
};

// Logout

const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  login,
  logout
};

export default authService;
