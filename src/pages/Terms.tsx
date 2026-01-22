"use client";
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const sections = [
    {
        title: "1. Acceptance of Terms",
        content: `By accessing and using this website and its services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please refrain from using our services.

These terms apply to all visitors, users, and others who access or use our services. We reserve the right to update or modify these terms at any time without prior notice.`
    },
    {
        title: "2. Use of Services",
        content: `You agree to use our services only for lawful purposes and in accordance with these Terms. You are responsible for ensuring that your use of the services complies with all applicable local, state, national, and international laws and regulations.

You agree not to:
• Use the services in any way that violates any applicable law or regulation
• Attempt to interfere with or disrupt the integrity or performance of the services
• Attempt to gain unauthorized access to any portion of the services
• Use the services to transmit any harmful or malicious content`
    },
    {
        title: "3. Intellectual Property",
        content: `All content, features, and functionality of our services, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, and software, are the exclusive property of Gabhasti Giri and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.

You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our website without prior written consent.`
    },
    {
        title: "4. User Content",
        content: `Any content you submit, post, or display on or through our services remains your property. However, by submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute such content in any media.

You represent and warrant that you own or have the necessary rights to submit the content and that the content does not violate the rights of any third party.`
    },
    {
        title: "5. Privacy Policy",
        content: `Your privacy is important to us. Our [Privacy Policy](https://gabhasti.tech/privacy-policy) explains how we collect, use, and protect your personal information when you use our services. By using our services, you consent to the collection and use of information in accordance with our Privacy Policy.

We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.`
    },
    {
        title: "6. Limitation of Liability",
        content: `To the fullest extent permitted by applicable law, Gabhasti Giri shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses, resulting from:

• Your access to or use of (or inability to access or use) our services
• Any conduct or content of any third party on the services
• Any content obtained from the services
• Unauthorized access, use, or alteration of your transmissions or content`
    },
    {
        title: "7. Indemnification",
        content: `You agree to defend, indemnify, and hold harmless Gabhasti Giri and its officers, directors, employees, contractors, agents, licensors, and suppliers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the services.`
    },
    {
        title: "8. Termination",
        content: `We may terminate or suspend your access to our services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.

Upon termination, your right to use the services will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive termination.`
    },
    {
        title: "9. Governing Law",
        content: `These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Gabhasti Giri operates, without regard to its conflict of law provisions.

Any disputes arising from or relating to these Terms or your use of our services shall be resolved exclusively in the courts of the applicable jurisdiction.`
    },
    {
        title: "10. Contact Information",
        content: `If you have any questions about these Terms of Service, please contact us at:

Email: legal@Gabhasti Giri.dev
Address: Available upon request

We will respond to your inquiry within a reasonable timeframe.`
    }
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1] as const,
        },
    },
};

export const Terms: React.FC = () => {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 text-white hover:text-neutral-400 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>
                    <span className="text-xl font-bold tracking-tighter">Gabhasti Giri<span className="text-white">.</span></span>
                </div>
            </header>

            {/* Hero */}
            <section className="pt-40 pb-16 px-6 md:px-10">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="space-y-6"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">Terms of Service</h1>
                        <p className="text-neutral-500 font-light text-lg">
                            Last updated: January 16, 2026
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="pb-40 px-6 md:px-10">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        className="space-y-12"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {sections.map((section, index) => (
                            <motion.article
                                key={index}
                                variants={itemVariants}
                                className="space-y-4"
                            >
                                <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                                <div className="text-neutral-400 leading-relaxed whitespace-pre-line">
                                    {section.content}
                                </div>
                            </motion.article>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 px-6 md:px-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-neutral-600 text-xs font-mono">© 2026 Gabhasti Giri</p>
                    <div className="flex gap-8 text-neutral-600 text-xs font-mono">
                        <Link to="/blog" className="hover:text-white transition-colors">JOURNAL</Link>
                        <Link to="/" className="hover:text-white transition-colors">HOME</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};