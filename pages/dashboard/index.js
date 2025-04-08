"use client"
import { signOut } from "next-auth/react"
import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"
import {
  Menu,
  ArrowUp,
  LogOut,
  MessageCircle,
  Loader2,
  User,
  PawPrint,
  Home,
  Mail,
  Stethoscope,
  Trash2,
  Plus,
  Settings,
} from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import Head from "next/head"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "../../components/ui/avatar"
import { ScrollArea } from "../../components/ui/scroll-area"
import { Separator } from "../../components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import Link from "next/link"
import { sanitizeHtml } from "../../lib/sanitizeHtml"
import { Helmet } from "react-helmet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip"
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
import CreatePetModal from "../../components/create-pet-modal"

import { useRouter } from "next/router"
import { createClient } from "@supabase/supabase-js"

// Add the EditPetModal component back at the top of the file, before the Dashboard component
function EditPetModal({ isOpen, onClose, pet, onSave }) {
  const [editType, setEditType] = useState(pet?.petName || "")
  const [editAge, setEditAge] = useState(pet?.petAge || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Reset form values when pet changes
  useEffect(() => {
    if (pet) {
      setEditType(pet.petName || "")
      setEditAge(pet.petAge || "")
      setError("")
    }
  }, [pet])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!editType.trim()) {
      setError("Pet type is required")
      return
    }

    if (!editAge || isNaN(Number(editAge)) || Number(editAge) <= 0) {
      setError("Please enter a valid age")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      await onSave(pet.index, editType, editAge)
      onClose()
    } catch (err) {
      setError(`Failed to update: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Pet Details</AlertDialogTitle>
          <AlertDialogDescription className="text-black">Update your pet's information below.</AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <label htmlFor="petType" className="text-sm font-medium text-gray-700">
              Pet Type
            </label>
            <Input
              id="petType"
              value={editType}
              onChange={(e) => setEditType(e.target.value)}
              className="bg-gray-50 border-gray-300 text-gray-800 rounded-xl"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="petAge" className="text-sm font-medium text-gray-700">
              Pet Age (months)
            </label>
            <Input
              id="petAge"
              type="number"
              value={editAge}
              onChange={(e) => setEditAge(e.target.value)}
              className="bg-gray-50 border-gray-300 text-gray-800 rounded-xl"
              required
              min="1"
            />
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </form>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-100 text-black hover:bg-gray-200 rounded-xl" disabled={isSubmitting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </div>
            ) : (
              "Save Changes"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function Dashboard() {
  const [isDetailSidebarOpen, setIsDetailSidebarOpen] = useState(true)
  const [inputValue, setInputValue] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const [chatMessages, setChatMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [queryType, setQueryType] = useState("symptom")
  const placeholderText =
    queryType === "symptom"
      ? "Describe your pet's symptoms (e.g., 'coughing and sneezing')"
      : queryType === "food"
        ? "Ask about specific food (e.g., 'chicken?')"
        : queryType === "nutrition"
          ? "Ask about nutritional needs (e.g., 'Best diet for an overweight pet')"
          : "Select a query type and type your question"

  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const scrollAreaRef = useRef(null)

  const [petToEdit, setPetToEdit] = useState(null)

  const toggleDetailSidebar = () => setIsDetailSidebarOpen(!isDetailSidebarOpen)
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const { data: session, status } = useSession()
  const [petName, setPetName] = useState("")
  const [petAge, setPetAge] = useState("")
  const [pets, setPets] = useState([])
  const [message, setMessage] = useState("")
  const [selectedPet, setSelectedPet] = useState(null)

  const chatContainerRef = useRef(null)

  // 1. Add the isEditModalOpen state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const logToSupabase = async (logType, data) => {
    try {
      const { error } = await supabase.from("logs").insert({
        log_type: logType,
        user_email: session?.user?.email,
        data: data,
        created_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Error logging to Supabase:", error)
      }
    } catch (err) {
      console.error("Failed to log to Supabase:", err)
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      // Log session data
      logToSupabase("session_authenticated", {
        user: {
          email: session?.user?.email,
          name: session?.user?.name,
        },
        timestamp: new Date().toISOString(),
      })

      fetchPetInfo()
    } else if (status === "unauthenticated") {
      // Log logout or unauthenticated access
      logToSupabase("session_unauthenticated", {
        timestamp: new Date().toISOString(),
      })

      // Redirect to the login page
      router.push("/") // Navigate to the homepage or login page
    }
  }, [status, router]) // Adding `router` to dependencies

  useEffect(() => {
    // Scroll to bottom when new messages are added
    const scrollAreaElement = scrollAreaRef.current
    if (scrollAreaElement && chatMessages.length > 0) {
      const scrollableDiv = scrollAreaElement.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollableDiv) {
        // Use setTimeout to ensure the DOM has updated with the new message
        setTimeout(() => {
          scrollableDiv.scrollTo({
            top: scrollableDiv.scrollHeight,
            behavior: "smooth",
          })
        }, 100)
      }
    }

    // Show scroll to top button only if there's more than one chat response
    setShowScrollToTop(chatMessages.length > 2)
  }, [chatMessages])

  // Add a new function to scroll to bottom that can be called programmatically
  const scrollToBottom = () => {
    const scrollAreaElement = scrollAreaRef.current
    if (scrollAreaElement) {
      const scrollableDiv = scrollAreaElement.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollableDiv) {
        scrollableDiv.scrollTo({
          top: scrollableDiv.scrollHeight,
          behavior: "smooth",
        })
      }
    }
  }

  useEffect(() => {
    const scrollArea = document.querySelector(".scroll-area")
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight
    }
  }, [chatMessages])

  useEffect(() => {
    // Update the useEffect for scroll handling to add fade-out effect
    const scrollAreaElement = scrollAreaRef.current
    if (scrollAreaElement) {
      const handleScroll = () => {
        const scrollableDiv = scrollAreaElement.querySelector("[data-radix-scroll-area-viewport]")
        if (scrollableDiv) {
          const shouldShow = chatMessages.length > 2 && scrollableDiv.scrollTop > 300
          setShowScrollToTop(shouldShow)
        }
      }

      const scrollableDiv = scrollAreaElement.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollableDiv) {
        scrollableDiv.addEventListener("scroll", handleScroll)
        return () => scrollableDiv.removeEventListener("scroll", handleScroll)
      }
    }
  }, [chatMessages.length])

  useEffect(() => {
    if (pets.length > 0 && !selectedPet) {
      const randomPet = pets[Math.floor(Math.random() * pets.length)]
      setSelectedPet({ petName: randomPet.petName, petAge: randomPet.petAge })
    }
  }, [pets, selectedPet])

  // 2. Replace the fetchPetInfo function with this updated version
  const fetchPetInfo = async () => {
    try {
      const email = session?.user?.email
      if (!email) {
        setMessage("User email not found")
        return
      }

      const res = await axios.get(`https://site.petowk.com/wp-json/pet-info/v1/get?email=${email}`)
      if (res.data && res.data.pets) {
        // Transform the API response to match the expected format
        const transformedPets = res.data.pets.map((pet, index) => ({
          _id: `pet-${index}`,
          id: pet.id, // Keep the original ID from the database
          index: index,
          petName: pet.pet_type,
          petAge: pet.pet_age,
        }))
        setPets(transformedPets)

        // Log pet data to Supabase
        await logToSupabase("pet_fetch", {
          source: "api",
          pets: res.data.pets,
          transformed_pets: transformedPets,
        })
      } else {
        setMessage("No pets found")
        await logToSupabase("pet_fetch_error", {
          message: "No pets found",
          response: res.data,
        })
      }
    } catch (error) {
      setMessage(`Error fetching pets: ${error.response?.data?.error || error.message}`)
      await logToSupabase("pet_fetch_error", {
        message: error.message,
        response: error.response?.data,
      })
    }
  }

  // 3. Add these functions for adding, updating, and deleting pets
  const savePetInfo = async (petType, petAge) => {
    try {
      const email = session?.user?.email
      if (!email) {
        setMessage("User email not found")
        return
      }

      await logToSupabase("pet_add_attempt", {
        pet_type: petType,
        pet_age: petAge,
        user_email: email,
      })

      const res = await axios.post("https://site.petowk.com/wp-json/pet-info/v1/add", {
        email: email,
        pet_type: petType,
        pet_age: Number.parseInt(petAge, 10),
      })

      setMessage("Pet added successfully.")

      await logToSupabase("pet_add_success", {
        pet_type: petType,
        pet_age: petAge,
        response: res.data,
      })

      fetchPetInfo()
      setPetName("")
      setPetAge("")
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.error || error.message}`)

      await logToSupabase("pet_add_error", {
        pet_type: petType,
        pet_age: petAge,
        error: error.message,
        response: error.response?.data,
      })
    }
  }

  const updatePet = async (petIndex, newType, newAge) => {
    try {
      const email = session?.user?.email
      if (!email) {
        setMessage("User email not found")
        return
      }

      await logToSupabase("pet_update_attempt", {
        pet_index: petIndex,
        new_type: newType,
        new_age: newAge,
        user_email: email,
      })

      const response = await axios.post("https://site.petowk.com/wp-json/pet-info/v1/update", {
        email: email,
        id: pets[petIndex].id, // use the record ID from the pets array
        pet_type: newType,
        pet_age: Number.parseInt(newAge, 10),
      })

      // If this pet was selected, update the selected pet too
      if (selectedPet && selectedPet.index === petIndex) {
        setSelectedPet({ petName: newType, petAge: Number.parseInt(newAge, 10), index: petIndex })
      }

      setMessage("Pet updated successfully.")

      await logToSupabase("pet_update_success", {
        pet_index: petIndex,
        new_type: newType,
        new_age: newAge,
        response: response.data,
      })

      // Refresh the pet list to ensure we have the latest data
      await fetchPetInfo()
      return response.data
    } catch (error) {
      console.error("Update error:", error)
      setMessage(`Error: ${error.response?.data?.error || error.message}`)

      await logToSupabase("pet_update_error", {
        pet_index: petIndex,
        new_type: newType,
        new_age: newAge,
        error: error.message,
        response: error.response?.data,
      })

      throw error
    }
  }

  const deletePet = async (petIndex) => {
    try {
      const email = session?.user?.email
      if (!email) {
        setMessage("User email not found")
        return
      }

      await logToSupabase("pet_delete_attempt", {
        pet_index: petIndex,
        user_email: email,
      })

      await axios.post("https://site.petowk.com/wp-json/pet-info/v1/delete", {
        email: email,
        id: pets[petIndex].id, // use the record ID instead of index
      })

      setMessage("Pet deleted successfully.")

      await logToSupabase("pet_delete_success", {
        pet_index: petIndex,
      })

      fetchPetInfo()
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.error || error.message}`)

      await logToSupabase("pet_delete_error", {
        pet_index: petIndex,
        error: error.message,
        response: error.response?.data,
      })
    }
  }

  // 4. Add the handleEditPet function
  const handleEditPet = (pet) => {
    setPetToEdit({ ...pet }) // Make a copy to avoid reference issues
    setIsEditModalOpen(true)
  }

  // 5. Update the handlePetClick function to include the index
  const handlePetClick = (petName, petAge, index) => {
    localStorage.setItem("selectedPet", JSON.stringify({ petName, petAge, index }))
    setSelectedPet({ petName, petAge, index })

    // Log pet selection to Supabase
    logToSupabase("pet_selected", { petName, petAge, index })
  }

  const handleChatSubmit = async (e) => {
    e.preventDefault()
    if (!inputValue.trim() || !selectedPet) return

    setIsLoading(true)
    const newMessage = { role: "user", content: inputValue }
    setChatMessages((prev) => [...prev, newMessage])

    // Log user message to Supabase
    await logToSupabase("chat_message_user", {
      message: inputValue,
      pet: selectedPet,
      query_type: queryType,
    })

    console.log("Sending request to API...")
    const startTime = Date.now()

    try {
      const response = await axios.post(
        "/api/ollama",
        {
          pet: selectedPet.petName,
          [queryType]: inputValue,
        },
        {
          timeout: 100000, // 100 seconds in milliseconds
        },
      )

      console.log("API response received", response.data)
      setChatMessages((prev) => [...prev, { role: "assistant", content: response.data.suggestion }])

      // Log AI response to Supabase
      const endTime = Date.now()
      await logToSupabase("chat_message_ai", {
        request: {
          pet: selectedPet.petName,
          query_type: queryType,
          message: inputValue,
        },
        response: response.data,
        response_time_ms: endTime - startTime,
      })
    } catch (error) {
      console.error("Error:", error)
      let errorMessage = "Sorry, I encountered an error. Please try again."

      if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
        errorMessage = "Sorry, the request timed out. Please try again."
      }

      setChatMessages((prev) => [...prev, { role: "assistant", content: errorMessage }])

      // Log error to Supabase
      const endTime = Date.now()
      await logToSupabase("chat_error", {
        request: {
          pet: selectedPet.petName,
          query_type: queryType,
          message: inputValue,
        },
        error: {
          message: error.message,
          code: error.code,
          response: error.response?.data,
        },
        response_time_ms: endTime - startTime,
      })
    } finally {
      const endTime = Date.now()
      console.log(`Request took ${endTime - startTime}ms`)
      setIsLoading(false)
      setInputValue("")
      // Add a small delay to ensure the DOM has updated before scrolling
      setTimeout(scrollToBottom, 150)
    }
  }

  const scrollToTop = () => {
    const scrollAreaElement = scrollAreaRef.current
    if (scrollAreaElement) {
      const scrollableDiv = scrollAreaElement.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollableDiv) {
        scrollableDiv.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
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
        <title>PETOWK - AI-powered pet care assistant</title>
      </Head>
      <Helmet>
        <style>
          {`
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
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-200"
                  >
                    <Home className="h-6 w-6" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-[#F6F0F0] text-black border-none rounded-lg px-3 py-1.5 text-sm font-medium shadow-lg"
              >
                <p>Home</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-200"
                >
                  <MessageCircle className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-[#F6F0F0] text-black border-none rounded-lg px-3 py-1.5 text-sm font-medium shadow-lg"
              >
                <p>Chat</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/vet-booking">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-200"
                  >
                    <Stethoscope className="h-6 w-6" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-[#F6F0F0] text-black border-none rounded-lg px-3 py-1.5 text-sm font-medium shadow-lg"
              >
                <p>Vet Booking</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-200"
                  onClick={() => {
                    // Email subscription functionality
                    const email = prompt("Enter your email to subscribe to our newsletter:")
                    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                      alert(`Thank you! ${email} has been subscribed to our newsletter.`)
                      // Here you would typically call an API to save the email
                    } else if (email) {
                      alert("Please enter a valid email address.")
                    }
                  }}
                >
                  <Mail className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-[#F6F0F0] text-black border-none rounded-lg px-3 py-1.5 text-sm font-medium shadow-lg"
              >
                <p>Subscribe to Newsletter</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="mt-auto flex flex-col items-center space-y-6">
          <Separator className="w-8 bg-gray-200" />
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-200"
                  onClick={toggleDetailSidebar}
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-[#F6F0F0] text-black border-none rounded-lg px-3 py-1.5 text-sm font-medium shadow-lg"
              >
                <p>Toggle Sidebar</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    signOut({ callbackUrl: "/" })
                  }}
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-200"
                >
                  <LogOut className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-[#F6F0F0] text-black border-none rounded-lg px-3 py-1.5 text-sm font-medium shadow-lg"
              >
                <p>Log Out</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </aside>

      <aside
        className={`hidden md:flex border-r border-gray-200 transition-all duration-300 ease-in-out ${
          isDetailSidebarOpen ? "w-64" : "w-0"
        } flex-col overflow-hidden bg-[#e7dfef] shadow-md`}
      >
        <ScrollArea className="flex-grow">
          <div className="p-2 space-y-2">
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold shadow-md border-2 border-[#222]">
                  {session?.user?.name?.slice(0, 2).toUpperCase() || "US"}
                </div>
              </div>

              <div>
                <div className="text-sm text-black">Welcome,</div>
                <div className="font-medium text-black">{session?.user?.name || "User"}</div>
              </div>
            </div>

            {/* Update the desktop sidebar pet list to include edit and delete buttons */}
            <div className="space-y-4 bg-white p-4 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-black">Your Pets</h3>
              {pets.length > 0 ? (
                <div className="space-y-3">
                  {pets.map((pet) => (
                    <div
                      key={pet._id}
                      className={`flex items-center justify-between p-3 rounded-xl border ${
                        selectedPet && selectedPet.petName === pet.petName
                          ? "bg-[#E6DEEE] border-gray-300 shadow-sm"
                          : "bg-white border-gray-200"
                      } transition-all duration-200 ease-in-out hover:shadow-sm`}
                    >
                      <div
                        className="cursor-pointer flex-grow"
                        onClick={() => handlePetClick(pet.petName, pet.petAge, pet.index)}
                      >
                        <div
                          className={`font-medium ${
                            selectedPet && selectedPet.petName === pet.petName ? "text-black" : "text-black"
                          }`}
                        >
                          {pet.petName}
                        </div>
                        <div className="text-sm text-black">{`Age: ${pet.petAge} months`}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TooltipProvider delayDuration={300}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-black hover:text-black hover:bg-indigo-100"
                                onClick={() => handleEditPet(pet)}
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent
                              side="right"
                              className="bg-[#F6F0F0] text-black border-none rounded-lg px-3 py-1.5 text-sm font-medium shadow-lg"
                            >
                              <p>Edit Pet</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <AlertDialog>
                          <TooltipProvider delayDuration={300}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-black hover:text-black hover:bg-indigo-100"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent
                                side="right"
                                className="bg-[#F6F0F0] text-black border-none rounded-lg px-3 py-1.5 text-sm font-medium shadow-lg"
                              >
                                <p>Delete Pet</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <AlertDialogContent className="bg-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription className="text-black">
                                This action cannot be undone. This will permanently delete your pet's data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-indigo-100 text-black hover:bg-indigo-200 rounded-xl">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-[#f90000] text-white hover:bg-red-700 rounded-xl"
                                onClick={() => deletePet(pet.index)}
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
              <div>
                <h4 className="text-xl font-semibold text-gray-800">Add a New Pet</h4>
                <p className="text-sm text-gray-500">e.g., Dog, Cat, Parrot, etc.</p>
              </div>

              {/* Add an id to the add pet form for scrolling */}
              <form
                id="add-pet-form"
                onSubmit={(e) => {
                  e.preventDefault()
                  savePetInfo(petName, petAge)
                }}
                className="space-y-4"
              >
                <Input
                  placeholder="Pet Type"
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
          </div>
        </ScrollArea>
      </aside>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50 bg-white shadow-md rounded-full"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] p-4 bg-white overflow-y-auto max-h-screen ">
          <div className="flex flex-col h-full ">
            <div className="border-b border-gray-200 flex justify-between items-center pt-8 pb-8">
              <Tabs defaultValue="pets" className="flex-1">
                <TabsList className="w-full justify-start bg-white rounded-2xl p-1 h-12 space-x-1">
                  <TabsTrigger value="pets" className="flex-1 data-[state=active]:bg-indigo-200 rounded-xl">
                    Pets
                  </TabsTrigger>
                  <TabsTrigger value="services" className="flex-1 data-[state=active]:bg-indigo-200 rounded-xl">
                    Services
                  </TabsTrigger>
                  <TabsTrigger value="account" className="flex-1 data-[state=active]:bg-indigo-200 rounded-xl">
                    Account
                  </TabsTrigger>
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

                      {/* Update the mobile sidebar pet list to include edit and delete buttons */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-black">Your Pets</h3>
                        {pets.length > 0 ? (
                          <div className="space-y-3">
                            {pets.map((pet) => (
                              <div
                                key={pet._id}
                                className={`flex items-center justify-between p-3 rounded-xl border ${
                                  selectedPet && selectedPet.petName === pet.petName
                                    ? "bg-gray-100 border-gray-300 shadow-sm"
                                    : "bg-white border-gray-200"
                                } transition-all duration-200 ease-in-out hover:shadow-sm`}
                              >
                                <div
                                  className="cursor-pointer flex-grow"
                                  onClick={() => handlePetClick(pet.petName, pet.petAge, pet.index)}
                                >
                                  <div
                                    className={`font-medium ${
                                      selectedPet && selectedPet.petName === pet.petName ? "text-black" : "text-black"
                                    }`}
                                  >
                                    {pet.petName}
                                  </div>
                                  <div className="text-sm text-black">{`Age: ${pet.petAge} months`}</div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <TooltipProvider delayDuration={300}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="text-black hover:text-black hover:bg-indigo-100"
                                          onClick={() => handleEditPet(pet)}
                                        >
                                          <Settings className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent
                                        side="right"
                                        className="bg-[#F6F0F0] text-black border-none rounded-lg px-3 py-1.5 text-sm font-medium shadow-lg"
                                      >
                                        <p>Edit Pet</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  <AlertDialog>
                                    <TooltipProvider delayDuration={300}>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <AlertDialogTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="text-black hover:text-black hover:bg-indigo-100"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </AlertDialogTrigger>
                                        </TooltipTrigger>
                                        <TooltipContent
                                          side="right"
                                          className="bg-[#F6F0F0] text-black border-none rounded-lg px-3 py-1.5 text-sm font-medium shadow-lg"
                                        >
                                          <p>Delete Pet</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    <AlertDialogContent className="bg-white">
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-black">
                                          This action cannot be undone. This will permanently delete your pet's data.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel className="bg-indigo-100 text-black hover:bg-indigo-200 rounded-xl">
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          className="bg-[#f90000] text-white hover:bg-red-700 rounded-xl"
                                          onClick={() => deletePet(pet.index)}
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
                        <Link href="/vet-booking" className="w-full">
                          <Button variant="ghost" className="w-full justify-start text-black hover:bg-violet-100">
                            <Stethoscope className="mr-2 h-4 w-4" />
                            Vet Booking
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-black hover:bg-violet-100"
                          onClick={() => {
                            const email = prompt("Enter your email to subscribe to our newsletter:")
                            if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                              alert(`Thank you! ${email} has been subscribed to our newsletter.`)
                            } else if (email) {
                              alert("Please enter a valid email address.")
                            }
                          }}
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Subscribe to Newsletter
                        </Button>
                      </nav>
                    </div>
                  </TabsContent>

                  {/* Account Tab Content */}
                  <TabsContent value="account" className="space-y-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm">
                      <h3 className="text-lg font-semibold text-black mb-4">Account Settings</h3>
                      <div className="space-y-2">
                        <Link href="https://site.petowk.com/user/" target="_blank" rel="noopener">
                          <Button variant="ghost" className="w-full justify-start text-black hover:bg-violet-100">
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          onClick={(e) => {
                            e.preventDefault()
                            signOut({ callbackUrl: "/" })
                          }}
                          className="w-full justify-start text-black hover:bg-violet-100"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  {/* Add the "Add a New Pet" form to the mobile sidebar */}
                  <div className="space-y-4 bg-white p-4 rounded-xl shadow-sm">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800">Add a New Pet</h4>
                      <p className="text-sm text-gray-500">e.g., Dog, Cat, Parrot, etc.</p>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        savePetInfo(petName, petAge)
                      }}
                      className="space-y-4"
                    >
                      <Input
                        placeholder="Pet Type"
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
                <Link href="/vet-booking">
                  <Button
                    size="sm"
                    className="hidden md:flex bg-blue-600 hover:bg-purple-700 text-white border-blue-700 rounded-xl shadow-sm hover:shadow-md transition duration-300 ease-in-out text-base px-6 py-2"
                  >
                    Book Vet
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold shadow-md border-2 border-[#222]">
                          {session?.user?.name?.slice(0, 2).toUpperCase() || "US"}
                        </div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-white shadow-lg rounded-xl border border-gray-200"
                  >
                    <Link href="https://site.petowk.com/user/" target="_blank" rel="noopener">
                      <DropdownMenuItem className="hover:bg-gray-100 rounded-xl">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      className="hover:bg-gray-100 rounded-xl"
                      onClick={(e) => {
                        e.preventDefault()
                        signOut({ callbackUrl: "/" })
                      }}
                    >
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
          <ScrollArea className="flex-1" ref={scrollAreaRef}>
            {showScrollToTop && (
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                  <Button
    onClick={scrollToTop}
    className="fixed bottom-24 right-6 z-50 bg-[#f90000] hover:bg-red-700 text-white rounded-full shadow-lg p-4 transition-all duration-300 ease-in-out opacity-90 hover:opacity-100"
    size="icon"
    aria-label="Scroll to top"
>
<ArrowUp className="h-6 w-6" stroke="white" />

</Button>

                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-[#ffffff] text-black border-none rounded-lg px-3 py-1.5 text-sm font-medium shadow-lg"
                    sideOffset={5}
                  >
                    <p>Back to Top</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
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
                    {/* <SelectItem className="hover:bg-gray-100 focus:bg-gray-200 rounded-xl" value="nutrition">
                      Nutrition
                    </SelectItem> */}
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
      {petToEdit && (
        <EditPetModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          pet={petToEdit}
          onSave={updatePet}
        />
      )}
    </div>
  )
}

