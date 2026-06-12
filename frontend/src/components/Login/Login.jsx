import React, { useState, useEffect } from "react";
import "./Login.css";
import { api } from "../../services/api";
import { useToast } from "../../context/ToastContext";

function Login({ onLogin, onSwitchToSignup }) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  // Check for stored login attempts - CLEAR THEM ON MOUNT
  useEffect(() => {
    try {
      const lastAttempt = parseInt(
        localStorage.getItem("last_login_attempt") || "0",
        10,
      );
      const attempts = parseInt(
        localStorage.getItem("login_attempts") || "0",
        10,
      );

      if (lastAttempt && Date.now() - lastAttempt > 300_000) {
        localStorage.removeItem("login_attempts");
        localStorage.removeItem("last_login_attempt");
      } else if (attempts > 0) {
        setLoginAttempts(attempts);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Rate limiting check (frontend)
    if (loginAttempts >= 5) {
      const lastAttempt = localStorage.getItem("last_login_attempt");
      if (lastAttempt) {
        const timeSinceLastAttempt = Date.now() - parseInt(lastAttempt);
        if (timeSinceLastAttempt < 300000) {
          setError("Too many login attempts. Please try again in 5 minutes.");
          return;
        }
      }
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/api/auth/login", formData, {
        "X-Requested-App": "diner-app",
      });

      const data = await response.json();

      if (response.status === 422 && data.errors) {
        const firstError = Object.values(data.errors)[0]?.[0];
        setError(firstError || "Validation failed");
        incrementLoginAttempts();
        return;
      }

      if (response.status === 429) {
        setError(data.message || "Too many attempts. Please wait.");
        return;
      }

      if (data.error === "wrong_app") {
        showToast(data.message, "warning", 4000);
        setTimeout(() => {
          window.location.href = data.redirect_url;
        }, 1500);
        return;
      }

      if (response.ok && data.user && data.token) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.token_expires_at) {
          localStorage.setItem("token_expires_at", data.token_expires_at);
        }

        if (data.user.user_type !== "diner") {
          showToast(
            "This is the Diner App. Please use the Business App.",
            "warning",
            4000,
          );
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
          localStorage.removeItem("token_expires_at");
          setTimeout(() => {
            window.location.href = "https://eatease-restaurant.vercel.app";
          }, 1500);
          return;
        }

        // Clear login attempts on successful login
        localStorage.removeItem("login_attempts");
        localStorage.removeItem("last_login_attempt");
        setLoginAttempts(0);

        showToast(`Welcome back, ${data.user.name}!`, "success", 3000);
        onLogin(data.user);
      } else {
        setError(data.message || "Invalid email or password");
        incrementLoginAttempts();
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
      incrementLoginAttempts();
    } finally {
      setLoading(false);
    }
  };

  const incrementLoginAttempts = () => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    try {
      localStorage.setItem("login_attempts", String(newAttempts));
      localStorage.setItem("last_login_attempt", String(Date.now()));
    } catch {
      // localStorage unavailable — silently continue
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login">
      <div className="login-container">
        <div className="login-header">
          <h2>Welcome</h2>
          <p className="login-subtitle">Sign in to continue</p>
        </div>

        {loginAttempts >= 3 && loginAttempts < 5 && (
          <div className="security-warning">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 9v4M12 17h.01" />
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            </svg>
            <span>
              Warning: {5 - loginAttempts} login attempts remaining before
              temporary lockout.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="secure-form">
          <div className="login-form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              autoComplete="email"
              className={error && !formData.email ? "input-error" : ""}
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className={error && !formData.password ? "input-error" : ""}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className={loading ? "loading-button" : "login-button"}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            Don't have an account?{" "}
            <button type="button" onClick={onSwitchToSignup}>
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
