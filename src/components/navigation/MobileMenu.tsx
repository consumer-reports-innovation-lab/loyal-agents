import React, { useState } from 'react';
import { Dialog, DialogPanel, DialogBackdrop } from '@headlessui/react';

interface NavigationLink {
  link: string;
  text: string;
}

interface CTAButton {
  link: string;
  text: string;
}

interface MobileMenuProps {
  links: NavigationLink[];
  ctaButton: CTAButton;
  linkTextColor?: string;
  linkHoverColor?: string;
}

export default function MobileMenu({
  links,
  ctaButton,
  linkTextColor = '#ffffff',
  linkHoverColor = '#cccccc'
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);
  return (
    <>
      {/* Mobile menu toggle button - fixed position */}
      <div className="block lg:hidden relative w-8 h-12">
        <button
          className="w-6 h-6 bg-transparent border-none text-white cursor-pointer hover:opacity-80 transition-opacity fixed top-1/3 right-4 md:right-8 z-[100]"
          aria-label={
            isOpen
              ? "Close mobile navigation menu"
              : "Open mobile navigation menu"
          }
          onClick={isOpen ? closeMenu : openMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>
      {/* Mobile menu dialog */}
      <Dialog open={isOpen} onClose={closeMenu} className="relative z-[99]">
        {/* Backdrop */}
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 data-[closed]:opacity-0"
        />

        {/* Dialog panel */}
        <div className="fixed inset-0 flex items-start justify-center pt-28">
          <DialogPanel
            transition
            className="w-[calc(100%-1.25rem)] max-w-7xl rounded-2xl bg-black/95 backdrop-blur-[12.5px] p-6 transition-all duration-300 data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            {/* Navigation links */}
            <nav className="flex flex-col items-center gap-6 p-4">
              <ul
                className="flex flex-col items-center space-y-6 m-0 p-0"
                aria-label="Header navigation links"
              >
                {links.map((link, index) => (
                  <li key={index} className="list-none">
                    <a
                      className="font-sans font-bold text-base tracking-wide uppercase text-white no-underline cursor-pointer transition-colors duration-300 hover:!text-teal-200"
                      href={link.link}
                      onClick={closeMenu}
                      style={{ color: linkTextColor }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = linkHoverColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = linkTextColor;
                      }}
                    >
                      {link.text}
                    </a>
                  </li>
                ))}

                {/* CTA Button */}
                <li className="list-none mt-2">
                  <a
                    className="font-sans font-bold text-base tracking-wide uppercase text-white no-underline cursor-pointer bg-gradient-to-br from-green-400 to-[#3A8DC7] py-3 px-6 rounded-full mt-4 transition-all duration-300 hover:opacity-90 hover:text-black"
                    href={ctaButton.link}
                    onClick={closeMenu}
                  >
                    {ctaButton.text}
                  </a>
                </li>
              </ul>
            </nav>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
