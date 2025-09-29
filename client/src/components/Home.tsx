import React, { useState, useEffect } from "react";
import RecipesMenu from "./RecipesMenu";
import ShoppingList from "./ShoppingList";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  const addIngredientsToList = (ingredients) => {
    const existing = new Set(items.map(i => i.name.toLowerCase()));
    const toAdd = ingredients
      .filter(ing => !existing.has(ing.toLowerCase()))
      .map(ing => ({ name: ing, bought: false }));
    if (toAdd.length) setItems(prev => [...prev, ...toAdd]);
  };

  // Load saved items from localStorage (could be moved to backend later)
  useEffect(() => {
    const saved = localStorage.getItem(`shopping-list-${user?.id}`);
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, [user?.id]);

  // Save to localStorage when items update (could be moved to backend later)
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`shopping-list-${user.id}`, JSON.stringify(items));
    }
  }, [items, user?.id]);

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>🛒 Handleliste & Oppskrifter</h1>
            <p>Hei {user?.firstName || user?.email}! Planlegg middager og lag handleliste</p>
          </div>
          <button
            onClick={() => window.location.href = '/api/logout'}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logg ut
          </button>
        </div>
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