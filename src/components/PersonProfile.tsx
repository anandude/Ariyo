
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Edit3, Save, Plus, X, Calendar, MapPin, MessageCircle, Users, Heart, Home, Upload, CalendarPlus } from "lucide-react";
import { Person, Plan } from "@/hooks/usePeople";

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
  const [newPlanDescription, setNewPlanDescription] = useState("");
  const [newPlanDate, setNewPlanDate] = useState("");
  const [showAddPlan, setShowAddPlan] = useState(false);

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
        custom_fields: {
          ...editedPerson.custom_fields,
          [newFieldKey.trim()]: newFieldValue.trim()
        }
      });
      setNewFieldKey("");
      setNewFieldValue("");
      setShowAddField(false);
    }
  };

  const removeCustomField = (key: string) => {
    const newCustomFields = { ...editedPerson.custom_fields };
    delete newCustomFields[key];
    setEditedPerson({
      ...editedPerson,
      custom_fields: newCustomFields
    });
  };

  const addPlan = () => {
    if (newPlanDescription.trim() && newPlanDate.trim()) {
      const newPlan: Plan = {
        id: Date.now().toString(),
        description: newPlanDescription.trim(),
        date: newPlanDate
      };
      setEditedPerson({
        ...editedPerson,
        plans_made: [...(editedPerson.plans_made || []), newPlan]
      });
      setNewPlanDescription("");
      setNewPlanDate("");
      setShowAddPlan(false);
    }
  };

  const removePlan = (planId: string) => {
    setEditedPerson({
      ...editedPerson,
      plans_made: (editedPerson.plans_made || []).filter(plan => plan.id !== planId)
    });
  };

  const updatePlan = (planId: string, field: keyof Plan, value: string) => {
    setEditedPerson({
      ...editedPerson,
      plans_made: (editedPerson.plans_made || []).map(plan =>
        plan.id === planId ? { ...plan, [field]: value } : plan
      )
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
              <div className="w-20 h-20 rounded-full overflow-hidden">
                {person.image_url ? (
                  <img 
                    src={person.image_url} 
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                    {person.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{person.name}</h1>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(person.category)}`}>
                  <Icon size={16} />
                  {person.category}
                </div>
              </div>
            </div>
            {isEditing && (
              <div className="mt-4">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Upload size={16} />
                  Profile Image URL
                </Label>
                <Input
                  value={editedPerson.image_url || ""}
                  onChange={(e) => setEditedPerson({ ...editedPerson, image_url: e.target.value })}
                  placeholder="Enter image URL"
                  className="mt-1 rounded-xl"
                />
              </div>
            )}
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
                  <MessageCircle size={16} />
                  How We Met
                </Label>
                {isEditing ? (
                  <Input
                    value={editedPerson.how_we_met || ""}
                    onChange={(e) => setEditedPerson({ ...editedPerson, how_we_met: e.target.value })}
                    placeholder="How did you meet this person?"
                    className="mt-1 rounded-xl"
                  />
                ) : (
                  <p className="text-gray-600 mt-1 p-3 bg-gray-50 rounded-xl">
                    {person.how_we_met || "Not set"}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plans Made */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarPlus size={20} />
                Plans Made
              </CardTitle>
              {isEditing && (
                <Button
                  onClick={() => setShowAddPlan(true)}
                  size="sm"
                  variant="outline"
                  className="rounded-xl"
                >
                  <Plus size={16} className="mr-1" />
                  Add Plan
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {(editedPerson.plans_made || []).map((plan) => (
              <div key={plan.id} className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Plan Description</Label>
                      {isEditing ? (
                        <Input
                          value={plan.description}
                          onChange={(e) => updatePlan(plan.id, 'description', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-gray-600 mt-1">{plan.description}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Date</Label>
                      {isEditing ? (
                        <Input
                          type="date"
                          value={plan.date}
                          onChange={(e) => updatePlan(plan.id, 'date', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-gray-600 mt-1">
                          {plan.date ? new Date(plan.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }) : "No date set"}
                        </p>
                      )}
                    </div>
                  </div>
                  {isEditing && (
                    <Button
                      onClick={() => removePlan(plan.id)}
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 h-6 w-6 p-0 ml-2"
                    >
                      <X size={14} />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {showAddPlan && isEditing && (
              <div className="p-4 bg-blue-50 rounded-xl space-y-3">
                <Input
                  value={newPlanDescription}
                  onChange={(e) => setNewPlanDescription(e.target.value)}
                  placeholder="Plan description (e.g., 'Coffee at Central Park')"
                  className="rounded-xl"
                />
                <Input
                  type="date"
                  value={newPlanDate}
                  onChange={(e) => setNewPlanDate(e.target.value)}
                  className="rounded-xl"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={addPlan}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 rounded-xl"
                  >
                    Add Plan
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAddPlan(false);
                      setNewPlanDescription("");
                      setNewPlanDate("");
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

            {(editedPerson.plans_made || []).length === 0 && !showAddPlan && (
              <p className="text-gray-500 text-center py-4">
                {isEditing ? "Click 'Add Plan' to add upcoming plans" : "No plans made yet"}
              </p>
            )}
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
            {Object.entries(editedPerson.custom_fields || {}).map(([key, value]) => (
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
                      custom_fields: {
                        ...editedPerson.custom_fields,
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
                  placeholder="Field name (e.g., 'Hobby', 'Shared Interest')"
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

            {Object.keys(editedPerson.custom_fields || {}).length === 0 && !showAddField && (
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
