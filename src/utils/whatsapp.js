// Target WhatsApp receiving phone number (Country code 234 + phone number without leading zero or '+')
const STORE_PHONE_NUMBER = "2347087276364"; 

// Helper function to format Naira currency values cleanly
function formatNaira(amount) {
  if (amount === undefined || amount === null) return "₦0";
  const num = typeof amount === "number" ? amount : Number(String(amount).replace(/[^0-9.-]+/g, "")) || 0;
  return "₦" + num.toLocaleString("en-NG");
}

// Generates a pre-filled WhatsApp message URL for an entire order
export function generateOrderWhatsAppLink(order = {}) {
  const dogsArray = Array.isArray(order.dogs) ? order.dogs : [];
  
  const dogList = dogsArray.length > 0
    ? dogsArray.map((dog) => `• *${dog.name || "Dog"}* (${dog.breed || "N/A"}) - ${formatNaira(dog.price)}`).join("\n")
    : "• No items listed";

  const customerName = order.customer?.fullName || order.user_info?.name || "Customer";
  const customerPhone = order.customer?.phone || "N/A";
  const customerAddress = order.customer?.address || "N/A";
  const orderId = String(order.id || order.paymentRef || new Date().getTime()).slice(0, 8);

  const message = 
`🐾 *NEW ORDER PLACED ON PAWMARKET*
----------------------------------
*Order ID:* #${orderId}
*Customer Name:* ${customerName}
*Phone:* ${customerPhone}
*Delivery Address:* ${customerAddress}

📦 *ORDERED DOGS:*
${dogList}

💰 *PAYMENT BREAKDOWN:*
• *Subtotal:* ${formatNaira(order.subtotal)}
• *Delivery Fee:* ${formatNaira(order.delivery_fee)}
• *Total Paid:* ${formatNaira(order.total)}

----------------------------------
Please confirm my order details!`;

  return `https://wa.me/${STORE_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
}