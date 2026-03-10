import type { Metadata } from "next";
import { Providers } from "./Providers";
import ScrollToTop from "@/components/ScrollToTop";
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
        <Providers>
          <ScrollToTop />
          {children}
        </Providers>
      </body>
    </html>
  );
}
