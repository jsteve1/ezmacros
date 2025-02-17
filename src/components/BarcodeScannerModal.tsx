/** @jsxImportSource preact */
import { Dialog } from '@headlessui/react';
import { useState } from 'preact/hooks';
import BarcodeScanner from './BarcodeScanner';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductFound: (product: { carbs: number; fat: number; protein: number }) => void;
}

const DEBUG = true; // Set to false in production

function log(...args: unknown[]) {
  if (DEBUG) {
    console.log('[BarcodeScannerModal]', ...args);
  }
}

export default function BarcodeScannerModal({ isOpen, onClose, onProductFound }: BarcodeScannerModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = async (barcode: string) => {
    log('Barcode scanned:', barcode);
    setIsLoading(true);
    setError(null);

    try {
      log('Fetching product data...');
      const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
      log('API URL:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      log('API response:', data);

      if (data.status === 1 && data.product) {
        const { nutriments } = data.product;
        log('Product found:', {
          name: data.product.product_name,
          nutriments
        });
        
        const product = {
          carbs: Math.round(nutriments.carbohydrates_100g || 0),
          fat: Math.round(nutriments.fat_100g || 0),
          protein: Math.round(nutriments.proteins_100g || 0),
        };
        
        log('Extracted nutrition data:', product);
        onProductFound(product);
        onClose();
      } else {
        log('Product not found in database');
        setError('Product not found');
      }
    } catch (err) {
      log('API error:', err);
      setError('Failed to lookup product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error: Error) => {
    log('Scanner error:', error);
    setError(error.message);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <Dialog.Overlay className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative bg-white dark:bg-dark-bg rounded-lg w-full max-w-md">
          <div className="p-6">
            <Dialog.Title className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Scan Barcode
            </Dialog.Title>

            {error && (
              <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/50 p-4">
                <div className="text-sm text-red-700 dark:text-red-200">{error}</div>
              </div>
            )}

            <BarcodeScanner
              onScan={handleScan}
              onError={handleError}
            />

            {isLoading && (
              <div className="mt-4 text-center text-gray-500 dark:text-gray-400">
                Looking up product...
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg"
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