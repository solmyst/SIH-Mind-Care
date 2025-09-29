import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import type { MoodType } from '../App';

interface MoodTransitionProps {
  currentMood: MoodType;
}

const moodEmojis: Record<MoodType, string> = {
  happy: '😊',
  calm: '😌',
  neutral: '😐',
  anxious: '😰',
  sad: '😢',
  stressed: '😫',
};

export function MoodTransition({ currentMood }: MoodTransitionProps) {
  const [showTransition, setShowTransition] = useState(false);
  const [previousMood, setPreviousMood] = useState<MoodType>(currentMood);

  useEffect(() => {
    const handleMoodChange = (event: CustomEvent<MoodType>) => {
      if (event.detail && event.detail !== currentMood) {
        setPreviousMood(currentMood);
        setShowTransition(true);
        
        // Hide transition after animation
        setTimeout(() => setShowTransition(false), 2000);
      }
    };

    window.addEventListener('moodChange', handleMoodChange as EventListener);
    return () => window.removeEventListener('moodChange', handleMoodChange as EventListener);
  }, [currentMood]);

  return (
    <AnimatePresence>
      {showTransition && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border"
          style={{ borderColor: `var(--mood-primary)` }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{moodEmojis[previousMood]}</span>
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
                className="text-gray-400"
              >
                →
              </motion.div>
              <span className="text-2xl">{moodEmojis[currentMood]}</span>
            </div>
            <div className="text-sm">
              <p className="font-medium" style={{ color: `var(--mood-primary)` }}>
                Mood Updated
              </p>
              <p className="text-gray-600 text-xs">
                AI detected: {currentMood}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}