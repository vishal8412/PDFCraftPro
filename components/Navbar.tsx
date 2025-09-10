"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[rgba(10,25,47,0.9)] border-b border-gray-800 animate-slideDown">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-[#00D4B3] to-[#FF9A3D] bg-clip-text text-transparent"
        >
          PDFCraft Pro
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-gray-200 font-medium">
          <Link href="#features" className="hover:text-[#00D4B3] transition">
            Features
          </Link>
          <Link href="#pricing" className="hover:text-[#00D4B3] transition">
            Pricing
          </Link>
          <Link href="#faq" className="hover:text-[#00D4B3] transition">
            FAQ
          </Link>
          <Link
            href="#cta"
            className="px-4 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-[#FF6B6B] to-[#FF9A3D] shadow-lg hover:opacity-90 transition"
          >
            Start Editing
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-200 text-2xl"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#0A192F] border-t border-gray-800 text-gray-200">
          <div className="flex flex-col space-y-4 px-6 py-6 font-medium">
            <Link href="#features" onClick={() => setIsOpen(false)}>Features</Link>
            <Link href="#pricing" onClick={() => setIsOpen(false)}>Pricing</Link>
            <Link href="#faq" onClick={() => setIsOpen(false)}>FAQ</Link>
            <Link
              href="#cta"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-center rounded-full text-white font-semibold bg-gradient-to-r from-[#FF6B6B] to-[#FF9A3D] shadow-lg hover:opacity-90 transition"
            >
              Start Editing
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
