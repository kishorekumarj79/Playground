import { useState } from "react";
import { Share2, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CredentialCard } from "./CredentialCard";
import type { VerifiableCredential, BlockchainAnchor } from "@/types/playground";

interface WalletCredentialListProps {
  credentials: VerifiableCredential[];
  blockchainAnchor: BlockchainAnchor | null;
  devModeEnabled?: boolean;
  onPresentToVerifier: () => void;
}

export function WalletCredentialList({ 
  credentials, 
  blockchainAnchor,
  devModeEnabled = false,
  onPresentToVerifier 
}: WalletCredentialListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  return (
    <div className="flex-1 flex flex-col">
      {/* Credential List */}
      <div className="flex-1 p-4 space-y-3 overflow-auto">
        {credentials.map((credential, index) => (
          <CredentialCard
            key={credential.credentialSubject.id}
            credential={credential}
            blockchainAnchor={blockchainAnchor}
            devModeEnabled={devModeEnabled}
            isExpanded={expandedIndex === index}
            onToggle={() => setExpandedIndex(expandedIndex === index ? -1 : index)}
          />
        ))}

        {/* Privacy Notice */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
          <Lock className="w-4 h-4 text-muted-foreground" />
          <p className="text-[10px] text-muted-foreground">
            Your credentials are stored securely on your device
          </p>
        </div>
      </div>

      {/* Present Action */}
      <div className="p-4 border-t border-border">
        <Button
          onClick={onPresentToVerifier}
          className="w-full h-11 bg-holder hover:bg-holder/90 text-holder-foreground"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Present to Verifier
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
