import { motion } from 'framer-motion'
import { useState } from 'react';
import React from 'react';
import { Cat, Dog, ArrowDownCircle, Menu, X, ChevronDown, Loader } from 'lucide-react'

const Email = () => {
  const [email, setEmail] = useState('')
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        <motion.h3 
          className="text-4xl font-extrabold mb-8 text-center text-red-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Get in Touch
        </motion.h3>
        <motion.div 
          className="flex flex-col sm:flex-row max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <input
            type="email"
            placeholder="Enter a valid email address"
            className="flex-grow p-4 mb-4 sm:mb-0 sm:mr-4 text-lg border border-red-600 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <motion.button
            className="bg-red-600 hover:bg-red-700 text-xl font-semibold py-4 px-8 rounded-lg text-white flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Dog className="w-6 h-6 mr-2" /> Continue
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Email;
