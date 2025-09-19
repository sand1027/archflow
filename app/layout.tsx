import { AppProviders } from "@/components/providers/AppProviders";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/providers/AuthProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ArchFlow - Student-Friendly Workflow Automation",
  description: "Build powerful automation workflows with drag-and-drop interface. 50+ integrations including Google Workspace, Slack, AI tools, and more. Perfect for students and professionals.",
  openGraph: {
    title: "ArchFlow - Student-Friendly Workflow Automation",
    description: "Build powerful automation workflows with drag-and-drop interface. 50+ integrations including Google Workspace, Slack, AI tools, and more. Perfect for students and professionals.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArchFlow - Workflow Automation Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ArchFlow - Student-Friendly Workflow Automation",
    description: "Build powerful automation workflows with drag-and-drop interface. 50+ integrations for students and professionals.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <AppProviders>{children}</AppProviders>
          <Toaster richColors />
        </body>
      </html>
    </AuthProvider>
  );
}
