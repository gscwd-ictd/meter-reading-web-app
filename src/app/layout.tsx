import { type PropsWithChildren } from "react";
import { type Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@mr/components/ui/Sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meter Reading",
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Toaster richColors />
        <main className="h-screen overflow-x-hidden">{children}</main>
      </body>
    </html>
  );
}
