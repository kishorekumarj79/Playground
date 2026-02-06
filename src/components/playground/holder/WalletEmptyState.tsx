import { Smartphone, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WalletEmptyStateProps {
  onScanCredential: () => void;
  hasPendingCredential: boolean;
}

export function WalletEmptyState({ onScanCredential, hasPendingCredential }: WalletEmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
        <Smartphone className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1">
        No credentials found
      </h3>
      <p className="text-xs text-muted-foreground text-center mb-6">
        Add your first credential to get started
      </p>
      {hasPendingCredential && (
        <Button
          onClick={onScanCredential}
          className="bg-holder hover:bg-holder/90 text-holder-foreground"
        >
          <QrCode className="w-4 h-4 mr-2" />
          Scan to add credential
        </Button>
      )}
    </div>
  );
}
