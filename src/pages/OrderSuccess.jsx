import { useState } from "react";
import { useLocation, Link } from "react-router-dom";

function OrderSuccess() {
  const location = useLocation();

  // 1. Read from location.state OR fallback to sessionStorage if App re-renders
  const [orderData] = useState(() => {
    if (location.state?.order) {
      sessionStorage.setItem("lastOrder", JSON.stringify(location.state.order));
      sessionStorage.setItem("lastWhatsappUrl", location.state.whatsappUrl || "");
      return {
        order: location.state.order,
        whatsappUrl: location.state.whatsappUrl,
      };
    }

    // Backup retrieval if state wiped
    const savedOrder = sessionStorage.getItem("lastOrder");
    const savedUrl = sessionStorage.getItem("lastWhatsappUrl");

    return {
      order: savedOrder ? JSON.parse(savedOrder) : null,
      whatsappUrl: savedUrl || "",
    };
  });

  const { order, whatsappUrl } = orderData;

  if (!order) {
    return (
      <div className="success-page" style={{ padding: "40px", textAlign: "center" }}>
        <h1>No Active Order Found</h1>
        <p>Your session may have refreshed.</p>
        <Link to="/"><button style={{ padding: "10px 18px", marginTop: "10px" }}>Return Home</button></Link>
      </div>
    );
  }

  return (
    <div className="success-page" style={{ padding: "30px", textAlign: "center" }}>
      <h1>🎉 Payment Successful!</h1>
      <p>Thank you for your order on PawMarket.</p>
      <h2>Order Reference: #{String(order.id || order.paymentRef || "").slice(0, 8)}</h2>

      {whatsappUrl && (
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <button
            style={{
              background: "#25D366",
              color: "#fff",
              padding: "14px 20px",
              margin: "20px 0",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              width: "100%",
              maxWidth: "320px",
            }}
          >
            💬 Send Order Receipt on WhatsApp
          </button>
        </a>
      )}

      <div>
        <Link to="/">
          <button style={{ padding: "10px 18px", marginTop: "10px" }}>
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccess;