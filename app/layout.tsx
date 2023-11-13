import QueryProvider from "@/components/providers/react-query";
import { OpenAIBanner } from "@/components/status-banners/open-ai";
import { ThemeProvider } from "@/components/theme-provider";
import { AmplitudeAnalytics } from "@/lib/amplitude";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import "./globals.css";

const font = Barlow({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const url = `${process.env.NEXT_PUBLIC_WEB_BASE_URL}`;

export const metadata: Metadata = {
  title: "AI Adventure",
  description: "Create your own AI Adventure",
  metadataBase: new URL(url),
  openGraph: {
    url: url,
    type: "website",
    title: "AI Adventure",
    description: "Create your own AI Adventure",
    images: `${url}/adventurer.png`,
  },
  twitter: {
    creator: "@GetSteamship",
    card: "summary_large_image",
    title: "AI Adventure",
    site: "@GetSteamship",
    description: "Create your own AI Adventure",
    images: `${url}/adventurer.png`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
        </head>
        <body className={cn(font.className)}>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <OpenAIBanner />
              {children}
              <Analytics />
              <AmplitudeAnalytics />
            </ThemeProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
