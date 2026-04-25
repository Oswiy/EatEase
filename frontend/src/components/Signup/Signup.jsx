import React, { useState, useEffect } from "react";
import "./Signup.css";
import { useToast } from "../../context/ToastContext";
import { api } from "../../services/api";

function Signup({ onSignup, onSwitchToLogin }) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "Very Weak",
    color: "#ff6b6b",
  });

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    let score = 0;
    let message = "Very Weak";
    let color = "#ff6b6b";

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 1) {
      message = "Very Weak";
      color = "#ff6b6b";
    } else if (score === 2) {
      message = "Weak";
      color = "#ffa94d";
    } else if (score === 3) {
      message = "Fair";
      color = "#ffd43b";
    } else if (score === 4) {
      message = "Good";
      color = "#69db7e";
    } else if (score === 5) {
      message = "Strong";
      color = "#37b24d";
    }

    setPasswordStrength({ score, message, color });
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");

    if (name === "password") {
      calculatePasswordStrength(value);
    }
  };

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Please enter your full name");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!formData.password) {
      setError("Please create a password");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  // Get password requirements
  const getPasswordRequirements = () => {
    const password = formData.password || "";
    return [
      { text: "At least 8 characters", met: password.length >= 8 },
      { text: "One lowercase letter", met: /[a-z]/.test(password) },
      { text: "One uppercase letter", met: /[A-Z]/.test(password) },
      { text: "One number", met: /\d/.test(password) },
      { text: "One special character", met: /[@$!%*#?&]/.test(password) },
    ];
  };

  const requirements = getPasswordRequirements();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    // Require at least "Fair" password strength for business accounts
    if (passwordStrength.score < 3) {
      setError(
        "Password is too weak for business account. Please use a stronger password (Fair, Good, or Strong).",
      );
      return;
    }

    setLoading(true);

    try {
      const signupData = {
        ...formData,
        user_type: "restaurant_owner",
        is_admin: false,
      };

      const response = await api.post("/api/auth/signup", signupData, {
        "X-Requested-App": "restaurant-app",
      });

      const data = await response.json();

      if (response.status === 422 && data.errors) {
        const firstError = Object.values(data.errors)[0]?.[0];
        setError(firstError || "Validation failed");
        return;
      }

      if (response.ok && data.user && data.token) {
        if (data.user.user_type !== "restaurant_owner") {
          showToast(
            "Error: Account was not created as restaurant owner.",
            "error",
            4000,
          );
          return;
        }

        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.token_expires_at) {
          localStorage.setItem("token_expires_at", data.token_expires_at);
        }

        showToast(
          `Welcome to EatEase Business, ${data.user.name}! Your restaurant owner account has been created.`,
          "success",
          4000,
        );

        onSignup(data.user);
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Business signup error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="signup">
      <div className="signup-container">
        <div className="signup-header">
          <h2>Business Account</h2>
          <p className="signup-subtitle">
            Create your restaurant owner account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="secure-signup-form">
          <div className="signup-form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              minLength="2"
              maxLength="50"
              autoComplete="name"
              className={error && !formData.name ? "input-error" : ""}
            />
          </div>

          <div className="signup-form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="business@example.com"
              required
              autoComplete="email"
              className={error && !formData.email ? "input-error" : ""}
            />
          </div>

          <div className="signup-form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
                minLength="8"
                autoComplete="new-password"
                className={error && !formData.password ? "input-error" : ""}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility("password")}
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

            {formData.password && (
              <div className="password-strength-meter">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${passwordStrength.score * 20}%`,
                      backgroundColor: passwordStrength.color,
                    }}
                  ></div>
                </div>
                <div className="strength-info">
                  <span style={{ color: passwordStrength.color }}>
                    Strength: {passwordStrength.message}
                  </span>
                </div>
                <div className="password-requirements-list">
                  {requirements.map((req, index) => (
                    <div
                      key={index}
                      className={`requirement ${req.met ? "met" : "not-met"}`}
                    >
                      {req.met ? "✓" : "○"} {req.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="signup-form-group">
            <label htmlFor="password_confirmation">Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="password_confirmation"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                autoComplete="new-password"
                className={
                  error && formData.password !== formData.password_confirmation
                    ? "input-error"
                    : ""
                }
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility("confirm")}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
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
            {formData.password_confirmation &&
              formData.password !== formData.password_confirmation && (
                <div className="password-match-error">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ marginRight: "4px" }}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Passwords do not match
                </div>
              )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className={loading ? "loading-button" : "signup-button"}
          >
            {loading ? (
              <>
                <span className="login-spinner"></span>
                Creating account...
              </>
            ) : (
              "Create Business Account"
            )}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            Already have a business account?{" "}
            <button type="button" onClick={onSwitchToLogin}>
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
