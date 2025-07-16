
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Users, Heart, Home as HomeIcon, LogOut, User, Search, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { usePeople, Person } from "@/hooks/usePeople";
import AddPersonModal from "@/components/AddPersonModal";
import PersonCard from "@/components/PersonCard";
import PersonProfile from "@/components/PersonProfile";
import UpcomingDatesDropdown from "@/components/UpcomingDatesDropdown";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const Index = () => {
  const { user, signOut } = useAuth();
  const { people, loading, addPerson, updatePerson } = usePeople();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 max-w-7xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 md:gap-4">
              {/* Mobile menu */}
              <div className="md:hidden">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9">
                      <Menu className="w-4 h-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle className="text-left">Categories</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-2 mt-6">
                      {categories.map((category) => {
                        const Icon = getCategoryIcon(category);
                        const categoryCount = category === "All" ? people.length : people.filter(p => p.category === category).length;
                        return (
                          <button
                            key={category}
                            onClick={() => {
                              setSelectedCategory(category);
                              setIsSheetOpen(false);
                            }}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group",
                              selectedCategory === category
                                ? "bg-primary text-primary-foreground shadow-lg"
                                : "bg-card text-card-foreground hover:bg-secondary"
                            )}
                          >
                            <Icon size={18} />
                            <span className="font-medium">{category}</span>
                            <span className={cn(
                              "text-xs px-2.5 py-1 rounded-full ml-auto font-medium",
                              selectedCategory === category
                                ? "bg-primary-foreground/20 text-primary-foreground"
                                : "bg-secondary text-secondary-foreground"
                            )}>
                              {categoryCount}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              
              {/* Logo and title */}
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                  <img 
                    src="/logo/ariyo logo6.png" 
                    alt="Ariyo Logo" 
                    className="w-8 h-8 md:w-10 md:h-10 object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-lg md:text-2xl font-bold text-foreground tracking-tight">Ariyo</h1>
                  <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Your personal network</p>
                </div>
              </div>
            </div>
            
            {/* User info and actions */}
            <div className="flex items-center gap-1 md:gap-4">
              <UpcomingDatesDropdown people={people} />
              <div className="flex items-center gap-1 md:gap-3">
                <div className="w-8 h-8 md:w-9 md:h-9 bg-secondary rounded-xl flex items-center justify-center">
                  <User size={14} className="md:w-4 md:h-4 text-secondary-foreground" />
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-foreground">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">{people.length} people</p>
                </div>
              </div>
              <Button
                onClick={handleSignOut}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground rounded-xl px-2 md:px-4 h-8 md:h-9"
              >
                <LogOut size={14} className="md:w-4 md:h-4 md:mr-2" />
                <span className="hidden md:inline">Sign out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Search */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 bg-card border-border/50 rounded-xl font-medium placeholder:text-muted-foreground/60"
            />
          </div>
        </div>

        {/* Category Filter - Desktop */}
        <div className="hidden md:flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category);
            const categoryCount = category === "All" ? people.length : people.filter(p => p.category === category).length;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 font-medium group",
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-card text-card-foreground hover:bg-secondary border border-border/50"
                )}
              >
                <Icon size={18} />
                <span>{category}</span>
                <span className={cn(
                  "text-xs px-2.5 py-1 rounded-full font-medium",
                  selectedCategory === category
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}>
                  {categoryCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Add Person Button - Desktop */}
        <div className="hidden md:flex justify-center mb-8">
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-8 py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Add New Person
          </Button>
        </div>

        {/* Floating Action Button - Mobile */}
        <Button
          onClick={() => setShowAddModal(true)}
          className="md:hidden fixed bottom-6 right-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl w-16 h-16 shadow-lg hover:shadow-xl flex items-center justify-center z-50 group"
        >
          <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        </Button>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 bg-primary/20 rounded-full animate-pulse mx-auto mb-4"></div>
            <div className="text-muted-foreground font-medium">Loading your network...</div>
          </div>
        )}

        {/* People Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPeople.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                onClick={() => setSelectedPerson(person)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPeople.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Users size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchTerm ? "No matches found" : "No people in this category"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Start building your network by adding your first person"
              }
            </p>
            <Button
              onClick={() => setShowAddModal(true)}
              variant="outline"
              className="rounded-xl px-6 py-3 font-medium"
            >
              <Plus size={18} className="mr-2" />
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
