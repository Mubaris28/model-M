import { Link } from "@/lib/router-next";
import { CreditCard } from "lucide-react";

const AdminBankTransfersPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/admin" className="text-primary text-sm font-body hover:underline">← Back to Admin</Link>
        </div>
      </div>
      <div className="container mx-auto px-6 py-12">
        <h1 className="font-display text-4xl text-primary mb-2">Payment Verifications</h1>
        <p className="text-muted-foreground font-body mb-8">Review and approve bank transfer & Juice payments.</p>
        <div className="magazine-border p-12 text-center">
          <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-body">Payment submissions will appear here when the feature is connected.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminBankTransfersPage;
