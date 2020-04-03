import mongoose from "mongoose";

const User = new mongoose.Schema(
  {
    nome: {
	type: String,
	required: true
    },
    email: {
	type: String,
	required: true
    },
    cpf: String,
    dataNascimento: Date, 
    sexo: String,
    cidade: String, 
    estado: String,
    password: {
      type: String,
      required: true
    }
  },
  {
    collection: "user",
    timestamps: true
  }
);
module.exports = mongoose.model("user", User);
