import { useState, useCallback } from "react";
import type {
  Role,
  Chain,
  PlaygroundState,
  VerifiableCredential,
  DIDDocument,
  BlockchainAnchor,
  ConsoleEvent,
  VerificationResult,
  IssuerConfig,
  CredentialSchema,
  VerificationRequest,
  HolderStep,
  VerifierStep,
} from "@/types/playground";

const generateDID = (method: string, identifier?: string): string => {
  const randomHex = Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
  
  switch (method) {
    case "did:web":
      return `did:web:${identifier || "klefki.id"}:issuers:${randomHex.slice(0, 16)}`;
    case "did:key":
      return `did:key:z${randomHex}`;
    case "did:ethr":
      return `did:ethr:0x${randomHex.slice(0, 40)}`;
    default:
      return `did:klefki:${randomHex}`;
  }
};

const generateTxHash = (): string => {
  const randomHex = Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
  return `0x${randomHex}`;
};

const generatePublicKey = (): string => {
  return `z${Array.from({ length: 43 }, () =>
    "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"[
      Math.floor(Math.random() * 58)
    ]
  ).join("")}`;
};

export const credentialSchemas: CredentialSchema[] = [
  {
    id: "national-id",
    name: "National ID",
    description: "MOSIP-style government identity credential",
    version: "1.0.0",
    issuerType: "Government Authority",
    fields: [
      { key: "fullName", label: "Full Name", type: "text", required: true },
      { key: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
      { key: "nationality", label: "Nationality", type: "select", required: true, options: ["India", "United States", "United Kingdom", "Germany", "France", "Singapore"] },
      { key: "idNumber", label: "ID Number", type: "text", required: true },
      { key: "gender", label: "Gender", type: "select", required: false, options: ["Male", "Female", "Other"] },
    ],
  },
  {
    id: "university-degree",
    name: "University Degree",
    description: "Academic credential for higher education",
    version: "1.0.0",
    issuerType: "Educational Institution",
    fields: [
      { key: "fullName", label: "Graduate Name", type: "text", required: true },
      { key: "degree", label: "Degree Type", type: "select", required: true, options: ["Bachelor of Science", "Bachelor of Arts", "Master of Science", "Master of Arts", "Doctor of Philosophy"] },
      { key: "major", label: "Major / Field of Study", type: "text", required: true },
      { key: "graduationDate", label: "Graduation Date", type: "date", required: true },
      { key: "honors", label: "Honors", type: "select", required: false, options: ["Summa Cum Laude", "Magna Cum Laude", "Cum Laude", "None"] },
    ],
  },
  {
    id: "vaccination-certificate",
    name: "Vaccination Certificate",
    description: "Health immunization credential",
    version: "1.0.0",
    issuerType: "Health Authority",
    fields: [
      { key: "fullName", label: "Patient Name", type: "text", required: true },
      { key: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
      { key: "vaccineType", label: "Vaccine Type", type: "select", required: true, options: ["COVID-19 (Pfizer)", "COVID-19 (Moderna)", "COVID-19 (AstraZeneca)", "Influenza", "Hepatitis B"] },
      { key: "doseNumber", label: "Dose Number", type: "select", required: true, options: ["1", "2", "3", "Booster"] },
      { key: "administrationDate", label: "Administration Date", type: "date", required: true },
    ],
  },
];

export const verificationRequests: VerificationRequest[] = [
  {
    id: "age-verification",
    name: "Proof of Age (18+)",
    description: "Verify the holder is at least 18 years old",
    requiredAttributes: ["dateOfBirth"],
    optionalAttributes: ["fullName"],
  },
  {
    id: "identity-verification",
    name: "Valid National ID",
    description: "Verify identity with government-issued credential",
    requiredAttributes: ["fullName", "idNumber", "nationality"],
    optionalAttributes: ["dateOfBirth", "gender"],
  },
  {
    id: "academic-verification",
    name: "Academic Credentials",
    description: "Verify educational qualifications",
    requiredAttributes: ["fullName", "degree", "major"],
    optionalAttributes: ["graduationDate", "honors"],
  },
  {
    id: "vaccination-status",
    name: "Vaccination Status",
    description: "Verify immunization records",
    requiredAttributes: ["fullName", "vaccineType", "doseNumber"],
    optionalAttributes: ["administrationDate"],
  },
];

const randomNames = ["Anika Sharma", "Raj Patel", "Maria Santos", "John Chen", "Sarah Johnson", "Mohammed Ali"];
const randomMajors = ["Computer Science", "Economics", "Physics", "Biology", "Engineering"];

const generateRandomIdentity = (schemaId: string): Record<string, string> => {
  const name = randomNames[Math.floor(Math.random() * randomNames.length)];
  const birthYear = 1980 + Math.floor(Math.random() * 25);
  const birthMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const birthDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");

  switch (schemaId) {
    case "national-id":
      return {
        fullName: name,
        dateOfBirth: `${birthYear}-${birthMonth}-${birthDay}`,
        nationality: "India",
        idNumber: `XXXX-XXXX-${Math.floor(1000 + Math.random() * 9000)}`,
        gender: Math.random() > 0.5 ? "Male" : "Female",
      };
    case "university-degree":
      return {
        fullName: name,
        degree: "Bachelor of Science",
        major: randomMajors[Math.floor(Math.random() * randomMajors.length)],
        graduationDate: `${2020 + Math.floor(Math.random() * 5)}-06-15`,
        honors: Math.random() > 0.6 ? "Magna Cum Laude" : "None",
      };
    case "vaccination-certificate":
      return {
        fullName: name,
        dateOfBirth: `${birthYear}-${birthMonth}-${birthDay}`,
        vaccineType: "COVID-19 (Pfizer)",
        doseNumber: "2",
        administrationDate: `2024-${birthMonth}-${birthDay}`,
      };
    default:
      return { fullName: name };
  }
};

const initialIssuerConfig: IssuerConfig = {
  didMethod: "did:web",
  issuerName: "Government of India",
  issuerDID: null,
  publicKey: null,
  keysGenerated: false,
};

const initialState: PlaygroundState = {
  hasStarted: false,
  currentRole: "issuer",
  selectedChain: "polygon",
  blockchainAnchoringEnabled: true,
  devModeEnabled: false,
  uiPreviewEnabled: false,
  consoleOpen: false,
  issuerConfig: initialIssuerConfig,
  selectedSchema: credentialSchemas[0],
  customSchemas: [],
  issuerStep: "identity",
  holderStep: "empty",
  verifierStep: "request",
  issuedCredential: null,
  walletCredentials: [],
  didDocument: null,
  blockchainAnchor: null,
  verificationResult: null,
  presentationRequest: null,
  selectedVerificationRequest: null,
  sharedAttributes: [],
  consoleEvents: [],
};

export function usePlayground() {
  const [state, setState] = useState<PlaygroundState>(initialState);

  const startPlayground = useCallback((enableDevMode: boolean) => {
    setState((prev) => ({
      ...prev,
      hasStarted: true,
      devModeEnabled: enableDevMode,
      consoleOpen: enableDevMode,
    }));
  }, []);

  const setRole = useCallback((role: Role) => {
    setState((prev) => ({ ...prev, currentRole: role }));
  }, []);

  const setChain = useCallback((chain: Chain) => {
    setState((prev) => ({ ...prev, selectedChain: chain }));
  }, []);

  const toggleDevMode = useCallback(() => {
    setState((prev) => ({ ...prev, devModeEnabled: !prev.devModeEnabled }));
  }, []);

  const toggleConsole = useCallback(() => {
    setState((prev) => ({ ...prev, consoleOpen: !prev.consoleOpen }));
  }, []);

  const toggleUiPreview = useCallback(() => {
    setState((prev) => ({ ...prev, uiPreviewEnabled: !prev.uiPreviewEnabled }));
  }, []);

  const toggleBlockchainAnchoring = useCallback(() => {
    setState((prev) => ({ ...prev, blockchainAnchoringEnabled: !prev.blockchainAnchoringEnabled }));
  }, []);

  const setIssuerStep = useCallback((step: "identity" | "schema" | "issue") => {
    setState((prev) => ({ ...prev, issuerStep: step }));
  }, []);

  const setHolderStep = useCallback((step: HolderStep) => {
    setState((prev) => ({ ...prev, holderStep: step }));
  }, []);

  const setVerifierStep = useCallback((step: VerifierStep) => {
    setState((prev) => ({ ...prev, verifierStep: step }));
  }, []);

  const updateIssuerConfig = useCallback((config: Partial<IssuerConfig>) => {
    setState((prev) => ({
      ...prev,
      issuerConfig: { ...prev.issuerConfig, ...config },
    }));
  }, []);

  const generateIssuerKeys = useCallback(() => {
    const did = generateDID(state.issuerConfig.didMethod, state.issuerConfig.issuerName.toLowerCase().replace(/\s+/g, "-"));
    const publicKey = generatePublicKey();

    const issuerDIDDoc: DIDDocument = {
      "@context": [
        "https://www.w3.org/ns/did/v1",
        "https://w3id.org/security/suites/ed25519-2020/v1",
      ],
      id: did,
      verificationMethod: [
        {
          id: `${did}#key-1`,
          type: "Ed25519VerificationKey2020",
          controller: did,
          publicKeyMultibase: publicKey,
        },
      ],
      authentication: [`${did}#key-1`],
      assertionMethod: [`${did}#key-1`],
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };

    const newEvent = {
      timestamp: new Date().toISOString(),
      type: "DID_CREATED" as const,
      message: `Issuer DID created: ${did.slice(0, 40)}...`,
      data: issuerDIDDoc,
    };

    setState((prev) => ({
      ...prev,
      issuerConfig: {
        ...prev.issuerConfig,
        issuerDID: did,
        publicKey: publicKey,
        keysGenerated: true,
      },
      didDocument: issuerDIDDoc,
      consoleEvents: [...prev.consoleEvents, newEvent],
    }));
  }, [state.issuerConfig.didMethod, state.issuerConfig.issuerName]);

  const selectSchema = useCallback((schemaId: string) => {
    // First check built-in schemas, then custom schemas
    const schema = credentialSchemas.find((s) => s.id === schemaId) 
      || state.customSchemas.find((s) => s.id === schemaId);
    if (schema) {
      setState((prev) => ({ ...prev, selectedSchema: schema }));
    }
  }, [state.customSchemas]);

  const addCustomSchema = useCallback((schema: CredentialSchema) => {
    setState((prev) => ({
      ...prev,
      customSchemas: [...prev.customSchemas, schema],
      selectedSchema: schema,
    }));
  }, []);

  const getRandomIdentity = useCallback(() => {
    return generateRandomIdentity(state.selectedSchema.id);
  }, [state.selectedSchema.id]);

  const issueCredential = useCallback(
    (subjectData: Record<string, unknown>) => {
      const holderDID = generateDID("did:key");
      const issuerDID = state.issuerConfig.issuerDID || generateDID(state.issuerConfig.didMethod);

      const credential: VerifiableCredential = {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://w3id.org/vc/status-list/2021/v1",
        ],
        type: ["VerifiableCredential", state.selectedSchema.name.replace(/\s+/g, "")],
        issuer: issuerDID,
        issuanceDate: new Date().toISOString(),
        expirationDate: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000
        ).toISOString(),
        credentialSubject: {
          id: holderDID,
          schemaId: state.selectedSchema.id,
          credentialType: state.selectedSchema.id,
          ...subjectData,
        },
        proof: {
          type: "Ed25519Signature2020",
          created: new Date().toISOString(),
          verificationMethod: `${issuerDID}#key-1`,
          proofPurpose: "assertionMethod",
          proofValue: `z${Array.from({ length: 86 }, () =>
            "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"[
              Math.floor(Math.random() * 58)
            ]
          ).join("")}`,
        },
      };

      const holderDIDDoc: DIDDocument = {
        "@context": [
          "https://www.w3.org/ns/did/v1",
          "https://w3id.org/security/suites/ed25519-2020/v1",
        ],
        id: holderDID,
        verificationMethod: [
          {
            id: `${holderDID}#key-1`,
            type: "Ed25519VerificationKey2020",
            controller: holderDID,
            publicKeyMultibase: generatePublicKey(),
          },
        ],
        authentication: [`${holderDID}#key-1`],
        assertionMethod: [`${holderDID}#key-1`],
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
      };

      // Build events based on anchoring mode
      const events: ConsoleEvent[] = [
        {
          timestamp: new Date().toISOString(),
          type: "VC_CREATED" as const,
          message: "Verifiable Credential created",
          data: credential,
        },
        {
          timestamp: new Date(Date.now() + 100).toISOString(),
          type: "SIGNATURE_ADDED" as const,
          message: "Ed25519 signature generated and attached",
          data: { proofType: credential.proof?.type, proofValue: credential.proof?.proofValue?.slice(0, 32) + "..." },
        },
      ];

      let anchor: BlockchainAnchor | null = null;

      if (state.blockchainAnchoringEnabled) {
        anchor = {
          chain: state.selectedChain,
          transactionHash: generateTxHash(),
          blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
          timestamp: new Date().toISOString(),
          status: "confirmed",
          credentialHash: `0x${Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join("")}`,
        };

        events.push(
          {
            timestamp: new Date(Date.now() + 200).toISOString(),
            type: "HASH_GENERATED" as const,
            message: `Credential hash: ${anchor.credentialHash?.slice(0, 20)}...`,
            data: { hash: anchor.credentialHash },
          },
          {
            timestamp: new Date(Date.now() + 300).toISOString(),
            type: "ANCHOR_CONFIRMED" as const,
            message: `Anchored to ${state.selectedChain} at block ${anchor.blockNumber}`,
            data: anchor,
          }
        );
      }

      setState((prev) => ({
        ...prev,
        issuedCredential: credential,
        didDocument: holderDIDDoc,
        blockchainAnchor: anchor,
        currentRole: "holder",
        holderStep: "empty",
        consoleEvents: [...prev.consoleEvents, ...events],
      }));
    },
    [state.selectedChain, state.issuerConfig, state.selectedSchema, state.blockchainAnchoringEnabled]
  );

  // Holder actions
  const scanCredential = useCallback(() => {
    setState((prev) => ({ ...prev, holderStep: "scanning" }));
  }, []);

  const showConsentModal = useCallback(() => {
    setState((prev) => ({ ...prev, holderStep: "consent" }));
  }, []);

  const acceptCredential = useCallback(() => {
    const event = {
      timestamp: new Date().toISOString(),
      type: "CREDENTIAL_RECEIVED" as const,
      message: "Credential added to wallet",
      data: state.issuedCredential,
    };

    setState((prev) => ({
      ...prev,
      holderStep: "stored",
      walletCredentials: prev.issuedCredential 
        ? [...prev.walletCredentials, prev.issuedCredential]
        : prev.walletCredentials,
      consoleEvents: [...prev.consoleEvents, event],
    }));
  }, [state.issuedCredential]);

  const rejectCredential = useCallback(() => {
    setState((prev) => ({
      ...prev,
      holderStep: "empty",
      issuedCredential: null,
    }));
  }, []);

  const presentToVerifier = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentRole: "verifier",
      verifierStep: "request",
    }));
  }, []);

  // Verifier actions
  const selectVerificationRequest = useCallback((request: VerificationRequest) => {
    setState((prev) => ({
      ...prev,
      selectedVerificationRequest: request,
      sharedAttributes: [...request.requiredAttributes],
    }));
  }, []);

  const generateVerificationQR = useCallback(() => {
    if (!state.selectedVerificationRequest) return;

    const event = {
      timestamp: new Date().toISOString(),
      type: "VERIFICATION_REQUEST" as const,
      message: `Verification request generated: ${state.selectedVerificationRequest.name}`,
      data: {
        requestId: state.selectedVerificationRequest.id,
        requiredAttributes: state.selectedVerificationRequest.requiredAttributes,
      },
    };

    setState((prev) => ({
      ...prev,
      verifierStep: "awaiting",
      consoleEvents: [...prev.consoleEvents, event],
    }));
  }, [state.selectedVerificationRequest]);

  const updateSharedAttributes = useCallback((attrs: string[]) => {
    setState((prev) => ({ ...prev, sharedAttributes: attrs }));
  }, []);

  const shareCredentialWithVerifier = useCallback(() => {
    setState((prev) => ({ ...prev, verifierStep: "verifying" }));
  }, []);

  const cancelVerification = useCallback(() => {
    setState((prev) => ({
      ...prev,
      verifierStep: "request",
      selectedVerificationRequest: null,
      sharedAttributes: [],
    }));
  }, []);

  const verifyCredential = useCallback(() => {
    // Only require wallet credentials (not issuedCredential which may be null after storage)
    if (!state.walletCredentials.length) return;

    const credential = state.walletCredentials[0];
    const sharedData: Record<string, unknown> = {};
    
    state.sharedAttributes.forEach((attr) => {
      if (credential.credentialSubject[attr] !== undefined) {
        sharedData[attr] = credential.credentialSubject[attr];
      }
    });

    // Build verification checks based on anchoring mode
    const checks = [
      {
        name: "Signature Verification",
        status: "pass" as const,
        details: "Ed25519 signature verified successfully",
      },
      {
        name: "Credential Schema",
        status: "pass" as const,
        details: "Credential conforms to W3C VC Data Model",
      },
      {
        name: "Issuer DID Resolution",
        status: "pass" as const,
        details: "Issuer DID resolved and trusted",
      },
      {
        name: "Expiration Check",
        status: "pass" as const,
        details: "Credential is within validity period",
      },
      {
        name: "Revocation Status",
        status: "pass" as const,
        details: "Credential has not been revoked",
      },
    ];

    // Only add blockchain anchor check if anchoring is enabled and anchor exists
    if (state.blockchainAnchor) {
      checks.push({
        name: "Blockchain Anchor",
        status: "pass" as const,
        details: `Verified on ${state.selectedChain} at block ${state.blockchainAnchor.blockNumber}`,
      });
    }

    const result: VerificationResult = {
      isValid: true,
      checks,
      timestamp: new Date().toISOString(),
      sharedAttributes: sharedData,
    };

    const event = {
      timestamp: new Date().toISOString(),
      type: "VERIFICATION_COMPLETE" as const,
      message: state.blockchainAnchor 
        ? "All verification checks passed (with blockchain anchor)" 
        : "All verification checks passed (standard DID & VC)",
      data: result,
    };

    setState((prev) => ({
      ...prev,
      verificationResult: result,
      verifierStep: "result",
      consoleEvents: [...prev.consoleEvents, event],
    }));
  }, [state.walletCredentials, state.sharedAttributes, state.selectedChain, state.blockchainAnchor]);

  const resetPlayground = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    state,
    credentialSchemas,
    verificationRequests,
    startPlayground,
    setRole,
    setChain,
    toggleDevMode,
    toggleUiPreview,
    toggleBlockchainAnchoring,
    toggleConsole,
    setIssuerStep,
    setHolderStep,
    setVerifierStep,
    updateIssuerConfig,
    generateIssuerKeys,
    selectSchema,
    addCustomSchema,
    getRandomIdentity,
    issueCredential,
    scanCredential,
    showConsentModal,
    acceptCredential,
    rejectCredential,
    presentToVerifier,
    selectVerificationRequest,
    generateVerificationQR,
    updateSharedAttributes,
    shareCredentialWithVerifier,
    cancelVerification,
    verifyCredential,
    resetPlayground,
  };
}
