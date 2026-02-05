import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface BookDemoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function BookDemoModal({ isOpen, onClose }: BookDemoModalProps) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border-border w-[95vw] md:w-full max-h-[85vh] flex flex-col">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Book a Technical Deep-Dive</DialogTitle>
                    <DialogDescription>
                        Schedule a session with our team to see how Klefki can be integrated into your production systems.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative flex-1 min-h-[300px] md:min-h-[500px] w-full bg-muted/5">
                    {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground bg-background/80 backdrop-blur-[2px] z-10">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <p className="text-sm font-medium">Loading scheduler...</p>
                        </div>
                    )}

                    <iframe
                        src="https://calendly.com/kishore-j-vlinder/30min"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        title="Book a Demo"
                        onLoad={() => setIsLoading(false)}
                        className="w-full h-full min-h-[300px] md:min-h-[500px]"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
