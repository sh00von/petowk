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
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import { Helmet } from 'react-helmet';



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
        petAge: parseInt(petAge, 10),
        userEmail: session.user.email,
      });

      setMessage("Pet information saved successfully.");
      fetchPetInfo();
      setPetName("");
      setPetAge("");
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
                <Button asChild className="bg-blue-500 hover:bg-blue-600 text-black py-2 px-6 rounded-lg shadow-md transition duration-200">
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
      <Helmet>
        <style>{`
          body {
            font-family: 'Times New Roman', serif;
          }
          * {
            color: black;
          }
          a:hover {
            color: #4F46E5; /* indigo-600 */
          }
        `}</style>
      </Helmet>
      <aside className="hidden md:flex w-16 bg-gray-50 shadow-md flex-col items-center py-6 space-y-6  border border-r-4 border-gray-300">
        <Button variant="ghost" size="icon" className="text-black hover:bg-indigo-100 hover:text-black transition-colors duration-200">
          <MessageCircle className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-black hover:bg-indigo-100 hover:text-black transition-colors duration-200">
          <Users className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-black hover:bg-indigo-100 hover:text-black transition-colors duration-200">
          <Bell className="h-6 w-6" />
        </Button>
        <Separator className="my-4 w-full bg-gray-200" />
        <Button variant="ghost" size="icon" className="text-black hover:bg-indigo-100 hover:text-black transition-colors duration-200" onClick={toggleDetailSidebar}>
          <Menu className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-black hover:bg-indigo-100 hover:text-black transition-colors duration-200">
          <Sun className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-black hover:bg-indigo-100 hover:text-black transition-colors duration-200">
          <LogOut className="h-6 w-6" />
        </Button>
      </aside>



      <aside
        className={`hidden md:flex border-r border-indigo-200 transition-all duration-300 ease-in-out ${isDetailSidebarOpen ? 'w-64' : 'w-0'
          } flex-col overflow-hidden bg-indigo-50`}
      >
        <ScrollArea className="flex-grow">
          <div className="p-4 space-y-8">
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
                      className={`flex items-center justify-between p-3 rounded-xl border ${selectedPet && selectedPet.petName === pet.petName
                          ? 'bg-indigo-100 border-indigo-300 shadow-md'
                          : 'bg-indigo-50 border-indigo-200 shadow-sm'
                        } transition-all duration-200 ease-in-out hover:shadow-md`}
                    >
                      <div
                        className="cursor-pointer flex-grow"
                        onClick={() => handlePetClick(pet.petName, pet.petAge)}
                      >
                        <div
                          className={`font-medium ${selectedPet && selectedPet.petName === pet.petName ? 'text-black' : 'text-black'
                            }`}
                        >
                          {pet.petName}
                        </div>
                        <div className="text-sm text-black">{`Age: ${pet.petAge} months`}</div>
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
                                className="bg-red-600 text-black hover:bg-red-700"
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

              <form onSubmit={(e) => {
                e.preventDefault();
                savePetInfo(petName, petAge);
              }} className="space-y-4">
                <Input
                  placeholder="Pet Name"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="bg-indigo-100 border-indigo-300 text-black placeholder-indigo-400 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
                <Input
                  placeholder="Pet Age (in months)"
                  type="number"
                  value={petAge}
                  onChange={(e) => setPetAge(e.target.value)}
                  className="bg-indigo-100 rounded-xl border-indigo-300 text-black placeholder-indigo-400  shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full justify-start gap-2 border-indigo-300 text-black hover:text-black hover:bg-indigo-200 rounded-xl shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Pet
                </Button>
              </form>

              {message && <p className="text-black text-sm mt-2">{message}</p>}
            </div>
            <div className="space-y-4 bg-white p-4 rounded-xl shadow-sm">
              <h4 className="text-lg font-semibold text-black">Select AI Model</h4>
              <Select>
                <SelectTrigger className="w-full bg-indigo-100 border-indigo-300 text-black rounded-xl">
                  <SelectValue placeholder="Select an AI model" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl border-indigo-200">
                  <SelectGroup>
                    <SelectLabel>AI Models</SelectLabel>
                    <SelectItem className="rounded-xl hover:bg-indigo-100" value="gpt-4">GPT-4</SelectItem>
                    <SelectItem className="rounded-xl hover:bg-indigo-100" value="gpt-3.5">GPT-3.5</SelectItem>
                    <SelectItem className="rounded-xl hover:bg-indigo-100" value="dalle-2">DALL-E 2</SelectItem>
                    <SelectItem className="rounded-xl hover:bg-indigo-100" value="stable-diffusion">Stable Diffusion</SelectItem>
                    <SelectItem className="rounded-xl hover:bg-indigo-100" value="clip">CLIP</SelectItem>
                    <SelectItem className="rounded-xl hover:bg-indigo-100" value="lama">LLaMA</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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
  <SheetContent side="left" className="w-[300px] sm:w-[400px] p-4 bg-indigo-100 overflow-y-auto max-h-screen ">
    <div className="flex flex-col h-full ">
      <div className="border-b border-gray-200 flex justify-between items-center pt-8 pb-8">
        <Tabs defaultValue="pets" className="flex-1">
          <TabsList className="w-full justify-start bg-white rounded-2xl p-1 h-12 space-x-1">
            <TabsTrigger value="pets" className="flex-1 data-[state=active]:bg-indigo-200 rounded-xl">Pets</TabsTrigger>
            <TabsTrigger value="services" className="flex-1 data-[state=active]:bg-indigo-200 rounded-xl">Services</TabsTrigger>
            <TabsTrigger value="account" className="flex-1 data-[state=active]:bg-indigo-200 rounded-xl">Account</TabsTrigger>
          </TabsList>

          {/* Scroll Area for Tabs Content */}
          <ScrollArea className="flex-1 mt-4 overflow-y-auto max-h-full">
            <TabsContent value="pets" className="space-y-6">
              <div className="bg-white p-4 rounded-xl shadow-sm">
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
                          className={`flex items-center justify-between p-3 rounded-xl border ${selectedPet && selectedPet.petName === pet.petName
                              ? 'bg-indigo-200 border-indigo-300 shadow-md'
                              : 'bg-indigo-50 border-indigo-200 shadow-sm'
                            } transition-all duration-200 ease-in-out hover:shadow-md`}
                        >
                          <div
                            className="cursor-pointer flex-grow"
                            onClick={() => handlePetClick(pet.petName, pet.petAge)}
                          >
                            <div
                              className={`font-medium ${selectedPet && selectedPet.petName === pet.petName ? 'text-black' : 'text-black'
                                }`}
                            >
                              {pet.petName}
                            </div>
                            <div className="text-sm text-black">{`Age: ${pet.petAge} months`}</div>
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
                                    className="bg-red-600 text-black hover:bg-red-700"
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

              <div className="space-y-4 bg-white p-4 rounded-xl shadow-sm">
                <h4 className="text-lg font-semibold text-black">Add a New Pet</h4>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  savePetInfo(petName, petAge);
                }} className="space-y-4">
                  <Input
                    placeholder="Pet Name"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    className="bg-indigo-100 border-indigo-300 text-black placeholder-indigo-400 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                  <Input
                    placeholder="Pet Age (in months)"
                    type="number"
                    value={petAge}
                    onChange={(e) => setPetAge(e.target.value)}
                    className="bg-indigo-100 rounded-xl border-indigo-300 text-black placeholder-indigo-400 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full justify-start gap-2 border-indigo-300 text-black hover:text-black hover:bg-indigo-200 rounded-xl shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Add Pet
                  </Button>
                </form>
                {message && <p className="text-black text-sm mt-2">{message}</p>}
              </div>

              <div className="space-y-4 bg-white p-4 rounded-xl shadow-sm">
                <h4 className="text-lg font-semibold text-black">Select AI Model</h4>
                <Select>
                  <SelectTrigger className="w-full bg-indigo-100 border-indigo-300 text-black rounded-xl">
                    <SelectValue placeholder="Select an AI model" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl border-indigo-200">
                    <SelectGroup>
                      <SelectLabel>AI Models</SelectLabel>
                      <SelectItem className="rounded-xl hover:bg-indigo-100" value="gpt-4">GPT-4</SelectItem>
                      <SelectItem className="rounded-xl hover:bg-indigo-100" value="gpt-3.5">GPT-3.5</SelectItem>
                      <SelectItem className="rounded-xl hover:bg-indigo-100" value="dalle-2">DALL-E 2</SelectItem>
                      <SelectItem className="rounded-xl hover:bg-indigo-100" value="stable-diffusion">Stable Diffusion</SelectItem>
                      <SelectItem className="rounded-xl hover:bg-indigo-100" value="clip">CLIP</SelectItem>
                      <SelectItem className="rounded-xl hover:bg-indigo-100" value="lama">LLaMA</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

            </TabsContent>

            {/* Services Tab Content */}
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

            {/* Account Tab Content */}
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
        <header className="bg-white border-b border-indigo-200 sticky top-0 z-10 shadow-sm ">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center px-12">
                  <PawPrint className="h-8 w-8 text-black mr-2" />
                  <h1 className="text-xl font-bold text-black">PETOWK</h1>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <CreatePetModal onSave={savePetInfo} trigger={
                  <Button variant="outline" size="sm" className="hidden md:flex bg-indigo-50 text-black hover:bg-indigo-100 rounded-xl">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Pet
                  </Button>
                } />
                <Button variant="ghost" size="icon" className="text-black hover:bg-indigo-100 hover:text-black rounded-xl">
                  <Bell className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8 rounded-xl">
                        <AvatarImage src="/placeholder.svg" alt={session?.user?.name || "User"} />
                        <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg rounded-xl border border-gray-200">
                    <DropdownMenuItem className="hover:bg-indigo-50 rounded-xl">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-indigo-50 rounded-xl">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-indigo-50 rounded-xl">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>


        <div className="flex-1 overflow-hidden flex flex-col" style={{backgroundColor: '#e4e8f0'}}>
          <ScrollArea className="flex-1">
            <div className="container mx-auto px-4 py-8">
              <div className=" mx-auto space-y-8">
                {selectedPet ? (
                  <>
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
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                        >
                          <div
                            className={`max-w-[80%] p-4 rounded-xl shadow-lg ${message.role === 'user'
                                ? 'bg-indigo-500 text-black self-end rounded-br-none' // User message with rounded bottom right corner
                                : 'bg-white text-black border border-gray-300 self-start rounded-bl-none' // Bot message with rounded bottom left corner
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
                      <Button onClick={() => setIsDetailSidebarOpen(true)} className="bg-indigo-500 hover:bg-indigo-600 text-black shadow-md text-lg py-2 px-6">
                        Select a Pet
                      </Button>
                    ) : (
                      <CreatePetModal onSave={savePetInfo} trigger={
                        <Button className="bg-indigo-500 hover:bg-indigo-600 text-black shadow-md text-lg py-2 px-6">
                          Add Your First Pet
                        </Button>
                      } />
                    )}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          <div className="bg-white border-t border-indigo-200 p-6 sticky bottom-0 shadow-lg z-10">
  <form
    onSubmit={handleChatSubmit}
    className="max-w-4xl mx-auto grid grid-cols-4 gap-4 items-center"
  >
    {/* Query Type Select */}
    <div className="col-span-4 md:col-span-1">
    <Select value={queryType} onValueChange={setQueryType}>
        <SelectTrigger className="w-full bg-indigo-100 border-indigo-300 rounded-xl shadow-md text-black hover:bg-indigo-200 px-6 py-4 text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors duration-200">
          <SelectValue placeholder="Choose a query type" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-indigo-200 rounded-xl shadow-lg text-black">
          <SelectItem className="hover:bg-indigo-100 focus:bg-indigo-200 rounded-xl" value="symptom">Symptom</SelectItem>
          <SelectItem className="hover:bg-indigo-100 focus:bg-indigo-200 rounded-xl" value="food">Food</SelectItem>
          <SelectItem className="hover:bg-indigo-100 focus:bg-indigo-200 rounded-xl" value="nutrition">Nutrition</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Input Field with Send Button */}
    <div className="col-span-4 md:col-span-3 relative flex items-center gap-4">
      <Input
        placeholder={placeholderText}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full bg-indigo-100 border-2 border-indigo-300 text-black placeholder-indigo-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl py-4 px-6 text-lg shadow-sm"
        disabled={!selectedPet || isLoading}
      />

      {/* Send Button */}
      <Button
  type="submit"
  className="bg-indigo-600 hover:bg-indigo-800 text-white rounded-xl px-4 py-5 font-semibold text-lg shadow-lg hover:shadow-2xl transform hover:scale-110 transition duration-300 ease-in-out"
  disabled={!selectedPet || isLoading}
>
  <span className="flex items-center gap-3 text-white">
    <PawPrint className="h-16 w-16" color="white" />
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

