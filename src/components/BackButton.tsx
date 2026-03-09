import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type BackButtonProps = {
  label?: string;
  className?: string;
};

/** Goes to the previous page in history (where the user last clicked from). */
export default function BackButton({ label = "Back", className = "" }: BackButtonProps) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={`inline-flex items-center gap-2 text-muted-foreground text-sm font-body hover:text-primary transition-colors ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  );
}
