import { FaEdit, FaSignature, FaHighlighter, FaLock, FaCopy } from "react-icons/fa";

const features = [
  {
    title: "Advanced Text Editing",
    description: "Add, edit, and format text with powerful typography controls.",
    icon: <FaEdit className="text-[#00D4B3] text-2xl" />,
  },
  {
    title: "Digital Signatures",
    description: "Create and apply secure digital signatures with ease.",
    icon: <FaSignature className="text-[#00D4B3] text-2xl" />,
  },
  {
    title: "Smart Annotations",
    description: "Highlight, comment, draw, and add shapes seamlessly.",
    icon: <FaHighlighter className="text-[#00D4B3] text-2xl" />,
  },
  {
    title: "Document Security",
    description: "Protect files with passwords, watermarks, and redaction tools.",
    icon: <FaLock className="text-[#00D4B3] text-2xl" />,
  },
  {
    title: "Page Management",
    description: "Rotate, reorder, split, and merge pages effortlessly.",
    icon: <FaCopy className="text-[#00D4B3] text-2xl" />,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-[#0A192F] py-20 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        {/* Section Title */}
        <h2 className="text-3xl md:text-5xl font-bold text-white">
          Everything You Need
        </h2>
        <p className="mt-4 text-lg text-gray-400">
          Professional-grade PDF editing tools that respect your privacy.
        </p>

        {/* Features Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              data-aos="zoom-in"
              data-aos-delay={index * 100}
              className="relative p-6 rounded-xl bg-gradient-to-br from-[#112240] to-[#1B2B44] border border-gray-800 shadow-md hover:border-[#00D4B3] transition group"
            >
              {/* Glow Effect on Hover */}
              <div className="absolute inset-0 rounded-xl bg-[#00D4B3] opacity-0 blur-2xl group-hover:opacity-20 transition"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0A192F] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
