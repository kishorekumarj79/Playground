import { CheckCircle2, XCircle, Shield, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VerificationResult, BlockchainAnchor } from "@/types/playground";

interface VerificationResultDisplayProps {
  result: VerificationResult;
  blockchainAnchor: BlockchainAnchor | null;
  devModeEnabled?: boolean;
}

export function VerificationResultDisplay({
  result,
  blockchainAnchor,
  devModeEnabled = false,
}: VerificationResultDisplayProps) {
  return (
    <div className="space-y-4">
      {/* Overall Result */}
      <div
        className={cn(
          "p-6 rounded-xl border transition-all",
          result.isValid
            ? "border-success/30 bg-success/5"
            : "border-destructive/30 bg-destructive/5"
        )}
      >
        <div className="flex items-center gap-3">
          {result.isValid ? (
            <CheckCircle2 className="w-8 h-8 text-success" />
          ) : (
            <XCircle className="w-8 h-8 text-destructive" />
          )}
          <div>
            <h3
              className={cn(
                "text-lg font-semibold",
                result.isValid ? "text-success" : "text-destructive"
              )}
            >
              {result.isValid ? "Credential Verified" : "Verification Failed"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {result.isValid
                ? devModeEnabled
                  ? (blockchainAnchor 
                      ? "Credential verified and blockchain anchor validated"
                      : "Credential verified using DID & VC standards")
                  : (blockchainAnchor
                      ? "Credential verified with tamper-proof protection"
                      : "Credential verified and authentic")
                : "One or more checks failed"}
            </p>
          </div>
        </div>
      </div>

      {/* Verified Attributes */}
      {result.sharedAttributes && Object.keys(result.sharedAttributes).length > 0 && (
        <div className="p-4 rounded-xl border border-border bg-card">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            {devModeEnabled ? "Verified Attributes" : "Confirmed Information"}
          </h4>
          <div className="space-y-2">
            {Object.entries(result.sharedAttributes).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 rounded-lg bg-success/5 border border-success/20"
              >
                <span className="text-sm text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {String(value)}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-success" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blockchain Anchor Reference - Only in Developer Mode */}
      {devModeEnabled && blockchainAnchor && (
        <div className="p-4 rounded-xl border border-border bg-muted/30">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-primary" />
            <h4 className="text-xs font-medium uppercase tracking-wider">
              On-chain Anchor
            </h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Chain</span>
              <span className="font-medium text-foreground capitalize">
                {blockchainAnchor.chain}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Block</span>
              <span className="font-mono text-foreground">
                #{blockchainAnchor.blockNumber.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-xs items-center">
              <span className="text-muted-foreground">Transaction</span>
              <span className="font-mono text-foreground flex items-center gap-1">
                {blockchainAnchor.transactionHash.slice(0, 16)}...
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Status</span>
              <span className="text-success font-medium capitalize">
                {blockchainAnchor.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Simple trust badge for non-dev mode with blockchain anchor */}
      {!devModeEnabled && blockchainAnchor && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-success/5 border border-success/20">
          <Shield className="w-5 h-5 text-success" />
          <div>
            <p className="text-sm font-medium text-success">Protected on blockchain</p>
            <p className="text-xs text-muted-foreground">Tamper-proof and publicly verifiable</p>
          </div>
        </div>
      )}

      {/* Individual Checks - Only in Developer Mode */}
      {devModeEnabled && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Verification Checks
          </h4>
          <div className="space-y-1">
            {result.checks.map((check, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  {check.status === "pass" ? (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{check.name}</p>
                    {check.details && (
                      <p className="text-xs text-muted-foreground">
                        {check.details}
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium px-2 py-0.5 rounded",
                    check.status === "pass" && "bg-success/10 text-success",
                    check.status === "fail" && "bg-destructive/10 text-destructive"
                  )}
                >
                  {check.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timestamp */}
      <p className="text-[10px] text-muted-foreground text-center">
        Verified at {new Date(result.timestamp).toLocaleString()}
      </p>
    </div>
  );
}
