import { useState, useEffect } from "react";
import { QrCode, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletScanFlowProps {
  onScanComplete: () => void;
}

export function WalletScanFlow({ onScanComplete }: WalletScanFlowProps) {
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onScanComplete, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [onScanComplete]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      {/* QR Scanner Simulation */}
      <div className="relative w-48 h-48 mb-6">
        {/* Scanner Frame */}
        <div className="absolute inset-0 border-2 border-holder/30 rounded-2xl" />
        
        {/* Corner Markers */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 border-holder rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 border-holder rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 border-holder rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 border-holder rounded-br-lg" />

        {/* Scan Line Animation */}
        <div
          className="absolute left-2 right-2 h-0.5 bg-holder transition-all duration-150"
          style={{ top: `${scanProgress}%` }}
        />

        {/* QR Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <QrCode className={cn(
            "w-16 h-16 transition-colors",
            scanProgress >= 100 ? "text-holder" : "text-muted-foreground/30"
          )} />
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Scanning credential...</span>
      </div>

      <div className="w-48 h-1 bg-muted rounded-full mt-4 overflow-hidden">
        <div 
          className="h-full bg-holder transition-all duration-150 rounded-full"
          style={{ width: `${scanProgress}%` }}
        />
      </div>
    </div>
  );
}
