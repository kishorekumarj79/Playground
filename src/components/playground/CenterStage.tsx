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
  HolderInfo,
} from "@/types/playground";

interface CenterStageProps {
  currentRole: Role;
  selectedChain: Chain;
  blockchainAnchoringEnabled: boolean;
  uiPreviewEnabled: boolean;
  devModeEnabled: boolean;
  issuerConfig: IssuerConfig;
  selectedSchema: CredentialSchema;
  issuerStep: "national-id" | "otp" | "holder-info" | "template-selection" | "issue";
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
  onSetIssuerStep: (step: "national-id" | "otp" | "holder-info" | "template-selection" | "issue") => void;
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
  onSetHolderInfo: (info: HolderInfo) => void;
  holderInfo: HolderInfo | null;
  onSelectTemplate: (schema: CredentialSchema, issuerName: string) => void;
  selectedCountry: string;
  selectedSector: string;
  onCountryChange: (country: string) => void;
  onSectorChange: (sector: string) => void;
}

export function CenterStage({
  currentRole,
  selectedChain,
  blockchainAnchoringEnabled,
  uiPreviewEnabled,
  devModeEnabled,
  issuerConfig,
  selectedSchema,
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
  onSetHolderInfo,
  holderInfo,
  onSelectTemplate,
  selectedCountry,
  selectedSector,
  onCountryChange,
  onSectorChange,
}: CenterStageProps) {
  return (
    <main className="flex-1 bg-background flex flex-col overflow-hidden">
      {currentRole === "issuer" && (
        <IssuerView
          selectedChain={selectedChain}
          blockchainAnchoringEnabled={blockchainAnchoringEnabled}
          uiPreviewEnabled={uiPreviewEnabled}
          devModeEnabled={devModeEnabled}
          issuerConfig={issuerConfig}
          selectedSchema={selectedSchema}
          issuerStep={issuerStep}
          issuedCredential={credential}
          onUpdateIssuerConfig={onUpdateIssuerConfig}
          onGenerateKeys={onGenerateKeys}
          onSetStep={onSetIssuerStep}
          onGetRandomIdentity={onGetRandomIdentity}
          onIssue={onIssueCredential}
          holderInfo={holderInfo}
          onSetHolderInfo={onSetHolderInfo}
          onSelectTemplate={onSelectTemplate}
          selectedCountry={selectedCountry}
          selectedSector={selectedSector}
          onCountryChange={onCountryChange}
          onSectorChange={onSectorChange}
          holderStep={holderStep}
        />
      )}

      {currentRole === "holder" && (
        <HolderView
          holderStep={holderStep}
          pendingCredential={credential}
          walletCredentials={walletCredentials}
          blockchainAnchor={blockchainAnchor}
          devModeEnabled={devModeEnabled}
          onScanCredential={onScanCredential}
          onScanComplete={onScanComplete}
          onAcceptCredential={onAcceptCredential}
          onRejectCredential={onRejectCredential}
          onPresentToVerifier={onPresentToVerifier}
          selectedVerificationRequest={selectedVerificationRequest}
          onShareCredential={onShareCredential}
          onCancelVerification={onCancelVerification}
        />
      )}

      {currentRole === "verifier" && (
        <VerifierView
          verifierStep={verifierStep}
          credential={credential}
          walletCredentials={walletCredentials}
          verificationResult={verificationResult}
          blockchainAnchor={blockchainAnchor}
          devModeEnabled={devModeEnabled}
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
