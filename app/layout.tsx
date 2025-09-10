// app/layout.tsx (Server Component)
import "../styles/globals.css";
import { Metadata } from "next";
import ClientRoot from "../components/ClientRoot";

export const metadata: Metadata = {
  title: "PDFCraft Pro",
  description: "Privacy-first PDF editor",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="text-gray-900">
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  );
}
