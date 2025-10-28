"use client";
import { useState } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

interface CollapsiblePanelProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: (newState: boolean) => void;
}

export default function CollapsiblePanel({
  title,
  children,
  isOpen: controlledOpen,
  onToggle,
}: CollapsiblePanelProps) {
  // Allow both controlled & uncontrolled behavior
  const [internalOpen, setInternalOpen] = useState(controlledOpen ?? false);
  const isControlled = typeof controlledOpen === "boolean";
  const open = isControlled ? controlledOpen : internalOpen;

  const toggle = () => {
    const newState = !open;
    if (isControlled && onToggle) onToggle(newState);
    else setInternalOpen(newState);
  };

  return (
    <div className="border border-[#1f2a38] rounded-lg mb-3 overflow-hidden bg-[#1a212d]">
      <button
        onClick={toggle}
        className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold text-gray-200 hover:bg-[#222b3a] transition-colors"
      >
        <span>{title}</span>
        {open ? (
          <FiChevronDown className="text-gray-400" />
        ) : (
          <FiChevronRight className="text-gray-400" />
        )}
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="p-3">{children}</div>
      </div>
    </div>
  );
}
