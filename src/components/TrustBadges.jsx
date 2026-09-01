export default function TrustBadges() {
  const badges = [
    { title: "Healthy Pets", desc: "Well cared for and vaccinated" },
    { title: "Quality Products", desc: "Trusted brands and genuine supplies" },
    { title: "Fast & Reliable Delivery", desc: "To your doorstep across Nigeria" },
    { title: "Excellent Customer Support", desc: "We're always here to help" },
    { title: "Real Pet Lovers", desc: "Passionate about animals, just like you" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px", padding: "20px 0", borderTop: "1px solid #eaeaea" }}>
      {badges.map((b, i) => (
        <div key={i} style={{ textAlign: "center", padding: "10px" }}>
          <h4 style={{ margin: "5px 0", color: "#1b4332" }}>{b.title}</h4>
          <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>{b.desc}</p>
        </div>
      ))}
    </div>
  );
}