import { X, FileJson, Key, Link2, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import type { DIDDocument, VerifiableCredential, BlockchainAnchor, ConsoleEvent } from "@/types/playground";

interface MobileDevConsoleProps {
  isOpen: boolean;
  didDocument: DIDDocument | null;
  credential: VerifiableCredential | null;
  blockchainAnchor: BlockchainAnchor | null;
  consoleEvents: ConsoleEvent[];
  onClose: () => void;
}

export function MobileDevConsole({
  isOpen,
  didDocument,
  credential,
  blockchainAnchor,
  consoleEvents,
  onClose,
}: MobileDevConsoleProps) {
  const formatJson = (obj: unknown) => {
    return JSON.stringify(obj, null, 2);
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle className="text-sm font-semibold">Developer Console</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="px-4 pb-4 overflow-hidden">
          <Tabs defaultValue="did" className="h-full">
            <TabsList className="w-full grid grid-cols-4 h-9">
              <TabsTrigger value="did" className="text-xs gap-1">
                <Key className="w-3 h-3" />
                DID
              </TabsTrigger>
              <TabsTrigger value="vc" className="text-xs gap-1">
                <FileJson className="w-3 h-3" />
                VC
              </TabsTrigger>
              <TabsTrigger value="anchor" className="text-xs gap-1">
                <Link2 className="w-3 h-3" />
                Anchor
              </TabsTrigger>
              <TabsTrigger value="events" className="text-xs gap-1">
                <Terminal className="w-3 h-3" />
                Events
              </TabsTrigger>
            </TabsList>

            <div className="mt-3 max-h-[50vh] overflow-auto rounded-lg bg-[hsl(var(--console-bg))] p-3">
              <TabsContent value="did" className="m-0">
                {didDocument ? (
                  <pre className="text-xs text-[hsl(var(--console-foreground))] whitespace-pre-wrap break-all">
                    {formatJson(didDocument)}
                  </pre>
                ) : (
                  <p className="text-xs text-[hsl(var(--console-muted))]">
                    No DID document generated yet
                  </p>
                )}
              </TabsContent>

              <TabsContent value="vc" className="m-0">
                {credential ? (
                  <pre className="text-xs text-[hsl(var(--console-foreground))] whitespace-pre-wrap break-all">
                    {formatJson(credential)}
                  </pre>
                ) : (
                  <p className="text-xs text-[hsl(var(--console-muted))]">
                    No credential issued yet
                  </p>
                )}
              </TabsContent>

              <TabsContent value="anchor" className="m-0">
                {blockchainAnchor ? (
                  <pre className="text-xs text-[hsl(var(--console-foreground))] whitespace-pre-wrap break-all">
                    {formatJson(blockchainAnchor)}
                  </pre>
                ) : (
                  <p className="text-xs text-[hsl(var(--console-muted))]">
                    Blockchain anchoring disabled for this credential
                  </p>
                )}
              </TabsContent>

              <TabsContent value="events" className="m-0">
                {consoleEvents.length > 0 ? (
                  <div className="space-y-2">
                    {consoleEvents.map((event, index) => (
                      <div key={index} className="text-xs">
                        <span className="text-[hsl(var(--console-key))]">{event.type}</span>
                        <span className="text-[hsl(var(--console-muted))]"> - </span>
                        <span className="text-[hsl(var(--console-foreground))]">{event.message}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[hsl(var(--console-muted))]">
                    No events logged yet
                  </p>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
