"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FiMenu, FiX, FiUpload, FiChevronUp, FiChevronDown } from "react-icons/fi";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  showUpload?: boolean;
  fileLoaded?: boolean;
  onUploadClick?: () => void;
  toolbarVisible?: boolean;
  onToggleToolbar?: () => void;
}

export default function Navbar({
  showUpload,
  fileLoaded,
  onUploadClick,
  toolbarVisible,
  onToggleToolbar,
}: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [handleVisible, setHandleVisible] = useState(true);
  const [lastMoveTime, setLastMoveTime] = useState<number>(Date.now());

  // lock body scroll when menu open (mobile)
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Auto-hide handle after inactivity
  useEffect(() => {
    const timeout = setInterval(() => {
      const now = Date.now();
      if (now - lastMoveTime > 3000 && !hovered) {
        setHandleVisible(false);
      }
    }, 1000);
    return () => clearInterval(timeout);
  }, [lastMoveTime, hovered]);

  // Detect mouse near top
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 100) setHandleVisible(true);
      setLastMoveTime(Date.now());
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-gradient-to-r from-[#0b1829] to-[#0a101b] border-b border-[#1f2a38] shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 relative">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-[#00D4B3] to-[#FF9A3D] bg-clip-text text-transparent select-none"
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
          {pathname !== "/sponsor" && (
            <Link href="/sponsor" className="hover:text-[#00D4B3] transition">
              Sponsors
            </Link>
          )}

          {showUpload && (
            <button
              onClick={onUploadClick}
              className={clsx(
                "relative flex items-center gap-2 px-5 py-2 text-white font-semibold rounded-full transition-all duration-300 select-none overflow-hidden",
                "bg-gradient-to-r from-[#FF6B6B]/80 via-[#FF9A3D]/80 to-[#FF6B6B]/80",
                "backdrop-blur-xl border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(0,0,0,0.3)]",
                "animate-soft-glow hover:scale-105",
                "hover:shadow-[0_0_25px_5px_rgba(255,154,61,0.4),0_0_35px_10px_rgba(255,107,107,0.3)]"
              )}
            >
              <FiUpload size={18} />
              {fileLoaded ? "Replace PDF" : "Upload PDF"}
              <span className="absolute inset-0 rounded-full bg-white/10 opacity-20 blur-md pointer-events-none" />
              <span className="reflection absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 hover:opacity-100" />
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="md:hidden text-gray-200 text-2xl"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Floating Toolbar Toggle — Only show if PDF loaded */}
        {onToggleToolbar && fileLoaded && (
          <AnimatePresence>
            {handleVisible && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-[-16px] left-1/2 -translate-x-1/2"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const center = rect.width / 2;
                  const proximity = Math.max(0, 1 - Math.abs(x - center) / (rect.width / 2));
                  e.currentTarget.style.setProperty("--glow-intensity", proximity.toString());
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.setProperty("--glow-intensity", "0");
                  setHovered(false);
                }}
              >
                <motion.button
                  onClick={onToggleToolbar}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  whileHover={{ scale: 1.07, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative w-36 h-[12px] rounded-full overflow-hidden cursor-pointer group
                    bg-gradient-to-r from-[#00D4B3] via-[#FF9A3D] to-[#FF6B6B]
                    bg-[length:200%_200%] border border-white/10 backdrop-blur-md
                    shadow-[0_4px_12px_rgba(0,0,0,0.5),0_0_calc(14px*var(--glow-intensity))_rgba(255,154,61,var(--glow-intensity))] 
                    transition-all duration-500 animate-gradientFlow"
                  style={{ ["--glow-intensity" as any]: 0 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20 opacity-70 pointer-events-none" />
                  <motion.div
                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{ repeat: Infinity, duration: hovered ? 3 : 6, ease: "linear" }}
                    className="absolute inset-0 bg-[length:200%_200%] bg-gradient-to-r from-[#00D4B3]/60 via-[#FF9A3D]/60 to-[#FF6B6B]/60 mix-blend-lighten rounded-full opacity-90"
                  />
                  <motion.div className="absolute inset-0 flex items-center justify-center" initial={false}>
                    <motion.div
                      key={toolbarVisible ? "up" : "down"}
                      initial={{ opacity: 0, y: toolbarVisible ? 6 : -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {toolbarVisible ? (
                        <FiChevronUp className="text-white/80 text-lg drop-shadow-[0_0_6px_rgba(255,154,61,0.8)]" />
                      ) : (
                        <FiChevronDown className="text-white/80 text-lg drop-shadow-[0_0_6px_rgba(255,154,61,0.8)]" />
                      )}
                    </motion.div>
                  </motion.div>
                  <div className="absolute -bottom-[3px] left-0 w-full h-[6px] bg-gradient-to-t from-black/50 to-transparent rounded-b-full" />
                </motion.button>
                <AnimatePresence>
                  {hovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.9 }}
                      animate={{ opacity: 1, y: -12, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="absolute left-1/2 -translate-x-1/2 -top-9 px-3 py-1.5 text-xs font-medium text-gray-100 whitespace-nowrap pointer-events-none select-none"
                    >
                      <motion.div
                        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        className="relative px-3 py-1 rounded-full border border-[#ff9a3d]/50 
                          bg-[length:200%_200%] bg-gradient-to-r from-[#00D4B3]/70 via-[#FF9A3D]/70 to-[#FF6B6B]/70
                          shadow-[0_0_10px_rgba(255,154,61,0.5)]
                          before:absolute before:inset-[1px] before:rounded-full
                          before:bg-[#0b111a]/90 before:-z-10"
                      >
                        {toolbarVisible ? "Hide Toolbar" : "Show Toolbar"}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </nav>

      {/* Mobile slide-over menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="mobile-menu-backdrop"
              className="fixed inset-0 bg-black/50 z-[60] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              key="mobile-menu-panel"
              className="fixed top-0 right-0 bottom-0 w-[82%] max-w-[360px] bg-[#0b111a] border-l border-white/10 z-[61] md:hidden p-6 flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 140, damping: 18 }}
            >
              <div className="flex-1 space-y-5 text-gray-200 text-lg">
                <Link href="#features" onClick={() => setIsOpen(false)} className="block">Features</Link>
                <Link href="#pricing" onClick={() => setIsOpen(false)} className="block">Pricing</Link>
                <Link href="#faq" onClick={() => setIsOpen(false)} className="block">FAQ</Link>
                {pathname !== "/sponsor" && (
                  <Link href="/sponsor" onClick={() => setIsOpen(false)} className="block">Sponsors</Link>
                )}
              </div>

              {showUpload && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onUploadClick?.();
                  }}
                  className={clsx(
                    "mt-6 w-full relative flex items-center justify-center gap-2 px-5 py-3 text-white font-semibold rounded-xl transition-all duration-300 select-none overflow-hidden",
                    "bg-gradient-to-r from-[#FF6B6B] via-[#FF9A3D] to-[#FF6B6B]",
                    "backdrop-blur-xl border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(0,0,0,0.3)]",
                    "animate-soft-glow active:scale-95"
                  )}
                >
                  <FiUpload size={18} />
                  {fileLoaded ? "Replace PDF" : "Upload PDF"}
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
