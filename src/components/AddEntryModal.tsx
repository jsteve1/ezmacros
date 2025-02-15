import { Dialog } from '@headlessui/react';
import { useState } from 'preact/hooks';
import { supabase } from '../lib/supabase';
import BarcodeScannerModal from './BarcodeScannerModal';
import { format } from 'date-fns';

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddEntryModal({ isOpen, onClose, onSuccess }: AddEntryModalProps) {
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [protein, setProtein] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleSubmit = async () => {
    console.log('handleSubmit started');
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      const now = new Date();
      const date = format(now, 'yyyy-MM-dd');
      console.log('Inserting entry with date:', date, 'carbs:', carbs, 'fat:', fat, 'protein:', protein);

      const { error: insertError } = await supabase
        .from('macro_entries')
        .insert({
          user_id: user.id,
          carbs: parseInt(carbs) || 0,
          fat: parseInt(fat) || 0,
          protein: parseInt(protein) || 0,
          date: date,
        });

      if (insertError) throw insertError;

      console.log('Entry inserted successfully');
      
      // Reset state first
      setCarbs('');
      setFat('');
      setProtein('');
      
      // Then trigger callbacks
      console.log('Calling onSuccess callback');
      onSuccess();
      console.log('Calling onClose callback');
      onClose();
    } catch (err: any) {
      console.error('Error in handleSubmit:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNumberInput = (value: string) => {
    // Remove any non-digit characters
    const cleaned = value.replace(/\D/g, '');
    // Convert to number and back to string to remove leading zeros
    return cleaned ? parseInt(cleaned).toString() : '';
  };

  const handleProductFound = (product: { carbs: number; fat: number; protein: number }) => {
    setCarbs(product.carbs.toString());
    setFat(product.fat.toString());
    setProtein(product.protein.toString());
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        class="relative z-50"
      >
        <div class="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div class="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel class="relative bg-white dark:bg-dark-bg rounded-lg w-full max-w-md">
            <div class="p-6">
              <Dialog.Title class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Add Macro Entry
              </Dialog.Title>

              {error && (
                <div class="mb-4 rounded-md bg-red-50 dark:bg-red-900/50 p-4">
                  <div class="text-sm text-red-700 dark:text-red-200">{error}</div>
                </div>
              )}

              <div class="mb-6">
                <button
                  onClick={() => setIsScannerOpen(true)}
                  class="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-dark-accent hover:bg-gray-200 dark:hover:bg-dark-hover rounded-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
                  </svg>
                  Scan Barcode
                </button>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Carbs (g)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={carbs}
                    onChange={(e) => setCarbs(handleNumberInput((e.target as HTMLInputElement).value))}
                    class="block w-full text-center rounded-md border-gray-300 dark:border-dark-accent bg-white dark:bg-dark-accent text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="0"
                    style={{ height: '40px', fontSize: '1.5rem'   }}
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Fat (g)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={fat}
                    onChange={(e) => setFat(handleNumberInput((e.target as HTMLInputElement).value))}
                    class="block w-full text-center rounded-md border-gray-300 dark:border-dark-accent bg-white dark:bg-dark-accent text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="0"
                    style={{ height: '40px', fontSize: '1.5rem'   }}
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={protein}
                    onChange={(e) => setProtein(handleNumberInput((e.target as HTMLInputElement).value))}
                    class="block w-full text-center rounded-md border-gray-300 dark:border-dark-accent bg-white dark:bg-dark-accent text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="0"
                    style={{ height: '40px', fontSize: '1.5rem'   }}
                  />
                </div>
              </div>

              <div class="mt-6 flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  class="px-4 py-2 text-sm font-medium bg-transparent border border-green-300 dark:border-green rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Adding...' : 'Add Entry'}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onProductFound={handleProductFound}
      />
    </>
  );
} 