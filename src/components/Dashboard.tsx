import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { SharedSidebar } from './SharedSidebar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { LanguageSelector } from './LanguageSelector';
import { BreathingExercise } from './BreathingExercise';
import {
  Home,
  MessageCircle,
  Calendar,
  BookOpen,
  Brain,
  Gamepad2,
  Target,
  Settings,
  User,
  LogOut,
  Droplets,
  Leaf,
  Trophy,
  TrendingUp,
  Star,
  Heart,
  Zap,
  Users,
  Phone,
  Menu,
  X,
  Bell,
  ChevronRight,
  Headphones,
  Video,
  Wind,
  Edit3,
  Save,
  Library,
  Activity,
  Clock,
  Award,
  Sparkles,
  Sun,
  Moon,
  CloudRain,
  Smile,
  TreePine,
  Flame,
  ChevronUp,
  BarChart3,
  Calendar as CalendarIcon,
  Plus,
  Play
} from 'lucide-react';
import type { MoodType, PageType } from '../App';

interface DashboardProps {
  onNavigate: (page: PageType) => void;
  currentMood: MoodType;
  userProfile: {
    name: string;
    streakDays: number;
    level: number;
    plantGrowth: number;
    petHealth: number;
    petType: string;
  };
  setUserProfile: (profile: any) => void;
  selectedLanguage: string;
  onMoodChange: (mood: MoodType) => void;
  onLanguageChange: (language: string) => void;
}

