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
import { credentialTemplates, templateToSchema } from "@/data/credentialTemplates";

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

// Convert first template to default schema
const defaultSchema = templateToSchema(credentialTemplates[0], "india");

// Generate verification requests dynamically from credential templates
export function generateVerificationRequests(): VerificationRequest[] {
  return credentialTemplates.map((template) => {
    // Get required attributes (first 2-3 required fields)
    const requiredFields = template.fields
      .filter((f) => f.required)
      .slice(0, 3)
      .map((f) => f.key);
    
    // Get optional attributes (remaining fields, max 2)
    const optionalFields = template.fields
      .filter((f) => !requiredFields.includes(f.key))
      .slice(0, 2)
      .map((f) => f.key);
    
    // Generate a verification-focused description
    const verificationPurpose = getVerificationPurpose(template.useCase, template.sector);
    
    return {
      id: `verify-${template.id}`,
      name: `${template.useCase} Verification`,
      description: verificationPurpose,
      requiredAttributes: requiredFields,
      optionalAttributes: optionalFields,
    };
  });
}

// Helper to generate verification purpose text
function getVerificationPurpose(useCase: string, sector: string): string {
  const purposeMap: Record<string, string> = {
    "public-sector": "Verify government-issued credentials for authorized access",
    "financial-services": "Verify financial credentials for regulatory compliance",
    "healthcare": "Verify healthcare credentials for patient safety",
    "education": "Verify academic credentials for qualification checks",
    "employment": "Verify employment credentials for workforce access",
    "supply-chain": "Verify supply chain credentials for logistics compliance",
    "real-estate": "Verify property credentials for ownership verification",
  };
  
  return purposeMap[sector] || `Verify ${useCase} credentials`;
}

// Keep a cached version for backward compatibility
export const verificationRequests: VerificationRequest[] = generateVerificationRequests();

// Demo data pools for generic randomization
const demoNames = ["Anika Sharma", "Raj Patel", "Maria Santos", "John Chen", "Sarah Johnson", "Mohammed Ali", "Emma Wilson", "Liam Brown", "Sofia Garcia", "James Lee"];
const demoOrganizations = ["Acme Corp", "Global Industries", "Tech Solutions", "Premier Services", "Apex Holdings", "Delta Enterprises"];
const demoNumbers = ["XXXX-XXXX", "DOC-", "REF-", "ID-", "LIC-", "CERT-"];

