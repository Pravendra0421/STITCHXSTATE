"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/Header/page";
import { HeaderSection } from "@/core/entities/Header.entity";

interface ConditionalHeaderProps {
  header: HeaderSection;
}

export default function ConditionalHeader({ header }: ConditionalHeaderProps) {
  const pathname = usePathname();
  if (pathname.startsWith("/sxs_admin")) return null;
  return <Header header={header} />;
} 