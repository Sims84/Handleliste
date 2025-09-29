import React, { useState, useEffect } from "react";

export default function ShoppingList({ 
  items, 
  newItem, 
  setNewItem, 
  addItem, 
  toggleItem 
}) {
  return (
    <section className="shopping-section">
      <h2>🛒 Handleliste</h2>
      
      <div className="add-item-form">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Legg til vare..."
          className="item-input"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              addItem();
            }
          }}
        />
        <button onClick={addItem} className="add-button">
          Legg til
        </button>
      </div>

      {items.length === 0 ? (
        <p className="empty-state">Ingen varer i handlelista ennå.</p>
      ) : (
        <ul className="shopping-list">
          {items.map((item, i) => (
            <li
              key={i}
              onClick={() => toggleItem(i)}
              className={`shopping-item ${item.bought ? 'bought' : ''}`}
            >
              <span className="item-name">{item.name}</span>
              <span className="item-status">
                {item.bought ? '✓' : '○'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}