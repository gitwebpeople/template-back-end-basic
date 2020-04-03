import mongoose from "mongoose";

const Aluno = new mongoose.Schema(
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
    fotoPerfil: String,
    loginSocial: {
	facebook: {
	  email: String,
	  foto: String
	},
	google: {
	  email: String,
	  foto: String
	}
    },
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
module.exports = mongoose.model("aluno", Aluno);
