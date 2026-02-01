import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Key,
  FileJson,
  ArrowRight,
  ArrowLeft,
  Check,
  Shuffle,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { LiveCredentialPreview } from "./preview/LiveCredentialPreview";
import { CreateSchemaModal } from "./issuer/CreateSchemaModal";
import type {
  Chain,
  IssuerConfig,
  CredentialSchema,
  DIDMethod,
  VerifiableCredential,
} from "@/types/playground";

interface IssuerViewProps {
  selectedChain: Chain;
  blockchainAnchoringEnabled: boolean;
  uiPreviewEnabled: boolean;
  issuerConfig: IssuerConfig;
  selectedSchema: CredentialSchema;
  availableSchemas: CredentialSchema[];
  issuerStep: "identity" | "schema" | "issue";
  issuedCredential: VerifiableCredential | null;
  onUpdateIssuerConfig: (config: Partial<IssuerConfig>) => void;
  onGenerateKeys: () => void;
  onSelectSchema: (schemaId: string) => void;
  onAddCustomSchema: (schema: CredentialSchema) => void;
  onSetStep: (step: "identity" | "schema" | "issue") => void;
  onGetRandomIdentity: () => Record<string, string>;
  onIssue: (data: Record<string, unknown>) => void;
}

const didMethods: { value: DIDMethod; label: string; description: string }[] = [
  { value: "did:web", label: "did:web", description: "Domain-based, verifiable via HTTPS" },
  { value: "did:key", label: "did:key", description: "Self-resolving, no registration needed" },
  { value: "did:ethr", label: "did:ethr", description: "Ethereum blockchain-based" },
];

