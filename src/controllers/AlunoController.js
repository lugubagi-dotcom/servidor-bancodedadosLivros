import { Aluno } from "../models/Aluno.js";

export const buscarAlunos = async (req, res) => {
  const alunos = await Aluno.find();
  res.json(alunos);
};

export const buscarAlunoPorId = async (req, res) => {
  const aluno = await Aluno.findById(req.params.id);
  if (!aluno) {
    return res.status(404).json({ erro: "Aluno não encontrado" });
  }
  res.json(aluno);
};

export const criarAluno = async (req, res) => {
  try {
    const aluno = new Aluno(req.body);
    await aluno.save();
    res.status(201).json(aluno);
  } catch (error) {
    res
      .status(400)
      .json({ erro: "Erro ao criar aluno", detalhe: error.message });
  }
};

export const atualizarAluno = async (req, res) => {
  const aluno = await Aluno.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!aluno) {
    return res.status(404).json({ erro: "Aluno não encontrado" });
  }

  res.json(aluno);
};

export const deletarAluno = async (req, res) => {
  const aluno = await Aluno.findByIdAndDelete(req.params.id);

  if (!aluno) {
    return res.status(404).json({ erro: "Aluno não encontrado" });
  }

  res.status(204).send();
};
