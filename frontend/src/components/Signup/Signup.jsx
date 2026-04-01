import React, { useState, useEffect } from "react";
import "./Signup.css";
import { useToast } from "../../context/ToastContext";

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

  // Simple password strength checker
  const checkPasswordStrength = (password) => {
    if (!password) return { score: 0, message: "Very Weak", color: "#ff6b6b" };

    let score = 0;

    // Length check
    if (password.length >= 12) score += 2;
    else if (password.length >= 8) score += 1;

    // Complexity checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[@$!%*#?&]/.test(password)) score += 1;

    // Determine strength
    if (score >= 5) {
      return { score, message: "Strong", color: "#37b24d" };
    } else if (score >= 3) {
      return { score, message: "Good", color: "#51cf66" };
    } else if (score >= 2) {
      return { score, message: "Fair", color: "#fcc419" };
    } else if (score >= 1) {
      return { score, message: "Weak", color: "#ff922b" };
    } else {
      return { score, message: "Very Weak", color: "#ff6b6b" };
    }
  };

  useEffect(() => {
    if (formData.password) {
      const strength = checkPasswordStrength(formData.password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({ score: 0, message: "Very Weak", color: "#ff6b6b" });
    }
  }, [formData.password]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const validateForm = () => {
    // Name validation
    if (formData.name.length < 2) {
      setError("Name must be at least 2 characters");
      return false;
    }
    if (formData.name.length > 50) {
      setError("Name must not exceed 50 characters");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Password validation
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    if (!/(?=.*[a-z])/.test(formData.password)) {
      setError("Password must contain at least one lowercase letter");
      return false;
    }

    if (!/(?=.*[A-Z])/.test(formData.password)) {
      setError("Password must contain at least one uppercase letter");
      return false;
    }

    if (!/(?=.*\d)/.test(formData.password)) {
      setError("Password must contain at least one number");
      return false;
    }

    if (!/(?=.*[@$!%*#?&])/.test(formData.password)) {
      setError(
        "Password must contain at least one special character (@$!%*#?&)",
      );
      return false;
    }

    // Check against common passwords
    const commonPasswords = [
      "password",
      "password123",
      "123456",
      "12345678",
      "qwerty",
      "abc123",
      "letmein",
      "monkey",
      "admin",
      "welcome",
      "test123",
    ];

    if (commonPasswords.includes(formData.password.toLowerCase())) {
      setError(
        "This password is too common. Please choose a stronger password.",
      );
      return false;
    }

    // Password confirmation
    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    // Require at least "Fair" password strength (score 2)
    if (passwordStrength.score < 2) {
      setError("Password is too weak. Please use a stronger password.");
      return;
    }

    setLoading(true);

    try {
      const signupData = {
        ...formData,
        user_type: "diner",
      };

      const response = await fetch(
        "https://eatease-backend.vercel.app/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-App": "diner-app",
          },
          body: JSON.stringify(signupData),
        },
      );

      const data = await response.json();

      if (response.status === 422 && data.errors) {
        const firstError = Object.values(data.errors)[0]?.[0];
        setError(firstError || "Validation failed");
        return;
      }

      if (response.ok && data.user && data.token) {
        if (data.user.user_type !== "diner") {
          showToast(
            "Error: Account was not created as diner. Please contact support.",
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
          `Welcome to EatEase, ${data.user.name}! Your account has been created successfully.`,
          "success",
          4000,
        );

        onSignup(data.user);
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Network error. Please try again.");
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
      <div className="signup-container">
        <div className="signup-header">
          <h2>Create Account</h2>
          <p className="signup-subtitle">Join EatEase today</p>
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
              placeholder="Enter your email"
              required
              autoComplete="email"
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
                <span className="spinner"></span>
                Creating Account...
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
