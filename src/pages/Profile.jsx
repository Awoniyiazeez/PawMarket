import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Profile({ currentUser, setCurrentUser, orders = [] }) {
  const [name, setName] = useState(currentUser?.name || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [address, setAddress] = useState(currentUser?.address || "");
  const [profileImage, setProfileImage] = useState(
    currentUser?.profileImage || ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Sync state if currentUser changes from parent props
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setPhone(currentUser.phone || "");
      setAddress(currentUser.address || "");
      setProfileImage(currentUser.profileImage || "");
    }
  }, [currentUser]);

  // Calculate dynamic stats scoped to current user
  const userOrders = orders.filter(
    (order) => order.user_info?.id === currentUser?.id
  );
  const totalOrders = userOrders.length;
  const totalSpent = userOrders.reduce(
    (sum, order) => sum + (Number(order.total) || 0),
    0
  );

  // Auto-compresses camera photos into lightweight Base64 to render reliably across devices
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 400; // Optimal resolution for avatar display
        const scaleFactor = MAX_WIDTH / img.width;

        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleFactor;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Compress image to JPEG with 70% quality
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
        setProfileImage(compressedDataUrl);
      };
      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      // 1. Check for active session before attempting update
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error("Your session expired. Please log out and log back in.");
      }

      const updatedData = {
        name,
        phone,
        address,
        profileImage,
      };

      // 2. Persist updated metadata to Supabase Auth
      const { error } = await supabase.auth.updateUser({
        data: updatedData,
      });

      if (error) throw error;

      // 3. Sync global parent App state
      setCurrentUser((prev) => ({
        ...prev,
        ...updatedData,
      }));

      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      console.error("Profile save error:", err);
      setMessage({
        type: "error",
        text: err.message || "Failed to update profile.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const firstInitial = (currentUser?.name || currentUser?.email || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Header & Avatar Upload */}
        <div className="profile-header">
          <div className="avatar-wrapper">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile Avatar"
                className="profile-avatar"
              />
            ) : (
              <div className="profile-avatar-placeholder">{firstInitial}</div>
            )}

            <label
              htmlFor="photo-upload"
              className="photo-upload-badge"
              title="Take or Choose Photo"
            >
              📷
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                capture="user" /* Triggers mobile camera directly */
                onChange={handleImageUpload}
                hidden
              />
            </label>
          </div>
          <h2>{name || "User Profile"}</h2>
          <p className="profile-email">{currentUser?.email}</p>
        </div>

        {/* Dynamic Metric Display */}
        <div className="profile-stats-grid">
          <div className="stat-card">
            <span className="stat-icon">📦</span>
            <div className="stat-info">
              <span className="stat-value">{totalOrders}</span>
              <span className="stat-label">Total Orders</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">💳</span>
            <div className="stat-info">
              <span className="stat-value">
                ₦{totalSpent.toLocaleString()}
              </span>
              <span className="stat-label">Total Spent</span>
            </div>
          </div>
        </div>

        {/* Feedback Alert */}
        {message.text && (
          <div className={`profile-alert ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Account Details Form */}
        <form onSubmit={handleSave} className="profile-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={currentUser?.email || ""}
              disabled
              className="disabled-input"
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234 XXX XXX XXXX"
            />
          </div>

          <div className="form-group">
            <label>Delivery Address</label>
            <textarea
              rows="3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter street address, city, state"
            />
          </div>

          <button type="submit" className="save-btn" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}