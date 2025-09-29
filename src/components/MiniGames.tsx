import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { SharedSidebar } from './SharedSidebar';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Trophy,
  Star,
  Zap,
  Target,
  Menu
} from 'lucide-react';
import type { MoodType, PageType } from '../App';

interface MiniGamesProps {
  onNavigate: (page: PageType) => void;
  currentMood: MoodType;
  userProfile: any;
  setUserProfile: (profile: any) => void;
  selectedLanguage: string;
}

interface Bubble {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
}

interface ColorBlock {
  id: string;
  color: string;
  matched: boolean;
}

const translations = {
  en: {
    title: 'Stress Relief Games',
    subtitle: 'Relax and unwind with calming mini-games',
    score: 'Score',
    level: 'Level',
    timer: 'Timer',
    gameOver: 'Game Over',
    newRecord: 'New Record!',
    playAgain: 'Play Again',
    backToGames: 'Back to Games',
    bubblePop: 'Bubble Pop',
    colorHarmony: 'Color Harmony',
    breathFlow: 'Breath Flow',
    zenPuzzle: 'Zen Puzzle'
  },
  es: {
    title: 'Juegos para Aliviar el Estrés',
    subtitle: 'Relájate y descansa con mini-juegos calmantes',
    score: 'Puntuación',
    level: 'Nivel',
    timer: 'Temporizador',
    gameOver: 'Juego Terminado',
    newRecord: '¡Nuevo Récord!',
    playAgain: 'Jugar de Nuevo',
    backToGames: 'Volver a Juegos',
    bubblePop: 'Explotar Burbujas',
    colorHarmony: 'Armonía de Colores',
    breathFlow: 'Flujo de Respiración',
    zenPuzzle: 'Rompecabezas Zen'
  },
  fr: {
    title: 'Jeux Anti-Stress',
    subtitle: 'Détendez-vous avec des mini-jeux apaisants',
    score: 'Score',
    level: 'Niveau',
    timer: 'Minuteur',
    gameOver: 'Jeu Terminé',
    newRecord: 'Nouveau Record!',
    playAgain: 'Rejouer',
    backToGames: 'Retour aux Jeux',
    bubblePop: 'Bulles Éclatantes',
    colorHarmony: 'Harmonie des Couleurs',
    breathFlow: 'Flux de Respiration',
    zenPuzzle: 'Puzzle Zen'
  },
  hi: {
    title: 'तनाव राहत खेल',
    subtitle: 'शांत मिनी-गेम्स के साथ आराम करें और तनाव मुक्त हों',
    score: 'स्कोर',
    level: 'स्तर',
    timer: 'टाइमर',
    gameOver: 'खेल खत्म',
    newRecord: 'नया रिकॉर्ड!',
    playAgain: 'फिर से खेलें',
    backToGames: 'खेलों पर वापस जाएं',
    bubblePop: 'बबल पॉप',
    colorHarmony: 'रंग तालमेल',
    breathFlow: 'सांस प्रवाह',
    zenPuzzle: 'ज़ेन पहेली'
  }
};

const gamesList = [
  {
    id: 'bubble-pop',
    name: 'Bubble Pop',
    description: 'Pop colorful bubbles to release stress and tension',
    icon: '🫧',
    color: 'rgb(59, 130, 246)',
    difficulty: 'Easy',
    benefits: ['Stress Relief', 'Focus', 'Hand-Eye Coordination']
  },
  {
    id: 'color-harmony',
    name: 'Color Harmony',
    description: 'Match colors to create beautiful harmonious patterns',
    icon: '🎨',
    color: 'rgb(168, 85, 247)',
    difficulty: 'Medium',
    benefits: ['Creativity', 'Color Recognition', 'Mindfulness']
  },
  {
    id: 'breath-flow',
    name: 'Breath Flow',
    description: 'Follow the rhythm to practice mindful breathing',
    icon: '💨',
    color: 'rgb(34, 197, 94)',
    difficulty: 'Easy',
    benefits: ['Relaxation', 'Breathing Control', 'Meditation']
  },
  {
    id: 'zen-puzzle',
    name: 'Zen Puzzle',
    description: 'Solve peaceful puzzles at your own pace',
    icon: '🧩',
    color: 'rgb(249, 115, 22)',
    difficulty: 'Hard',
    benefits: ['Problem Solving', 'Patience', 'Mental Clarity']
  }
];

