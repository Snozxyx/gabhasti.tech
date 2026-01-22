"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SignInPageProps {
  className?: string;
}

// Animated dot matrix background using CSS
const DotMatrixBackground = ({ reverse = false }: { reverse?: boolean }) => {
  return (
    <div className={cn(
      "absolute inset-0 overflow-hidden",
      reverse ? "animate-fade-out" : "animate-fade-in"
    )}>
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(125, 125, 125, 0.3) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
    </div>
  );
};

const AnimatedNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Link
      to={href}
      className="relative overflow-hidden inline-block cursor-pointer group text-sm"
    >
      <div className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-full">
        <span className="text-gray-300 transition-colors duration-300">{children}</span>
        <span className="text-white absolute top-full">{children}</span>
      </div>
    </Link>
  );
};

function MiniNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef<number | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setHeaderShapeClass('rounded-xl');
    } else {
      shapeTimeoutRef.current = window.setTimeout(() => {
        setHeaderShapeClass('rounded-full');
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const logoElement = (
    <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="6" fill="none"/>
      <circle cx="50" cy="50" r="20" fill="white"/>
    </svg>
  );

  const navLinksData = [
    { label: 'Manifesto', href: '/#about' },
    { label: 'Careers', href: '/#projects' },
    { label: 'Discover', href: '/#blog' },
  ];

  const loginButtonElement = (
    <Link to="/register" className="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer">
      LogIn
    </Link>
  );

  const signupButtonElement = (
    <div className="relative group cursor-pointer">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full opacity-75 blur-sm group-hover:opacity-100 transition duration-300"></div>
      <Link to="/register" className="relative bg-black text-white text-sm font-medium py-2 px-5 rounded-full flex items-center justify-center">
        Signup
      </Link>
    </div>
  );

  return (
    <header className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl bg-black/60 backdrop-blur-xl border border-white/10 transition-all duration-300 ease-in-out overflow-hidden ${headerShapeClass}`}>
      <div className="flex items-center justify-between h-14 px-5">
        <Link to="/" className="flex items-center gap-2">
          {logoElement}
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinksData.map((link) => (
            <AnimatedNavLink key={link.label} href={link.href}>
              {link.label}
            </AnimatedNavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {loginButtonElement}
          {signupButtonElement}
        </div>

        <button onClick={toggleMenu} className="md:hidden text-white p-1 focus:outline-none z-20" aria-label="Toggle menu">
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="8" x2="20" y2="8"></line><line x1="4" y1="16" x2="20" y2="16"></line></svg>
          )}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="md:hidden overflow-hidden">
            <nav className="flex flex-col items-center gap-5 py-5 border-t border-white/10">
              {navLinksData.map((link) => (
                <Link key={link.label} to={link.href} onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition-colors text-base">
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center justify-center gap-6 pb-5">
              {loginButtonElement}
              {signupButtonElement}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export const SignInPage = ({ className }: SignInPageProps) => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "code" | "success">("email");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [showReverse, setShowReverse] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStep("code");
    }
  };

  useEffect(() => {
    if (step === "code") {
      setTimeout(() => {
        codeInputRefs.current[0]?.focus();
      }, 500);
    }
  }, [step]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        codeInputRefs.current[index + 1]?.focus();
      }

      if (index === 5 && value) {
        const isComplete = newCode.every(digit => digit.length === 1);
        if (isComplete) {
          setShowReverse(true);
          setTimeout(() => {
            setStep("success");
          }, 1500);
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleBackClick = () => {
    setStep("email");
    setCode(["", "", "", "", "", ""]);
    setShowReverse(false);
  };

  return (
    <div className={cn("relative min-h-screen w-full bg-black overflow-hidden", className)}>
      <DotMatrixBackground reverse={showReverse} />

      <div className="relative z-30 min-h-screen flex flex-col">
        <MiniNavbar />

        <div className="flex-1 flex items-center justify-center px-4 pt-20">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                {step === "email" ? (
                  <div className="space-y-8">
                    <div className="text-center space-y-2">
                      <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Welcome Developer</h1>
                      <p className="text-neutral-500">Your sign in component</p>
                    </div>

                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                      <button type="button" className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 px-4 rounded-full transition-colors">
                        <span className="font-bold text-lg">G</span>
                        Sign in with Google
                      </button>

                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-white/10"></div>
                        <span className="text-neutral-500 text-sm">or</span>
                        <div className="flex-1 h-px bg-white/10"></div>
                      </div>

                      <div className="relative">
                        <input
                          type="email"
                          placeholder="you@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full backdrop-blur-[1px] text-white border border-white/10 rounded-full py-3 px-4 focus:outline-none focus:border-white/30 text-center bg-transparent"
                          required
                        />
                        <button
                          type="submit"
                          className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-colors"
                        >
                          <span className="text-xl">→</span>
                        </button>
                      </div>
                    </form>

                    <p className="text-center text-xs text-neutral-600">
                      By signing up, you agree to the MSA, Product Terms, Policies, Privacy Notice, and Cookie Notice.
                    </p>
                  </div>
                ) : step === "code" ? (
                  <div className="space-y-8">
                    <div className="text-center space-y-2">
                      <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">We sent you a code</h1>
                      <p className="text-neutral-500">Please enter it</p>
                    </div>

                    <div className="flex justify-center">
                      <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-6 py-3">
                        {code.map((digit, i) => (
                          <div key={i} className="flex items-center">
                            <div className="relative w-8 h-10 flex items-center justify-center">
                              <input
                                ref={(el) => { codeInputRefs.current[i] = el; }}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                value={digit}
                                onChange={e => handleCodeChange(i, e.target.value)}
                                onKeyDown={e => handleKeyDown(i, e)}
                                className="w-8 text-center text-xl bg-transparent text-white border-none focus:outline-none focus:ring-0 appearance-none"
                                style={{ caretColor: 'transparent' }}
                              />
                              {!digit && (
                                <span className="absolute inset-0 flex items-center justify-center text-neutral-600 text-xl pointer-events-none">
                                  0
                                </span>
                              )}
                            </div>
                            {i < 5 && <span className="text-neutral-600 mx-1">|</span>}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-center">
                      <button className="text-neutral-500 hover:text-white text-sm transition-colors">
                        Resend code
                      </button>
                    </div>

                    <div className="flex gap-4">
                      <button onClick={handleBackClick} className="flex-1 py-3 rounded-full border border-white/10 text-white hover:bg-white/5 transition-colors">
                        Back
                      </button>
                      <button
                        className={`flex-1 py-3 rounded-full border transition-colors ${
                          code.every(d => d !== "")
                            ? "bg-white text-black border-transparent hover:bg-white/90 cursor-pointer"
                            : "bg-neutral-900 text-white/50 border-white/10 cursor-not-allowed"
                        }`}
                        disabled={!code.every(d => d !== "")}
                      >
                        Continue
                      </button>
                    </div>

                    <p className="text-center text-xs text-neutral-600">
                      By signing up, you agree to the MSA, Product Terms, Policies, Privacy Notice, and Cookie Notice.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8 text-center">
                    <div className="space-y-2">
                      <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">You're in!</h1>
                      <p className="text-neutral-500">Welcome</p>
                    </div>

                    <div className="flex justify-center">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.6 }}
                        className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center"
                      >
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    </div>

                    <Link to="/" className="block w-full py-3 rounded-full bg-white text-black font-medium hover:bg-neutral-200 transition-colors text-center">
                      Continue to Dashboard
                    </Link>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export { MiniNavbar };
