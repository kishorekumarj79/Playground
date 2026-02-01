import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NationalIdPreviewProps {
  data: {
    fullName?: string;
    idNumber?: string;
    dateOfBirth?: string;
    nationality?: string;
    gender?: string;
  };
  issuerName?: string;
  issuanceDate?: string;
  isFinalized?: boolean;
  className?: string;
}

/**
 * Government / National ID Card Preview
 * Industry Context: Government, National Identity, Public Services
 * Visual Theme: Clean, official, civic - Light background with blue/neutral government tones
 */
export function NationalIdPreview({
  data,
  issuerName = "Government Authority",
  issuanceDate,
  isFinalized = false,
  className,
}: NationalIdPreviewProps) {
  const hasAnyData = data.fullName || data.idNumber || data.dateOfBirth || data.nationality;

  return (
    <div className={cn("transition-all duration-300", className)}>
      <div
        className={cn(
          "rounded-xl border overflow-hidden bg-gradient-to-br from-background to-muted/30",
          isFinalized
            ? "border-issuer/30 shadow-sm"
            : "border-border"
        )}
      >
        {/* Header - Government Style */}
        <div className="px-5 py-4 bg-issuer/5 border-b border-issuer/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-issuer/70 uppercase tracking-wider font-medium">
                {issuerName}
              </p>
              <p className="text-sm font-semibold text-foreground mt-0.5">
                National Identity Card
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-issuer/10 flex items-center justify-center">
              <span className="text-lg">🪪</span>
            </div>
          </div>
        </div>

        {/* Identity Section */}
        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-center gap-4">
            {/* Photo placeholder */}
            <div className="w-16 h-20 rounded-lg bg-muted flex items-center justify-center shrink-0 border border-border">
              <User className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <div className="min-w-0 flex-1">
              {/* Full Name */}
              <div className="mb-2">
                {data.fullName ? (
                  <p className="text-base font-semibold text-foreground truncate">
                    {data.fullName}
                  </p>
                ) : (
                  <div className="h-5 w-32 bg-muted/50 rounded animate-pulse" />
                )}
              </div>
              {/* ID Number */}
              <div>
                {data.idNumber ? (
                  <p className="text-xs font-mono text-muted-foreground">
                    ID: {data.idNumber}
                  </p>
                ) : (
                  <div className="h-4 w-24 bg-muted/30 rounded animate-pulse" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Attributes Grid */}
        <div className="px-5 py-4 border-b border-border">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {/* Date of Birth */}
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Date of Birth
              </p>
              {data.dateOfBirth ? (
                <p className="text-sm font-medium text-foreground mt-0.5">
                  {formatDate(data.dateOfBirth)}
                </p>
              ) : (
                <div className="h-4 w-20 bg-muted/30 rounded mt-1 animate-pulse" />
              )}
            </div>

            {/* Nationality */}
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Nationality
              </p>
              {data.nationality ? (
                <p className="text-sm font-medium text-foreground mt-0.5">
                  {data.nationality}
                </p>
              ) : (
                <div className="h-4 w-16 bg-muted/30 rounded mt-1 animate-pulse" />
              )}
            </div>

            {/* Gender */}
            {(data.gender || !hasAnyData) && (
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Gender
                </p>
                {data.gender ? (
                  <p className="text-sm font-medium text-foreground mt-0.5">
                    {data.gender}
                  </p>
                ) : (
                  <div className="h-4 w-12 bg-muted/30 rounded mt-1 animate-pulse" />
                )}
              </div>
            )}
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
