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
import { MoodTransition } from './components/MoodTransition';

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
  // Initialize state from localStorage or defaults with error handling
  const [currentMood, setCurrentMood] = useState<MoodType>(() => {
    try {
      const saved = localStorage.getItem('mindcare-mood');
      return (saved as MoodType) || 'calm';
    } catch {
      return 'calm';
    }
  });
  
  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    try {
      const saved = localStorage.getItem('mindcare-page');
      const isLoggedIn = localStorage.getItem('mindcare-logged-in') === 'true';
      const loginTime = localStorage.getItem('mindcare-login-time');
      
      // Check if session is expired (24 hours)
      if (loginTime && Date.now() - parseInt(loginTime) > 24 * 60 * 60 * 1000) {
        localStorage.removeItem('mindcare-logged-in');
        localStorage.removeItem('mindcare-page');
        localStorage.removeItem('mindcare-login-time');
        return 'login';
      }
      
      if (isLoggedIn && saved) {
        return saved as PageType;
      }
      return 'login';
    } catch {
      return 'login';
    }
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      const loginTime = localStorage.getItem('mindcare-login-time');
      if (loginTime && Date.now() - parseInt(loginTime) > 24 * 60 * 60 * 1000) {
        return false;
      }
      return localStorage.getItem('mindcare-logged-in') === 'true';
    } catch {
      return false;
    }
  });
  
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    try {
      return localStorage.getItem('mindcare-language') || 'en';
    } catch {
      return 'en';
    }
  });
  
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('mindcare-profile');
      return saved ? JSON.parse(saved) : {
        name: 'Alex',
        streakDays: 7,
        level: 3,
        plantGrowth: 65,
        petHealth: 80,
        petType: 'cat'
      };
    } catch {
      return {
        name: 'Alex',
        streakDays: 7,
        level: 3,
        plantGrowth: 65,
        petHealth: 80,
        petType: 'cat'
      };
    }
  });

  // Handle login and navigation
  const handleLogin = (loggedIn: boolean) => {
    setIsLoggedIn(loggedIn);
    try {
      if (loggedIn) {
        localStorage.setItem('mindcare-logged-in', 'true');
        localStorage.setItem('mindcare-login-time', Date.now().toString());
        localStorage.setItem('mindcare-page', 'dashboard');
        setCurrentPage('dashboard');
      } else {
        localStorage.removeItem('mindcare-logged-in');
        localStorage.removeItem('mindcare-page');
        localStorage.removeItem('mindcare-profile');
        localStorage.removeItem('mindcare-login-time');
      }
    } catch (error) {
      console.warn('Failed to save login state:', error);
    }
  };

  const handleSignup = (signedUp: boolean) => {
    setIsLoggedIn(signedUp);
    localStorage.setItem('mindcare-logged-in', signedUp.toString());
    if (signedUp) {
      setCurrentPage('mood-selector');
      localStorage.setItem('mindcare-page', 'mood-selector');
    }
  };

  const handleMoodSelect = (mood: MoodType) => {
    setCurrentMood(mood);
    setCurrentPage('dashboard');
    localStorage.setItem('mindcare-mood', mood);
    localStorage.setItem('mindcare-page', 'dashboard');
  };

  // Enhanced navigation handler that saves to localStorage
  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    if (isLoggedIn) {
      localStorage.setItem('mindcare-page', page);
    }
  };

  // Apply mood theme to CSS variables and save to localStorage
  useEffect(() => {
    const theme = moodThemes[currentMood];
    const root = document.documentElement;

    root.style.setProperty('--mood-primary', theme.primary);
    root.style.setProperty('--mood-secondary', theme.secondary);
    root.style.setProperty('--mood-accent', theme.accent);
    root.style.setProperty('--mood-gradient', theme.gradient);
    root.style.setProperty('--mood-text-light', theme.textLight);
    root.style.setProperty('--mood-background', theme.background);
    
    // Save mood to localStorage
    localStorage.setItem('mindcare-mood', currentMood);
  }, [currentMood]);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('mindcare-language', selectedLanguage);
  }, [selectedLanguage]);

  // Save user profile
  useEffect(() => {
    try {
      localStorage.setItem('mindcare-profile', JSON.stringify(userProfile));
    } catch (error) {
      console.warn('Failed to save user profile:', error);
    }
  }, [userProfile]);

  // Check session validity on mount and periodically
  useEffect(() => {
    const checkSession = () => {
      try {
        const loginTime = localStorage.getItem('mindcare-login-time');
        const isLoggedInStored = localStorage.getItem('mindcare-logged-in') === 'true';
        
        if (isLoggedInStored && loginTime) {
          const sessionAge = Date.now() - parseInt(loginTime);
          const maxAge = 24 * 60 * 60 * 1000; // 24 hours
          
          if (sessionAge > maxAge) {
            console.log('Session expired, logging out...');
            handleLogout();
          }
        }
      } catch (error) {
        console.warn('Session check failed:', error);
      }
    };

    // Check session immediately
    checkSession();
    
    // Check session every hour
    const interval = setInterval(checkSession, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Listen for mood changes from AI detection
  useEffect(() => {
    const handleMoodChange = (event: CustomEvent<MoodType>) => {
      if (event.detail && event.detail !== currentMood) {
        setCurrentMood(event.detail);
        console.log('🎭 Mood detected by AI:', event.detail);
      }
    };

    window.addEventListener('moodChange', handleMoodChange as EventListener);
    return () => window.removeEventListener('moodChange', handleMoodChange as EventListener);
  }, [currentMood]);

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('login');
    localStorage.removeItem('mindcare-logged-in');
    localStorage.removeItem('mindcare-page');
    localStorage.removeItem('mindcare-profile');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} currentMood={currentMood} isLoggedIn={isLoggedIn} selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} currentMood={currentMood} selectedLanguage={selectedLanguage} />;
      case 'signup':
        return <SignupPage onNavigate={handleNavigate} onSignup={handleSignup} currentMood={currentMood} selectedLanguage={selectedLanguage} />;
      case 'mood-selector':
        return <MoodSelector onMoodSelect={handleMoodSelect} onNavigate={handleNavigate} currentMood={currentMood} />;
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} currentMood={currentMood} userProfile={userProfile} setUserProfile={setUserProfile} selectedLanguage={selectedLanguage} onMoodChange={setCurrentMood} onLanguageChange={setSelectedLanguage} onLogout={handleLogout} />;
      case 'chat':
        return <QuickChat onNavigate={handleNavigate} currentMood={currentMood} selectedLanguage={selectedLanguage} onMoodChange={setCurrentMood} />;
      case 'peer-support':
        return <PeerSupport onNavigate={handleNavigate} currentMood={currentMood} />;
      case 'appointments':
        return <AppointmentBooking onNavigate={handleNavigate} currentMood={currentMood} selectedLanguage={selectedLanguage} />;
      case 'journal':
        return <MoodJournal onNavigate={handleNavigate} currentMood={currentMood} selectedLanguage={selectedLanguage} />;
      case 'tests':
        return <PsychologicalTests onNavigate={handleNavigate} currentMood={currentMood} selectedLanguage={selectedLanguage} />;
      case 'games':
        return <MiniGames onNavigate={handleNavigate} currentMood={currentMood} userProfile={userProfile} setUserProfile={setUserProfile} selectedLanguage={selectedLanguage} />;
      case 'goals':
        return <CustomGoals onNavigate={handleNavigate} currentMood={currentMood} selectedLanguage={selectedLanguage} />;
      case 'admin':
        return <AdminDashboard onNavigate={handleNavigate} currentMood={currentMood} />;
      default:
        return <LandingPage onNavigate={handleNavigate} currentMood={currentMood} isLoggedIn={isLoggedIn} selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />;
    }
  };

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden transition-all duration-1000 ease-in-out"
      style={{ background: moodThemes[currentMood].background }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="min-h-screen w-full"
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>

      {/* Mood transition notification - responsive positioning */}
      <MoodTransition currentMood={currentMood} />
    </div>
  );
}