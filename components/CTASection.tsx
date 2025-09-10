import Link from "next/link";

export default function CTASection() {
    return (
        <section
            id="cta"
            className="relative py-24 px-6 bg-gradient-to-br from-[#0A192F] via-[#112240] to-[#1B2B44] text-center overflow-hidden"
        >
            {/* Background Glow Effects */}
            <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-[#00D4B3] rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#FF6B6B] rounded-full blur-3xl opacity-20"></div>

            <div className="relative max-w-4xl mx-auto">
                {/* Heading */}
                <h2
                    data-aos="fade-up"
                    className="text-3xl md:text-5xl font-extrabold text-white"
                >
                    Ready to <span className="text-[#00D4B3]">Edit Securely?</span>
                </h2>
                <p
                    data-aos="fade-up"
                    data-aos-delay="200"
                    className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto"
                >
                    Join thousands of privacy-conscious users who trust{" "}
                    <span className="font-semibold text-white">PDFCraft Pro</span>.

                    No registration required. Free forever. Privacy guaranteed.
                </p>

                {/* CTA Buttons */}
                <div
                    data-aos="fade-up"
                    data-aos-delay="400"
                    className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5"
                >
                    <Link
                        href="#features"
                        className="px-6 py-3 rounded-full font-semibold border border-[#00D4B3] text-[#00D4B3] hover:bg-[#00D4B3] hover:text-[#0A192F] transition"
                    >
                        Explore Features
                    </Link>
                    <Link
                        href="./editor"
                        className="px-6 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-[#FF6B6B] to-[#FF9A3D] shadow-lg hover:opacity-90 transition"
                    >
                        Start Editing Now
                    </Link>
                </div>
            </div>
        </section>
    );
}
