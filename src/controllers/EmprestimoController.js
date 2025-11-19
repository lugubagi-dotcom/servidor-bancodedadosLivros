import { Emprestimo } from "../models/Emprestimo.js";
import { Livro } from "../models/Livro.js";

export const buscarEmprestimos = async (req, res) => {
  const emprestimos = await Emprestimo.find()
    .populate("aluno")
    .populate("livro");
  res.json(emprestimos);
};

export const criarEmprestimo = async (req, res) => {
  const { alunoId, livroId } = req.body;

  const livro = await Livro.findById(livroId);
  if (!livro || !livro.disponivel) {
    return res
      .status(400)
      .json({ erro: "Livro indisponível ou não encontrado" });
  }

  const emprestimo = new Emprestimo({ aluno: alunoId, livro: livroId });
  await emprestimo.save();

  await Livro.findByIdAndUpdate(livroId, { disponivel: false });

  res.status(201).json(emprestimo);
};

export const devolverLivro = async (req, res) => {
  const emprestimo = await Emprestimo.findById(req.params.id);

  emprestimo.status = "devolvido";
  emprestimo.dataDevolucao = new Date();
  await emprestimo.save();

  await Livro.findByIdAndUpdate(emprestimo.livro, { disponivel: true });

  res.json({ message: "Devolvido com sucesso" });
};
