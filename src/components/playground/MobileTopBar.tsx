import { useState } from "react";
import { RotateCcw, Code2, ChevronDown, CreditCard, Link2, Settings2, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Chain } from "@/types/playground";

interface MobileTopBarProps {
  selectedChain: Chain;
  blockchainAnchoringEnabled: boolean;
  devModeEnabled: boolean;
  uiPreviewEnabled: boolean;
  onChainChange: (chain: Chain) => void;
  onBlockchainAnchoringToggle: () => void;
  onDevModeToggle: () => void;
  onUiPreviewToggle: () => void;
  onReset: () => void;
}

const chains: { value: Chain; label: string; network: string }[] = [
  { value: "ethereum", label: "Ethereum", network: "Mainnet" },
  { value: "polygon", label: "Polygon", network: "Mainnet" },
  { value: "private", label: "Private Chain", network: "Local" },
  { value: "custom", label: "Custom RPC", network: "Custom" },
];

export function MobileTopBar({
  selectedChain,
  blockchainAnchoringEnabled,
  devModeEnabled,
  uiPreviewEnabled,
  onChainChange,
  onBlockchainAnchoringToggle,
  onDevModeToggle,
  onUiPreviewToggle,
  onReset,
}: MobileTopBarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const currentChain = chains.find((c) => c.value === selectedChain);

  return (
    <header className="h-12 border-b border-border bg-background flex items-center justify-between px-3">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-4 h-4 text-primary-foreground"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <h1 className="text-xs font-semibold text-foreground leading-none">
            Klefki
          </h1>
          <p className="text-[10px] text-muted-foreground">Trust Playground</p>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Book Demo CTA - Mobile */}
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1 text-xs px-2"
          onClick={() => window.open("https://calendly.com", "_blank")}
        >
          <Calendar className="w-3 h-3" />
          Demo
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 w-8 p-0 text-muted-foreground"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <Settings2 className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[320px]">
            <SheetHeader>
              <SheetTitle>Settings</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 mt-6">
              {/* UI Preview */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">UI Preview</span>
                </div>
                <Switch
                  checked={uiPreviewEnabled}
                  onCheckedChange={onUiPreviewToggle}
                />
              </div>

              {/* Dev Mode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Developer Mode</span>
                </div>
                <Switch
                  checked={devModeEnabled}
                  onCheckedChange={onDevModeToggle}
                />
              </div>

              {/* Advanced Trust Options - Only visible in Developer Mode */}
              {devModeEnabled && (
                <>
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                      Advanced Trust Options
                    </p>
                    
                    {/* Blockchain Anchoring */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Link2 className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <span className="text-sm">Verification Mode</span>
                            <p className="text-[10px] text-muted-foreground">
                              {blockchainAnchoringEnabled ? "On-chain (public, tamper-proof)" : "Off-chain (private, standard)"}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={blockchainAnchoringEnabled}
                          onCheckedChange={onBlockchainAnchoringToggle}
                        />
                      </div>

                      {/* Chain Selector */}
                      {blockchainAnchoringEnabled && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full h-9 justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-success" />
                                <span className="text-sm">{currentChain?.label}</span>
                              </div>
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-full">
                            {chains.map((chain) => (
                              <DropdownMenuItem
                                key={chain.value}
                                onClick={() => onChainChange(chain.value)}
                              >
                                {chain.label} ({chain.network})
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
