import { FileJson } from "lucide-react";
import { cn } from "@/lib/utils";
import { NationalIdPreview } from "./NationalIdPreview";
import { UniversityDegreePreview } from "./UniversityDegreePreview";
import { GenericCredentialPreview } from "./GenericCredentialPreview";
import type { CredentialSchema, VerifiableCredential } from "@/types/playground";

interface LiveCredentialPreviewProps {
  schema: CredentialSchema | null;
  formData: Record<string, string>;
  issuerName: string;
  issuedCredential: VerifiableCredential | null;
  className?: string;
}

/**
 * Live Credential Preview - Progressive, Schema-driven, Industry-themed
 * 
 * Lifecycle States:
 * 1. NO SCHEMA: Neutral skeleton with helper text
 * 2. SCHEMA SELECTED: Industry-specific base template with placeholder labels
 * 3. FORM INPUT: Live updating as issuer fills form
 * 4. ISSUANCE: Finalized card with metadata
 */
export function LiveCredentialPreview({
  schema,
  formData,
  issuerName,
  issuedCredential,
  className,
}: LiveCredentialPreviewProps) {
  const isFinalized = issuedCredential !== null;
  const issuanceDate = issuedCredential?.issuanceDate;

  // STATE 1: No schema selected
  if (!schema) {
    return (
      <div className={className}>
        <div className="rounded-xl border border-dashed border-border bg-muted/10 p-8 text-center">
          <div className="w-12 h-12 rounded-lg bg-muted mx-auto mb-3 flex items-center justify-center">
            <FileJson className="w-6 h-6 text-muted-foreground/50" />
          </div>
          <p className="text-sm text-muted-foreground">
            Select a credential schema to preview its format
          </p>
        </div>
      </div>
    );
  }

  // Determine which template to render based on schema
  const renderTemplate = () => {
    switch (schema.id) {
      case "national-id":
        return (
          <NationalIdPreview
            data={{
              fullName: formData.fullName,
              idNumber: formData.idNumber,
              dateOfBirth: formData.dateOfBirth,
              nationality: formData.nationality,
              gender: formData.gender,
            }}
            issuerName={issuerName}
            issuanceDate={issuanceDate}
            isFinalized={isFinalized}
          />
        );

      case "university-degree":
        return (
          <UniversityDegreePreview
            data={{
              fullName: formData.fullName,
              degree: formData.degree,
              major: formData.major,
              graduationDate: formData.graduationDate,
              honors: formData.honors,
            }}
            issuerName={issuerName}
            issuanceDate={issuanceDate}
            isFinalized={isFinalized}
          />
        );

      default:
        // Generic fallback for vaccination-certificate and future schemas
        return (
          <GenericCredentialPreview
            schemaName={schema.name}
            fields={schema.fields}
            data={formData}
            issuerName={issuerName}
            issuanceDate={issuanceDate}
            isFinalized={isFinalized}
          />
        );
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {renderTemplate()}
      
      {/* Clarity label */}
      <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
        Live visual preview of the credential being created.
        <br />
        This is a UI representation, not the source of truth.
      </p>
    </div>
  );
}
