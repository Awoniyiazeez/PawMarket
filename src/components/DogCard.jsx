import { Link } from "react-router-dom";

function DogCard({ dog, addToCart, toggleWishlist, isWishlisted }) {
  if (!dog) return null;

  const rawPrice = dog?.price ?? 0;
  const formattedPrice = Number(
    String(rawPrice).replace(/[^0-9.-]+/g, "")
  ).toLocaleString("en-NG");

  return (
    <div className="product-card">
      <div className="card-image-wrapper">
        <img
          src={dog.image_url || dog.image || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500"}
          alt={dog.name || "Dog"}
          className="card-image"
        />

        <span className="status-badge">✓ Available</span>

        <button
          className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
          onClick={() => toggleWishlist && toggleWishlist(dog)}
          aria-label="Add to Wishlist"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={isWishlisted ? "#ef4444" : "none"}
            stroke={isWishlisted ? "#ef4444" : "#4b5563"}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <div className="card-details">
        <div className="card-header-row">
          <h3 className="dog-name">{dog.name || "Unnamed Dog"}</h3>
          {dog.gender && <span className="gender-tag">{dog.gender}</span>}
        </div>

        <div className="dog-meta-info">
          <p className="meta-item">🐾 {dog.breed || "Purebreed"}</p>
          <p className="meta-item">
            {dog.age ? `🎂 ${dog.age} • ` : ""}📍 {dog.location || "Nigeria"}
          </p>
        </div>

        <div className="price-container">
          <span className="price-label">PRICE</span>
          <div className="price-amount">₦{formattedPrice}</div>
        </div>

        <div className="card-actions">
          <Link to={`/dog/${dog.id}`} className="view-details-btn">
            View Details
          </Link>
          <button
            className="add-cart-btn"
            onClick={() => addToCart && addToCart(dog)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default DogCard;