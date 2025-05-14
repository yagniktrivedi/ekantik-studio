import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Toaster } from "@/components/ui/toaster/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ekantik Studio",
  description: "Discover the transformative power of yoga and wellness at Ekantik Studio in the beautiful Cotswolds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              function removeGrammarlyAttributes() {
                const body = document.body;
                if (body) {
                  if (body.hasAttribute('data-new-gr-c-s-check-loaded')) {
                    body.removeAttribute('data-new-gr-c-s-check-loaded');
                  }
                  if (body.hasAttribute('data-gr-ext-installed')) {
                    body.removeAttribute('data-gr-ext-installed');
                  }
                }
              }
              
              // Run immediately
              removeGrammarlyAttributes();
              
              // Also run when the DOM content is loaded
              document.addEventListener('DOMContentLoaded', removeGrammarlyAttributes);
            })();
          `,
        }} />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
            <SonnerToaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
