import { Dialog } from '@headlessui/react';
import { useState } from 'preact/hooks';
import BarcodeScanner from './BarcodeScanner';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductFound: (product: { carbs: number; fat: number; protein: number }) => void;
}

export default function BarcodeScannerModal({ isOpen, onClose, onProductFound }: BarcodeScannerModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = async (barcode: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Using Open Food Facts API to lookup product
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await response.json();

      if (data.status === 1 && data.product) {
        const { nutriments } = data.product;
        
        onProductFound({
          carbs: Math.round(nutriments.carbohydrates_100g || 0),
          fat: Math.round(nutriments.fat_100g || 0),
          protein: Math.round(nutriments.proteins_100g || 0),
        });
        
        onClose();
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError('Failed to lookup product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error: Error) => {
    setError(error.message);
  };

  return (
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
              Scan Barcode
            </Dialog.Title>

            {error && (
              <div class="mb-4 rounded-md bg-red-50 dark:bg-red-900/50 p-4">
                <div class="text-sm text-red-700 dark:text-red-200">{error}</div>
              </div>
            )}

            <BarcodeScanner
              onScan={handleScan}
              onError={handleError}
            />

            {isLoading && (
              <div class="mt-4 text-center text-gray-500 dark:text-gray-400">
                Looking up product...
              </div>
            )}

            <div class="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 