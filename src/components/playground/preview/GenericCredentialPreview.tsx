import { FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CredentialField } from "@/types/playground";

interface GenericCredentialPreviewProps {
  schemaName: string;
  fields: CredentialField[];
  data: Record<string, string>;
  issuerName?: string;
  issuanceDate?: string;
  isFinalized?: boolean;
  className?: string;
}

/**
 * Generic Verifiable Credential Preview
 * Industry Context: Unknown / New / Custom
 * Visual Theme: Neutral, minimal, clean - Maximum compatibility
 */
export function GenericCredentialPreview({
  schemaName,
  fields,
  data,
  issuerName = "Verified Issuer",
  issuanceDate,
  isFinalized = false,
  className,
}: GenericCredentialPreviewProps) {
  // Get primary name field if exists
  const primaryName = data.fullName || data.name || null;
  
  // Get other display fields (excluding fullName/name which is shown prominently)
  const displayFields = fields
    .filter((f) => f.key !== "fullName" && f.key !== "name")
    .slice(0, 6);

  const hasAnyData = Object.values(data).some((v) => v && v.trim() !== "");

  return (
    <div className={cn("transition-all duration-300", className)}>
      <div
        className={cn(
          "rounded-xl border overflow-hidden bg-card",
          isFinalized
            ? "border-success/30 shadow-sm"
            : "border-border"
        )}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-muted/30 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {issuerName}
              </p>
              <p className="text-sm font-semibold text-foreground mt-0.5">
                {schemaName}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Primary Name Section */}
        <div className="px-5 py-4 border-b border-border">
          {primaryName ? (
            <p className="text-base font-semibold text-foreground">
              {primaryName}
            </p>
          ) : (
            <div className="h-5 w-32 bg-muted/50 rounded animate-pulse" />
          )}
        </div>

        {/* Attributes Grid */}
        <div className="px-5 py-4 border-b border-border">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {displayFields.map((field) => (
              <div key={field.key} className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">
                  {field.label}
                </p>
                {data[field.key] ? (
                  <p className="text-sm font-medium text-foreground truncate mt-0.5">
                    {field.type === "date" ? formatDate(data[field.key]) : data[field.key]}
                  </p>
                ) : (
                  <div className="h-4 w-16 bg-muted/30 rounded mt-1 animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-muted/20">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <div>
              <span>Issued by </span>
              <span className="font-medium text-foreground">{issuerName}</span>
            </div>
            {issuanceDate && (
              <span className="font-medium text-foreground">
                {formatDate(issuanceDate)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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
