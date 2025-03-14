"use client"

import { signOut, useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import Head from "next/head"
import Link from "next/link"

import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Loader2,
  LogOut,
  Settings,
  MessageCircle,
  Home,
  Stethoscope,
  Menu,
} from "lucide-react"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  })
  const [hasFetchedProfile, setHasFetchedProfile] = useState(false)

  // For sidebar toggle (similar to Dashboard)
  const [isDetailSidebarOpen, setIsDetailSidebarOpen] = useState(true)
  const toggleDetailSidebar = () => setIsDetailSidebarOpen(!isDetailSidebarOpen)

  const userEmail = session?.user?.email

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    } else if (status === "authenticated" && session?.user && userEmail && !hasFetchedProfile) {
      // Initialize with session data
      setProfileData(prevData => ({
        ...prevData,
        name: session.user.name || "",
        email: userEmail,
      }))
      // Fetch additional profile data
      fetchProfileData().then(() => setHasFetchedProfile(true))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, userEmail, hasFetchedProfile, router])

  const fetchProfileData = async () => {
    if (!userEmail) return
    setIsLoading(true)
    try {
      const res = await axios.get(`/api/user/profile?email=${encodeURIComponent(userEmail)}`)
      if (res.data) {
        setProfileData(prevData => ({
          ...prevData,
          ...res.data,
          // Keep email from session as it's the primary identifier
          email: userEmail,
        }))
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prevData => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!userEmail) {
      console.error("You must be logged in to update your profile")
      return
    }

    setIsSaving(true)
    try {
      await axios.post("/api/user/profile", {
        ...profileData,
        email: userEmail,
      })
      console.log("Profile Updated: Your profile information has been saved successfully.")

      // Update session data if name changed
      if (profileData.name !== session.user.name) {
        session.user.name = profileData.name
      }
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      <Head>
        <title>My Profile - PETOWK</title>
      </Head>

      {/* Desktop Sidebar */}
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
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-200"
                  >
                    <MessageCircle className="h-6 w-6" />
                  </Button>
                </Link>
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
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-indigo-600 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-200"
                  >
                    <User className="h-6 w-6" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-[#F6F0F0] text-black border-none rounded-lg px-3 py-1.5 text-sm font-medium shadow-lg"
              >
                <p>Profile</p>
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
                  onClick={() => signOut({ callbackUrl: "/" })}
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

      {/* Mobile Sidebar using Sheet */}
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
        <SheetContent side="left" className="w-[300px] p-4 bg-white">
          <div className="flex flex-col space-y-4">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start">
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat
              </Button>
            </Link>
            <Link href="/vet-booking">
              <Button variant="ghost" className="w-full justify-start">
                <Stethoscope className="mr-2 h-4 w-4" />
                Vet Booking
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" className="w-full justify-start bg-indigo-100">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start" onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4 flex items-center justify-between h-16">
            <Link href="/">
              <img src="/logo.png" alt="PETOWK" className="h-12 w-auto object-contain" style={{ opacity: 0.8 }} />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold shadow-md">
                  {session?.user?.name?.slice(0, 2).toUpperCase() || "US"}
                </div>
              </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white rounded-xl border border-gray-200">
                <Link href="/profile">
                  <DropdownMenuItem className="hover:bg-gray-100 rounded-xl">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  className="hover:bg-gray-100 rounded-xl"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <ScrollArea className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <Card className="bg-white shadow-md rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16 border-2 border-white">
                    <AvatarImage src="/placeholder.svg" alt={profileData.name} />
                    <AvatarFallback className="text-xl bg-white text-indigo-600">
                      {profileData.name?.slice(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{profileData.name || "Your Profile"}</CardTitle>
                    <CardDescription className="text-indigo-100">Manage your personal information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2 text-gray-700">
                        <User className="h-4 w-4" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        className="bg-gray-50 border-gray-300 rounded-xl"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2 text-gray-700">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        value={profileData.email}
                        className="bg-gray-50 border-gray-300 rounded-xl text-gray-500"
                        disabled
                      />
                      <p className="text-xs text-gray-500">Email cannot be changed</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2 text-gray-700">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        placeholder="Your phone number"
                        className="bg-gray-50 border-gray-300 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center gap-2 text-gray-700">
                        <MapPin className="h-4 w-4" />
                        Address
                      </Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                        placeholder="Your address"
                        className="bg-gray-50 border-gray-300 rounded-xl min-h-[80px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-gray-700">
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself"
                        className="bg-gray-50 border-gray-300 rounded-xl min-h-[120px]"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 px-6 py-4 flex justify-end">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </div>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </ScrollArea>
      </main>
    </div>
  )
}
