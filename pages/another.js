"use client"

import React, { useState, useEffect } from 'react'
import { Cpu, Brain, Zap, ChevronRight, Menu, X, Search, Upload, MessageSquare, Twitter, Facebook, Instagram, PawPrintIcon as Paw, Calendar, Mail } from 'lucide-react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Head from 'next/head'
export default function Component() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('suggestions')
  const [email, setEmail] = useState('')

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle email subscription logic here
    console.log('Subscribed:', email)
    setEmail('')
  }

  const controls = useAnimation()
  const [ref, inView] = useInView()

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  const containerVariants = {
    hidden: { opacity: 1, y: 5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 text-gray-800 font-sans relative">
        <Head>
      <title>PetOWK</title>
      <link rel="icon" href="/pet.png" />
    </Head>
      <div className="absolute inset-0 z-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
          <path d="M14 16H9v-2h5V9.87a4 4 0 1 1 2 0V14h5v2h-5v15.95A10 10 0 0 0 23.66 27l-3.46-2 8.2-2.2-2.9 5a12 12 0 0 1-21 0l-2.89-5 8.2 2.2-3.47 2A10 10 0 0 0 14 31.95V16zm40 40h-5v-2h5v-4.13a4 4 0 1 1 2 0V54h5v2h-5v15.95A10 10 0 0 0 63.66 67l-3.47-2 8.2-2.2-2.88 5a12 12 0 0 1-21.02 0l-2.88-5 8.2 2.2-3.47 2A10 10 0 0 0 54 71.95V56zm-39 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm40-40a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM15 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm40 40a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="currentColor" fillOpacity="0.4" fillRule="evenodd"/>
        </svg>
      </div>

      <header className="bg-white shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl sm:text-3xl font-bold text-blue-600 flex items-center">
            <Paw className="h-8 w-8 sm:h-10 sm:w-10 mr-2 animate-pulse text-blue-600" />
            PetOWK AI
          </div>
          <div className="hidden md:flex space-x-4">
            <a href="#" className="text-lg text-gray-600 hover:text-blue-600 transition-colors duration-300">Nutrition Checker</a>
            <a href="#" className="text-lg text-gray-600 hover:text-blue-600 transition-colors duration-300">AI Vet</a>
            <a href="#" className="text-lg text-gray-600 hover:text-blue-600 transition-colors duration-300">Vet Booking</a>
          </div>
          <button className="hidden md:block bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-lg">
            Get Started
          </button>
          <button onClick={toggleMenu} className="md:hidden text-gray-600 hover:text-blue-600 transition-colors duration-300" aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
        {isMenuOpen && (
          <div className="md:hidden bg-white py-2 px-4">
            <a href="#" className="block py-2 text-lg text-gray-600 hover:text-blue-600 transition-colors duration-300">Nutrition Checker</a>
            <a href="#" className="block py-2 text-lg text-gray-600 hover:text-blue-600 transition-colors duration-300">AI Vet</a>
            <a href="#" className="block py-2 text-lg text-gray-600 hover:text-blue-600 transition-colors duration-300">Vet Booking</a>
            <button className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-lg">
              Get Started
            </button>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-8 sm:py-16 flex flex-col items-center relative z-10">
       <motion.section 
    className="text-center max-w-6xl mb-12 sm:mb-16"
    initial="hidden"
    animate="visible"
    variants={containerVariants}
  >
    <motion.div className="flex flex-col sm:flex-row sm:justify-between items-center text-center sm:text-left" variants={itemVariants}>
      {/* Left column for heading and paragraph */}
      <div className="sm:w-2/3 mb-6 sm:mb-0">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight text-gray-900">
          <span className='text-blue-600'>PetOWK</span>, your <span className='text-green-600'>AI</span> powered friend for your pets
        </h1>
        <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto sm:mx-0">
          Check food suggestions or nutritional value, get AI veterinary suggestions or book an expert vet specialist for your pet.
        </p>
      </div>

      {/* Right column for the button */}
      <div className="sm:w-1/3 flex justify-center sm:justify-end">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center text-lg sm:text-xl">
          Get Started
          <ChevronRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>
    </motion.div>
  </motion.section>

        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
          }}
          className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-xl mb-12 sm:mb-16"
        >
          <div className="flex flex-col sm:flex-row mb-4 gap-2 sm:gap-4">
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`flex-1 py-2 px-4 rounded-full transition-all duration-300 transform text-base sm:text-lg ${activeTab === 'suggestions' ? 'bg-blue-600 text-white scale-105' : 'text-gray-600 hover:bg-blue-100 hover:scale-105'}`}
            >
              <Search className="inline-block mr-2 h-5 w-5" />
              Food Suggestions
            </button>
            <button
              onClick={() => setActiveTab('checker')}
              className={`flex-1 py-2 px-4 bg-blue-100 text-gray-700 rounded-full transition-all duration-300 transform text-base sm:text-lg ${activeTab === 'checker' ? 'bg-blue-600 text-white scale-105' : 'text-gray-600 hover:bg-blue-200 hover:scale-105'}`}
            >
              <Upload className="inline-block mr-2 h-5 w-5" />
              Nutrition Checker
            </button>
            <button
              onClick={() => setActiveTab('vet')}
              className={`flex-1 py-2 px-4 bg-blue-100 text-gray-700 rounded-full transition-all duration-300 transform text-base sm:text-lg ${activeTab === 'vet' ? 'bg-blue-600 text-white scale-105' : 'text-gray-600 hover:bg-blue-200 hover:scale-105'}`}
            >
              <MessageSquare className="inline-block mr-2 h-5 w-5" />
              AI Vet
            </button>
          </div>
          <div className="mt-4">
            {activeTab === 'suggestions' && (
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="text" placeholder="Enter your pet type" className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-lg" />
                <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-base sm:text-lg">
                  Get AI Suggestions
                </button>
              </div>
            )}
            {activeTab === 'checker' && (
              <div className="flex flex-col gap-2">
                <input type="text" placeholder="Enter pet species (e.g., Dog, Cat)" className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-lg" />
                <input type="text" placeholder="Enter food name" className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-lg" />
                <div className="flex justify-center">
                 <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-base sm:text-lg">
                    AI Nutrition Check
                  </button>
                </div>
              </div>
            )}
            {activeTab === 'vet' && (
              <div className="flex flex-col gap-2">
                <input type="text" placeholder="Enter pet species and breed (e.g Labrador dog)" className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-lg" />
                <input type="text" placeholder="Enter symptoms (e.g Fever, sneezing)" className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-lg" />
                <div className="flex flex-col sm:flex-row gap-2">
                  <button className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-base sm:text-lg">
                    Ask AI Vet
                  </button>
                  <button className="flex-1 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center text-base sm:text-lg">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Specialist
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.section 
          id="features" 
          className="mb-12 sm:mb-16 w-full max-w-5xl"
          ref={ref}
          animate={controls}
          initial="hidden"
          variants={containerVariants}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 sm:mb-8 text-center">PetOWK Features</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-600 rounded-bl-full transition-all duration-300 group-hover:w-full group-hover:h-full group-hover:rounded-none group-hover:opacity-10"></div>
              <Cpu className="text-blue-600 mb-4 w-12 h-12 sm:w-16 sm:h-16 transition-all duration-300 group-hover:scale-110" />
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 relative z-10">AI-Driven Analysis</h3>
              <p className="text-base sm:text-lg text-gray-600 relative z-10">Our advanced AI algorithms analyze your pet's unique characteristics to provide tailored nutrition advice.</p>
            </motion.div>
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-green-500 rounded-bl-full transition-all duration-300 group-hover:w-full group-hover:h-full group-hover:rounded-none group-hover:opacity-10"></div>
              <Brain className="text-green-500 mb-4 w-12 h-12 sm:w-16 sm:h-16 transition-all duration-300 group-hover:scale-110" />
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 relative z-10">Continuous Learning</h3>
              <p className="text-base sm:text-lg text-gray-600 relative z-10">Our AI system continuously learns and adapts to provide ever-improving recommendations for your pet's health.</p>
            </motion.div>
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500 rounded-bl-full transition-all duration-300 group-hover:w-full group-hover:h-full group-hover:rounded-none group-hover:opacity-10"></div>
              <Zap className="text-yellow-500 mb-4 w-12 h-12 sm:w-16 sm:h-16 transition-all duration-300 group-hover:scale-110" />
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 relative z-10">Instant AI Insights</h3>
              <p className="text-base sm:text-lg text-gray-600 relative z-10">Get immediate, AI-generated insights about your pet's nutrition and health needs.</p>
            </motion.div>
          </div>
        </motion.section>

        <motion.section 
          className="w-full max-w-4xl mx-auto mb-12 sm:mb-16"
          ref={ref}
          animate={controls}
          initial="hidden"
          variants={containerVariants}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 sm:mb-8 text-center">Stay Updated</h2>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-lg"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center text-base sm:text-lg"
            >
              <Mail className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
              Subscribe
            </button>
          </form>
        </motion.section>
      </main>

      <footer className="bg-blue-800 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">About PetOWK AI</h3>
              <p className="text-base sm:text-lg text-blue-200">
                Revolutionizing pet care with AI-powered recommendations for happier, healthier pets.
              </p>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">AI Features</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-base sm:text-lg text-blue-200 hover:text-white transition-colors duration-300">AI Food Suggestions</a></li>
                <li><a href="#" className="text-base sm:text-lg text-blue-200 hover:text-white transition-colors duration-300">AI Nutrition Checker</a></li>
                <li><a href="#" className="text-base sm:text-lg text-blue-200 hover:text-white transition-colors duration-300">AI Vet Assistant</a></li>
                <li><a href="#" className="text-base sm:text-lg text-blue-200 hover:text-white transition-colors duration-300">PetOWK Vet Booking</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-base sm:text-lg text-blue-200 hover:text-white transition-colors duration-300">NCX Family</a></li>
                <li><a href="#" className="text-base sm:text-lg text-blue-200 hover:text-white transition-colors duration-300">PetOWK Home</a></li>
                <li><a href="#" className="text-base sm:text-lg text-blue-200 hover:text-white transition-colors duration-300">Live Support</a></li>
                <li><a href="#" className="text-base sm:text-lg text-blue-200 hover:text-white transition-colors duration-300">Email Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-base sm:text-lg text-blue-200 hover:text-white transition-colors duration-300">PetOWK Blog</a></li>
                <li><a href="#" className="text-base sm:text-lg text-blue-200 hover:text-white transition-colors duration-300">Docs and FAQ</a></li>
                <li><a href="#" className="text-base sm:text-lg text-blue-200 hover:text-white transition-colors duration-300">Techno FAQ</a></li>
                <li><a href="#" className="text-base sm:text-lg text-blue-200 hover:text-white transition-colors duration-300">Market by Techno FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center text-blue-200">
            <p className="text-base sm:text-lg">&copy; 2024 PetOWK AI. All rights reserved. Revolutionizing pet care with artificial intelligence.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}