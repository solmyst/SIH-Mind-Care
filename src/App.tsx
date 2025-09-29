import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { MoodSelector } from './components/MoodSelector';
import { Dashboard } from './components/Dashboard';
import { QuickChat } from './components/QuickChat';
import { PeerSupport } from './components/PeerSupport';
import { AppointmentBooking } from './components/AppointmentBooking';
import { MoodJournal } from './components/MoodJournal';
import { PsychologicalTests } from './components/PsychologicalTests';
import { MiniGames } from './components/MiniGames';
import { CustomGoals } from './components/CustomGoals';
import { AdminDashboard } from './components/AdminDashboard';

export type MoodType = 'happy' | 'calm' | 'sad' | 'anxious' | 'stressed' | 'neutral';

export interface MoodTheme {
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  textLight: string;
  background: string;
}

const moodThemes: Record<MoodType, MoodTheme> = {
  happy: {
    primary: 'rgb(255, 193, 7)',
    secondary: 'rgb(255, 152, 0)',
    accent: 'rgb(255, 235, 59)',
    gradient: 'linear-gradient(135deg, rgb(255, 193, 7) 0%, rgb(255, 152, 0) 100%)',
    textLight: 'rgb(251, 140, 0)',
    background: 'linear-gradient(135deg, rgb(255, 248, 225) 0%, rgb(255, 243, 205) 100%)'
  },
  calm: {
    primary: 'rgb(33, 150, 243)',
    secondary: 'rgb(0, 188, 212)',
    accent: 'rgb(129, 199, 221)',
    gradient: 'linear-gradient(135deg, rgb(33, 150, 243) 0%, rgb(0, 188, 212) 100%)',
    textLight: 'rgb(3, 169, 244)',
    background: 'linear-gradient(135deg, rgb(227, 242, 253) 0%, rgb(207, 232, 252) 100%)'
  },
  sad: {
    primary: 'rgb(103, 58, 183)',
    secondary: 'rgb(63, 81, 181)',
    accent: 'rgb(159, 168, 218)',
    gradient: 'linear-gradient(135deg, rgb(103, 58, 183) 0%, rgb(63, 81, 181) 100%)',
    textLight: 'rgb(92, 107, 192)',
    background: 'linear-gradient(135deg, rgb(237, 231, 246) 0%, rgb(225, 217, 240) 100%)'
  },
  anxious: {
    primary: 'rgb(76, 175, 80)',
    secondary: 'rgb(0, 150, 136)',
    accent: 'rgb(165, 214, 167)',
    gradient: 'linear-gradient(135deg, rgb(76, 175, 80) 0%, rgb(0, 150, 136) 100%)',
    textLight: 'rgb(26, 169, 133)',
    background: 'linear-gradient(135deg, rgb(232, 245, 233) 0%, rgb(200, 230, 201) 100%)'
  },
  stressed: {
    primary: 'rgb(255, 138, 128)',
    secondary: 'rgb(255, 171, 145)',
    accent: 'rgb(255, 204, 188)',
    gradient: 'linear-gradient(135deg, rgb(255, 138, 128) 0%, rgb(255, 171, 145) 100%)',
    textLight: 'rgb(255, 112, 67)',
    background: 'linear-gradient(135deg, rgb(255, 243, 237) 0%, rgb(255, 235, 225) 100%)'
  },
  neutral: {
    primary: 'rgb(158, 158, 158)',
    secondary: 'rgb(189, 189, 189)',
    accent: 'rgb(224, 224, 224)',
    gradient: 'linear-gradient(135deg, rgb(158, 158, 158) 0%, rgb(189, 189, 189) 100%)',
    textLight: 'rgb(117, 117, 117)',
    background: 'linear-gradient(135deg, rgb(250, 250, 250) 0%, rgb(245, 245, 245) 100%)'
  }
};

export type PageType = 'landing' | 'login' | 'signup' | 'mood-selector' | 'dashboard' | 'chat' | 'peer-support' | 'appointments' | 'journal' | 'tests' | 'games' | 'goals' | 'admin';

export default function App() {
  const [currentMood, setCurrentMood] = useState<MoodType>('calm');
  const [currentPage, setCurrentPage] = useState<PageType>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [userProfile, setUserProfile] = useState({
    name: 'Alex',
    streakDays: 7,
    level: 3,
    plantGrowth: 65,
    petHealth: 80,
    petType: 'cat' // or 'dog', 'bird', etc.
  });

  // Handle login and navigation
  const handleLogin = (loggedIn: boolean) => {
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      setCurrentPage('dashboard');
    }
  };

  const handleSignup = (signedUp: boolean) => {
    setIsLoggedIn(signedUp);
    if (signedUp) {
      setCurrentPage('mood-selector');
    }
  };

  const handleMoodSelect = (mood: MoodType) => {
    setCurrentMood(mood);
    setCurrentPage('dashboard');
  };

  // Apply mood theme to CSS variables
  useEffect(() => {
    const theme = moodThemes[currentMood];
    const root = document.documentElement;
    
    root.style.setProperty('--mood-primary', theme.primary);
    root.style.setProperty('--mood-secondary', theme.secondary);
    root.style.setProperty('--mood-accent', theme.accent);
    root.style.setProperty('--mood-gradient', theme.gradient);
    root.style.setProperty('--mood-text-light', theme.textLight);
    root.style.setProperty('--mood-background', theme.background);
  }, [currentMood]);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} currentMood={currentMood} isLoggedIn={isLoggedIn} selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />;
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} onLogin={handleLogin} currentMood={currentMood} selectedLanguage={selectedLanguage} />;
      case 'signup':
        return <SignupPage onNavigate={setCurrentPage} onSignup={handleSignup} currentMood={currentMood} selectedLanguage={selectedLanguage} />;
      case 'mood-selector':
        return <MoodSelector onMoodSelect={handleMoodSelect} onNavigate={setCurrentPage} currentMood={currentMood} selectedLanguage={selectedLanguage} />;
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} currentMood={currentMood} userProfile={userProfile} setUserProfile={setUserProfile} selectedLanguage={selectedLanguage} onMoodChange={setCurrentMood} onLanguageChange={setSelectedLanguage} />;
      case 'chat':
        return <QuickChat onNavigate={setCurrentPage} currentMood={currentMood} selectedLanguage={selectedLanguage} />;
      case 'peer-support':
        return <PeerSupport onNavigate={setCurrentPage} currentMood={currentMood} />;
      case 'appointments':
        return <AppointmentBooking onNavigate={setCurrentPage} currentMood={currentMood} selectedLanguage={selectedLanguage} />;
      case 'journal':
        return <MoodJournal onNavigate={setCurrentPage} currentMood={currentMood} selectedLanguage={selectedLanguage} />;
      case 'tests':
        return <PsychologicalTests onNavigate={setCurrentPage} currentMood={currentMood} selectedLanguage={selectedLanguage} />;
      case 'games':
        return <MiniGames onNavigate={setCurrentPage} currentMood={currentMood} userProfile={userProfile} setUserProfile={setUserProfile} selectedLanguage={selectedLanguage} />;
      case 'goals':
        return <CustomGoals onNavigate={setCurrentPage} currentMood={currentMood} selectedLanguage={selectedLanguage} />;
      case 'admin':
        return <AdminDashboard onNavigate={setCurrentPage} currentMood={currentMood} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} currentMood={currentMood} isLoggedIn={isLoggedIn} selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />;
    }
  };

  return (
    <div 
      className="min-h-screen transition-all duration-1000 ease-in-out"
      style={{ background: moodThemes[currentMood].background }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="min-h-screen"
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}