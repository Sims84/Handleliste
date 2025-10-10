import React from 'react';

export default function ShoppingList({ items, newItem, setNewItem, addItem, toggleItem }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addItem();
    }
  };

  const boughtItems = items.filter(item => item.bought);
  const pendingItems = items.filter(item => !item.bought);

  return (
    <section className="shopping-list">
      <h2>🛒 Handleliste</h2>
      
      <div className="add-item">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Legg til vare..."
          className="item-input"
        />
        <button onClick={addItem} className="add-button">
          Legg til
        </button>
      </div>

      {pendingItems.length > 0 && (
        <div className="items-section">
          <h3>Å handle ({pendingItems.length})</h3>
          <ul className="items-list">
            {pendingItems.map((item, i) => {
              const originalIndex = items.findIndex(originalItem => originalItem === item);
              return (
                <li
                  key={originalIndex}
                  onClick={() => toggleItem(originalIndex)}
                  className="item pending"
                >
                  <span className="item-checkbox">☐</span>
                  <span className="item-name">{item.name}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {boughtItems.length > 0 && (
        <div className="items-section">
          <h3>Handlet ({boughtItems.length})</h3>
          <ul className="items-list">
            {boughtItems.map((item, i) => {
              const originalIndex = items.findIndex(originalItem => originalItem === item);
              return (
                <li
                  key={originalIndex}
                  onClick={() => toggleItem(originalIndex)}
                  className="item bought"
                >
                  <span className="item-checkbox">☑</span>
                  <span className="item-name">{item.name}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {items.length === 0 && (
        <p className="empty-state">Din handleliste er tom. Legg til varer eller velg en oppskrift!</p>
      )}
    </section>
  );
}