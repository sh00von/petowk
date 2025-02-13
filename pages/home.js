'use client'

import { useState, useRef, useEffect } from 'react'
import { Cat, ArrowDownCircle, Loader } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Email from '../components/Email'
import Hero from '../components/Hero'
import Head from 'next/head'
export default function Home() {
  const [email, setEmail] = useState('')
  const [queryType, setQueryType] = useState('food')  // Default query type
  const [pet, setPet] = useState('')
  const [food, setFood] = useState('')
  const [symptom, setSymptom] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const inputRef = useRef(null)

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 20)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToInput = () => {
    inputRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
  
    const requestBody = {
      pet,
      symptom,
      food,
    };

    try {
      const response = await fetch('/api/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('petowkResult', JSON.stringify(data));
        router.push('/answer');
      } else {
        console.error('Error:', data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Request failed:', error.message);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
    <Head>
      <title>PetOWK</title>
      <link rel="icon" href="/pet.png" />
    </Head>
      <Header />
      <main className="flex-grow pt-24">

<Hero>
  
</Hero>
        <section ref={inputRef} className="bg-white py-24">
          <div className="container mx-auto px-6">
            <motion.h1 
              className='text-gray-600 text-5xl font-bold mb-4 text-center'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Know your Pet
            </motion.h1>
            <motion.div
              className="py-8 shadow-lg max-w-2xl mx-auto rounded-lg bg-gradient-to-r from-red-50 to-red-100"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <form onSubmit={handleSubmit} className="space-y-6 p-6">
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <select
                    className="w-full p-4 border border-red-600 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
                    value={queryType}
                    onChange={(e) => setQueryType(e.target.value)}
                    required
                  >
                    <option value="food">Food Suggestion</option>
                    <option value="nutrition">Nutritional Value</option>
                    <option value="vet">Veterinary Suggestion</option>
                  </select>
                </motion.div>

                {/* Form for Food Suggestion */}
                {queryType === 'food' && (
                  <motion.input
                    type="text"
                    placeholder="Enter pet type"
                    value={pet}
                    onChange={(e) => setPet(e.target.value)}
                    className="w-full p-4 text-lg border border-red-600 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    required
                  />
                )}

                {/* Form for Nutritional Value */}
                {queryType === 'nutrition' && (
                  <>
                    <motion.input
                      type="text"
                      placeholder="Enter pet name"
                      value={pet}
                      onChange={(e) => setPet(e.target.value)}
                      className="w-full p-4 text-lg border border-red-600 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      viewport={{ once: true }}
                      required
                    />
                    <motion.input
                      type="text"
                      placeholder="Enter food name"
                      value={food}
                      onChange={(e) => setFood(e.target.value)}
                      className="w-full p-4 text-lg border border-red-600 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      viewport={{ once: true }}
                      required
                    />
                  </>
                )}

                {/* Form for Veterinary Suggestion */}
                {queryType === 'vet' && (
                  <>
                    <motion.input
                      type="text"
                      placeholder="Enter pet name"
                      value={pet}
                      onChange={(e) => setPet(e.target.value)}
                      className="w-full p-4 text-lg border border-red-600 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      viewport={{ once: true }}
                      required
                    />
                    <motion.input
                      type="text"
                      placeholder="Enter pet symptom"
                      value={symptom}
                      onChange={(e) => setSymptom(e.target.value)}
                      className="w-full p-4 text-lg border border-red-600 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      viewport={{ once: true }}
                      required
                    />
                  </>
                )}

                <motion.button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-xl font-semibold py-4 rounded-lg text-white flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader className="w-6 h-6 animate-spin mr-2" />
                  ) : (
                    <Cat className="w-6 h-6 mr-2" />
                  )}
                  {isLoading ? 'Processing...' : 'Continue'}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </section>

        <Email />
      </main>
      <Footer />
    </div>
  )
}
