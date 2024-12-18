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
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Create a New Pet</DialogTitle>
          <DialogDescription>
            Add your pet's details here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="petName"
              placeholder="Pet Name"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className="col-span-4"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="petAge"
              placeholder="Pet Age (in months)"
              type="number"
              value={petAge}
              onChange={(e) => setPetAge(e.target.value)}
              className="col-span-4"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Save Pet</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePetModal;
