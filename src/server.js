import express from "express";
import mongoose from "mongoose";

import livrosRoutes from "./routes/livros.js";
import emprestimosRoutes from "./routes/emprestimos.js";
import alunosRoutes from "./routes/alunos.js";

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/biblioteca-mongoose")
  .then(() => console.log("Conectado ao Mongo!"))
  .catch((err) => console.log("Erro:", err));

app.use("/livros", livrosRoutes);
app.use("/emprestimos", emprestimosRoutes);
app.use("/alunos", alunosRoutes);

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
