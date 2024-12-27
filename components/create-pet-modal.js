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
    <Dialog open={isOpen} className="bg-white" onOpenChange={setIsOpen}>
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
              className="bg-indigo-100 border-indigo-300 text-indigo-900 placeholder-indigo-400 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
              className="bg-indigo-100 border-indigo-300 text-indigo-900 placeholder-indigo-400 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSave}
            className="bg-indigo-500 text-white rounded-xl shadow-sm hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500"
          >
            Save Pet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePetModal;
