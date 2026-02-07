import { useState, useEffect, useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Key,
  ArrowRight,
  ArrowLeft,
  Check,
  Shuffle,
  ChevronRight,
  FileText,
  ShieldCheck,
  User,
  Building2,
  Search,
  ChevronDown,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { LiveCredentialPreview } from "./preview/LiveCredentialPreview";
import { priorityCountries, allCountries, mapCountryToAuthorityKey, Country } from "@/data/countries";
import { credentialTemplates, sectors, templateToSchema, type CredentialTemplate } from "@/data/credentialTemplates";
import type {
  Chain,
  IssuerConfig,
  CredentialSchema,
  DIDMethod,
  VerifiableCredential,
  HolderInfo,
} from "@/types/playground";

interface IssuerViewProps {
  selectedChain: Chain;
  blockchainAnchoringEnabled: boolean;
  uiPreviewEnabled: boolean;
  devModeEnabled: boolean;
  issuerConfig: IssuerConfig;
  selectedSchema: CredentialSchema;
  issuerStep: "national-id" | "otp" | "holder-info" | "template-selection" | "issue";
  holderStep: any; // Using any to avoid import cycle or type issues with HolderStep if not needed here
  issuedCredential: VerifiableCredential | null;
  onUpdateIssuerConfig: (config: Partial<IssuerConfig>) => void;
  onGenerateKeys: () => void;
  onSetStep: (step: "national-id" | "otp" | "holder-info" | "template-selection" | "issue") => void;
  onGetRandomIdentity: () => Record<string, string>;
  onIssue: (data: Record<string, unknown>) => void;
  holderInfo: HolderInfo | null;
  onSetHolderInfo: (info: HolderInfo) => void;
  onSelectTemplate: (schema: CredentialSchema, issuerName: string) => void;
  selectedCountry: string;
  selectedSector: string;
  onCountryChange: (country: string) => void;
  onSectorChange: (sector: string) => void;
}

// DID methods - only shown in Developer Mode
const didMethods: { value: DIDMethod; label: string; description: string }[] = [
  { value: "did:web", label: "did:web", description: "Domain-based, verifiable via HTTPS" },
  { value: "did:key", label: "did:key", description: "Self-resolving, no registration needed" },
  { value: "did:ethr", label: "did:ethr", description: "Ethereum blockchain-based" },
];

export function IssuerView({
  selectedChain,
  blockchainAnchoringEnabled,
  uiPreviewEnabled,
  devModeEnabled,
  issuerConfig,
  selectedSchema,
  issuerStep,
  issuedCredential,
  onUpdateIssuerConfig,
  onGenerateKeys,
  onSetStep,
  onGetRandomIdentity,
  onIssue,
  holderInfo,
  onSetHolderInfo,
  onSelectTemplate,
  selectedCountry,
  selectedSector,
  onCountryChange,
  onSectorChange,
}: IssuerViewProps) {
  // Local state for forms
  const [nationalId, setNationalId] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [localHolderInfo, setLocalHolderInfo] = useState<HolderInfo>({
    firstName: "",
    lastName: "",
    country: "",
    nationalId: "",
  });

  // Template selection state
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSectors, setExpandedSectors] = useState<Set<string>>(new Set(["public-sector"]));
  const [showAllTemplates, setShowAllTemplates] = useState(true);

  // Issue Credential state
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isIssuing, setIsIssuing] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Initialize form data when schema changes
  useEffect(() => {
    if (selectedSchema) {
      const initialData: Record<string, string> = {};
      selectedSchema.fields.forEach((field) => {
        // Auto-fill from holder info if available
        if (holderInfo) {
          if (field.key === "fullName") initialData[field.key] = `${holderInfo.firstName} ${holderInfo.lastName}`;
          else if (field.key === "dateOfBirth") initialData[field.key] = holderInfo.dateOfBirth || "";
          else if (field.key === "gender") initialData[field.key] = holderInfo.gender || "";
          else if (field.key === "nationality") {
            // Map ID to Name for Select component (search all countries)
            const all = [...priorityCountries, ...allCountries];
            const countryName = all.find(c => c.code === holderInfo.country || c.code === holderInfo.country.toLowerCase())?.name || holderInfo.country || "";
            initialData[field.key] = countryName;
          }
          else if (field.key === "idNumber") initialData[field.key] = holderInfo.nationalId || "";
          else initialData[field.key] = "";
        } else {
          initialData[field.key] = "";
        }
      });
      setFormData(initialData);
      setShowQR(false);
    }
  }, [selectedSchema, holderInfo]);

  // Steps definition
  const steps = [
    { id: "national-id", label: "National ID", icon: User },
    { id: "otp", label: "Verification", icon: ShieldCheck },
    { id: "holder-info", label: "Holder Info", icon: FileText },
    { id: "template-selection", label: "Select Template", icon: Search },
    { id: "issue", label: "Issue", icon: Key },
  ];

  /* --- Handlers --- */

  const handleRandomizeNationalId = () => {
    // Randomize from Priority Countries only
    const randomCountry = priorityCountries[Math.floor(Math.random() * priorityCountries.length)];
    const randomId = Math.random().toString(36).substring(2, 12).toUpperCase();
    setNationalId(randomId);
    onCountryChange(randomCountry.code);
  };

  const handleVerifyOtp = async () => {
    setIsVerifyingOtp(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsVerifyingOtp(false);

    // Auto-populate holder info on successful verification if empty
    if (!localHolderInfo.firstName) {
      handleRandomizeHolderInfo();
    }

    onSetStep("holder-info");
  };

  const handleSaveHolderInfo = () => {
    onSetHolderInfo({
      ...localHolderInfo,
      country: selectedCountry, // Ensure country is synced
      nationalId: nationalId,
    });
    onSetStep("template-selection");
  };

  const handleRandomizeHolderInfo = () => {
    const firstNames = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"];

    setLocalHolderInfo({
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      country: selectedCountry,
      nationalId: nationalId,
      dateOfBirth: "1990-01-01",
      gender: "Male"
    });
  };

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let templates = credentialTemplates;

    if (selectedSector && selectedSector !== "all" && !showAllTemplates) {
      templates = templates.filter(t => t.sector === selectedSector);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      templates = templates.filter(
        t =>
          t.name.toLowerCase().includes(query) ||
          t.useCase.toLowerCase().includes(query) ||
          t.benefit.toLowerCase().includes(query)
      );
    }

    return templates;
  }, [selectedSector, searchQuery, showAllTemplates]);

  const groupedTemplates = useMemo(() => {
    const groups: Record<string, Record<string, CredentialTemplate[]>> = {};
    filteredTemplates.forEach(template => {
      if (!groups[template.sector]) groups[template.sector] = {};
      if (!groups[template.sector][template.subsector]) groups[template.sector][template.subsector] = [];
      groups[template.sector][template.subsector].push(template);
    });
    return groups;
  }, [filteredTemplates]);

  const handleSelectTemplate = (template: CredentialTemplate) => {
    const authorityKey = selectedCountry ? mapCountryToAuthorityKey(selectedCountry) : "global";
    const issuerName = template.issuerAuthority[authorityKey] || template.issuerAuthority.global || template.issuerType;
    const schema = templateToSchema(template, authorityKey);
    onSelectTemplate(schema, issuerName);
    onSetStep("issue");
  };

  const handleIssueCredential = async () => {
    setIsIssuing(true);
    await new Promise((resolve) => setTimeout(resolve, 1800));
    onIssue(formData);
    setShowQR(true);
    setIsIssuing(false);
  };

  const handleRandomizeIssueData = () => {
    const randomData = onGetRandomIdentity();
    const preservedData = { ...randomData };

    // Preserve verified fields from holderInfo
    if (holderInfo) {
      selectedSchema.fields.forEach((field) => {
        if (field.key === "fullName") preservedData[field.key] = `${holderInfo.firstName} ${holderInfo.lastName}`;
        else if (field.key === "dateOfBirth") preservedData[field.key] = holderInfo.dateOfBirth || "";
        else if (field.key === "gender") preservedData[field.key] = holderInfo.gender || "";
        else if (field.key === "nationality") {
          const all = [...priorityCountries, ...allCountries];
          const countryName = all.find(c => c.code === holderInfo.country || c.code === holderInfo.country.toLowerCase())?.name || holderInfo.country || "";
          preservedData[field.key] = countryName;
        }
        else if (field.key === "idNumber") preservedData[field.key] = holderInfo.nationalId || "";
      });
    }

    setFormData(preservedData);
  };

  const toggleSector = (sectorId: string) => {
    setExpandedSectors(prev => {
      const next = new Set(prev);
      if (next.has(sectorId)) next.delete(sectorId);
      else next.add(sectorId);
      return next;
    });
  };

  const canIssueCredential = Object.entries(formData).every(
    ([key, value]) =>
      !selectedSchema.fields.find((f) => f.key === key)?.required || value.trim() !== ""
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-8 py-2 sm:py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1">
          <span className="w-4 h-4 rounded bg-issuer flex items-center justify-center text-issuer-foreground text-[9px] font-semibold">
            1
          </span>
          <span>Issuer Portal</span>
        </div>
        <h2 className="text-base sm:text-lg font-semibold text-foreground leading-tight">
          Issue Credential Flow
        </h2>
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
          Complete the steps to issue a verifiable credential
        </p>
      </div>

      {/* Step Indicator */}
      <div className="px-4 sm:px-8 py-2 border-b border-border bg-muted/30 shrink-0 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {steps.map((step, index) => {
            const isActive = issuerStep === step.id;
            const stepIndex = steps.findIndex(s => s.id === step.id);
            const currentIndex = steps.findIndex(s => s.id === issuerStep);
            const isCompleted = stepIndex < currentIndex;

            return (
              <div key={step.id} className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                    isActive && "bg-primary text-primary-foreground",
                    isCompleted && "bg-success/10 text-success",
                    !isActive && !isCompleted && "text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <step.icon className="w-3 h-3" />
                  )}
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-border" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">

          {/* STEP 1: NATIONAL ID */}
          {issuerStep === "national-id" && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-base font-semibold">Enter National ID</h3>
                <p className="text-xs text-muted-foreground">
                  Provide the National ID of the citizen to initiate the issuance process.
                </p>
              </div>

              <div className="p-4 border border-border rounded-xl bg-card space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">National ID Number</Label>
                  <div className="flex gap-2">
                    <Input
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value)}
                      placeholder="e.g. ABC 123456"
                      className="font-mono"
                    />
                    <Button variant="outline" onClick={handleRandomizeNationalId} title="Randomize">
                      <Shuffle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {selectedCountry && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <Building2 className="w-4 h-4" />
                    <span>Detected Country: </span>
                    <span className="font-medium text-foreground">
                      {[...priorityCountries, ...allCountries].find(c => c.code === selectedCountry)?.name || selectedCountry}
                    </span>
                  </div>
                )}
              </div>

              <Button
                className="w-full"
                onClick={() => {
                  setOtp("123456"); // Auto-fill OTP on continue
                  onSetStep("otp");
                }}
                disabled={!nationalId}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {issuerStep === "otp" && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-base font-semibold">Verify Identity</h3>
                <p className="text-xs text-muted-foreground">
                  Enter the OTP sent to the registered mobile number for ID <strong>{nationalId}</strong>
                </p>
              </div>

              <div className="p-4 border border-border rounded-xl bg-card space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">One-Time Password</Label>
                  <Input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="font-mono text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    OTP sent to registered mobile. Auto-filled for demo.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => onSetStep("national-id")}>Back</Button>
                <Button
                  className="flex-1"
                  onClick={handleVerifyOtp}
                  disabled={!otp || isVerifyingOtp}
                >
                  {isVerifyingOtp ? "Verifying..." : "Verify & Proceed"}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: HOLDER INFO */}
          {issuerStep === "holder-info" && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-base font-semibold">Confirm Holder Details</h3>
                <p className="text-xs text-muted-foreground">
                  Review the information retrieved from the national registry.
                </p>
              </div>

              <div className="p-4 border border-border rounded-xl bg-card space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">First Name</Label>
                    <Input
                      value={localHolderInfo.firstName}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      value={localHolderInfo.lastName}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nationality</Label>
                    <Input
                      value={[...priorityCountries, ...allCountries].find(c => c.code === selectedCountry)?.name || selectedCountry || "Unknown"}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={localHolderInfo.dateOfBirth}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Input
                      value={localHolderInfo.gender}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" onClick={handleRandomizeHolderInfo} className="text-xs">
                    <Shuffle className="w-3 h-3 mr-2" />
                    Simulate Different Identity
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => onSetStep("otp")}>Back</Button>
                <Button
                  className="flex-1"
                  onClick={handleSaveHolderInfo}
                  disabled={!localHolderInfo.firstName || !localHolderInfo.lastName}
                >
                  Confirm & Continue
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: TEMPLATE SELECTION (Formerly Modal) */}
          {issuerStep === "template-selection" && (
            <div className="space-y-4 h-full flex flex-col">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Select Credential Template</h3>
                <p className="text-sm text-muted-foreground">
                  Choose the type of credential you want to issue for <strong>{holderInfo?.firstName}</strong> in <strong>{[...priorityCountries, ...allCountries].find(c => c.code === selectedCountry)?.name || selectedCountry || "Global"}</strong>.
                </p>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search templates..."
                    className="pl-9"
                  />
                </div>
                <Select value={selectedSector} onValueChange={(val) => {
                  onSectorChange(val);
                  setShowAllTemplates(val === "all");
                  if (val && val !== "all") setExpandedSectors(new Set([val]));
                }}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Sectors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sectors</SelectItem>
                    {sectors.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <ScrollArea className="flex-1 border border-border rounded-lg bg-muted/20 p-4 h-[300px]">
                <div className="space-y-1">
                  {Object.keys(groupedTemplates).length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">No templates found.</p>
                  ) : (
                    sectors.filter(sector => groupedTemplates[sector.id]).map(sector => (
                      <div key={sector.id} className="space-y-1">
                        <button
                          onClick={() => toggleSector(sector.id)}
                          className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/50 transition-colors"
                        >
                          {expandedSectors.has(sector.id) ? (
                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                          )}
                          <Building2 className="w-3.5 h-3.5 text-primary" />
                          <span className="text-sm font-medium text-foreground">{sector.name}</span>
                        </button>

                        {expandedSectors.has(sector.id) && (
                          <div className="ml-5 space-y-2">
                            {sector.subsectors
                              .filter(subsector => groupedTemplates[sector.id]?.[subsector.id])
                              .map(subsector => (
                                <div key={subsector.id} className="space-y-1">
                                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-2 pt-2">
                                    {subsector.name}
                                  </p>
                                  {groupedTemplates[sector.id][subsector.id].map(template => (
                                    <button
                                      key={template.id}
                                      onClick={() => handleSelectTemplate(template)}
                                      className="w-full text-left p-3 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-accent/30 transition-all group"
                                    >
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <p className="text-sm font-medium group-hover:text-primary transition-colors">
                                            {[...priorityCountries, ...allCountries].find(c => c.code === selectedCountry)?.name || "Global"} - {template.name}
                                          </p>
                                          <p className="text-[10px] text-muted-foreground mt-0.5">
                                            {template.useCase} • {template.issuerType}
                                          </p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => onSetStep("holder-info")}>Back</Button>
              </div>
            </div>
          )}

          {/* STEP 5: ISSUE CREDENTIAL */}
          {issuerStep === "issue" && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Issue {selectedSchema.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground">
                    Review final details. Data auto-filled from verified holder info.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRandomizeIssueData}
                  className="h-8 gap-1.5 text-xs"
                >
                  <Shuffle className="w-3 h-3" />
                  Regenerate
                </Button>
              </div>

              {/* Dynamic Form Fields */}
              <div className="grid grid-cols-1 gap-4 p-4 border rounded-xl bg-card">
                {selectedSchema.fields.map((field) => {
                  // Determine if field was auto-filled from verified identity
                  const isIdentityField = ["fullName", "dateOfBirth", "gender", "nationality", "idNumber"].includes(field.key);
                  const isReadOnly = isIdentityField && !!formData[field.key];

                  return (
                    <div key={field.key} className="space-y-1.5">
                      <Label htmlFor={field.key} className="text-sm">
                        {field.label} {field.required && <span className="text-destructive">*</span>}
                        {isReadOnly && <span className="ml-2 text-[10px] text-success font-medium">(Verified)</span>}
                      </Label>
                      {field.type === "select" ? (
                        <Select
                          value={formData[field.key] || ""}
                          onValueChange={(value) => setFormData({ ...formData, [field.key]: value })}
                          disabled={isReadOnly}
                        >
                          <SelectTrigger className={cn("h-9", isReadOnly && "bg-muted/50 opacity-100")}>
                            <SelectValue placeholder={`Select ${field.label}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id={field.key}
                          type={field.type}
                          value={formData[field.key] || ""}
                          onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                          className={cn("h-9", isReadOnly && "bg-muted/50")}
                          readOnly={isReadOnly}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

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
                <Button variant="outline" onClick={() => onSetStep("template-selection")} className="h-10 gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button
                  onClick={handleIssueCredential}
                  disabled={isIssuing || !canIssueCredential || showQR}
                  className="flex-1 h-10 gap-2"
                >
                  {isIssuing ? "Issuing..." : showQR ? "Issued" : "Issue Credential"}
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
