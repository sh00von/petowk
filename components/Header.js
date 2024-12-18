import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Cat, Dog, ArrowDownCircle, Menu, X, ChevronDown, Loader } from 'lucide-react'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    const inputRef = useRef(null)
    const { scrollY } = useScroll()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    const menuItems = [
      { name: 'Home', href: '/' },
      { name: 'Nutrition Checker', href: '#nutrition' },
      { name: 'AI Vet', href: '#ai-vet' },
      { name: 'Vet Booking', href: '#vet-booking' },
  ]

    const scrollToInput = () => {
        inputRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0">
                            <h1 className='text-red-700 text-4xl font-bold'>PetOWK</h1>
                        </Link>
                    </div>
                    <nav className="hidden md:flex space-x-8">
                        {menuItems.map((item) => (
                            item.submenu ? (
                                <div key={item.name} className="relative group">
                                    <button className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                                        {item.name}
                                        <ChevronDown className="ml-1 h-4 w-4" />
                                    </button>
                                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
                                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                            {item.submenu.map((subItem) => (
                                                <Link
                                                    key={subItem}
                                                    href={`#${subItem.toLowerCase().replace(' ', '-')}`}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                    role="menuitem"
                                                >
                                                    {subItem}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    {item.name}
                                </Link>
                            )
                        ))}
                    </nav>
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-[30px] shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Log in
                        </Link>
                    </div>
                    <div className="flex md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-red-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="md:hidden"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
                            {menuItems.map((item) => (
                                <div key={item.name}>
                                    {item.submenu ? (
                                        <div className="space-y-1">
                                            <button
                                                className="text-gray-700 hover:text-red-600 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                                                onClick={() => {}} // Toggle submenu visibility
                                            >
                                                {item.name}
                                                <ChevronDown className="ml-1 h-4 w-4 inline" />
                                            </button>
                                            <div className="pl-4 space-y-1">
                                                {item.submenu.map((subItem) => (
                                                    <Link
                                                        key={subItem}
                                                        href={`#${subItem.toLowerCase().replace(' ', '-')}`}
                                                        className="text-gray-600 hover:text-red-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-sm"
                                                    >
                                                        {subItem}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className="text-gray-700 hover:text-red-600 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
                                        >
                                            {item.name}
                                        </Link>
                                    )}
                                </div>
                            ))}
                            <div className="pt-4 pb-3 border-t border-gray-200">
                                <Link
                                    href="/login"
                                    className="mx-2 px-4 py-2 border border-transparent rounded-[30px] shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Log in
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

export default Header
