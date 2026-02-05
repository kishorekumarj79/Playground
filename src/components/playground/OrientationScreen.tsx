import { Building2, Wallet, ShieldCheck, ArrowRight, Play, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrientationScreenProps {
  onStart: (enableDevMode: boolean) => void;
}

export function OrientationScreen({ onStart }: OrientationScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border px-6 flex items-center justify-between">
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
          <span className="text-sm font-semibold text-foreground">
            Klefki Trust Playground
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-success" />
          Interactive Demo
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Verifiable Credentials Demo
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl font-semibold text-foreground tracking-tight mb-4">
            The Klefki Trust Playground
          </h1>

          {/* Subtext */}
          <p className="text-base text-muted-foreground max-w-lg mx-auto mb-12">
            Issue, hold, and verify verifiable credentials using open standards
            and chain-agnostic blockchain anchoring.
          </p>

          {/* Flow Diagram */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {/* Issuer */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-xl bg-issuer/10 border border-issuer/20 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-issuer" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Issuer</p>
                <p className="text-xs text-muted-foreground">Authority</p>
              </div>
            </div>

            {/* Arrow */}
            <ArrowRight className="w-5 h-5 text-border mt-[-20px]" />

            {/* Holder */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-xl bg-holder/10 border border-holder/20 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-holder" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Holder</p>
                <p className="text-xs text-muted-foreground">Wallet</p>
              </div>
            </div>

            {/* Arrow */}
            <ArrowRight className="w-5 h-5 text-border mt-[-20px]" />

            {/* Verifier */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-xl bg-verifier/10 border border-verifier/20 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-verifier" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Verifier</p>
                <p className="text-xs text-muted-foreground">Service</p>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={() => onStart(false)}
              className="h-12 px-8 text-sm font-medium gap-2"
            >
              <Play className="w-4 h-4" />
              Start Live Demo
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onStart(true)}
              className="h-12 px-8 text-sm font-medium gap-2"
            >
              <Code2 className="w-4 h-4" />
              Enable Developer Mode
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex items-center justify-center gap-8 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>W3C Standards</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Privacy by Design</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span>Chain Agnostic</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-12 border-t border-border px-6 flex items-center justify-center">
        <span className="text-xs text-muted-foreground">
          © 2026 vlinder Inc. · Built for MOSIP Ecosystem
        </span>
      </footer>
    </div>
  );
}
