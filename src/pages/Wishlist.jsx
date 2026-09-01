function Wishlist({ wishlist, removeFromWishlist, addToCart }) {
  return (
    <div className="admin-page">
      <h1>❤️ My Wishlist</h1>

      {wishlist.length === 0 ? (
        <p>No favorite dogs yet.</p>
      ) : (
        <div className="dog-grid">
          {wishlist.map((dog) => (
            <div key={dog.id} className="dog-card">
              <img src={dog.image} alt={dog.name} />

              <div className="dog-info">
                <h3>{dog.name}</h3>
                <p>{dog.breed}</p>
                <h4>₦{dog.price}</h4>

                <button onClick={() => addToCart(dog)}>
                  🛒 Add to Cart
                </button>

                <button onClick={() => removeFromWishlist(dog.id)}>
                  ❌ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;