export function IssuerView({
  selectedChain,
  blockchainAnchoringEnabled,
  uiPreviewEnabled,
  issuerConfig,
  selectedSchema,
  availableSchemas,
  issuerStep,
  issuedCredential,
  onUpdateIssuerConfig,
  onGenerateKeys,
  onSelectSchema,
  onAddCustomSchema,
  onSetStep,
  onGetRandomIdentity,
  onIssue,
}: IssuerViewProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isIssuing, setIsIssuing] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showCreateSchemaModal, setShowCreateSchemaModal] = useState(false);

  useEffect(() => {
    const initialData: Record<string, string> = {};
    selectedSchema.fields.forEach((field) => {
      initialData[field.key] = "";
    });
    setFormData(initialData);
    setShowQR(false);
  }, [selectedSchema]);

  const handleRandomize = () => {
    const randomData = onGetRandomIdentity();
    setFormData(randomData);
  };

  const handleIssue = async () => {
    setIsIssuing(true);
    await new Promise((resolve) => setTimeout(resolve, 1800));
    onIssue(formData);
    setShowQR(true);
    setIsIssuing(false);
  };

  const canProceedFromIdentity = issuerConfig.keysGenerated;
  const canProceedFromSchema = selectedSchema !== null;
  const canIssue = Object.entries(formData).every(
    ([key, value]) =>
      !selectedSchema.fields.find((f) => f.key === key)?.required || value.trim() !== ""
  );

  // Show credential preview panel when toggle is ON
  const showPreviewPanel = uiPreviewEnabled;
  // Preview should show as soon as we're on the issue step (or have a schema)
  const showSchemaPreview = issuerStep === "schema" || issuerStep === "issue";

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-border shrink-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span className="w-5 h-5 rounded bg-issuer flex items-center justify-center text-issuer-foreground text-[10px] font-semibold">
            1
          </span>
          <span>Authority Portal — Klefki Studio</span>
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">
          Issue Verifiable Credential
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {blockchainAnchoringEnabled ? (
            <>
              Create a W3C-compliant credential anchored to{" "}
              <span className="font-medium capitalize">{selectedChain}</span>
            </>
          ) : (
            "Create a W3C-compliant credential using standard DID & VC"
          )}
        </p>
      </div>

      {/* Step Indicator */}
      <div className="px-4 sm:px-8 py-3 sm:py-4 border-b border-border bg-muted/30 shrink-0 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {["identity", "schema", "issue"].map((step, index) => {
            const isActive = issuerStep === step;
            const isCompleted =
              (step === "identity" && issuerConfig.keysGenerated && issuerStep !== "identity") ||
              (step === "schema" && issuerStep === "issue");

            return (
              <div key={step} className="flex items-center gap-2">
                <button
                  onClick={() => onSetStep(step as "identity" | "schema" | "issue")}
                  disabled={step === "schema" && !canProceedFromIdentity}
                  className={cn(
                    "flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                    isActive && "bg-primary text-primary-foreground",
                    isCompleted && !isActive && "bg-success/10 text-success",
                    !isActive && !isCompleted && "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {isCompleted && !isActive ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px]">
                      {index + 1}
                    </span>
                  )}
                  <span className="capitalize hidden sm:inline">{step === "identity" ? "Identity Setup" : step === "schema" ? "Schema" : "Issue"}</span>
                  <span className="capitalize sm:hidden">{step === "identity" ? "Setup" : step === "schema" ? "Schema" : "Issue"}</span>
                </button>
                {index < 2 && (
                  <ChevronRight className="w-4 h-4 text-border" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 sm:p-8">
        <div className={cn(
          "flex flex-col lg:flex-row gap-6 lg:gap-8",
          showPreviewPanel ? "max-w-4xl" : "max-w-xl"
        )}>
          {/* Main Form Column */}
          <div className={cn(
            "shrink-0 w-full",
            showPreviewPanel ? "lg:w-[400px]" : "max-w-xl"
          )}>
          {/* Step 1: Identity Setup */}
          {issuerStep === "identity" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Issuer Identity Setup
                </h3>
                <p className="text-xs text-muted-foreground">
                  Configure your DID method and generate cryptographic keys
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    DID Method
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {didMethods.map((method) => (
                      <button
                        key={method.value}
                        onClick={() =>
                          onUpdateIssuerConfig({ didMethod: method.value, keysGenerated: false, issuerDID: null })
                        }
                        className={cn(
                          "p-3 rounded-lg border text-left transition-all",
                          issuerConfig.didMethod === method.value
                            ? "border-primary bg-accent ring-1 ring-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <p className="text-sm font-mono font-medium text-foreground">
                          {method.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {method.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issuerName" className="text-sm">
                    Issuer Name
                  </Label>
                  <Input
                    id="issuerName"
                    value={issuerConfig.issuerName}
                    onChange={(e) =>
                      onUpdateIssuerConfig({ issuerName: e.target.value, keysGenerated: false, issuerDID: null })
                    }
                    placeholder="e.g., Government of India"
                    className="h-10"
                  />
                </div>

                <Button
                  onClick={onGenerateKeys}
                  variant={issuerConfig.keysGenerated ? "outline" : "default"}
                  className="w-full h-11 gap-2"
                >
                  <Key className="w-4 h-4" />
                  {issuerConfig.keysGenerated ? "Regenerate Keys" : "Generate Keys"}
                </Button>

                {issuerConfig.keysGenerated && (
                  <div className="p-4 rounded-lg bg-success/5 border border-success/20 space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success" />
                      <span className="text-sm font-medium text-success">
                        Keys Generated
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        Issuer DID
                      </p>
                      <p className="text-xs font-mono text-foreground break-all">
                        {issuerConfig.issuerDID}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={() => onSetStep("schema")}
                disabled={!canProceedFromIdentity}
                className="w-full h-11 gap-2"
              >
                Continue to Schema Selection
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Step 2: Schema Selection */}
          {issuerStep === "schema" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Credential Schema Selection
                </h3>
                <p className="text-xs text-muted-foreground">
                  Choose the type of credential to issue
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Schema Type
                  </Label>
                  <Select
                    value={selectedSchema.id}
                    onValueChange={(value) => {
                      if (value === "__create_new__") {
                        setShowCreateSchemaModal(true);
                      } else {
                        onSelectSchema(value);
                      }
                    }}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSchemas.map((schema) => (
                        <SelectItem key={schema.id} value={schema.id}>
                          <div className="flex items-center gap-2">
                            <span>{schema.name}</span>
                            <span className="text-xs text-muted-foreground">
                              — {schema.issuerType}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                      <SelectItem value="__create_new__">
                        <div className="flex items-center gap-2 text-primary">
                          <Plus className="w-3 h-3" />
                          <span>Create New Schema</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Schema Preview */}
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {selectedSchema.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedSchema.description}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      v{selectedSchema.version}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Schema Fields
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSchema.fields.map((field) => (
                        <span
                          key={field.key}
                          className={cn(
                            "text-[10px] px-2 py-0.5 rounded",
                            field.required
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {field.label}
                          {field.required && " *"}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => onSetStep("identity")}
                  className="h-11 gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button
                  onClick={() => onSetStep("issue")}
                  disabled={!canProceedFromSchema}
                  className="flex-1 h-11 gap-2"
                >
                  Continue to Issuance
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Issue Credential */}
          {issuerStep === "issue" && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    Issue {selectedSchema.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Enter subject information or randomize for demo
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRandomize}
                  className="h-8 gap-1.5 text-xs"
                >
                  <Shuffle className="w-3 h-3" />
                  Randomize
                </Button>
              </div>

              {/* Dynamic Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedSchema.fields.map((field) => (
                  <div
                    key={field.key}
                    className={cn(
                      "space-y-2",
                      field.key === "fullName" && "sm:col-span-2"
                    )}
                  >
                    <Label htmlFor={field.key} className="text-sm">
                      {field.label}
                      {field.required && (
                        <span className="text-destructive ml-0.5">*</span>
                      )}
                    </Label>
                    {field.type === "select" ? (
                      <Select
                        value={formData[field.key] || ""}
                        onValueChange={(value) =>
                          setFormData({ ...formData, [field.key]: value })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder={`Select ${field.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={field.key}
                        type={field.type}
                        value={formData[field.key] || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, [field.key]: e.target.value })
                        }
                        className={cn("h-10", field.key.includes("Number") && "font-mono")}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Chain Selector Pill - show based on anchoring mode */}
              {blockchainAnchoringEnabled ? (
                <div className="p-4 rounded-lg bg-accent/50 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-xs font-medium text-foreground capitalize">
                        {selectedChain}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Chain-agnostic anchoring enabled
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="text-xs text-muted-foreground">
                    This credential will be issued without blockchain anchoring
                  </p>
                </div>
              )}

              {/* QR Code Display */}
              {showQR && issuedCredential && (
                <div className="p-6 rounded-xl border border-success/30 bg-success/5 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 text-success">
                    <Check className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      Credential Issued Successfully
                    </span>
                  </div>
                  <div className="p-4 bg-white rounded-xl shadow-sm">
                    <QRCodeSVG
                      value={JSON.stringify({ type: "vc", schema: selectedSchema.id, issued: new Date().toISOString() })}
                      size={160}
                      level="M"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Scan with holder wallet to claim credential
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => onSetStep("schema")}
                  className="h-11 gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button
                  onClick={handleIssue}
                  disabled={isIssuing || !canIssue || showQR}
                  className="flex-1 h-11 gap-2"
                >
                  {isIssuing ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Issuing Credential...
                    </span>
                  ) : showQR ? (
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Issued
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <FileJson className="w-4 h-4" />
                      Issue Credential
                    </span>
                  )}
                </Button>
              </div>
            </div>
          )}
          </div>

          {/* Credential Preview Column */}
          {showPreviewPanel && (
            <div className="flex-1 min-w-[280px] max-w-[340px]">
              <div className="sticky top-0">
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-foreground">
                    Credential UI Preview
                  </h4>
                </div>
                {showSchemaPreview ? (
                  <LiveCredentialPreview
                    schema={selectedSchema}
                    formData={formData}
                    issuerName={issuerConfig.issuerName || "Government Authority"}
                    issuedCredential={issuedCredential}
                  />
                ) : (
                  <div className="rounded-xl border border-dashed border-border bg-muted/10 p-8 text-center">
                    <div className="w-12 h-12 rounded-lg bg-muted mx-auto mb-3 flex items-center justify-center">
                      <FileJson className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Select a credential schema to preview its format
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Schema Modal */}
      <CreateSchemaModal
        open={showCreateSchemaModal}
        onOpenChange={setShowCreateSchemaModal}
        onCreateSchema={onAddCustomSchema}
      />
    </div>
  );
}
