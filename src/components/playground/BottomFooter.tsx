import { useState } from "react";
import { Linkedin, Send, CheckCircle2, ExternalLink } from "lucide-react";
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
      <div className="hidden sm:flex px-4 sm:px-8 py-3 items-center justify-between gap-4">
        {/* Left: LinkedIn */}
        <a
          href="https://www.linkedin.com/company/vlinder-io"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Linkedin className="w-3.5 h-3.5" />
          <span>Follow on LinkedIn</span>
        </a>

        {/* Right: Lead Capture */}
        <div className="flex items-center gap-3">
          {!isSubmitted ? (
            <form onSubmit={handleSubmitEmail} className="flex gap-2 items-center">
              <Input
                type="email"
                placeholder="Work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-7 text-xs w-48"
                required
              />
              <Button 
                type="submit" 
                variant="secondary" 
                size="sm" 
                className="h-7 gap-1 text-xs px-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "..." : (
                  <>
                    <Send className="w-3 h-3" />
                    Get Brief
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-success">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Thanks! We'll send the brief.</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar - Copyright only */}
      <div className="px-4 sm:px-8 py-2 border-t border-border/50 bg-background/50">
        <span className="text-[11px] text-muted-foreground">
          All rights reserved © 2026 vlinder Inc.
        </span>
      </div>
    </footer>
  );
}
