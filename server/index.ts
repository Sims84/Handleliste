import express from "express";
import { registerRoutes } from "./routes";

const app = express();
const PORT = process.env.PORT ?? 8000;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function startServer() {
  try {
    // Register routes
    const server = await registerRoutes(app);
    
    // Start server
    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
    
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();