import { Router } from "express";
import {
  buscarLivros,
  criarLivro,
  atualizarLivro,
} from "../controllers/LivroController.js";

const router = Router();

router.get("/", buscarLivros);
router.post("/", criarLivro);
router.put("/:id", atualizarLivro);

export default router;
