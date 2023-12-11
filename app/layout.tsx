import QueryProvider from "@/components/providers/react-query";
import { OpenAIBanner } from "@/components/status-banners/open-ai";
import { ThemeProvider } from "@/components/theme-provider";
import { AmplitudeAnalytics } from "@/lib/amplitude";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const font = Barlow({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const url = `${process.env.NEXT_PUBLIC_WEB_BASE_URL}`;

export const metadata: Metadata = {
  title: "Interactive AI-Powered Storytelling - AI Adventure",
  description:
    "Embark on a unique AI text based adventure with AI Adventure: Interactive AI-Powered Storytelling. Craft and experience your own RPG, guided by advanced AI, and dive into a world of endless possibilities. Unleash your creativity now!",
  metadataBase: new URL(url),
  openGraph: {
    url: url,
    type: "website",
    title: "AI Adventure: Interactive AI-Powered Storytelling",
    description:
      "Embark on a unique AI text based adventure with AI Adventure: Interactive AI-Powered Storytelling. Craft and experience your own RPG, guided by advanced AI, and dive into a world of endless possibilities. Unleash your creativity now!",
    images: `${url}/adventurer.png`,
  },
  twitter: {
    creator: "@GetSteamship",
    card: "summary_large_image",
    title: "AI Adventure: Interactive AI-Powered Storytelling",
    site: "@GetSteamship",
    description:
      "Embark on a unique AI text based adventure with AI Adventure: Interactive AI-Powered Storytelling. Craft and experience your own RPG, guided by advanced AI, and dive into a world of endless possibilities. Unleash your creativity now!",
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
          <SpeedInsights />
        </body>
        <Script id="reddit-analytics">
          {`
          <!-- Reddit Pixel -->
          !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);rdt('init','a2_e225irsre6sn', {"optOut":false,"useDecimalCurrencyValues":true});rdt('track', 'PageVisit');
          <!-- DO NOT MODIFY UNLESS TO REPLACE A USER IDENTIFIER -->
          <!-- End Reddit Pixel -->`}
        </Script>
      </html>
    </ClerkProvider>
  );
}
