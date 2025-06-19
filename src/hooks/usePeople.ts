
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Person {
  id: string;
  name: string;
  category: string;
  birthday?: string;
  location?: string;
  favorite_food?: string;
  custom_fields?: Record<string, string>;
  created_at?: string;
  updated_at?: string;
}

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
        setPeople(data || []);
      }
    } catch (error) {
      console.error('Error fetching people:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPerson = async (personData: { name: string; category: string }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('people')
        .insert([
          {
            name: personData.name,
            category: personData.category,
            user_id: user.id,
            custom_fields: {}
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

      setPeople(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: `${personData.name} has been added to your people.`,
      });
      return data;
    } catch (error) {
      console.error('Error adding person:', error);
      return null;
    }
  };

  const updatePerson = async (id: string, updates: Partial<Person>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('people')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
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

      setPeople(prev => 
        prev.map(person => person.id === id ? data : person)
      );
      toast({
        title: "Success",
        description: "Person updated successfully.",
      });
      return data;
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
