import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Wind, 
  Heart, 
  Waves, 
  Flower2,
  X,
  Volume2,
  VolumeX
} from 'lucide-react';

interface BreathingExerciseProps {
  onClose: () => void;
  currentMood: string;
}

type ExerciseType = '4-7-8' | 'box' | 'triangle' | 'coherent';

interface Exercise {
  id: ExerciseType;
  name: string;
  description: string;
  icon: any;
  pattern: number[];
  labels: string[];
  duration: number;
  benefits: string[];
  color: string;
}

const exercises: Exercise[] = [
  {
    id: '4-7-8',
    name: '4-7-8 Breathing',
    description: 'Calming technique for anxiety and sleep',
    icon: Wind,
    pattern: [4, 7, 8], // inhale, hold, exhale
    labels: ['Inhale', 'Hold', 'Exhale'],
    duration: 4, // cycles
    benefits: ['Reduces anxiety', 'Improves sleep', 'Calms nervous system'],
    color: 'from-blue-400 to-purple-500'
  },
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Navy SEAL technique for focus and calm',
    icon: Heart,
    pattern: [4, 4, 4, 4], // inhale, hold, exhale, hold
    labels: ['Inhale', 'Hold', 'Exhale', 'Hold'],
    duration: 4,
    benefits: ['Improves focus', 'Reduces stress', 'Enhances performance'],
    color: 'from-green-400 to-teal-500'
  },
  {
    id: 'triangle',
    name: 'Triangle Breathing',
    description: 'Simple 3-step breathing for beginners',
    icon: Waves,
    pattern: [4, 4, 4], // inhale, hold, exhale
    labels: ['Inhale', 'Hold', 'Exhale'],
    duration: 6,
    benefits: ['Easy to learn', 'Quick relaxation', 'Stress relief'],
    color: 'from-orange-400 to-pink-500'
  },
  {
    id: 'coherent',
    name: 'Coherent Breathing',
    description: '5-second rhythm for heart coherence',
    icon: Flower2,
    pattern: [5, 5], // inhale, exhale
    labels: ['Inhale', 'Exhale'],
    duration: 10,
    benefits: ['Heart coherence', 'Emotional balance', 'Mental clarity'],
    color: 'from-purple-400 to-indigo-500'
  }
];

