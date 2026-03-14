import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/lib/router-next";
import { modellingAdviceContent } from "@/data/footerModellingAdvice";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ModellingAdviceSubPage({ params }: Props) {
  const resolved = await params;
  const slug = resolved?.slug ?? "";
  const content = modellingAdviceContent[slug];

  if (!content) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4 md:px-6 max-w-3xl">
          <Link to="/footer/modelling-advice" className="text-primary font-body text-xs tracking-wider uppercase hover:underline mb-8 inline-block">← Back to Modelling Advice</Link>
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
          <Link to="/footer/modelling-advice" className="text-primary font-body text-xs tracking-wider uppercase hover:underline mb-8 inline-block">← Back to Modelling Advice</Link>
          <h1 className="font-display text-6xl md:text-8xl line-accent">{content.title}</h1>
          {content.subtitle && (
            <p className="font-body text-lg text-muted-foreground mt-4">{content.subtitle}</p>
          )}
          <p className="text-muted-foreground font-body text-sm mt-8 leading-relaxed">{content.intro}</p>

          <div className="mt-10 space-y-8">
            {content.sections.map((section, i) => (
              <div key={i}>
                {section.title && (
                  <h2 className="font-display text-xl text-foreground mb-2">
                    {i + 1}. {section.title}
                  </h2>
                )}
                <p className="text-muted-foreground font-body text-sm leading-relaxed">{section.body}</p>
                {section.bullets && (
                  <ul className="mt-3 space-y-1 list-disc list-inside text-muted-foreground font-body text-sm">
                    {section.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {content.tip && (
            <div className="mt-10 bg-card magazine-border p-6">
              <p className="text-muted-foreground font-body text-sm leading-relaxed">
                <span className="text-primary font-medium">Tip: </span>{content.tip}
              </p>
            </div>
          )}

          {(content.footerCta || content.buttonLabel) && (
            <div className="mt-10 bg-card magazine-border p-8">
              {content.footerCta && (
                <p className="text-muted-foreground font-body text-sm leading-relaxed mb-6">{content.footerCta}</p>
              )}
              {content.buttonLabel && content.buttonLink && (
                <Link to={content.buttonLink} className="btn-primary inline-flex">{content.buttonLabel}</Link>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
