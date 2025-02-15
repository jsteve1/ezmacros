import { createContext } from 'preact';
import { useContext, useState, useEffect, useCallback } from 'preact/hooks';
import { supabase } from '../lib/supabase';
import { useDateRange } from './DateRangeContext';
import { format } from 'date-fns';

export interface MacroEntry {
  id: string;
  date: string;
  carbs: number;
  fat: number;
  protein: number;
}

interface MacroEntriesContextType {
  entries: MacroEntry[];
  refreshEntries: () => Promise<void>;
}

const MacroEntriesContext = createContext<MacroEntriesContextType>({
  entries: [],
  refreshEntries: async () => {}
});

export const MacroEntriesProvider = ({ children }: { children: preact.ComponentChildren }) => {
  const { dateRange } = useDateRange();
  console.log('MacroEntriesProvider rendering with dateRange:', dateRange);
  const [entries, setEntries] = useState<MacroEntry[]>([]);

  const refreshEntries = useCallback(async () => {
    const startDate = format(dateRange.start, 'yyyy-MM-dd');
    const endDate = format(dateRange.end, 'yyyy-MM-dd');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No user found in refreshEntries');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('macro_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching macro entries:', error);
        return;
      }

      console.log('Fetched macro entries:', data, 'count:', data ? data.length : 0);
      setEntries(data || []);
    } catch (err: any) {
      console.error('Exception while fetching macro entries:', err);
    }
  }, [dateRange]);

  useEffect(() => {
    refreshEntries();
  }, [dateRange, refreshEntries]);

  useEffect(() => {
    console.log('MacroEntriesContext state updated: entries count =', entries.length);
  }, [entries]);

  useEffect(() => {
    const subscribe = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found in realtime subscription');
        return;
      }
      console.log('Setting up realtime subscription in MacroEntriesProvider for user:', user.id);

      const channel = supabase.channel(`macro_entries_${user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'macro_entries', filter: `user_id=eq.${user.id}` }, (payload: any) => {
          console.log('Realtime update in MacroEntriesProvider:', payload);
          refreshEntries();
        })
        .subscribe();

      return channel;
    };

    let subscriptionReference: any;
    subscribe().then(channel => {
      subscriptionReference = channel;
      console.log('Realtime subscription in MacroEntriesProvider setup complete:', channel);
    });

    return () => {
      if (subscriptionReference) {
        supabase.removeChannel(subscriptionReference);
      }
    };
  }, [refreshEntries]);

  return (
    <MacroEntriesContext.Provider value={{ entries, refreshEntries }}>
      {children}
    </MacroEntriesContext.Provider>
  );
};

export const useMacroEntries = () => useContext(MacroEntriesContext); 