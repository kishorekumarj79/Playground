import { Shield, Check, X, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VerifiableCredential } from "@/types/playground";

interface WalletConsentModalProps {
  credential: VerifiableCredential;
  onAccept: () => void;
  onReject: () => void;
}

export function WalletConsentModal({ credential, onAccept, onReject }: WalletConsentModalProps) {
  const credentialType = credential.type[1]?.replace(/([A-Z])/g, ' $1').trim() || "Verifiable Credential";
  
  return (
    <div className="flex-1 flex flex-col p-4">
      {/* Modal Card */}
      <div className="flex-1 flex flex-col bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Credential Request
              </h3>
              <p className="text-[10px] text-muted-foreground">
                Review and accept to add to wallet
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 space-y-4 overflow-auto">
          {/* Issuer */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <Building2 className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Issuer
              </p>
              <p className="text-xs font-medium text-foreground truncate">
                {credential.issuer.slice(0, 32)}...
              </p>
            </div>
          </div>

          {/* Credential Type */}
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
              Credential Type
            </p>
            <p className="text-sm font-semibold text-foreground">
              {credentialType}
            </p>
          </div>

          {/* Attributes Preview */}
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
              Contains
            </p>
            <div className="space-y-1.5">
              {Object.entries(credential.credentialSubject)
                .filter(([key]) => key !== "id" && key !== "schemaId")
                .slice(0, 4)
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between text-xs p-2 rounded bg-muted/30">
                    <span className="text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="font-medium text-foreground">
                      {String(value).slice(0, 20)}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-success/5 border border-success/20">
            <Check className="w-4 h-4 text-success" />
            <p className="text-xs text-success">
              Cryptographically signed & verified
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-border bg-muted/20">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onReject}
              className="flex-1 h-11"
            >
              <X className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button
              onClick={onAccept}
              className="flex-1 h-11 bg-holder hover:bg-holder/90 text-holder-foreground"
            >
              <Check className="w-4 h-4 mr-2" />
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
