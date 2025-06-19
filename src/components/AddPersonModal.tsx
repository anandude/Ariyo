
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Heart, Home } from "lucide-react";

interface AddPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (person: { name: string; category: string }) => void;
}

const AddPersonModal = ({ isOpen, onClose, onAdd }: AddPersonModalProps) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && category) {
      onAdd({ name: name.trim(), category });
      setName("");
      setCategory("");
      onClose();
    }
  };

  const categories = [
    { value: "Friends", icon: Users, color: "text-blue-600" },
    { value: "Family", icon: Heart, color: "text-red-600" },
    { value: "Acquaintances", icon: Home, color: "text-green-600" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-800">
            Add New Person
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter their name"
              className="border-gray-200 rounded-xl h-12 text-lg"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="border-gray-200 rounded-xl h-12">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 rounded-xl">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <SelectItem key={cat.value} value={cat.value} className="py-3">
                      <div className="flex items-center gap-2">
                        <Icon size={16} className={cat.color} />
                        <span>{cat.value}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl h-12 border-gray-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || !category}
              className="flex-1 bg-blue-500 hover:bg-blue-600 rounded-xl h-12"
            >
              Add Person
            </Button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-500 mt-4">
          You can add more details after creating their profile
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPersonModal;
