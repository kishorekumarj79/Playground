export type Role = "issuer" | "holder" | "verifier";

export type Chain = "ethereum" | "polygon" | "private" | "custom";

export type DIDMethod = "did:web" | "did:key" | "did:ethr";

export type HolderStep = "empty" | "scanning" | "consent" | "stored";

export type VerifierStep = "request" | "awaiting" | "verifying" | "result";

export interface DIDDocument {
  "@context": string[];
  id: string;
  verificationMethod: VerificationMethod[];
  authentication: string[];
  assertionMethod: string[];
  created: string;
  updated: string;
}

export interface VerificationMethod {
  id: string;
  type: string;
  controller: string;
  publicKeyMultibase: string;
}

export interface VerifiableCredential {
  "@context": string[];
  type: string[];
  issuer: string;
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: CredentialSubject;
  proof?: Proof;
}

export interface CredentialSubject {
  id: string;
  [key: string]: unknown;
}

export interface Proof {
  type: string;
  created: string;
  verificationMethod: string;
  proofPurpose: string;
  proofValue: string;
}

export interface BlockchainAnchor {
  chain: Chain;
  transactionHash: string;
  blockNumber: number;
  timestamp: string;
  status: "pending" | "confirmed" | "failed";
  credentialHash?: string;
}

export interface IssuerConfig {
  didMethod: DIDMethod;
  issuerName: string;
  issuerDID: string | null;
  publicKey: string | null;
  keysGenerated: boolean;
}

export interface CredentialSchema {
  id: string;
  name: string;
  description: string;
  version: string;
  issuerType: string;
  fields: CredentialField[];
}

export interface CredentialField {
  key: string;
  label: string;
  type: "text" | "date" | "select";
  options?: string[];
  required: boolean;
}

export interface VerificationRequest {
  id: string;
  name: string;
  description: string;
  requiredAttributes: string[];
  optionalAttributes: string[];
}

export interface PresentationRequest {
  id: string;
  verifierName: string;
  verifierDID: string;
  requestedAttributes: string[];
  purpose: string;
  timestamp: string;
}

export interface ConsoleEvent {
  timestamp: string;
  type: "DID_CREATED" | "VC_CREATED" | "SIGNATURE_ADDED" | "HASH_GENERATED" | "ANCHOR_CONFIRMED" | "VERIFICATION_COMPLETE" | "CREDENTIAL_RECEIVED" | "PRESENTATION_CREATED" | "VERIFICATION_REQUEST";
  message: string;
  data: unknown;
}

export interface PlaygroundState {
  hasStarted: boolean;
  templateSelected: boolean;
  currentRole: Role;
  selectedChain: Chain;
  blockchainAnchoringEnabled: boolean;
  devModeEnabled: boolean;
  uiPreviewEnabled: boolean;
  consoleOpen: boolean;
  issuerConfig: IssuerConfig;
  selectedSchema: CredentialSchema;
  selectedCountry: string;
  selectedSector: string;
  issuerStep: "identity" | "issue";
  holderStep: HolderStep;
  verifierStep: VerifierStep;
  issuedCredential: VerifiableCredential | null;
  walletCredentials: VerifiableCredential[];
  didDocument: DIDDocument | null;
  blockchainAnchor: BlockchainAnchor | null;
  verificationResult: VerificationResult | null;
  presentationRequest: PresentationRequest | null;
  selectedVerificationRequest: VerificationRequest | null;
  sharedAttributes: string[];
  consoleEvents: ConsoleEvent[];
}

export interface VerificationResult {
  isValid: boolean;
  checks: VerificationCheck[];
  timestamp: string;
  sharedAttributes?: Record<string, unknown>;
}

export interface VerificationCheck {
  name: string;
  status: "pass" | "fail" | "pending";
  details?: string;
}
