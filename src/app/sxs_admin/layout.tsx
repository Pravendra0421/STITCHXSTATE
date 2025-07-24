'use client'; // This is a client component

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Import auth and db from your centralized Firebase configuration file
// This assumes your firebaseConfig.ts file is located at '@/firebase/config'
import { auth, db } from '@/firebase/config';

// Import your actual UI components from your project structure
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { motion } from "framer-motion"; // Use framer-motion directly
import { cn } from "@/lib/utils"; // Use your actual cn utility

// Declare global variable for TypeScript to recognize __app_id
// This is still needed for Firestore pathing that aligns with Canvas structure,
// but will default for local development.
declare const __app_id: string | undefined;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';


// Logo component (assuming it's either defined globally or in a separate utility file)



export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null); // To display user ID
    const [openSidebar, setOpenSidebar] = useState(false); // State for sidebar open/close

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
            // Homepage Icon 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 shrink-0 text-neutral-700 dark:text-neutral-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.44.97-.66 1.5-.66h.001c.44 0 .97.22 1.5.66L21.75 12m-4.5 9h-1.5a2.25 2.25 0 01-2.25-2.25V15a2.25 2.25 0 00-2.25-2.25H12a2.25 2.25 0 00-2.25 2.25v2.25m6 0h-6m3 0v3.75m-3.75 0h7.5" />
            </svg>
          ),
        },
      ];

    useEffect(() => {
        // Log appId for debugging
        console.log("AdminLayout - Current Canvas App ID:", appId);

        // Firebase Auth state listener
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                // User logged out or not authenticated, redirect to login page
                console.log("AdminLayout: User not authenticated. Redirecting to login.");
                window.location.href = '/sxs_admin_login'; // Use sxs_admin_login as per your route group
            } else {
                // User authenticated, now check role
                console.log("AdminLayout: User authenticated, checking role for UID:", user.uid);
                const userDocRef = doc(db, `artifacts/${appId}/users/${user.uid}/profile/data`);
                try {
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists() && userDocSnap.data()?.role === 'admin') {
                        // User is an admin, render content
                        console.log("AdminLayout: User is an admin. Access granted.");
                        setUserId(user.uid);
                        setLoading(false);
                    } else {
                        // User is not an admin, log out and redirect to login page
                        console.log("AdminLayout: User is NOT an admin. Logging out and redirecting.");
                        await signOut(auth); // Log out non-admin user
                        window.location.href = '/sxs_admin_login?error=unauthorized'; // Redirect to login with error
                    }
                } catch (error: unknown) { // Added unknown type for error
                    console.error("AdminLayout: Error fetching user role:", error);
                    if (typeof error === 'object' && error !== null && 'code' in error) {
                        const firebaseError = error as { code: string; message: string };
                        console.error("AdminLayout: Firebase Error Code:", firebaseError.code);
                    }
                    await signOut(auth); // Log out in case of error
                    window.location.href = '/sxs_admin_login?error=auth_error'; // Redirect to login with error
                }
            }
        });

        return () => unsubscribe(); // Clean up subscription on component unmount
    }, []); // Empty dependency array to run once on mount

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = '/sxs_admin_login'; // Redirect to login after logout
        } catch (error) {
            console.error("Error logging out:", error);
            alert("Logout failed. Please try again.");
        }
    };

    if (loading) {
        // Loading state: until authentication check is complete
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
               
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
                <p className="text-xl font-semibold text-gray-700 animate-pulse">Loading admin panel...</p>
            </div>
        );
    }

    // If the user is an admin, render the layout with integrated sidebar
    return (
        <div
            className={cn(
                "mx-auto flex w-full max-w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800 h-full", // Use h-screen for full height in layout
            )}
        >
         
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <style>
                {`
                body {
                    font-family: 'Inter', sans-serif;
                }
                .sidebar-link {
                    display: flex;
                    align-items: center;
                    padding: 1rem 1.5rem;
                    border-radius: 0.5rem;
                    transition: all 0.2s ease-in-out;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                    color: #4B5563; /* Gray-700 */
                }
                .sidebar-link:hover {
                    background-color: #E5E7EB; /* Gray-200 */
                    color: #1F2937; /* Gray-900 */
                }
                .sidebar-link.active {
                    background-color: #3B82F6; /* Blue-500 */
                    color: white;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                }
                .sidebar-link.active svg {
                    color: white;
                }
                .sidebar-link svg {
                    margin-right: 0.75rem;
                    width: 1.5rem;
                    height: 1.5rem;
                    color: #6B7280; /* Gray-500 */
                    transition: color 0.2s ease-in-out;
                }
                .sidebar-link.active:hover {
                    background-color: #2563EB; /* Blue-600 */
                }
                `}
            </style>

            <Sidebar open={openSidebar} setOpen={setOpenSidebar} animate={true}>
                <SidebarBody className="justify-between gap-10" >
                    <div className="flex flex-1 h-[100vh] flex-col overflow-x-hidden overflow-y-auto">
                        {/* <>
                            <Logo />
                        </> */}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                            {/* Logout button within the sidebar */}
                            <button
                                onClick={handleLogout}
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
            <div className="flex flex-1 ">
                <div className="flex h-full w-full flex-1 flex-col gap-2  border bg-neutral-100 md:p-10  dark:bg-neutral-900 ">
                    {children} {/* This is where the AdminLayout's children will be rendered */}
                </div>
            </div>
        </div>
    );
}
