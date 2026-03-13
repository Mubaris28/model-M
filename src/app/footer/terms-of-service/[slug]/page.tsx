import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/lib/router-next";

const slugMeta: Record<string, { title: string; audience: string }> = {
  models: { title: "Models", audience: "models" },
  agencies: { title: "Agencies", audience: "agencies" },
  agents: { title: "Agents", audience: "agents" },
  professionals: { title: "Other Industry Professionals", audience: "other industry professionals" },
};

function SharedDefinitions() {
  return (
    <section>
      <h2 className="font-display text-xl text-foreground mb-4">A. Definitions</h2>
      <ul className="space-y-3 list-none">
        {[
          ["Agreed Date", "The date on which the booking or collaboration is confirmed by both parties."],
          ["Agreed Fee", "The total compensation agreed upon for a paid booking."],
          ["Booking System", "The online reservation and agreement tools provided by MODELMANAGEMENT.MU."],
          ["B-Models", "Models registered and active on the MODELMANAGEMENT.MU platform."],
          ["B-Professionals", "Verified professional users (photographers, brands, agencies, etc.) registered on the platform."],
          ["GTCs", "General Terms and Conditions governing use of the Website."],
          ["Models", "Individuals registered as models or talent on MODELMANAGEMENT.MU."],
          ["Professionals", "Businesses or individuals registered as industry professionals on MODELMANAGEMENT.MU."],
          ["Start Date", "The date on which a user's registration or membership becomes active."],
          ["Total Price", "The full amount payable for a booking, inclusive of all applicable fees."],
          ["User", "Any person or entity that accesses or uses the MODELMANAGEMENT.MU website."],
          ["Website", "The platform accessible at www.modelmanagement.mu and all associated services."],
        ].map(([term, def]) => (
          <li key={term} className="text-sm">
            <span className="text-foreground font-medium">{term}</span>
            <span className="text-muted-foreground"> — {def}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SharedUseOfWebsite({ audience }: { audience: string }) {
  return (
    <section>
      <h2 className="font-display text-xl text-foreground mb-4">B. Use of Website</h2>
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <div>
          <h3 className="font-display text-base text-foreground mb-2">1. Subject Matter</h3>
          <p>1.1 These Terms govern your use of MODELMANAGEMENT.MU as {audience}.</p>
          <p className="mt-2">1.2 By registering on the platform, you confirm that you have read, understood, and agreed to these Terms in their entirety.</p>
          <p className="mt-2">1.3 MODELMANAGEMENT.MU reserves the right to update these Terms at any time. Continued use of the platform after updates constitutes acceptance.</p>
          <p className="mt-2">1.4 These Terms are governed by the laws of Mauritius. Any dispute shall be subject to the exclusive jurisdiction of the Courts of Mauritius.</p>
        </div>
        <div>
          <h3 className="font-display text-base text-foreground mb-2">2. Registration</h3>
          <p>2.1 You must be at least 18 years of age to register. Minors require consent from a parent or legal guardian.</p>
          <p className="mt-2">2.2 You agree to provide accurate, current, and complete information during registration.</p>
          <p className="mt-2">2.3 You are responsible for maintaining the confidentiality of your account credentials.</p>
          <p className="mt-2">2.4 MODELMANAGEMENT.MU reserves the right to suspend or terminate accounts that violate these Terms.</p>
          <p className="mt-2">2.5 You may not transfer or assign your account to any third party.</p>
          <p className="mt-2">2.6 Registration is personal and non-transferable.</p>
          <p className="mt-2">2.7 MODELMANAGEMENT.MU may verify your identity and professional credentials at any time.</p>
          <p className="mt-2">2.8 You agree to notify MODELMANAGEMENT.MU immediately of any unauthorized use of your account.</p>
        </div>
      </div>
    </section>
  );
}

function ModelsTerms() {
  return (
    <div className="space-y-10 font-body text-sm text-muted-foreground leading-relaxed">
      <p>
        These Terms of Service constitute a legally binding agreement between you (&quot;Model&quot; or &quot;User&quot;) and{" "}
        <strong className="text-foreground">MODEL MANAGEMENT DOT MU</strong>, a company with registered address at 2nd Floor Unity House, Rue du Savoir, Cybercity, Ebene, Mauritius 72201.
        By accessing or using this platform, you agree to be bound by these Terms.
      </p>
      <SharedDefinitions />
      <SharedUseOfWebsite audience="a model or talent" />
      <section>
        <h2 className="font-display text-xl text-foreground mb-4">C. Obligations of the Model</h2>
        <div className="space-y-3">
          <p>3.1 You agree to maintain an accurate and up-to-date profile, including current photos that are genuinely representative of your appearance.</p>
          <p>3.2 You must only upload photos and content for which you hold the rights or have explicit permission to use.</p>
          <p>3.3 You agree to respond promptly and professionally to all messages, casting applications, and booking requests.</p>
          <p>3.4 You must honor confirmed bookings. Failure to attend without reasonable notice may result in account suspension.</p>
          <p>3.5 You agree not to solicit or accept bookings outside of the platform in order to circumvent any fees or protections offered by MODELMANAGEMENT.MU.</p>
        </div>
      </section>
      <section>
        <h2 className="font-display text-xl text-foreground mb-4">D. Exclusive Model Collaboration</h2>
        <div className="space-y-3">
          <p><strong className="text-foreground">Remuneration:</strong> For paid bookings, payment terms are agreed in advance and documented in the Model Agreement. MODELMANAGEMENT.MU does not act as a payment intermediary.</p>
          <p><strong className="text-foreground">Platform Booking Exclusivity:</strong> All bookings initiated through the platform must be completed through the platform. You may not redirect professionals to external booking systems.</p>
          <p><strong className="text-foreground">Image Rights Assignment:</strong> By uploading content to MODELMANAGEMENT.MU, you grant the platform a non-exclusive, royalty-free licence to display your profile content for the purpose of promoting you to industry professionals.</p>
          <p><strong className="text-foreground">Photograph Usage Conditions:</strong> The use of your images beyond what is agreed in the Model Agreement is prohibited. You retain ownership of your images at all times.</p>
          <p><strong className="text-foreground">Data Protection:</strong> Your personal data is processed in accordance with the Mauritius Data Protection Act 2017 and our Privacy Policy.</p>
          <p><strong className="text-foreground">Confidentiality:</strong> You agree to keep confidential any proprietary information disclosed to you by MODELMANAGEMENT.MU or by professionals through the platform.</p>
        </div>
      </section>
      <section className="bg-card magazine-border p-6">
        <p>For any questions regarding these Terms, contact us at <a href="mailto:info@modelmanagement.mu" className="text-primary hover:underline">info@modelmanagement.mu</a></p>
      </section>
    </div>
  );
}

function AgenciesTerms() {
  return (
    <div className="space-y-10 font-body text-sm text-muted-foreground leading-relaxed">
      <p>
        These Terms of Service constitute a legally binding agreement between you (&quot;Agency&quot;) and{" "}
        <strong className="text-foreground">MODEL MANAGEMENT DOT MU</strong>, 2nd Floor Unity House, Rue du Savoir, Cybercity, Ebene, Mauritius 72201.
        By registering as an agency on this platform, you agree to be bound by these Terms.
      </p>
      <SharedDefinitions />
      <SharedUseOfWebsite audience="an agency" />
      <section>
        <h2 className="font-display text-xl text-foreground mb-4">C. Agency Obligations</h2>
        <div className="space-y-3">
          <p>3.1 Agencies must provide accurate company information including legal name, registration number, and contact details.</p>
          <p>3.2 You agree to treat all models on the platform with respect and professionalism at all times.</p>
          <p>3.3 Agencies may not charge models any upfront fees for registration, representation, or placement through this platform.</p>
          <p>3.4 All communications with models must remain within the platform&apos;s messaging system.</p>
          <p>3.5 Agencies agree to honour all confirmed bookings and provide timely, accurate payment to models as per agreed terms.</p>
        </div>
      </section>
      <section>
        <h2 className="font-display text-xl text-foreground mb-4">D. Castings &amp; Compliance</h2>
        <div className="space-y-3">
          <p>All casting calls must accurately describe the project, compensation, and usage rights. Misleading or inappropriate castings will result in immediate account suspension.</p>
          <p>Agencies must comply with all applicable Mauritian laws relating to employment, data protection, and consumer protection.</p>
          <p>MODELMANAGEMENT.MU reserves the right to remove any casting or agency profile that violates these Terms or community standards.</p>
        </div>
      </section>
      <section className="bg-card magazine-border p-6">
        <p>For queries, contact <a href="mailto:info@modelmanagement.mu" className="text-primary hover:underline">info@modelmanagement.mu</a></p>
      </section>
    </div>
  );
}

function AgentsTerms() {
  return (
    <div className="space-y-10 font-body text-sm text-muted-foreground leading-relaxed">
      <p>
        These Terms of Service constitute a legally binding agreement between you (&quot;Agent&quot;) and{" "}
        <strong className="text-foreground">MODEL MANAGEMENT DOT MU</strong>, 2nd Floor Unity House, Rue du Savoir, Cybercity, Ebene, Mauritius 72201.
        By registering as an agent on this platform, you agree to be bound by these Terms.
      </p>
      <SharedDefinitions />
      <SharedUseOfWebsite audience="an agent" />
      <section>
        <h2 className="font-display text-xl text-foreground mb-4">C. Agent Obligations</h2>
        <div className="space-y-3">
          <p>3.1 Agents must disclose any commercial relationship they hold with models they represent on the platform.</p>
          <p>3.2 Agents may not simultaneously represent a model on this platform while pursuing bookings for that model outside of MODELMANAGEMENT.MU in a way that circumvents platform fees.</p>
          <p>3.3 Agents agree to act in the best interests of the models they represent and to adhere to all applicable professional standards.</p>
          <p>3.4 Agents must not misrepresent a model&apos;s appearance, skills, or availability to potential clients.</p>
          <p>3.5 Commission structures and agent fees must be agreed in writing with the model prior to any booking being confirmed.</p>
        </div>
      </section>
      <section>
        <h2 className="font-display text-xl text-foreground mb-4">D. Conduct &amp; Compliance</h2>
        <p>Agents must comply with the platform&apos;s Code of Conduct, maintain professionalism in all communications, and report any suspicious activity or safety concerns to info@modelmanagement.mu immediately.</p>
      </section>
      <section className="bg-card magazine-border p-6">
        <p>For queries, contact <a href="mailto:info@modelmanagement.mu" className="text-primary hover:underline">info@modelmanagement.mu</a></p>
      </section>
    </div>
  );
}

function ProfessionalsTerms() {
  return (
    <div className="space-y-10 font-body text-sm text-muted-foreground leading-relaxed">
      <p>
        These Terms of Service constitute a legally binding agreement between you (&quot;Professional&quot;) and{" "}
        <strong className="text-foreground">MODEL MANAGEMENT DOT MU</strong>, 2nd Floor Unity House, Rue du Savoir, Cybercity, Ebene, Mauritius 72201.
        &quot;Professionals&quot; includes photographers, brands, casting directors, advertising agencies, production companies, media, showrooms, hair and makeup artists, and PR/Events companies.
        By registering on this platform, you agree to be bound by these Terms.
      </p>
      <SharedDefinitions />
      <SharedUseOfWebsite audience="an industry professional" />
      <section>
        <h2 className="font-display text-xl text-foreground mb-4">C. Professional Obligations</h2>
        <div className="space-y-3">
          <p>3.1 You agree to provide accurate and verifiable information about your business, including company name, domain, and professional credentials.</p>
          <p>3.2 All project descriptions, casting calls, and job offers must be honest, accurate, and compliant with applicable laws.</p>
          <p>3.3 You must never request nudity during video castings or initial stages of contact. Any project involving artistic nudity must be clearly disclosed in the casting description, and written consent must be obtained from the model.</p>
          <p>3.4 You must not ask models to pay any fees or expenses in connection with a booking or casting.</p>
          <p>3.5 All communications with models must take place within the platform messaging system until a booking is formally confirmed.</p>
        </div>
      </section>
      <section>
        <h2 className="font-display text-xl text-foreground mb-4">D. Image Usage &amp; Intellectual Property</h2>
        <div className="space-y-3">
          <p>You must obtain a signed Model Agreement before using any images or footage of a model for commercial or editorial purposes.</p>
          <p>Usage rights must be clearly defined in the Model Agreement and may not exceed the scope agreed with the model.</p>
          <p>MODELMANAGEMENT.MU is not responsible for any disputes arising from unauthorized use of a model&apos;s image or likeness.</p>
        </div>
      </section>
      <section>
        <h2 className="font-display text-xl text-foreground mb-4">E. Compliance &amp; Conduct</h2>
        <p>You agree to comply with all applicable laws including data protection, employment, and intellectual property regulations in Mauritius and any jurisdiction in which you operate. Violations of these Terms or the platform&apos;s Code of Conduct may result in immediate account suspension and legal action where appropriate.</p>
      </section>
      <section className="bg-card magazine-border p-6">
        <p>For queries, contact <a href="mailto:info@modelmanagement.mu" className="text-primary hover:underline">info@modelmanagement.mu</a></p>
      </section>
    </div>
  );
}

const pageComponents: Record<string, React.FC> = {
  models: ModelsTerms,
  agencies: AgenciesTerms,
  agents: AgentsTerms,
  professionals: ProfessionalsTerms,
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function TermsSubPage({ params }: Props) {
  const resolved = await params;
  const slug = resolved?.slug ?? "";
  const meta = slugMeta[slug];
  const Content = pageComponents[slug];

  if (!meta || !Content) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4 md:px-6 max-w-3xl">
          <Link to="/footer/terms-of-service" className="text-primary font-body text-xs tracking-wider uppercase hover:underline mb-8 inline-block">← Back to Terms of Use</Link>
          <p className="text-muted-foreground font-body text-sm mt-8">Page not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <Link to="/footer/terms-of-service" className="text-primary font-body text-xs tracking-wider uppercase hover:underline mb-8 inline-block">← Back to Terms of Use</Link>
          <h1 className="font-display text-6xl md:text-8xl line-accent">Terms of Service</h1>
          <p className="font-body text-lg text-muted-foreground mt-4">{meta.title}</p>
          <div className="mt-12">
            <Content />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
