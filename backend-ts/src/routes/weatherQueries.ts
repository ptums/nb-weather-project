import express, { Request, Response } from "express";
import {
  createWeatherQueries,
  getAllWeatherQueries,
  getWeatherQueryById,
  updateWeatherQueries,
  getAllWeatherQueriesByUserId,
  deleteWeatherQuery,
  searchWeatherQueries,
} from "./methods/weatherQueries";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { query, userId } = req.body;

    if (!query || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const createdQuery = await createWeatherQueries(query, userId);
    res.status(201).json(createdQuery);
  } catch (error) {
    console.error("Error creating weather query:", error);
    res.status(400).json({ error: "Failed to create weather query" });
  }
});

// Get weather query by ID
router.get("/i/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const weatherQuery = await getWeatherQueryById(id);

    if (!weatherQuery) {
      return res.status(404).json({ error: "Weather query not found" });
    }

    res.status(200).json(weatherQuery);
  } catch (error) {
    console.error("Error fetching weather query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get weather queries by user ID
router.get(
  "/u/:userId",
  async (req: Request<{ userId: string }>, res: Response) => {
    try {
      const { userId } = req.params;

      const weatherQueriesList = await getAllWeatherQueriesByUserId(userId);

      if (weatherQueriesList.length === 0) {
        return res
          .status(404)
          .json({ error: "No weather queries found for this user" });
      }

      res.status(200).json(weatherQueriesList);
    } catch (error) {
      console.error("Error fetching weather queries:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Get all weather queries
router.get("/", async (_req: Request, res: Response) => {
  try {
    const queries = await getAllWeatherQueries();
    res.status(200).json(queries);
  } catch (error) {
    console.error("Error fetching all weather queries:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update weather query
router.put("/i/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Missing query in request body" });
    }

    const existingQuery = await getWeatherQueryById(id);
    if (!existingQuery) {
      return res.status(404).json({ error: "Weather query not found" });
    }

    const updatedQuery = await updateWeatherQueries(id, query);
    res.status(200).json(updatedQuery);
  } catch (error) {
    console.error("Error updating weather query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete weather query
router.delete("/i/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const existingQuery = await getWeatherQueryById(id);
    if (!existingQuery) {
      return res.status(404).json({ error: "Weather query not found" });
    }

    await deleteWeatherQuery(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting weather query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Search weather queries
router.get("/s", async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Missing query parameter" });
    }

    const results = await searchWeatherQueries(query as string);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error searching weather queries:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
