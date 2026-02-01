import { Check, X, Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VerifiableCredential, VerificationRequest } from "@/types/playground";

interface VerifierConsentPromptProps {
  credential: VerifiableCredential;
  request: VerificationRequest;
  selectedAttributes: string[];
  onUpdateAttributes: (attrs: string[]) => void;
  onShare: () => void;
  onCancel: () => void;
}

export function VerifierConsentPrompt({
  credential,
  request,
  selectedAttributes,
  onUpdateAttributes,
  onShare,
  onCancel,
}: VerifierConsentPromptProps) {
  const subject = credential.credentialSubject;

  const toggleAttribute = (attr: string) => {
    if (request.requiredAttributes.includes(attr)) return; // Can't toggle required
    
    if (selectedAttributes.includes(attr)) {
      onUpdateAttributes(selectedAttributes.filter((a) => a !== attr));
    } else {
      onUpdateAttributes([...selectedAttributes, attr]);
    }
  };

  const allAttributes = [...request.requiredAttributes, ...request.optionalAttributes];

  return (
    <div className="flex-1 flex flex-col p-4">
      <div className="flex-1 flex flex-col bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border bg-verifier/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-verifier/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-verifier" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Share Credential
              </h3>
              <p className="text-[10px] text-muted-foreground">
                Select what to share with the verifier
              </p>
            </div>
          </div>
        </div>

        {/* Request Info */}
        <div className="px-5 py-3 border-b border-border bg-muted/20">
          <p className="text-[10px] text-muted-foreground">Verification Request</p>
          <p className="text-sm font-medium text-foreground">{request.name}</p>
        </div>

        {/* Attribute Selection */}
        <div className="flex-1 p-5 space-y-3 overflow-auto">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-[10px] text-muted-foreground">
              Required fields cannot be deselected
            </p>
          </div>

          {allAttributes.map((attr) => {
            const isRequired = request.requiredAttributes.includes(attr);
            const isSelected = selectedAttributes.includes(attr);
            const value = subject[attr];

            return (
              <button
                key={attr}
                onClick={() => toggleAttribute(attr)}
                disabled={isRequired}
                className={`w-full p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? "border-verifier/30 bg-verifier/5"
                    : "border-border bg-background hover:bg-muted/30"
                } ${isRequired ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                      isSelected 
                        ? "bg-verifier border-verifier" 
                        : "border-border bg-background"
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-verifier-foreground" />}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground capitalize">
                        {attr.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      {value && (
                        <p className="text-[10px] text-muted-foreground">
                          {String(value)}
                        </p>
                      )}
                    </div>
                  </div>
                  {isRequired && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      Required
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-border bg-muted/20">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 h-10"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={onShare}
              className="flex-1 h-10 bg-verifier hover:bg-verifier/90 text-verifier-foreground"
            >
              <Check className="w-4 h-4 mr-2" />
              Share Selected
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
