import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: add token only if required
apiClient.interceptors.request.use(
  (config) => {
    if (config.requiresAuth === false) {
      // Skip adding token
      return config;
    }
    console.log("Adding token to request");
    const access_token = localStorage.getItem("access_token");
    console.log("Token:", access_token);
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API methods
const apiService = {
  getCurrentUser: () => apiClient.get("/auth/users/me/"),
  loginMerchant: (data) =>
    apiClient.post("/auth/merchants/token/", data, { requiresAuth: false }),
  loginUser: (data) =>
    apiClient.post("/auth/users/token/", data, { requiresAuth: false }),
  getPlans: (queryParams) =>
    apiClient.get("/api/plans/", { params: queryParams }),
  getInstallmentPlans: (queryParams) =>
    apiClient.get("/api/installment-plans/", { params: queryParams }),
  createPlan: (data) => apiClient.post("/api/plans/", data),
  payInstallment: (id) => apiClient.post(`/api/installments/${id}/pay/`),
  getUserInstallments: (queryParams) =>
    apiClient.get("/api/users/installments/", { params: queryParams }),
  getMerchantMetrics: () => apiClient.get("/api/merchant/metrics/"),
};

export default apiService;
