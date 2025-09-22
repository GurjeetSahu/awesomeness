import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "next-auth/react";

import { TanstackProvider } from "@/components/providers/tanstack";

import "./globals.css";
import { Metadata } from "next";

import { Toaster } from "@/components/ui/sonner";
export const metadata: Metadata = {
  title: "Awesomeness",
  description: "Do more with GitHub Stars!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SessionProvider>
          <TanstackProvider>
            <NuqsAdapter>
              <ThemeProvider>{children}</ThemeProvider>
              <Toaster />
            </NuqsAdapter>
          </TanstackProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
