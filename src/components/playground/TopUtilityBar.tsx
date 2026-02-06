import { RotateCcw, Code2, ChevronDown, CreditCard, Link2, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import type { Chain } from "@/types/playground";

interface TopUtilityBarProps {
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

// Advanced options shown only in Developer Mode

const chains: { value: Chain; label: string; network: string }[] = [
  { value: "ethereum", label: "Ethereum", network: "Mainnet" },
  { value: "polygon", label: "Polygon", network: "Mainnet" },
  { value: "private", label: "Private Chain", network: "Local" },
  { value: "custom", label: "Custom RPC", network: "Custom" },
];

export function TopUtilityBar({
  selectedChain,
  blockchainAnchoringEnabled,
  devModeEnabled,
  uiPreviewEnabled,
  onChainChange,
  onBlockchainAnchoringToggle,
  onDevModeToggle,
  onUiPreviewToggle,
  onReset,
}: TopUtilityBarProps) {
  const currentChain = chains.find((c) => c.value === selectedChain);

  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-5 h-5 text-primary-foreground"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground leading-none">
              Klefki Trust Playground
            </h1>
            <p className="text-xs text-muted-foreground">
              Interactive DID & VC Demo
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Advanced Trust Options - Only visible in Developer Mode */}
        {devModeEnabled && (
          <>
            {/* Blockchain Anchoring Toggle */}
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {blockchainAnchoringEnabled ? "On-chain" : "Off-chain"}
              </span>
              <Switch
                checked={blockchainAnchoringEnabled}
                onCheckedChange={onBlockchainAnchoringToggle}
                className="scale-90"
              />
            </div>

            {/* Chain Selector - only visible when anchoring enabled */}
            {blockchainAnchoringEnabled && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-xs font-medium">{currentChain?.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {currentChain?.network}
                    </span>
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {chains.map((chain) => (
                    <DropdownMenuItem
                      key={chain.value}
                      onClick={() => onChainChange(chain.value)}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{chain.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {chain.network}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </>
        )}

        {/* UI Preview Toggle */}
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">UI Preview</span>
          <Switch
            checked={uiPreviewEnabled}
            onCheckedChange={onUiPreviewToggle}
            className="scale-90"
          />
        </div>

        {/* Dev Mode Toggle */}
        <div className="flex items-center gap-2 pl-4 border-l border-border">
          <Code2 className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Developer Mode</span>
          <Switch
            checked={devModeEnabled}
            onCheckedChange={onDevModeToggle}
            className="scale-90"
          />
        </div>

        {/* Reset Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 gap-2 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="text-xs">Reset</span>
        </Button>

        {/* Book Demo CTA - Desktop */}
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1.5 text-xs"
          onClick={() => window.open("https://calendly.com", "_blank")}
        >
          <Calendar className="w-3.5 h-3.5" />
          Book Demo
          <ExternalLink className="w-3 h-3" />
        </Button>
      </div>
    </header>
  );
}
