import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Register({ setCurrentUser }) {
  const [tab, setTab] = useState("email"); // 'email' or 'phone'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (tab === "email") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            },
          },
        });

        if (error) throw error;

        if (data?.user) {
          setCurrentUser({
            id: data.user.id,
            email: data.user.email,
            name: name || "Customer",
          });
          navigate("/");
        }
      } else {
        // Phone registration handler
        const { data, error } = await supabase.auth.signUp({
          phone,
          password,
          options: {
            data: { name },
          },
        });

        if (error) throw error;

        if (data?.user) {
          setCurrentUser({
            id: data.user.id,
            phone: data.user.phone,
            name: name || "Customer",
          });
          navigate("/");
        }
      }
    } catch (err) {
      setErrorMsg(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-brand-logo">🐾 PawMarket</span>
          <h2>Create Account</h2>
          <p>Join to discover and buy healthy companions</p>
        </div>

        {/* Tab Toggle */}
        <div className="auth-tab-group">
          <button
            type="button"
            className={`auth-tab ${tab === "email" ? "active" : ""}`}
            onClick={() => setTab("email")}
          >
            Email Register
          </button>
          <button
            type="button"
            className={`auth-tab ${tab === "phone" ? "active" : ""}`}
            onClick={() => setTab("phone")}
          >
            Phone Register
          </button>
        </div>

        {errorMsg && <div className="auth-error-alert">{errorMsg}</div>}

        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {tab === "email" ? (
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          ) : (
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="+234 XXX XXX XXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-primary-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Register Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/customer-login" className="auth-link">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}