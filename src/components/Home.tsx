import { motion } from 'motion/react';
import { PenLine, Upload, Zap, Download } from 'lucide-react';
import type { ReactNode } from 'react';

interface HomeProps {
  onStart: () => void;
  onLogin: () => void;
}

export default function Home({ onStart, onLogin }: HomeProps) {
  return (
    <div className="py-20 flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-20 h-20 bg-[#141414] rounded-full flex items-center justify-center text-[#E4E3E0] mb-8"
      >
        <PenLine size={32} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-6xl md:text-8xl font-sans font-bold tracking-tighter mb-6 uppercase"
      >
        Scribe<span className="text-[#888]">AI</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xl md:text-2xl text-[#666] max-w-2xl font-sans italic mb-12"
      >
        Capture the soul of your handwriting. 
        Replicate your stroke, slant, and spacing using advanced AI.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-4"
      >
        <button
          onClick={onStart}
          className="px-8 py-4 bg-[#141414] text-[#E4E3E0] rounded-full text-lg font-medium hover:bg-[#333] transition-colors flex items-center gap-2"
        >
          Initialize Stylist <Zap size={20} />
        </button>
        <button
          onClick={onLogin}
          className="px-8 py-4 border border-[#141414] text-[#141414] rounded-full text-lg font-medium hover:bg-[#d4d3d0] transition-colors"
        >
          Sign In
        </button>
      </motion.div>

      <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 text-left w-full max-w-5xl">
        <Feature 
          icon={<Upload size={24} />} 
          title="Upload Samples" 
          description="Provide a few photos of your handwriting. Our AI analyzes the unique nuances of your style."
        />
        <Feature 
          icon={<Zap size={24} />} 
          title="AI Synthesis" 
          description="We extract features like stroke width, curvature, and connectivity to build your digital twin writing."
        />
        <Feature 
          icon={<Download size={24} />} 
          title="PDF Export" 
          description="Generate full pages of handwritten notes and export them as clean, professional PDFs."
        />
      </div>
    </div>
  );
}

function Feature({ icon, title, description }: { icon: ReactNode, title: string, description: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-6 border border-[#141414] rounded-2xl bg-white/50 backdrop-blur-sm"
    >
      <div className="mb-4 text-[#141414]">{icon}</div>
      <h3 className="text-xl font-bold mb-2 uppercase tracking-tight font-sans">{title}</h3>
      <p className="text-[#666] italic leading-relaxed">{description}</p>
    </motion.div>
  );
}
