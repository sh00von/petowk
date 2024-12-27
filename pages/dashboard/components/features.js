import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Utensils, Apple, Calendar } from 'lucide-react'

export function Features() {
  const features = [
    {
      title: "AI Vet Chat",
      description: "Get instant answers to your pet health questions from our AI-powered veterinary assistant.",
      icon: MessageCircle,
    },
    {
      title: "Food Suggestions",
      description: "Receive personalized food recommendations based on your pet's breed, age, and health conditions.",
      icon: Utensils,
    },
    {
      title: "Nutrition Checker",
      description: "Analyze your pet's diet and get insights on nutritional balance and potential improvements.",
      icon: Apple,
    },
    {
      title: "Vet Appointment Booking",
      description: "Easily schedule in-person or virtual appointments with licensed veterinarians.",
      icon: Calendar,
    },
  ]

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Features of PETOWK
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Discover how PETOWK can help you take better care of your pets
          </p>
        </div>

        <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <feature.icon className="h-8 w-8 text-indigo-500 mb-4" />
                <CardTitle className="text-xl font-semibold text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

