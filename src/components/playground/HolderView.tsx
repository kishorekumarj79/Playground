import { Smartphone } from "lucide-react";
import type { VerifiableCredential, BlockchainAnchor, HolderStep, VerificationRequest } from "@/types/playground";
import { MobileWalletFrame } from "./holder/MobileWalletFrame";
import { WalletEmptyState } from "./holder/WalletEmptyState";
import { WalletScanFlow } from "./holder/WalletScanFlow";
import { WalletConsentModal } from "./holder/WalletConsentModal";
import { WalletVerificationConsent } from "./holder/WalletVerificationConsent";
import { WalletCredentialList } from "./holder/WalletCredentialList";

interface HolderViewProps {
  holderStep: HolderStep;
  pendingCredential: VerifiableCredential | null;
  walletCredentials: VerifiableCredential[];
  blockchainAnchor: BlockchainAnchor | null;
  devModeEnabled?: boolean;
  selectedVerificationRequest?: VerificationRequest | null;
  onScanCredential: () => void;
  onScanComplete: () => void;
  onAcceptCredential: () => void;
  onRejectCredential: () => void;
  onPresentToVerifier: () => void;
  onShareCredential?: () => void;
  onCancelVerification?: () => void;
}

export function HolderView({
  holderStep,
  pendingCredential,
  walletCredentials,
  blockchainAnchor,
  devModeEnabled = false,
  selectedVerificationRequest,
  onScanCredential,
  onScanComplete,
  onAcceptCredential,
  onRejectCredential,
  onPresentToVerifier,
  onShareCredential,
  onCancelVerification,
}: HolderViewProps) {
  const credentialCount = walletCredentials.length;

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {/* Header */}
      <div className="px-4 sm:px-8 py-2 sm:py-3 border-b border-border">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1">
          <span className="w-4 h-4 rounded bg-holder flex items-center justify-center text-holder-foreground text-[9px] font-semibold">
            2
          </span>
          <span>Citizen Wallet</span>
        </div>
        <h2 className="text-base sm:text-lg font-semibold text-foreground leading-tight">
          Your Digital Wallet
        </h2>
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
          Securely hold and present your verifiable credentials
        </p>
      </div>

      <div className="flex-1 p-4 sm:p-6 overflow-auto">
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

            {/* Consent Modal (Issuance) */}
            {holderStep === "consent" && pendingCredential && (
              <WalletConsentModal
                credential={pendingCredential}
                onAccept={onAcceptCredential}
                onReject={onRejectCredential}
              />
            )}

            {/* Consent Modal (Verification) */}
            {holderStep === "review-request" && selectedVerificationRequest && (
              <WalletVerificationConsent
                request={selectedVerificationRequest}
                credential={walletCredentials[0] || null}
                onAccept={onShareCredential || (() => { })}
                onReject={onCancelVerification || (() => { })}
              />
            )}

            {/* Stored Credentials */}
            {holderStep === "stored" && walletCredentials.length > 0 && (
              <WalletCredentialList
                credentials={walletCredentials}
                blockchainAnchor={blockchainAnchor}
                devModeEnabled={devModeEnabled}
                onPresentToVerifier={onPresentToVerifier}
                onScanCredential={onScanCredential}
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
