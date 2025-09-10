"use client";

import { useState } from "react";
import { Layers, FileText, History, Settings, X } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const tabs = [
    { id: "pages", icon: FileText, label: "Pages" },
    { id: "layers", icon: Layers, label: "Layers" },
    { id: "history", icon: History, label: "History" },
    { id: "properties", icon: Settings, label: "Properties" },
  ];

  return (
    <>
      {/* 🖥️ Desktop Sidebar */}
      <div
        className={`hidden md:flex flex-col bg-white border-r shadow h-full transition-all duration-300 ${
          collapsed ? "w-12" : "w-48"
        }`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 text-gray-500 hover:text-black"
        >
          {collapsed ? "➡" : "⬅"}
        </button>
        <nav className="flex-1 overflow-y-auto">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition ${
                activeTab === id
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              {!collapsed && <span>{label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* 📱 Mobile Bottom Drawer */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t shadow-lg">
        <div className="flex justify-around">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center py-2 text-xs ${
                activeTab === id ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
