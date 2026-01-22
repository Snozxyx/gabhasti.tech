import React from "react";
import { TextRevealByWord } from "@/components/ui/text-reveal";

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative min-h-[120vh] flex flex-col items-center pt-32 pb-20">

      {/* A subtle top fade to separate sections visually without hard lines */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6">
        {/* Text Reveal - Using the clean typography */}
        <TextRevealByWord
          text="A curious mind with steady focus, always learning, always moving forward—quietly determined to become better than yesterday."
          className="h-[800vh] text-white/80"
        />
      </div>
    </section>
  );
};