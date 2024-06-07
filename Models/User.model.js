
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
  timestamps: true, // get 3 fields in database : "createdAt"; "updatedAt"; "__v";
})

// cearte model object
const UserModel = mongoose.model("Users", userSchema)

export default UserModel