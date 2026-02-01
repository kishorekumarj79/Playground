import { User } from "lucide-react";
import type { VerifiableCredential } from "@/types/playground";

interface CredentialPreviewCardProps {
  credential: VerifiableCredential;
  className?: string;
}

/**
 * Visual representation generated from Verifiable Credential data.
 * This is a READ-ONLY, derived view - JSON remains the source of truth.
 */
export function CredentialPreviewCard({ credential, className }: CredentialPreviewCardProps) {
  const subject = credential.credentialSubject;
  
  // Extract credential type from the type array (second element is usually the specific type)
  const credentialType = credential.type[1]?.replace(/([A-Z])/g, ' $1').trim() || "Verifiable Credential";
  
  // Derive issuer name from issuer DID or use a fallback
  const issuerDID = credential.issuer;
  const issuerName = deriveIssuerName(issuerDID);
  
  // Extract subject fields dynamically
  const displayFields = extractDisplayFields(subject);
  const primaryName = subject.fullName as string || subject.name as string || null;
  const identifier = subject.idNumber as string || subject.documentNumber as string || subject.id?.split(':').pop() || null;

  return (
    <div className={className}>
      {/* Card */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-muted/30 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {issuerName}
              </p>
              <p className="text-sm font-semibold text-foreground mt-0.5">
                {credentialType}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <CredentialTypeIcon type={credential.type[1]} />
            </div>
          </div>
        </div>

        {/* Primary Identity Section */}
        {primaryName && (
          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center gap-4">
              {/* Neutral avatar placeholder */}
              <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <User className="w-7 h-7 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-base font-semibold text-foreground truncate">
                  {primaryName}
                </p>
                {identifier && (
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">
                    {identifier}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Attributes Section */}
        {displayFields.length > 0 && (
          <div className="px-5 py-4 border-b border-border">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {displayFields.map(({ label, value }) => (
                <div key={label} className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">
                    {label}
                  </p>
                  <p className="text-sm font-medium text-foreground truncate mt-0.5">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3 bg-muted/20">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <div>
              <span>Issued: </span>
              <span className="font-medium text-foreground">
                {formatDate(credential.issuanceDate)}
              </span>
            </div>
            {credential.expirationDate && (
              <div>
                <span>Expires: </span>
                <span className="font-medium text-foreground">
                  {formatDate(credential.expirationDate)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper: Derive issuer name from DID
function deriveIssuerName(did: string): string {
  if (did.startsWith("did:web:")) {
    const domain = did.replace("did:web:", "").split(":")[0];
    return domain.replace(/\./g, " ").split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }
  if (did.startsWith("did:key:")) {
    return "Key-based Issuer";
  }
  if (did.startsWith("did:ethr:")) {
    return "Ethereum Issuer";
  }
  return "Verified Issuer";
}

// Helper: Extract display fields from credential subject
function extractDisplayFields(subject: Record<string, unknown>): { label: string; value: string }[] {
  const excludeKeys = ["id", "schemaId", "credentialType", "fullName", "name", "idNumber", "documentNumber"];
  
  const fields: { label: string; value: string }[] = [];
  
  for (const [key, value] of Object.entries(subject)) {
    if (excludeKeys.includes(key) || value === null || value === undefined || value === "") {
      continue;
    }
    
    const label = key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, str => str.toUpperCase())
      .trim();
    
    let displayValue: string;
    if (typeof value === "string") {
      // Check if it's a date string
      if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
        displayValue = formatDate(value);
      } else {
        displayValue = value;
      }
    } else if (typeof value === "number" || typeof value === "boolean") {
      displayValue = String(value);
    } else {
      continue; // Skip complex objects
    }
    
    fields.push({ label, value: displayValue });
  }
  
  return fields.slice(0, 6); // Limit to 6 fields for clean display
}

// Helper: Format date string
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

// Helper: Get icon for credential type
function CredentialTypeIcon({ type }: { type?: string }) {
  const iconClass = "w-5 h-5 text-primary";
  
  switch (type) {
    case "NationalIDCredential":
      return <span className={iconClass}>🪪</span>;
    case "UniversityDegreeCredential":
      return <span className={iconClass}>🎓</span>;
    case "VaccinationCertificate":
      return <span className={iconClass}>💉</span>;
    default:
      return <span className={iconClass}>📄</span>;
  }
}
