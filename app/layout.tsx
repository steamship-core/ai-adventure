import { ThemeProvider } from "@/components/theme-provider";
import { TypographySmall } from "@/components/ui/typography/TypographySmall";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { ZapIcon } from "lucide-react";
import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import "./globals.css";

const font = Barlow({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Adventure",
  description: "Create your own AI Adventure",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
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
        <body className={cn(font.className, "pb-3")}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Analytics />
            <div className="w-full text-center flex items-center justify-center absolute bottom-2">
              <TypographySmall>
                <ZapIcon
                  size={16}
                  className="fill-yellow-600 inline text-yellow-600"
                />{" "}
                by{" "}
                <a
                  href="https://steamship.com"
                  target="_blank"
                  className="underline"
                >
                  Steamship
                </a>
              </TypographySmall>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
