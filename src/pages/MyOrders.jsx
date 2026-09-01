import React from "react";
import { Link } from "react-router-dom";

export default function MyOrders({ orders = [], currentUser, loading }) {
  // Match orders by user ID or user email
  const userOrders = orders.filter((order) => {
    const orderUserId = order.user_info?.id;
    const orderUserEmail = order.user_info?.email || order.customer?.email;

    return (
      (orderUserId && orderUserId === currentUser?.id) ||
      (orderUserEmail && orderUserEmail.toLowerCase() === currentUser?.email?.toLowerCase())
    );
  });

  if (loading) {
    return <div className="loading-spinner">Loading your orders...</div>;
  }

  return (
    <div className="my-orders-container">
      <h2>My Orders</h2>

      {userOrders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <Link to="/" className="shop-now-btn">
            Browse Dogs
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {userOrders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <span className="order-id">Order #{order.id}</span>
                  <span className="order-date">
                    {new Date(order.created_at || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <span className={`status-badge ${order.status?.toLowerCase()}`}>
                  {order.status || "Pending"}
                </span>
              </div>

              <div className="order-items">
                {order.dogs &&
                  order.dogs.map((dog, index) => (
                    <div key={index} className="order-item-row">
                      <img src={dog.image} alt={dog.name} className="order-item-img" />
                      <div className="order-item-info">
                        <h4>{dog.name}</h4>
                        <p>{dog.breed}</p>
                      </div>
                      <span className="order-item-price">₦{dog.price}</span>
                    </div>
                  ))}
              </div>

              <div className="order-footer">
                <span>Total Paid:</span>
                <strong>₦{Number(order.total).toLocaleString()}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}