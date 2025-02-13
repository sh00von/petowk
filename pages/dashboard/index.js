'use client'
import { signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react'
import { useSession } from "next-auth/react"
import axios from 'axios'
import { Menu, Sun, Eye, Plus,ArrowUp, ChevronDown, LogOut, Settings, Home, Send, Maximize2, MessageCircle, Users, Bell, Moon, X, Loader2, Trash2, Search, User, Utensils, Apple, Calendar, ChevronRight, PawPrint } from 'lucide-react'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import Head from 'next/head'
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



import { useRouter } from 'next/router';

export default function Dashboard() {
  
  const [isDetailSidebarOpen, setIsDetailSidebarOpen] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter();

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

  const chatContainerRef = useRef(null);
  useEffect(() => {
    if (status === 'authenticated') {
      fetchPetInfo();
    } else if (status === 'unauthenticated') {
      // Redirect to the login page
      router.push('/'); // Navigate to the homepage or login page
    }
  }, [status, router]); // Adding `router` to dependencies

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
    //redirect to login page
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-800">Please sign in to access the dashboard.</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      <Head>
        <title>
          PETOWK - AI-powered pet care assistant
        </title>
      </Head>
      <Helmet>
        <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

  body {
    font-family: 'Inter', sans-serif;
  }
  * {
    color: black;
  }
  a:hover {
    color: #4F46E5; /* indigo-600 */
  }`}
        </style>

      </Helmet>
      <aside className="hidden md:flex w-16 bg-white shadow-md flex-col items-center py-6 border-r border-gray-200">
      <div className="flex-1 flex flex-col items-center space-y-6">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-200"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-200"
        >
          <Users className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-200"
        >
          <Bell className="h-6 w-6" />
        </Button>
      </div>
      <div className="mt-auto flex flex-col items-center space-y-6">
        <Separator className="w-8 bg-gray-200" />
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-200"
          onClick={toggleDetailSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <Button
        onClick={() => signOut({ callbackUrl: '/' })}
          variant="ghost"
          size="icon"
          className="text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-200"
        >
          <LogOut className="h-6 w-6" />
        </Button>
      </div>
    </aside>



      <aside
        className={`hidden md:flex border-r border-gray-200 transition-all duration-300 ease-in-out ${isDetailSidebarOpen ? 'w-64' : 'w-0'
          } flex-col overflow-hidden bg-[#e7dfef] shadow-md`}
      >
        <ScrollArea className="flex-grow">
          <div className="p-2 space-y-2">
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold shadow-md">
                  {session?.user?.name?.slice(0, 2).toUpperCase() || "US"}
                </div>
              </div>

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
                        ? 'bg-[#E6DEEE] border-gray-300 shadow-sm'
                        : 'bg-white border-gray-200'
                        } transition-all duration-200 ease-in-out hover:shadow-sm`}
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
              <h4 className="text-lg font-semibold text-gray-800">Add a New Pet</h4>

              <form onSubmit={(e) => {
                e.preventDefault();
                savePetInfo(petName, petAge);
              }} className="space-y-4">
                <Input
                  placeholder="Pet Name"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400 rounded-xl shadow-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  required
                />
                <Input
                  placeholder="Pet Age (in months)"
                  type="number"
                  value={petAge}
                  onChange={(e) => setPetAge(e.target.value)}
                  className="bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400 rounded-xl shadow-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  required
                />
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full justify-start gap-2 border-gray-300 text-gray-800 hover:bg-gray-100 rounded-xl shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Pet
                </Button>
              </form>

              {message && <p className="text-gray-600 text-sm mt-2">{message}</p>}
            </div>
            <div className="space-y-4 bg-white p-4 rounded-xl shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800">Select AI Model</h4>
              <Select>
                <SelectTrigger className="w-full bg-gray-200 border-gray-300 text-gray-800 rounded-xl">
                  <SelectValue placeholder="NCX AI N1" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl border-gray-200">
                  <SelectGroup>
                    <SelectLabel>AI Models</SelectLabel>
                    <SelectItem className="rounded-xl text-gray-400 hover:bg-gray-100" value="gpt-4" disabled>
                      NCX AI N1
                    </SelectItem>
                    <SelectItem className="rounded-xl text-gray-400 hover:bg-gray-100" value="gpt-3.5" disabled>
                      NCX AI Pro
                    </SelectItem>
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
        <SheetContent side="left" className="w-[300px] sm:w-[400px] p-4 bg-white overflow-y-auto max-h-screen ">
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
                    <div className="bg-[white] p-4 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar>
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
                                  ? 'bg-gray-100 border-gray-300 shadow-sm'
                                  : 'bg-white border-gray-200'
                                  } transition-all duration-200 ease-in-out hover:shadow-sm`}
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
                      <h4 className="text-lg font-semibold text-gray-800">Add a New Pet</h4>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        savePetInfo(petName, petAge);
                      }} className="space-y-4">
                        <Input
                          placeholder="Pet Name"
                          value={petName}
                          onChange={(e) => setPetName(e.target.value)}
                          className="bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400 rounded-xl shadow-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                          required
                        />
                        <Input
                          placeholder="Pet Age (in months)"
                          type="number"
                          value={petAge}
                          onChange={(e) => setPetAge(e.target.value)}
                          className="bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400 rounded-xl shadow-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                          required
                        />
                        <Button
                          type="submit"
                          variant="outline"
                          className="w-full justify-start gap-2 border-gray-300 text-gray-800 hover:bg-gray-100 rounded-xl shadow-sm"
                        >
                          <Plus className="h-4 w-4" />
                          Add Pet
                        </Button>
                      </form>
                      {message && <p className="text-gray-600 text-sm mt-2">{message}</p>}
                    </div>
                    <div className="space-y-4 bg-white p-4 rounded-xl shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-800">Select AI Model</h4>
                      <Select>
                        <SelectTrigger className="w-full bg-gray-50 border-gray-300 text-gray-800 rounded-xl">
                          <SelectValue placeholder="NCX AI N1" />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-xl border-gray-200">
                          <SelectGroup>
                            <SelectLabel>AI Models</SelectLabel>
                            <SelectItem className="rounded-xl text-gray-400 hover:bg-gray-100" value="gpt-4" disabled>
                              NCX AI N1
                            </SelectItem>
                            <SelectItem className="rounded-xl text-gray-400 hover:bg-gray-100" value="gpt-3.5" disabled>
                              NCX AI Pro
                            </SelectItem>
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
                        <Button variant="ghost" onClick={() => signOut({ callbackUrl: '/' })} className="w-full justify-start text-black hover:bg-violet-100">
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
                <Link href="/" className="flex items-center px-12">
                  <img
                    src="./logo.png"
                    alt="PETOWK"
                    className="h-16 w-32 object-contain"
                    style={{ opacity: 0.8 }} // Adjust transparency
                  />
                </Link>
              </div>

              <div className="flex items-center space-x-4">
                <CreatePetModal onSave={savePetInfo} trigger={
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden md:flex bg-white text-gray-800 border-gray-300 hover:bg-gray-100 hover:text-gray-900 rounded-xl shadow-sm hover:shadow-md transition duration-300 ease-in-out"
                  >
                    <Plus className="mr-2 h-4 w-4 text-gray-600" />
                    Add Pet
                  </Button>




                } />
                <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-xl">
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
                    <DropdownMenuItem className="hover:bg-gray-100 rounded-xl">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-100 rounded-xl">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-100 rounded-xl" onClick={() => signOut({ callbackUrl: '/' })}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>


        <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
          <ScrollArea className="flex-1">
            <div className="container mx-auto px-4 py-8 bg-white">
              <div className="">
                {selectedPet ? (
                  <>
                    <div className="text-center sticky top-0 bg-white z-10 p-4 ">
  <h2 className="text-3xl font-bold mb-2 text-black">
    Chat with PETOWK AI about {selectedPet.petName}
  </h2>
  <p className="text-black text-lg">
    Ask questions about {selectedPet.petName}'s health, nutrition, or care.
  </p>
</div>               
                    <div className="space-y-4 max-w-4xl mx-auto mt-8">
                      {chatMessages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex items-start ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {message.role === "assistant" && (
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold shadow-md">
                                AI
                              </div>
                            </div>
                          )}
                          <div
                            className={`max-w-[80%] p-3 rounded-xl ${
                              message.role === "user"
                                ? "bg-indigo-100 text-indigo-900 ml-auto"
                                : "bg-white shadow-md text-gray-800"
                            }`}
                          >
                            {message.role === "user" ? (
                              <p id={`${index + 1}`}>{message.content}</p>

                            ) : (
                              <div
                                className="prose prose-sm max-w-none dark:prose-invert"
                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(message.content) }}
                              />
                            )}
                          </div>
                          {message.role === "user" && (
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center justify-center h-10 ml-4 w-10 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 text-white font-bold shadow-md">
                                U
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>


                  </>
                ) : (
                  <div className="text-center py-20">
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">Welcome to PETOWK</h2>
                    <p className="text-gray-600 text-lg mb-8">
                      {pets.length > 0
                        ? "Select a pet from the sidebar to start chatting with our AI Vet."
                        : "You haven't added any pets yet. Create your first pet to get started!"}
                    </p>
                    {pets.length > 0 ? (
                      <Button
                        onClick={() => setIsDetailSidebarOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md text-lg py-2 px-6 rounded-xl transition duration-300 ease-in-out"
                      >
                        Select a Pet
                      </Button>
                    ) : (
                      <CreatePetModal
                        onSave={savePetInfo}
                        trigger={
                          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md text-lg py-2 px-6 rounded-xl transition duration-300 ease-in-out">
                            Add Your First Pet
                          </Button>
                        }
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
          {isLoading && (
            <div className="flex justify-center items-center space-x-2 mt-4 py-6">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
              <span className="text-xl text-indigo-600">AI is thinking...</span>
            </div>
          )}
 
          {/* Chat Input */}
          <div className="bg-white border-t border-gray-200 p-6 sticky bottom-0 shadow-md z-10">
            <form onSubmit={handleChatSubmit} className="max-w-4xl mx-auto grid grid-cols-4 gap-4 items-center">
              {/* Query Type Select */}
              <div className="col-span-4 md:col-span-1">
                <Select value={queryType} onValueChange={setQueryType}>
                  <SelectTrigger className="w-full bg-gray-50 border-gray-300 rounded-xl shadow-sm text-gray-800 hover:bg-gray-100 px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none transition-colors duration-200">
                    <SelectValue placeholder="Choose a query type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-md text-gray-800">
                    <SelectItem className="hover:bg-gray-100 focus:bg-gray-200 rounded-xl" value="symptom">
                      Symptom
                    </SelectItem>
                    <SelectItem className="hover:bg-gray-100 focus:bg-gray-200 rounded-xl" value="food">
                      Food
                    </SelectItem>
                    <SelectItem className="hover:bg-gray-100 focus:bg-gray-200 rounded-xl" value="nutrition">
                      Nutrition
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Input Field with Send Button */}
              <div className="col-span-4 md:col-span-3 relative flex items-center gap-4">
                <Input
                  placeholder={placeholderText}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 rounded-xl py-2 px-4 text-sm shadow-sm transition duration-300 ease-in-out hover:shadow-md"
                  disabled={!selectedPet || isLoading}
                />

                {/* Send Button */}
                <Button
                  type="submit"
                  className="bg-gray-600 hover:bg-gray-700 text-white rounded-xl px-6 py-2 font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
                  disabled={!selectedPet || isLoading}
                >
                  <span className="flex items-center gap-2 text-white">
                    <PawPrint className="h-4 w-4" color="white" />
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

