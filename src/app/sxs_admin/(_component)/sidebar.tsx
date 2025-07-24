"use client"; // This is a client component

import React, { useState } from "react";
// Removed direct imports for @tabler/icons-react, framer-motion, and @/lib/utils
// All icons are now inline SVGs.
// Dummy implementations for Sidebar, SidebarBody, SidebarLink, motion, and cn are provided
// to ensure the component compiles in the Canvas environment.

// --- Dummy/Placeholder Implementations for Canvas Compatibility ---
// In your actual Next.js project, you would use your real components from "@/components/ui/sidebar"
// and the real 'motion' from 'framer-motion' and 'cn' from '@/lib/utils'.

const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');

const motion = {
  span: ({ children, initial, animate, className }: { children: React.ReactNode; initial: any; animate: any; className?: string }) => (
    <span className={className}>{children}</span>
  ),
};

const Sidebar = ({ children, open, setOpen, animate }: { children: React.ReactNode; open: boolean; setOpen: (open: boolean) => void; animate: boolean }) => {
  return (
    <div className={`relative h-full ${open ? 'w-64' : 'w-16'} transition-all duration-300 ease-in-out`}>
      {/* This is a simplified placeholder for the actual Sidebar component */}
      <div className="flex flex-col h-full bg-gray-800 text-white p-4 rounded-r-lg shadow-lg">
        {children}
        <button
          onClick={() => setOpen(!open)}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 text-white"
        >
          {open ? '←' : '→'}
        </button>
      </div>
    </div>
  );
};

const SidebarBody = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("flex flex-col h-full", className)}>{children}</div>;
};

const SidebarLink = ({ link }: { link: { label: string; href: string; icon: React.ReactNode } }) => {
  return (
    <a
      href={link.href}
      className="flex items-center space-x-3 py-2 px-3 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
    >
      {link.icon}
      <span>{link.label}</span>
    </a>
  );
};

// --- End of Dummy/Placeholder Implementations ---


// Define the SidebarDemo component which will now accept children and an onLogout function
export function SidebarDemo({ children, onLogout }: { children: React.ReactNode; onLogout: () => void }) {
  const links = [
    {
      label: "Dashboard",
      href: "/sxs_admin",
      icon: (
        // Dashboard Icon (Inline SVG)
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001 1h3v-3m-3 3h3v-3m-3 0a1 1 0 011-1h3v-3m-3 3a1 1 0 001 1h3v-3m-3 0a1 1 0 011-1h3v-3m-3 3a1 1 0 001 1h3v-3m-3 0a1 1 0 011-1h3v-3m-3 3a1 1 0 001 1h3v-3m-3 0a1 1 0 011-1h3v-3" />
        </svg>
      ),
    },
    {
      label: "Products",
      href: "/sxs_admin/products",
      icon: (
        // Products Icon (Inline SVG)
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-3.75h.008v.008H7.5v-.008zm0 3h.008v.008H7.5v-.008zm0 3h.008v.008H7.5v-.008zM12 6v.75m0 3v.75m0 3v.75m0 3V18m-9-3.75h.008v.008H7.5v-.008zm0 3h.008v.008H7.5v-.008zm0 3h.008v.008H7.5v-.008zM12 6v.75m0 3v.75m0 3v.75m0 3V18m-9-3.75h.008v.008H7.5v-.008zm0 3h.008v.008H7.5v-.008zm0 3h.008v.008H7.5v-.008z" />
        </svg>
      ),
    },
    {
      label: "Categories",
      href: "/sxs_admin/categories",
      icon: (
        // Categories Icon (Inline SVG)
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
        </svg>
      ),
    },
    {
      label: "Header",
      href: "/sxs_admin/header",
      icon: (
        // Header Icon (Inline SVG)
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 shrink-0 text-neutral-700 dark:text-neutral-200">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      ),
    },
    {
      label: "Footer",
      href: "/sxs_admin/footer",
      icon: (
        // Footer Icon (Inline SVG)
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 shrink-0 text-neutral-700 dark:text-neutral-200">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      ),
    },
    {
      label: "HomePage",
      href: "/sxs_admin/homepage",
      icon: (
        // Homepage Icon (Inline SVG)
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 shrink-0 text-neutral-700 dark:text-neutral-200">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.44.97-.66 1.5-.66h.001c.44 0 .97.22 1.5.66L21.75 12m-4.5 9h-1.5a2.25 2.25 0 01-2.25-2.25V15a2.25 2.25 0 00-2.25-2.25H12a2.25 2.25 0 00-2.25 2.25v2.25m6 0h-6m3 0v3.75m-3.75 0h7.5" />
        </svg>
      ),
    },
  ];
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen", // Use h-screen for full height in layout
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <>
              <Logo />
            </>
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
              {/* Logout button within the sidebar */}
              <button
                onClick={onLogout} // Use the onLogout prop here
                className="sidebar-link flex items-center p-4 rounded-md text-neutral-700 dark:text-neutral-200 hover:bg-red-500 hover:text-white transition-colors duration-200"
              >
                {/* Logout Icon (Inline SVG) */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5 shrink-0 mr-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Logout
              </button>
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Admin User",
                href: "#",
                icon: (
                  <img
                    src="https://placehold.co/50x50/aabbcc/ffffff?text=User" // Placeholder image
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      {/* Main content area, where children (actual page content) will be rendered */}
      <div className="flex flex-1">
        <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
          {children} {/* This is where the AdminLayout's children will be rendered */}
        </div>
      </div>
    </div>
  );
}

// Logo component (kept separate but can be inline if preferred)
export const Logo = () => {
  return (
    <a
      href="/sxs_admin" // Link to dashboard
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black dark:text-white"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Admin Panel
      </motion.span>
    </a>
  );
};

// LogoIcon component (kept separate but can be inline if preferred)
export const LogoIcon = () => {
  return (
    <a
      href="/sxs_admin" // Link to dashboard
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black dark:text-white"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};
