import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function CustomerLogin({ setCurrentUser }) {
  const [activeTab, setActiveTab] = useState("email"); // 'phone' or 'email'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle Standard Email/Password Sign In
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (activeTab === "email") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert("Login failed: " + error.message);
      } else if (data?.user) {
        const u = data.user;
        setCurrentUser({
          id: u.id,
          email: u.email || "",
          phone: u.phone || u.user_metadata?.phone || "",
          name: u.user_metadata?.name || "Customer",
        });
        navigate("/");
      }
    } else {
      // Placeholder if you plan to implement Phone + Password / SMS later
      alert("Phone login with password is not configured yet. Please use Email.");
    }
    setLoading(false);
  };

  // Social Authentication
  const handleOAuthLogin = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) alert(`Error signing in with ${provider}: ` + error.message);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        {/* Brand Logo Header */}
        <div style={styles.logoSection}>
          <div style={styles.logoText}>
            <span style={{ color: "#00a8e8" }}>Paw</span>
            <span style={{ color: "#00c49f" }}>Market</span>
          </div>
          <p style={styles.subTagline}>PETS · CARE · ACCESSORIES</p>
          <p style={styles.subtitle}>Sign in to continue</p>
        </div>

        {/* Tab Switcher */}
        <div style={styles.tabContainer}>
          <button
            style={activeTab === "phone" ? styles.activeTab : styles.inactiveTab}
            onClick={() => setActiveTab("phone")}
          >
            Phone
          </button>
          <button
            style={activeTab === "email" ? styles.activeTab : styles.inactiveTab}
            onClick={() => setActiveTab("email")}
          >
            Email
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleLogin} style={styles.form}>
          {activeTab === "email" ? (
            <>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>
            </>
          ) : (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={styles.input}
              />
            </div>
          )}

          <button type="submit" disabled={loading} style={styles.primaryBtn}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div style={styles.dividerContainer}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>OR</span>
          <div style={styles.dividerLine} />
        </div>

        {/* Social Authentication Buttons */}
        <div style={styles.socialContainer}>
          <button onClick={() => handleOAuthLogin("google")} style={styles.googleBtn}>
            <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: "10px" }}>
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.616z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
            </svg>
            Sign in with Google
          </button>

          <button onClick={() => handleOAuthLogin("apple")} style={styles.appleBtn}>
            <svg width="16" height="18" viewBox="0 0 170 170" fill="#fff" style={{ marginRight: "10px" }}>
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.9.13-9.76-1.93-14.57-6.18-3.17-2.71-7.06-7.39-11.66-14.05-5.65-8.13-10.15-17.5-13.5-28.11-3.35-10.6-5.02-21.03-5.02-31.29 0-14.24 3.63-26.15 10.88-35.73 7.26-9.57 16.42-14.45 27.49-14.64 4.79 0 9.87 1.15 15.24 3.46 5.37 2.31 9.17 3.46 11.4 3.46 2.01 0 5.8-1.15 11.38-3.46 5.58-2.31 10.45-3.4 14.61-3.26 10.62.46 19.34 4.41 26.15 11.84-9.39 5.67-14.01 13.54-13.87 23.6.14 8.01 3.18 14.86 9.13 20.54 5.95 5.68 13.11 8.94 21.49 9.77-2.13 6.32-4.8 12.43-8.01 18.33zM119.22 31.81c0-6.99 2.51-13.68 7.53-20.07 5.02-6.39 11.37-10.38 19.04-11.97.27 1.34.4 2.45.4 3.33 0 6.94-2.57 13.72-7.71 20.35-5.14 6.63-11.43 10.59-18.87 11.88-.09-1.07-.39-2.24-.39-3.52z" />
            </svg>
            Sign in with Apple
          </button>
        </div>

        {/* Register Link */}
        <p style={styles.footerText}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.signUpLink}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

// Inline Styles matching your exact layout
const styles = {
  pageContainer: {
    minHeight: "100vh",
    backgroundColor: "#f7f9fc",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    padding: "36px 32px",
    width: "100%",
    maxWidth: "400px",
    boxSizing: "border-box",
  },
  logoSection: {
    textAlign: "center",
    marginBottom: "28px",
  },
  logoText: {
    fontSize: "36px",
    fontWeight: "800",
    letterSpacing: "-1px",
  },
  subTagline: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#888",
    letterSpacing: "2px",
    marginTop: "2px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginTop: "16px",
  },
  tabContainer: {
    display: "flex",
    borderBottom: "1px solid #e5e7eb",
    marginBottom: "24px",
  },
  activeTab: {
    flex: 1,
    padding: "12px 0",
    border: "none",
    borderBottom: "2px solid #000",
    backgroundColor: "transparent",
    fontWeight: "700",
    fontSize: "15px",
    color: "#000",
    cursor: "pointer",
  },
  inactiveTab: {
    flex: 1,
    padding: "12px 0",
    border: "none",
    borderBottom: "2px solid transparent",
    backgroundColor: "transparent",
    fontWeight: "500",
    fontSize: "15px",
    color: "#9ca3af",
    cursor: "pointer",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#111",
  },
  input: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    fontSize: "15px",
    outline: "none",
    backgroundColor: "#fff",
  },
  primaryBtn: {
    backgroundColor: "#000000",
    color: "#ffffff",
    padding: "16px",
    borderRadius: "14px",
    border: "none",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "8px",
  },
  dividerContainer: {
    display: "flex",
    alignItems: "center",
    margin: "24px 0",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    backgroundColor: "#e5e7eb",
  },
  dividerText: {
    padding: "0 12px",
    fontSize: "12px",
    color: "#9ca3af",
    fontWeight: "600",
  },
  socialContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  googleBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    color: "#111",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
  },
  appleBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px",
    borderRadius: "14px",
    border: "none",
    backgroundColor: "#000000",
    color: "#ffffff",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
  },
  footerText: {
    textAlign: "center",
    marginTop: "24px",
    fontSize: "14px",
    color: "#666",
  },
  signUpLink: {
    color: "#0066cc",
    fontWeight: "700",
    textDecoration: "none",
  },
};