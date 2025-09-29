import React, { useState, useEffect } from "react";

export default function RecipesMenu({ onAddIngredients }) {
  const [recipes, setRecipes] = useState([]);
  const [newRecipeName, setNewRecipeName] = useState("");
  const [newRecipeIngredients, setNewRecipeIngredients] = useState("");

  // last recipes fra localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recipes");
    if (saved) setRecipes(JSON.parse(saved));
  }, []);

  // lagre recipes
  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }, [recipes]);

  const addRecipe = () => {
    if (!newRecipeName.trim()) return;
    const ingList = newRecipeIngredients
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
    setRecipes([...recipes, { name: newRecipeName.trim(), ingredients: ingList }]);
    setNewRecipeName("");
    setNewRecipeIngredients("");
  };

  const useRecipe = (rec) => {
    if (typeof onAddIngredients === "function") {
      onAddIngredients(rec.ingredients);
    }
  };

  const handleKeyPress = (e, field) => {
    if (e.key === 'Enter') {
      if (field === 'name') {
        // Focus on ingredients field
        e.target.parentElement.querySelector('input[placeholder*="Ingredienser"]')?.focus();
      } else {
        addRecipe();
      }
    }
  };

  return (
    <section className="recipes-section">
      <h2>🍽️ Oppskrifter</h2>

      <div className="recipe-form">
        <input
          value={newRecipeName}
          onChange={e => setNewRecipeName(e.target.value)}
          onKeyPress={e => handleKeyPress(e, 'name')}
          placeholder="Navn på rett"
          className="recipe-input"
        />
        <input
          value={newRecipeIngredients}
          onChange={e => setNewRecipeIngredients(e.target.value)}
          onKeyPress={e => handleKeyPress(e, 'ingredients')}
          placeholder="Ingredienser, kommaseparert"
          className="recipe-input"
        />
        <button onClick={addRecipe} className="recipe-button">
          Legg til oppskrift
        </button>
      </div>

      {recipes.length === 0 ? (
        <p className="empty-state">Ingen oppskrifter ennå. Legg til din første oppskrift!</p>
      ) : (
        <ul className="recipe-list">
          {recipes.map((rec, idx) => (
            <li key={idx} className="recipe-item">
              <div className="recipe-header">
                <span className="recipe-name">{rec.name}</span>
                <button 
                  onClick={() => useRecipe(rec)} 
                  className="use-recipe-button"
                >
                  → Handleliste
                </button>
              </div>
              <ul className="ingredients-list">
                {rec.ingredients.map((ing, j) => (
                  <li key={j} className="ingredient-item">{ing}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}