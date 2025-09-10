import Link from "next/link";

export default function HeroSection() {
    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center justify-center text-center bg-gradient-to-br from-[#0A192F] via-[#112240] to-[#1B2B44] px-6 overflow-hidden"
        >
            {/* Background Glow Effects */}
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#00D4B3] rounded-full blur-3xl opacity-20 animate-glowPulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF6B6B] rounded-full blur-3xl opacity-20 animate-glowPulse delay-700"></div>

            <div className="relative max-w-3xl mx-auto">
                {/* Headline */}
                <h1
                    className="text-4xl md:text-6xl font-extrabold text-white leading-tight animate-fadeIn"
                >
                    Edit PDFs <span className="text-[#00D4B3]">Privately</span>
                </h1>

                {/* Subtitle */}
                <p
                    data-aos="fade-up"
                    data-aos-delay="200"
                    className="mt-6 text-lg md:text-xl text-gray-300"
                >
                    Professional PDF editing that never leaves your browser.{" "}
                    <span className="font-semibold text-white">Zero uploads</span>, maximum privacy.
                </p>

                {/* CTA Buttons */}
                <div
                    data-aos="fade-up"
                    data-aos-delay="400"
                    className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5"
                >
                    <Link
                        href="#cta"
                        className="px-6 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-[#FF6B6B] to-[#FF9A3D] shadow-lg hover:opacity-90 transition"
                    >
                        Start Editing
                    </Link>
                    <Link
                        href="#features"
                        className="px-6 py-3 rounded-full font-semibold border border-[#00D4B3] text-[#00D4B3] hover:bg-[#00D4B3] hover:text-[#0A192F] transition"
                    >
                        Explore Features
                    </Link>
                </div>
            </div>
        </section>
    );
}
