import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function AdminLogin({ setIsAdmin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    if (isSignUp && password !== confirmPassword) {
      setMessage({ text: "Passwords do not match.", type: "error" });
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password: password,
          options: {
            data: { role: "admin" },
          },
        });

        if (error) {
          setMessage({ text: error.message, type: "error" });
        } else if (data?.user) {
          setMessage({
            text: "Admin account created successfully! You can now log in.",
            type: "success",
          });
          setIsSignUp(false);
          setPassword("");
          setConfirmPassword("");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password: password,
        });

        if (error) {
          setMessage({ text: error.message, type: "error" });
        } else if (data?.user) {
          if (setIsAdmin) setIsAdmin(true);
          localStorage.setItem("isAdmin", "true");
          navigate("/admin");
        }
      }
    } catch (err) {
      setMessage({
        text: "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f6f9",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "40px 30px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px",
            color: "#111",
          }}
        >
          {isSignUp ? "🔐 Create Admin Account" : "🔐 Admin Login"}
        </h2>

        {message.text && (
          <div
            style={{
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "6px",
              fontSize: "14px",
              background: message.type === "error" ? "#f8d7da" : "#d4edda",
              color: message.type === "error" ? "#721c24" : "#155724",
            }}
          >
            {message.text}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "6px",
              border: "1px solid #dcdfe6",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />

          <div style={{ position: "relative", width: "100%" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 45px 12px 14px",
                borderRadius: "6px",
                border: "1px solid #dcdfe6",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                color: "#6c757d",
                fontWeight: "600",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {isSignUp && (
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 45px 12px 14px",
                  borderRadius: "6px",
                  border: "1px solid #dcdfe6",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                  color: "#6c757d",
                  fontWeight: "600",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: "#0d6efd",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            {loading
              ? "Processing..."
              : isSignUp
              ? "Create Account"
              : "Login to Dashboard"}
          </button>
        </form>

        <div style={{ marginTop: "20px" }}>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage({ text: "", type: "" });
            }}
            style={{
              background: "none",
              border: "none",
              color: "#0d6efd",
              fontSize: "14px",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {isSignUp
              ? "Already have an admin account? Sign In"
              : "Need a new admin account? Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;