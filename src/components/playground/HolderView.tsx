import { Smartphone } from "lucide-react";
import type { VerifiableCredential, BlockchainAnchor, HolderStep } from "@/types/playground";
import { MobileWalletFrame } from "./holder/MobileWalletFrame";
import { WalletEmptyState } from "./holder/WalletEmptyState";
import { WalletScanFlow } from "./holder/WalletScanFlow";
import { WalletConsentModal } from "./holder/WalletConsentModal";
import { WalletCredentialList } from "./holder/WalletCredentialList";

interface HolderViewProps {
  holderStep: HolderStep;
  pendingCredential: VerifiableCredential | null;
  walletCredentials: VerifiableCredential[];
  blockchainAnchor: BlockchainAnchor | null;
  onScanCredential: () => void;
  onScanComplete: () => void;
  onAcceptCredential: () => void;
  onRejectCredential: () => void;
  onPresentToVerifier: () => void;
}

export function HolderView({
  holderStep,
  pendingCredential,
  walletCredentials,
  blockchainAnchor,
  onScanCredential,
  onScanComplete,
  onAcceptCredential,
  onRejectCredential,
  onPresentToVerifier,
}: HolderViewProps) {
  const credentialCount = walletCredentials.length;

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {/* Header */}
      <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span className="w-5 h-5 rounded bg-holder flex items-center justify-center text-holder-foreground text-[10px] font-semibold">
            2
          </span>
          <span>Citizen Wallet</span>
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">
          Your Digital Wallet
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Securely hold and present your verifiable credentials
        </p>
      </div>

      <div className="flex-1 p-4 sm:p-8 overflow-auto">
        <div className="max-w-sm mx-auto">
          <MobileWalletFrame credentialCount={credentialCount}>
            {/* Empty State */}
            {holderStep === "empty" && (
              <WalletEmptyState
                onScanCredential={onScanCredential}
                hasPendingCredential={!!pendingCredential}
              />
            )}

            {/* Scanning State */}
            {holderStep === "scanning" && (
              <WalletScanFlow onScanComplete={onScanComplete} />
            )}

            {/* Consent Modal */}
            {holderStep === "consent" && pendingCredential && (
              <WalletConsentModal
                credential={pendingCredential}
                onAccept={onAcceptCredential}
                onReject={onRejectCredential}
              />
            )}

            {/* Stored Credentials */}
            {holderStep === "stored" && walletCredentials.length > 0 && (
              <WalletCredentialList
                credentials={walletCredentials}
                blockchainAnchor={blockchainAnchor}
                onPresentToVerifier={onPresentToVerifier}
              />
            )}
          </MobileWalletFrame>

          {/* Privacy Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              You control your data. Present only what's needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
