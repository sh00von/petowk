import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { ScrollArea } from "../../components/ui/scroll-area"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Menu, MessageCircle, Utensils, Apple, Calendar, Settings, User, LogOut, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function MobileSidebar({
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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50 bg-white shadow-md rounded-full">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-4 bg-violet-100">
        <div className="flex flex-col h-full">
          <div className="border-b border-gray-200 flex justify-between items-center">
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
  )
}
