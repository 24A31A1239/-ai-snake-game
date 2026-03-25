import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Dreams",
    artist: "AI Synthwave",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "var(--color-neon-pink)",
  },
  {
    id: 2,
    title: "Cyber City",
    artist: "AI Lo-Fi",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "var(--color-neon-blue)",
  },
  {
    id: 3,
    title: "Midnight Drive",
    artist: "AI Retrowave",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "var(--color-neon-purple)",
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-black/60 border border-neon-blue/20 relative">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={handleNext}
      />

      <div className="flex items-center gap-6 mb-8">
        <div 
          className="w-20 h-20 border border-neon-blue/40 flex items-center justify-center relative overflow-hidden group bg-black/40"
        >
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            className="absolute inset-0 flex items-center justify-center"
          >
             <Music className="w-10 h-10 text-neon-blue/40" />
          </motion.div>
          
          {/* Visualizer bars */}
          <div className="absolute bottom-0 left-0 right-0 h-6 flex items-end justify-center gap-1 px-2 pb-1">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: isPlaying ? [2, 12, 4, 16, 6] : 2 }}
                transition={{ repeat: Infinity, duration: 0.5 + i * 0.1, ease: "easeInOut" }}
                className="w-1 bg-neon-blue"
              />
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <h3 className="text-lg font-bold text-neon-blue truncate mb-1 uppercase tracking-widest">{currentTrack.title}</h3>
          <p className="text-neon-pink text-[8px] font-pixel uppercase tracking-[0.3em]">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-1 w-full bg-zinc-900 mb-8 overflow-hidden group cursor-pointer border border-white/5">
        <motion.div 
          className="absolute h-full left-0 top-0 bg-neon-blue"
          style={{ 
            width: `${progress}%`, 
            boxShadow: `0 0 10px var(--color-neon-blue)`
          }}
        />
      </div>

      <div className="flex items-center justify-between">
        <button 
          onClick={handlePrev}
          className="p-2 text-neon-blue/60 hover:text-neon-blue transition-colors"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        <button 
          onClick={togglePlay}
          className="w-12 h-12 border-2 border-neon-blue flex items-center justify-center transition-all hover:bg-neon-blue hover:text-black group"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-neon-blue group-hover:text-black fill-current" />
          ) : (
            <Play className="w-6 h-6 text-neon-blue group-hover:text-black fill-current ml-1" />
          )}
        </button>

        <button 
          onClick={handleNext}
          className="p-2 text-neon-blue/60 hover:text-neon-blue transition-colors"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-8 flex items-center justify-between text-[7px] text-zinc-600 font-pixel tracking-widest uppercase">
        <div className="flex items-center gap-2">
          <Volume2 className="w-2 h-2" />
          <span>OUTPUT_L_R</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 bg-neon-green animate-pulse" />
          <span>STREAM_ACTIVE</span>
        </div>
      </div>
    </div>
  );
};
