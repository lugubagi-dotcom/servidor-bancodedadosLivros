import mongoose from "mongoose";

const schema = new mongoose.Schema({
  nome: { type: String, required: true },
  turma: { type: String, required: true },
  idade: { type: Number, required: true },
});

export const Aluno = mongoose.model("Aluno", schema);
