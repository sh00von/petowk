import { useState, useEffect } from 'react'
import { Send, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MarkdownIt from 'markdown-it'

// Initialize markdown-it parser
const md = new MarkdownIt()

// Custom function to format markdown and apply custom classes
const formatMarkdown = (text) => {
  // Parse markdown using markdown-it
  let html = md.render(text)

  // Apply custom classes to specific HTML elements
  html = html
    // Apply custom classes to <h1>, <h2>, <h3>, etc.
    .replace(/<h1>/g, '<h1 class="text-4xl font-bold mt-4 mb-2">')
    .replace(/<\/h1>/g, '</h1>')
    .replace(/<h2>/g, '<h2 class="text-3xl font-bold mt-4 mb-2">')
    .replace(/<\/h2>/g, '</h2>')
    .replace(/<h3>/g, '<h3 class="text-2xl font-bold mt-4 mb-2">')
    .replace(/<\/h3>/g, '</h3>')
    .replace(/<ul>/g, '<ul class="list-disc ml-6">')
    .replace(/<ol>/g, '<ol class="list-decimal ml-6">')
    .replace(/<li>/g, '<li class="ml-4">')
    // Ensure lists close correctly
    .replace(/<\/ul>\s*<ul>/g, '</ul><ul>')
    .replace(/<\/ol>\s*<ol>/g, '</ol><ol>')

  return html
}

// Component to render parsed markdown using markdown-it
const MarkdownRenderer = ({ markdown }) => {
  const parsedHtml = formatMarkdown(markdown) // Use the custom markdown function to parse

  return (
    <div
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: parsedHtml }}
    />
  )
}
function isSpace(char) {
  return char === ' ';
}

export default function Answer() {
  const [petName, setPetName] = useState('')  // User enters pet breed or name
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Retrieve the result from localStorage
    const storedResult = localStorage.getItem('petowkResult')
    if (storedResult) {
      setResult(JSON.parse(storedResult))
      // Clear the stored result after retrieving it
      localStorage.removeItem('petowkResult')
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if pet name input is empty before submitting
    if (!petName.trim()) {
      alert('Please enter your pet\'s breed or name to receive food suggestions.')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pet: petName })  // Send pet name or breed to the API
      })
      
      // Handle the API response
      const data = await response.json()
      setResult(data)

      // Store the result in localStorage if necessary
      localStorage.setItem('petowkResult', JSON.stringify(data))
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
      setPetName('')  // Clear pet name input after submitting
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Header />
      <main className="flex-grow pt-24">
      <div className="hero-section bg-gradient-to-r from-sky-50 to-teal-50 flex flex-col md:flex-row justify-center items-center py-24 px-4 md:px-8">
  {/* Left Column: Heading and Description */}
  <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left mb-8 md:mb-0 space-y-4">
    <motion.h1
      className="text-4xl md:text-5xl font-semibold text-sky-800 mb-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {petName ? `Pet food suggestion for ${petName}` : 'Find the Best Food for Your Pet'}
    </motion.h1>
    <motion.p
      className="text-lg md:text-xl text-sky-700 mb-8 px-4 md:px-0"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
    >
      Enter your pet’s breed or name below, and we’ll recommend food tailored to them!
    </motion.p>
  </div>

  {/* Right Column: Form */}
  <div className="w-full md:w-1/2 flex justify-center items-center px-4 md:px-0">
    <motion.form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="mb-6 space-y-4">
        <label htmlFor="pet-name" className="block text-lg font-semibold text-sky-800 mb-2">
          Enter Your Pet's Breed or Name
        </label>
        <p className="text-gray-600 text-sm mb-4">
          We’ll use this information to recommend the best food options tailored to your pet.
        </p>
        <div className="flex items-center border-2 border-sky-600 rounded-lg px-4 py-2 focus-within:border-sky-700 transition-all duration-300">
          <input
            id="pet-name"
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)} // Update pet name input
            placeholder="e.g., Golden Retriever, Bella"
            className="flex-grow bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 text-lg"
          />
          <button type="submit" className="ml-2 text-sky-600 hover:text-sky-700 transition-colors" disabled={isLoading}>
            {isLoading ? (
              <motion.div
                className="w-5 h-5 border-t-2 border-sky-600 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </motion.form>
  </div>
</div>


        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Column - AI Answer and Input */}
            <div className="w-full lg:w-2/3">
              <motion.div
                className="bg-gradient-to-r from-sky-50 to-teal-50 rounded-lg shadow-lg p-6 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-semibold mb-4 text-sky-800">
                  {result?.prompt_heading || 'Food Suggestions for Your Pet'}
                </h2>
                <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                  {result?.suggestion ? (
                    <MarkdownRenderer markdown={result.suggestion} />
                  ) : (
                    <p>We’ll recommend food options once you enter your pet's breed or name.</p>
                  )}
                </p>
              </motion.div>
            </div>

            {/* Right Column - Meet Specialist */}
            <motion.div
              className="w-full lg:w-1/3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-2xl font-semibold mb-4 text-sky-800">Consult with a Pet Specialist</h2>
              <p className="text-gray-700 mb-6">
                Need more tailored advice? Connect with a pet care expert for personalized recommendations and care tips.
              </p>
              <div className="space-y-4">
                <motion.button
                  className="w-full bg-sky-600 text-white hover:bg-sky-700 font-semibold py-2 px-4 rounded-lg flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Phone className="mr-2" size={20} />
                  Speak with a Specialist
                </motion.button>
                <motion.button
                  className="w-full bg-teal-500 text-white hover:bg-teal-600 font-semibold py-2 px-4 rounded-lg flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Now
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
