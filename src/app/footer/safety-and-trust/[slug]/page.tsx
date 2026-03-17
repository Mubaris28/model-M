import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/lib/router-next";

function WhatYouShouldKnow() {
  return (
    <div className="mt-10 space-y-12 font-body text-sm text-muted-foreground leading-relaxed">
      <section>
        <h2 className="font-display text-2xl text-foreground mb-4">Model Agreement</h2>
        <p>A Model Agreement is a contract between a professional (photographer, brand, etc.) and a model once a booking is confirmed. It helps both sides know exactly what to expect and protects everyone&apos;s rights.</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card magazine-border p-6">
            <h3 className="font-display text-lg text-foreground mb-2">Unpaid / Collaboration Projects (TFP)</h3>
            <p>Used for non-commercial projects. The model is not paid with money but receives photos, videos, or products instead. Often done for self-promotion or portfolio building.</p>
          </div>
          <div className="bg-card magazine-border p-6">
            <h3 className="font-display text-lg text-foreground mb-2">Paid Jobs</h3>
            <p>Used for paid projects. Includes important details such as payment, usage rights, and project conditions.</p>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="font-display text-lg text-foreground mb-3">Benefits</h3>
          <ul className="space-y-1 list-disc list-inside">
            <li>Transparency between both parties</li>
            <li>Protection of models&apos; image rights and payments</li>
            <li>Builds trust and saves time</li>
          </ul>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card magazine-border p-6">
            <h3 className="font-display text-lg text-foreground mb-2">For Models &amp; Talent</h3>
            <ul className="space-y-1 list-disc list-inside">
              <li>Know how your images/videos will be used and how much you&apos;ll be paid</li>
              <li>Even in collaborations, a contract protects your image rights</li>
              <li>Helps you identify serious professionals who follow proper procedures</li>
            </ul>
          </div>
          <div className="bg-card magazine-border p-6">
            <h3 className="font-display text-lg text-foreground mb-2">For Professionals</h3>
            <ul className="space-y-1 list-disc list-inside">
              <li>Ensures the model is committed to the project</li>
              <li>Keeps everything organized and professional</li>
              <li>Reduces risk and saves time during project preparation</li>
            </ul>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="font-display text-lg text-foreground mb-3">How It Works</h3>
          <ol className="space-y-2 list-decimal list-inside">
            <li>The professional fills in all project details and signs the Model Agreement (includes project description, date, location, payment, image rights, client info).</li>
            <li>The model receives and signs the contract.</li>
            <li>Once both have signed, the professional receives a copy by email.</li>
          </ol>
          <p className="mt-4 text-xs">Model agreements are available for all models applying to castings or booked directly on ModelManagement.mu. Models must be over 18 or have a legal guardian to sign. ModelManagement.mu only provides the platform; the contract is between the users.</p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl text-foreground mb-4">Digital Reservation</h2>
        <p>Online Bookings allow professionals to book models directly through ModelManagement.mu. Both sides are supported and protected throughout the process.</p>
        <ul className="mt-4 space-y-1 list-disc list-inside">
          <li>Safe and secure system</li>
          <li>No agents or middlemen taking commissions</li>
          <li>Our team offers support before, during, and after the shoot</li>
          <li>Easy access to models for all types of projects</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-2xl text-foreground mb-4">Evaluate Your Collaboration</h2>
        <p>All verified members can leave reviews about others they&apos;ve worked with. Our moderation team checks every review to make sure it&apos;s real and respectful.</p>
        <ul className="mt-4 space-y-1 list-disc list-inside">
          <li>Reviews help others see your professionalism and reliability</li>
          <li>Positive feedback builds trust and visibility</li>
          <li>Asking for reviews helps you grow your reputation faster</li>
        </ul>
        <p className="mt-4 text-xs">Go to a member&apos;s profile → &quot;Leave a Review&quot; → Rate professionalism, experience, communication (1–5 stars) → Write a short comment → Once approved, the review appears on the user&apos;s profile.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl text-foreground mb-4">Secure Communication System</h2>
        <p>ModelManagement.mu provides a messaging system that is monitored to protect users.</p>
        <div className="mt-4 bg-card magazine-border p-6">
          <h3 className="font-display text-lg text-foreground mb-2">Why You Shouldn&apos;t Move Conversations Elsewhere</h3>
          <ul className="space-y-1 list-disc list-inside">
            <li>We can&apos;t verify the person&apos;s identity outside the platform</li>
            <li>Our system has tools to detect spam and scams that other apps don&apos;t</li>
            <li>If you continue conversations outside ModelManagement.mu, we won&apos;t be able to protect you</li>
          </ul>
        </div>
        <p className="mt-4">With the premium version, you can rate every chat: <strong className="text-foreground">Great</strong> – everything went well; <strong className="text-foreground">Regular</strong> – okay experience; <strong className="text-foreground">Bad</strong> – report unsafe or suspicious behavior. If you rate someone as &quot;Bad,&quot; our team investigates immediately. Your feedback is private.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl text-foreground mb-4">Professional Authentication</h2>
        <p>Every professional or casting provider is manually verified by our team. We check their website or social media to confirm authenticity and ownership. If you have doubts about a member or an offer, contact <a href="mailto:info@modelmanagement.mu" className="text-primary hover:underline">info@modelmanagement.mu</a>; our team will recheck the account.</p>
      </section>
    </div>
  );
}