export function BreathingExercise({ onClose, currentMood }: BreathingExerciseProps) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise>(exercises[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [timeLeft, setTimeLeft] = useState(selectedExercise.pattern[0]);
  const [totalTime, setTotalTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Play sound for phase transitions
  const playSound = (frequency: number, duration: number) => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  // Reset exercise
  const resetExercise = () => {
    setIsActive(false);
    setCurrentPhase(0);
    setCurrentCycle(0);
    setTimeLeft(selectedExercise.pattern[0]);
    setTotalTime(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Start/pause exercise
  const toggleExercise = () => {
    if (isActive) {
      setIsActive(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } else {
      setIsActive(true);
      playSound(400, 0.2); // Start sound
    }
  };

  // Exercise timer logic
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Move to next phase
            setCurrentPhase((phase) => {
              const nextPhase = (phase + 1) % selectedExercise.pattern.length;
              
              if (nextPhase === 0) {
                // Completed a full cycle
                setCurrentCycle((cycle) => {
                  const nextCycle = cycle + 1;
                  if (nextCycle >= selectedExercise.duration) {
                    // Exercise completed
                    setIsActive(false);
                    playSound(600, 0.5); // Completion sound
                    return 0;
                  }
                  return nextCycle;
                });
              }
              
              // Play phase transition sound
              const frequencies = [300, 400, 500, 350]; // Different tones for each phase
              playSound(frequencies[nextPhase] || 400, 0.3);
              
              return nextPhase;
            });
            
            return selectedExercise.pattern[currentPhase === selectedExercise.pattern.length - 1 ? 0 : currentPhase + 1];
          }
          return prev - 1;
        });
        
        setTotalTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, currentPhase, selectedExercise]);

  // Reset when exercise changes
  useEffect(() => {
    resetExercise();
  }, [selectedExercise]);

  const progress = ((selectedExercise.pattern[currentPhase] - timeLeft) / selectedExercise.pattern[currentPhase]) * 100;
  const totalProgress = ((currentCycle * selectedExercise.pattern.reduce((a, b) => a + b, 0) + 
    selectedExercise.pattern.slice(0, currentPhase + 1).reduce((a, b) => a + b, 0) - timeLeft) / 
    (selectedExercise.duration * selectedExercise.pattern.reduce((a, b) => a + b, 0))) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: `var(--mood-gradient)` }}
            >
              <Wind className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Breathing Exercises</h2>
              <p className="text-sm text-gray-600">Find your calm with guided breathing</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="rounded-full p-2"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-gray-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-gray-600" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full p-2"
            >
              <X className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 p-6">
          {/* Exercise Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Choose Exercise</h3>
            <div className="space-y-3">
              {exercises.map((exercise) => (
                <motion.button
                  key={exercise.id}
                  onClick={() => setSelectedExercise(exercise)}
                  className={`w-full p-4 rounded-2xl text-left transition-all ${
                    selectedExercise.id === exercise.id
                      ? 'bg-gradient-to-r text-white shadow-lg'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                  style={selectedExercise.id === exercise.id ? { background: `var(--mood-gradient)` } : {}}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <exercise.icon className="w-5 h-5" />
                    <span className="font-medium">{exercise.name}</span>
                  </div>
                  <p className="text-xs opacity-90">{exercise.description}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Breathing Animation */}
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              {/* Breathing Circle */}
              <motion.div
                className={`w-48 h-48 rounded-full bg-gradient-to-r ${selectedExercise.color} flex items-center justify-center shadow-2xl`}
                animate={{
                  scale: isActive ? (currentPhase % 2 === 0 ? [1, 1.3] : [1.3, 1]) : 1,
                }}
                transition={{
                  duration: selectedExercise.pattern[currentPhase] || 4,
                  ease: "easeInOut",
                  repeat: isActive ? Infinity : 0,
                }}
              >
                <div className="text-center text-white">
                  <div className="text-4xl font-bold mb-2">{timeLeft}</div>
                  <div className="text-sm opacity-90">
                    {selectedExercise.labels[currentPhase]}
                  </div>
                </div>
              </motion.div>

              {/* Progress Ring */}
              <svg className="absolute inset-0 w-48 h-48 -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="4"
                  fill="none"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                  transition={{ duration: 0.5 }}
                />
              </svg>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <Button
                onClick={toggleExercise}
                className="rounded-full w-16 h-16 text-white shadow-lg"
                style={{ background: `var(--mood-gradient)` }}
              >
                {isActive ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </Button>
              
              <Button
                onClick={resetExercise}
                variant="outline"
                className="rounded-full w-12 h-12"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {/* Progress */}
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Cycle {currentCycle + 1} of {selectedExercise.duration}</span>
                <span>{Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}</span>
              </div>
              <Progress value={totalProgress} className="h-2" />
            </div>
          </div>

          {/* Exercise Info */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Benefits</h3>
              <div className="space-y-2">
                {selectedExercise.benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    {benefit}
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Instructions</h3>
              <div className="space-y-2">
                {selectedExercise.labels.map((label, index) => (
                  <div
                    key={label}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      isActive && currentPhase === index
                        ? 'bg-gradient-to-r text-white shadow-md'
                        : 'bg-gray-50 text-gray-700'
                    }`}
                    style={isActive && currentPhase === index ? { background: `var(--mood-gradient)` } : {}}
                  >
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{label}</div>
                      <div className="text-xs opacity-75">
                        {selectedExercise.pattern[index]} seconds
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}