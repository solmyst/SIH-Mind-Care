import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowLeft } from 'lucide-react';
import type { MoodType, PageType } from '../App';

interface MoodSelectorProps {
  onMoodSelect: (mood: MoodType) => void;
  onNavigate: (page: PageType) => void;
  currentMood: MoodType;
}

const moods = [
  {
    type: 'happy' as MoodType,
    emoji: '😊',
    label: 'Happy',
    description: 'Feeling great and positive!',
    color: 'rgb(255, 193, 7)',
    activities: ['Celebrate wins', 'Share positivity', 'Creative activities']
  },
  {
    type: 'calm' as MoodType,
    emoji: '😌',
    label: 'Calm',
    description: 'Peaceful and relaxed',
    color: 'rgb(33, 150, 243)',
    activities: ['Meditation', 'Gentle music', 'Journaling']
  },
  {
    type: 'sad' as MoodType,
    emoji: '😢',
    label: 'Sad',
    description: 'Feeling down or melancholy',
    color: 'rgb(103, 58, 183)',
    activities: ['Self-care', 'Talk to someone', 'Gentle activities']
  },
  {
    type: 'anxious' as MoodType,
    emoji: '😰',
    label: 'Anxious',
    description: 'Worried or nervous',
    color: 'rgb(76, 175, 80)',
    activities: ['Breathing exercises', 'Grounding techniques', 'Calming music']
  },
  {
    type: 'stressed' as MoodType,
    emoji: '😫',
    label: 'Stressed',
    description: 'Overwhelmed or pressured',
    color: 'rgb(255, 138, 128)',
    activities: ['Quick relaxation', 'Break down tasks', 'Mini games']
  }
];

export function MoodSelector({ onMoodSelect, onNavigate, currentMood }: MoodSelectorProps) {
  const handleMoodSelect = (mood: MoodType) => {
    onMoodSelect(mood);
    // Wait for theme transition then navigate
    setTimeout(() => onNavigate('dashboard'), 800);
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-6">
      {/* Header - Responsive */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4 sm:px-0"
      >
        <Button
          variant="ghost"
          onClick={() => onNavigate('landing')}
          className="rounded-full p-2 sm:p-3 self-start sm:self-auto"
          style={{ color: `var(--mood-primary)` }}
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
        <div className="w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold" style={{ color: `var(--mood-primary)` }}>
            How are you feeling today?
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            Select your current mood to get personalized recommendations
          </p>
        </div>
      </motion.div>

      {/* Mood Grid - Responsive */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-0">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {moods.map((mood, index) => (
            <motion.div
              key={mood.type}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`p-4 sm:p-6 cursor-pointer transition-all duration-300 rounded-xl sm:rounded-2xl bg-white/70 backdrop-blur-sm border-2 hover:shadow-xl touch-manipulation ${
                  currentMood === mood.type 
                    ? 'border-current shadow-lg' 
                    : 'border-transparent hover:border-gray-200'
                }`}
                style={{ 
                  borderColor: currentMood === mood.type ? mood.color : undefined,
                  boxShadow: currentMood === mood.type ? `0 0 20px ${mood.color}20` : undefined
                }}
                onClick={() => handleMoodSelect(mood.type)}
              >
                <div className="text-center space-y-3 sm:space-y-4">
                  {/* Animated Emoji */}
                  <motion.div
                    className="text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-4"
                    animate={{ 
                      rotate: currentMood === mood.type ? [0, -10, 10, 0] : 0,
                      scale: currentMood === mood.type ? [1, 1.1, 1] : 1
                    }}
                    transition={{ 
                      duration: 0.6, 
                      repeat: currentMood === mood.type ? Infinity : 0,
                      repeatDelay: 2
                    }}
                  >
                    {mood.emoji}
                  </motion.div>

                  {/* Mood Info */}
                  <div>
                    <h3 
                      className="text-lg sm:text-xl mb-1 sm:mb-2 font-semibold"
                      style={{ color: mood.color }}
                    >
                      {mood.label}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                      {mood.description}
                    </p>
                  </div>

                  {/* Suggested Activities */}
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-xs text-gray-500 mb-1 sm:mb-2">Suggested activities:</p>
                    <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                      {mood.activities.map((activity, idx) => (
                        <motion.div
                          key={idx}
                          className="text-xs px-2 sm:px-3 py-1 rounded-full bg-white/50 whitespace-nowrap"
                          style={{ color: mood.color }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + idx * 0.1 }}
                        >
                          {activity}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-8 sm:mt-12 px-4 sm:px-0"
        >
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
            Your mood helps us personalize your experience and suggest the best activities for you.
          </p>
          
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4"
          >
            <Button
              variant="outline"
              onClick={() => onNavigate('dashboard')}
              className="rounded-full px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base w-full sm:w-auto"
              style={{ borderColor: `var(--mood-primary)`, color: `var(--mood-primary)` }}
            >
              View Wellness Journey
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigate('peer-support')}
              className="rounded-full px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base w-full sm:w-auto"
              style={{ borderColor: `var(--mood-primary)`, color: `var(--mood-primary)` }}
            >
              Connect with Peers
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating mood particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              color: `var(--mood-primary)`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>
    </div>
  );
}