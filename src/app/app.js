import express from "express";
import routes from "./routes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

app.use("/public", express.static(path.join(__dirname, "../../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

app.use(routes);

export default app;