function AvoidScammers() {
  return (
    <div className="mt-10 space-y-8 font-body text-sm text-muted-foreground leading-relaxed">
      <p>It can happen that some scammers pretend to be photographers, agencies, or agents. But if you use ModelManagement.mu, you already have tools in place that will protect you.</p>
      <section>
        <h2 className="font-display text-2xl text-foreground mb-4">Tips to Stay Safe</h2>
        <ul className="space-y-3 list-disc list-inside">
          <li>Always use the platform to communicate and sign contracts</li>
          <li>Do not share personal information outside the site</li>
          <li>Never send money or accept jobs that seem suspicious</li>
          <li>Trust only verified members and official bookings</li>
        </ul>
      </section>
      <div className="bg-card magazine-border p-6">
        <p>For more information, read our safety guide on <Link to="/footer/safety-and-trust/scamming-examples" className="text-primary hover:underline">how to recognize scams and stay safe</Link>.</p>
      </div>
    </div>
  );
}

function ScammingExamples() {
  return (
    <div className="mt-10 space-y-8 font-body text-sm text-muted-foreground leading-relaxed">
      <p>Unfortunately, scammers sometimes try to take advantage of models online. Here are warning signs to help you recognize and avoid them:</p>
      <section>
        <h2 className="font-display text-2xl text-foreground mb-4">Things to Keep in Mind</h2>
        <ul className="space-y-3 list-disc list-inside">
          <li>The email looks strange, unprofessional, or just doesn&apos;t feel right</li>
          <li>The &quot;professional&quot; offers very high payment or a deal that seems too good to be true</li>
          <li>Someone asks for nude or revealing photos to move to the &quot;next stage&quot; of a casting</li>
          <li>You are asked to send money upfront for any reason (e.g. registration, photoshoot, travel)</li>
        </ul>
      </section>
      <div className="bg-card magazine-border p-6 border-primary/30">
        <p className="text-foreground font-medium">⚠️ Never send personal or private photos and never agree to pay for castings or jobs.</p>
        <p className="mt-2">If you suspect something, contact our support team immediately at <a href="mailto:info@modelmanagement.mu" className="text-primary hover:underline">info@modelmanagement.mu</a>.</p>
      </div>
      <p>ModelManagement.mu provides safety tools to protect users from these scams. Always stay on the platform for all communication and contracts.</p>
    </div>
  );
}

function CodeOfConduct() {
  return (
    <div className="mt-10 space-y-8 font-body text-sm text-muted-foreground leading-relaxed">
      <p>At ModelManagement.mu, we value respect and professionalism. All users must follow our Code of Conduct to keep this community trustworthy.</p>
      <section className="bg-card magazine-border p-8">
        <h2 className="font-display text-2xl text-foreground mb-4">Models &amp; Talent</h2>
        <ul className="space-y-2 list-disc list-inside">
          <li>Always be respectful and tolerant towards everyone, regardless of race, gender, nationality, or beliefs</li>
          <li>Only upload your own images and do not post photos or videos of other people</li>
          <li>Do not share erotic or pornographic content; this is strictly forbidden</li>
          <li>When you apply for a job, follow up with the professional and reply to messages, even if you are not available</li>
          <li>If you are confirmed for a job, you must show up on time and be prepared</li>
          <li>If you cannot attend a shoot, inform the professional as soon as possible so they can find someone else</li>
          <li>If any professional asks you to do something that makes you uncomfortable or is not acceptable, you have the right to say no and refuse the offer</li>
          <li>If a project includes artistic nudity, the professional must inform you clearly and get your written consent in advance</li>
        </ul>
      </section>
      <section className="bg-card magazine-border p-8">
        <h2 className="font-display text-2xl text-foreground mb-4">Professionals</h2>
        <ul className="space-y-2 list-disc list-inside">
          <li>Always be respectful and tolerant towards all community members, without discrimination</li>
          <li>If you are interested in a model, follow up professionally and keep communication clear</li>
          <li>Treat all models with respect and professionalism during every interaction</li>
          <li>Do not ask for nudity during online or video castings; full or partial nudity is not allowed</li>
          <li>Answer all questions that a model might have clearly and honestly</li>
          <li>Never ask models for money upfront</li>
          <li>Do not post erotic or pornographic castings</li>
        </ul>
      </section>
      <p>By following this Code of Conduct, you help make ModelManagement.mu a safe and trustworthy space for everyone in the modeling industry.</p>
    </div>
  );
}

const pageContent: Record<string, { title: string; component: React.FC }> = {
  "what-you-should-know": { title: "The Essentials to Know", component: WhatYouShouldKnow },
  "avoid-scammers": { title: "Safety Guidelines", component: AvoidScammers },
  "scamming-examples": { title: "Scamming Examples", component: ScammingExamples },
  "code-of-conduct": { title: "Our Values", component: CodeOfConduct },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SafetySubPage({ params }: Props) {
  const resolved = await params;
  const slug = resolved?.slug ?? "";
  const page = pageContent[slug];

  if (!page) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4 md:px-6 max-w-3xl">
          <Link to="/footer/safety-and-trust" className="text-primary font-body text-xs tracking-wider uppercase hover:underline mb-8 inline-block">← Back to Safety &amp; Trust</Link>
          <p className="text-muted-foreground font-body text-sm mt-8">Page not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const Content = page.component;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <Link to="/footer/safety-and-trust" className="text-primary font-body text-xs tracking-wider uppercase hover:underline mb-8 inline-block">← Back to Safety &amp; Trust</Link>
          <h1 className="font-display text-6xl md:text-8xl line-accent">{page.title}</h1>
          <Content />
        </div>
      </div>
      <Footer />
    </div>
  );
}
