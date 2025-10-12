import React, { useState, useEffect } from "react";
import RecipesMenu from "./RecipesMenu";
import ShoppingList from "./ShoppingList";
import { useAuth } from "../hooks/useAuth";
import { 
  parseIngredient, 
  mergeIngredients, 
  findMatchingItem,
  ParsedIngredient 
} from "../lib/ingredientParser";

export default function Home() {
  const { user } = useAuth();
  const [items, setItems] = useState<ParsedIngredient[]>([]);
  const [newItem, setNewItem] = useState("");

  const addIngredientsToList = (ingredients: string[]) => {
    setItems(prev => {
      let updated = [...prev];
      
      for (const ingredientStr of ingredients) {
        const parsed = parseIngredient(ingredientStr);
        const matchIndex = findMatchingItem(updated, parsed);
        
        if (matchIndex !== -1) {
          // Try to merge with existing item
          const merged = mergeIngredients(updated[matchIndex], parsed);
          if (merged) {
            updated[matchIndex] = merged;
          } else {
            // Can't merge (e.g., different units), add as new item
            updated.push({ ...parsed, bought: false });
          }
        } else {
          // New item, add it
          updated.push({ ...parsed, bought: false });
        }
      }
      
      return updated;
    });
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
    
    const parsed = parseIngredient(newItem);
    const matchIndex = findMatchingItem(items, parsed);
    
    if (matchIndex !== -1) {
      // Try to merge with existing item
      const merged = mergeIngredients(items[matchIndex], parsed);
      if (merged) {
        const updated = [...items];
        updated[matchIndex] = merged;
        setItems(updated);
      } else {
        // Can't merge (e.g., different units), add as new item
        setItems([...items, { ...parsed, bought: false }]);
      }
    } else {
      // New item, add it
      setItems([...items, { ...parsed, bought: false }]);
    }
    
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