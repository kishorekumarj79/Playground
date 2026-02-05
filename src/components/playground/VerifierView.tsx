import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import type {
  VerifiableCredential,
  VerificationResult,
  VerificationRequest,
  BlockchainAnchor,
  VerifierStep,
} from "@/types/playground";
import { ProofRequestBuilder } from "./verifier/ProofRequestBuilder";
import { VerifierConsentPrompt } from "./verifier/VerifierConsentPrompt";
import { VerificationResultDisplay } from "./verifier/VerificationResultDisplay";
import { MobileWalletFrame } from "./holder/MobileWalletFrame";

interface VerifierViewProps {
  verifierStep: VerifierStep;
  credential: VerifiableCredential | null;
  walletCredentials: VerifiableCredential[];
  verificationResult: VerificationResult | null;
  blockchainAnchor: BlockchainAnchor | null;
  verificationRequests: VerificationRequest[];
  selectedVerificationRequest: VerificationRequest | null;
  sharedAttributes: string[];
  onSelectVerificationRequest: (request: VerificationRequest) => void;
  onGenerateVerificationQR: () => void;
  onUpdateSharedAttributes: (attrs: string[]) => void;
  onShareCredential: () => void;
  onCancelVerification: () => void;
  onVerify: () => void;
}

export function VerifierView({
  verifierStep,
  credential,
  walletCredentials,
  verificationResult,
  blockchainAnchor,
  verificationRequests,
  selectedVerificationRequest,
  sharedAttributes,
  onSelectVerificationRequest,
  onGenerateVerificationQR,
  onUpdateSharedAttributes,
  onShareCredential,
  onCancelVerification,
  onVerify,
}: VerifierViewProps) {
  // Track if verification has been triggered to prevent duplicate calls
  const verificationTriggeredRef = useRef(false);

  // Auto-trigger verification after sharing - deterministic 2-second timeout
  useEffect(() => {
    if (verifierStep === "verifying" && !verificationTriggeredRef.current) {
      verificationTriggeredRef.current = true;

      const timer = setTimeout(() => {
        onVerify();
      }, 2000);

      return () => clearTimeout(timer);
    }

    // Reset the ref when we leave the verifying state
    if (verifierStep !== "verifying") {
      verificationTriggeredRef.current = false;
    }
  }, [verifierStep, onVerify]);

  const hasCredentials = walletCredentials.length > 0;

  if (!hasCredentials && verifierStep === "request") {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No credential to verify</p>
          <p className="text-sm text-muted-foreground mt-1">
            Issue and store a credential first
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {/* Header */}
      <div className="px-4 sm:px-8 py-2 border-b border-border">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-0.5">
          <span className="w-4 h-4 rounded bg-verifier flex items-center justify-center text-verifier-foreground text-[8px] font-semibold">
            3
          </span>
          <span>Service Provider</span>
        </div>
        <h2 className="text-sm font-semibold text-foreground leading-none">
          Klefki Verify
        </h2>
      </div>

      <div className="flex-1 p-3 sm:p-5 overflow-auto">
        {/* Request Builder Step */}
        {verifierStep === "request" && (
          <div className="max-w-xl mx-auto py-2">
            <ProofRequestBuilder
              verificationRequests={verificationRequests}
              selectedRequest={selectedVerificationRequest}
              onSelectRequest={onSelectVerificationRequest}
              onGenerateQR={onGenerateVerificationQR}
            />
          </div>
        )}

        {/* Awaiting Step - Show wallet consent in phone frame */}
        {verifierStep === "awaiting" && selectedVerificationRequest && walletCredentials[0] && (
          <div className="max-w-sm mx-auto">
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground">
                Waiting for wallet to scan and respond...
              </p>
            </div>
            <MobileWalletFrame credentialCount={walletCredentials.length}>
              <VerifierConsentPrompt
                credential={walletCredentials[0]}
                request={selectedVerificationRequest}
                selectedAttributes={sharedAttributes}
                onUpdateAttributes={onUpdateSharedAttributes}
                onShare={onShareCredential}
                onCancel={onCancelVerification}
              />
            </MobileWalletFrame>
          </div>
        )}

        {/* Verifying Step */}
        {verifierStep === "verifying" && (
          <div className="max-w-xl mx-auto">
            <div className="p-12 rounded-xl border border-border bg-card flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-verifier animate-spin mb-4" />
              <h3 className="text-lg font-semibold text-foreground">
                Verifying Credential
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Running cryptographic verification checks...
              </p>
            </div>
          </div>
        )}

        {/* Result Step */}
        {verifierStep === "result" && verificationResult && (
          <div className="max-w-xl mx-auto">
            <VerificationResultDisplay
              result={verificationResult}
              blockchainAnchor={blockchainAnchor}
            />
          </div>
        )}
      </div>
    </div>
  );
}
