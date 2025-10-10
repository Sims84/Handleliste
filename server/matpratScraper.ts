/**
 * Matprat.no Recipe Scraper
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

export async function searchMatprat(query: string): Promise<SearchResult[]> {
  try {
    const searchUrl = `https://www.matprat.no/api/search?q=${encodeURIComponent(query)}&type=recipe`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Handleliste App',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }

    const data = await response.json();
    
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

export async function scrapeRecipe(url: string): Promise<ScrapedRecipe> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Handleliste App',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch recipe: ${response.status}`);
    }

    const html = await response.text();
    const recipe = parseRecipeFromHtml(html, url);
    
    return recipe;
  } catch (error) {
    console.error('Recipe scraping error:', error);
    throw new Error('Failed to scrape recipe');
  }
}

function parseRecipeFromHtml(html: string, url: string): ScrapedRecipe {
  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  
  if (jsonLdMatch) {
    try {
      const jsonData = JSON.parse(jsonLdMatch[1]);
      
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

  const nameMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  const name = nameMatch ? nameMatch[1].replace(/<[^>]*>/g, '').trim() : 'Unnamed Recipe';
  
  const ingredients: string[] = [];
  const ingredientsMatch = html.match(/<ul[^>]*class="[^"]*ingredient[^"]*"[^>]*>([\s\S]*?)<\/ul>/i);
  
  if (ingredientsMatch) {
    const ingredientMatches = ingredientsMatch[1].matchAll(/<li[^>]*>(.*?)<\/li>/gi);
    for (const match of ingredientMatches) {
      const ingredient = match[1].replace(/<[^>]*>/g, '').trim();
      if (ingredient) ingredients.push(ingredient);
    }
  }

  const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);
  const imageUrl = imageMatch ? imageMatch[1] : undefined;

  return {
    name,
    ingredients,
    sourceUrl: url,
    imageUrl,
  };
}

export async function getFeaturedRecipes(): Promise<SearchResult[]> {
  try {
    const response = await fetch('https://www.matprat.no/api/recipes/featured', {
      headers: {
        'User-Agent': 'Handleliste App',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
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
