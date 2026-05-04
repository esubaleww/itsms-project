import axios from "axios";

const getToken = () => {
  try {
    const stored = localStorage.getItem("auth-storage");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state?.token || null;
    }
  } catch (error) {
    console.error("Failed to get token:", error);
  }
  return null;
};

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth-storage");
    }

    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred";

    return Promise.reject(new Error(errorMessage));
  },
);

export default API;
