import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  // Handle smooth scrolling after cross-page navigation via hash URL
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  // Hide footer on admin management routes
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  // Smooth scroll handler for anchor navigation
  const handleAnchorClick = (e, targetId) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate(`/${targetId}`);
    } else {
      const element = document.querySelector(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* BRAND & DESCRIPTION */}
        <div className="footer-column footer-brand">
          <div className="footer-logo">
            🐶 <span>PawMarket</span>
          </div>

          <p>
            Your premier marketplace for healthy pets, premium animal food, grooming care, and quality accessories across Nigeria.
          </p>

          <div className="footer-socials">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              f
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              ◎
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              𝕏
            </a>
            <a
              href="https://wa.me/2347087276364"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              ☏
            </a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-column">
          <div className="footer-heading">Quick Links</div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <a
                href="#featured"
                onClick={(e) => handleAnchorClick(e, "#featured")}
              >
                Dogs & Puppies
              </a>
            </li>
            <li>
              <a
                href="#cats"
                onClick={(e) => handleAnchorClick(e, "#cats")}
              >
                Cats & Kittens
              </a>
            </li>
            <li>
              <a
                href="#food-supplies"
                onClick={(e) => handleAnchorClick(e, "#food-supplies")}
              >
                Pet Food & Supplies
              </a>
            </li>
            <li>
              <a
                href="#about"
                onClick={(e) => handleAnchorClick(e, "#about")}
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                onClick={(e) => handleAnchorClick(e, "#how-it-works")}
              >
                How It Works
              </a>
            </li>
          </ul>
        </div>

        {/* CUSTOMER PORTAL */}
        <div className="footer-column">
          <div className="footer-heading">Customer Account</div>
          <ul>
            <li>
              <Link to="/profile">My Profile</Link>
            </li>
            <li>
              <Link to="/my-orders">Order History</Link>
            </li>
            <li>
              <Link to="/wishlist">Saved Wishlist</Link>
            </li>
            <li>
              <Link to="/cart">Shopping Cart</Link>
            </li>
          </ul>
        </div>

        {/* CONTACT & SUPPORT */}
        <div className="footer-column">
          <div className="footer-heading">Contact Us</div>
          <p>📍 Nigeria</p>
          <p>📧 support@pawmarket.com</p>
          <p>📞 +234 708 727 6364</p>

          <a
            href="https://wa.me/2347087276364"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-whatsapp"
          >
            💬 Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* BOTTOM LEGAL */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} PawMarket. All rights reserved.</p>
        <p>Built with ❤️ for Nigeria 🇳🇬</p>
      </div>
    </footer>
  );
}

export default Footer;