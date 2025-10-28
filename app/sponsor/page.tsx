"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiUsers,
  FiTrendingUp,
  FiGlobe,
  FiHeart,
  FiArrowRightCircle,
  FiCheckCircle,
} from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

/* === Floating Contact Button === */
function FloatingContactButton() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector("footer");
      if (!footer) return;
      const rect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      setVisible(rect.top < windowHeight - 120 ? false : true);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <motion.a
      href="mailto:partners@pdfcraftpro.com"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.9,
        y: visible ? 0 : 20,
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-2 rounded-full
                 bg-gradient-to-r from-[#FF6B6B] via-[#FF9A3D] to-[#FF6B6B]
                 text-white font-semibold shadow-[0_0_20px_rgba(255,154,61,0.4)]
                 hover:shadow-[0_0_35px_8px_rgba(255,154,61,0.4)]
                 hover:scale-105 transition-all duration-300"
    >
      📩 Contact Us
    </motion.a>
  );
}

/* === Main Sponsor Page === */
export default function SponsorPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    Name: "",
    Company: "",
    Email: "",
    Message: "",
  });
  const [success, setSuccess] = useState(false);

  // real-time validation function
  const validateField = (name: string, value: string) => {
    switch (name) {
      case "Name":
        return value ? "" : "Please enter your name.";
      case "Company":
        return value ? "" : "Please enter your company or brand.";
      case "Email":
        if (!value) return "Please enter your email address.";
        return /\S+@\S+\.\S+/.test(value)
          ? ""
          : "Please enter a valid email address.";
      case "Message":
        return value ? "" : "Please write your message.";
      default:
        return "";
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleBlur = (e: any) => {
    const { name, value } = e.target;
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // success feedback
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);

    // mailto
    window.location.href = `mailto:partners@pdfcraftpro.com?subject=Sponsorship Request from ${formData.Name}&body=Company: ${formData.Company}%0AEmail: ${formData.Email}%0A%0AMessage:%0A${formData.Message}`;

    setFormData({ Name: "", Company: "", Email: "", Message: "" });
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#0b111a] text-white">
      <Navbar />

      <div className="flex-grow flex flex-col items-center px-6 py-20">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold bg-gradient-to-r from-[#00D4B3] via-[#29ABE2] to-[#FF9A3D] bg-clip-text text-transparent mb-4 text-center"
        >
          Partner with PDFCraft Pro 🤝
        </motion.h1>

        <p className="max-w-2xl text-center text-gray-300 leading-relaxed mb-14 text-lg">
          Join forces with the next-gen document platform used by thousands of
          creators, students, and professionals. Grow your brand inside a
          high-engagement productivity ecosystem.
        </p>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-5xl">
          {[
            { icon: <FiUsers size={28} />, title: "80K+ Active Users", desc: "Global community of creators & professionals" },
            { icon: <FiTrendingUp size={28} />, title: "High Engagement", desc: "Average 5–10 min session time" },
            { icon: <FiGlobe size={28} />, title: "Global Reach", desc: "Users from 30+ countries" },
            { icon: <FiMail size={28} />, title: "Easy Partnership", desc: "Flexible ad & sponsor options" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-6 bg-[#121a25] rounded-xl border border-[#1f2a38] text-center hover:border-[#FF9A3D]/60 hover:shadow-[0_0_20px_rgba(255,154,61,0.3)] transition-all duration-500"
            >
              <div className="text-[#FF9A3D] mb-3 flex justify-center">{item.icon}</div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-gray-400 text-sm mt-2">{item.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* Why Partner Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-3xl bg-[#121a25]/60 border border-[#1f2a38] rounded-2xl p-10 mb-16 text-center shadow-[0_0_25px_rgba(0,0,0,0.3)] backdrop-blur-md"
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-[#FF9A3D] to-[#FF6B6B] shadow-lg">
            <FiHeart className="text-white text-xl" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FF9A3D] via-[#FF6B6B] to-[#6B5BFF] bg-clip-text text-transparent mb-6 mt-4">
            Why Partner with PDFCraft Pro?
          </h2>
          <p className="text-gray-400 leading-relaxed text-[15px]">
            PDFCraft Pro is a fast-growing creative ecosystem trusted by students,
            developers, and professionals worldwide.
          </p>
          <div className="h-[1px] w-2/3 mx-auto bg-gradient-to-r from-transparent via-[#FF9A3D]/40 to-transparent my-6" />
          <p className="text-gray-400 leading-relaxed text-[15px]">
            As a sponsor, your brand joins an audience that’s focused, creative,
            and engaged — visible through sidebar ads, feature highlights, or
            co-branded collaborations.
          </p>
          <div className="h-[1px] w-2/3 mx-auto bg-gradient-to-r from-transparent via-[#FF9A3D]/40 to-transparent my-6" />
          <p className="text-gray-300 text-[15px]">
            We collaborate only with trusted brands that share our mission:{" "}
            <span className="text-[#FF9A3D] font-semibold">
              keeping premium tools free for everyone.
            </span>
          </p>
        </motion.section>

        {/* Sponsor Form */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-xl bg-[#121a25] border border-[#1f2a38] rounded-2xl p-10 shadow-lg hover:shadow-[0_0_25px_rgba(255,154,61,0.3)] transition-all"
        >
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-[#FF9A3D] via-[#FF6B6B] to-[#6B5BFF] bg-clip-text text-transparent mb-6">
            Become a Sponsor
          </h2>
          <form
  onSubmit={handleSubmit}
  role="form"
  aria-label="Sponsor contact form"
  className="space-y-6"
>
  {(["Name", "Company", "Email", "Message"] as const).map((field) => {
    const hasError = !!errors[field];
    return (
      <motion.div
  key={field}
  className="flex flex-col"
  animate={
    errors[field]
      ? {
          x: [0, -6, 6, -4, 4, -2, 2, 0],
          scale: [1, 1.02, 1],
          boxShadow: [
            "0 0 0px rgba(255,77,77,0)",
            "0 0 12px rgba(255,77,77,0.8)",
            "0 0 0px rgba(255,77,77,0)",
          ],
          transition: {
            duration: 0.45,
            ease: [0.68, -0.55, 0.27, 1.55], // elastic ease
          },
        }
      : success
      ? {
          scale: [1, 1.02, 1],
          boxShadow: [
            "0 0 0px rgba(0,212,179,0)",
            "0 0 14px rgba(0,212,179,0.8)",
            "0 0 0px rgba(0,212,179,0)",
          ],
          transition: {
            duration: 0.5,
            ease: "easeOut",
          },
        }
      : { x: 0, scale: 1, boxShadow: "0 0 0px rgba(0,0,0,0)" }
  }
>
  {/* Input / Textarea */}
  {field !== "Message" ? (
    <input
      type={field === "Email" ? "email" : "text"}
      name={field}
      aria-required="true"
      value={formData[field]}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={
        field === "Company"
          ? "Your Company / Brand"
          : field === "Name"
          ? "Your Name"
          : "Your Email"
      }
      className={`w-full px-4 py-3 rounded-lg bg-[#0b111a] border ${
        errors[field]
          ? "border-[#FF4D4D] shadow-[0_0_12px_#FF4D4D]"
          : success
          ? "border-[#00D4B3] shadow-[0_0_12px_#00D4B3]"
          : "border-[#2a3444] focus:border-[#FF9A3D]"
      } text-gray-200 focus:outline-none transition duration-200`}
    />
  ) : (
    <textarea
      name="Message"
      aria-required="true"
      value={formData.Message}
      onChange={handleChange}
      onBlur={handleBlur}
      rows={4}
      placeholder="Tell us about your sponsorship idea..."
      className={`w-full px-4 py-3 rounded-lg bg-[#0b111a] border ${
        errors.Message
          ? "border-[#FF4D4D] shadow-[0_0_12px_#FF4D4D]"
          : success
          ? "border-[#00D4B3] shadow-[0_0_12px_#00D4B3]"
          : "border-[#2a3444] focus:border-[#FF9A3D]"
      } text-gray-200 focus:outline-none transition resize-none duration-200`}
    />
  )}

  {/* Error message with spacing */}
  <div className="h-5 mt-2 leading-none">
    <AnimatePresence initial={false} mode="wait">
      {errors[field] && (
        <motion.p
          key={`${field}-err`}
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.25 }}
          className="text-xs text-[#FF4D4D] font-medium flex items-center gap-1"
        >
          ⚠ {errors[field]}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
</motion.div>


    );
  })}

  {/* Submit Button */}
  <div className="pt-1">
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type="submit"
      className="w-full py-3 rounded-full bg-gradient-to-r from-[#FF6B6B] via-[#FF9A3D] to-[#FF6B6B]
                 text-white font-semibold shadow-[0_0_25px_rgba(255,154,61,0.4)]
                 hover:shadow-[0_0_35px_8px_rgba(255,154,61,0.4)] transition-all duration-300"
    >
      <span className="flex items-center justify-center gap-2">
        Send Request <FiArrowRightCircle />
      </span>
    </motion.button>
  </div>

  {/* Success Toast */}
  <AnimatePresence>
    {success && (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center justify-center gap-2 text-[#00D4B3] text-sm font-medium mt-4"
      >
        <FiCheckCircle /> Thank you! Your request has been sent.
      </motion.div>
    )}
  </AnimatePresence>
</form>
        </motion.section>
      </div>

      <FloatingContactButton />
      <Footer />
    </main>
  );
}
