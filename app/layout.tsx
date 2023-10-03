import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

const pixel = Pixelify_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "AI Adventure",
  description: "Create your own AI Adventure",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <body className={pixel.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
