import { Button } from "../../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { MessageCircle, Utensils, Apple, Calendar, Bell, Plus, User, Settings, LogOut, PawPrint } from 'lucide-react'
import Link from 'next/link'
import CreatePetModal from './create-pet-modal'

export default function Header({ session, savePetInfo }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
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
  )
}

