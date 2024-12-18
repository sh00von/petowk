import { motion } from 'framer-motion'
import React from 'react';
 import { useState, useEffect, useRef } from 'react'
 import { ArrowDownCircle } from 'lucide-react'
const Hero = () => {

    
  const inputRef = useRef(null)
      const scrollToInput = () => {
        inputRef.current?.scrollIntoView({ behavior: 'smooth' })
      }
  return (
    <section className="container mx-auto px-6 py-24">
    <div className="flex flex-col lg:flex-row items-center justify-between">
      <motion.div 
        className="lg:w-1/2 mb-12 lg:mb-0 pr-0 lg:pr-12"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-center lg:text-left text-gray-700">
          <span className="text-red-600">PetOWK</span>, your AI-powered friend for your pets
        </h2>
        <p className="text-xl lg:text-2xl text-gray-600 mb-8 text-center lg:text-left">
        Check food suggestion or nutritional value, get AI veterinary suggestion or book an expert vet specialist for your pet.
        </p>
      </motion.div>
      <motion.div 
        className="lg:w-1/2 flex justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative w-80 h-80 bg-gradient-to-br from-red-400 to-red-500 rounded-full overflow-hidden shadow-xl">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white/20 flex items-end justify-center">
            <motion.img 
              src='/pet.png' 
              alt="Pet"
              className="w-full h-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>
        </div>
      </motion.div>
    </div>
{/*     
    <motion.div 
      className="flex justify-center mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <motion.button
        onClick={scrollToInput}
        className="p-4 rounded-full bg-red-300 text-white hover:bg-red-400"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowDownCircle className="w-8 h-8" />
      </motion.button>
    </motion.div> */}
  </section>
  );
}

export default Hero;