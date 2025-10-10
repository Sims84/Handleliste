/**
 * Matprat.no Recipe Scraper
 * 
 * This service scrapes recipe data from Matprat.no
 * Please be respectful of their servers and implement rate limiting
 */

export interface ScrapedRecipe {
  name: string;
  ingredients: string[];
  instructions?: string;
  imageUrl?: string;
  sourceUrl: string;
}

export interface SearchResult {
  title: string;
  url: string;
  imageUrl?: string;
}

/**
 * Search for recipes on Matprat.no
 */
export async function searchMatprat(query: string): Promise<SearchResult[]> {
  try {
    const searchUrl = `https://www.matprat.no/api/search?q=${encodeURIComponent(query)}&type=recipe`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Handleliste App (Educational Purpose)',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse the response based on Matprat's API structure
    // Note: This may need adjustment based on actual API response
    if (data.recipes && Array.isArray(data.recipes)) {
      return data.recipes.map((recipe: any) => ({
        title: recipe.title || recipe.name,
        url: recipe.url || `https://www.matprat.no${recipe.path}`,
        imageUrl: recipe.image || recipe.imageUrl,
      }));
    }

    return [];
  } catch (error) {
    console.error('Matprat search error:', error);
    throw new Error('Failed to search Matprat');
  }
}

/**
 * Scrape a single recipe from a Matprat.no URL
 */
export async function scrapeRecipe(url: string): Promise<ScrapedRecipe> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Handleliste App (Educational Purpose)',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch recipe: ${response.status}`);
    }

    const html = await response.text();
    
    // Extract recipe data from HTML
    const recipe = parseRecipeFromHtml(html, url);
    
    return recipe;
  } catch (error) {
    console.error('Recipe scraping error:', error);
    throw new Error('Failed to scrape recipe');
  }
}

/**
 * Parse recipe data from HTML
 * Uses basic regex patterns to extract structured data
 */
function parseRecipeFromHtml(html: string, url: string): ScrapedRecipe {
  // Try to find JSON-LD structured data first (most reliable)
  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  
  if (jsonLdMatch) {
    try {
      const jsonData = JSON.parse(jsonLdMatch[1]);
      
      // Check if it's a Recipe schema
      if (jsonData['@type'] === 'Recipe' || (Array.isArray(jsonData['@graph']) && 
          jsonData['@graph'].some((item: any) => item['@type'] === 'Recipe'))) {
        
        const recipeData = jsonData['@type'] === 'Recipe' ? jsonData : 
          jsonData['@graph'].find((item: any) => item['@type'] === 'Recipe');
        
        return {
          name: recipeData.name || 'Unnamed Recipe',
          ingredients: Array.isArray(recipeData.recipeIngredient) 
            ? recipeData.recipeIngredient 
            : [],
          instructions: Array.isArray(recipeData.recipeInstructions)
            ? recipeData.recipeInstructions.map((step: any) => 
                typeof step === 'string' ? step : step.text || ''
              ).join('\n\n')
            : recipeData.recipeInstructions,
          imageUrl: recipeData.image?.url || recipeData.image,
          sourceUrl: url,
        };
      }
    } catch (e) {
      console.error('Failed to parse JSON-LD:', e);
    }
  }

  // Fallback: Basic HTML parsing
  const nameMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  const name = nameMatch ? nameMatch[1].replace(/<[^>]*>/g, '').trim() : 'Unnamed Recipe';
  
  // Try to find ingredients list
  const ingredients: string[] = [];
  const ingredientsMatch = html.match(/<ul[^>]*class="[^"]*ingredient[^"]*"[^>]*>([\s\S]*?)<\/ul>/i);
  
  if (ingredientsMatch) {
    const ingredientMatches = ingredientsMatch[1].matchAll(/<li[^>]*>(.*?)<\/li>/gi);
    for (const match of ingredientMatches) {
      const ingredient = match[1].replace(/<[^>]*>/g, '').trim();
      if (ingredient) ingredients.push(ingredient);
    }
  }

  // Try to find image
  const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);
  const imageUrl = imageMatch ? imageMatch[1] : undefined;

  return {
    name,
    ingredients,
    sourceUrl: url,
    imageUrl,
  };
}

/**
 * Get popular/featured recipes
 */
export async function getFeaturedRecipes(): Promise<SearchResult[]> {
  try {
    const response = await fetch('https://www.matprat.no/api/recipes/featured', {
      headers: {
        'User-Agent': 'Handleliste App (Educational Purpose)',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      // Fallback to homepage scraping if API doesn't exist
      return [];
    }

    const data = await response.json();
    
    if (Array.isArray(data)) {
      return data.map((recipe: any) => ({
        title: recipe.title || recipe.name,
        url: recipe.url || `https://www.matprat.no${recipe.path}`,
        imageUrl: recipe.image || recipe.imageUrl,
      }));
    }

    return [];
  } catch (error) {
    console.error('Featured recipes error:', error);
    return [];
  }
}

