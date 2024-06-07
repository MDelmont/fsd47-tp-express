
import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
},{
  timestamps: true, // Permet d'avoir 3 nouveaux champs : "createdAt"; "updatedAt"; "__v";
})

// Création d'un objet Modèle basé sur le schéma
const UserModel = mongoose.model("Users", userSchema)

export default UserModel