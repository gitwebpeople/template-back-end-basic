import mongoose from "mongoose";

const Professor = new mongoose.Schema(
  {
    nome: {
	type: String,
	required: true
    },
    email: {
	type: String,
	required: true
    },
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
    cpf: String,
    dataNascimento: Date, 
    sexo: String,
    fotoPerfil: String,
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
module.exports = mongoose.model("professor", Professor);