export function Dashboard({
  onNavigate,
  currentMood,
  userProfile,
  setUserProfile,
  selectedLanguage,
  onMoodChange,
  onLanguageChange
}: DashboardProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [plantWatered, setPlantWatered] = useState(false);
  const [currentMoodIntensity, setCurrentMoodIntensity] = useState(5);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [breathingCompleted, setBreathingCompleted] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);

  // Get time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 17) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');
  }, []);

  const getTimeIcon = () => {
    switch (timeOfDay) {
      case 'morning': return Sun;
      case 'afternoon': return Sun;
      case 'evening': return Moon;
      default: return Sun;
    }
  };

  const TimeIcon = getTimeIcon();

  const waterPlant = () => {
    if (!plantWatered) {
      setPlantWatered(true);
      setUserProfile({
        ...userProfile,
        streakDays: userProfile.streakDays + 1,
        plantGrowth: Math.min(100, userProfile.plantGrowth + 5)
      });
    }
  };

  const getPlantStage = (growth: number) => {
    if (growth < 20) return { icon: '🌱', stage: 'Seedling', message: 'Just getting started!', color: 'from-green-300 to-green-500' };
    if (growth < 40) return { icon: '🌿', stage: 'Sprout', message: 'Growing strong!', color: 'from-green-400 to-green-600' };
    if (growth < 60) return { icon: '🍃', stage: 'Young Plant', message: 'Developing well!', color: 'from-green-500 to-emerald-600' };
    if (growth < 80) return { icon: '🌳', stage: 'Small Tree', message: 'Flourishing!', color: 'from-emerald-500 to-teal-600' };
    return { icon: '🌲', stage: 'Mighty Tree', message: 'Amazing growth!', color: 'from-emerald-600 to-teal-700' };
  };

  const plantStage = getPlantStage(userProfile.plantGrowth);

  const moodOptions: { mood: MoodType; emoji: string; label: string; color: string; bgColor: string }[] = [
    { mood: 'happy', emoji: '😊', label: 'Happy', color: '#FFB800', bgColor: 'bg-yellow-100 hover:bg-yellow-200' },
    { mood: 'calm', emoji: '😌', label: 'Calm', color: '#2196F3', bgColor: 'bg-blue-100 hover:bg-blue-200' },
    { mood: 'neutral', emoji: '😐', label: 'Neutral', color: '#9E9E9E', bgColor: 'bg-gray-100 hover:bg-gray-200' },
    { mood: 'anxious', emoji: '😰', label: 'Anxious', color: '#4CAF50', bgColor: 'bg-green-100 hover:bg-green-200' },
    { mood: 'sad', emoji: '😢', label: 'Sad', color: '#673AB7', bgColor: 'bg-purple-100 hover:bg-purple-200' },
    { mood: 'stressed', emoji: '😫', label: 'Stressed', color: '#FF8A80', bgColor: 'bg-red-100 hover:bg-red-200' },
  ];

  const quickActions = [
    { icon: Wind, label: 'Breathe', action: () => setShowBreathingExercise(true), color: 'from-green-500 to-green-600', description: 'Guided breathing' },
    { icon: Headphones, label: 'Music', action: () => setShowMusicPlayer(true), color: 'from-blue-500 to-blue-600', description: 'Calming sounds' },
    { icon: BookOpen, label: 'Journal', page: 'journal' as PageType, color: 'from-purple-500 to-purple-600', description: 'Express yourself' },
    { icon: Gamepad2, label: 'Mini Games', page: 'games' as PageType, color: 'from-orange-500 to-orange-600', description: 'Stress relief' },
  ];

  const todaysHabits = [
    { name: 'Morning Mood Check', completed: true, icon: Heart, color: 'text-pink-500' },
    { name: 'Water Wellness Tree', completed: plantWatered, icon: Droplets, color: 'text-blue-500' },
    { name: 'Journal Entry', completed: false, icon: BookOpen, color: 'text-purple-500' },
    { name: 'Mindful Breathing', completed: breathingCompleted, icon: Wind, color: 'text-green-500', onClick: () => setShowBreathingExercise(true) },
    { name: 'Gratitude Practice', completed: false, icon: Star, color: 'text-yellow-500' },
  ];

  const completedHabits = todaysHabits.filter(habit => habit.completed).length;

  const weeklyStats = [
    { label: 'Mood Entries', value: 28, total: 35, icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50' },
    { label: 'Journal Pages', value: 12, total: 15, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Sessions Completed', value: 8, total: 10, icon: Target, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Games Played', value: 15, total: 20, icon: Gamepad2, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  const achievements = [
    { title: 'Consistency Champion', description: '7-day streak!', icon: Trophy, color: 'bg-gradient-to-r from-yellow-400 to-orange-500', recent: true },
    { title: 'Mindful Master', description: '50 journal entries', icon: Star, color: 'bg-gradient-to-r from-purple-400 to-pink-500', recent: false },
    { title: 'Tree Nurturer', description: 'Plant grew 25%', icon: TreePine, color: 'bg-gradient-to-r from-green-400 to-emerald-500', recent: true },
  ];

  return (
    <div className="min-h-screen" style={{ background: `var(--mood-background)` }}>
      {/* Shared Sidebar */}
      <SharedSidebar
        onNavigate={onNavigate}
        currentPage="dashboard"
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
        showMobile={showSidebar}
        onToggleMobile={() => setShowSidebar(!showSidebar)}
      />

      {/* Main Content */}
      <div className={`${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} transition-all duration-300`}>
        {/* Floating Header with Glass Morphism */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="sticky top-0 z-40 backdrop-blur-lg bg-white/60 border-b border-white/20 shadow-lg"
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowSidebar(true)}
                  className="lg:hidden rounded-full p-2 hover:bg-white/20"
                >
                  <Menu className="w-5 h-5" />
                </Button>

                <motion.div
                  className="flex items-center gap-4"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="relative">
                    <motion.button
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-xl backdrop-blur-sm border border-white/20 cursor-pointer group transition-all hover:shadow-2xl"
                      style={{ background: `var(--mood-gradient)` }}
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowMoodSelector(!showMoodSelector)}
                      title="Click to change your mood"
                    >
                      {currentMood === 'happy' ? '😊' :
                        currentMood === 'calm' ? '😌' :
                          currentMood === 'sad' ? '😢' :
                            currentMood === 'anxious' ? '😰' :
                              currentMood === 'stressed' ? '😫' : '😐'}

                      {/* Click indicator */}
                      <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </motion.button>
                    <motion.div
                      className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <TimeIcon className="w-3 h-3" style={{ color: `var(--mood-primary)` }} />
                    </motion.div>
                  </div>

                  <div>
                    <motion.h1
                      className="text-2xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Good {timeOfDay}, {userProfile.name}!
                    </motion.h1>
                    <motion.p
                      className="text-gray-600 text-sm"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })} • Feeling {currentMood}
                    </motion.p>
                  </div>
                </motion.div>
              </div>

              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-sm border border-white/20"
                >
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-gray-700">{userProfile.streakDays} day streak</span>
                </motion.div>

                <LanguageSelector
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={onLanguageChange}
                />
              </div>
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <motion.section
          className="px-6 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="relative rounded-3xl p-8 overflow-hidden backdrop-blur-sm border border-white/20 shadow-2xl"
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)`,
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: `var(--mood-primary)`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [-20, 20],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <motion.div
                onClick={() => onNavigate('chat')}
                className="cursor-pointer group"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <motion.div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ background: `var(--mood-gradient)` }}
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      <MessageCircle className="w-8 h-8 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-3xl mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        How are you feeling today?
                      </h2>
                      <p className="text-gray-600 text-lg">
                        Share your thoughts with your AI wellness companion
                      </p>
                    </div>
                  </div>
                  <motion.div
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{ x: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <ChevronRight className="w-8 h-8 text-gray-400" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>

        {/* Main Dashboard Grid */}
        <main className="px-6 pb-8">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Column - Wellness Tree & Progress */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-4 space-y-6"
            >
              {/* Wellness Tree - Enhanced */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-0 overflow-hidden">
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      Wellness Tree
                    </h3>
                    <Badge variant="secondary" className="bg-white/60 text-gray-700">
                      Level {userProfile.level}
                    </Badge>
                  </div>

                  <motion.div
                    className="relative h-48 rounded-2xl overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${plantStage.color.split(' ')[1]} 0%, ${plantStage.color.split(' ')[3]} 100%)`,
                    }}
                  >
                    {/* Floating particles */}
                    {plantWatered && (
                      <div className="absolute inset-0">
                        {Array.from({ length: 12 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-3 h-3 bg-white/40 rounded-full"
                            style={{
                              left: `${20 + Math.random() * 60}%`,
                              top: `${20 + Math.random() * 60}%`,
                            }}
                            animate={{
                              y: [-30, -80],
                              opacity: [0.8, 0],
                              scale: [1, 0.3]
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              delay: i * 0.4,
                              ease: "easeOut"
                            }}
                          />
                        ))}
                      </div>
                    )}

                    <motion.div
                      className="absolute inset-0 flex items-end justify-center pb-4 text-8xl"
                      animate={{
                        scale: plantWatered ? [1, 1.1, 1] : [1, 1.05, 1],
                        rotate: plantWatered ? [0, -3, 3, 0] : 0
                      }}
                      transition={{
                        duration: plantWatered ? 2 : 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {plantStage.icon}
                    </motion.div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  </motion.div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">{plantStage.stage}</span>
                      <span className="font-bold text-lg" style={{ color: `var(--mood-primary)` }}>
                        {userProfile.plantGrowth}%
                      </span>
                    </div>

                    <div className="relative">
                      <Progress value={userProfile.plantGrowth} className="h-4 bg-gray-100" />
                      <motion.div
                        className="absolute top-0 left-0 h-4 rounded-full opacity-30"
                        style={{
                          background: `var(--mood-gradient)`,
                          width: `${userProfile.plantGrowth}%`
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${userProfile.plantGrowth}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </div>

                    <p className="text-gray-600 italic">{plantStage.message}</p>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={waterPlant}
                        disabled={plantWatered}
                        className={`w-full rounded-2xl h-12 font-medium transition-all ${plantWatered
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                          : 'text-white hover:scale-105 shadow-md'
                          }`}
                        style={{
                          background: plantWatered
                            ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                            : `var(--mood-gradient)`
                        }}
                      >
                        <Droplets className="mr-3 h-5 w-5" />
                        {plantWatered ? '✨ Watered Today! ✨' : '💧 Water Tree'}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </Card>

              {/* Daily Habits Progress */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      Today's Habits
                    </h3>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: `var(--mood-primary)` }}>
                        {completedHabits}/{todaysHabits.length}
                      </div>
                      <div className="text-xs text-gray-500">completed</div>
                    </div>
                  </div>

                  <div className="relative">
                    <Progress value={(completedHabits / todaysHabits.length) * 100} className="h-3 bg-gray-100" />
                    <motion.div
                      className="absolute top-0 left-0 h-3 rounded-full"
                      style={{
                        background: `var(--mood-gradient)`,
                        width: `${(completedHabits / todaysHabits.length) * 100}%`
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(completedHabits / todaysHabits.length) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>

                  <div className="space-y-3">
                    {todaysHabits.map((habit, index) => (
                      <motion.div
                        key={habit.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer ${habit.completed
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
                          : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        onClick={habit.onClick}
                      >
                        <motion.div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${habit.completed ? 'bg-green-500 text-white' : 'bg-white shadow-sm'
                            }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {habit.completed ? (
                            <motion.span
                              className="text-sm"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                              ✓
                            </motion.span>
                          ) : (
                            <habit.icon className={`w-5 h-5 ${habit.color}`} />
                          )}
                        </motion.div>
                        <span className={`font-medium ${habit.completed ? 'text-green-700' : 'text-gray-700'}`}>
                          {habit.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Center Column - Quick Actions & Mood */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-4 space-y-6"
            >
              {/* Quick Actions */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-0">
                <div className="space-y-6">
                  <h3 className="text-xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Quick Actions
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {quickActions.map((action, index) => (
                      <motion.button
                        key={action.page || action.label}
                        onClick={() => action.page ? onNavigate(action.page) : action.action?.()}
                        className="group relative p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-white hover:to-gray-50 transition-all"
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="text-center space-y-3">
                          <motion.div
                            className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-r ${action.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
                            whileHover={{ rotate: 10 }}
                          >
                            <action.icon className="w-7 h-7 text-white" />
                          </motion.div>
                          <div>
                            <p className="font-medium text-gray-800">{action.label}</p>
                            <p className="text-xs text-gray-500">{action.description}</p>
                          </div>
                        </div>

                        {/* Hover effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </Card>


            </motion.div>

            {/* Right Column - Stats & Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="lg:col-span-4 space-y-6"
            >
              {/* Weekly Stats */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      This Week
                    </h3>
                    <motion.button
                      onClick={() => onNavigate('journal')}
                      className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                      whileHover={{ rotate: 90 }}
                    >
                      <BarChart3 className="w-4 h-4 text-gray-600" />
                    </motion.button>
                  </div>

                  <div className="space-y-4">
                    {weeklyStats.map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-4 rounded-2xl ${stat.bg} border border-white/50`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{stat.label}</p>
                            <p className="text-xs text-gray-500">{stat.value} of {stat.total}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-800">
                            {Math.round((stat.value / stat.total) * 100)}%
                          </div>
                          <div className="w-16 h-2 bg-white rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full ${stat.color.replace('text-', 'bg-')}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${(stat.value / stat.total) * 100}%` }}
                              transition={{ duration: 1, delay: index * 0.2 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Recent Achievements */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      Achievements
                    </h3>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                    >
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                    </motion.div>
                  </div>

                  <div className="space-y-4">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.title}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative overflow-hidden"
                      >
                        <div className={`flex items-center gap-4 p-4 rounded-2xl ${achievement.color} text-white relative z-10`}>
                          <motion.div
                            className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                            whileHover={{ scale: 1.1, rotate: 10 }}
                          >
                            <achievement.icon className="w-6 h-6" />
                          </motion.div>
                          <div className="flex-1">
                            <p className="font-bold">{achievement.title}</p>
                            <p className="text-sm opacity-90">{achievement.description}</p>
                          </div>
                          {achievement.recent && (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                            >
                              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                                New!
                              </Badge>
                            </motion.div>
                          )}
                        </div>

                        {/* Animated background pattern */}
                        <div className="absolute inset-0 opacity-10">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-2 h-2 bg-white rounded-full"
                              style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                              }}
                              animate={{
                                scale: [0, 1, 0],
                                opacity: [0, 1, 0]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.4,
                              }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </main>

        {/* Help Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="px-6 pb-12"
        >
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Need More Support?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Access professional counseling and emergency resources
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  onClick={() => onNavigate('appointments')}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all text-sm whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Book Session
                </motion.button>
                <motion.button
                  className="px-6 py-3 bg-white text-gray-700 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all border border-gray-200 text-sm whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Tele-MANAS - 14416
                </motion.button>
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Floating Action Button */}
        <motion.div
          className="fixed bottom-8 right-8 z-50"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
        >
          <motion.button
            onClick={() => onNavigate('chat')}
            className="w-16 h-16 rounded-full text-white shadow-2xl flex items-center justify-center"
            style={{ background: `var(--mood-gradient)` }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              boxShadow: [
                '0 10px 30px rgba(0,0,0,0.1)',
                '0 20px 40px rgba(0,0,0,0.2)',
                '0 10px 30px rgba(0,0,0,0.1)'
              ]
            }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <MessageCircle className="w-8 h-8" />
          </motion.button>
        </motion.div>

        {/* Floating Mood Selector Popup */}
        <AnimatePresence>
          {showMoodSelector && (
            <>
              {/* Background Overlay */}
              <motion.div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMoodSelector(false)}
              />

              {/* Mood Selector Modal */}
              <motion.div
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Card className="p-8 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-0 max-w-md w-full mx-4">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        How are you feeling?
                      </h3>
                      <p className="text-gray-600">
                        Select your current mood
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {moodOptions.map((option) => (
                        <motion.button
                          key={option.mood}
                          onClick={() => {
                            onMoodChange(option.mood);
                            setShowMoodSelector(false);
                          }}
                          className={`flex items-center gap-3 px-4 py-4 rounded-2xl transition-all font-medium ${currentMood === option.mood
                            ? 'text-white shadow-lg'
                            : `${option.bgColor} text-gray-700`
                            }`}
                          style={currentMood === option.mood ? {
                            background: `var(--mood-gradient)`
                          } : {}}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * moodOptions.indexOf(option) }}
                        >
                          <span className="text-2xl">{option.emoji}</span>
                          <span className="text-sm font-medium">{option.label}</span>
                        </motion.button>
                      ))}
                    </div>

                    {/* Mood Intensity Slider */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-medium">Intensity Level</span>
                        <motion.span
                          className="text-sm font-bold px-3 py-1 rounded-full bg-gray-100"
                          style={{ color: `var(--mood-primary)` }}
                          key={currentMoodIntensity}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                        >
                          {Math.round((currentMoodIntensity / 10) * 100)}%
                        </motion.span>
                      </div>
                      <Slider
                        value={[currentMoodIntensity]}
                        onValueChange={(value) => setCurrentMoodIntensity(value[0])}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Mild</span>
                        <span>Moderate</span>
                        <span>Intense</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => setShowMoodSelector(false)}
                        variant="outline"
                        className="flex-1 rounded-2xl"
                      >
                        Close
                      </Button>
                      <Button
                        onClick={() => onNavigate('journal')}
                        className="flex-1 rounded-2xl text-white"
                        style={{ background: `var(--mood-gradient)` }}
                      >
                        Track in Journal
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Breathing Exercise Modal */}
      <AnimatePresence>
        {showBreathingExercise && (
          <BreathingExercise
            currentMood={currentMood}
            onClose={() => {
              setShowBreathingExercise(false);
              setBreathingCompleted(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Music Player Modal */}
      <AnimatePresence>
        {showMusicPlayer && (
          <>
            {/* Background Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMusicPlayer(false)}
            />

            {/* Music Player Modal */}
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Card className="p-8 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-0 max-w-md w-full mx-4">
                <div className="space-y-6">
                  <div className="text-center">
                    <motion.div
                      className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-2xl shadow-lg mb-4"
                      style={{ background: `var(--mood-gradient)` }}
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 4 }}
                    >
                      <Headphones className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-2xl mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      Calming Music
                    </h3>
                    <p className="text-gray-600">
                      Choose your relaxation soundtrack
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { name: 'Nature Sounds', icon: '🌲', duration: '30m', description: 'Rain, ocean, forest' },
                      { name: 'Meditation Music', icon: '🎵', duration: '45m', description: 'Peaceful instrumentals' },
                      { name: 'Ambient Space', icon: '🌌', duration: '60m', description: 'Cosmic soundscapes' },
                      { name: 'Piano Harmony', icon: '🎹', duration: '25m', description: 'Gentle piano melodies' },
                    ].map((track, index) => (
                      <motion.button
                        key={track.name}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all text-left"
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => {
                          // Simulate playing music
                          setShowMusicPlayer(false);
                          // You can add actual music playing logic here
                        }}
                      >
                        <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl">
                          {track.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{track.name}</p>
                          <p className="text-sm text-gray-500">{track.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-600">{track.duration}</p>
                          <Play className="w-4 h-4 text-gray-400 mx-auto mt-1" />
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setShowMusicPlayer(false)}
                      variant="outline"
                      className="flex-1 rounded-2xl"
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => onNavigate('games')}
                      className="flex-1 rounded-2xl text-white"
                      style={{ background: `var(--mood-gradient)` }}
                    >
                      More Music
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}