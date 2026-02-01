import { useState, useEffect, useRef } from "react";
import { X, FileJson, Link2, Database, ChevronRight, Clock, FileCode2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type {
  DIDDocument,
  VerifiableCredential,
  BlockchainAnchor,
  ConsoleEvent,
} from "@/types/playground";

interface DevConsoleProps {
  isOpen: boolean;
  didDocument: DIDDocument | null;
  credential: VerifiableCredential | null;
  blockchainAnchor: BlockchainAnchor | null;
  consoleEvents: ConsoleEvent[];
  onClose: () => void;
}

// Syntax highlighting for JSON
function SyntaxHighlightedJson({ data, label }: { data: unknown; label: string }) {
  const [copied, setCopied] = useState(false);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-console-foreground/50 text-sm">
        No {label} data available
      </div>
    );
  }

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple syntax highlighting
  const highlightJson = (json: string) => {
    return json
      .replace(/"([^"]+)":/g, '<span class="text-console-key">"$1"</span>:')
      .replace(/: "([^"]+)"/g, ': <span class="text-console-string">"$1"</span>')
      .replace(/: (\d+)/g, ': <span class="text-console-number">$1</span>')
      .replace(/: (true|false)/g, ': <span class="text-console-boolean">$1</span>')
      .replace(/: (null)/g, ': <span class="text-console-null">$1</span>');
  };

  return (
    <div className="relative h-full">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        className="absolute top-2 right-2 w-7 h-7 text-console-foreground/40 hover:text-console-foreground hover:bg-console-muted z-10"
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      </Button>
      <pre 
        className="text-xs text-console-foreground font-mono whitespace-pre-wrap overflow-auto console-scroll p-4 leading-relaxed h-full"
        dangerouslySetInnerHTML={{ __html: highlightJson(jsonString) }}
      />
    </div>
  );
}

function EventLog({ events }: { events: ConsoleEvent[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-console-foreground/50 text-sm">
        No events yet
      </div>
    );
  }

  const getEventColor = (type: ConsoleEvent["type"]) => {
    switch (type) {
      case "DID_CREATED":
        return "text-primary";
      case "VC_CREATED":
        return "text-issuer";
      case "SIGNATURE_ADDED":
        return "text-warning";
      case "HASH_GENERATED":
        return "text-muted-foreground";
      case "ANCHOR_CONFIRMED":
        return "text-success";
      case "VERIFICATION_COMPLETE":
        return "text-verifier";
      default:
        return "text-console-foreground";
    }
  };

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-auto console-scroll p-3 space-y-2"
    >
      {events.map((event, index) => (
        <div
          key={index}
          className="p-2 rounded bg-console-muted/50 border border-console-muted"
        >
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-3 h-3 text-console-foreground/40" />
            <span className="text-[10px] text-console-foreground/40 font-mono">
              {new Date(event.timestamp).toLocaleTimeString()}
            </span>
            <span
              className={cn(
                "text-[10px] font-medium px-1.5 py-0.5 rounded",
                getEventColor(event.type)
              )}
            >
              {event.type}
            </span>
          </div>
          <p className="text-xs text-console-foreground">{event.message}</p>
        </div>
      ))}
    </div>
  );
}

