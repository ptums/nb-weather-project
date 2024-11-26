import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import routes from "./routes";
import cors from "cors";

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: "*",
  credentials: true,
};

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 8080;

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
