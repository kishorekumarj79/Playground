import { Building2, Wallet, ShieldCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/types/playground";

interface RoleSidebarProps {
  currentRole: Role;
  hasCredential: boolean;
  hasWalletCredentials: boolean;
  hasVerificationResult: boolean;
  onRoleChange: (role: Role) => void;
}

const roles: {
  id: Role;
  label: string;
  description: string;
  icon: typeof Building2;
  step: number;
}[] = [
  {
    id: "issuer",
    label: "Issuer",
    description: "Authority Portal",
    icon: Building2,
    step: 1,
  },
  {
    id: "holder",
    label: "Holder",
    description: "Citizen Wallet",
    icon: Wallet,
    step: 2,
  },
  {
    id: "verifier",
    label: "Verifier",
    description: "Service Provider",
    icon: ShieldCheck,
    step: 3,
  },
];

export function RoleSidebar({
  currentRole,
  hasCredential,
  hasWalletCredentials,
  hasVerificationResult,
  onRoleChange,
}: RoleSidebarProps) {
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
    <aside className="w-64 border-r border-border bg-sidebar flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-sidebar-border">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Trust Lifecycle
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Navigate through each role
        </p>
      </div>

      {/* Roles */}
      <nav className="flex-1 p-3 space-y-1">
        {roles.map((role, index) => {
          const status = getRoleStatus(role.id);
          const Icon = role.icon;
          const isActive = status === "active";
          const isCompleted = status === "completed";
          const isLocked = status === "locked";

          return (
            <div key={role.id}>
              <button
                onClick={() => isRoleAccessible(role.id) && onRoleChange(role.id)}
                disabled={isLocked}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200",
                  isActive && "bg-primary text-primary-foreground shadow-sm",
                  isCompleted && "bg-success/10 text-success hover:bg-success/15",
                  !isActive && !isCompleted && !isLocked && "hover:bg-sidebar-accent text-sidebar-foreground",
                  isLocked && "opacity-50 cursor-not-allowed text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                    isActive && "bg-primary-foreground/20",
                    isCompleted && "bg-success/20",
                    !isActive && !isCompleted && "bg-sidebar-accent"
                  )}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-xs font-medium",
                        isActive && "text-primary-foreground/70",
                        !isActive && "text-muted-foreground"
                      )}
                    >
                      Step {role.step}
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] font-medium text-success bg-success/10 px-1.5 py-0.5 rounded">
                        Done
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium truncate">{role.label}</p>
                  <p
                    className={cn(
                      "text-xs truncate",
                      isActive && "text-primary-foreground/80",
                      !isActive && "text-muted-foreground"
                    )}
                  >
                    {role.description}
                  </p>
                </div>
              </button>

              {/* Connector */}
              {index < roles.length - 1 && (
                <div className="flex items-center justify-center h-4 ml-6">
                  <ArrowRight
                    className={cn(
                      "w-3 h-3 rotate-90",
                      isCompleted ? "text-success" : "text-border"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Context Info */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Current Context</p>
          <p>
            Role:{" "}
            <span className="text-foreground capitalize">{currentRole}</span>
          </p>
          <p>
            Status:{" "}
            <span className="text-foreground">
              {hasVerificationResult 
                ? "Verified" 
                : hasWalletCredentials 
                  ? "In Wallet" 
                  : hasCredential 
                    ? "Credential Issued" 
                    : "Ready to Issue"}
            </span>
          </p>
        </div>
      </div>
    </aside>
  );
}
