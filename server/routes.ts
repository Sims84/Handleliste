import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { searchMatprat, scrapeRecipe, getFeaturedRecipes } from "./matpratScraper";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Protected route example
  app.get("/api/protected", isAuthenticated, async (req, res) => {
    const userId = (req.user as any)?.claims?.sub;
    // Do something with the user id.
    res.json({ message: "This is a protected route", userId });
  });

  // Recipe routes
  
  // Get all user's recipes
  app.get('/api/recipes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const recipes = await storage.getRecipes(userId);
      res.json(recipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      res.status(500).json({ message: "Failed to fetch recipes" });
    }
  });

  // Get a single recipe
  app.get('/api/recipes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const recipe = await storage.getRecipe(req.params.id, userId);
      
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      
      res.json(recipe);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      res.status(500).json({ message: "Failed to fetch recipe" });
    }
  });

  // Create a new recipe
  app.post('/api/recipes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const { name, ingredients, instructions, sourceUrl, imageUrl } = req.body;

      if (!name || !ingredients || !Array.isArray(ingredients)) {
        return res.status(400).json({ message: "Name and ingredients are required" });
      }

      const recipe = await storage.createRecipe({
        userId,
        name,
        ingredients,
        instructions,
        sourceUrl,
        imageUrl,
      });

      res.status(201).json(recipe);
    } catch (error) {
      console.error("Error creating recipe:", error);
      res.status(500).json({ message: "Failed to create recipe" });
    }
  });

  // Delete a recipe
  app.delete('/api/recipes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      await storage.deleteRecipe(req.params.id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting recipe:", error);
      res.status(500).json({ message: "Failed to delete recipe" });
    }
  });

  // Matprat integration routes

  // Search Matprat recipes
  app.get('/api/matprat/search', isAuthenticated, async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }

      const results = await searchMatprat(query);
      res.json(results);
    } catch (error) {
      console.error("Error searching Matprat:", error);
      res.status(500).json({ message: "Failed to search Matprat" });
    }
  });

  // Get featured recipes from Matprat
  app.get('/api/matprat/featured', isAuthenticated, async (req, res) => {
    try {
      const results = await getFeaturedRecipes();
      res.json(results);
    } catch (error) {
      console.error("Error fetching featured recipes:", error);
      res.status(500).json({ message: "Failed to fetch featured recipes" });
    }
  });

  // Import a recipe from Matprat URL
  app.post('/api/matprat/import', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({ message: "Recipe URL is required" });
      }

      // Scrape the recipe
      const scrapedRecipe = await scrapeRecipe(url);

      // Save it to the database
      const recipe = await storage.createRecipe({
        userId,
        name: scrapedRecipe.name,
        ingredients: scrapedRecipe.ingredients,
        instructions: scrapedRecipe.instructions,
        sourceUrl: scrapedRecipe.sourceUrl,
        imageUrl: scrapedRecipe.imageUrl,
      });

      res.status(201).json(recipe);
    } catch (error) {
      console.error("Error importing recipe:", error);
      res.status(500).json({ message: "Failed to import recipe" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}