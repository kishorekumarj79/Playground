import { useState } from "react";
import { ShieldCheck, QrCode, ChevronRight, Eye, EyeOff, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import type { VerificationRequest } from "@/types/playground";

interface ProofRequestBuilderProps {
  verificationRequests: VerificationRequest[];
  selectedRequest: VerificationRequest | null;
  onSelectRequest: (request: VerificationRequest) => void;
  onGenerateQR: () => void;
}

export function ProofRequestBuilder({
  verificationRequests,
  selectedRequest,
  onSelectRequest,
  onGenerateQR,
}: ProofRequestBuilderProps) {
  const [showQR, setShowQR] = useState(false);

  const handleGenerateQR = () => {
    setShowQR(true);
    onGenerateQR();
  };

  return (
    <div className="space-y-4">
      {/* Request Selection */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          Request Template
        </h4>
        <div className="space-y-1.5">
          {verificationRequests.map((request) => {
            const isSelected = selectedRequest?.id === request.id;
            return (
              <div key={request.id}>
                <button
                  onClick={() => {
                    onSelectRequest(request);
                    setShowQR(false);
                  }}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${isSelected
                      ? "border-verifier bg-verifier/5 rounded-b-none shadow-sm"
                      : "border-border bg-card hover:border-verifier/50"
                    }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {request.name}
                      </p>
                    </div>
                    {isSelected ? (
                      <Check className="w-3.5 h-3.5 text-verifier shrink-0" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    )}
                  </div>
                </button>
                {/* Expanded Details - Directly Below Selected Card */}
                {isSelected && (
                  <div className="border border-t-0 border-verifier rounded-b-lg bg-card overflow-hidden">
                    <div className="p-2.5 space-y-3 border-b border-border">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-verifier" />
                        <h4 className="text-xs font-semibold">Data Request</h4>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
                          Required Attributes
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {request.requiredAttributes.map((attr) => (
                            <div
                              key={attr}
                              className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-verifier/10 text-verifier"
                            >
                              <Eye className="w-2.5 h-2.5" />
                              <span className="text-[10px] font-medium capitalize">
                                {attr.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="p-2.5">
                      {!showQR ? (
                        <Button
                          onClick={handleGenerateQR}
                          className="w-full h-8 bg-verifier hover:bg-verifier/90 text-verifier-foreground text-xs"
                        >
                          <QrCode className="w-3.5 h-3.5 mr-2" />
                          View Request QR
                        </Button>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <QRCodeSVG
                              value={JSON.stringify({
                                type: "VerificationRequest",
                                request: request.id,
                                verifier: "did:web:klefki.verify",
                                timestamp: new Date().toISOString(),
                              })}
                              size={120}
                              level="M"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}