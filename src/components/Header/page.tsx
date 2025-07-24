'use client';

import Link from 'next/link';
import { FaInstagram } from "react-icons/fa";
import { RiFacebookCircleFill } from "react-icons/ri";
import { FaPinterest } from "react-icons/fa";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { CiUser } from "react-icons/ci";
import { HiOutlineMenuAlt3 } from "react-icons/hi"; // For hamburger icon
import { BsSearch } from "react-icons/bs"; // For search icon
import { useState } from 'react'; // Import useState hook
import SearchInput from '../seachbar';
import MobileMenu from './MobileSideBar';
import CartSidebar from '../cart/CartSidebar';
import { HeaderSection } from '@/core/entities/Header.entity';
interface HeaderProps {
  header: HeaderSection;
}
const iconMap: Record<string, React.ReactNode> = {
  instagram: <FaInstagram />,
  facebook: <RiFacebookCircleFill />,
  pinterest: <FaPinterest />
};
const Header = ({ header }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchInputVisible, setIsSearchInputVisible] = useState(false); // State to control search input visibility on mobile
  const [isCartOpen, setIsCartOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearchInput = () => {
    setIsSearchInputVisible(!isSearchInputVisible);
  };
  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };
  const section = header.sections[0];
  if (!section) {
    return (
      <header className="font-sans">
        <div className="bg-orange-200 text-center text-xs py-1">
          <span className="font-semibold">HASSLE-FREE RETURNS</span> 30-day postage paid returns
        </div>
        <div className="text-center text-gray-500 py-8">
          No header content available.
        </div>
      </header>
    );
  }

  return (
    <header className="font-sans">
      {/* Top Banner */}
      <div className="bg-orange-200 text-center text-xs py-1">
        <span className="font-semibold">HASSLE-FREE RETURNS</span> 30-day postage paid returns
      </div>

      {/* Top Menu (Desktop only: specific categories, social & location) */}
      <div className="hidden md:flex border-b border-gray-100 px-6 py-3 justify-between items-center text-sm">
        {/* Left Navigation (Desktop only) */}
        <div className="flex ml-[12%] space-x-4">
          {(section.mainNavlinks ?? []).map((link, index) => (
            <Link key={index} href={link.url}>
              <span className="hover:underline cursor-pointer">{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Social & Location (Desktop only) */}
        <div className="flex items-center space-x-3 mr-[12%]">
          {(section.socialIcons ?? []).map((icon, index) => (
            <Link key={index} href={icon.url}>
              <span className="text-xl text-gray-700 hover:text-blue-600">
                {iconMap[icon.iconName] || null}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Navigation (Adaptive for Mobile and Desktop) */}
      <div className="border-b border-gray-100 flex justify-between items-center text-sm px-4 py-3 md:py-0 md:px-0 relative">
        {/* Hamburger Menu Icon (Mobile only, on the left) */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMobileMenu} className="p-2 text-gray-700 text-2xl" aria-label="Open mobile menu">
            <HiOutlineMenuAlt3 />
          </button>
        </div>
        <div className="hidden md:block ml-[12%]">
            <SearchInput />
          </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex flex-grow justify-center space-x-8 text-gray-700 font-medium text-sm">
          {section.mainNav && section.mainNav.shop && (
            <Link href={section.mainNav.shop.url} className="hover:text-blue-600 transition-colors duration-200">
              {section.mainNav.shop.label}
            </Link>
          )}
          {section.mainNav && section.mainNav.season && (
            <Link href={section.mainNav.season.url} className="hover:text-blue-600 transition-colors duration-200">
              {section.mainNav.season.label}
            </Link>
          )}
          <Link href="/" className="font-bold text-gray-900 text-xl whitespace-nowrap">
            {section.logo || "STITCH X STATE"}
          </Link>
          {section.mainNav && section.mainNav.journal && (
            <Link href={section.mainNav.journal.url} className="hover:text-blue-600 transition-colors duration-200">
              {section.mainNav.journal.label}
            </Link>
          )}
          {section.mainNav && section.mainNav.themeFeatures && (
            <Link href={section.mainNav.themeFeatures.url} className="hover:text-blue-600 transition-colors duration-200">
              {section.mainNav.themeFeatures.label}
            </Link>
          )}
        </div>

        {/* Right-aligned icons (Search, User, Shopping Bag) */}
        <div className="flex items-center ml-auto md:mr-[14%] flex-shrink-0 space-x-2">
          {/* Search Input for Desktop */}
          
          {/* Search Icon for Mobile (toggles mobile search input) */}
          <button onClick={toggleSearchInput} className="md:hidden p-2 text-gray-700 text-xl" aria-label="Toggle search">
            <BsSearch />
          </button>

          <button className="p-2 text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 rounded-full transition-colors duration-200" aria-label="User Account">
            <CiUser className="text-xl" />
          </button>
          <button onClick={handleCartToggle} className="p-2 text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 rounded-full transition-colors duration-200" aria-label="Shopping Bag">
            <LiaShoppingBagSolid className="text-xl" />
          </button>
        </div>

        {/* Mobile Search Input (appears conditionally below the header) */}
        {isSearchInputVisible && (
          <div className="absolute top-full left-0 right-0 p-4 bg-white border-b border-gray-100 z-30 md:hidden">
            <SearchInput />
          </div>
        )}
      </div>
      <CartSidebar isOpen={isCartOpen} onClose={handleCartToggle}/>

      {/* Mobile Menu Component (slides in from left) */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={toggleMobileMenu} header={header} />

      {/* Overlay for mobile menu (when open) */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileMenu} // Close menu when clicking outside
        ></div>
      )}
    </header>
  );
}

export default Header;