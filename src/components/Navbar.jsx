import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Navbar({ cart, wishlist, currentUser, setCurrentUser, isAdmin, setIsAdmin }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart?.length || 0;
  const wishlistCount = wishlist?.length || 0;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Mobile Hamburger Toggle */}
        <button 
          className="mobile-hamburger" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
          <span className="brand-logo">🐾</span>
          <span className="brand-name">Paw<span>Market</span></span>
        </Link>

        {/* Multi-Pet & Multi-Category Store Navigation */}
        <nav className={`navbar-links ${mobileMenuOpen ? "mobile-active" : ""}`}>
          <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <a href="#featured" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Pets (Dogs, Cats, Birds)
          </a>
          <a href="#featured" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Pet Food
          </a>
          <a href="#featured" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Care & Accessories
          </a>
          <a href="#footer" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Contact Us
          </a>
        </nav>

        {/* E-Commerce User Action Icons */}
        <div className="navbar-actions">
          {/* Wishlist Icon */}
          <Link to="/wishlist" className="action-icon-btn" title="Wishlist">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlistCount > 0 && <span className="action-badge">{wishlistCount}</span>}
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="action-icon-btn" title="Shopping Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && <span className="action-badge cart-badge">{cartCount}</span>}
          </Link>

          {/* User Profile Dropdown or Auth Action */}
          {currentUser || isAdmin ? (
            <div className="profile-dropdown-container">
              <button 
                className="user-profile-btn" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="user-avatar">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "A"}
                </div>
                <span className="user-firstname">
                  {currentUser?.name ? currentUser.name.split(" ")[0] : "Admin"}
                </span>
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu" onClick={() => setDropdownOpen(false)}>
                  {isAdmin && (
                    <Link to="/admin" className="dropdown-item">Admin Dashboard</Link>
                  )}
                  <Link to="/profile" className="dropdown-item">My Account</Link>
                  <Link to="/my-orders" className="dropdown-item">My Orders</Link>
                  <button onClick={handleLogout} className="dropdown-item logout-btn">
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/customer-login" className="login-link">Sign In</Link>
              <Link to="/register" className="register-btn">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;