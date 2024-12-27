import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { ScrollArea } from "../../components/ui/scroll-area"
import { Separator } from "../../components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
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
import { MessageCircle, Users, Bell, Menu, Sun, LogOut, Settings, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function Sidebar({
  isDetailSidebarOpen,
  setIsDetailSidebarOpen,
  session,
  pets,
  selectedPet,
  handlePetClick,
  deletePet,
  savePetInfo,
  message
}) {
  const [petName, setPetName] = useState("")
  const [petAge, setPetAge] = useState("")

  const toggleDetailSidebar = () => setIsDetailSidebarOpen(!isDetailSidebarOpen)

  return (
    <>
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

              <form onSubmit={(e) => {
                e.preventDefault();
                savePetInfo(petName, petAge);
                setPetName("");
                setPetAge("");
              }} className="space-y-4">
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
    </>
  )
}
