import axios from "axios";
import { sanitizeRequestData } from "../utils/inputSanitizers";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5100/api"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  if (
    req.data &&
    !(typeof FormData !== "undefined" && req.data instanceof FormData)
  ) {
    req.data = sanitizeRequestData(req.data);
  }

  return req;
});

export default API;
