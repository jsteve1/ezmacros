import { useEffect, useRef, useState } from 'preact/hooks';
import { BrowserMultiFormatReader, Result } from '@zxing/library';

interface BarcodeScannerProps {
  onScan: (result: string) => void;
  onError?: (error: Error) => void;
}

export default function BarcodeScanner({ onScan, onError }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let mounted = true;

    const startScanning = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        
        if (!mounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        setHasPermission(true);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          codeReader.decodeFromVideoDevice(
            null,
            videoRef.current,
            (result: Result | null) => {
              if (result) {
                onScan(result.getText());
              }
            }
          );
        }
      } catch (err) {
        if (err instanceof Error) {
          setHasPermission(false);
          onError?.(err);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    startScanning();

    return () => {
      mounted = false;
      codeReader.reset();
    };
  }, [onScan, onError]);

  if (isLoading) {
    return (
      <div class="flex items-center justify-center h-64 bg-gray-100 dark:bg-dark-accent rounded-lg">
        <div class="text-gray-500 dark:text-gray-400">
          Loading camera...
        </div>
      </div>
    );
  }

  if (hasPermission === false) {
    return (
      <div class="flex items-center justify-center h-64 bg-gray-100 dark:bg-dark-accent rounded-lg">
        <div class="text-center text-gray-500 dark:text-gray-400">
          <p class="mb-2">Camera access denied</p>
          <p class="text-sm">Please enable camera access to scan barcodes</p>
        </div>
      </div>
    );
  }

  return (
    <div class="relative">
      <video
        ref={videoRef}
        class="w-full h-64 object-cover rounded-lg bg-black"
        autoPlay
        playsInline
        muted
      />
      <div class="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-48 h-48 border-2 border-blue-500 rounded-lg" />
        </div>
      </div>
    </div>
  );
} 