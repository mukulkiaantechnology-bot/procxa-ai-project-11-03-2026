import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import endpoints from "../api/endPoints";

const Login = () => {
  const navigate = useNavigate();
  const { post } = useApi();

  const [showSignUp, setShowSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    first_name: "",
    last_name: "",
    email_id: "",
    phone_no: "",
    gender: "",
    city: "",
    state: "",
    country: "",
    userType: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  /* ================= HELPERS ================= */
  const handleInputChange = (e, setData, data) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const toggleForm = () => {
    setShowSignUp(!showSignUp);
    setMessage({ type: "", text: "" });
  };

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await post(endpoints.login, {
        email: loginData.email.trim(),
        password: loginData.password,
      });

      if (response?.status) {
        const data = response.data || response;

        if (data.access_token)
          localStorage.setItem("authToken", data.access_token);
        if (data.refresh_token)
          localStorage.setItem("refresh_token", data.refresh_token);
        if (data.userType)
          localStorage.setItem("userType", data.userType);
        if (data.permissions)
          localStorage.setItem(
            "permissions",
            JSON.stringify(data.permissions)
          );
        if (data.userId || data.id)
          localStorage.setItem("userId", data.userId || data.id);
        // Store licenseAssigned flag for frontend routing logic
        if (data.licenseAssigned !== undefined)
          localStorage.setItem("licenseAssigned", data.licenseAssigned.toString());

        setMessage({
          type: "success",
          text: "Login successful! Redirecting...",
        });

        setTimeout(() => navigate("/dashboard"), 800);
      } else {
        setMessage({
          type: "error",
          text: response?.message || "Invalid credentials",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          error.message ||
          "Login failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= SIGNUP ================= */
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (signUpData.password !== signUpData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (signUpData.password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        first_name: signUpData.first_name,
        last_name: signUpData.last_name,
        email_id: signUpData.email_id.trim(),
        phone_no: signUpData.phone_no,
        gender: signUpData.gender,
        city: signUpData.city,
        state: signUpData.state,
        country: signUpData.country,
        userType: signUpData.userType || "user",
        password: signUpData.password,
      };

      const response = await post(endpoints.registration, payload);

      if (response?.status) {
        setMessage({
          type: "success",
          text: "Sign-up successful! Please login.",
        });

        setTimeout(() => toggleForm(), 1500);
      } else {
        setMessage({
          type: "error",
          text: response?.message || "Registration failed",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          error.message ||
          "Sign-up failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <div className="login-container">
        <h1 className="fw-bold" style={{ color: "#578e7e" }}>
          ProXaAI
        </h1>
        <p className="text-start text-secondary mb-4">
          {showSignUp ? "Create Account" : "Login"}
        </p>

        {message.text && (
          <div
            className={`alert ${message.type === "success"
              ? "alert-success"
              : "alert-danger"
              }`}
          >
            {message.text}
          </div>
        )}

        {!showSignUp ? (
          /* ========== LOGIN FORM ========== */
          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              className="form-control p-3 mb-3"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) =>
                handleInputChange(e, setLoginData, loginData)
              }
              required
            />

            <input
              type="password"
              name="password"
              className="form-control p-3 mb-4"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                handleInputChange(e, setLoginData, loginData)
              }
              required
            />

            <div className="d-flex flex-column gap-3">
              <button
                type="submit"
                className="btn w-100"
                style={{
                  backgroundColor: "#578e7e",
                  color: "white",
                }}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-sm border flex-fill"
                  style={{ color: "#578e7e", borderColor: "#578e7e" }}
                  onClick={() => setLoginData({ email: "superadmin@procxa.com", password: "SuperAdmin@123" })}
                >
                  Superadmin Login
                </button>
                <button
                  type="button"
                  className="btn btn-sm border flex-fill"
                  style={{ color: "#578e7e", borderColor: "#578e7e" }}
                  onClick={() => setLoginData({ email: "abc@gmail.com", password: "123456" })}
                >
                  Admin Login
                </button>
                <button
                  type="button"
                  className="btn btn-sm border flex-fill"
                  style={{ color: "#578e7e", borderColor: "#578e7e" }}
                  onClick={() => setLoginData({ email: "it@gmail.com", password: "123456" })}
                >
                  It dept Login
                </button>
                <button
                  type="button"
                  className="btn btn-sm border flex-fill"
                  style={{ color: "#578e7e", borderColor: "#578e7e" }}
                  onClick={() => setLoginData({ email: "sales@gmail.com", password: "123456" })}
                >
                  Sales dept Login
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* ========== SIGNUP FORM ========== */
          <form onSubmit={handleSignUp}>
            <div className="form-row">
              <input
                name="first_name"
                placeholder="First Name"
                className="form-input"
                value={signUpData.first_name}
                onChange={(e) =>
                  handleInputChange(e, setSignUpData, signUpData)
                }
              />
              <input
                name="last_name"
                placeholder="Last Name"
                className="form-input"
                value={signUpData.last_name}
                onChange={(e) =>
                  handleInputChange(e, setSignUpData, signUpData)
                }
              />
            </div>

            <div className="form-row">
              <input
                name="email_id"
                placeholder="Email"
                className="form-input"
                value={signUpData.email_id}
                onChange={(e) =>
                  handleInputChange(e, setSignUpData, signUpData)
                }
              />
              <input
                name="phone_no"
                placeholder="Phone Number"
                className="form-input"
                value={signUpData.phone_no}
                onChange={(e) =>
                  handleInputChange(e, setSignUpData, signUpData)
                }
              />
            </div>

            <div className="form-row">
              <select
                name="gender"
                className="form-input"
                value={signUpData.gender}
                onChange={(e) =>
                  handleInputChange(e, setSignUpData, signUpData)
                }
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <input
                name="city"
                placeholder="City"
                className="form-input"
                value={signUpData.city}
                onChange={(e) =>
                  handleInputChange(e, setSignUpData, signUpData)
                }
              />
            </div>

            <div className="form-row">
              <input
                name="state"
                placeholder="State"
                className="form-input"
                value={signUpData.state}
                onChange={(e) =>
                  handleInputChange(e, setSignUpData, signUpData)
                }
              />
              <input
                name="country"
                placeholder="Country"
                className="form-input"
                value={signUpData.country}
                onChange={(e) =>
                  handleInputChange(e, setSignUpData, signUpData)
                }
              />
            </div>

            <div className="form-row">
              <select
                name="userType"
                className="form-input"
                value={signUpData.userType}
                onChange={(e) =>
                  handleInputChange(e, setSignUpData, signUpData)
                }
              >
                <option value="">User Type</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>

              <input
                type="password"
                name="password"
                placeholder="Password"
                className="form-input"
                value={signUpData.password}
                onChange={(e) =>
                  handleInputChange(e, setSignUpData, signUpData)
                }
              />
            </div>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="form-input"
              value={signUpData.confirmPassword}
              onChange={(e) =>
                handleInputChange(e, setSignUpData, signUpData)
              }
            />

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn flex-fill"
                style={{
                  backgroundColor: "#578e7e",
                  color: "white",
                }}
                disabled={isLoading}
              >
                {isLoading ? "Signing up..." : "Sign Up"}
              </button>

              <button
                type="button"
                onClick={toggleForm}
                className="btn flex-fill"
                style={{
                  border: "1px solid #578e7e",
                  color: "#578e7e",
                }}
              >
                Login
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ================= CSS (RESPONSIVE + SCROLL FIX) ================= */}
      <style>{`
        main {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          width: 100%;
          background: #f5f5f5;
          padding: 20px;
        }

        .login-container {
          max-width: 450px;
          width: 100%;
          padding: 30px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .form-row {
          display: flex;
          gap: 12px;
        }

        .form-input {
          width: 100%;
          padding: 12px;
          margin-bottom: 12px;
          border: 1px solid #ced4da;
          border-radius: 5px;
        }

        .form-input:focus {
          outline: none;
          border-color: #578e7e;
          box-shadow: 0 0 0 0.2rem rgba(87,142,126,0.25);
        }

        /* ===== MOBILE & TABLET SCROLL FIX ===== */
        @media (max-width: 1024px) {
          main {
            align-items: flex-start;
          }

          .login-container {
            max-height: 90vh;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }
        }

        @media (max-width: 576px) {
          .form-row {
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
};

export default Login;