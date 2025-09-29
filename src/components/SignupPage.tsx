import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Eye, EyeOff, Globe, Star, Heart, Shield, CheckCircle } from 'lucide-react';
import type { MoodType, PageType } from '../App';

interface SignupPageProps {
  onNavigate: (page: PageType) => void;
  onSignup: (status: boolean) => void;
  currentMood: MoodType;
  selectedLanguage: string;
}

const translations = {
  en: {
    title: 'Start Your Wellness Journey',
    subtitle: 'Join thousands transforming their mental health',
    name: 'Full Name',
    email: 'Email Address',
    password: 'Create Password',
    confirmPassword: 'Confirm Password',
    terms: 'I agree to the Terms of Service and Privacy Policy',
    signup: 'Create Account',
    signin: 'Sign In',
    haveAccount: 'Already have an account?',
    language: 'Language',
    benefits: {
      title: 'Why join us?',
      items: [
        'AI-powered mental health support',
        'Safe & anonymous community',
        'Professional therapist network'
      ]
    },
    passwordStrength: 'Password Strength',
    privacy: '🔒 Your data is encrypted & secure'
  },
  es: {
    title: 'Comienza tu Viaje de Bienestar',
    subtitle: 'Únete a miles transformando su salud mental',
    name: 'Nombre Completo',
    email: 'Correo Electrónico',
    password: 'Crear Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    terms: 'Acepto los Términos de Servicio y Política de Privacidad',
    signup: 'Crear Cuenta',
    signin: 'Iniciar Sesión',
    haveAccount: '¿Ya tienes una cuenta?',
    language: 'Idioma',
    benefits: {
      title: '¿Por qué unirse?',
      items: [
        'Soporte de salud mental con IA',
        'Comunidad segura y anónima',
        'Red de terapeutas profesionales'
      ]
    },
    passwordStrength: 'Fortaleza de Contraseña',
    privacy: '🔒 Tus datos están encriptados y seguros'
  },
  fr: {
    title: 'Commencez Votre Parcours de Bien-être',
    subtitle: 'Rejoignez des milliers transformant leur santé mentale',
    name: 'Nom Complet',
    email: 'Adresse E-mail',
    password: 'Créer Mot de Passe',
    confirmPassword: 'Confirmer le Mot de Passe',
    terms: "J'accepte les Conditions de Service et la Politique de Confidentialité",
    signup: 'Créer un Compte',
    signin: 'Se Connecter',
    haveAccount: 'Vous avez déjà un compte?',
    language: 'Langue',
    benefits: {
      title: 'Pourquoi nous rejoindre?',
      items: [
        'Support santé mentale par IA',
        'Communauté sûre et anonyme',
        'Réseau de thérapeutes professionnels'
      ]
    },
    passwordStrength: 'Force du Mot de Passe',
    privacy: '🔒 Vos données sont cryptées et sécurisées'
  },
  hi: {
    title: 'अपनी कल्याण यात्रा शुरू करें',
    subtitle: 'अपने मानसिक स्वास्थ्य को बदलने वाले हजारों लोगों से जुड़ें',
    name: 'पूरा नाम',
    email: 'ईमेल पता',
    password: 'पासवर्ड बनाएं',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    terms: 'मैं सेवा की शर्तों और गोपनीयता नीति से सहमत हूँ',
    signup: 'खाता बनाएं',
    signin: 'साइन इन',
    haveAccount: 'पहले से ही खाता है?',
    language: 'भाषा',
    benefits: {
      title: 'हमसे क्यों जुड़ें?',
      items: [
        'AI-संचालित मानसिक स्वास्थ्य सहायता',
        'सुरक्षित और गुमनाम समुदाय',
        'पेशेवर चिकित्सक नेटवर्क'
      ]
    },
    passwordStrength: 'पासवर्ड की मजबूती',
    privacy: '🔒 आपका डेटा एन्क्रिप्टेड और सुरक्षित है'
  }
};

