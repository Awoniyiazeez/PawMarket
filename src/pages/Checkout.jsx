import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePaystackPayment } from "react-paystack";
import { generateOrderWhatsAppLink } from "../utils/whatsapp";

function Checkout({ cart = [], currentUser, placeOrder }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    address: currentUser?.address || "",
  });

  // Keep form data in sync when currentUser loads/updates asynchronously
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        fullName: prev.fullName || currentUser.name || "",
        email: prev.email || currentUser.email || "",
        phone: prev.phone || currentUser.phone || "",
        address: prev.address || currentUser.address || "",
      }));
    }
  }, [currentUser]);

  const deliveryFee = 10000;
  const subtotal = cart.reduce((total, dog) => {
    const raw = Number(String(dog.price).replace(/[^0-9.-]+/g, "")) || 0;
    return total + raw;
  }, 0);
  const totalAmount = subtotal + deliveryFee;

  // Paystack Configuration
  const paystackConfig = {
    reference: "PM_" + new Date().getTime().toString(),
    email: formData.email || currentUser?.email || "customer@example.com",
    amount: totalAmount * 100,
    publicKey: "pk_test_6d705d50a629c24bc3ed86b2dc12aeff004623bd",
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaystackSuccess = async (reference) => {
    // Construct rich customer payload with user ID explicitly included
    const payload = {
      ...formData,
      id: currentUser?.id,
      email: formData.email || currentUser?.email,
    };

    // 1. Save order to Supabase database
    let savedDbOrder = null;
    if (typeof placeOrder === "function") {
      try {
        savedDbOrder = await placeOrder(payload);
      } catch (err) {
        console.error("Failed to save order to database:", err);
      }
    }

    // 2. Fallback local order data if DB write fails or returns empty
    const localOrderData = savedDbOrder || {
      id: reference.reference,
      customer: payload,
      user_info: {
        id: currentUser?.id,
        email: payload.email,
        name: payload.fullName,
      },
      dogs: cart,
      subtotal,
      delivery_fee: deliveryFee,
      total: totalAmount,
      paymentRef: reference.reference,
    };

    // 3. Generate WhatsApp confirmation link
    const whatsappUrl = generateOrderWhatsAppLink(localOrderData);

    // 4. Navigate to success screen passing order state
    navigate("/success", { state: { order: localOrderData, whatsappUrl } });
  };

  const handlePaystackClose = () => {
    alert("Payment process canceled.");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      alert("Please fill in all required delivery details.");
      return;
    }

    // Launch Paystack modal
    initializePayment(handlePaystackSuccess, handlePaystackClose);
  };

  return (
    <div className="checkout-page">
      <h1>Checkout & Delivery Details</h1>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="customer@example.com"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            placeholder="08012345678"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Delivery Address</label>
          <textarea
            id="address"
            name="address"
            placeholder="Enter full street address, city, and state"
            value={formData.address}
            onChange={handleInputChange}
            rows="3"
            required
          />
        </div>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal:</span>
            <strong>₦{subtotal.toLocaleString("en-NG")}</strong>
          </div>
          <div className="summary-row">
            <span>Delivery Fee:</span>
            <strong>₦{deliveryFee.toLocaleString("en-NG")}</strong>
          </div>
          <hr />
          <div className="summary-row total">
            <span>Total:</span>
            <strong>₦{totalAmount.toLocaleString("en-NG")}</strong>
          </div>
        </div>

        <button type="submit" className="pay-btn">
          Pay Now with Paystack 💳
        </button>
      </form>
    </div>
  );
}

export default Checkout;