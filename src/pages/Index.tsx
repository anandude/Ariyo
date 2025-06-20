import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Users, Heart, Home as HomeIcon, LogOut, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { usePeople, Person } from "@/hooks/usePeople";
import AddPersonModal from "@/components/AddPersonModal";
import PersonCard from "@/components/PersonCard";
import PersonProfile from "@/components/PersonProfile";

const Index = () => {
  const { user, signOut } = useAuth();
  const { people, loading, addPerson, updatePerson } = usePeople();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["All", "Friends", "Family", "Acquaintances"];

  const filteredPeople = people.filter(person => {
    const matchesCategory = selectedCategory === "All" || person.category === selectedCategory;
    const matchesSearch = searchTerm === "" || 
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (person.location && person.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (person.how_we_met && person.how_we_met.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Friends": return Users;
      case "Family": return Heart;
      case "Acquaintances": return HomeIcon;
      default: return Users;
    }
  };

  const handleAddPerson = async (newPerson: { name: string; category: string; image_url?: string }) => {
    const result = await addPerson(newPerson);
    if (result) {
      setShowAddModal(false);
    }
  };

  const handleUpdatePerson = async (updatedPerson: Person) => {
    const result = await updatePerson(updatedPerson.id, updatedPerson);
    if (result) {
      setSelectedPerson(result);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (selectedPerson) {
    return (
      <PersonProfile 
        person={selectedPerson} 
        onBack={() => setSelectedPerson(null)}
        onUpdate={handleUpdatePerson}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header with user info and sign out */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1" />
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Ariyo</h1>
            <p className="text-gray-600">Remember the special people in your life</p>
          </div>
          
          <div className="flex-1 flex justify-end">
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User size={16} />
                <span className="max-w-32 truncate">{user?.email}</span>
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut size={16} />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search people by name, category, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category);
            const categoryCount = category === "All" ? people.length : people.filter(p => p.category === category).length;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200",
                  selectedCategory === category
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-blue-50 shadow-md"
                )}
              >
                <Icon size={16} />
                {category}
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full ml-1">
                  {categoryCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Add Person Button */}
        <div className="flex justify-center mb-6">
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-3 shadow-lg transition-all duration-200 hover:scale-105"
          >
            <Plus size={20} className="mr-2" />
            Add New Person
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading your people...</div>
          </div>
        )}

        {/* People Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPeople.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                onClick={() => setSelectedPerson(person)}
              />
            ))}
          </div>
        )}

        {!loading && filteredPeople.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users size={48} className="mx-auto" />
            </div>
            <p className="text-gray-600">
              {searchTerm ? "No people found matching your search" : "No people in this category yet"}
            </p>
            <Button
              onClick={() => setShowAddModal(true)}
              variant="outline"
              className="mt-4"
            >
              Add your first person
            </Button>
          </div>
        )}

        {/* Add Person Modal */}
        <AddPersonModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddPerson}
        />
      </div>
    </div>
  );
};

export default Index;
