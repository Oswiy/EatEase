import React, { useState, useEffect } from "react";
import "./Signup.css";
import { useToast } from "../../context/ToastContext"; // ✅ Add this import

function Signup({ onSignup, onSwitchToLogin }) {
  const { showToast } = useToast(); // ✅ Add this
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

  // ... (keep all existing validation functions unchanged) ...

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    // Require at least "Fair" password strength
    if (passwordStrength.score < 2) {
      setError(
        "Password is too weak for business account. Please use a stronger password.",
      );
      return;
    }

    setLoading(true);

    try {
      // Business App signup: Force restaurant_owner
      const signupData = {
        ...formData,
        user_type: "restaurant_owner",
        is_admin: false,
      };

      const response = await fetch(
        "https://eatease-backend.vercel.app/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-App": "restaurant-app",
          },
          body: JSON.stringify(signupData),
        },
      );

      const data = await response.json();

      // Handle validation errors
      if (response.status === 422 && data.errors) {
        const firstError = Object.values(data.errors)[0]?.[0];
        setError(firstError || "Validation failed");
        return;
      }

      // Handle successful signup
      if (response.ok && data.user && data.token) {
        if (data.user.user_type !== "restaurant_owner") {
          showToast(
            "Error: Account was not created as restaurant owner.",
            "error",
            4000,
          ); // ✅ Replace alert with toast
          return;
        }

        // Store auth data
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
      setError("Network error. Please try again.");
      console.error("Business signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

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

  return (
    <div className="signup">
      <div className="signup-container business-signup">
        <div className="signup-header">
          <h2>Sign Up</h2>
        </div>

        <form onSubmit={handleSubmit} className="secure-signup-form">
          <div className="form-group">
            <label htmlFor="business-name">Name</label>
            <input
              type="text"
              id="business-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              minLength="2"
              maxLength="50"
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="business-email">Email</label>
            <input
              type="email"
              id="business-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="business-password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="business-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                required
                minLength="8"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility("password")}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#666666"
                    viewBox="0 0 256 256"
                  >
                    <path d="M228,175a8,8,0,0,1-10.92-3l-19-33.2A123.23,123.23,0,0,1,162,155.46l5.87,35.22a8,8,0,0,1-6.58,9.21A8.4,8.4,0,0,1,160,200a8,8,0,0,1-7.88-6.69l-5.77-34.58a133.06,133.06,0,0,1-36.68,0l-5.77,34.58A8,8,0,0,1,96,200a8.4,8.4,0,0,1-1.32-.11,8,8,0,0,1-6.58-9.21L94,155.46a123.23,123.23,0,0,1-36.06-16.69L39,172A8,8,0,1,1,25.06,164l20-35a153.47,153.47,0,0,1-19.3-20A8,8,0,1,1,38.22,99c16.6,20.54,45.64,45,89.78,45s73.18-24.49,89.78-45A8,8,0,1,1,230.22,109a153.47,153.47,0,0,1-19.3,20l20,35A8,8,0,0,1,228,175Z"></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#666666"
                    viewBox="0 0 256 256"
                  >
                    <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path>
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

          <div className="form-group">
            <label htmlFor="confirm-business-password">Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-business-password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                placeholder="Confirm password"
                required
                autoComplete="new-password"
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
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#666666"
                    viewBox="0 0 256 256"
                  >
                    <path d="M228,175a8,8,0,0,1-10.92-3l-19-33.2A123.23,123.23,0,0,1,162,155.46l5.87,35.22a8,8,0,0,1-6.58,9.21A8.4,8.4,0,0,1,160,200a8,8,0,0,1-7.88-6.69l-5.77-34.58a133.06,133.06,0,0,1-36.68,0l-5.77,34.58A8,8,0,0,1,96,200a8.4,8.4,0,0,1-1.32-.11,8,8,0,0,1-6.58-9.21L94,155.46a123.23,123.23,0,0,1-36.06-16.69L39,172A8,8,0,1,1,25.06,164l20-35a153.47,153.47,0,0,1-19.3-20A8,8,0,1,1,38.22,99c16.6,20.54,45.64,45,89.78,45s73.18-24.49,89.78-45A8,8,0,1,1,230.22,109a153.47,153.47,0,0,1-19.3,20l20,35A8,8,0,0,1,228,175Z"></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#666666"
                    viewBox="0 0 256 256"
                  >
                    <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path>
                  </svg>
                )}
              </button>
            </div>
            {formData.password_confirmation &&
              formData.password !== formData.password_confirmation && (
                <div className="password-match-error">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    fill="#ff6b6b"
                    viewBox="0 0 256 256"
                    style={{ marginRight: "4px" }}
                  >
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                  </svg>
                  Passwords do not match
                </div>
              )}
          </div>

          {error && (
            <div className="error-message security-error">
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={
              loading ? "loading-button" : "secure-button business-button"
            }
          >
            {loading ? (
              <>
                <span className="signup-spinner"></span>
                <span>Creating account...</span>
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            Already have an account?{" "}
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
