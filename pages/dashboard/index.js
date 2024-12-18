'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import axios from 'axios'
import { Menu, Sun, Eye, Plus, ChevronDown, LogOut, Settings, Home, Send, Maximize2, MessageCircle, Users, Bell, Moon, X, Loader2, Trash2, Search, User, Utensils, Apple, Calendar, ChevronRight, PawPrint } from 'lucide-react'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { ScrollArea } from "../../components/ui/scroll-area"
import { Separator } from "../../components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet"
import ReactMarkdown from 'react-markdown'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import Link from 'next/link'
import { Features } from '../../components/features'
import CreatePetModal from '../../components/create-pet-modal';
import { sanitizeHtml } from '../../lib/sanitizeHtml';



export default function Dashboard() {
  const [isDetailSidebarOpen, setIsDetailSidebarOpen] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [queryType, setQueryType] = useState('symptom')
  const placeholderText = queryType === 'symptom'
                ? "Describe your pet's symptoms (e.g., 'coughing and sneezing')"
                : queryType === 'food'
                ? "Ask about a specific food (e.g., 'Is chicken good for dogs?')"
                : queryType === 'nutrition'
                ? "Ask about nutritional needs (e.g., 'Best diet for an overweight cat')"
                : "Select a query type and type your question"


  const toggleDetailSidebar = () => setIsDetailSidebarOpen(!isDetailSidebarOpen)
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const { data: session, status } = useSession()
  const [petName, setPetName] = useState("")
  const [petAge, setPetAge] = useState("")
  const [pets, setPets] = useState([])
  const [message, setMessage] = useState("")
  const [selectedPet, setSelectedPet] = useState(null)

  useEffect(() => {
    if (status === "authenticated") {
      fetchPetInfo()
    }
  }, [status])

  useEffect(() => {
    const scrollArea = document.querySelector('.scroll-area');
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (pets.length > 0 && !selectedPet) {
      const randomPet = pets[Math.floor(Math.random() * pets.length)]
      setSelectedPet({ petName: randomPet.petName, petAge: randomPet.petAge })
    }
  }, [pets, selectedPet])

  const fetchPetInfo = async () => {
    try {
      const res = await axios.get(`/api/user/pet?userEmail=${session?.user?.email}`)
      setPets(res.data)
    } catch (error) {
      setMessage(`Error fetching pets: ${error.response?.data?.error || error.message}`)
    }
  }

  const savePetInfo = async (petName, petAge) => {
    try {
      const res = await axios.post("/api/user/pet", {
        petName,
        petAge,
        userEmail: session.user.email,
      });
  
      setMessage("Pet information saved successfully.");
      fetchPetInfo();
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.error || error.message}`);
    }
  }
  
  
  const deletePet = async (petId) => {
    try {
      await axios.delete("/api/user/pet", { data: { petId } })
      setMessage("Pet deleted successfully.")
      fetchPetInfo()
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.error || error.message}`)
    }
  }


  const handlePetClick = (petName, petAge) => {
    localStorage.setItem('selectedPet', JSON.stringify({ petName, petAge }))
    setSelectedPet({ petName, petAge })
  }

  const handleChatSubmit = async (e) => {
    e.preventDefault()
    if (!inputValue.trim() || !selectedPet) return

    setIsLoading(true)
    const newMessage = { role: 'user', content: inputValue }
    setChatMessages((prev) => [...prev, newMessage])

    console.log('Sending request to API...')
    const startTime = Date.now()

    try {
      const response = await axios.post('/api/ollama', {
        pet: selectedPet.petName,
        [queryType]: inputValue,
      }, {
        timeout: 100000 // 100 seconds in milliseconds
      });

      console.log('API response received', response.data);
      setChatMessages((prev) => [...prev, { role: 'assistant', content: response.data.suggestion }]);
    } catch (error) {
      console.error('Error:', error);
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        setChatMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, the request timed out. Please try again.' }]);
      } else {
        setChatMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
      }
    } finally {
      const endTime = Date.now()
      console.log(`Request took ${endTime - startTime}ms`)
      setIsLoading(false)
      setInputValue('')
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold text-black">Welcome to PETOWK</h1>
            <p className="text-xl text-black">Your AI-powered pet care assistant</p>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-red-600 mb-4">You are not logged in</h2>
              <p className="text-black mb-6">Please log in or sign up to access PETOWK's features and start caring for your pets with AI assistance.</p>
              <div className="flex justify-center space-x-4">
                <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md transition duration-200">
                  <Link href="../">Log In</Link>
                </Button>
                <Button asChild variant="outline" className="bg-white hover:bg-gray-100 text-black py-2 px-6 rounded-lg shadow-md transition duration-200">
                  <Link href="../signup">Sign Up</Link>
                </Button>
              </div>
            </div>
          </div>
          <Features />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100 text-black">
      <aside className="hidden md:flex w-16 bg-white shadow-md flex-col items-center py-4 space-y-4">
        <Button variant="ghost" size="icon" className="text-black hover:bg-gray-100">
          <MessageCircle className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-black hover:bg-gray-100">
          <Users className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-black hover:bg-gray-100">
          <Bell className="h-6 w-6" />
        </Button>
        <Separator className="my-2 bg-gray-200" />
        <Button variant="ghost" size="icon" className="text-black hover:bg-gray-100" onClick={toggleDetailSidebar}>
          <Menu className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-black hover:bg-gray-100">
          <Sun className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-black hover:bg-gray-100">
          <LogOut className="h-6 w-6" />
        </Button>
      </aside>

      <aside
        className={`hidden md:flex bg-violet-100 border-r border-violet-200 transition-all duration-300 ease-in-out ${
          isDetailSidebarOpen ? 'w-64' : 'w-0'
        } flex-col overflow-hidden rounded-r-2xl`}
      >
        <ScrollArea className="flex-grow">
          <div className="p-2 space-y-8">
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>H</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm text-black">Welcome,</div>
                <div className="font-medium text-black">{session?.user?.name || "User"}</div>
              </div>
            </div>

            <div className="space-y-4 bg-white p-4 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-black">Your Pets</h3>
              {pets.length > 0 ? (
                <div className="space-y-3">
                  {pets.map((pet) => (
                    <div
                      key={pet._id}
                      className={`flex items-center justify-between p-3 rounded-xl border ${
                        selectedPet && selectedPet.petName === pet.petName
                          ? 'bg-indigo-100 border-indigo-300 shadow-md'
                          : 'bg-indigo-50 border-indigo-200 shadow-sm'
                      } transition-all duration-200 ease-in-out hover:shadow-md`}
                    >
                      <div
                        className="cursor-pointer flex-grow"
                        onClick={() => handlePetClick(pet.petName, pet.petAge)}
                      >
                        <div
                          className={`font-medium ${
                            selectedPet && selectedPet.petName === pet.petName ? 'text-black' : 'text-black'
                          }`}
                        >
                          {pet.petName}
                        </div>
                        <div className="text-xs text-black">{`Age: ${pet.petAge} months`}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-black hover:text-black hover:bg-indigo-100"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-black hover:text-black hover:bg-indigo-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription className="text-black">
                                This action cannot be undone. This will permanently delete your pet's data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-indigo-100 text-black hover:bg-indigo-200">Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-red-600 text-white hover:bg-red-700"
                                onClick={() => deletePet(pet._id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-black text-sm">No pets added yet.</p>
              )}
            </div>

            <div className="space-y-4 bg-white p-4 rounded-xl shadow-sm">
              <h4 className="text-lg font-semibold text-black">Add a New Pet</h4>

              <form onSubmit={savePetInfo} className="space-y-4">
                <Input
                  placeholder="Pet Name"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="bg-indigo-50 border-indigo-300 text-black placeholder-gray-400 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
                <Input
                  placeholder="Pet Age (in months)"
                  type="number"
                  value={petAge}
                  onChange={(e) => setPetAge(e.target.value)}
                  className="bg-indigo-50 border-indigo-300 text-black placeholder-gray-400 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full justify-start gap-2 border-indigo-300 text-black hover:text-black hover:bg-indigo-100 rounded-lg shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Pet
                </Button>
              </form>

              {message && <p className="text-black text-sm mt-2">{message}</p>}
            </div>
          </div>
        </ScrollArea>
      </aside>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50 bg-white shadow-md rounded-full">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] p-4 bg-violet-100">
          <div className="flex flex-col h-full">
            <div className=" border-b border-gray-200 flex justify-between items-center">
              <Tabs defaultValue="pets" className="flex-1">
                <TabsList className="w-full justify-start bg-white rounded-t-2xl p-1 h-12 space-x-1">
                  <TabsTrigger value="pets" className="flex-1 data-[state=active]:bg-violet-100 rounded-xl">Pets</TabsTrigger>
                  <TabsTrigger value="services" className="flex-1 data-[state=active]:bg-violet-100 rounded-xl">Services</TabsTrigger>
                  <TabsTrigger value="account" className="flex-1 data-[state=active]:bg-violet-100 rounded-xl">Account</TabsTrigger>
                </TabsList>
                <ScrollArea className="flex-1 mt-4">
                  <TabsContent value="pets" className="space-y-6">
                    <div className="bg-white p-4 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm text-black">Welcome,</div>
                          <div className="font-medium text-black">{session?.user?.name || "User"}</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-black">Your Pets</h3>
                        {pets.length > 0 ? (
                          <div className="space-y-3">
                            {pets.map((pet) => (
                              <div
                                key={pet._id}
                                className={`flex items-center justify-between p-3 rounded-xl border ${
                                  selectedPet && selectedPet.petName === pet.petName
                                    ? 'bg-violet-200 border-violet-300 shadow-md'
                                    : 'bg-violet-50 border-violet-200 shadow-sm'
                                } transition-all duration-200 ease-in-out hover:shadow-md`}
                              >
                                <div
                                  className="cursor-pointer flex-grow"
                                  onClick={() => handlePetClick(pet.petName, pet.petAge)}
                                >
                                  <div
                                    className={`font-medium ${
                                      selectedPet && selectedPet.petName === pet.petName ? 'text-black' : 'text-black'
                                    }`}
                                  >
                                    {pet.petName}
                                  </div>
                                  <div className="text-xs text-black">{`Age: ${pet.petAge} months`}</div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-black hover:text-black hover:bg-violet-100"
                                  >
                                    <Settings className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-black hover:text-black hover:bg-violet-100"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-white">
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-black">
                                          This action cannot be undone. This will permanently delete your pet's data.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel className="bg-violet-100 text-black hover:bg-violet-200">Cancel</AlertDialogCancel>
                                        <AlertDialogAction 
                                          className="bg-red-600 text-white hover:bg-red-700"
                                          onClick={() => deletePet(pet._id)}
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-black text-sm">No pets added yet.</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-sm">
                      <h4 className="text-lg font-semibold text-black mb-4">Add a New Pet</h4>

                      <form onSubmit={savePetInfo} className="space-y-4">
                        <Input
                          placeholder="Pet Name"
                          value={petName}
                          onChange={(e) => setPetName(e.target.value)}
                          className="bg-violet-50 border-violet-300 text-black placeholder-gray-400 rounded-lg shadow-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                          required
                        />
                        <Input
                          placeholder="Pet Age (in months)"
                          type="number"
                          value={petAge}
                          onChange={(e) => setPetAge(e.target.value)}
                          className="bg-violet-50 border-violet-300 text-black placeholder-gray-400 rounded-lg shadow-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                          required
                        />
                        <Button
                          type="submit"
                          variant="outline"
                          className="w-full justify-start gap-2 border-violet-300 text-black hover:text-black hover:bg-violet-100 rounded-lg shadow-sm"
                        >
                          <Plus className="h-4 w-4" />
                          Add Pet
                        </Button>
                      </form>

                      {message && <p className="text-black text-sm mt-2">{message}</p>}
                    </div>
                  </TabsContent>
                  <TabsContent value="services" className="space-y-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm">
                      <h3 className="text-lg font-semibold text-black mb-4">Our Services</h3>
                      <nav className="space-y-2">
                        <Button variant="ghost" className="w-full justify-start text-black hover:bg-violet-100">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Chat with AI Vet
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-black hover:bg-violet-100">
                          <Utensils className="mr-2 h-4 w-4" />
                          Food suggestion
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-black hover:bg-violet-100">
                          <Apple className="mr-2 h-4 w-4" />
                          Nutrition checker
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-black hover:bg-violet-100">
                          <Calendar className="mr-2 h-4 w-4" />
                          Vet booking
                        </Button>
                      </nav>
                    </div>
                  </TabsContent>
                  <TabsContent value="account" className="space-y-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm">
                      <h3 className="text-lg font-semibold text-black mb-4">Account Settings</h3>
                      <div className="space-y-2">
                        <Button variant="ghost" className="w-full justify-start text-black hover:bg-violet-100">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-black hover:bg-violet-100">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-black hover:bg-violet-100">
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <main className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden mr-2 text-black hover:bg-indigo-100">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                </Sheet>
                <Link href="/" className="flex items-center">
                  <PawPrint className="h-8 w-8 text-black mr-2" />
                  <h1 className="text-xl font-bold text-black">PETOWK</h1>
                </Link>
              </div>
              <nav className="hidden md:flex items-center space-x-4">
                <Button variant="ghost" className="text-black hover:bg-indigo-50 hover:text-black">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat with AI Vet
                </Button>
                <Button variant="ghost" className="text-black hover:bg-indigo-50 hover:text-black">
                  <Utensils className="mr-2 h-4 w-4" />
                  Food suggestion
                </Button>
                <Button variant="ghost" className="text-black hover:bg-indigo-50 hover:text-black">
                  <Apple className="mr-2 h-4 w-4" />
                  Nutrition checker
                </Button>
                <Button variant="ghost" className="text-black hover:bg-indigo-50 hover:text-black">
                  <Calendar className="mr-2 h-4 w-4" />
                  Vet booking
                </Button>
              </nav>
              <div className="flex items-center space-x-4">
                <CreatePetModal onSave={savePetInfo} trigger={
                  <Button variant="outline" size="sm" className="hidden md:flex bg-indigo-50 text-black hover:bg-indigo-100">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Pet
                  </Button>
                } />
                <Button variant="ghost" size="icon" className="text-black hover:bg-indigo-50 hover:text-black">
                  <Bell className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt={session?.user?.name || "User"} />
                        <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg rounded-md border border-gray-200">
                    <DropdownMenuItem className="hover:bg-indigo-50">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-indigo-50">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-indigo-50">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1">
            <div className="container mx-auto px-4 py-8">
              <div className="max-w-3xl mx-auto space-y-8">
                {selectedPet ? (
                  <>
                    <nav className="flex" aria-label="Breadcrumb">
                      <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                          <Link href="/" className="inline-flex items-center text-sm font-medium text-black hover:text-black">
                            <Home className="w-4 h-4 mr-2" />
                            Home
                          </Link>
                        </li>
                        <li>
                          <div className="flex items-center">
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                            <span className="ml-1 text-sm font-medium text-black md:ml-2">{selectedPet.petName}</span>
                          </div>
                        </li>
                      </ol>
                    </nav>
                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-2 text-black">Chat with PETOWK AI about {selectedPet.petName}</h2>
                      <p className="text-black text-lg">
                        Ask questions about {selectedPet.petName}'s health, nutrition, or care.
                      </p>
                    </div>
                    <div className="space-y-6">
                      {chatMessages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[80%] p-4 rounded-lg shadow-md ${
                              message.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-white text-black border border-gray-200'
                            }`}
                          >
                            {message.role === 'user' ? (
                              <p>{message.content}</p>
                            ) : (
                              <div 
                                className="prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(message.content) }}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-center items-center space-x-2">
                          <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                          <span className="text-black">Processing your request...</span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-20">
                    <h2 className="text-3xl font-bold mb-4 text-black">Welcome to PETOWK</h2>
                    <p className="text-black text-lg mb-8">
                      {pets.length > 0
                        ? "Select a pet from the sidebar to start chatting with our AI Vet."
                        : "You haven't added any pets yet. Create your first pet to get started!"}
                    </p>
                    {pets.length > 0 ? (
                      <Button onClick={() => setIsDetailSidebarOpen(true)} className="bg-indigo-500 hover:bg-indigo-600 text-white shadow-md text-lg py-2 px-6">
                        Select a Pet
                      </Button>
                    ) : (
                      <CreatePetModal onSave={savePetInfo} trigger={
                        <Button className="bg-indigo-500 hover:bg-indigo-600 text-white shadow-md text-lg py-2 px-6">
                          Add Your First Pet
                        </Button>
                      } />
                    )}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          <div className="bg-white border-t border-gray-200 p-6 sticky bottom-0 shadow-lg">
            <form 
              onSubmit={handleChatSubmit} 
              className="max-w-4xl mx-auto grid grid-cols-4 gap-4 items-center"
            >
              <div className="col-span-4 md:col-span-1">
                <Select value={queryType} onValueChange={setQueryType}>
                  <SelectTrigger className="w-full bg-gray-100 border border-gray-300 rounded-xl shadow-sm text-black hover:bg-gray-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none px-4 py-3">
                    <SelectValue placeholder="Choose a query type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg text-black">
                    <SelectItem value="symptom">Symptom</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="nutrition">Nutrition</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-4 md:col-span-3 relative flex items-center gap-2">
                <Input
                  placeholder={placeholderText}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full bg-indigo-50 border-2 border-indigo-300 text-black placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg py-3 px-4 shadow-sm"
                  disabled={!selectedPet || isLoading}
                />
                <Button 
                  type="submit" 
                  className="bg-black hover:bg-gray-800 text-white rounded-lg px-6 py-3 font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition duration-200"
                  disabled={!selectedPet || isLoading}
                >
                  <span className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Send
                  </span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

