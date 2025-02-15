import { useEffect, useState } from 'preact/hooks';
import { supabase } from '../lib/supabase';
import { useDateRange } from '../context/DateRangeContext';
import { format } from 'date-fns';

interface MacroTotals {
  carbs: number;
  fat: number;
  protein: number;
}

export function useMacros() {
  const { dateRange } = useDateRange();
  const [totals, setTotals] = useState<MacroTotals>({ carbs: 0, fat: 0, protein: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Extract date strings for dependency array
  const startDate = format(dateRange.start, 'yyyy-MM-dd');
  const endDate = format(dateRange.end, 'yyyy-MM-dd');

  async function fetchTotals() {
    console.log('fetchTotals called with dates:', { startDate, endDate });
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error: queryError } = await supabase
        .from('macro_entries')
        .select('carbs, fat, protein')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate);

      if (queryError) throw queryError;
      
      console.log('Raw fetched data:', data);

      const newTotals = data.reduce(
        (acc, entry) => ({
          carbs: acc.carbs + (Number(entry.carbs) || 0),
          fat: acc.fat + (Number(entry.fat) || 0),
          protein: acc.protein + (Number(entry.protein) || 0),
        }),
        { carbs: 0, fat: 0, protein: 0 }
      );

      console.log('Setting new totals:', newTotals);
      setTotals(newTotals);
    } catch (err: any) {
      console.error('Error in fetchTotals:', err);
      setError(err.message);
      setTotals({ carbs: 0, fat: 0, protein: 0 });
    } finally {
      setIsLoading(false);
      console.log('fetchTotals finished, isLoading set to false');
    }
  }

  useEffect(() => {
    console.log('useMacros effect triggered with dates:', { startDate, endDate, refreshCounter });
    fetchTotals();
  }, [startDate, endDate, refreshCounter]); // Use primitive values instead of object reference

  useEffect(() => {
    const subscribe = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found in realtime subscription');
        return;
      }
      console.log('Setting up realtime subscription for user:', user.id);

      const channel = supabase.channel(`macro_entries_${user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'macro_entries', filter: `user_id=eq.${user.id}` }, (payload: any) => {
          console.log('Realtime update received in subscription:', payload);
          setRefreshCounter(c => {
            const newCount = c + 1;
            console.log('refreshCounter incremented to', newCount);
            return newCount;
          });
        })
        .subscribe();

      return channel;
    };

    let subscriptionReference: any;
    subscribe().then(channel => {
      subscriptionReference = channel;
      console.log('Realtime subscription setup complete:', channel);
    });

    return () => {
      if (subscriptionReference) {
        supabase.removeChannel(subscriptionReference);
      }
    };
  }, []);

  return {
    totals,
    isLoading,
    error,
    refresh: () => {
      console.log('Manual refresh called');
      setRefreshCounter(prev => {
        const newCount = prev + 1;
        console.log('Manual refresh - refreshCounter incremented to', newCount);
        return newCount;
      });
    }
  };
} 