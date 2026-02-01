import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CredentialSchema } from "@/types/playground";

interface CreateSchemaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSchema: (schema: CredentialSchema) => void;
}

const SECTORS = [
  { id: "public-sector", name: "Public Sector" },
  { id: "financial-services", name: "Financial Services" },
  { id: "healthcare", name: "Healthcare" },
  { id: "education", name: "Education" },
  { id: "employment", name: "Employment (HR)" },
  { id: "supply-chain", name: "Supply Chain" },
  { id: "real-estate", name: "Real Estate" },
] as const;

const SUBSECTORS: Record<string, string[]> = {
  "public-sector": ["National Identity", "Social Services", "Tax & Revenue", "Immigration", "Licensing"],
  "financial-services": ["Banking", "Insurance", "Investment", "Payments", "Credit"],
  "healthcare": ["Patient Records", "Immunization", "Prescription", "Insurance Claims", "Provider Credentials"],
  "education": ["Degrees & Diplomas", "Certifications", "Transcripts", "Accreditation", "Student Records"],
  "employment": ["Employment History", "Background Checks", "Professional Licenses", "Skills & Training"],
  "supply-chain": ["Product Origin", "Certifications", "Logistics", "Quality Assurance"],
  "real-estate": ["Property Ownership", "Title Deeds", "Rental Agreements", "Building Permits"],
};

const SECTOR_ISSUER_TYPES: Record<string, string> = {
  "public-sector": "Government Authority",
  "financial-services": "Financial Institution",
  "healthcare": "Health Authority",
  "education": "Educational Institution",
  "employment": "Employer / HR Authority",
  "supply-chain": "Supply Chain Authority",
  "real-estate": "Property Registry",
};

export function CreateSchemaModal({
  open,
  onOpenChange,
  onCreateSchema,
}: CreateSchemaModalProps) {
  const [sector, setSector] = useState("");
  const [subsector, setSubsector] = useState("");
  const [useCase, setUseCase] = useState("");
  const [schemaName, setSchemaName] = useState("");

  const availableSubsectors = useMemo(() => {
    return sector ? SUBSECTORS[sector] || [] : [];
  }, [sector]);

  const benefitDescription = useMemo(() => {
    if (!sector) return "";
    const descriptions: Record<string, string> = {
      "public-sector": "Enable secure, verifiable identity and service delivery for citizens.",
      "financial-services": "Streamline KYC, reduce fraud, and enable instant credential verification.",
      "healthcare": "Ensure patient data portability and secure health record sharing.",
      "education": "Eliminate diploma fraud and enable instant credential verification.",
      "employment": "Simplify background checks and professional credential verification.",
      "supply-chain": "Ensure provenance, authenticity, and compliance across supply chains.",
      "real-estate": "Digitize property records and enable secure ownership transfers.",
    };
    return descriptions[sector] || "";
  }, [sector]);

  const handleSectorChange = (value: string) => {
    setSector(value);
    setSubsector("");
  };

  const handleCreate = () => {
    if (!sector || !schemaName) return;

    const schemaId = `custom-${Date.now()}`;
    const newSchema: CredentialSchema = {
      id: schemaId,
      name: schemaName,
      description: useCase || `${subsector || sector} credential`,
      version: "1.0.0",
      issuerType: SECTOR_ISSUER_TYPES[sector] || "Authority",
      fields: [
        { key: "fullName", label: "Full Name", type: "text", required: true },
        { key: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
        { key: "idNumber", label: "Identifier", type: "text", required: true },
        { key: "issuedAt", label: "Issued At", type: "date", required: false },
      ],
    };

    onCreateSchema(newSchema);
    onOpenChange(false);

    // Reset form
    setSector("");
    setSubsector("");
    setUseCase("");
    setSchemaName("");
  };

  const canCreate = sector && schemaName.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create New Schema
          </DialogTitle>
          <DialogDescription>
            Define a custom credential schema for demo purposes. This schema exists only for this session.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Schema Name */}
          <div className="space-y-2">
            <Label htmlFor="schemaName" className="text-sm">
              Schema Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="schemaName"
              value={schemaName}
              onChange={(e) => setSchemaName(e.target.value)}
              placeholder="e.g., eKYC Certificate"
              className="h-10"
            />
          </div>

          {/* Sector */}
          <div className="space-y-2">
            <Label className="text-sm">
              Sector <span className="text-destructive">*</span>
            </Label>
            <Select value={sector} onValueChange={handleSectorChange}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select sector" />
              </SelectTrigger>
              <SelectContent>
                {SECTORS.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subsector */}
          {sector && availableSubsectors.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm">Subsector</Label>
              <Select value={subsector} onValueChange={setSubsector}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select subsector (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubsectors.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Use Case */}
          <div className="space-y-2">
            <Label htmlFor="useCase" className="text-sm">
              Use Case / Description
            </Label>
            <Textarea
              id="useCase"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              placeholder="Describe the credential use case..."
              className="min-h-[60px] resize-none"
            />
          </div>

          {/* Value/Benefit (Read-only) */}
          {benefitDescription && (
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                Value / Benefit
              </p>
              <p className="text-xs text-foreground">{benefitDescription}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!canCreate}>
            Create Schema
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
