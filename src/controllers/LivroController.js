import { Livro } from "../models/Livro.js";

export const buscarLivros = async (req, res) => {
  const livros = await Livro.find();
  res.json(livros);
};

export const criarLivro = async (req, res) => {
  const livro = new Livro(req.body);
  await livro.save();
  res.status(201).json(livro);
};

export const atualizarLivro = async (req, res) => {
  const livro = await Livro.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(livro);
};
