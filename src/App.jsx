import { useState, useEffect } from "react";
import RecipesMenu from "./components/RecipesMenu";
import ShoppingList from "./components/ShoppingList";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  const addIngredientsToList = (ingredients) => {
    const existing = new Set(items.map(i => i.name.toLowerCase()));
    const toAdd = ingredients
      .filter(ing => !existing.has(ing.toLowerCase()))
      .map(ing => ({ name: ing, bought: false }));
    if (toAdd.length) setItems(prev => [...prev, ...toAdd]);
  };


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
    <div className="app">
      <header className="app-header">
        <h1>🛒 Handleliste & Oppskrifter</h1>
        <p>Planlegg middager og lag handleliste</p>
      </header>
      
      <main className="app-main">
        <ShoppingList 
          items={items}
          newItem={newItem}
          setNewItem={setNewItem}
          addItem={addItem}
          toggleItem={toggleItem}
        />
        
        <RecipesMenu onAddIngredients={addIngredientsToList} />
      </main>
    </div>
  );
}

export default App;
