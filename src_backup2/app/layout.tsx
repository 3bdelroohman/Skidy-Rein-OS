import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Skidy Rein OS — نظام تشغيل الأكاديمية",
    template: "%s | Skidy Rein OS",
  },
  description: "Skidy Rein OS — نظام التشغيل المتكامل لإدارة الأكاديمية",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased font-cairo">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster position="top-center" richColors closeButton dir="rtl" />
        </ThemeProvider>
      </body>
    </html>
  );
}
