import React, { useState, useEffect } from "react";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import RestaurantList from "./components/RestaurantList/RestaurantList";
import BookmarksPage from "./components/BookmarksPage/BookmarksPage";
import NotificationsPage from "./components/NotificationsPage/NotificationsPage";
import ReservationsPage from "./components/ReservationsPage/ReservationsPage";
import "./globals.css";
import { useToast } from "./context/ToastContext"; // ✅ Add this import

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [currentPage, setCurrentPage] = useState("restaurantList");
  const { showToast } = useToast(); // ✅ Add this line

  // 🔴 CRITICAL: Redirect business users to Business App
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      // If user is NOT a diner, redirect to Business App
      if (parsedUser.user_type !== "diner") {
        showToast(
          // ✅ Replace alert with toast
          "This is the Diner App. Please use the Business App for restaurant management.",
          "warning",
          4000,
        );

        // Clear local storage
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");

        // Redirect to Business App
        setTimeout(() => {
          window.location.href = "https://eatease-restaurant.vercel.app";
        }, 1500);
        return;
      }

      // If user IS a diner, set the user state
      setUser(parsedUser);
    }

    setLoading(false);
  }, [showToast]);

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("auth_token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        const parsedUser = JSON.parse(storedUser);

        // Double-check: If somehow a business user got here, redirect
        if (parsedUser.user_type !== "diner") {
          handleLogout();
          return;
        }

        setUser(parsedUser);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Handle successful login
  const handleLogin = (userData) => {
    // Verify this is a diner
    if (userData.user_type !== "diner") {
      showToast(
        // ✅ Replace alert with toast
        "This is the Diner App. Please use the Business App for restaurant management.",
        "warning",
        4000,
      );
      setTimeout(() => {
        window.location.href = "https://eatease-restaurant.vercel.app";
      }, 1500);
      return;
    }

    setUser(userData);
    setCurrentPage("restaurantList");
  };

  // Handle successful signup
  const handleSignup = (userData) => {
    // Verify this is a diner (should be from signup)
    if (userData.user_type !== "diner") {
      showToast(
        // ✅ Replace alert with toast
        "Diner App only accepts diner signups. Please use the Business App for business accounts.",
        "warning",
        4000,
      );
      setTimeout(() => {
        window.location.href = "https://eatease-restaurant.vercel.app";
      }, 1500);
      return;
    }

    setUser(userData);
    setCurrentPage("restaurantList");
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setUser(null);
    setCurrentPage("restaurantList");
    showToast("Logged out successfully", "info", 2000); // ✅ Add logout toast
  };

  // Navigation functions
  const handleNavigateToBookmarks = () => {
    setCurrentPage("bookmarks");
  };

  const handleNavigateToNotifications = () => {
    setCurrentPage("notifications");
  };

  const handleNavigateToReservations = () => {
    setCurrentPage("reservations");
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

  // DINER Navigation
  switch (currentPage) {
    case "bookmarks":
      return (
        <div className="app">
          <BookmarksPage
            user={user}
            onBack={handleNavigateBack}
            onLogout={handleLogout}
          />
        </div>
      );

    case "notifications":
      return (
        <div className="app">
          <NotificationsPage
            user={user}
            onBack={handleNavigateBack}
            onLogout={handleLogout}
          />
        </div>
      );

    case "reservations":
      return (
        <div className="app">
          <ReservationsPage
            user={user}
            onBack={handleNavigateBack}
            onLogout={handleLogout}
          />
        </div>
      );

    default: // 'restaurantList'
      return (
        <div className="app">
          <RestaurantList
            user={user}
            onNavigateToBookmarks={handleNavigateToBookmarks}
            onNavigateToNotifications={handleNavigateToNotifications}
            onNavigateToReservations={handleNavigateToReservations}
            onLogout={handleLogout}
          />
        </div>
      );
  }
}

export default App;
