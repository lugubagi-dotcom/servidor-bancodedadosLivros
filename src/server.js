import express from "express";
import { Database } from "./database-mongo.js";

const app = express();
const port = 3000;

app.use(express.json());

const database = new Database();

app.get("/", (req, res) => {
  res.send("Biblioteca escolar — ta funcionando com mongodb");
});

//alunos
app.get("/alunos", async (req, res) => {
  const alunos = await database.select("alunos");
  res.status(200).json(alunos);
});

app.get("/alunos/:id", async (req, res) => {
  const id = req.params.id;
  const aluno = await database.selectById("alunos", id);
  if (!aluno) return res.status(404).send("Aluno não encontrado");
  res.json(aluno);
});

app.post("/alunos", async (req, res) => {
  const { nome, turma, idade } = req.body;
  if (!nome || !turma || !idade)
    return res.status(400).send("Dados incompletos");
  const created = await database.insert("alunos", { nome, turma, idade });
  return res.status(201).json(created);
});

app.put("/alunos/:id", async (req, res) => {
  const id = req.params.id;
  const updated = await database.update("alunos", id, req.body);
  if (!updated) return res.status(404).send("Aluno não encontrado");
  res.json(updated);
});

app.delete("/alunos/:id", async (req, res) => {
  const id = req.params.id;
  const ok = await database.delete("alunos", id);
  if (!ok) return res.status(404).send("Aluno não encontrado");
  res.status(204).send();
});

//livros
app.get("/livros", async (req, res) => {
  res.status(200).json(await database.select("livros"));
});

app.get("/livros/:id", async (req, res) => {
  const id = req.params.id;
  const livro = await database.selectById("livros", id);
  if (!livro) return res.status(404).send("Livro não encontrado");
  res.json(livro);
});

app.post("/livros", async (req, res) => {
  const { titulo, autor, ano, disponivel } = req.body;
  if (!titulo || !autor || !ano)
    return res.status(400).send("Dados incompletos");

  const created = await database.insert("livros", {
    titulo,
    autor,
    ano,
    disponivel: disponivel ?? true,
  });
  return res.status(201).json(created);
});

app.put("/livros/:id", async (req, res) => {
  const id = req.params.id;
  const updated = await database.update("livros", id, req.body);
  if (!updated) return res.status(404).send("Livro não encontrado");
  res.json(updated);
});

app.delete("/livros/:id", async (req, res) => {
  const id = req.params.id;
  const ok = await database.delete("livros", id);
  if (!ok) return res.status(404).send("Livro não encontrado");
  res.status(204).send();
});

// emprestimos
app.get("/emprestimos", async (req, res) => {
  res.status(200).json(await database.select("emprestimos"));
});

app.get("/emprestimos/:id", async (req, res) => {
  const id = req.params.id;
  const emp = await database.selectById("emprestimos", id);
  if (!emp) return res.status(404).send("Empréstimo não encontrado");
  res.json(emp);
});

app.post("/emprestimos", async (req, res) => {
  const { alunoId, livroId } = req.body;
  if (!alunoId || !livroId) return res.status(400).send("Dados incompletos");

  const aluno = await database.selectById("alunos", alunoId);
  const livro = await database.selectById("livros", livroId);

  if (!aluno) return res.status(404).send("Aluno não encontrado");
  if (!livro) return res.status(404).send("Livro não encontrado");
  if (!livro.disponivel)
    return res.status(400).send("Livro indisponível no momento");

  const emprestimo = {
    alunoId: alunoId,
    livroId: livroId,
    dataEmprestimo: new Date().toISOString(),
    dataDevolucao: null,
    status: "emprestado",
  };

  const created = await database.insert("emprestimos", emprestimo);

  await database.update("livros", livroId, { disponivel: false });

  res.status(201).json(created);
});

app.put("/emprestimos/:id/devolver", async (req, res) => {
  const id = req.params.id;
  const emprestimo = await database.selectById("emprestimos", id);
  if (!emprestimo) return res.status(404).send("Empréstimo não encontrado");
  if (emprestimo.status === "devolvido")
    return res.status(400).send("Empréstimo já devolvido");

  const now = new Date().toISOString();
  const updated = await database.update("emprestimos", id, {
    dataDevolucao: now,
    status: "devolvido",
  });

  await database.update("livros", emprestimo.livroId, { disponivel: true });

  res.json(updated);
});

app.delete("/emprestimos/:id", async (req, res) => {
  const id = req.params.id;
  const emprestimo = await database.selectById("emprestimos", id);
  if (!emprestimo) return res.status(404).send("Empréstimo não encontrado");

  if (emprestimo.status !== "devolvido") {
    await database.update("livros", emprestimo.livroId, { disponivel: true });
  }
  await database.delete("emprestimos", id);
  res.status(204).send();
});

database
  .connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor está rodando na porta http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error(
      "Falha ao conectar ao banco de dados, servidor não iniciado.",
      err
    );
  });
