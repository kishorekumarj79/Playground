import { Shield, Check, X, AlertCircle, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VerificationRequest, VerifiableCredential } from "@/types/playground";

interface WalletVerificationConsentProps {
    request: VerificationRequest;
    credential: VerifiableCredential | null;
    onAccept: () => void;
    onReject: () => void;
    devModeEnabled?: boolean;
}

export function WalletVerificationConsent({
    request,
    credential,
    onAccept,
    onReject,
    devModeEnabled = false,
}: WalletVerificationConsentProps) {
    const getAttributeValue = (attr: string) => {
        if (!credential) return "N/A";
        const subject = credential.credentialSubject as Record<string, any>;
        return subject[attr] || "Not provided";
    };

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex-1 p-6 space-y-6 overflow-auto">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                        <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                        Credential Requested
                    </h3>
                    <p className="text-sm text-center text-muted-foreground">
                        A verifier has requested to view your {credential?.name || "Credential"}
                    </p>
                </div>

                {/* Request Details */}
                <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-3">
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-medium text-muted-foreground">Verifier</span>
                        <span className="text-sm font-semibold text-foreground text-right">
                            {request.name}
                        </span>
                    </div>
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-medium text-muted-foreground">Purpose</span>
                        <span className="text-sm text-foreground text-right">
                            {request.description}
                        </span>
                    </div>
                </div>

                {/* Requested Attributes */}
                <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Data Sharing Details
                    </h4>
                    <div className="space-y-2">
                        {/* Shared Attributes */}
                        {request.requiredAttributes.map((attr) => (
                            <div
                                key={attr}
                                className="p-3 rounded-lg border border-primary/20 bg-primary/5 space-y-1"
                            >
                                <div className="flex items-center gap-2">
                                    <Check className="w-3.5 h-3.5 text-primary" />
                                    <span className="text-xs font-medium text-primary capitalize">
                                        {attr.replace(/([A-Z])/g, " $1").trim()}
                                    </span>
                                    <span className="ml-auto text-[8px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-bold uppercase">
                                        To be Shared
                                    </span>
                                </div>
                                <div className="pl-5.5 text-sm font-semibold truncate capitalize text-foreground">
                                    {getAttributeValue(attr)}
                                </div>
                            </div>
                        ))}

                        {/* Non-Shared Attributes (for transparency) */}
                        {credential && Object.keys(credential.credentialSubject).filter(key =>
                            key !== 'id' && key !== 'schemaId' && !request.requiredAttributes.includes(key) && !request.optionalAttributes.includes(key)
                        ).map((attr) => (
                            <div
                                key={attr}
                                className="p-3 rounded-lg border border-border bg-muted/20 opacity-40 grayscale space-y-1"
                            >
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <EyeOff className="w-3.5 h-3.5" />
                                    <span className="text-xs font-medium capitalize">
                                        {attr.replace(/([A-Z])/g, " $1").trim()}
                                    </span>
                                    <span className="ml-auto text-[8px] bg-muted-foreground/10 text-muted-foreground px-1.5 py-0.5 rounded-full font-bold uppercase">
                                        Not Shared
                                    </span>
                                </div>
                                <div className="pl-5.5 text-sm font-medium truncate blur-[2px] pointer-events-none">
                                    ••••••••
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Warning */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p className="text-[11px] leading-tight">
                        Only the requested data will be shared. No other personal information is revealed.
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-border grid grid-cols-2 gap-3">
                <Button
                    variant="outline"
                    onClick={onReject}
                    className="w-full h-11"
                >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                </Button>
                <Button
                    onClick={onAccept}
                    className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                >
                    <Check className="w-4 h-4 mr-2" />
                    Share to Verifier
                </Button>
            </div>
        </div>
    );
}
