import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Key,
  ArrowRight,
  ArrowLeft,
  Check,
  Shuffle,
  ChevronRight,
  FileText,
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
  issuerStep: "identity" | "issue";
  issuedCredential: VerifiableCredential | null;
  onUpdateIssuerConfig: (config: Partial<IssuerConfig>) => void;
  onGenerateKeys: () => void;
  onSetStep: (step: "identity" | "issue") => void;
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
  issuerStep,
  issuedCredential,
  onUpdateIssuerConfig,
  onGenerateKeys,
  onSetStep,
  onGetRandomIdentity,
  onIssue,
}: IssuerViewProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isIssuing, setIsIssuing] = useState(false);
  const [showQR, setShowQR] = useState(false);

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
  const canIssue = Object.entries(formData).every(
    ([key, value]) =>
      !selectedSchema.fields.find((f) => f.key === key)?.required || value.trim() !== ""
  );

  // Show credential preview panel when toggle is ON
  const showPreviewPanel = uiPreviewEnabled;
  // Preview should ALWAYS show when template is selected (schema exists)
  // This ensures preview is visible immediately after template selection, not just on issue step
  const showSchemaPreview = selectedSchema && selectedSchema.id !== "";

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-8 py-2 border-b border-border shrink-0 bg-background/50 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-0.5">
          <span className="w-4 h-4 rounded bg-issuer flex items-center justify-center text-issuer-foreground text-[8px] font-semibold">
            1
          </span>
          <span>Authority Portal — Klefki Studio</span>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xs sm:text-sm font-semibold text-foreground">
            Issue Verifiable Credential
          </h2>
          <p className="text-[10px] text-muted-foreground hidden sm:block">
            {blockchainAnchoringEnabled ? `Anchored to ${selectedChain}` : "Standard DID & VC"}
          </p>
        </div>
      </div>

      {/* Step Indicator - Refined Compact */}
      <div className="px-4 sm:px-8 py-1.5 border-b border-border bg-muted/40 shrink-0 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {[
            { id: "identity", label: "Authority Setup", shortLabel: "Setup" },
            { id: "issue", label: "Issue Credential", shortLabel: "Issue" },
          ].map((step, index) => {
            const isActive = issuerStep === step.id;
            const isCompleted =
              step.id === "identity" && issuerConfig.keysGenerated && issuerStep !== "identity";

            return (
              <div key={step.id} className="flex items-center gap-2">
                <button
                  onClick={() => onSetStep(step.id as "identity" | "issue")}
                  disabled={step.id === "issue" && !canProceedFromIdentity}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium transition-all",
                    isActive
                      ? "bg-issuer text-issuer-foreground shadow-sm"
                      : isCompleted
                        ? "bg-success/10 text-success border border-success/20"
                        : "text-muted-foreground hover:bg-black/5"
                  )}
                >
                  <span className={cn(
                    "w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] border",
                    isActive ? "bg-white text-issuer border-transparent" : "border-current"
                  )}>
                    {isCompleted ? <Check className="w-2.5 h-2.5" /> : index + 1}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                  <span className="sm:hidden">{step.shortLabel}</span>
                </button>
                {index === 0 && (
                  <ChevronRight className="w-3 h-3 text-muted-foreground/30" />
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
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-foreground">
                    Authority Branding & DID Setup
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      DID Method
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {didMethods.map((method) => (
                        <button
                          key={method.value}
                          onClick={() =>
                            onUpdateIssuerConfig({ didMethod: method.value, keysGenerated: false, issuerDID: null })
                          }
                          className={cn(
                            "px-3 py-1.5 rounded-full border text-xs transition-all",
                            issuerConfig.didMethod === method.value
                              ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                              : "border-border hover:border-primary/50 text-muted-foreground"
                          )}
                        >
                          {method.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="issuerName" className="text-[11px]">
                      Issuing Authority Name
                    </Label>
                    <Input
                      id="issuerName"
                      value={issuerConfig.issuerName}
                      onChange={(e) =>
                        onUpdateIssuerConfig({ issuerName: e.target.value, keysGenerated: false, issuerDID: null })
                      }
                      placeholder="e.g., Government of India"
                      className="h-8 text-xs font-medium"
                    />
                  </div>

                  <Button
                    onClick={onGenerateKeys}
                    variant={issuerConfig.keysGenerated ? "outline" : "default"}
                    className="w-full h-8 gap-2 text-xs"
                  >
                    <Key className="w-3.5 h-3.5" />
                    {issuerConfig.keysGenerated ? "Regenerate Keys" : "Generate Keys"}
                  </Button>

                  {issuerConfig.keysGenerated && (
                    <div className="p-2 rounded-lg bg-success/5 border border-success/20">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Check className="w-3 h-3 text-success" />
                        <span className="text-[10px] font-medium text-success uppercase tracking-wider">
                          Keys Active
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-foreground break-all leading-tight">
                        {issuerConfig.issuerDID}
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => onSetStep("issue")}
                  disabled={!canProceedFromIdentity}
                  className="w-full h-8 gap-2 text-xs"
                >
                  Continue to Issue Credential
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}

            {/* Step 2: Issue Credential */}
            {issuerStep === "issue" && (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-semibold text-foreground">
                      Issue {selectedSchema.name}
                    </h3>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRandomize}
                    className="h-7 gap-1.5 text-[10px]"
                  >
                    <Shuffle className="w-3 h-3" />
                    Randomize
                  </Button>
                </div>

                {/* Dynamic Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedSchema.fields.map((field) => (
                    <div
                      key={field.key}
                      className={cn(
                        "space-y-1",
                        field.key === "fullName" && "sm:col-span-2"
                      )}
                    >
                      <Label htmlFor={field.key} className="text-[11px]">
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
                          <SelectTrigger className="h-8 text-xs">
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
                          className={cn("h-8 text-xs", field.key.includes("Number") && "font-mono")}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Chain Selector Pill - show based on anchoring mode */}
                {blockchainAnchoringEnabled ? (
                  <div className="p-2.5 rounded-lg bg-accent/50 border border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-[10px] font-medium text-foreground capitalize">
                        {selectedChain}
                      </span>
                      <span className="text-[10px] text-muted-foreground italic">
                        Anchoring enabled
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-muted/50 border border-border">
                    <p className="text-[10px] text-muted-foreground">
                      Issued without blockchain anchoring
                    </p>
                  </div>
                )}

                {/* QR Code Display */}
                {showQR && issuedCredential && (
                  <div className="p-4 rounded-xl border border-success/30 bg-success/5 flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2 text-success">
                      <Check className="w-4 h-4" />
                      <span className="text-xs font-medium">
                        Credential Issued
                      </span>
                    </div>
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <QRCodeSVG
                        value={JSON.stringify({ type: "vc", schema: selectedSchema.id, issued: new Date().toISOString() })}
                        size={120}
                        level="M"
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => onSetStep("identity")}
                    className="h-8 gap-2 text-xs px-3"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </Button>
                  <Button
                    onClick={handleIssue}
                    disabled={isIssuing || !canIssue || showQR}
                    className="flex-1 h-8 gap-2 text-xs"
                  >
                    {isIssuing ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-3.5 w-3.5"
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
                        Issuing...
                      </span>
                    ) : showQR ? (
                      <span className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5" />
                        Issued
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5" />
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
                <div className="mb-2">
                  <h4 className="text-xs font-medium text-foreground">
                    Credential Preview
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
                      <FileText className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Select a credential template to preview its format
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
