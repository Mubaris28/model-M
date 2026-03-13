import type { Metadata } from "next";
import { Providers } from "./Providers";
import ScrollToTop from "@/components/ScrollToTop";
import Chatbot from "@/components/Chatbot";
import FloatingSocialButtons from "@/components/FloatingSocialButtons";
import NewFeaturePopup from "@/components/NewFeaturePopup";
import ScreenshotProtection from "@/components/ScreenshotProtection";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Model Management Mauritius - Professional Modeling Platform",
  description: "Professional modeling platform for models and talent in Mauritius.",
  openGraph: {
    title: "Model Management Mauritius - Professional Modeling Platform",
    description: "Professional modeling platform for models and talent in Mauritius.",
    images: [{ url: "/images/og-hero.jpg", width: 1200, height: 630, alt: "Model Management Mauritius" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Model Management Mauritius - Professional Modeling Platform",
    description: "Professional modeling platform for models and talent in Mauritius.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ScreenshotProtection />
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
