import { Router } from "express";
import MusicaController from "./controllers/MusicaController.js";
import ArtistaController from "./controllers/ArtistaController.js";
import upload from "../config/uploadConfig.js";

const router = Router();

router.get("/musicas", MusicaController.findAll);
router.post("/musicas", MusicaController.store);
router.get("/musicas/search", MusicaController.search);
router.delete("/musicas/:id", MusicaController.deleteById);
router.put(
  "/musicas/:id",
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "capa", maxCount: 1 }
  ]),
  MusicaController.update
);
router.post(
  "/musicas/upload",
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "capa", maxCount: 1 }
  ]),
  MusicaController.upload
);

router.get("/artistas", ArtistaController.findAll);
router.post("/artistas", ArtistaController.store);

export default router;