import mongoose from "mongoose";

const PetSchema = new mongoose.Schema({
  petName: { type: String, required: true },
  petAge: { type: Number, required: true },
  userEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Pet || mongoose.model("Pet", PetSchema);
