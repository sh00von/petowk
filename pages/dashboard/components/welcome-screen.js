import { Button } from "../../components/ui/button"
import CreatePetModal from './create-pet-modal'

export default function WelcomeScreen({ pets, setIsDetailSidebarOpen, savePetInfo }) {
  return (
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
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
        </div>
      </div>
    </div>
  )
}