// Generate demo-safe random value based on field key and type
const generateRandomFieldValue = (field: { key: string; type: string; options?: string[] }): string => {
  const key = field.key.toLowerCase();
  
  // If it's a select field, pick from options
  if (field.type === "select" && field.options && field.options.length > 0) {
    return field.options[Math.floor(Math.random() * field.options.length)];
  }
  
  // Date fields
  if (field.type === "date" || key.includes("date") || key.includes("until") || key.includes("issued") || key.includes("expir")) {
    const isExpiry = key.includes("until") || key.includes("expir") || key.includes("valid");
    const isBirth = key.includes("birth");
    
    if (isBirth) {
      const year = 1980 + Math.floor(Math.random() * 25);
      const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
      const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    
    if (isExpiry) {
      const year = 2025 + Math.floor(Math.random() * 3);
      const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
      const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    
    // Default to recent past date
    const year = 2023 + Math.floor(Math.random() * 2);
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  
  // Name-like fields
  if (key.includes("name") || key.includes("holder") || key.includes("patient") || key.includes("owner") || key.includes("practitioner") || key.includes("employee") || key.includes("investor") || key.includes("account")) {
    return demoNames[Math.floor(Math.random() * demoNames.length)];
  }
  
  // ID/Number fields
  if (key.includes("id") || key.includes("number") || key.includes("license") || key.includes("permit") || key.includes("policy") || key.includes("passport") || key.includes("voter") || key.includes("beneficiary")) {
    const prefix = demoNumbers[Math.floor(Math.random() * demoNumbers.length)];
    const suffix = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${suffix}`;
  }
  
  // Business/Organization fields
  if (key.includes("business") || key.includes("employer") || key.includes("company") || key.includes("organization")) {
    return demoOrganizations[Math.floor(Math.random() * demoOrganizations.length)];
  }
  
  // Location fields
  if (key.includes("constituency") || key.includes("address") || key.includes("location")) {
    const locations = ["North District", "Central Zone", "East Region", "West Borough", "South Ward"];
    return locations[Math.floor(Math.random() * locations.length)];
  }
  
  // Medication/Dosage fields
  if (key.includes("medication") || key.includes("drug")) {
    const meds = ["Amoxicillin", "Ibuprofen", "Metformin", "Lisinopril", "Omeprazole"];
    return meds[Math.floor(Math.random() * meds.length)];
  }
  
  if (key.includes("dosage")) {
    const dosages = ["500mg", "250mg", "100mg", "50mg", "10mg"];
    return dosages[Math.floor(Math.random() * dosages.length)];
  }
  
  // Property fields
  if (key.includes("property")) {
    return `PROP-${Math.floor(10000 + Math.random() * 90000)}`;
  }
  
  // Specialty/Degree fields
  if (key.includes("specialty") || key.includes("degree") || key.includes("major")) {
    const specialties = ["Computer Science", "Medicine", "Engineering", "Business", "Law"];
    return specialties[Math.floor(Math.random() * specialties.length)];
  }
  
  // Default: generate a sensible placeholder
  return `Demo-${Math.floor(1000 + Math.random() * 9000)}`;
};

// Generic randomization for any schema
const generateRandomIdentity = (schema: CredentialSchema): Record<string, string> => {
  const result: Record<string, string> = {};
  
  schema.fields.forEach((field) => {
    result[field.key] = generateRandomFieldValue(field);
  });
  
  return result;
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
  templateSelected: false,
  currentRole: "issuer",
  selectedChain: "polygon",
  blockchainAnchoringEnabled: true,
  devModeEnabled: false,
  uiPreviewEnabled: false,
  consoleOpen: false,
  issuerConfig: initialIssuerConfig,
  selectedSchema: defaultSchema,
  selectedCountry: "", // No default - user must explicitly choose
  selectedSector: "all",
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

  const setIssuerStep = useCallback((step: "identity" | "issue") => {
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

  const selectTemplate = useCallback((schema: CredentialSchema, issuerName: string) => {
    setState((prev) => ({
      ...prev,
      selectedSchema: schema,
      issuerConfig: {
        ...prev.issuerConfig,
        issuerName: issuerName,
        // Reset keys when template changes issuer
        keysGenerated: false,
        issuerDID: null,
        publicKey: null,
      },
    }));
  }, []);

  const setCountry = useCallback((country: string) => {
    setState((prev) => ({ ...prev, selectedCountry: country }));
  }, []);

  const setSector = useCallback((sector: string) => {
    setState((prev) => ({ ...prev, selectedSector: sector }));
  }, []);

  const getRandomIdentity = useCallback(() => {
    return generateRandomIdentity(state.selectedSchema);
  }, [state.selectedSchema]);

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

  const confirmTemplateSelection = useCallback(() => {
    setState((prev) => ({
      ...prev,
      templateSelected: true,
    }));
  }, []);

  const showTemplateModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      templateSelected: false,
    }));
  }, []);

  // Skip template selection - auto-select default template
  const skipTemplateSelection = useCallback(() => {
    // Select the first template (National ID) as default
    const defaultTemplate = credentialTemplates[0];
    const schema = templateToSchema(defaultTemplate, "global");
    const issuerName = defaultTemplate.issuerAuthority.global || defaultTemplate.issuerType;
    
    setState((prev) => ({
      ...prev,
      templateSelected: true,
      selectedSchema: schema,
      issuerConfig: {
        ...prev.issuerConfig,
        issuerName: issuerName,
        keysGenerated: false,
        issuerDID: null,
        publicKey: null,
      },
    }));
  }, []);

  return {
    state,
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
    selectTemplate,
    setCountry,
    setSector,
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
    confirmTemplateSelection,
    showTemplateModal,
    skipTemplateSelection,
  };
}
