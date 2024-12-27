import { useState } from 'react'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { Label } from "../../components/ui/label"

export default function CreatePetModal({ onSave, trigger }) {
  const [petName, setPetName] = useState("")
  const [petAge, setPetAge] = useState("")
  const [open, setOpen] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(petName, petAge)
    setPetName("")
    setPetAge("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a New Pet</DialogTitle>
          <DialogDescription>
            Enter your pet's details here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="petName" className="text-right">
                Name
              </Label>
              <Input
                id="petName"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="petAge" className="text-right">
                Age (months)
              </Label>
              <Input
                id="petAge"
                type="number"
                value={petAge}
                onChange={(e) => setPetAge(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Pet</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
