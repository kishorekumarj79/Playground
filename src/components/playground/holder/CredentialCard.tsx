import { useState } from "react";
import { Shield, Check, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VerifiableCredential, BlockchainAnchor } from "@/types/playground";

interface CredentialCardProps {
  credential: VerifiableCredential;
  blockchainAnchor: BlockchainAnchor | null;
  isExpanded?: boolean;
  onToggle?: () => void;
  devModeEnabled?: boolean;
}

export function CredentialCard({ 
  credential, 
  blockchainAnchor, 
  isExpanded = false,
  onToggle,
  devModeEnabled = false
}: CredentialCardProps) {
  const subject = credential.credentialSubject;
  const credentialType = credential.type[1]?.replace(/([A-Z])/g, ' $1').trim() || "Verifiable Credential";
  const schemaId = subject.schemaId as string;

  // Get schema-specific display
  const getCredentialIcon = () => {
    switch (schemaId) {
      case "national-id":
        return "🪪";
      case "university-degree":
        return "🎓";
      case "vaccination-certificate":
        return "💉";
      default:
        return "📄";
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden transition-all">
      {/* Card Header - Always Visible */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/30 transition-colors"
      >
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg">
          {getCredentialIcon()}
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {credentialType}
          </p>
          <p className="text-[10px] text-muted-foreground">
            Issued {new Date(credential.issuanceDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/10">
            <Check className="w-3 h-3 text-success" />
            <span className="text-[10px] font-medium text-success">Valid</span>
          </div>
          {onToggle && (
            isExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )
          )}
        </div>
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
          {/* Subject Details */}
          <div className="space-y-2">
            {Object.entries(subject)
              .filter(([key]) => key !== "id" && key !== "schemaId" && key !== "credentialType")
              .map(([key, value]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="font-medium text-foreground">
                    {String(value)}
                  </span>
                </div>
              ))}
          </div>

          {/* Issuer - Technical details only in Developer Mode */}
          <div className="p-3 rounded-lg bg-muted/30 space-y-2">
            {devModeEnabled ? (
              <>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Issuer DID</span>
                  <span className="font-mono text-[10px] text-foreground">
                    {credential.issuer.slice(0, 24)}...
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Issued</span>
                  <span className="font-medium text-foreground">
                    {new Date(credential.issuanceDate).toLocaleString()}
                  </span>
                </div>
                {credential.expirationDate && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Expires</span>
                    <span className="font-medium text-foreground">
                      {new Date(credential.expirationDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Issued by</span>
                  <span className="font-medium text-foreground">
                    Trusted Authority
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Issue Date</span>
                  <span className="font-medium text-foreground">
                    {new Date(credential.issuanceDate).toLocaleDateString()}
                  </span>
                </div>
                {credential.expirationDate && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Valid Until</span>
                    <span className="font-medium text-foreground">
                      {new Date(credential.expirationDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Blockchain Anchor - Only in Developer Mode */}
          {devModeEnabled && blockchainAnchor && (
            <div className="p-3 rounded-lg bg-muted/30 space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium">On-chain Anchor</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Chain</span>
                <span className="font-medium text-foreground capitalize">
                  {blockchainAnchor.chain}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Block</span>
                <span className="font-mono text-[10px] text-foreground">
                  #{blockchainAnchor.blockNumber.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs items-center">
                <span className="text-muted-foreground">Transaction</span>
                <span className="font-mono text-[10px] text-foreground flex items-center gap-1">
                  {blockchainAnchor.transactionHash.slice(0, 12)}...
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          )}

          {/* Simple trust badge for non-dev mode */}
          {!devModeEnabled && blockchainAnchor && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-success/5 border border-success/20">
              <Shield className="w-4 h-4 text-success" />
              <span className="text-xs text-success">Verified & tamper-proof</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
