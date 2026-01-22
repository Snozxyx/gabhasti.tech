import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('analytics-enabled', 'true');
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    localStorage.setItem('analytics-enabled', 'false');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto bg-neutral-900 border border-white/10 rounded-xl p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Cookie className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-white mb-2">
                  Cookie Consent
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                  We use cookies to enhance your experience, analyze site traffic, and personalize content. 
                  You can opt-out of analytics tracking at any time.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={handleAccept}
                    className="bg-white text-black hover:bg-neutral-200 text-sm"
                  >
                    Accept All
                  </Button>
                  <Button
                    onClick={handleReject}
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5 text-sm"
                  >
                    Reject Analytics
                  </Button>
                  <button
                    onClick={() => setShowBanner(false)}
                    className="p-2 text-neutral-500 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const isAnalyticsEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  const consent = localStorage.getItem('cookie-consent');
  const analytics = localStorage.getItem('analytics-enabled');
  return consent === 'accepted' && analytics === 'true';
};
