import type { Metadata } from "next";
import { Providers } from "./Providers";
import ScrollToTop from "@/components/ScrollToTop";
import FloatingSocialButtons from "@/components/FloatingSocialButtons";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Model Management Mauritius - Professional Modeling Platform",
  description: "Professional modeling platform for models and talent in Mauritius.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main-content"
          className="sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:outline-none focus:w-auto focus:h-auto focus:m-0 focus:overflow-visible focus:[clip:auto] font-body text-sm"
        >
          Skip to main content
        </a>
        <Providers>
          <ScrollToTop />
          <div id="main-content">{children}</div>
          <FloatingSocialButtons />
        </Providers>
      </body>
    </html>
  );
}
