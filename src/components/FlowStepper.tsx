import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Account", path: "/signup" },
  { id: 2, label: "Choose role", path: "/select-role" },
  { id: 3, label: "Application", path: "/become-model" },
  { id: 4, label: "Review", path: "/verification-pending" },
  { id: 5, label: "Dashboard", path: "/dashboard" },
];

type FlowStepperProps = {
  currentStep: number;
  className?: string;
};

/** Shows registration flow progress (1–5). Use on select-role (2), become-model (3), register (3), verification-pending (4). */
export default function FlowStepper({ currentStep, className = "" }: FlowStepperProps) {
  return (
    <nav aria-label="Progress" className={cn("flex items-center justify-center gap-1 sm:gap-2", className)}>
      {STEPS.map((step, i) => {
        const isComplete = step.id < currentStep;
        const isCurrent = step.id === currentStep;
        return (
          <div key={step.id} className="flex items-center">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-body transition-colors sm:h-9 sm:w-9",
                isComplete && "border-primary bg-primary text-primary-foreground",
                isCurrent && "border-primary bg-primary/10 text-primary",
                !isComplete && !isCurrent && "border-border text-muted-foreground"
              )}
            >
              {isComplete ? <Check className="h-4 w-4" /> : step.id}
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-0.5 h-0.5 w-3 sm:w-6 sm:mx-1",
                  step.id < currentStep ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
