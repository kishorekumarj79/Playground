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
      <div className="space-y-3">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Select Verification Request
        </h4>
        <div className="space-y-2">
          {verificationRequests.map((request) => {
            const isSelected = selectedRequest?.id === request.id;
            return (
              <div key={request.id}>
                <button
                  onClick={() => {
                    onSelectRequest(request);
                    setShowQR(false);
                  }}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-verifier bg-verifier/5 rounded-b-none"
                      : "border-border bg-card hover:border-verifier/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {request.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {request.description}
                      </p>
                    </div>
                    {isSelected ? (
                      <Check className="w-4 h-4 text-verifier shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                    )}
                  </div>
                </button>
                {/* Expanded Details - Directly Below Selected Card */}
                {isSelected && (
                  <div className="border border-t-0 border-verifier rounded-b-xl bg-card overflow-hidden">
                    <div className="p-4 space-y-4 border-b border-border">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-verifier" />
                        <h4 className="text-sm font-semibold">Selective Disclosure</h4>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          Required Attributes
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {request.requiredAttributes.map((attr) => (
                            <div
                              key={attr}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-verifier/10 text-verifier"
                            >
                              <Eye className="w-3 h-3" />
                              <span className="text-xs font-medium capitalize">
                                {attr.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {request.optionalAttributes.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            Optional Attributes
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {request.optionalAttributes.map((attr) => (
                              <div
                                key={attr}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground"
                              >
                                <EyeOff className="w-3 h-3" />
                                <span className="text-xs font-medium capitalize">
                                  {attr.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      {!showQR ? (
                        <Button
                          onClick={handleGenerateQR}
                          className="w-full h-11 bg-verifier hover:bg-verifier/90 text-verifier-foreground"
                        >
                          <QrCode className="w-4 h-4 mr-2" />
                          Generate Verification QR
                        </Button>
                      ) : (
                        <div className="flex flex-col items-center">
                          <p className="text-xs text-muted-foreground mb-3">
                            Scan with Klefki Wallet to share credentials
                          </p>
                          <div className="p-3 bg-white rounded-lg">
                            <QRCodeSVG
                              value={JSON.stringify({
                                type: "VerificationRequest",
                                request: request.id,
                                verifier: "did:web:klefki.verify",
                                timestamp: new Date().toISOString(),
                              })}
                              size={140}
                              level="M"
                            />
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-3">
                            Request: {request.name}
                          </p>
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