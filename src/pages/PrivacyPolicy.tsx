"use client";
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const sections = [
    {
        title: "1. Information We Collect",
        content: `We collect information you provide directly to us, such as when you contact us through our website, subscribe to our newsletter, or interact with our services. This may include your name, email address, and any other information you choose to provide.

We also automatically collect certain information about your device and how you interact with our website, including:
• IP address and location information
• Browser type and version
• Operating system
• Referring website URLs
• Pages viewed and time spent on our site
• Device identifiers and usage data`
    },
    {
        title: "2. How We Use Your Information",
        content: `We use the information we collect to:
• Provide, maintain, and improve our services
• Communicate with you about our services
• Respond to your inquiries and support requests
• Analyze usage patterns and improve user experience
• Ensure the security and integrity of our services
• Comply with legal obligations

We do not sell, trade, or rent your personal information to third parties for marketing purposes.`
    },
    {
        title: "3. Cookies and Tracking Technologies",
        content: `We use cookies and similar tracking technologies to enhance your experience on our website. Cookies are small data files stored on your device that help us remember your preferences and understand how you use our site.

Types of cookies we use:
• Essential cookies: Required for basic website functionality
• Analytics cookies: Help us understand how visitors use our site
• Preference cookies: Remember your settings and preferences

You can control cookie settings through your browser preferences. However, disabling certain cookies may affect website functionality.`
    },
    {
        title: "4. Data Sharing and Disclosure",
        content: `We may share your information in the following circumstances:
• With your explicit consent
• To comply with legal obligations or court orders
• To protect our rights, property, or safety
• In connection with a business transfer or acquisition
• With service providers who help us operate our website (under strict confidentiality agreements)

We do not sell your personal information to third parties.`
    },
    {
        title: "5. Data Security",
        content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
• Encryption of data in transit and at rest
• Regular security assessments and updates
• Access controls and authentication procedures
• Secure hosting infrastructure

However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.`
    },
    {
        title: "6. Data Retention",
        content: `We retain your personal information only as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. When we no longer need your information, we will securely delete or anonymize it.

Contact form submissions are typically retained for up to 3 years for customer service and legal purposes.`
    },
    {
        title: "7. Your Rights and Choices",
        content: `Depending on your location, you may have certain rights regarding your personal information:
• Access: Request a copy of the personal information we hold about you
• Correction: Request correction of inaccurate or incomplete information
• Deletion: Request deletion of your personal information
• Portability: Request transfer of your data to another service
• Opt-out: Withdraw consent or object to certain processing

To exercise these rights, please contact us using the information provided below.`
    },
    {
        title: "8. Third-Party Services",
        content: `Our website may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these external sites or services. We encourage you to review their privacy policies before providing any personal information.

We use Google Analytics to understand website usage. Google may collect information about your use of our site in accordance with their Privacy Policy.`
    },
    {
        title: "9. Children's Privacy",
        content: `Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information promptly.

If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.`
    },
    {
        title: "10. Changes to This Privacy Policy",
        content: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date.

Your continued use of our services after any changes indicates your acceptance of the updated Privacy Policy.`
    },
    {
        title: "11. Contact Us",
        content: `If you have any questions about this Privacy Policy or our data practices, please contact us:

Email: privacy@gabhasti.dev
Subject: Privacy Policy Inquiry

We will respond to your inquiry within 30 days and address any concerns you may have regarding your privacy.`
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

export const PrivacyPolicy: React.FC = () => {
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
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">Privacy Policy</h1>
                        <p className="text-neutral-500 font-light text-lg">
                            Last updated: January 21, 2026
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