import mongoose from "mongoose"

// Check if the User model already exists to prevent overwriting
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  password: {
    type: String,
    // Password might be handled by NextAuth providers, so not always required
    select: false, // Don't include password in query results by default
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Use existing model or create a new one
const User = mongoose.models.User || mongoose.model("User", UserSchema)

export default User

