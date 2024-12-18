import { MessageCircle, Utensils, Apple, Calendar } from 'lucide-react'

export function Features() {
  const features = [
    { icon: MessageCircle, title: 'AI Vet Chat', description: 'Get instant answers to your pet health questions' },
    { icon: Utensils, title: 'Food Suggestions', description: 'Personalized diet recommendations for your pets' },
    { icon: Apple, title: 'Nutrition Checker', description: 'Ensure your pet\'s diet is balanced and healthy' },
    { icon: Calendar, title: 'Vet Booking', description: 'Easy scheduling for in-person veterinary visits' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
      {features.map((feature, index) => (
        <div key={index} className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <feature.icon className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
