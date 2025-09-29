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

  return (
    <section style={{ marginTop: "2rem" }}>
      <h2>Middager</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <input
          value={newRecipeName}
          onChange={e => setNewRecipeName(e.target.value)}
          placeholder="Navn på rett"
        />
        <input
          value={newRecipeIngredients}
          onChange={e => setNewRecipeIngredients(e.target.value)}
          placeholder="Ingredienser, kommaseparert"
        />
        <button onClick={addRecipe}>Legg til oppskrift</button>
      </div>

      <ul>
        {recipes.map((rec, idx) => (
          <li key={idx} style={{ marginTop: 12 }}>
            <strong>{rec.name}</strong>
            <button onClick={() => useRecipe(rec)} style={{ marginLeft: 8 }}>
              Legg ingredienser i handlelista
            </button>
            <ul>
              {rec.ingredients.map((ing, j) => (
                <li key={j}>{ing}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}