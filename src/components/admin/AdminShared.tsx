import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export const StatCard = ({ label, value, icon: Icon, isWarning }: { label: string, value: string | number, icon: LucideIcon, isWarning?: boolean }) => (
    <div className="p-6 border border-white/5 bg-neutral-900/10 rounded-sm hover:bg-neutral-900/20 transition-colors group">
        <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{label}</span>
            <Icon className={cn("w-4 h-4", isWarning ? "text-red-500/50" : "text-neutral-700 group-hover:text-white transition-colors")} />
        </div>
        <div className="text-3xl md:text-4xl font-light tracking-tighter text-white">
            {value}
        </div>
    </div>
);

export const ActionButton = ({ onClick, active, icon: Icon, variant = "default" }: { onClick?: (e?: any) => void, active?: boolean, icon: LucideIcon, variant?: "default" | "danger" }) => (
    <button
        onClick={onClick}
        className={cn(
            "p-2 rounded-sm transition-all duration-200",
            variant === "danger"
                ? "text-neutral-600 hover:text-red-500 hover:bg-red-500/10"
                : active
                    ? "text-white bg-white/10"
                    : "text-neutral-600 hover:text-white hover:bg-white/5"
        )}
    >
        <Icon className="w-4 h-4" />
    </button>
);

export const SectionHeader = ({ title, subtitle, children }: { title: string, subtitle: string, children?: React.ReactNode }) => (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
            <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">// {subtitle}</p>
            <h1 className="text-4xl font-medium tracking-tighter text-white">{title}</h1>
        </div>
        {children}
    </div>
);

export const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
);
