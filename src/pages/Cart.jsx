import { Link } from "react-router-dom";

function Cart({ cart, removeFromCart }) {
  const deliveryFee = 10000;

  // Calculate subtotal handling both string (e.g., "1,000,000") and numeric prices
  const subtotal = cart.reduce((total, dog) => {
    const priceVal = Number(String(dog.price).replace(/[^0-9.-]+/g, "")) || 0;
    return total + priceVal;
  }, 0);

  const total = subtotal + deliveryFee;

  return (
    <div className="cart-page">
      <div className="cart-header">
        <span className="section-badge">🐾 PAWMARKET</span>
        <h1>Shopping Cart</h1>
        <p>Review your selected companions before checkout.</p>
        <div className="cart-count-badge">
          🛒 {cart.length} {cart.length === 1 ? "Dog" : "Dogs"}
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart" style={{ textAlign: "center", padding: "60px 0" }}>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any dogs to your cart yet.</p>
          <Link to="/" className="hero-primary-btn" style={{ display: "inline-block", marginTop: "20px" }}>
            ← Explore Dogs
          </Link>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items-list">
            {cart.map((dog) => (
              <div key={dog.id} className="cart-item">
                <img src={dog.image} alt={dog.name} className="cart-item-img" />
                <div className="cart-item-details">
                  <h3>{dog.name}</h3>
                  <p className="cart-item-breed">{dog.breed}</p>
                  <div className="cart-item-badges">
                    {dog.age && <span>🎂 {dog.age}</span>}
                    {dog.gender && <span>{dog.gender === "Male" ? "♂" : "♀"}</span>}
                  </div>
                  <h4 className="cart-item-price">
                    ₦{(Number(String(dog.price).replace(/[^0-9.-]+/g, "")) || 0).toLocaleString()}
                  </h4>
                </div>
                <button
                  onClick={() => removeFromCart(dog.id)}
                  className="remove-cart-btn"
                >
                  🗑️ Remove
                </button>
              </div>
            ))}

            <Link to="/" className="continue-shopping">
              ← Continue Shopping
            </Link>
          </div>

          <div className="order-summary-card">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Dogs ({cart.length})</span>
              <strong>₦{subtotal.toLocaleString()}</strong>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <strong>₦{deliveryFee.toLocaleString()}</strong>
            </div>
            <hr />
            <div className="summary-row total-row">
              <span>Total</span>
              <strong>₦{total.toLocaleString()}</strong>
            </div>

            <Link to="/checkout" className="checkout-btn">
              Proceed to Checkout →
            </Link>

            <div className="secure-checkout-notice">
              <span>🔒 Secure Checkout</span>
              <p>Your order information is protected.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;