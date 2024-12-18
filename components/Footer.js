import { motion } from 'framer-motion'
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white py-16">
      <hr className="border-red-600 border-t-2 mb-6" />
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { title: 'Services', items: ['Pet food suggestion', 'Nutrition checker', 'AI vet', 'Vet booking'] },
            { title: 'Links', items: ['PetOWK Home', 'PetOWK Blog', 'PetOWK Vet Booking'] },
            { title: 'Contacts', items: ['Live support', 'Email support', 'Docs and FAQ'] },
            { title: 'NCX Family', items: ['PetOWK', 'NCX AI', 'Techno FAQ', 'Market Techno FAQ'] }
          ].map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-bold text-xl mb-4 text-red-700">{section.title}</h4>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <motion.li
                    key={itemIndex}
                    whileHover={{ scale: 1.05, x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <a href="#" className="text-lg text-gray-600 hover:text-red-600">
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
