import { Dialog } from '@headlessui/react';
import { useState, useEffect } from 'preact/hooks';
import { supabase } from '../lib/supabase';
import { useDateRange } from '../context/DateRangeContext';
import { format } from 'date-fns';

interface Entry {
  id: string;
  date: string;
  created_at?: string;
  carbs: number;
  fat: number;
  protein: number;
}

interface EntriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEntryDeleted: () => void;
}

export default function EntriesModal({ isOpen, onClose, onEntryDeleted }: EntriesModalProps) {
  const { dateRange } = useDateRange();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchEntries = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const utcStart = dateRange.start.toISOString();
      const utcEnd = dateRange.end.toISOString();
      const { data, error: queryError } = await supabase
        .from('macro_entries')
        .select('*')
        .gte('created_at', utcStart)
        .lte('created_at', utcEnd)
        .order('created_at', { ascending: sortOrder === 'asc' });

      if (queryError) throw queryError;
      setEntries(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('macro_entries')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchEntries();
      onEntryDeleted();
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchEntries();
    }
  }, [isOpen, dateRange.start, dateRange.end, sortOrder]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      class="relative z-50"
    >
      <div class="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div class="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel class="relative bg-white dark:bg-dark-bg rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
          <div class="p-6 border-b border-gray-200 dark:border-dark-accent">
            <Dialog.Title class="text-lg font-semibold text-gray-900 dark:text-white">
              Macro Entries
            </Dialog.Title>
          </div>

          <div class="flex-1 overflow-auto p-6">
            {error && (
              <div class="mb-4 rounded-md bg-red-50 dark:bg-red-900/50 p-4">
                <div class="text-sm text-red-700 dark:text-red-200">{error}</div>
              </div>
            )}

            <div class="flex justify-end mb-4">
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                class="px-4 py-2 text-sm bg-gray-200 dark:bg-dark-accent rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-hover"
              >
                Sort {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
              </button>
            </div>

            {isLoading ? (
              <div class="text-center text-gray-500 dark:text-gray-400">Loading entries...</div>
            ) : entries.length === 0 ? (
              <div class="text-center text-gray-500 dark:text-gray-400">No entries found for this date range.</div>
            ) : (
              <div class="space-y-4">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    class="bg-gray-50 dark:bg-dark-accent rounded-lg p-4"
                  >
                    <div class="mb-2">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {format(new Date(entry.created_at ? entry.created_at : entry.date), 'MMM d, yyyy, h:mm a')}
                      </div>
                    </div>
                    <div class="grid grid-cols-4 gap-4 items-center">
                      <div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">Carbs</div>
                        <div class="text-lg font-medium text-gray-900 dark:text-white">{entry.carbs}g</div>
                      </div>
                      <div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">Fat</div>
                        <div class="text-lg font-medium text-gray-900 dark:text-white">{entry.fat}g</div>
                      </div>
                      <div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">Protein</div>
                        <div class="text-lg font-medium text-gray-900 dark:text-white">{entry.protein}g</div>
                      </div>
                      <div class="flex justify-end">
                        <button
                          onClick={() => handleDelete(entry.id)}
                          class="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg bg-gray-200 dark:bg-dark-accent"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div class="p-6 border-t border-gray-200 dark:border-dark-accent">
            <div class="flex justify-end">
              <button
                onClick={onClose}
                class="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-dark-accent text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 