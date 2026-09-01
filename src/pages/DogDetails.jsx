import DogCard from "../components/DogCard"; // ✅ Correctimport { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function DogDetails({
  dogs = [],
  reviews = [],
  addReview,
  currentUser,
  addToCart,
  addToWishlist,
  wishlist = [],
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Flexible ID comparison (supports numeric IDs and string/UUID IDs)
  const dog = dogs.find(
    (item) => item.id === id || item.id === Number(id)
  );

  const [startIndex, setStartIndex] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Helper to parse numerical price safe for formatting
  const parsePrice = (price) => {
    if (!price) return 0;
    const cleaned = String(price).replace(/[^0-9.]/g, "");
    return parseFloat(cleaned) || 0;
  };

  // If dog does not exist
  if (!dog) {
    return (
      <div className="details-page">
        <h2>Dog not found.</h2>
        <Link to="/">
          <button className="back-btn">← Back to Home</button>
        </Link>
      </div>
    );
  }

  // Related dogs (excluding current selection)
  const relatedDogs = dogs.filter((item) => item.id !== dog.id);

  // Show 3 dogs at a time
  const visibleDogs = relatedDogs.slice(startIndex, startIndex + 3);

  // Carousel navigation
  function nextDogs() {
    if (startIndex + 3 < relatedDogs.length) {
      setStartIndex(startIndex + 1);
    }
  }

  function previousDogs() {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  }

  // Add dog to cart
  function handleAddToCart() {
    addToCart(dog);
    alert(`${dog.name} has been added to your cart!`);
  }

  // Buy now
  function handleBuyNow() {
    addToCart(dog);
    navigate("/checkout");
  }

  // Check wishlist state
  const isWishlisted = wishlist.some((item) => item.id === dog.id);

  // WhatsApp message
  const message = `Hello, I'm interested in ${dog.name} (${dog.breed}). Is it still available?`;
  const whatsappLink = `https://wa.me/${
    dog.seller?.phone || ""
  }?text=${encodeURIComponent(message)}`;

  // Reviews for this dog only
  const dogReviews = reviews.filter((review) => review.dogId === dog.id);

  return (
    <div className="details-page">
      {/* =================================
          MAIN DOG INFORMATION
      ================================== */}
      <div className="details-main">
        {/* DOG IMAGE */}
        <div className="details-image">
          <img src={dog.image} alt={dog.name} />
        </div>

        {/* DOG INFORMATION */}
        <div className="details-info">
          <h1>{dog.name}</h1>

          <h2>₦{parsePrice(dog.price).toLocaleString()}</h2>

          <p>
            <strong>Breed:</strong> {dog.breed}
          </p>

          <p>
            <strong>Age:</strong> {dog.age}
          </p>

          <p>
            <strong>Gender:</strong> {dog.gender}
          </p>

          <p>
            <strong>Location:</strong> {dog.location}
          </p>

          <p>
            <strong>Vaccinated:</strong> {dog.vaccinated ? "Yes" : "No"}
          </p>

          <h3>Description</h3>
          <p>{dog.description}</p>

          {/* =================================
              SHOPPING BUTTONS
          ================================== */}
          <div className="details-actions">
            <button
              className="add-cart-details-btn"
              onClick={handleAddToCart}
            >
              🛒 Add to Cart
            </button>

            <button
              className="buy-now-details-btn"
              onClick={handleBuyNow}
            >
              ⚡ Buy Now
            </button>

            {addToWishlist && (
              <button
                className={`wishlist-details-btn ${isWishlisted ? "active" : ""}`}
                onClick={() => addToWishlist(dog)}
              >
                {isWishlisted ? "❤️ Saved" : "🤍 Save"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =================================
          SELLER + REVIEWS
      ================================== */}
      <div className="details-bottom">
        {/* SELLER INFORMATION */}
        <div className="seller-card">
          <h3>Seller Information</h3>

          <p>
            <strong>Name:</strong>{" "}
            {dog.seller?.name || "PawMarket Seller"}
          </p>

          <p>
            <strong>Rating:</strong> ⭐ {dog.seller?.rating || 5}
          </p>

          <p>
            <strong>Location:</strong> 📍{" "}
            {dog.seller?.location || dog.location}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {dog.seller?.verified ? "✔ Verified Seller" : "Not Verified"}
          </p>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="contact-btn">💬 Contact Seller</button>
          </a>

          <Link to="/">
            <button className="back-btn">← Back to Home</button>
          </Link>
        </div>

        {/* CUSTOMER REVIEWS */}
        <div className="reviews-section">
          <h2>⭐ Customer Reviews</h2>

          {/* Existing Reviews */}
          <div className="reviews-grid">
            {dogReviews.length > 0 ? (
              dogReviews.map((review) => (
                <div key={review.id} className="review-card">
                  <h4>{review.user}</h4>
                  <p>{"⭐".repeat(review.rating)}</p>
                  <p>{review.comment}</p>
                </div>
              ))
            ) : (
              <p>
                No reviews yet. Be the first to review this dog!
              </p>
            )}
          </div>

          {/* REVIEW FORM */}
          {currentUser && addReview && (
            <div className="review-form">
              <h3>Leave a Review</h3>

              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value={5}>★★★★★</option>
                <option value={4}>★★★★☆</option>
                <option value={3}>★★★☆☆</option>
                <option value={2}>★★☆☆☆</option>
                <option value={1}>★☆☆☆☆</option>
              </select>

              <textarea
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button
                onClick={() => {
                  if (!comment.trim()) return;

                  addReview({
                    id: Date.now(),
                    dogId: dog.id,
                    user: currentUser.name || "Anonymous",
                    rating,
                    comment,
                  });

                  setComment("");
                  setRating(5);
                }}
              >
                Submit Review
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =================================
          YOU MAY ALSO LIKE
      ================================== */}
      {relatedDogs.length > 0 && (
        <section className="related-dogs">
          <h2>You May Also Like</h2>

          <div className="carousel-buttons">
            <button disabled={startIndex === 0} onClick={previousDogs}>
              ⬅
            </button>
            <button
              disabled={startIndex + 3 >= relatedDogs.length}
              onClick={nextDogs}
            >
              ➡
            </button>
          </div>

          <div className="related-grid">
  {visibleDogs.map((item) => (
    <DogCard
      key={item.id}
      dog={item}
      addToCart={addToCart}
      toggleWishlist={addToWishlist}
      isWishlisted={wishlist.some((w) => String(w.id) === String(item.id))}
    />
  ))}
</div>
        </section>
      )}
    </div>
  );
}

export default DogDetails;