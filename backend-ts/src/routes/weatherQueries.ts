import express, { Request, Response } from "express";
import { WeatherQueriesRepository } from "../repository";

const router = express.Router();

// Create a new weather query
router.post("/", async (req: Request, res: Response) => {
  try {
    const weatherQueryData = req.body;
    const createdQuery = await WeatherQueriesRepository.create(
      weatherQueryData
    );
    res.status(201).json(createdQuery);
  } catch (error) {
    console.error("Error creating weather query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a weather query by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const query = await WeatherQueriesRepository.findById(id);
    if (query) {
      res.json(query);
    } else {
      res.status(404).json({ error: "Weather query not found" });
    }
  } catch (error) {
    console.error("Error fetching weather query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all weather queries by user ID
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const queries = await WeatherQueriesRepository.findByUserId(userId);
    res.json(queries);
  } catch (error) {
    console.error("Error fetching weather queries for user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a weather query
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const weatherQueryData = req.body;
    const updatedQuery = await WeatherQueriesRepository.update(
      id,
      weatherQueryData
    );
    res.json(updatedQuery);
  } catch (error) {
    console.error("Error updating weather query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a weather query
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await WeatherQueriesRepository.deleteById(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting weather query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all weather queries
router.get("/", async (_req: Request, res: Response) => {
  try {
    const queries = await WeatherQueriesRepository.findAll();
    res.json(queries);
  } catch (error) {
    console.error("Error fetching all weather queries:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a user to a weather query
router.post(
  "/queryId/:queryId/users/:userId",
  async (req: Request, res: Response) => {
    try {
      const queryId = parseInt(req.params.queryId);
      const userId = parseInt(req.params.userId);
      const updatedQuery = await WeatherQueriesRepository.addUserToQuery(
        queryId,
        userId
      );
      res.json(updatedQuery);
    } catch (error) {
      console.error("Error adding user to weather query:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Remove a user from a weather query
router.delete(
  "/wq/:queryId/users/:userId",
  async (req: Request, res: Response) => {
    try {
      const queryId = parseInt(req.params.queryId);
      const userId = parseInt(req.params.userId);
      const updatedQuery = await WeatherQueriesRepository.removeUserFromQuery(
        queryId,
        userId
      );
      res.json(updatedQuery);
    } catch (error) {
      console.error("Error removing user from weather query:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Find weather queries by query string
router.get("/wq/search/:query", async (req: Request, res: Response) => {
  try {
    const query = req.params.query;
    const queries = await WeatherQueriesRepository.findByQuery(query);
    res.json(queries);
  } catch (error) {
    console.error("Error searching weather queries:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Check if a weather query exists
router.head("/wq/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const exists = await WeatherQueriesRepository.existsById(id);
    if (exists) {
      res.status(200).send();
    } else {
      res.status(404).send();
    }
  } catch (error) {
    console.error("Error checking weather query existence:", error);
    res.status(500).send();
  }
});

export default router;
