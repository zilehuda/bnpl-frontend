import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import apiService from "./services/apiService";

import MerchantLogin from "./pages/MerchantLogin";
import UserLogin from "./pages/UserLogin";
import MerchantDashboard from "./pages/MerchantDashboard";
import UserDashboard from "./pages/UserDashboard";
import Home from "./pages/Home";

const ProtectedRoute = ({ children, isMerchantRoute }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = localStorage.getItem("access_token");

  // Redirect to login if access_token is missing
  if (!accessToken) {
    return (
      <Navigate to={isMerchantRoute ? "/merchant/login" : "/user/login"} />
    );
  }

  if (!user) {
    return (
      <Navigate to={isMerchantRoute ? "/merchant/login" : "/user/login"} />
    );
  }

  if (isMerchantRoute && !user.is_merchant) {
    return <Navigate to="/user/dashboard" />;
  }

  if (!isMerchantRoute && user.is_merchant) {
    return <Navigate to="/merchant/dashboard" />;
  }

  return children;
};

const AppRoutes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!localStorage.getItem("access_token")) {
        return;
      }
      try {
        const response = await apiService.getCurrentUser();
        const user = response?.data?.data?.user;
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }
      } catch (error) {
        console.error("Failed to fetch current user");
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  return (
    <Routes>
      <Route path="/merchant/login" element={<MerchantLogin />} />
      <Route
        path="/merchant/dashboard"
        element={
          <ProtectedRoute isMerchantRoute={true}>
            <MerchantDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute isMerchantRoute={false}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/" element={<Home />} />
      {/* Catch-all route for unknown URLs */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;
