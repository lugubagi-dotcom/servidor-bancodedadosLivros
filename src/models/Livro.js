import mongoose from "mongoose";

const livroSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  autor: { type: String },
  ano: { type: Number },
  disponivel: { type: Boolean, default: true },
});

export const Livro = mongoose.model("Livro", livroSchema);
