import { useState } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

function CreatePetModal(props) {
  const { onSave, trigger } = props;
  const [petName, setPetName] = useState("");
  const [petAge, setPetAge] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    onSave(petName, petAge);
    setPetName("");
    setPetAge("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} className="bg-white rounded-xl" onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Create Pet</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-xl shadow-lg p-6">
        <DialogHeader>
          <DialogTitle>Create a New Pet</DialogTitle>
          <DialogDescription>
            Add your pet's details here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 items-center gap-4">
            <Input
              id="petName"
              placeholder="Pet Name"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className="bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400 rounded-xl shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              required
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <Input
              id="petAge"
              placeholder="Pet Age (in months)"
              type="number"
              value={petAge}
              onChange={(e) => setPetAge(e.target.value)}
              className="bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400 rounded-xl shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSave}
            className="bg-gray-800 hover:bg-gray-700 text-white shadow-md text-lg py-2 px-6 rounded-xl transition duration-300 ease-in-out"
          >
            Save Pet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePetModal;
