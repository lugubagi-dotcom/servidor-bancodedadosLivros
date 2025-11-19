import { Router } from "express";
import {
  buscarEmprestimos,
  criarEmprestimo,
  devolverLivro,
} from "../controllers/EmprestimoController.js";

const router = Router();

router.get("/", buscarEmprestimos);
router.post("/", criarEmprestimo);
router.put("/:id/devolver", devolverLivro);

export default router;
