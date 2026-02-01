import { useState } from "react";
import { ExternalLink, Linkedin, Calendar, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BottomFooterProps {
  showPostVerificationCTA?: boolean;
  onDismissPostVerificationCTA?: () => void;
}

export function BottomFooter({ 
  showPostVerificationCTA = false,
  onDismissPostVerificationCTA 
}: BottomFooterProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmail("");
    }, 800);
  };

  return (
    <footer className="border-t border-border bg-muted/30">
      {/* Post-Verification CTA */}
      {showPostVerificationCTA && (
        <div className="px-4 sm:px-8 py-3 bg-success/5 border-b border-success/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-foreground text-center sm:text-left">
            This verification flow can be deployed in real systems.
          </p>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              className="h-8 gap-1.5 text-xs"
              onClick={() => window.open("https://calendly.com", "_blank")}
            >
              Talk to Us
              <ExternalLink className="w-3 h-3" />
            </Button>
            {onDismissPostVerificationCTA && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs text-muted-foreground"
                onClick={onDismissPostVerificationCTA}
              >
                Dismiss
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Main CTA Section */}
      <div className="px-4 sm:px-8 py-4 sm:py-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6">
        {/* Left: Headline & Subtext */}
        <div className="space-y-1 flex-shrink-0">
          <h3 className="text-sm font-semibold text-foreground">
            Build Sovereign, Interoperable Digital Trust
          </h3>
          <p className="text-xs text-muted-foreground max-w-md">
            Klefki integrates seamlessly with national identity systems, MOSIP-based deployments, and enterprise trust infrastructure.
          </p>
        </div>

        {/* Right: CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
          {/* Lead Capture Form */}
          <div className="flex flex-col gap-1.5 min-w-0 sm:min-w-[280px]">
            {!isSubmitted ? (
              <form onSubmit={handleSubmitEmail} className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="Work Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-8 text-xs"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  variant="secondary" 
                  size="sm" 
                  className="h-8 gap-1.5 text-xs shrink-0"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Sending...</span>
                  ) : (
                    <>
                      <Send className="w-3 h-3" />
                      Send Brief
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="flex items-center gap-2 text-xs text-success h-8">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thanks. We'll share the technical brief and follow up if relevant.</span>
              </div>
            )}
            <span className="text-[10px] text-muted-foreground">
              Get the Klefki Technical Brief
            </span>
          </div>

          <div className="hidden sm:block h-8 w-px bg-border" />

          {/* LinkedIn Connect */}
          <a
            href="https://www.linkedin.com/company/vlinder-io"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Follow on LinkedIn</span>
          </a>

          <div className="hidden sm:block h-8 w-px bg-border" />

          {/* Primary CTA - Book Demo */}
          <div className="flex flex-col items-start sm:items-center gap-1">
            <Button 
              size="sm" 
              className="h-9 gap-1.5 text-xs w-full sm:w-auto"
              onClick={() => window.open("https://calendly.com", "_blank")}
            >
              <Calendar className="w-3.5 h-3.5" />
              Book a Private Demo
              <ExternalLink className="w-3 h-3" />
            </Button>
            <span className="text-[10px] text-muted-foreground">
              For governments, system integrators, and DPI architects
            </span>
          </div>
        </div>
      </div>

      {/* Bottom bar - Copyright only */}
      <div className="px-4 sm:px-8 py-2 border-t border-border/50 bg-background/50">
        <span className="text-[11px] text-muted-foreground">
          All rights reserved © 2022 vlinder.io
        </span>
      </div>
    </footer>
  );
}
