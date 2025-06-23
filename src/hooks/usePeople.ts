import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Plan {
  id: string;
  description: string;
  date: string;
  time?: string;
}

export interface Person {
  id: string;
  name: string;
  category: string;
  birthday?: string;
  location?: string;
  how_we_met?: string;
  image_url?: string;
  image_position?: { x: number; y: number; scale: number };
  custom_fields?: Record<string, string>;
  plans_made?: Plan[];
  created_at?: string;
  updated_at?: string;
}

// Helper function to safely convert Json to Plan[]
const convertJsonToPlans = (jsonData: any): Plan[] => {
  if (!jsonData || !Array.isArray(jsonData)) {
    return [];
  }
  
  return jsonData.map((item: any) => ({
    id: item.id || '',
    description: item.description || '',
    date: item.date || '',
    time: item.time || undefined
  }));
};

// Helper function to convert Plan[] to Json
const convertPlansToJson = (plans: Plan[]): any => {
  return plans.map(plan => ({
    id: plan.id,
    description: plan.description,
    date: plan.date,
    time: plan.time
  }));
};

export const usePeople = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPeople = async () => {
    if (!user) {
      setPeople([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('people')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching people:', error);
        toast({
          title: "Error",
          description: "Failed to load your people. Please try again.",
          variant: "destructive",
        });
      } else {
        const convertedPeople: Person[] = (data || []).map(person => ({
          ...person,
          custom_fields: person.custom_fields as Record<string, string> || {},
          plans_made: convertJsonToPlans(person.plans_made),
          image_position: person.image_position as { x: number; y: number; scale: number } || undefined
        }));
        setPeople(convertedPeople);
      }
    } catch (error) {
      console.error('Error fetching people:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPerson = async (personData: { name: string; category: string; image_url?: string }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('people')
        .insert([
          {
            name: personData.name,
            category: personData.category,
            image_url: personData.image_url,
            user_id: user.id,
            custom_fields: {},
            plans_made: []
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding person:', error);
        toast({
          title: "Error",
          description: "Failed to add person. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      const convertedPerson: Person = {
        ...data,
        custom_fields: data.custom_fields as Record<string, string> || {},
        plans_made: convertJsonToPlans(data.plans_made)
      };

      setPeople(prev => [convertedPerson, ...prev]);
      toast({
        title: "Success",
        description: `${personData.name} has been added to your people.`,
      });
      return convertedPerson;
    } catch (error) {
      console.error('Error adding person:', error);
      return null;
    }
  };

  const updatePerson = async (id: string, updates: Partial<Person>) => {
    if (!user) return null;

    try {
      const dbUpdates = {
        ...updates,
        updated_at: new Date().toISOString(),
        plans_made: updates.plans_made ? convertPlansToJson(updates.plans_made) : undefined
      };

      const { data, error } = await supabase
        .from('people')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating person:', error);
        toast({
          title: "Error",
          description: "Failed to update person. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      const convertedPerson: Person = {
        ...data,
        custom_fields: data.custom_fields as Record<string, string> || {},
        plans_made: convertJsonToPlans(data.plans_made),
        image_position: data.image_position as { x: number; y: number; scale: number } || undefined
      };

      setPeople(prev => 
        prev.map(person => person.id === id ? convertedPerson : person)
      );
      toast({
        title: "Success",
        description: "Person updated successfully.",
      });
      return convertedPerson;
    } catch (error) {
      console.error('Error updating person:', error);
      return null;
    }
  };

  const deletePerson = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('people')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting person:', error);
        toast({
          title: "Error",
          description: "Failed to delete person. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      setPeople(prev => prev.filter(person => person.id !== id));
      toast({
        title: "Success",
        description: "Person deleted successfully.",
      });
      return true;
    } catch (error) {
      console.error('Error deleting person:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchPeople();
  }, [user]);

  return {
    people,
    loading,
    addPerson,
    updatePerson,
    deletePerson,
    refetch: fetchPeople
  };
};
