import type { Metadata } from "next";
import { Providers } from "./Providers";
import ScrollToTop from "@/components/ScrollToTop";
import Chatbot from "@/components/Chatbot";
import FloatingSocialButtons from "@/components/FloatingSocialButtons";
import NewFeaturePopup from "@/components/NewFeaturePopup";
import "./globals.css";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.modelmanagement.mu";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Model Management Mauritius | Models, Casting & Talent Agency",
    template: "%s | Model Management Mauritius",
  },
  description: "Mauritius' leading modeling platform. Find models, post castings, and grow your career. Models, photographers, brands & agencies—Mauritius and Indian Ocean.",
  keywords: [
    "model management Mauritius",
    "modeling agency Mauritius",
    "models Mauritius",
    "casting Mauritius",
    "talent agency Mauritius",
    "fashion models Mauritius",
    "photographer models Mauritius",
    "Indian Ocean modeling",
    "model portfolio Mauritius",
    "become a model Mauritius",
  ],
  authors: [{ name: "Model Management Mauritius", url: siteUrl }],
  creator: "Model Management Mauritius",
  publisher: "Model Management Mauritius",
  formatDetection: { email: false, address: false, telephone: false },
  icons: {
    icon: [
      { url: "/images/favicon/32x32px.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon/48x48px.png", sizes: "48x48", type: "image/png" },
    ],
    shortcut: "/images/favicon/48x48px.png",
    apple: [
      { url: "/images/favicon/180x180px.png", sizes: "180x180", type: "image/png" },
      { url: "/images/favicon/192x192-px.png", sizes: "192x192", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: "Model Management Mauritius",
    title: "Model Management Mauritius | Models, Casting & Talent Agency",
    description: "Mauritius' leading modeling platform. Find models, post castings, and grow your career.",
    images: [{ url: "/images/preview/prevlink.png", width: 1200, height: 630, alt: "Model Management Mauritius" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Model Management Mauritius | Models, Casting & Talent",
    description: "Mauritius' leading modeling platform. Models, castings, and talent in the Indian Ocean.",
    images: ["/images/preview/prevlink.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: siteUrl },
  verification: {
    // Add your Google Search Console verification meta when you have the token
    // google: "your-google-verification-code",
  },
  other: {
    "geo.region": "MU",
    "geo.placename": "Mauritius",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Model Management Mauritius",
      url: siteUrl,
      logo: { "@type": "ImageObject", url: `${siteUrl}/images/hero-logo/modelmanagement-logo.png` },
      description: "Mauritius' leading modeling platform connecting models, photographers, brands and agencies.",
      address: { "@type": "PostalAddress", addressLocality: "Ebene", addressCountry: "MU" },
      contactPoint: { "@type": "ContactPoint", email: "info@modelmanagement.mu", contactType: "customer service" },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Model Management Mauritius",
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en-GB",
      potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/models?q={search_term_string}` }, "query-input": "required name=search_term_string" },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Providers>
          <ScrollToTop />
          <div id="main-content">{children}</div>
          <Chatbot />
          <NewFeaturePopup />
          <FloatingSocialButtons />
        </Providers>
      </body>
    </html>
  );
}
