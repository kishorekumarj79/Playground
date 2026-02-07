import { Smartphone } from "lucide-react";
import type { ReactNode } from "react";

interface MobileWalletFrameProps {
  credentialCount: number;
  children: ReactNode;
}

export function MobileWalletFrame({ credentialCount, children }: MobileWalletFrameProps) {
  return (
    <div className="relative">
      {/* Phone Frame */}
      <div className="bg-foreground rounded-[2.5rem] p-3 shadow-elevated">
        <div className="bg-background rounded-[2rem] overflow-hidden min-h-[480px] flex flex-col">
          {/* Status Bar */}
          <div className="h-8 px-6 flex items-center justify-between bg-muted/30 shrink-0">
            <span className="text-[10px] text-muted-foreground">9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 rounded-sm border border-muted-foreground/50" />
            </div>
          </div>

          {/* Wallet Header */}
          <div className="px-4 py-3 border-b border-border shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-holder flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-holder-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Klefki Wallet</h3>
                <p className="text-[10px] text-muted-foreground">
                  {credentialCount === 0
                    ? "No credentials"
                    : `${credentialCount} Credential${credentialCount > 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
          </div>

          {/* Dynamic Content */}
          {children}

          {/* Home Indicator */}
          <div className="flex justify-center pb-2 pt-3 shrink-0">
            <div className="w-32 h-1 rounded-full bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
