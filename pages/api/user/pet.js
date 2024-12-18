import connectToDatabase from "../../../lib/mongoose";
import Pet from "../../../models/Pet";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "POST") {
    const { petName, petAge, userEmail } = req.body;

    if (!petName || !petAge || !userEmail) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const pet = await Pet.create({ petName, petAge, userEmail });
      return res.status(200).json({ message: "Pet info saved successfully", pet });
    } catch (error) {
      return res.status(500).json({ error: "Failed to save pet info" });
    }
  } else if (req.method === "GET") {
    const { userEmail } = req.query;

    try {
      const pets = await Pet.find({ userEmail }).sort({ createdAt: -1 });
      return res.status(200).json(pets);
    } catch (error) {
      return res.status(500).json({ error: "Failed to retrieve pets" });
    }
  } else if (req.method === "DELETE") {
    const { petId } = req.body;

    if (!petId) {
      return res.status(400).json({ error: "Missing required petId" });
    }

    try {
      const deletedPet = await Pet.findByIdAndDelete(petId);

      if (!deletedPet) {
        return res.status(404).json({ error: "Pet not found" });
      }

      return res.status(200).json({ message: "Pet deleted successfully", deletedPet });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete pet" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