export function MiniGames({ onNavigate, currentMood, userProfile, setUserProfile, selectedLanguage }: MiniGamesProps) {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'ended'>('menu');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [colorBlocks, setColorBlocks] = useState<ColorBlock[]>([]);
  const [targetColor, setTargetColor] = useState<string>('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

  // Bubble Pop Game Logic
  const startBubbleGame = () => {
    setSelectedGame('bubble-pop');
    setGameState('playing');
    setScore(0);
    setLevel(1);
    setTimeLeft(60);
    generateBubbles();
  };

  const generateBubbles = () => {
    const newBubbles: Bubble[] = [];
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    
    for (let i = 0; i < 8; i++) {
      newBubbles.push({
        id: Math.random().toString(),
        x: Math.random() * 80,
        y: Math.random() * 80,
        size: 40 + Math.random() * 40,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 1 + Math.random() * 2
      });
    }
    setBubbles(newBubbles);
  };

  const popBubble = (bubbleId: string) => {
    setBubbles(prev => prev.filter(bubble => bubble.id !== bubbleId));
    setScore(prev => prev + 10);
    
    // Add new bubble
    setTimeout(() => {
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
      const newBubble: Bubble = {
        id: Math.random().toString(),
        x: Math.random() * 80,
        y: Math.random() * 80,
        size: 40 + Math.random() * 40,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 1 + Math.random() * 2
      };
      setBubbles(prev => [...prev, newBubble]);
    }, 500);
  };

  // Color Harmony Game Logic
  const startColorGame = () => {
    setSelectedGame('color-harmony');
    setGameState('playing');
    setScore(0);
    setLevel(1);
    setTimeLeft(60);
    generateColorBlocks();
  };

  const generateColorBlocks = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    const blocks: ColorBlock[] = [];
    
    for (let i = 0; i < 16; i++) {
      blocks.push({
        id: i.toString(),
        color: colors[Math.floor(Math.random() * colors.length)],
        matched: false
      });
    }
    
    setColorBlocks(blocks);
    setTargetColor(colors[Math.floor(Math.random() * colors.length)]);
  };

  const selectColorBlock = (blockId: string) => {
    const block = colorBlocks.find(b => b.id === blockId);
    if (block && block.color === targetColor && !block.matched) {
      setColorBlocks(prev => 
        prev.map(b => 
          b.id === blockId ? { ...b, matched: true } : b
        )
      );
      setScore(prev => prev + 20);
      
      // Check if all target colors are matched
      const targetBlocks = colorBlocks.filter(b => b.color === targetColor);
      const matchedTargetBlocks = colorBlocks.filter(b => b.color === targetColor && b.matched);
      
      if (matchedTargetBlocks.length === targetBlocks.length - 1) {
        // Generate new target color
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
        const availableColors = colors.filter(color => 
          colorBlocks.some(b => b.color === color && !b.matched)
        );
        if (availableColors.length > 0) {
          setTargetColor(availableColors[Math.floor(Math.random() * availableColors.length)]);
        }
      }
    }
  };

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState === 'playing' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('ended');
            // Update user profile with game completion
            setUserProfile((prev: any) => ({
              ...prev,
              plantGrowth: Math.min(100, prev.plantGrowth + 2),
              streakDays: prev.streakDays + 1
            }));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [gameState, timeLeft, setUserProfile]);

  // Bubble Animation Effect
  useEffect(() => {
    let animationFrame: number;
    
    if (gameState === 'playing' && selectedGame === 'bubble-pop') {
      const animateBubbles = () => {
        setBubbles(prev => 
          prev.map(bubble => ({
            ...bubble,
            y: (bubble.y + bubble.speed) % 100
          }))
        );
        animationFrame = requestAnimationFrame(animateBubbles);
      };
      animationFrame = requestAnimationFrame(animateBubbles);
    }
    
    return () => cancelAnimationFrame(animationFrame);
  }, [gameState, selectedGame]);

  const resetGame = () => {
    setGameState('menu');
    setSelectedGame(null);
    setScore(0);
    setLevel(1);
    setTimeLeft(60);
    setBubbles([]);
    setColorBlocks([]);
  };

  const restartCurrentGame = () => {
    if (selectedGame === 'bubble-pop') {
      startBubbleGame();
    } else if (selectedGame === 'color-harmony') {
      startColorGame();
    }
  };

  if (selectedGame && gameState !== 'menu') {
    return (
      <div className="min-h-screen" style={{ background: `var(--mood-background)` }}>
        {/* Shared Sidebar */}
        <SharedSidebar 
          onNavigate={onNavigate}
          currentPage="games"
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
          showMobile={showSidebar}
          onToggleMobile={() => setShowSidebar(!showSidebar)}
        />

        {/* Main Content */}
        <div className={`${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} transition-all duration-300 p-6`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          {/* Game Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setShowSidebar(true)}
                className="lg:hidden rounded-full p-3"
                style={{ color: `var(--mood-primary)` }}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                onClick={resetGame}
                className="rounded-full p-3"
                style={{ color: `var(--mood-primary)` }}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {gamesList.find(g => g.id === selectedGame)?.name}
                </h1>
              </div>
            </div>

            {/* Game Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-xl" style={{ color: `var(--mood-primary)` }}>
                  {score}
                </div>
                <div className="text-sm text-gray-500">{t.score}</div>
              </div>
              <div className="text-center">
                <div className="text-xl" style={{ color: `var(--mood-primary)` }}>
                  {level}
                </div>
                <div className="text-sm text-gray-500">{t.level}</div>
              </div>
              <div className="text-center">
                <div className="text-xl" style={{ color: `var(--mood-primary)` }}>
                  {timeLeft}s
                </div>
                <div className="text-sm text-gray-500">{t.timer}</div>
              </div>
            </div>
          </div>

          {/* Game Area */}
          <Card className="p-8 bg-white/70 backdrop-blur-sm rounded-3xl border-0 shadow-xl">
            <div 
              ref={gameAreaRef}
              className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl overflow-hidden"
            >
              {/* Bubble Pop Game */}
              {selectedGame === 'bubble-pop' && gameState === 'playing' && (
                <>
                  {bubbles.map(bubble => (
                    <motion.div
                      key={bubble.id}
                      className="absolute cursor-pointer"
                      style={{
                        left: `${bubble.x}%`,
                        top: `${bubble.y}%`,
                        width: `${bubble.size}px`,
                        height: `${bubble.size}px`,
                        backgroundColor: bubble.color,
                        borderRadius: '50%',
                        border: '2px solid rgba(255,255,255,0.3)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                      }}
                      onClick={() => popBubble(bubble.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </>
              )}

              {/* Color Harmony Game */}
              {selectedGame === 'color-harmony' && gameState === 'playing' && (
                <div className="p-6">
                  <div className="text-center mb-6">
                    <p className="text-lg mb-2">Match this color:</p>
                    <div 
                      className="w-16 h-16 rounded-full mx-auto border-4 border-white shadow-lg"
                      style={{ backgroundColor: targetColor }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3">
                    {colorBlocks.map(block => (
                      <motion.div
                        key={block.id}
                        className={`aspect-square rounded-lg cursor-pointer border-4 ${
                          block.matched 
                            ? 'border-green-400 opacity-50' 
                            : 'border-white hover:border-gray-200'
                        }`}
                        style={{ backgroundColor: block.color }}
                        onClick={() => selectColorBlock(block.id)}
                        whileHover={{ scale: block.matched ? 1 : 1.05 }}
                        whileTap={{ scale: block.matched ? 1 : 0.95 }}
                        animate={block.matched ? { 
                          scale: [1, 1.2, 1],
                          rotate: [0, 360, 0]
                        } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        {block.matched && (
                          <div className="w-full h-full flex items-center justify-center">
                            <Star className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Game Over Overlay */}
              {gameState === 'ended' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
                >
                  <div className="bg-white rounded-3xl p-8 text-center max-w-sm mx-4">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl mb-2" style={{ color: `var(--mood-primary)` }}>
                      {t.gameOver}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Final Score: {score}
                    </p>
                    
                    <div className="space-y-3">
                      <Button
                        onClick={restartCurrentGame}
                        className="w-full rounded-xl text-white"
                        style={{ background: `var(--mood-gradient)` }}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        {t.playAgain}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={resetGame}
                        className="w-full rounded-xl"
                      >
                        {t.backToGames}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Game Controls */}
            <div className="flex justify-center mt-6 gap-4">
              <Button
                variant="outline"
                onClick={() => setGameState(gameState === 'paused' ? 'playing' : 'paused')}
                className="rounded-full px-6"
              >
                {gameState === 'paused' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                onClick={restartCurrentGame}
                className="rounded-full px-6"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: `var(--mood-background)` }}>
      {/* Shared Sidebar */}
      <SharedSidebar 
        onNavigate={onNavigate}
        currentPage="games"
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
        showMobile={showSidebar}
        onToggleMobile={() => setShowSidebar(!showSidebar)}
      />

      {/* Main Content */}
      <div className={`${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} transition-all duration-300 p-6`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setShowSidebar(true)}
              className="lg:hidden rounded-full p-3"
              style={{ color: `var(--mood-primary)` }}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {t.title}
              </h1>
              <p className="text-gray-600">{t.subtitle}</p>
            </div>
          </div>
        </motion.div>

      {/* Games Grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {gamesList.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
          >
            <Card className="p-6 bg-white/70 backdrop-blur-sm rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all h-full cursor-pointer">
              <div className="space-y-4">
                {/* Game Icon */}
                <div className="text-center">
                  <div 
                    className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl"
                    style={{ background: `${game.color}20` }}
                  >
                    {game.icon}
                  </div>
                  <div 
                    className="text-xs px-2 py-1 rounded-full inline-block"
                    style={{ 
                      background: `${game.color}20`,
                      color: game.color
                    }}
                  >
                    {game.difficulty}
                  </div>
                </div>

                {/* Game Info */}
                <div className="text-center space-y-2">
                  <h3 className="text-lg" style={{ color: game.color }}>
                    {game.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {game.description}
                  </p>
                </div>

                {/* Benefits */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">Benefits:</p>
                  <div className="flex flex-wrap gap-1">
                    {game.benefits.map(benefit => (
                      <span 
                        key={benefit}
                        className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Play Button */}
                <Button
                  onClick={game.id === 'bubble-pop' ? startBubbleGame : 
                           game.id === 'color-harmony' ? startColorGame : 
                           () => setSelectedGame(game.id)}
                  className="w-full rounded-2xl text-white"
                  style={{ background: game.color }}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Play Game
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* User Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-12 max-w-4xl mx-auto"
      >
        <Card className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-lg">
          <h3 className="text-lg mb-4" style={{ color: `var(--mood-primary)` }}>
            Your Gaming Progress
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl mb-2">🏆</div>
              <div className="text-xl" style={{ color: `var(--mood-primary)` }}>
                {userProfile.level}
              </div>
              <div className="text-sm text-gray-600">Level</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-xl" style={{ color: `var(--mood-primary)` }}>
                {userProfile.streakDays}
              </div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl mb-2">🌱</div>
              <div className="text-xl" style={{ color: `var(--mood-primary)` }}>
                {userProfile.plantGrowth}%
              </div>
              <div className="text-sm text-gray-600">Plant Growth</div>
            </div>
          </div>
        </Card>
      </motion.div>
      </div>
    </div>
  );
}