import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import type { Metadata } from "next";
import { AR_One_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

const oneSans = AR_One_Sans({ subsets: ["latin"] });

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
        <body className={oneSans.className}>
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
