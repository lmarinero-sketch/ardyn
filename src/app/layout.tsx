import type { Metadata } from "next";
import "./globals.css";
import DynamicThemeProvider from "@/components/DynamicThemeProvider";

export const metadata: Metadata = {
  title: "Ardyn Labs",
  description: "Retail & Loyalty Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <DynamicThemeProvider />
        {children}
      </body>
    </html>
  );
}
