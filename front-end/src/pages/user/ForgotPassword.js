import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 1: email input, 2: verification code, 3: new password
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/;
    return passwordRegex.test(password);
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = new URL("http://localhost:8080/api/users/request-reset-password");
      url.searchParams.append("email", email);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setMessage("Verification code has been sent to your email");
      setStep(2);
      setError("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = new URL("http://localhost:8080/api/users/verify-reset-code");
      url.searchParams.append("email", email);
      url.searchParams.append("resetCode", verificationCode);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setMessage("Verification code is valid");
      setStep(3);
      setError("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validatePassword(newPassword)) {
      setError("Password must be 8-16 characters long, contain at least one uppercase letter and one special character");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Confirmation password does not match");
      setLoading(false);
      return;
    }

    try {
      const url = new URL("http://localhost:8080/api/users/reset-password");
      url.searchParams.append("email", email);
      url.searchParams.append("resetCode", verificationCode);
      url.searchParams.append("newPassword", newPassword);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setMessage("Password has been reset successfully");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="border rounded shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Forgot Password</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        {step === 1 && (
          <form onSubmit={handleRequestReset}>
            <div className="form-group mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                "Send Verification Code"
              )}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode}>
            <div className="form-group mb-3">
              <label>Verification Code</label>
              <input
                type="text"
                className="form-control"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                "Verify"
              )}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="form-group mb-3">
              <label>New Password</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="8-16 characters, 1 uppercase, 1 special character"
              />
            </div>
            <div className="form-group mb-3">
              <label>Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}

        <div className="text-center">
          <button className="btn btn-link" onClick={() => navigate("/login")}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;