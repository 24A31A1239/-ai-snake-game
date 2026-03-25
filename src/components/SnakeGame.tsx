import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 80; // Faster speed

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [trail, setTrail] = useState<{ x: number, y: number }[]>([]);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snake-high-score');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snake-high-score', score.toString());
    }
  }, [score, highScore]);
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood());
      } else {
        const removed = newSnake.pop();
        if (removed) {
          setTrail(prevTrail => [removed, ...prevTrail].slice(0, 5));
        }
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          if (gameOver) resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  useEffect(() => {
    const interval = setInterval(moveSnake, SPEED);
    return () => clearInterval(interval);
  }, [moveSnake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setTrail([]);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-black/60 border-2 border-neon-blue/20 relative">
      {/* Decorative Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 bg-neon-blue" />
      <div className="absolute top-0 right-0 w-2 h-2 bg-neon-pink" />
      <div className="absolute bottom-0 left-0 w-2 h-2 bg-neon-pink" />
      <div className="absolute bottom-0 right-0 w-2 h-2 bg-neon-blue" />

      <div className="flex justify-between w-full px-2">
        <div className="text-neon-blue font-pixel text-xs tracking-widest">
          DATA_SCORE: <span className="text-white">{score}</span>
        </div>
        <div className="text-neon-pink font-pixel text-[10px] tracking-widest animate-pulse">
          {gameOver ? 'CRITICAL_FAILURE' : isPaused ? 'HALTED' : 'EXECUTING'}
        </div>
      </div>

      <div 
        className="relative bg-[#0a0a0a] border-2 border-neon-blue/40 overflow-hidden"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Trail segments */}
        {trail.map((segment, i) => (
          <div
            key={`trail-${i}-${segment.x}-${segment.y}`}
            className="absolute w-[20px] h-[20px]"
            style={{
              left: segment.x * 20,
              top: segment.y * 20,
              backgroundColor: 'var(--color-neon-blue)',
              opacity: (5 - i) * 0.1,
              boxShadow: `0 0 ${10 - i * 2}px var(--color-neon-blue)`,
              zIndex: 1,
            }}
          />
        ))}

        {/* Snake segments */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            initial={false}
            animate={{ x: 0, y: 0 }}
            transition={{ duration: 0.05 }}
            className="absolute w-[20px] h-[20px]"
            style={{
              left: segment.x * 20,
              top: segment.y * 20,
              backgroundColor: i === 0 ? 'var(--color-neon-blue)' : '#004444',
              boxShadow: i === 0 ? '0 0 15px var(--color-neon-blue)' : 'none',
              zIndex: i === 0 ? 10 : 5,
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="absolute w-[20px] h-[20px] bg-neon-pink shadow-[0_0_15px_var(--color-neon-pink)]"
          style={{
            left: food.x * 20,
            top: food.y * 20,
          }}
        />

        {/* Dashed Border Overlay */}
        <div className="absolute inset-2 border border-dashed border-neon-blue/10 rounded pointer-events-none z-10" />
        
        {/* Snake Game Label */}
        <div className="absolute bottom-2 left-2 text-neon-blue/30 font-pixel text-[8px] uppercase tracking-[0.5em] z-10">
          CORE_PROCESS_0x42
        </div>

        {/* Game Over Overlay */}
        <AnimatePresence>
          {(gameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md"
            >
              <div className="border border-neon-pink/40 p-10 bg-black/60 flex flex-col items-center justify-center min-w-[320px] relative">
                {/* Glitch lines */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-neon-pink/20 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-neon-blue/20 animate-pulse" />
                
                <h2 className="text-3xl font-bold text-neon-pink mb-8 tracking-[0.2em] uppercase text-center glitch-text" data-text={gameOver ? 'SYSTEM_CRASH' : 'PROCESS_HALTED'}>
                  {gameOver ? 'SYSTEM_CRASH' : 'PROCESS_HALTED'}
                </h2>
                <button
                  onClick={gameOver ? resetGame : () => setIsPaused(false)}
                  className="px-10 py-3 border-2 border-neon-blue text-neon-blue font-bold hover:bg-neon-blue hover:text-black transition-all uppercase tracking-[0.3em] text-xs"
                >
                  {gameOver ? 'REBOOT' : 'CONTINUE'}
                </button>
                <p className="mt-6 text-neon-blue/40 text-[8px] font-pixel uppercase tracking-widest">
                  SIGNAL_INTERRUPT: [SPACE]
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full">
        <div className="flex flex-col items-center p-4 bg-black/40 border border-neon-blue/10">
          <span className="text-[8px] text-zinc-600 uppercase tracking-widest mb-1">FREQ</span>
          <span className="text-neon-blue font-pixel text-[10px]">80HZ</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-black/40 border border-neon-blue/10">
          <span className="text-[8px] text-zinc-600 uppercase tracking-widest mb-1">GRID</span>
          <span className="text-neon-blue font-pixel text-[10px]">20X20</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-black/40 border border-neon-pink/10">
          <span className="text-[8px] text-zinc-600 uppercase tracking-widest mb-1">RECORD</span>
          <span className="text-neon-pink font-pixel text-[10px]">{highScore}</span>
        </div>
      </div>
    </div>
  );
};
