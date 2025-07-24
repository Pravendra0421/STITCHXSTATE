'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { IoCloseOutline } from 'react-icons/io5';
import { FaInstagram, FaPinterest } from 'react-icons/fa';
import { RiFacebookCircleFill } from 'react-icons/ri';
import { HeaderSection } from '@/core/entities/Header.entity';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  header: HeaderSection;
}

const iconMap: Record<string, React.ReactNode> = {
  instagram: <FaInstagram />,
  facebook: <RiFacebookCircleFill />,
  pinterest: <FaPinterest />,
};

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, header }) => {
  const section = header?.sections?.[0];

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!section) return null;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[998] md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Menu */}
      <div
        className={`fixed inset-y-0 left-0 w-80 max-w-full bg-white transform transition-transform duration-300 ease-in-out z-[999] md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-end p-4 border-b border-gray-100">
          <button
            onClick={onClose}
            className="text-gray-700 text-3xl p-2"
            aria-label="Close mobile menu"
          >
            <IoCloseOutline />
          </button>
        </div>

        <nav className="flex flex-col p-6 space-y-6 text-lg font-medium">
          {/* Main Navigation */}
          <Link href={section.mainNav.shop.url} onClick={onClose}>
            <span className="hover:text-blue-600 transition-colors duration-200">
              {section.mainNav.shop.label}
            </span>
          </Link>
          <Link href={section.mainNav.season.url} onClick={onClose}>
            <span className="hover:text-blue-600 transition-colors duration-200">
              {section.mainNav.season.label}
            </span>
          </Link>
          <Link href={section.mainNav.journal.url} onClick={onClose}>
            <span className="hover:text-blue-600 transition-colors duration-200">
              {section.mainNav.journal.label}
            </span>
          </Link>
          <Link href={section.mainNav.themeFeatures.url} onClick={onClose}>
            <span className="hover:text-blue-600 transition-colors duration-200">
              {section.mainNav.themeFeatures.label}
            </span>
          </Link>

          <hr className="my-4 border-gray-200" />

          {/* Additional Links */}
          {section.mainNavlinks.map((link, index) => (
            <Link key={index} href={link.url} onClick={onClose}>
              <span className="hover:text-blue-600 transition-colors duration-200">
                {link.label}
              </span>
            </Link>
          ))}

          <hr className="my-4 border-gray-200" />

          {/* Social Icons */}
          <div className="flex space-x-6 justify-center mt-6">
            {section.socialIcons.map((icon, index) => (
              <Link key={index} href={icon.url} target="_blank" rel="noopener noreferrer">
                <span className="text-2xl text-gray-600 hover:text-blue-600 transition-colors">
                  {iconMap[icon.iconName] || null}
                </span>
              </Link>
            ))}
          </div>

          <span className="text-center text-sm text-gray-500 mt-2">Israel (USD $)</span>
        </nav>
      </div>
    </>
  );
};

export default MobileMenu;
