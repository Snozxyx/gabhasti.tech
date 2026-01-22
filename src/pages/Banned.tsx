"use client";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldX, Mail } from "lucide-react";

export const Banned = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 flex items-center justify-center overflow-hidden">
      {/* Background Effects - Red tinted */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-red-800/5 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Shield Icon */}
          <motion.div 
            className="flex justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <ShieldX className="w-12 h-12 text-red-400" />
            </div>
          </motion.div>

          {/* Content */}
          <div className="space-y-4">
            <span className="text-xs font-mono text-red-400/60 tracking-widest uppercase">
              // Access Denied — Account Suspended
            </span>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tighter text-white">
              You've Been <span className="text-red-400">Banned.</span>
            </h2>
            <p className="text-neutral-400 font-light leading-relaxed max-w-md mx-auto">
              Your account has been suspended due to a violation of our community guidelines. 
              If you believe this is a mistake, please contact our support team.
            </p>
          </div>

          {/* Info Card */}
          <div className="bg-neutral-900/50 border border-white/5 rounded-xl p-6 max-w-sm mx-auto">
            <p className="text-sm text-neutral-500 mb-2">Suspension Details</p>
            <p className="text-white font-mono text-sm">
              Contact support for more information about your account status.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a 
              href="mailto:support@gabhasti.tech"
              className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-neutral-200 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Contact Support
            </a>
            <Link 
              to="/"
              className="group flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 text-white hover:bg-white/5 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};