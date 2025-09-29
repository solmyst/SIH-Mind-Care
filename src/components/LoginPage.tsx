import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Eye, EyeOff, Globe, Brain, Sparkles, Heart } from 'lucide-react';
import type { MoodType, PageType } from '../App';

interface LoginPageProps {
  onNavigate: (page: PageType) => void;
  onLogin: (status: boolean) => void;
  currentMood: MoodType;
  selectedLanguage: string;
}

const translations = {
  en: {
    title: 'Welcome Back',
    subtitle: 'Continue your mental wellness journey',
    email: 'Email Address',
    password: 'Password',
    signin: 'Sign In',
    signup: 'Create Account',
    noAccount: "New to our platform?",
    forgotPassword: 'Forgot Password?',
    language: 'Language',
    orContinueWith: 'Or continue with',
    rememberMe: 'Remember me',
    secureLogin: 'Secure & Private Login'
  },
  es: {
    title: 'Bienvenido de Nuevo',
    subtitle: 'Continúa tu viaje de bienestar mental',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    signin: 'Iniciar Sesión',
    signup: 'Crear Cuenta',
    noAccount: '¿Nuevo en nuestra plataforma?',
    forgotPassword: '¿Olvidaste tu contraseña?',
    language: 'Idioma',
    orContinueWith: 'O continúa con',
    rememberMe: 'Recordarme',
    secureLogin: 'Inicio de Sesión Seguro y Privado'
  },
  fr: {
    title: 'Bon Retour',
    subtitle: 'Continuez votre parcours de bien-être mental',
    email: 'Adresse E-mail',
    password: 'Mot de Passe',
    signin: 'Se Connecter',
    signup: 'Créer un Compte',
    noAccount: 'Nouveau sur notre plateforme?',
    forgotPassword: 'Mot de passe oublié?',
    language: 'Langue',
    orContinueWith: 'Ou continuez avec',
    rememberMe: 'Se souvenir de moi',
    secureLogin: 'Connexion Sécurisée et Privée'
  },
  hi: {
    title: 'वापसी पर स्वागत',
    subtitle: 'अपनी मानसिक कल्याण यात्रा जारी रखें',
    email: 'ईमेल पता',
    password: 'पासवर्ड',
    signin: 'साइन इन',
    signup: 'खाता बनाएं',
    noAccount: 'हमारे प्लेटफॉर्म पर नए हैं?',
    forgotPassword: 'पासवर्ड भूल गए?',
    language: 'भाषा',
    orContinueWith: 'या इसके साथ जारी रखें',
    rememberMe: 'मुझे याद रखें',
    secureLogin: 'सुरक्षित और निजी लॉगिन'
  }
};

export function LoginPage({ onNavigate, onLogin, currentMood, selectedLanguage }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      onLogin(true);
    }, 1500);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: `var(--mood-background)` }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-5"
            style={{
              background: `var(--mood-gradient)`,
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [-20, 20],
              y: [-20, 20],
              rotate: [0, 360],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {[Brain, Heart, Sparkles].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute opacity-10"
            style={{
              left: `${20 + i * 30}%`,
              top: `${20 + i * 25}%`,
            }}
            animate={{
              y: [-10, 10],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon className="w-12 h-12" style={{ color: `var(--mood-primary)` }} />
          </motion.div>
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.div
            className="relative inline-block mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-3xl shadow-2xl backdrop-blur-sm border border-white/20"
              style={{ background: `var(--mood-gradient)` }}
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🧠
            </motion.div>
            
            {/* Sparkle Effect */}
            <motion.div
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center"
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ✨
            </motion.div>
          </motion.div>

          <motion.h1 
            className="text-4xl mb-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {t.title}
          </motion.h1>
          
          <motion.p 
            className="text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t.subtitle}
          </motion.p>

          <motion.div
            className="flex items-center justify-center gap-2 mt-3 px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm w-fit mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {t.secureLogin}
          </motion.div>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Card className="p-8 bg-white/90 backdrop-blur-xl rounded-3xl border-0 shadow-2xl relative overflow-hidden">
            {/* Card Glow Effect */}
            <div 
              className="absolute inset-0 opacity-5 rounded-3xl"
              style={{ background: `var(--mood-gradient)` }}
            />
            
            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
              {/* Email Field */}
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  {t.email}
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-opacity-50 pl-4 text-lg placeholder:text-gray-400 transition-all"
                    style={{ '--tw-ring-color': `var(--mood-primary)` } as any}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  {t.password}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-opacity-50 pl-4 pr-14 text-lg placeholder:text-gray-400 transition-all"
                    style={{ '--tw-ring-color': `var(--mood-primary)` } as any}
                    placeholder="Enter your password"
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </motion.button>
                </div>
              </motion.div>

              {/* Remember Me & Forgot Password */}
              <motion.div 
                className="flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                    style={{ accentColor: `var(--mood-primary)` }}
                  />
                  <span className="text-sm text-gray-600">{t.rememberMe}</span>
                </label>
                
                <Button
                  type="button"
                  variant="ghost"
                  className="text-sm p-0 h-auto hover:underline"
                  style={{ color: `var(--mood-primary)` }}
                >
                  {t.forgotPassword}
                </Button>
              </motion.div>

              {/* Sign In Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl text-white font-medium relative overflow-hidden group"
                  style={{ background: `var(--mood-gradient)` }}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <span className="relative z-10">{t.signin}</span>
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </Card>
        </motion.div>

        {/* Sign Up Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <Card className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border-0 shadow-lg">
            <p className="text-gray-600 mb-3">{t.noAccount}</p>
            <Button
              onClick={() => onNavigate('signup')}
              variant="outline"
              className="w-full h-12 rounded-2xl border-2 hover:bg-gray-50 transition-all"
              style={{ 
                borderColor: `var(--mood-primary)`,
                color: `var(--mood-primary)`
              }}
            >
              {t.signup}
            </Button>
          </Card>
        </motion.div>

        {/* Language Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 flex items-center justify-center gap-3 text-gray-500"
        >
          <Globe className="w-4 h-4" />
          <select
            value={selectedLanguage}
            onChange={(e) => {/* Language change handled in parent */}}
            className="bg-transparent text-sm border-none outline-none cursor-pointer hover:text-gray-700 transition-colors"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="hi">हिन्दी</option>
          </select>
        </motion.div>
      </div>
    </div>
  );
}