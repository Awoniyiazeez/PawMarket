import { useState } from "react";
import { supabase } from "../lib/supabase";

function Admin({
  dogs = [],
  orders = [],
  customers = [],
  addDog,
  updateDog,
  deleteDog,
  updateOrderStatus,
  updateCustomerStatus,
  deleteCustomer,
  setIsAdmin,
}) {
  const [activeTab, setActiveTab] = useState("dogs");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingDogId, setEditingDogId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [dogForm, setDogForm] = useState({
    name: "",
    breed: "",
    pet_type: "Dogs",
    category: "Pets",
    age: "1 year",
    gender: "Male",
    price: "",
    location: "Lagos",
    description: "",
    image: null,
  });

  // Dynamic Dashboard Statistics
  const totalDogs = dogs.length;
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const pendingOrders = orders.filter(
    (o) => (o.status || "Pending").toLowerCase() === "pending"
  ).length;
  const totalRevenue = orders.reduce(
    (acc, order) => acc + (Number(order.total) || 0),
    0
  );

  async function handleLogout() {
    await supabase.auth.signOut();
    setIsAdmin(false);
  }

  function handleDogInputChange(e) {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      setDogForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setDogForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  // Upload Image File to Supabase Storage Bucket ('pet-images')
  async function uploadImageToStorage(file) {
    if (!file || typeof file === "string") return file;

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `listings/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("pet-images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Storage Upload Error:", uploadError.message);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("pet-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  function handleEditDogClick(dog) {
    setEditingDogId(dog.id);
    setDogForm({
      name: dog.name || "",
      breed: dog.breed || "",
      pet_type: dog.pet_type || "Dogs",
      category: dog.category || "Pets",
      age: dog.age || "1 year",
      gender: dog.gender || "Male",
      price: dog.price || "",
      location: dog.location || "Lagos",
      description: dog.description || "",
      image: dog.image || null,
    });
  }

  function handleCancelDogEdit() {
    setEditingDogId(null);
    setDogForm({
      name: "",
      breed: "",
      pet_type: "Dogs",
      category: "Pets",
      age: "1 year",
      gender: "Male",
      price: "",
      location: "Lagos",
      description: "",
      image: null,
    });
  }

  async function handleDogSubmit(e) {
    e.preventDefault();
    setIsUploading(true);

    try {
      let imageUrl = dogForm.image;

      if (dogForm.image && typeof dogForm.image !== "string") {
        imageUrl = await uploadImageToStorage(dogForm.image);
      }

      const payload = { ...dogForm, image: imageUrl };

      if (editingDogId) {
        await updateDog(editingDogId, payload);
      } else {
        await addDog(payload);
      }
      handleCancelDogEdit();
    } catch (err) {
      alert("Failed to save listing: " + err.message);
    } finally {
      setIsUploading(false);
    }
  }

  const getOrderStatusStyle = (status) => {
    const current = (status || "Pending").toLowerCase();
    switch (current) {
      case "delivered":
        return { background: "#d1fae5", color: "#065f46" };
      case "shipped":
        return { background: "#dbeafe", color: "#1e40af" };
      case "cancelled":
        return { background: "#fee2e2", color: "#991b1b" };
      default:
        return { background: "#fef3c7", color: "#92400e" };
    }
  };

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>
            Manage inventory, track customer orders, and control registered users.
          </p>
        </div>
        <button type="button" onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      {/* Metrics Row */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Available Listings</span>
          <span style={styles.statValue}>{totalDogs}</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Total Orders</span>
          <span style={styles.statValue}>{totalOrders}</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Pending Orders</span>
          <span style={{ ...styles.statValue, color: "#d97706" }}>{pendingOrders}</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Registered Customers</span>
          <span style={{ ...styles.statValue, color: "#2563eb" }}>{totalCustomers}</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Total Revenue</span>
          <span style={{ ...styles.statValue, color: "#10b981" }}>
            ₦{totalRevenue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div style={styles.tabBar}>
        <button
          type="button"
          onClick={() => setActiveTab("dogs")}
          style={{ ...styles.tabBtn, ...(activeTab === "dogs" ? styles.activeTabBtn : {}) }}
        >
          Manage Listings ({totalDogs})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          style={{ ...styles.tabBtn, ...(activeTab === "orders" ? styles.activeTabBtn : {}) }}
        >
          Manage Orders ({totalOrders})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("customers")}
          style={{ ...styles.tabBtn, ...(activeTab === "customers" ? styles.activeTabBtn : {}) }}
        >
          Manage Customers ({totalCustomers})
        </button>
      </div>

      {/* TAB 1: PRODUCT & PET LISTINGS */}
      {activeTab === "dogs" && (
        <div>
          <div style={styles.card}>
            <h2 style={styles.cardHeader}>
              {editingDogId ? "✏️ Edit Item Listing" : "➕ Add New Item / Pet Listing"}
            </h2>
            <form onSubmit={handleDogSubmit}>
              <div style={styles.formGrid}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Name / Title</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. German Shepherd / Royal Canin"
                    value={dogForm.name}
                    onChange={handleDogInputChange}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Pet Type</label>
                  <select
                    name="pet_type"
                    value={dogForm.pet_type}
                    onChange={handleDogInputChange}
                    style={styles.input}
                  >
                    <option value="Dogs">Dogs</option>
                    <option value="Cats">Cats</option>
                    <option value="Birds">Birds</option>
                    <option value="Rabbits">Rabbits</option>
                    <option value="General">General / All Pets</option>
                  </select>
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Category</label>
                  <select
                    name="category"
                    value={dogForm.category}
                    onChange={handleDogInputChange}
                    style={styles.input}
                  >
                    <option value="Pets">Live Pets</option>
                    <option value="Pet Food">Pet Food</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Care & Grooming">Care & Grooming</option>
                    <option value="Cages & Carriers">Cages & Carriers</option>
                    <option value="Toys">Toys & More</option>
                  </select>
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Breed / Brand</label>
                  <input
                    type="text"
                    name="breed"
                    placeholder="e.g. Siberian Husky / Pedigree"
                    value={dogForm.breed}
                    onChange={handleDogInputChange}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Age / Specification</label>
                  <input
                    type="text"
                    name="age"
                    placeholder="e.g. 8 weeks / 10kg Bag"
                    value={dogForm.age}
                    onChange={handleDogInputChange}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Gender / Variant</label>
                  <select
                    name="gender"
                    value={dogForm.gender}
                    onChange={handleDogInputChange}
                    style={styles.input}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="N/A">N/A (Food/Accessory)</option>
                  </select>
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Price (NGN)</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="e.g. 250000"
                    value={dogForm.price}
                    onChange={handleDogInputChange}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Location</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. Lagos"
                    value={dogForm.location}
                    onChange={handleDogInputChange}
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={{ ...styles.fieldGroup, marginTop: "16px" }}>
                <label style={styles.label}>Item Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleDogInputChange}
                  style={styles.fileInput}
                />
                {dogForm.image && (
                  <div style={{ marginTop: "8px" }}>
                    <img
                      src={
                        typeof dogForm.image === "string"
                          ? dogForm.image
                          : URL.createObjectURL(dogForm.image)
                      }
                      alt="Preview"
                      style={{ width: "60px", height: "60px", borderRadius: "6px", objectFit: "cover" }}
                    />
                  </div>
                )}
              </div>

              <div style={{ ...styles.fieldGroup, marginTop: "16px" }}>
                <label style={styles.label}>Description</label>
                <textarea
                  name="description"
                  placeholder="Provide details on temperament, ingredients, or specifications..."
                  value={dogForm.description}
                  onChange={handleDogInputChange}
                  rows="3"
                  style={{ ...styles.input, resize: "vertical" }}
                ></textarea>
              </div>

              <div style={styles.btnRow}>
                <button type="submit" disabled={isUploading} style={styles.primaryBtn}>
                  {isUploading ? "Uploading..." : editingDogId ? "Update Listing" : "Save Listing"}
                </button>
                {editingDogId && (
                  <button
                    type="button"
                    onClick={handleCancelDogEdit}
                    style={styles.secondaryBtn}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardHeader}>Current Store Inventory</h2>
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Image</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Type / Category</th>
                    <th style={styles.th}>Breed/Brand</th>
                    <th style={styles.th}>Price</th>
                    <th style={styles.th}>Location</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dogs.length > 0 ? (
                    dogs.map((dog) => (
                      <tr key={dog.id} style={styles.tr}>
                        <td style={styles.td}>
                          <img
                            src={
                              typeof dog.image === "string"
                                ? dog.image
                                : "https://via.placeholder.com/50"
                            }
                            alt={dog.name}
                            style={styles.thumbnail}
                          />
                        </td>
                        <td style={{ ...styles.td, fontWeight: "600" }}>{dog.name}</td>
                        <td style={styles.td}>
                          {dog.pet_type || "Dogs"} / {dog.category || "Pets"}
                        </td>
                        <td style={styles.td}>{dog.breed}</td>
                        <td style={styles.td}>₦{Number(dog.price).toLocaleString()}</td>
                        <td style={styles.td}>{dog.location || "Lagos"}</td>
                        <td style={styles.td}>
                          <button
                            type="button"
                            onClick={() => handleEditDogClick(dog)}
                            style={styles.actionEditBtn}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteDog(dog.id)}
                            style={styles.actionDeleteBtn}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={styles.emptyTd}>No inventory items found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS */}
      {activeTab === "orders" && (
        <div style={styles.card}>
          <h2 style={styles.cardHeader}>Customer Orders</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Order ID</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Items</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => {
                    const badgeStyle = getOrderStatusStyle(order.status);
                    return (
                      <tr key={order.id} style={styles.tr}>
                        <td style={{ ...styles.td, fontWeight: "600" }}>#{order.id}</td>
                        <td style={styles.td}>
                          <div>{order.customer?.fullName || order.name || "Customer"}</div>
                          <div style={{ fontSize: "12px", color: "#6b7280" }}>
                            {order.customer?.email || order.email || ""}
                          </div>
                        </td>
                        <td style={styles.td}>
                          {Array.isArray(order.items) ? order.items.length : 1} item(s)
                        </td>
                        <td style={{ ...styles.td, fontWeight: "600" }}>
                          ₦{Number(order.total || 0).toLocaleString()}
                        </td>
                        <td style={styles.td}>
                          <span style={{ ...styles.badge, ...badgeStyle }}>
                            {order.status || "Pending"}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <select
                            value={order.status || "Pending"}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            style={styles.selectInput}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" style={styles.emptyTd}>No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMERS */}
      {activeTab === "customers" && (
        <div style={styles.card}>
          <h2 style={styles.cardHeader}>Registered Customer Accounts</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Customer Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Account Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length > 0 ? (
                  customers.map((customer) => {
                    const isActive =
                      (customer.status || "active").toLowerCase() === "active";
                    return (
                      <tr key={customer.id} style={styles.tr}>
                        <td style={{ ...styles.td, fontWeight: "600" }}>
                          {customer.fullName || customer.name || "N/A"}
                        </td>
                        <td style={styles.td}>{customer.email}</td>
                        <td style={styles.td}>{customer.phone || "N/A"}</td>
                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.badge,
                              background: isActive ? "#d1fae5" : "#fee2e2",
                              color: isActive ? "#065f46" : "#991b1b",
                            }}
                          >
                            {isActive ? "Active" : "Deactivated"}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <button
                            type="button"
                            onClick={() => setSelectedCustomer(customer)}
                            style={styles.actionViewBtn}
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateCustomerStatus(
                                customer.id,
                                isActive ? "deactivated" : "active"
                              )
                            }
                            style={{
                              ...styles.actionToggleBtn,
                              background: isActive ? "#fef3c7" : "#d1fae5",
                              color: isActive ? "#92400e" : "#065f46",
                            }}
                          >
                            {isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteCustomer(customer.id)}
                            style={styles.actionDeleteBtn}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" style={styles.emptyTd}>No customers registered yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Details Popup Modal */}
      {selectedCustomer && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{ marginTop: 0, color: "#1b4332" }}>Customer Details</h3>
            <div style={styles.modalBody}>
              <p><strong>ID:</strong> {selectedCustomer.id}</p>
              <p><strong>Full Name:</strong> {selectedCustomer.fullName || selectedCustomer.name || "N/A"}</p>
              <p><strong>Email:</strong> {selectedCustomer.email}</p>
              <p><strong>Phone:</strong> {selectedCustomer.phone || "N/A"}</p>
              <p><strong>Shipping Address:</strong> {selectedCustomer.address || "N/A"}</p>
              <p><strong>Account Status:</strong> {selectedCustomer.status || "Active"}</p>
              <p>
                <strong>Date Joined:</strong>{" "}
                {selectedCustomer.created_at
                  ? new Date(selectedCustomer.created_at).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedCustomer(null)}
              style={{ ...styles.primaryBtn, marginTop: "20px", width: "100%" }}
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "30px auto",
    padding: "0 20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: "#111827",
  },
  header: {
    display: "flex",
    justifySpaceBetween: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "24px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    margin: 0,
    color: "#1b4332",
  },
  subtitle: {
    margin: "4px 0 0 0",
    fontSize: "14px",
    color: "#6b7280",
  },
  logoutBtn: {
    padding: "10px 20px",
    background: "#ef4444",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "30px",
  },
  statCard: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
  },
  statLabel: {
    fontSize: "13px",
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: "6px",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1b4332",
  },
  tabBar: {
    display: "flex",
    gap: "12px",
    borderBottom: "2px solid #e5e7eb",
    marginBottom: "24px",
  },
  tabBtn: {
    padding: "12px 20px",
    background: "transparent",
    border: "none",
    borderBottom: "3px solid transparent",
    fontSize: "15px",
    fontWeight: "600",
    color: "#6b7280",
    cursor: "pointer",
  },
  activeTabBtn: {
    color: "#1b4332",
    borderBottomColor: "#1b4332",
  },
  card: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    marginBottom: "30px",
  },
  cardHeader: {
    fontSize: "18px",
    fontWeight: "600",
    marginTop: 0,
    marginBottom: "20px",
    color: "#1f2937",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "6px",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  fileInput: {
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    background: "#f9fafb",
  },
  btnRow: {
    marginTop: "20px",
    display: "flex",
    gap: "12px",
  },
  primaryBtn: {
    padding: "12px 24px",
    background: "#1b4332",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "12px 24px",
    background: "#6b7280",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    minWidth: "650px",
  },
  th: {
    padding: "12px 16px",
    background: "#f9fafb",
    color: "#4b5563",
    fontSize: "13px",
    fontWeight: "600",
    borderBottom: "1px solid #e5e7eb",
  },
  tr: {
    borderBottom: "1px solid #f3f4f6",
  },
  td: {
    padding: "14px 16px",
    fontSize: "14px",
    color: "#1f2937",
    verticalAlign: "middle",
  },
  emptyTd: {
    padding: "30px",
    textAlign: "center",
    color: "#9ca3af",
  },
  thumbnail: {
    width: "48px",
    height: "48px",
    borderRadius: "8px",
    objectFit: "cover",
  },
  badge: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block",
  },
  selectInput: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "13px",
    background: "#ffffff",
  },
  actionEditBtn: {
    padding: "6px 12px",
    marginRight: "8px",
    background: "#f3f4f6",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    cursor: "pointer",
  },
  actionViewBtn: {
    padding: "6px 12px",
    marginRight: "8px",
    background: "#e0e7ff",
    color: "#3730a3",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
  },
  actionToggleBtn: {
    padding: "6px 12px",
    marginRight: "8px",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
  },
  actionDeleteBtn: {
    padding: "6px 12px",
    background: "#fee2e2",
    color: "#dc2626",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "450px",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
  },
  modalBody: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#374151",
  },
};

export default Admin;