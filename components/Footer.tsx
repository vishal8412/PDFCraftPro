import Link from "next/link";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0A192F] text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo + About */}
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-[#00D4B3] to-[#FF9A3D] bg-clip-text text-transparent">
            PDFCraft Pro
          </h3>
          <p className="mt-3 text-sm">
            Privacy-first PDF editing that never leaves your browser.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-white">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="#features" className="hover:text-[#00D4B3]">Features</Link></li>
            <li><Link href="#pricing" className="hover:text-[#00D4B3]">Pricing</Link></li>
            <li><Link href="#faq" className="hover:text-[#00D4B3]">FAQ</Link></li>
          </ul>
        </div>

        {/* Privacy */}
        <div>
          <h4 className="text-lg font-semibold text-white">Privacy</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>100% Client-Side</li>
            <li>No Data Stored</li>
            <li>GDPR Compliant</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-lg font-semibold text-white">Connect</h4>
          <div className="flex space-x-5 mt-3 text-xl">
            <a href="https://twitter.com" target="_blank" className="hover:text-[#00D4B3]"><FaTwitter /></a>
            <a href="https://github.com" target="_blank" className="hover:text-[#00D4B3]"><FaGithub /></a>
            <a href="https://linkedin.com" target="_blank" className="hover:text-[#00D4B3]"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-6 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} PDFCraft Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
