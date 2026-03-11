import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CompanyDetailsPage() {
  const year = new Date().getFullYear();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Legal</p>
          <h1 className="font-display text-6xl md:text-8xl line-accent mb-12">Company Details</h1>
          <div className="space-y-6 font-body text-sm text-muted-foreground">
            <p><span className="text-foreground font-medium">Company name:</span> Flash Communications Ltd.</p>
            <p><span className="text-foreground font-medium">Address:</span> 2nd Floor, Unity House, Rue Du Savoir, Cybercity, Ebene, Mauritius</p>
            <p><span className="text-foreground font-medium">Registration:</span> VAT Number: 27261152 | Company Registration Number: C1412073</p>
            <p><span className="text-foreground font-medium">Website:</span> <a href="https://www.theflashgroups.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">theflashgroups.com</a></p>
            <p className="pt-8 border-t border-border">© {year} Model Management Mauritius. All rights reserved.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
