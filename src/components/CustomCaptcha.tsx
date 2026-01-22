import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface CustomCaptchaProps {
  onVerify: (isValid: boolean) => void;
  className?: string;
}

export const CustomCaptcha: React.FC<CustomCaptchaProps> = ({ onVerify, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  // Generate random captcha text
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Draw captcha on canvas
  const drawCaptcha = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise dots
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        1,
        1
      );
    }

    // Draw text with distortion
    ctx.font = 'bold 24px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Add slight rotation and position variation for each character
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const x = (canvas.width / text.length) * (i + 0.5);
      const y = canvas.height / 2 + (Math.random() - 0.5) * 10;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.3);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }

    // Add some lines for extra distortion
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.2})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
  };

  // Initialize captcha
  const initializeCaptcha = () => {
    const newText = generateCaptcha();
    setCaptchaText(newText);
    setUserInput('');
    setIsVerified(false);
    onVerify(false);
    drawCaptcha(newText);
  };

  useEffect(() => {
    initializeCaptcha();
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setUserInput(value);

    const isValid = value === captchaText.toUpperCase();
    setIsVerified(isValid);
    onVerify(isValid);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <canvas
          ref={canvasRef}
          width={200}
          height={60}
          className="border border-white/10 rounded-lg bg-black"
          style={{ imageRendering: 'pixelated' }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={initializeCaptcha}
          className="border-white/10 text-white hover:bg-white/5"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Enter the code above"
          className="w-full bg-black/40 border border-white/10 focus:border-white focus:ring-white/10 h-12 rounded-xl px-4 text-white placeholder:text-neutral-500 transition-all duration-300"
          maxLength={6}
        />
        {isVerified && (
          <p className="text-sm text-green-400 flex items-center gap-2">
            ✓ Captcha verified
          </p>
        )}
      </div>
    </div>
  );
};