export function DevConsole({
  isOpen,
  didDocument,
  credential,
  blockchainAnchor,
  consoleEvents,
  onClose,
}: DevConsoleProps) {
  const [activeTab, setActiveTab] = useState("events");

  if (!isOpen) return null;

  return (
    <aside
      className={cn(
        "w-80 border-l border-border bg-console flex flex-col",
        "animate-slide-in-right"
      )}
    >
      {/* Header */}
      <div className="h-12 px-4 border-b border-console-muted flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-medium text-console-foreground">
            Developer Console
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="w-6 h-6 text-console-foreground/60 hover:text-console-foreground hover:bg-console-muted"
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="w-full h-10 bg-console-muted/50 rounded-none border-b border-console-muted justify-start px-2 gap-1 shrink-0">
          <TabsTrigger
            value="events"
            className="h-7 px-2 text-xs data-[state=active]:bg-console-muted data-[state=active]:text-console-foreground text-console-foreground/60 rounded-md gap-1.5"
          >
            <Clock className="w-3 h-3" />
            Events
            {consoleEvents.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                {consoleEvents.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="did"
            className="h-7 px-2 text-xs data-[state=active]:bg-console-muted data-[state=active]:text-console-foreground text-console-foreground/60 rounded-md gap-1.5"
          >
            <FileJson className="w-3 h-3" />
            DID
          </TabsTrigger>
          <TabsTrigger
            value="vc"
            className="h-7 px-2 text-xs data-[state=active]:bg-console-muted data-[state=active]:text-console-foreground text-console-foreground/60 rounded-md gap-1.5"
          >
            <Database className="w-3 h-3" />
            VC
          </TabsTrigger>
          <TabsTrigger
            value="anchor"
            className="h-7 px-2 text-xs data-[state=active]:bg-console-muted data-[state=active]:text-console-foreground text-console-foreground/60 rounded-md gap-1.5"
          >
            <Link2 className="w-3 h-3" />
            Chain
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="events" className="h-full m-0">
            <EventLog events={consoleEvents} />
          </TabsContent>

          <TabsContent value="did" className="h-full m-0 overflow-auto">
            <SyntaxHighlightedJson data={didDocument} label="DID Document" />
          </TabsContent>

          <TabsContent value="vc" className="h-full m-0 overflow-auto">
            <SyntaxHighlightedJson data={credential} label="Verifiable Credential" />
          </TabsContent>

          <TabsContent value="anchor" className="h-full m-0 overflow-auto">
            {blockchainAnchor ? (
              <div className="p-4 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-[10px] font-medium px-1.5 py-0.5 rounded",
                        blockchainAnchor.status === "confirmed" &&
                          "bg-success/20 text-success",
                        blockchainAnchor.status === "pending" &&
                          "bg-warning/20 text-warning",
                        blockchainAnchor.status === "failed" &&
                          "bg-destructive/20 text-destructive"
                      )}
                    >
                      {blockchainAnchor.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-console-foreground/60 capitalize">
                      {blockchainAnchor.chain}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-[10px] text-console-foreground/50 uppercase tracking-wider mb-1">
                        Transaction Hash
                      </p>
                      <p className="text-xs font-mono text-console-foreground break-all">
                        {blockchainAnchor.transactionHash}
                      </p>
                    </div>

                    {blockchainAnchor.credentialHash && (
                      <div>
                        <p className="text-[10px] text-console-foreground/50 uppercase tracking-wider mb-1">
                          Credential Hash
                        </p>
                        <p className="text-xs font-mono text-console-foreground break-all">
                          {blockchainAnchor.credentialHash}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-[10px] text-console-foreground/50 uppercase tracking-wider mb-1">
                        Block Number
                      </p>
                      <p className="text-xs font-mono text-console-foreground">
                        {blockchainAnchor.blockNumber.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-console-foreground/50 uppercase tracking-wider mb-1">
                        Timestamp
                      </p>
                      <p className="text-xs font-mono text-console-foreground">
                        {new Date(blockchainAnchor.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <a
                  href="#"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  View on Explorer
                  <ChevronRight className="w-3 h-3" />
                </a>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3 p-4">
                <div className="text-console-foreground/50 text-sm text-center">
                  Blockchain anchoring disabled for this credential
                </div>
                <p className="text-console-foreground/30 text-xs text-center">
                  Credential uses standard W3C DID & VC verification
                </p>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>

      {/* Footer */}
      <div className="h-8 px-4 border-t border-console-muted flex items-center shrink-0">
        <span className="text-[10px] text-console-foreground/40">
          Read-only • Real-time updates
        </span>
      </div>
    </aside>
  );
}
