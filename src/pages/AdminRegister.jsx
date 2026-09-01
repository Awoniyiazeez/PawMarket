import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

const ADMIN_EMAIL = "abdulateezawoniyi@gmail.com";

function AdminRegister({ setIsAdmin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const trimmedEmail = formData.email.trim().toLowerCase();

    if (trimmedEmail !== ADMIN_EMAIL.toLowerCase()) {
      setLoading(false);
      setErrorMessage(`Only ${ADMIN_EMAIL} is authorized to register as an admin.`);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLoading(false);
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: formData.password,
        options: {
          data: {
            name: formData.name || "Admin",
            role: "admin",
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (data?.user) {
        setIsAdmin(true);
        localStorage.setItem("isAdmin", "true");
        alert("Admin account created successfully!");
        navigate("/admin");
      }
    } catch (err) {
      setErrorMessage("An unexpected registration error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <h1>🔑 Register Admin Account</h1>

        {errorMessage && (
          <div className="error-banner" role="alert">
            ⚠️ {errorMessage}
          </div>
        )}

        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Creating Account..." : "Create Admin Account"}
        </button>

        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Already registered? <Link to="/admin-login">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default AdminRegister;