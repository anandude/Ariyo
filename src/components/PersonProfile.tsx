
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Edit3, Save, Plus, X, Calendar, MapPin, MessageCircle, Users, Heart, Home, CalendarPlus } from "lucide-react";
import { Person, Plan } from "@/hooks/usePeople";
import ProfilePictureModal from "@/components/ProfilePictureModal";

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
  const [newPlanTime, setNewPlanTime] = useState("");
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

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
      case "Friends": return "bg-secondary text-secondary-foreground";
      case "Family": return "bg-accent text-accent-foreground";
      case "Acquaintances": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
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

  const handleImageUploaded = (url: string, position: { x: number; y: number; scale: number }) => {
    setEditedPerson({
      ...editedPerson,
      image_url: url,
      image_position: position
    });
    setShowImageModal(false);
  };

  const handleImageRemoved = () => {
    setEditedPerson({
      ...editedPerson,
      image_url: undefined,
      image_position: undefined
    });
    setShowImageModal(false);
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
        date: newPlanDate,
        time: newPlanTime || undefined
      };
      setEditedPerson({
        ...editedPerson,
        plans_made: [...(editedPerson.plans_made || []), newPlan]
      });
      setNewPlanDescription("");
      setNewPlanDate("");
      setNewPlanTime("");
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

  const getImageStyle = () => {
    if (!editedPerson.image_position) return {};
    const { x, y, scale } = editedPerson.image_position;
    return {
      transform: `translate(${x}px, ${y}px) scale(${scale})`,
      transformOrigin: 'center'
    };
  };

  const Icon = getCategoryIcon(person.category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBack}
            variant="ghost"
            className="flex items-center gap-2 hover:bg-secondary/50 rounded-xl"
          >
            <ArrowLeft size={20} />
            Back
          </Button>
          
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
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
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
              >
                <Save size={16} className="mr-2" />
                Save
              </Button>
            </div>
          )}
        </div>

        {/* Profile Header */}
        <Card className="mb-6 bg-card/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div 
                className={`w-20 h-20 rounded-full overflow-hidden border-2 border-border transition-colors ${
                  isEditing ? 'cursor-pointer hover:border-primary' : ''
                }`}
                onClick={() => isEditing && setShowImageModal(true)}
              >
                {editedPerson.image_url ? (
                  <img 
                    src={editedPerson.image_url} 
                    alt={editedPerson.name}
                    className="w-full h-full object-cover"
                    style={getImageStyle()}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="w-full h-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl">${editedPerson.name.charAt(0)}</div>`;
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl">
                    {editedPerson.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <Input
                    value={editedPerson.name}
                    onChange={(e) => setEditedPerson({ ...editedPerson, name: e.target.value })}
                    className="text-2xl font-bold text-card-foreground mb-2 rounded-xl border-2"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-card-foreground mb-2">{editedPerson.name}</h1>
                )}
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(editedPerson.category)}`}>
                  <Icon size={16} />
                  {editedPerson.category}
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
                    <div className="grid grid-cols-2 gap-2">
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
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Time</Label>
                        {isEditing ? (
                          <Input
                            type="time"
                            value={plan.time || ""}
                            onChange={(e) => updatePlan(plan.id, 'time', e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-gray-600 mt-1">
                            {plan.time || "No time set"}
                          </p>
                        )}
                      </div>
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
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={newPlanDate}
                    onChange={(e) => setNewPlanDate(e.target.value)}
                    className="rounded-xl"
                  />
                  <Input
                    type="time"
                    value={newPlanTime}
                    onChange={(e) => setNewPlanTime(e.target.value)}
                    placeholder="Time"
                    className="rounded-xl"
                  />
                </div>
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
                      setNewPlanTime("");
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

      {/* Profile Picture Modal */}
      <ProfilePictureModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        currentImageUrl={editedPerson.image_url}
        currentPosition={editedPerson.image_position}
        onImageUploaded={handleImageUploaded}
        onImageRemoved={handleImageRemoved}
        personName={editedPerson.name}
      />
    </div>
  );
};

export default PersonProfile;