export function SignupPage({ onNavigate, onSignup, currentMood, selectedLanguage }: SignupPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (!acceptTerms) {
      alert('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);
    
    // Simulate signup
    setTimeout(() => {
      setIsLoading(false);
      onSignup(true);
    }, 1500);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: `var(--mood-background)` }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-5"
            style={{
              background: `var(--mood-gradient)`,
              width: `${Math.random() * 400 + 100}px`,
              height: `${Math.random() * 400 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [-30, 30],
              y: [-30, 30],
              rotate: [0, 180],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[Star, Heart, Shield].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute opacity-10"
            style={{
              left: `${15 + i * 35}%`,
              top: `${10 + i * 30}%`,
            }}
            animate={{
              y: [-15, 15],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon className="w-16 h-16" style={{ color: `var(--mood-primary)` }} />
          </motion.div>
        ))}
      </div>

      <div className="w-full max-w-lg relative z-10">
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
              className="w-24 h-24 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-2xl backdrop-blur-sm border border-white/20"
              style={{ background: `var(--mood-gradient)` }}
              animate={{ 
                rotate: [0, 8, -8, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🌟
            </motion.div>
            
            {/* Multiple sparkle effects */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center text-xs`}
                style={{
                  top: `${i * 10}px`,
                  right: `${i * 5}px`,
                }}
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  rotate: [0, 180, 360],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              >
                ✨
              </motion.div>
            ))}
          </motion.div>

          <motion.h1 
            className="text-4xl mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {t.title}
          </motion.h1>
          
          <motion.p 
            className="text-gray-600 text-lg mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t.subtitle}
          </motion.p>

          {/* Benefits */}
          <motion.div
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-sm font-medium text-gray-700 mb-3">{t.benefits.title}</h3>
            <div className="space-y-2">
              {t.benefits.items.map((benefit, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 text-sm text-gray-600"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {benefit}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Signup Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Card className="p-8 bg-white/95 backdrop-blur-xl rounded-3xl border-0 shadow-2xl relative overflow-hidden">
            {/* Card Glow Effect */}
            <div 
              className="absolute inset-0 opacity-5 rounded-3xl"
              style={{ background: `var(--mood-gradient)` }}
            />
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {/* Name Field */}
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  {t.name}
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-opacity-50 pl-4 text-lg placeholder:text-gray-400 transition-all"
                  style={{ '--tw-ring-color': `var(--mood-primary)` } as any}
                  placeholder="Enter your full name"
                  required
                />
              </motion.div>

              {/* Email Field */}
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  {t.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-opacity-50 pl-4 text-lg placeholder:text-gray-400 transition-all"
                  style={{ '--tw-ring-color': `var(--mood-primary)` } as any}
                  placeholder="your@email.com"
                  required
                />
              </motion.div>

              {/* Password Field */}
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  {t.password}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    className="h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-opacity-50 pl-4 pr-14 text-lg placeholder:text-gray-400 transition-all"
                    style={{ '--tw-ring-color': `var(--mood-primary)` } as any}
                    placeholder="Create a strong password"
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
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t.passwordStrength}</span>
                      <span className={`font-medium ${
                        passwordStrength <= 1 ? 'text-red-500' : 
                        passwordStrength <= 2 ? 'text-yellow-500' : 
                        passwordStrength <= 3 ? 'text-blue-500' : 'text-green-500'
                      }`}>
                        {passwordStrength <= 1 ? 'Weak' : 
                         passwordStrength <= 2 ? 'Fair' : 
                         passwordStrength <= 3 ? 'Good' : 'Strong'}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded-full ${
                            i < passwordStrength 
                              ? passwordStrength <= 1 ? 'bg-red-400' : 
                                passwordStrength <= 2 ? 'bg-yellow-400' : 
                                passwordStrength <= 3 ? 'bg-blue-400' : 'bg-green-400'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                  {t.confirmPassword}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    className="h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-opacity-50 pl-4 pr-14 text-lg placeholder:text-gray-400 transition-all"
                    style={{ '--tw-ring-color': `var(--mood-primary)` } as any}
                    placeholder="Confirm your password"
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </motion.button>
                </div>
                
                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-sm flex items-center gap-2 ${
                      formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {formData.password === formData.confirmPassword ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-red-500" />
                    )}
                    {formData.password === formData.confirmPassword ? 'Passwords match!' : 'Passwords do not match'}
                  </motion.div>
                )}
              </motion.div>

              {/* Terms Checkbox */}
              <motion.div 
                className="flex items-start space-x-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <Checkbox 
                  id="terms" 
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                  {t.terms}
                </Label>
              </motion.div>

              {/* Privacy Notice */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="text-center text-sm text-gray-500 bg-gray-50 rounded-2xl p-3"
              >
                {t.privacy}
              </motion.div>

              {/* Sign Up Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading || !acceptTerms}
                  className="w-full h-14 rounded-2xl text-white font-medium relative overflow-hidden group disabled:opacity-50"
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
                      <span className="relative z-10">{t.signup}</span>
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

        {/* Sign In Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-8 text-center"
        >
          <Card className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border-0 shadow-lg">
            <p className="text-gray-600 mb-3">{t.haveAccount}</p>
            <Button
              onClick={() => onNavigate('login')}
              variant="outline"
              className="w-full h-12 rounded-2xl border-2 hover:bg-gray-50 transition-all"
              style={{ 
                borderColor: `var(--mood-primary)`,
                color: `var(--mood-primary)`
              }}
            >
              {t.signin}
            </Button>
          </Card>
        </motion.div>

        {/* Language Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
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