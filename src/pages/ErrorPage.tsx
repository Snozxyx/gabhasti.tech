"use client";

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, ArrowLeft, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logError, generateErrorId } from '@/lib/errors';
import { toast } from 'sonner';

export const ErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorId, setErrorId] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const error = location.state?.error || new Error('An unexpected error occurred');
    const fallbackId = generateErrorId();

    const sendError = async () => {
      const recordedId = await logError({
        error_type: 'client',
        error_message: error.message || 'Unknown error',
        error_stack: error.stack,
        page_path: location.pathname,
        user_agent: navigator.userAgent,
        additional_data: {
          error_name: error.name,
          timestamp: new Date().toISOString(),
        },
      });

      setErrorId(recordedId || fallbackId);
    };

    sendError();
  }, [location]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(errorId);
      setCopied(true);
      toast.success('Error ID copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy error ID');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-500/[0.02] rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-red-500/[0.01] rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-12 h-12 text-red-400" />
            </div>
          </motion.div>

          {/* Content */}
          <div className="space-y-4">
            <span className="text-xs font-mono text-neutral-500 tracking-widest uppercase">
              // Error — Something Went Wrong
            </span>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-white">
              An Error <span className="text-red-400">Occurred</span>
            </h1>
            <p className="text-neutral-400 font-light leading-relaxed max-w-md mx-auto">
              We've encountered an unexpected error. Our team has been notified and is working on a fix.
              Please try again later or contact support if the problem persists.
            </p>

            {/* Error ID */}
            {errorId && (
              <div className="mt-8 p-4 bg-neutral-900/50 border border-white/5 rounded-lg">
                <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
                  Error ID
                </p>
                <div className="flex items-center justify-center gap-3">
                  <code className="text-sm font-mono text-white bg-black px-4 py-2 rounded border border-white/10">
                    {errorId}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="p-2 text-neutral-400 hover:text-white transition-colors"
                    title="Copy Error ID"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-neutral-600 mt-2">
                  Please include this ID when reporting the issue
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button
              onClick={() => navigate('/')}
              className="bg-white text-black hover:bg-neutral-200"
            >
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Button>
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </motion.div>

        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/5 to-transparent" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-red-500/5 to-transparent" />
        </div>
      </div>
    </div>
  );
};
