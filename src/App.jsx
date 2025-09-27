import { useState, useEffect } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  // Hent lagrede varer fra localStorage
  useEffect(() => {
    const saved = localStorage.getItem("shopping-list");
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  // Lagre til localStorage hver gang items oppdateres
  useEffect(() => {
    localStorage.setItem("shopping-list", JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (newItem.trim() === "") return;
    setItems([...items, { name: newItem, bought: false }]);
    setNewItem("");
  };

  const toggleItem = (index) => {
    const updated = [...items];
    updated[index].bought = !updated[index].bought;
    setItems(updated);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🛒 Handleliste</h1>
      <p>App is working! React is loaded successfully.</p>
      <input
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder="Legg til vare..."
      />
      <button onClick={addItem}>Legg til</button>

      <ul>
        {items.map((item, i) => (
          <li
            key={i}
            onClick={() => toggleItem(i)}
            style={{
              textDecoration: item.bought ? "line-through" : "none",
              cursor: "pointer",
            }}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
