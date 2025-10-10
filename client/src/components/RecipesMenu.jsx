import React, { useState, useEffect } from "react";

export default function RecipesMenu({ onAddIngredients }) {
  const [recipes, setRecipes] = useState([]);
  const [newRecipeName, setNewRecipeName] = useState("");
  const [newRecipeIngredients, setNewRecipeIngredients] = useState("");
  
  // Recipe URL import
  const [recipeUrl, setRecipeUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [showUrlImport, setShowUrlImport] = useState(false);

  // Fetch recipes from database
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/recipes');
      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      // Fallback to localStorage if backend fails
      const saved = localStorage.getItem("recipes");
      if (saved) setRecipes(JSON.parse(saved));
    }
  };

  const addRecipe = async () => {
    if (!newRecipeName.trim()) return;
    const ingList = newRecipeIngredients
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
    
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newRecipeName.trim(),
          ingredients: ingList,
        }),
      });

      if (response.ok) {
        await fetchRecipes();
        setNewRecipeName("");
        setNewRecipeIngredients("");
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
      // Fallback to localStorage
      setRecipes([...recipes, { name: newRecipeName.trim(), ingredients: ingList }]);
      setNewRecipeName("");
      setNewRecipeIngredients("");
    }
  };

  const deleteRecipe = async (recipeId) => {
    if (!confirm("Er du sikker på at du vil slette denne oppskriften?")) return;
    
    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchRecipes();
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const importFromUrl = async () => {
    if (!recipeUrl.trim()) return;
    
    setIsImporting(true);
    try {
      const response = await fetch('/api/recipes/import-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: recipeUrl }),
      });

      if (response.ok) {
        await fetchRecipes();
        setRecipeUrl("");
        alert("Oppskrift importert!");
      } else {
        const error = await response.json();
        alert(error.message || "Kunne ikke importere oppskrift. Sjekk at URL-en er riktig.");
      }
    } catch (error) {
      console.error("Error importing recipe:", error);
      alert("Kunne ikke importere oppskrift. Prøv igjen.");
    } finally {
      setIsImporting(false);
    }
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

  const handleUrlKeyPress = (e) => {
    if (e.key === 'Enter') {
      importFromUrl();
    }
  };

  return (
    <section className="recipes-section">
      <h2>🍽️ Oppskrifter</h2>

      {/* URL Import Toggle */}
      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={() => setShowUrlImport(!showUrlImport)}
          className="recipe-button"
          style={{ marginBottom: '0.5rem' }}
        >
          {showUrlImport ? '📝 Legg til manuelt' : '🔗 Importer fra URL'}
        </button>
      </div>

      {/* URL Import Section */}
      {showUrlImport && (
        <div className="url-import" style={{ 
          padding: '1rem', 
          backgroundColor: '#f0f8ff', 
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Importer oppskrift fra URL</h3>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#666' }}>
            Støtter Matprat.no, godt.no, tine.no og flere norske oppskriftsider
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="url"
              value={recipeUrl}
              onChange={e => setRecipeUrl(e.target.value)}
              onKeyPress={handleUrlKeyPress}
              placeholder="https://www.matprat.no/oppskrifter/..."
              className="recipe-input"
              style={{ flex: 1 }}
            />
            <button 
              onClick={importFromUrl}
              className="recipe-button"
              disabled={isImporting || !recipeUrl.trim()}
            >
              {isImporting ? 'Importerer...' : 'Importer'}
            </button>
          </div>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#666' }}>
            💡 Bla på Matprat, godt.no eller tine.no, kopier oppskriftens URL og lim inn her
          </p>
        </div>
      )}

      {/* Manual Recipe Form */}
      {!showUrlImport && (
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
      )}

      {/* Recipes List */}
      {recipes.length === 0 ? (
        <p className="empty-state">Ingen oppskrifter ennå. Legg til din første oppskrift!</p>
      ) : (
        <ul className="recipe-list">
          {recipes.map((rec) => (
            <li key={rec.id || rec.name} className="recipe-item">
              <div className="recipe-header">
                <span className="recipe-name">{rec.name}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => useRecipe(rec)} 
                    className="use-recipe-button"
                  >
                    → Handleliste
                  </button>
                  {rec.id && (
                    <button 
                      onClick={() => deleteRecipe(rec.id)}
                      className="use-recipe-button"
                      style={{ backgroundColor: '#dc3545' }}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
              <ul className="ingredients-list">
                {rec.ingredients.map((ing, j) => (
                  <li key={j} className="ingredient-item">{ing}</li>
                ))}
              </ul>
              {rec.sourceUrl && (
                <a 
                  href={rec.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.85rem', color: '#007bff' }}
                >
                  📖 Se original oppskrift
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
