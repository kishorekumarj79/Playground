import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface UniversityDegreePreviewProps {
  data: {
    fullName?: string;
    degree?: string;
    major?: string;
    graduationDate?: string;
    honors?: string;
  };
  issuerName?: string;
  issuanceDate?: string;
  isFinalized?: boolean;
  className?: string;
}

/**
 * Academic / University Degree Preview
 * Industry Context: Education, Academia, Professional Qualification
 * Visual Theme: Institutional, deeper/richer colors, certificate-style hierarchy
 */
export function UniversityDegreePreview({
  data,
  issuerName = "University",
  issuanceDate,
  isFinalized = false,
  className,
}: UniversityDegreePreviewProps) {
  const hasAnyData = data.fullName || data.degree || data.major;

  return (
    <div className={cn("transition-all duration-300", className)}>
      <div
        className={cn(
          "rounded-xl border overflow-hidden bg-gradient-to-br from-background to-primary/5",
          isFinalized
            ? "border-primary/30 shadow-sm"
            : "border-border"
        )}
      >
        {/* Header - Academic Style */}
        <div className="px-5 py-5 bg-primary/5 border-b border-primary/10 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary" />
            </div>
          </div>
          <p className="text-[10px] text-primary/70 uppercase tracking-widest font-medium">
            {issuerName}
          </p>
          <p className="text-sm font-semibold text-foreground mt-1">
            Certificate of Degree
          </p>
        </div>

        {/* Main Content - Certificate Style */}
        <div className="px-5 py-6 text-center space-y-4">
          {/* Conferral Text */}
          <p className="text-xs text-muted-foreground">
            This is to certify that
          </p>

          {/* Graduate Name - Very Prominent */}
          <div>
            {data.fullName ? (
              <p className="text-xl font-semibold text-foreground">
                {data.fullName}
              </p>
            ) : (
              <div className="h-7 w-40 bg-muted/50 rounded mx-auto animate-pulse" />
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            has successfully completed the requirements for
          </p>

          {/* Degree */}
          <div>
            {data.degree ? (
              <p className="text-lg font-semibold text-primary">
                {data.degree}
              </p>
            ) : (
              <div className="h-6 w-36 bg-primary/10 rounded mx-auto animate-pulse" />
            )}
          </div>

          {/* Major */}
          <div>
            {data.major ? (
              <p className="text-sm text-foreground">
                in <span className="font-medium">{data.major}</span>
              </p>
            ) : (
              <div className="h-4 w-28 bg-muted/30 rounded mx-auto animate-pulse" />
            )}
          </div>

          {/* Honors Badge */}
          {data.honors && data.honors !== "None" && (
            <div className="pt-2">
              <span className="inline-block px-3 py-1 text-[10px] font-medium uppercase tracking-wider bg-primary/10 text-primary rounded-full">
                {data.honors}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-muted/20 border-t border-border">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <div>
              {data.graduationDate ? (
                <>
                  <span>Conferred </span>
                  <span className="font-medium text-foreground">
                    {formatDate(data.graduationDate)}
                  </span>
                </>
              ) : (
                <div className="h-3 w-24 bg-muted/30 rounded animate-pulse" />
              )}
            </div>
            {issuanceDate && (
              <div>
                <span>Issued </span>
                <span className="font-medium text-foreground">
                  {formatDate(issuanceDate)}
                </span>
              </div>
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
