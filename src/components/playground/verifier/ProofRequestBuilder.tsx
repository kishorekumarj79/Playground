import { useState } from "react";
import { ShieldCheck, QrCode, ChevronRight, Eye, EyeOff } from "lucide-react";
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
    <div className="space-y-6">
      {/* Request Selection */}
      <div className="space-y-3">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Select Verification Request
        </h4>
        <div className="space-y-2">
          {verificationRequests.map((request) => (
            <button
              key={request.id}
              onClick={() => {
                onSelectRequest(request);
                setShowQR(false);
              }}
              className={`w-full p-4 rounded-xl border text-left transition-all ${
                selectedRequest?.id === request.id
                  ? "border-verifier bg-verifier/5"
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
                <ChevronRight className={`w-4 h-4 mt-0.5 transition-transform ${
                  selectedRequest?.id === request.id ? "text-verifier" : "text-muted-foreground"
                }`} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Request Details */}
      {selectedRequest && (
        <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-verifier" />
            <h4 className="text-sm font-semibold">Selective Disclosure</h4>
          </div>
          
          <div className="space-y-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Required Attributes
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedRequest.requiredAttributes.map((attr) => (
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

          {selectedRequest.optionalAttributes.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Optional Attributes
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedRequest.optionalAttributes.map((attr) => (
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

      {/* Generate QR Button */}
      {selectedRequest && !showQR && (
        <Button
          onClick={handleGenerateQR}
          className="w-full h-12 bg-verifier hover:bg-verifier/90 text-verifier-foreground"
        >
          <QrCode className="w-4 h-4 mr-2" />
          Generate Verification QR
        </Button>
      )}

      {/* QR Code Display */}
      {showQR && selectedRequest && (
        <div className="flex flex-col items-center p-6 rounded-xl border border-border bg-card">
          <p className="text-xs text-muted-foreground mb-4">
            Scan with Klefki Wallet to share credentials
          </p>
          <div className="p-4 bg-white rounded-xl">
            <QRCodeSVG
              value={JSON.stringify({
                type: "VerificationRequest",
                request: selectedRequest.id,
                verifier: "did:web:klefki.verify",
                timestamp: new Date().toISOString(),
              })}
              size={160}
              level="M"
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-4">
            Request: {selectedRequest.name}
          </p>
        </div>
      )}
    </div>
  );
}
