import { useState } from "react";
import { ShieldCheck, QrCode, ChevronRight, Eye, EyeOff, Check, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import type { VerificationRequest } from "@/types/playground";

interface ProofRequestBuilderProps {
  verificationRequests: VerificationRequest[];
  selectedRequest: VerificationRequest | null;
  onSelectRequest: (request: VerificationRequest) => void;
  onGenerateQR: () => void;
  devModeEnabled?: boolean;
}

export function ProofRequestBuilder({
  verificationRequests,
  selectedRequest,
  onSelectRequest,
  onGenerateQR,
  devModeEnabled = false,
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
                  className={`w-full p-3 rounded-lg border text-left transition-all ${isSelected
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
                    {devModeEnabled && (
                      <div className="p-3 space-y-3 border-b border-border">
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
                    )}
                    <div className="p-3">
                      <div className="p-3 bg-muted/30">
                        <div className="flex flex-col items-center">
                          <div className="p-3 bg-white rounded-lg shadow-sm border border-border mb-2">
                            <QRCodeSVG
                              value={JSON.stringify({
                                type: "verification-request",
                                id: request.id,
                                name: request.name,
                                verifier: "Klefki Verifier",
                                requiredAttributes: request.requiredAttributes
                              })}
                              size={150}
                              level="H"
                              includeMargin={true}
                            />
                          </div>
                          <div className="text-center space-y-3">
                            <div className="space-y-1">
                              <h4 className="text-sm font-semibold">Scan to Verify</h4>
                              <p className="text-xs text-muted-foreground">
                                Use your Citizen Wallet to scan this code
                              </p>
                            </div>

                            <Button
                              onClick={onGenerateQR}
                              size="sm"
                              className="bg-verifier hover:bg-verifier/90 h-9"
                            >
                              <Smartphone className="w-4 h-4 mr-2" />
                              Scan with Mobile Wallet
                            </Button>
                          </div>
                        </div>
                      </div>
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