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
    const searchUrl = `https://www.matprat.no/sok/?q=${encodeURIComponent(query)}&category=recipes`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
    });

    if (!response.ok) {
      console.error(`Search failed with status: ${response.status}`);
      return [];
    }

    const html = await response.text();
    const results: SearchResult[] = [];
    
    // Extract recipe links from the search results page
    // Pattern: <a href="/oppskrifter/...">
    const recipePattern = /<a[^>]+href="(\/oppskrifter\/[^"]+)"[^>]*>[\s\S]*?<h3[^>]*>([^<]+)<\/h3>[\s\S]*?(?:<img[^>]+src="([^"]+)"|)/gi;
    
    let match;
    while ((match = recipePattern.exec(html)) !== null) {
      const [, path, title, imageUrl] = match;
      results.push({
        title: title.trim(),
        url: `https://www.matprat.no${path}`,
        imageUrl: imageUrl || undefined,
      });
      
      // Limit to 20 results
      if (results.length >= 20) break;
    }

    // Fallback: simpler pattern if the above doesn't work
    if (results.length === 0) {
      const simplePattern = /href="(\/oppskrifter\/[^"]+)"/g;
      const titles = html.match(/<h3[^>]*>([^<]+)<\/h3>/g) || [];
      
      let i = 0;
      while ((match = simplePattern.exec(html)) !== null && i < titles.length) {
        const titleMatch = titles[i].match(/<h3[^>]*>([^<]+)<\/h3>/);
        if (titleMatch) {
          results.push({
            title: titleMatch[1].trim(),
            url: `https://www.matprat.no${match[1]}`,
          });
        }
        i++;
        if (results.length >= 20) break;
      }
    }

    return results;
  } catch (error) {
    console.error('Matprat search error:', error);
    return [];
  }
}

export async function scrapeRecipe(url: string): Promise<ScrapedRecipe> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
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
  // Try to extract JSON-LD structured data first
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

  // Fallback: parse HTML directly
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
    // Get featured recipes from the main page
    const response = await fetch('https://www.matprat.no/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
    });

    if (!response.ok) {
      return [];
    }

    const html = await response.text();
    const results: SearchResult[] = [];
    
    // Extract recipe links from the homepage
    const recipePattern = /<a[^>]+href="(\/oppskrifter\/[^"]+)"[^>]*>/gi;
    
    let match;
    while ((match = recipePattern.exec(html)) !== null) {
      const url = `https://www.matprat.no${match[1]}`;
      if (!results.some(r => r.url === url)) {
        results.push({
          title: '', // Will be extracted when recipe is loaded
          url,
        });
      }
      if (results.length >= 10) break;
    }

    return results;
  } catch (error) {
    console.error('Featured recipes error:', error);
    return [];
  }
}
