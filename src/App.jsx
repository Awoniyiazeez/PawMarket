import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation, Link } from "react-router-dom";
import { supabase } from "./lib/supabase";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DogCard from "./components/DogCard";

import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import Register from "./pages/Register";
import CustomerLogin from "./pages/CustomerLogin";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import DogDetails from "./pages/DogDetails";
import Admin from "./pages/Admin";

import "./index.css";

const ADMIN_EMAIL = "abdulateezawoniyi@gmail.com";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout({ cart, wishlist, currentUser, setCurrentUser, isAdmin, setIsAdmin }) {
  return (
    <>
      <Navbar
        cart={cart}
        wishlist={wishlist}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />
      <Outlet />
      <Footer />
    </>
  );
}

function AdminLayout() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <header
        style={{
          background: "#ffffff",
          padding: "15px 20px",
          borderBottom: "1px solid #eaeaea",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#1b4332",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          🐾 PawMarket
        </Link>
      </header>

      <main style={{ flex: 1, padding: "10px" }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

// Protected Route Component for Admin Access Control
function ProtectedAdminRoute({ isAdmin, children }) {
  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
}

// ==========================================
// HOME COMPONENT (Multi-Pet & Category Filter)
// ==========================================
function Home({ dogs, addToCart, addToWishlist, wishlist }) {
  const [search, setSearch] = useState("");
  const [selectedPet, setSelectedPet] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const safeProductsList = Array.isArray(dogs) ? dogs : [];

  const petTypes = ["All", "Dogs", "Cats", "Birds", "Rabbits"];
  const categories = [
    "All",
    "Pets",
    "Pet Food",
    "Accessories",
    "Grooming Supplies",
    "Cages & Carriers",
    "Toys",
  ];

  const filteredProducts = safeProductsList
    .filter((item) => {
      if (!item) return false;
      const name = String(item.name || "").toLowerCase();
      const breed = String(item.breed || "").toLowerCase();
      const query = search.toLowerCase();

      const matchesSearch = name.includes(query) || breed.includes(query);
      const matchesPet =
        selectedPet === "All" ||
        String(item.pet_type || "Dogs").toLowerCase() === selectedPet.toLowerCase();
      const matchesCategory =
        selectedCategory === "All" ||
        String(item.category || "Pets").toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesPet && matchesCategory;
    })
    .sort((a, b) => {
      const priceA = Number(String(a?.price || 0).replace(/[^0-9.-]+/g, "")) || 0;
      const priceB = Number(String(b?.price || 0).replace(/[^0-9.-]+/g, "")) || 0;
      if (sortBy === "low") return priceA - priceB;
      if (sortBy === "high") return priceB - priceA;
      return 0;
    });

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">🐾 Quality Pets & Everything They Need!</span>
          <h1>
            Your One-Stop <span> Pet Store</span>
          </h1>
          <p>
            Discover healthy pets, quality food, accessories, and grooming supplies 
            from trusted sellers across Nigeria.
          </p>
          <div className="hero-buttons">
            <a href="#featured" className="hero-primary-btn">
              Shop Online Anytime →
            </a>
          </div>
        </div>
      </section>

      <section className="featured" id="featured">
        <h2>Explore PawMarket</h2>

        {/* Search & Filter Bar */}
        <div className="dog-filters" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div className="search-box">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search pets, food, accessories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Pet Type Pills */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {petTypes.map((pet) => (
              <button
                key={pet}
                onClick={() => setSelectedPet(pet)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  border: "1px solid #1b4332",
                  background: selectedPet === pet ? "#1b4332" : "#fff",
                  color: selectedPet === pet ? "#fff" : "#1b4332",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {pet}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <label style={{ fontWeight: "600", fontSize: "14px" }}>Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc" }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="dog-grid">
            {filteredProducts.map((dog) => (
              <DogCard
                key={dog.id || Math.random()}
                dog={dog}
                addToCart={addToCart}
                toggleWishlist={addToWishlist}
                isWishlisted={wishlist?.some((item) => item.id === dog.id)}
              />
            ))}
          </div>
        ) : (
          <p className="no-results">No items found matching your filter.</p>
        )}
      </section>
    </>
  );
}

// ==========================================
// MAIN APP COMPONENT
// ==========================================
function App() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem("isAdmin") === "true";
  });

  const [dogs, setDogs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  async function fetchDogs() {
    try {
      const { data, error } = await supabase.from("dogs").select("*");
      if (error) {
        console.error("Supabase error fetching products:", error);
      } else {
        setDogs(data || []);
      }
    } catch (err) {
      console.error("Product fetch exception:", err);
    }
  }

  useEffect(() => {
    fetchDogs();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    async function initAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          const u = session.user;
          const userObj = {
            id: u.id,
            email: u.email || "",
            phone: u.phone || u.user_metadata?.phone || "",
            name: u.user_metadata?.name || "Customer",
            profileImage: u.user_metadata?.profileImage || "",
            address: u.user_metadata?.address || "",
          };
          setCurrentUser(userObj);

          const adminStatus = u.email === ADMIN_EMAIL;
          setIsAdmin(adminStatus);
          localStorage.setItem("isAdmin", String(adminStatus));
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setLoadingAuth(false);
      }
    }

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        setCurrentUser({
          id: u.id,
          email: u.email || "",
          phone: u.phone || u.user_metadata?.phone || "",
          name: u.user_metadata?.name || "Customer",
          profileImage: u.user_metadata?.profileImage || "",
          address: u.user_metadata?.address || "",
        });
        const adminStatus = u.email === ADMIN_EMAIL;
        setIsAdmin(adminStatus);
        localStorage.setItem("isAdmin", String(adminStatus));
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
        localStorage.removeItem("isAdmin");
      }
      setLoadingAuth(false);
    });

    return () => authListener.subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchOrders() {
      setOrdersLoading(true);
      try {
        let query = supabase.from("orders").select("*");
        const { data, error } = await query;
        if (error) {
          console.error("Error fetching orders:", error);
        } else if (data) {
          setOrders(data);
        }
      } catch (err) {
        console.error("Order fetch exception:", err);
      } finally {
        setOrdersLoading(false);
      }
    }

    fetchOrders();
  }, [currentUser, isAdmin]);

  async function uploadDogImage(imageInput) {
    const fallbackImage = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500";

    if (!imageInput) return fallbackImage;
    if (typeof imageInput === "string") return imageInput.trim() || fallbackImage;

    if (imageInput instanceof File) {
      const fileExt = imageInput.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `dogs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("dog-images")
        .upload(filePath, imageInput);

      if (uploadError) {
        console.error("Image Upload Error:", uploadError);
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      const { data } = supabase.storage.from("dog-images").getPublicUrl(filePath);
      return data.publicUrl;
    }

    return fallbackImage;
  }

  async function placeOrder(customer) {
    if (!currentUser) {
      alert("Please log in to place an order.");
      return null;
    }

    const deliveryFee = 10000;
    const subtotal = cart.reduce((total, dog) => {
      const priceVal = Number(String(dog.price).replace(/[^0-9.-]+/g, "")) || 0;
      return total + priceVal;
    }, 0);

    const cleanedCart = cart.map((dog) => ({
      id: dog.id,
      name: dog.name,
      breed: dog.breed,
      price: Number(String(dog.price).replace(/[^0-9.-]+/g, "")) || 0,
      image: dog.image,
      location: dog.location,
    }));

    const newOrder = {
      customer: {
        fullName: customer.fullName || currentUser.name,
        email: customer.email || currentUser.email,
        phone: customer.phone || currentUser.phone,
        address: customer.address || currentUser.address,
      },
      user_info: {
        id: currentUser.id,
        name: currentUser.name || "Customer",
        email: currentUser.email || "No Email",
      },
      dogs: cleanedCart,
      subtotal: subtotal,
      delivery_fee: deliveryFee,
      total: subtotal + deliveryFee,
      status: "Pending",
    };

    const { data, error } = await supabase.from("orders").insert([newOrder]).select();

    if (error) {
      console.error("Order Insertion Error:", error);
      alert(`Failed to place order: ${error.message}`);
      return null;
    }

    if (data && data.length > 0) {
      const savedOrder = data[0];
      setOrders((prev) => [savedOrder, ...prev]);
      setCart([]);
      localStorage.removeItem("cart");
      return savedOrder;
    }
  }

  async function updateOrderStatus(id, status) {
    const { data, error } = await supabase
      .from("orders")
      .update({ status: status })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating order status:", error);
    } else if (data) {
      setOrders((prev) => prev.map((order) => (order.id === id ? data[0] : order)));
    }
  }

  function addToCart(dog) {
    setCart((prev) => [...prev, dog]);
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((dog) => dog.id !== id));
  }

  function addToWishlist(dog) {
    const exists = wishlist.some((item) => item.id === dog.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.id !== dog.id));
    } else {
      setWishlist((prev) => [...prev, dog]);
    }
  }

  function removeFromWishlist(id) {
    setWishlist((prev) => prev.filter((dog) => dog.id !== id));
  }

  async function addDog(newDog) {
    try {
      const imageUrl = await uploadDogImage(newDog.image);

      const payload = {
        name: String(newDog.name || "").trim(),
        breed: String(newDog.breed || "").trim(),
        age: String(newDog.age || "1 year").trim(),
        gender: String(newDog.gender || "Male").trim(),
        price: Number(String(newDog.price).replace(/[^0-9.]/g, "")) || 0,
        image: imageUrl,
        location: String(newDog.location || "Lagos").trim(),
        description: String(newDog.description || "").trim(),
        pet_type: String(newDog.pet_type || "Dogs").trim(),
        category: String(newDog.category || "Pets").trim(),
      };

      const { data, error } = await supabase.from("dogs").insert([payload]).select();

      if (error) {
        console.error("Supabase Add Item Error:", error);
        alert(`Failed to save listing: ${error.message}`);
        return false;
      } else if (data && data.length > 0) {
        setDogs((prev) => [...prev, data[0]]);
        alert("Item added successfully!");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Add Item Exception:", err);
      alert(err.message || "An unexpected error occurred while adding the item.");
      return false;
    }
  }

  async function updateDog(id, updatedDog) {
    try {
      const imageUrl = await uploadDogImage(updatedDog.image);

      const payload = {
        name: String(updatedDog.name || "").trim(),
        breed: String(updatedDog.breed || "").trim(),
        age: String(updatedDog.age || "1 year").trim(),
        gender: String(updatedDog.gender || "Male").trim(),
        price: Number(String(updatedDog.price).replace(/[^0-9.]/g, "")) || 0,
        image: imageUrl,
        location: String(updatedDog.location || "Lagos").trim(),
        description: String(updatedDog.description || "").trim(),
        pet_type: String(updatedDog.pet_type || "Dogs").trim(),
        category: String(updatedDog.category || "Pets").trim(),
      };

      const { data, error } = await supabase.from("dogs").update(payload).eq("id", id).select();

      if (error) {
        console.error("Supabase Update Error:", error);
        alert(`Failed to update item: ${error.message}`);
        return false;
      } else if (data && data.length > 0) {
        setDogs((prev) => prev.map((dog) => (dog.id === id ? data[0] : dog)));
        alert("Item updated successfully!");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Update Exception:", err);
      alert(err.message || "An unexpected error occurred.");
      return false;
    }
  }

  async function deleteDog(id) {
    const { error } = await supabase.from("dogs").delete().eq("id", id);
    if (!error) {
      setDogs((prev) => prev.filter((dog) => dog.id !== id));
    } else {
      alert(`Delete failed: ${error.message}`);
    }
  }

  if (loadingAuth) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading session...</div>;
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route
          element={
            <Layout
              cart={cart}
              wishlist={wishlist}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              isAdmin={isAdmin}
              setIsAdmin={setIsAdmin}
            />
          }
        >
          <Route path="/" element={<Home dogs={dogs} addToCart={addToCart} addToWishlist={addToWishlist} wishlist={wishlist} />} />
          <Route path="/dog/:id" element={<DogDetails dogs={dogs} addToCart={addToCart} addToWishlist={addToWishlist} wishlist={wishlist} />} />
          <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} />} />
          <Route path="/checkout" element={<Checkout cart={cart} currentUser={currentUser} placeOrder={placeOrder} />} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/my-orders" element={<MyOrders orders={orders} currentUser={currentUser} loading={ordersLoading} />} />
          <Route path="/wishlist" element={<Wishlist wishlist={wishlist} removeFromWishlist={removeFromWishlist} addToCart={addToCart} />} />
          <Route path="/profile" element={<Profile currentUser={currentUser} setCurrentUser={setCurrentUser} orders={orders} />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute isAdmin={isAdmin}>
                <Admin
                  dogs={dogs}
                  orders={orders}
                  addDog={addDog}
                  updateDog={updateDog}
                  deleteDog={deleteDog}
                  updateOrderStatus={updateOrderStatus}
                  setIsAdmin={setIsAdmin}
                />
              </ProtectedAdminRoute>
            }
          />
        </Route>

        <Route path="/customer-login" element={<CustomerLogin setCurrentUser={setCurrentUser} />} />
        <Route path="/admin-login" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
        <Route path="/admin-register" element={<AdminRegister setIsAdmin={setIsAdmin} />} />
        <Route path="/register" element={<Register setCurrentUser={setCurrentUser} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;