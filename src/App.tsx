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

export type MoodType = 'calm' | 'happy' | 'neutral' | 'comforted' | 'stressed' | 'anxious' | 'sad' | 'sleepy' | 'alert';

export interface MoodTheme {
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  textLight: string;
  background: string;
  fontFamily: string;
  headerFont: string;
  effect: string;
}

const moodThemes: Record<MoodType, MoodTheme> = {
  calm: {
    primary: 'rgb(70, 130, 180)', // Soft Blue
    secondary: 'rgb(144, 238, 144)', // Light Green
    accent: 'rgb(248, 248, 255)', // White, Light Gray
    gradient: 'linear-gradient(135deg, rgb(70, 130, 180) 0%, rgb(144, 238, 144) 100%)',
    textLight: 'rgb(100, 149, 237)',
    background: 'linear-gradient(135deg, rgb(240, 248, 255) 0%, rgb(230, 255, 230) 100%)',
    fontFamily: '"Roboto", "Poppins", sans-serif',
    headerFont: '"Roboto", sans-serif',
    effect: 'Reduces anxiety, stabilizes emotions, promotes rest'
  },
  happy: {
    primary: 'rgb(30, 144, 255)', // Blue-Green-Teal (analogous scheme)
    secondary: 'rgb(255, 255, 224)', // Soft Yellow (minimal)
    accent: 'rgb(248, 248, 255)', // White
    gradient: 'linear-gradient(135deg, rgb(30, 144, 255) 0%, rgb(32, 178, 170) 100%)',
    textLight: 'rgb(65, 105, 225)',
    background: 'linear-gradient(135deg, rgb(240, 248, 255) 0%, rgb(240, 255, 255) 100%)',
    fontFamily: '"Circular", "Montserrat", sans-serif',
    headerFont: '"Montserrat", sans-serif',
    effect: 'Increases concentration, mental clarity, and flow'
  },
  neutral: {
    primary: 'rgb(147, 112, 219)', // Lavender, Soft Purple
    secondary: 'rgb(255, 192, 203)', // Pale Pink
    accent: 'rgb(255, 255, 255)', // White
    gradient: 'linear-gradient(135deg, rgb(147, 112, 219) 0%, rgb(221, 160, 221) 100%)',
    textLight: 'rgb(138, 43, 226)',
    background: 'linear-gradient(135deg, rgb(248, 240, 255) 0%, rgb(255, 240, 245) 100%)',
    fontFamily: '"Nunito", "Quicksand", sans-serif',
    headerFont: '"Nunito", sans-serif',
    effect: 'Encourages mindfulness, reflection, and deep breathing'
  },
  stressed: {
    primary: 'rgb(255, 165, 0)', // Orange, Yellow (limited use)
    secondary: 'rgb(30, 144, 255)', // Blue or White for balance
    accent: 'rgb(255, 255, 255)', // White
    gradient: 'linear-gradient(135deg, rgb(255, 165, 0) 0%, rgb(255, 193, 7) 100%)',
    textLight: 'rgb(255, 140, 0)',
    background: 'linear-gradient(135deg, rgb(255, 248, 240) 0%, rgb(255, 245, 220) 100%)',
    fontFamily: '"Montserrat", "Source Sans Pro", sans-serif',
    headerFont: '"Montserrat", sans-serif',
    effect: 'Boosts energy and enthusiasm, inspires creativity'
  },
  anxious: {
    primary: 'rgb(30, 144, 255)', // Blue (primary)
    secondary: 'rgb(60, 179, 113)', // Green (secondary)
    accent: 'rgb(245, 245, 245)', // Soft Gray, White
    gradient: 'linear-gradient(135deg, rgb(30, 144, 255) 0%, rgb(60, 179, 113) 100%)',
    textLight: 'rgb(65, 105, 225)',
    background: 'linear-gradient(135deg, rgb(240, 248, 255) 0%, rgb(240, 255, 240) 100%)',
    fontFamily: '"Roboto", "Poppins", sans-serif',
    headerFont: '"Roboto", sans-serif',
    effect: 'Calms stress, lowers blood pressure, reduces overload'
  },
  sad: {
    primary: 'rgb(34, 139, 34)', // Green, Soft Blue
    secondary: 'rgb(255, 192, 203)', // Soft Pink
    accent: 'rgb(230, 230, 250)', // Lavender
    gradient: 'linear-gradient(135deg, rgb(34, 139, 34) 0%, rgb(135, 206, 235) 100%)',
    textLight: 'rgb(60, 179, 113)',
    background: 'linear-gradient(135deg, rgb(240, 255, 240) 0%, rgb(230, 245, 255) 100%)',
    fontFamily: '"Nunito", sans-serif',
    headerFont: '"Nunito", sans-serif',
    effect: 'Promotes renewal, balance, emotional uplift'
  },
  comforted: {
    primary: 'rgb(255, 182, 193)', // Soft Pink, Pastel Green
    secondary: 'rgb(245, 245, 220)', // Warm Beige
    accent: 'rgb(128, 128, 128)', // Gray
    gradient: 'linear-gradient(135deg, rgb(255, 182, 193) 0%, rgb(144, 238, 144) 100%)',
    textLight: 'rgb(219, 112, 147)',
    background: 'linear-gradient(135deg, rgb(255, 240, 245) 0%, rgb(240, 255, 240) 100%)',
    fontFamily: '"Comfortaa", "Nunito", sans-serif',
    headerFont: '"Comfortaa", sans-serif',
    effect: 'Provides emotional warmth, sense of care and safety'
  },
  sleepy: {
    primary: 'rgb(147, 112, 219)', // Lavender, Deep Blue
    secondary: 'rgb(221, 160, 221)', // Soft Purple
    accent: 'rgb(128, 128, 128)', // Gray
    gradient: 'linear-gradient(135deg, rgb(147, 112, 219) 0%, rgb(25, 25, 112) 100%)',
    textLight: 'rgb(138, 43, 226)',
    background: 'linear-gradient(135deg, rgb(248, 240, 255) 0%, rgb(230, 230, 250) 100%)',
    fontFamily: '"Roboto", sans-serif',
    headerFont: '"Roboto", sans-serif',
    effect: 'Encourages relaxation, prepares for sleep, reduces stimulation'
  },
  alert: {
    primary: 'rgb(255, 0, 0)', // Red (only for alerts)
    secondary: 'rgb(0, 0, 0)', // Black/Gray for contrast
    accent: 'rgb(128, 128, 128)', // Gray
    gradient: 'linear-gradient(135deg, rgb(255, 0, 0) 0%, rgb(139, 0, 0) 100%)',
    textLight: 'rgb(255, 69, 0)',
    background: 'linear-gradient(135deg, rgb(255, 245, 245) 0%, rgb(255, 240, 240) 100%)',
    fontFamily: '"Montserrat", "Source Sans Pro", sans-serif',
    headerFont: '"Montserrat", sans-serif',
    effect: 'Grabs immediate attention without confusion'
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
    root.style.setProperty('--mood-font-family', theme.fontFamily);
    root.style.setProperty('--mood-header-font', theme.headerFont);

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