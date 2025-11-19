import { Router } from "express";
import {
  buscarAlunos,
  criarAluno,
  buscarAlunoPorId,
  atualizarAluno,
  deletarAluno,
} from "../controllers/AlunoController.js";

const router = Router();

router.get("/", buscarAlunos);
router.post("/", criarAluno);
router.get("/:id", buscarAlunoPorId);
router.put("/:id", atualizarAluno);
router.delete("/:id", deletarAluno);

export default router;
