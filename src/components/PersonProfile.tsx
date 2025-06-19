
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Edit3, Save, Plus, X, Calendar, MapPin, Utensils, Users, Heart, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface Person {
  id: string;
  name: string;
  category: string;
  birthday?: string;
  location?: string;
  favoriteFood?: string;
  customFields?: Record<string, string>;
}

interface PersonProfileProps {
  person: Person;
  onBack: () => void;
  onUpdate: (person: Person) => void;
}

const PersonProfile = ({ person, onBack, onUpdate }: PersonProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPerson, setEditedPerson] = useState(person);
  const [newFieldKey, setNewFieldKey] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");
  const [showAddField, setShowAddField] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Friends": return Users;
      case "Family": return Heart;
      case "Acquaintances": return Home;
      default: return Users;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Friends": return "bg-blue-100 text-blue-700";
      case "Family": return "bg-red-100 text-red-700";
      case "Acquaintances": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleSave = () => {
    onUpdate(editedPerson);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPerson(person);
    setIsEditing(false);
  };

  const addCustomField = () => {
    if (newFieldKey.trim() && newFieldValue.trim()) {
      setEditedPerson({
        ...editedPerson,
        customFields: {
          ...editedPerson.customFields,
          [newFieldKey.trim()]: newFieldValue.trim()
        }
      });
      setNewFieldKey("");
      setNewFieldValue("");
      setShowAddField(false);
    }
  };

  const removeCustomField = (key: string) => {
    const newCustomFields = { ...editedPerson.customFields };
    delete newCustomFields[key];
    setEditedPerson({
      ...editedPerson,
      customFields: newCustomFields
    });
  };

  const Icon = getCategoryIcon(person.category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBack}
            variant="ghost"
            className="flex items-center gap-2 hover:bg-white/50 rounded-xl"
          >
            <ArrowLeft size={20} />
            Back
          </Button>
          
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 rounded-xl"
            >
              <Edit3 size={16} />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 rounded-xl"
              >
                <Save size={16} className="mr-2" />
                Save
              </Button>
            </div>
          )}
        </div>

        {/* Profile Header */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {person.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{person.name}</h1>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(person.category)}`}>
                  <Icon size={16} />
                  {person.category}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar size={16} />
                  Birthday
                </Label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editedPerson.birthday || ""}
                    onChange={(e) => setEditedPerson({ ...editedPerson, birthday: e.target.value })}
                    className="mt-1 rounded-xl"
                  />
                ) : (
                  <p className="text-gray-600 mt-1 p-3 bg-gray-50 rounded-xl">
                    {person.birthday ? new Date(person.birthday).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : "Not set"}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MapPin size={16} />
                  Location
                </Label>
                {isEditing ? (
                  <Input
                    value={editedPerson.location || ""}
                    onChange={(e) => setEditedPerson({ ...editedPerson, location: e.target.value })}
                    placeholder="City, State/Country"
                    className="mt-1 rounded-xl"
                  />
                ) : (
                  <p className="text-gray-600 mt-1 p-3 bg-gray-50 rounded-xl">
                    {person.location || "Not set"}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Utensils size={16} />
                  Favorite Food
                </Label>
                {isEditing ? (
                  <Input
                    value={editedPerson.favoriteFood || ""}
                    onChange={(e) => setEditedPerson({ ...editedPerson, favoriteFood: e.target.value })}
                    placeholder="Their favorite food"
                    className="mt-1 rounded-xl"
                  />
                ) : (
                  <p className="text-gray-600 mt-1 p-3 bg-gray-50 rounded-xl">
                    {person.favoriteFood || "Not set"}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custom Fields */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Additional Details</CardTitle>
              {isEditing && (
                <Button
                  onClick={() => setShowAddField(true)}
                  size="sm"
                  variant="outline"
                  className="rounded-xl"
                >
                  <Plus size={16} className="mr-1" />
                  Add Field
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(editedPerson.customFields || {}).map(([key, value]) => (
              <div key={key}>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">{key}</Label>
                  {isEditing && (
                    <Button
                      onClick={() => removeCustomField(key)}
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                    >
                      <X size={14} />
                    </Button>
                  )}
                </div>
                {isEditing ? (
                  <Input
                    value={value}
                    onChange={(e) => setEditedPerson({
                      ...editedPerson,
                      customFields: {
                        ...editedPerson.customFields,
                        [key]: e.target.value
                      }
                    })}
                    className="mt-1 rounded-xl"
                  />
                ) : (
                  <p className="text-gray-600 mt-1 p-3 bg-gray-50 rounded-xl">{value}</p>
                )}
              </div>
            ))}

            {showAddField && isEditing && (
              <div className="p-4 bg-blue-50 rounded-xl space-y-3">
                <Input
                  value={newFieldKey}
                  onChange={(e) => setNewFieldKey(e.target.value)}
                  placeholder="Field name (e.g., 'Hobby', 'Where We Met')"
                  className="rounded-xl"
                />
                <Input
                  value={newFieldValue}
                  onChange={(e) => setNewFieldValue(e.target.value)}
                  placeholder="Field value"
                  className="rounded-xl"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={addCustomField}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 rounded-xl"
                  >
                    Add
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAddField(false);
                      setNewFieldKey("");
                      setNewFieldValue("");
                    }}
                    size="sm"
                    variant="outline"
                    className="rounded-xl"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {Object.keys(editedPerson.customFields || {}).length === 0 && !showAddField && (
              <p className="text-gray-500 text-center py-4">
                {isEditing ? "Click 'Add Field' to add custom details" : "No additional details yet"}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PersonProfile;
