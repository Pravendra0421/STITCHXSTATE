"use client";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import { FooterSection } from "@/core/entities/Footer.entity";

interface ConditionalFooterProps {
  footer: FooterSection;
}

export default function ConditionalFooter({ footer }: ConditionalFooterProps) {
  const pathname = usePathname();
  if (pathname.startsWith("/sxs_admin")) return null;
  return <Footer footer={footer} />;
} 