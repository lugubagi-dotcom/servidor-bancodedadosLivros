import mongoose from "mongoose";

const emprestimoSchema = new mongoose.Schema({
  aluno: { type: mongoose.Schema.Types.ObjectId, ref: "Aluno" },
  livro: { type: mongoose.Schema.Types.ObjectId, ref: "Livro", required: true },
  dataEmprestimo: { type: Date, default: Date.now },
  dataDevolucao: { type: Date, default: null },
  status: {
    type: String,
    enum: ["emprestado", "devolvido"],
    default: "emprestado",
  },
});

export const Emprestimo = mongoose.model("Emprestimo", emprestimoSchema);
