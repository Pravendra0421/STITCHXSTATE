import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthZustandProvider from "@/providers/AuthZustandProvider";
import Header from "@/components/Header/page";
import Footer from "@/components/Footer/Footer";
import { getHeader } from "@/lib/HeaderSection/getHeader";
import { HeaderSection } from "@/core/entities/Header.entity";
import { FooterSection } from "@/core/entities/Footer.entity";
import { getFooter } from "@/lib/FooterSection/getFooter";
import { Toaster } from 'react-hot-toast';
import ConditionalHeader from "@/components/ConditionalHeader";
import ConditionalFooter from "@/components/ConditionalFooter";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata:Metadata={
  
  title: {
    template: '%s | My Next.js App', // '%s' will be replaced by page-specific title
    default: 'Welcome to My Next.js App', // Default title for the root route '/'
  },
  description: 'A starter Next.js application with authentication.',
  
}

export default async function RootLayout({
  
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const header: HeaderSection | null = await getHeader();
  if (!header) {
    throw new Error("Header data is required but was not found.");
  }
  const footer:FooterSection | null= await getFooter();
  if(!footer){
    throw new Error("Footer data is required but was not found");
  }
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthZustandProvider>
          <ConditionalHeader header={header} />
        {children}
        <Toaster />
        <ConditionalFooter footer={footer} />
        </AuthZustandProvider>
      </body>
    </html>
  );
}