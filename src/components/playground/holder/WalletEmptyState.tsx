import { Smartphone, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WalletEmptyStateProps {
  onScanCredential: () => void;
  hasPendingCredential: boolean;
}

export function WalletEmptyState({ onScanCredential, hasPendingCredential }: WalletEmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mb-3">
        <Smartphone className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1">
        Wallet Empty
      </h3>
      <p className="text-[11px] text-muted-foreground text-center mb-4">
        Add a credential to get started
      </p>
      {hasPendingCredential && (
        <Button
          onClick={onScanCredential}
          size="sm"
          className="bg-holder hover:bg-holder/90 text-holder-foreground h-8 text-xs"
        >
          <QrCode className="w-3.5 h-3.5 mr-1.5" />
          Claim Credential
        </Button>
      )}
    </div>
  );
}
