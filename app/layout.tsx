import { AppProviders } from "@/components/providers/AppProviders";
import { Toaster } from "@/components/ui/sonner";
import { ClerkWrapper } from "@/components/providers/ClerkWrapper";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WorkFlex",
  description: "Build your own workflows and automate tasks with ease",
  openGraph: {
    images: `${process.env.APP_URL}/og-image.png`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkWrapper>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <AppProviders>{children}</AppProviders>
          <Toaster richColors />
        </body>
      </html>
    </ClerkWrapper>
  );
}
