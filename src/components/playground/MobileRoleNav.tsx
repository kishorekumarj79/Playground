import { Building2, Wallet, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/types/playground";

interface MobileRoleNavProps {
  currentRole: Role;
  hasCredential: boolean;
  hasWalletCredentials: boolean;
  hasVerificationResult: boolean;
  onRoleChange: (role: Role) => void;
}

const roles: {
  id: Role;
  label: string;
  icon: typeof Building2;
}[] = [
  { id: "issuer", label: "Issuer", icon: Building2 },
  { id: "holder", label: "Holder", icon: Wallet },
  { id: "verifier", label: "Verifier", icon: ShieldCheck },
];

export function MobileRoleNav({
  currentRole,
  hasCredential,
  hasWalletCredentials,
  hasVerificationResult,
  onRoleChange,
}: MobileRoleNavProps) {
  const isRoleAccessible = (role: Role): boolean => {
    if (role === "issuer") return true;
    if (role === "holder") return hasCredential;
    if (role === "verifier") return hasWalletCredentials;
    return false;
  };

  const getRoleStatus = (role: Role): "active" | "completed" | "locked" | "available" => {
    if (role === currentRole) return "active";
    if (role === "issuer" && hasCredential) return "completed";
    if (role === "holder" && hasWalletCredentials) return "completed";
    if (role === "verifier" && hasVerificationResult) return "completed";
    if (!isRoleAccessible(role)) return "locked";
    return "available";
  };

  return (
    <nav className="flex items-center justify-around bg-sidebar border-b border-border px-2 py-2">
      {roles.map((role) => {
        const status = getRoleStatus(role.id);
        const Icon = role.icon;
        const isActive = status === "active";
        const isCompleted = status === "completed";
        const isLocked = status === "locked";

        return (
          <button
            key={role.id}
            onClick={() => isRoleAccessible(role.id) && onRoleChange(role.id)}
            disabled={isLocked}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all",
              isActive && "bg-primary text-primary-foreground",
              isCompleted && "bg-success/10 text-success",
              !isActive && !isCompleted && !isLocked && "text-muted-foreground",
              isLocked && "opacity-40 cursor-not-allowed"
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{role.label}</span>
            {isCompleted && !isActive && (
              <span className="text-[9px] font-medium">Done</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
