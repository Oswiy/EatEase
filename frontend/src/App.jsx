import React, { useState, useEffect } from "react";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import RestaurantOwnerDashboard from "./components/RestaurantOwnerDashboard/RestaurantOwnerDashboard";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import { useToast } from "./context/ToastContext";
import "./globals.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [currentPage, setCurrentPage] = useState("restaurantList");
  const { showToast } = useToast();

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("auth_token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        const parsedUser = JSON.parse(storedUser);

        // CRITICAL: If user is a diner, redirect to Diner App
        if (parsedUser.user_type === "diner") {
          // Only show toast if we have the function and we're in a valid state
          if (showToast) {
            showToast(
              "This is the Business App. Please use the Diner App for customer accounts.",
              "warning",
              4000,
            );
          }
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
          setTimeout(() => {
            window.location.href = "https://eatease-diner.vercel.app";
          }, 1500);
          return;
        }

        setUser(parsedUser);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, [showToast]);

  // Handle successful login
  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage("restaurantList");
    if (showToast) {
      showToast(`Welcome back, ${userData.name}!`, "success", 3000);
    }
  };

  // Handle successful signup
  const handleSignup = (userData) => {
    setUser(userData);
    setCurrentPage("restaurantList");
    if (showToast) {
      showToast(
        `Account created successfully! Welcome, ${userData.name}!`,
        "success",
        3000,
      );
    }
  };

  // Navigation functions
  const handleNavigateToBookmarks = () => {
    setCurrentPage("bookmarks");
  };

  const handleNavigateToNotifications = () => {
    setCurrentPage("notifications");
  };

  const handleNavigateBack = () => {
    setCurrentPage("restaurantList");
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // NOT LOGGED IN - Show Login/Signup
  if (!user) {
    return (
      <div className="app">
        {isLogin ? (
          <Login
            onLogin={handleLogin}
            onSwitchToSignup={() => setIsLogin(false)}
          />
        ) : (
          <Signup
            onSignup={handleSignup}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}
      </div>
    );
  }

  // LOGGED IN - Route based on user type
  if (user.is_admin === true || user.is_admin === 1) {
    return (
      <div className="app">
        <AdminPanel user={user} />
      </div>
    );
  }

  if (user.user_type === "restaurant_owner") {
    return (
      <div className="app">
        <RestaurantOwnerDashboard user={user} />
      </div>
    );
  }

  // Fallback (should not reach here due to check above)
  return (
    <div className="app">
      <RestaurantOwnerDashboard user={user} />
    </div>
  );
}

export default App;
