import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-neon-blue flex flex-col items-center justify-center p-4 relative overflow-hidden font-pixel">
      {/* CRT Scanline Effect */}
      <div className="scanline" />
      
      {/* Background Noise/Static Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-12 text-center relative z-10"
      >
        <h1 
          className="text-4xl md:text-6xl font-bold tracking-[0.2em] uppercase glitch-text"
          data-text="SYSTEM_SNAKE_V1.0"
        >
          SYSTEM_SNAKE_V1.0
        </h1>
        <div className="flex items-center justify-center gap-4 mt-4">
          <span className="h-[1px] w-12 bg-neon-pink/50" />
          <p className="text-neon-pink text-[10px] tracking-[0.4em] uppercase animate-pulse">
            STATUS: OPERATIONAL // CORE_LOADED
          </p>
          <span className="h-[1px] w-12 bg-neon-pink/50" />
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center gap-12 relative z-10 w-full max-w-6xl">
        {/* Center: Game */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-shrink-0 relative"
        >
          {/* Decorative Glitch Borders */}
          <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-neon-pink" />
          <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-neon-blue" />
          <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-neon-blue" />
          <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-neon-pink" />
          
          <SnakeGame />
        </motion.div>

        {/* Bottom: Music & Info */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row gap-8 w-full max-w-4xl items-start"
        >
          <div className="flex-1 w-full border border-neon-blue/20 p-4 bg-black/40 relative">
            <div className="absolute -top-2 left-4 px-2 bg-[#050505] text-[8px] text-neon-blue/60 uppercase tracking-widest">
              AUDIO_SUBSYSTEM
            </div>
            <MusicPlayer />
          </div>
          
          <div className="p-6 bg-black/40 border border-neon-pink/20 flex-1 w-full relative">
            <div className="absolute -top-2 left-4 px-2 bg-[#050505] text-[8px] text-neon-pink/60 uppercase tracking-widest">
              INPUT_MAPPINGS
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">NAV_VECTORS</span>
                <div className="flex gap-1">
                  {['↑', '↓', '←', '→'].map(key => (
                    <div key={key} className="w-6 h-6 border border-neon-blue/40 flex items-center justify-center text-[10px] text-neon-blue">
                      {key}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">EXEC_TOGGLE</span>
                <div className="px-3 py-1 border border-neon-pink/40 text-[10px] text-neon-pink">
                  SPACE_BAR
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col items-center gap-2 mt-8 opacity-40">
          <div className="flex items-center gap-4 text-[8px] font-mono tracking-[0.3em] uppercase">
            <span>KERNEL: 6.0.VITE</span>
            <span className="w-1 h-1 bg-neon-blue" />
            <span>UI: REACT_ENGINE</span>
            <span className="w-1 h-1 bg-neon-pink" />
            <span>AI: GEMINI_CORE</span>
          </div>
          <div className="text-[6px] tracking-[1em] text-zinc-700 uppercase">
            UNAUTHORIZED ACCESS IS PROHIBITED
          </div>
        </div>
      </main>
    </div>
  );
}
