import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type FormFieldProps = {
  label: string;
  error?: string;
  className?: string;
  required?: boolean;
  children: React.ReactNode;
};

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, error, className, required, children }, ref) => (
    <div ref={ref} className={cn("space-y-1.5", className)}>
      <label className="form-label">
        {label}
        {required && <span className="text-primary ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="form-error">{error}</p>}
    </div>
  )
);
FormField.displayName = "FormField";
