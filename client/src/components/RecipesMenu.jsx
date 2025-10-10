import React, { useState, useEffect } from "react";

export default function RecipesMenu({ onAddIngredients }) {
  const [recipes, setRecipes] = useState([]);
  const [newRecipeName, setNewRecipeName] = useState("");
  const [newRecipeIngredients, setNewRecipeIngredients] = useState("");
  
  // Matprat search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

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

  const searchMatprat = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(`/api/matprat/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error("Error searching Matprat:", error);
      alert("Kunne ikke søke i Matprat. Prøv igjen senere.");
    } finally {
      setIsSearching(false);
    }
  };

  const importFromMatprat = async (url) => {
    try {
      const response = await fetch('/api/matprat/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        await fetchRecipes();
        setShowSearch(false);
        setSearchQuery("");
        setSearchResults([]);
        alert("Oppskrift importert!");
      } else {
        alert("Kunne ikke importere oppskrift. Prøv igjen.");
      }
    } catch (error) {
      console.error("Error importing recipe:", error);
      alert("Kunne ikke importere oppskrift. Prøv igjen.");
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

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchMatprat();
    }
  };

  return (
    <section className="recipes-section">
      <h2>🍽️ Oppskrifter</h2>

      {/* Matprat Search Toggle */}
      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={() => setShowSearch(!showSearch)}
          className="recipe-button"
          style={{ marginBottom: '0.5rem' }}
        >
          {showSearch ? '📝 Legg til manuelt' : '🔍 Søk på Matprat.no'}
        </button>
      </div>

      {/* Matprat Search Section */}
      {showSearch && (
        <div className="matprat-search" style={{ 
          padding: '1rem', 
          backgroundColor: '#f0f8ff', 
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Søk etter oppskrifter</h3>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              placeholder="Søk etter oppskrifter..."
              className="recipe-input"
              style={{ flex: 1 }}
            />
            <button 
              onClick={searchMatprat}
              className="recipe-button"
              disabled={isSearching}
            >
              {isSearching ? 'Søker...' : 'Søk'}
            </button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="search-results">
              <h4 style={{ marginTop: 0 }}>Søkeresultater:</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {searchResults.map((result, idx) => (
                  <li key={idx} style={{
                    padding: '0.75rem',
                    backgroundColor: 'white',
                    marginBottom: '0.5rem',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ flex: 1 }}>
                      <strong>{result.title}</strong>
                      {result.imageUrl && (
                        <img 
                          src={result.imageUrl} 
                          alt={result.title}
                          style={{ 
                            width: '60px', 
                            height: '60px', 
                            objectFit: 'cover',
                            borderRadius: '4px',
                            marginLeft: '0.5rem'
                          }}
                        />
                      )}
                    </div>
                    <button
                      onClick={() => importFromMatprat(result.url)}
                      className="use-recipe-button"
                      style={{ marginLeft: '1rem' }}
                    >
                      Importer
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Manual Recipe Form */}
      {!showSearch && (
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