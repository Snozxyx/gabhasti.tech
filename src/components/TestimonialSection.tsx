import React from "react";
import { Testimonial } from "@/components/ui/design-testimonial";

export const TestimonialSection: React.FC = () => {
  return (
    <section id="testimonials" className="relative w-full py-24 flex flex-col items-center">
      {/* Subtle top fade */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-6">
        <Testimonial />
      </div>
      
      {/* Subtle bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
};
