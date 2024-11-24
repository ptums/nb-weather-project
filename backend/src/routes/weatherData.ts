import express, { Request, Response } from "express";

import { WeatherDataRequest } from "../types";
import {
  createWeatherData,
  getAllWeatherData,
  getWeatherDataById,
} from "./methods/weatherData";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { query, queryId }: WeatherDataRequest = req.body;
    const createdData = await createWeatherData(query, queryId);
    console.log({
      createdData,
    });
    res.status(201).json(createdData);
  } catch (error) {
    res.status(400).json({ error: "Unable to create weather data" });
  }
});

router.get("/i/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const weatherDataList = await getWeatherDataById(id);

    if (weatherDataList.length === 0) {
      return res.status(404).json({ error: "Weather data not found" });
    }

    res.status(200).json(weatherDataList);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (_req: Request, res: Response) => {
  try {
    const allData = await getAllWeatherData();
    res.status(200).json(allData);
  } catch (error) {
    console.error("Error fetching all weather data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
