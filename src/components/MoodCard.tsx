import { motion } from 'motion/react';
import { Card } from './ui/card';
import { useState, useEffect } from 'react';
import type { MoodType } from '../App';

interface MoodCardProps {
  currentMood: MoodType;
}

export function MoodCard({ currentMood }: MoodCardProps) {
  const [isAiDetected, setIsAiDetected] = useState(false);

  // Listen for AI mood changes
  useEffect(() => {
    const handleMoodChange = () => {
      setIsAiDetected(true);
      // Reset the indicator after 3 seconds
      setTimeout(() => setIsAiDetected(false), 3000);
    };

    window.addEventListener('moodChange', handleMoodChange);
    return () => window.removeEventListener('moodChange', handleMoodChange);
  }, []);
  const moodConfig = {
    happy: { emoji: '😊', label: 'Happy' },
    calm: { emoji: '😌', label: 'Calm' },
    sad: { emoji: '😢', label: 'Sad' },
    anxious: { emoji: '😰', label: 'Anxious' },
    stressed: { emoji: '😫', label: 'Stressed' },
    neutral: { emoji: '😐', label: 'Neutral' }
  };

  const config = moodConfig[currentMood];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-0 text-center space-y-4">
        <h3 className="text-xl text-blue-500 mb-4">Current Mood</h3>
        
        <div 
          className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl shadow-lg"
          style={{ background: `var(--mood-gradient)` }}
        >
          {config.emoji}
        </div>
        
        <div>
          <p className="text-xl font-medium capitalize mb-1" style={{ color: `var(--mood-primary)` }}>
            {config.label}
          </p>
          <p className="text-sm text-gray-600">
            {isAiDetected ? (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-blue-600 font-medium"
              >
                🤖 AI detected mood change
              </motion.span>
            ) : (
              'Theme adapts to your mood'
            )}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}