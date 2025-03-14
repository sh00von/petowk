import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../lib/auth"
import connectToDatabase from "@/lib/mongoose"
import User from "@/models/User"

export default async function handler(req, res) {
  // Handle GET request
  if (req.method === "GET") {
    try {
      const email = req.query.email

      if (!email) {
        return res.status(400).json({ error: "Email is required" })
      }

      // Verify user is authenticated and requesting their own data
      const session = await getServerSession(req, res, authOptions)
      if (!session || session.user?.email !== email) {
        return res.status(401).json({ error: "Unauthorized" })
      }

      // Since we're using MongoDBAdapter, we can use the adapter's User model
      // But we'll keep the existing code structure for consistency
      await connectToDatabase()

      const user = await User.findOne({ email }).select("-password")

      if (!user) {
        return res.status(404).json({ error: "User not found" })
      }

      return res.status(200).json(user)
    } catch (error) {
      console.error("Error fetching user profile:", error)
      return res.status(500).json({ error: "Failed to fetch user profile" })
    }
  }

  // Handle POST request
  else if (req.method === "POST") {
    try {
      const { email, name, phone, address, bio } = req.body

      if (!email) {
        return res.status(400).json({ error: "Email is required" })
      }

      // Verify user is authenticated and updating their own data
      const session = await getServerSession(req, res, authOptions)
      if (!session || session.user?.email !== email) {
        return res.status(401).json({ error: "Unauthorized" })
      }

      await connectToDatabase()

      // Find user and update or create if doesn't exist (upsert)
      const updatedUser = await User.findOneAndUpdate(
        { email },
        {
          name,
          phone,
          address,
          bio,
          // Add updatedAt timestamp
          updatedAt: new Date(),
        },
        {
          new: true, // Return updated document
          upsert: true, // Create if doesn't exist
          runValidators: true, // Run model validators
        },
      )

      return res.status(200).json({
        message: "Profile updated successfully",
        user: {
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          address: updatedUser.address,
          bio: updatedUser.bio,
        },
      })
    } catch (error) {
      console.error("Error updating user profile:", error)
      return res.status(500).json({ error: "Failed to update profile" })
    }
  }

  // Handle unsupported methods
  else {
    res.setHeader("Allow", ["GET", "POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

