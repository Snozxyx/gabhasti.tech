"use client";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-white/[0.01] rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* 404 Number */}
          <motion.h1 
            className="text-[150px] md:text-[250px] font-bold tracking-tighter leading-none text-white/5 select-none"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            404
          </motion.h1>

          {/* Content */}
          <div className="space-y-4 -mt-20">
            <span className="text-xs font-mono text-neutral-500 tracking-widest uppercase">
              // Error — Page Not Found
            </span>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tighter text-white">
              Lost in the <span className="text-neutral-500">Void.</span>
            </h2>
            <p className="text-neutral-400 font-light leading-relaxed max-w-md mx-auto">
              The page you're looking for has drifted into the unknown. 
              Perhaps it was never here, or maybe it moved on to somewhere else.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link 
              to="/"
              className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-neutral-200 transition-colors"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="group flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 text-white hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Go Back
            </button>
          </div>
        </motion.div>

        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        </div>
      </div>
    </div>
  );
};