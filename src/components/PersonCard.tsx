
import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, Home, MapPin, Calendar, MessageCircle, Avatar } from "lucide-react";
import { Person } from "@/hooks/usePeople";

interface PersonCardProps {
  person: Person;
  onClick: () => void;
}

const PersonCard = ({ person, onClick }: PersonCardProps) => {
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

  const Icon = getCategoryIcon(person.category);

  return (
    <Card 
      onClick={onClick}
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 bg-white/80 backdrop-blur-sm border-0 shadow-md"
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">{person.name}</h3>
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(person.category)}`}>
              <Icon size={12} />
              {person.category}
            </div>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
            {person.image_url ? (
              <img 
                src={person.image_url} 
                alt={person.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                {person.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {person.birthday && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={14} />
              <span>{new Date(person.birthday).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
            </div>
          )}
          {person.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={14} />
              <span>{person.location}</span>
            </div>
          )}
          {person.how_we_met && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MessageCircle size={14} />
              <span>{person.how_we_met}</span>
            </div>
          )}
        </div>

        {Object.keys(person.custom_fields || {}).length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              +{Object.keys(person.custom_fields || {}).length} more details
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonCard;
