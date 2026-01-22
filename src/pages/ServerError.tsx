"use client";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ServerCrash, RefreshCw, Home } from "lucide-react";

export const ServerError = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 flex items-center justify-center overflow-hidden">
      {/* Background Effects - Yellow/Orange tinted */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-900/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-yellow-800/5 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* 505 Number */}
          <motion.h1 
            className="text-[120px] md:text-[200px] font-bold tracking-tighter leading-none text-white/5 select-none"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            505
          </motion.h1>

          {/* Server Icon */}
          <motion.div 
            className="flex justify-center -mt-16"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-20 h-20 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <ServerCrash className="w-10 h-10 text-orange-400" />
            </div>
          </motion.div>

          {/* Content */}
          <div className="space-y-4">
            <span className="text-xs font-mono text-orange-400/60 tracking-widest uppercase">
              // Error — Service Unavailable
            </span>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tighter text-white">
              Out of <span className="text-orange-400">Service.</span>
            </h2>
            <p className="text-neutral-400 font-light leading-relaxed max-w-md mx-auto">
              Our servers are currently experiencing issues. Our team has been notified 
              and is working to restore service as quickly as possible.
            </p>
          </div>

          {/* Status Card */}
          <div className="bg-neutral-900/50 border border-white/5 rounded-xl p-6 max-w-sm mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              <p className="text-sm text-neutral-500">System Status</p>
            </div>
            <p className="text-white font-mono text-sm">
              Experiencing temporary downtime. Please try again shortly.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={() => window.location.reload()}
              className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-neutral-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <Link 
              to="/"
              className="group flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 text-white hover:bg-white/5 transition-colors"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};