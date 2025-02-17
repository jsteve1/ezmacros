import { useEffect, useRef, useState } from 'preact/hooks';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType } from '@zxing/library';

interface BarcodeScannerProps {
  onScan: (result: string) => void;
  onError?: (error: Error) => void;
}

const SCAN_DELAY = 2000; // Delay between scans in milliseconds

export default function BarcodeScanner({ onScan, onError }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(true);
  const timeoutRef = useRef<number>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  useEffect(() => {
    // Configure reader with specific formats and hints
    const hints = new Map<DecodeHintType, any>();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E
    ]);
    hints.set(DecodeHintType.TRY_HARDER, true);

    const reader = new BrowserMultiFormatReader(hints);

    async function startScanning() {
      if (!videoRef.current) return;

      try {
        controlsRef.current = await reader.decodeFromConstraints(
          { 
            video: { 
              facingMode: "environment",
              width: { min: 640, ideal: 800, max: 1280 },
              height: { min: 480, ideal: 600, max: 720 },
              aspectRatio: 4/3,
              // Reduce frame rate to give more processing time per frame
              frameRate: { ideal: 15 }
            }
          },
          videoRef.current,
          (result) => {
            if (result && isScanning) {
              const text = result.getText();
              // Validate barcode format (should be numeric and reasonable length)
              if (/^\d{8,14}$/.test(text)) {
                setIsScanning(false);
                onScan(text);

                timeoutRef.current = window.setTimeout(() => {
                  setIsScanning(true);
                }, SCAN_DELAY);
              }
            }
          }
        );

        // Ensure video is playing and visible
        if (videoRef.current) {
          videoRef.current.play();
        }
      } catch (err) {
        if (err instanceof Error) {
          onError?.(err);
        }
      }
    }

    if (isScanning) {
      startScanning();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
    };
  }, [isScanning, onScan, onError]);

  return (
    <div className="relative">
      <div className="w-full h-64 rounded-lg overflow-hidden bg-black">
        {isScanning ? (
          <div className="w-full h-full">
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              playsInline
              muted
              autoPlay
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-sm">
                Center barcode in box
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-white">
              Scan successful! Ready for next scan in {SCAN_DELAY/1000} seconds...
            </p>
          </div>
        )}
      </div>
      <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 border-2 border-blue-500 rounded-lg" />
        </div>
      </div>
    </div>
  );
} 