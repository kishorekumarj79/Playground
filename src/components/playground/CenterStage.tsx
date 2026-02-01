import { IssuerView } from "./IssuerView";
import { HolderView } from "./HolderView";
import { VerifierView } from "./VerifierView";
import type {
  Role,
  Chain,
  VerifiableCredential,
  BlockchainAnchor,
  VerificationResult,
  IssuerConfig,
  CredentialSchema,
  VerificationRequest,
  HolderStep,
  VerifierStep,
} from "@/types/playground";

interface CenterStageProps {
  currentRole: Role;
  selectedChain: Chain;
  blockchainAnchoringEnabled: boolean;
  uiPreviewEnabled: boolean;
  issuerConfig: IssuerConfig;
  selectedSchema: CredentialSchema;
  availableSchemas: CredentialSchema[];
  issuerStep: "identity" | "schema" | "issue";
  holderStep: HolderStep;
  verifierStep: VerifierStep;
  credential: VerifiableCredential | null;
  walletCredentials: VerifiableCredential[];
  blockchainAnchor: BlockchainAnchor | null;
  verificationResult: VerificationResult | null;
  verificationRequests: VerificationRequest[];
  selectedVerificationRequest: VerificationRequest | null;
  sharedAttributes: string[];
  onUpdateIssuerConfig: (config: Partial<IssuerConfig>) => void;
  onGenerateKeys: () => void;
  onSelectSchema: (schemaId: string) => void;
  onAddCustomSchema: (schema: CredentialSchema) => void;
  onSetIssuerStep: (step: "identity" | "schema" | "issue") => void;
  onGetRandomIdentity: () => Record<string, string>;
  onIssueCredential: (data: Record<string, unknown>) => void;
  onScanCredential: () => void;
  onScanComplete: () => void;
  onAcceptCredential: () => void;
  onRejectCredential: () => void;
  onPresentToVerifier: () => void;
  onSelectVerificationRequest: (request: VerificationRequest) => void;
  onGenerateVerificationQR: () => void;
  onUpdateSharedAttributes: (attrs: string[]) => void;
  onShareCredential: () => void;
  onCancelVerification: () => void;
  onVerify: () => void;
}

export function CenterStage({
  currentRole,
  selectedChain,
  blockchainAnchoringEnabled,
  uiPreviewEnabled,
  issuerConfig,
  selectedSchema,
  availableSchemas,
  issuerStep,
  holderStep,
  verifierStep,
  credential,
  walletCredentials,
  blockchainAnchor,
  verificationResult,
  verificationRequests,
  selectedVerificationRequest,
  sharedAttributes,
  onUpdateIssuerConfig,
  onGenerateKeys,
  onSelectSchema,
  onAddCustomSchema,
  onSetIssuerStep,
  onGetRandomIdentity,
  onIssueCredential,
  onScanCredential,
  onScanComplete,
  onAcceptCredential,
  onRejectCredential,
  onPresentToVerifier,
  onSelectVerificationRequest,
  onGenerateVerificationQR,
  onUpdateSharedAttributes,
  onShareCredential,
  onCancelVerification,
  onVerify,
}: CenterStageProps) {
  return (
    <main className="flex-1 bg-background flex flex-col overflow-hidden">
      {currentRole === "issuer" && (
        <IssuerView
          selectedChain={selectedChain}
          blockchainAnchoringEnabled={blockchainAnchoringEnabled}
          uiPreviewEnabled={uiPreviewEnabled}
          issuerConfig={issuerConfig}
          selectedSchema={selectedSchema}
          availableSchemas={availableSchemas}
          issuerStep={issuerStep}
          issuedCredential={credential}
          onUpdateIssuerConfig={onUpdateIssuerConfig}
          onGenerateKeys={onGenerateKeys}
          onSelectSchema={onSelectSchema}
          onAddCustomSchema={onAddCustomSchema}
          onSetStep={onSetIssuerStep}
          onGetRandomIdentity={onGetRandomIdentity}
          onIssue={onIssueCredential}
        />
      )}

      {currentRole === "holder" && (
        <HolderView
          holderStep={holderStep}
          pendingCredential={credential}
          walletCredentials={walletCredentials}
          blockchainAnchor={blockchainAnchor}
          onScanCredential={onScanCredential}
          onScanComplete={onScanComplete}
          onAcceptCredential={onAcceptCredential}
          onRejectCredential={onRejectCredential}
          onPresentToVerifier={onPresentToVerifier}
        />
      )}

      {currentRole === "verifier" && (
        <VerifierView
          verifierStep={verifierStep}
          credential={credential}
          walletCredentials={walletCredentials}
          verificationResult={verificationResult}
          blockchainAnchor={blockchainAnchor}
          verificationRequests={verificationRequests}
          selectedVerificationRequest={selectedVerificationRequest}
          sharedAttributes={sharedAttributes}
          onSelectVerificationRequest={onSelectVerificationRequest}
          onGenerateVerificationQR={onGenerateVerificationQR}
          onUpdateSharedAttributes={onUpdateSharedAttributes}
          onShareCredential={onShareCredential}
          onCancelVerification={onCancelVerification}
          onVerify={onVerify}
        />
      )}
    </main>
  );
}
