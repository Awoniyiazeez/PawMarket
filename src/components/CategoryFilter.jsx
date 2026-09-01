export default function CategoryFilter({ selectedPet, setSelectedPet, selectedCategory, setSelectedCategory }) {
  const petTypes = ["All Pets", "Dogs", "Cats", "Birds", "Rabbits"];
  const categories = ["All Categories", "Pets", "Pet Food", "Accessories", "Grooming Supplies", "Cages & Carriers", "Toys"];

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", margin: "20px 0" }}>
      {/* Pet Selection */}
      <div style={{ display: "flex", gap: "8px" }}>
        {petTypes.map((pet) => (
          <button
            key={pet}
            onClick={() => setSelectedPet(pet)}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "1px solid #1b4332",
              background: selectedPet === pet ? "#1b4332" : "#fff",
              color: selectedPet === pet ? "#fff" : "#1b4332",
              cursor: "pointer",
            }}
          >
            {pet}
          </button>
        ))}
      </div>

      {/* Category Dropdown */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        style={{ padding: "8px 12px", borderRadius: "6px", borderColor: "#ccc" }}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
}