import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Heart, 
  MessageCircle, 
  Sparkles, 
  Users, 
  Leaf, 
  Brain, 
  Globe, 
  User, 
  LogOut,
  Calendar,
  BookOpen,
  Gamepad2,
  Phone,
  ArrowRight,
  Star,
  Shield,
  Zap,
  Target
} from 'lucide-react';
import type { MoodType, PageType } from '../App';

interface LandingPageProps {
  onNavigate: (page: PageType) => void;
  currentMood: MoodType;
  isLoggedIn: boolean;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const moodLabels = {
  1: 'Very Stressed',
  2: 'Stressed', 
  3: 'Anxious',
  4: 'Worried',
  5: 'Neutral',
  6: 'Okay',
  7: 'Good',
  8: 'Happy',
  9: 'Great',
  10: 'Excellent'
};

const moodColors = {
  1: '#FF6B6B', 2: '#FF7875', 3: '#FF8A80', 4: '#FFAB91',
  5: '#FFD54F', 6: '#AED581', 7: '#81C784', 8: '#66BB6A',
  9: '#4CAF50', 10: '#43A047'
};

export function LandingPage({ onNavigate, currentMood, isLoggedIn, selectedLanguage, onLanguageChange }: LandingPageProps) {
  const [moodScore, setMoodScore] = useState([7]);
  
  const quickActions = [
    { 
      icon: MessageCircle, 
      title: 'Quick Chat', 
      description: 'Get instant AI support or connect with peers',
      page: 'chat' as PageType,
      color: 'from-blue-400 to-blue-600'
    },
    { 
      icon: Phone, 
      title: 'Book Session', 
      description: 'Schedule with a professional counselor',
      page: 'appointments' as PageType,
      color: 'from-green-400 to-green-600'
    },
    { 
      icon: BookOpen, 
      title: 'Journal', 
      description: 'Record your thoughts and track mood',
      page: 'journal' as PageType,
      color: 'from-purple-400 to-purple-600'
    },
    { 
      icon: Brain, 
      title: 'Assessment', 
      description: 'Take psychological wellness tests',
      page: 'tests' as PageType,
      color: 'from-orange-400 to-orange-600'
    }
  ];

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Guidance",
      description: "Get personalized mental health support with our advanced AI companion available 24/7."
    },
    {
      icon: Shield,
      title: "Completely Anonymous",
      description: "Your privacy is protected. Share openly in our secure, judgment-free environment."
    },
    {
      icon: Users,
      title: "Peer Support Network",
      description: "Connect with other students who understand your challenges and experiences."
    },
    {
      icon: Target,
      title: "Personalized Journey",
      description: "Adaptive content that evolves based on your mood, progress, and needs."
    },
    {
      icon: Leaf,
      title: "Gamified Wellness",
      description: "Build healthy habits through our engaging plant growth tracker and mini-games."
    },
    {
      icon: Heart,
      title: "Professional Care",
      description: "Access licensed counselors when you need more comprehensive support."
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Psychology Student",
      content: "This platform helped me through my toughest semester. The AI chat was like having a friend who actually understood.",
      rating: 5
    },
    {
      name: "Alex R.", 
      role: "Engineering Student",
      content: "I was skeptical at first, but the anonymous peer groups made all the difference. Finally felt less alone.",
      rating: 5
    },
    {
      name: "Maya P.",
      role: "Pre-Med Student", 
      content: "The mood tracking and plant growth gamification actually made self-care fun. My mental health improved significantly.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="relative z-10 p-6 flex justify-between items-center bg-white/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-2"
        >
          <div 
            className="w-8 h-8 rounded-full"
            style={{ background: `var(--mood-gradient)` }}
          />
          <span className="text-xl font-semibold" style={{ color: `var(--mood-primary)` }}>
            MindSpace
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-4"
        >
          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-400" />
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-transparent text-gray-600 text-sm border-none outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>

          {isLoggedIn ? (
            <>
              <Button 
                variant="ghost" 
                onClick={() => onNavigate('dashboard')}
                className="hover:bg-opacity-20"
                style={{ color: `var(--mood-primary)` }}
              >
                Dashboard
              </Button>
              <Button 
                variant="ghost" 
                className="hover:bg-opacity-20 flex items-center gap-2"
                style={{ color: `var(--mood-primary)` }}
              >
                <User className="w-4 h-4" />
                Profile
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                onClick={() => onNavigate('login')}
                className="hover:bg-opacity-20"
                style={{ color: `var(--mood-primary)` }}
              >
                Sign In
              </Button>
              <Button 
                onClick={() => onNavigate('signup')}
                className="rounded-full px-6 text-white"
                style={{ background: `var(--mood-gradient)` }}
              >
                Get Started
              </Button>
            </>
          )}
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            className="text-5xl lg:text-7xl leading-tight mb-6"
            style={{ color: `var(--mood-primary)` }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Your Mental Wellness
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
              Journey Starts Here
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            A safe, supportive digital space designed specifically for college students. 
            Get personalized wellness tools, connect with understanding peers, and build healthy habits—all completely stigma-free.
          </motion.p>

          {/* Mood Check-in Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12"
          >
            <Card className="p-8 max-w-md mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
              <h3 className="text-lg mb-4" style={{ color: `var(--mood-primary)` }}>
                How are you feeling today?
              </h3>
              <div className="space-y-4">
                <Slider
                  value={moodScore}
                  onValueChange={setMoodScore}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>1</span>
                  <span 
                    className="font-medium"
                    style={{ color: moodColors[moodScore[0] as keyof typeof moodColors] }}
                  >
                    {moodLabels[moodScore[0] as keyof typeof moodLabels]}
                  </span>
                  <span>10</span>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button 
              size="lg" 
              className="text-white px-8 py-4 rounded-full hover:scale-105 transition-transform text-lg"
              style={{ background: `var(--mood-gradient)` }}
              onClick={() => isLoggedIn ? onNavigate('dashboard') : onNavigate('signup')}
            >
              {isLoggedIn ? 'Go to Dashboard' : 'Start Your Journey'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-4 rounded-full hover:scale-105 transition-transform border-2 text-lg"
              style={{ 
                borderColor: `var(--mood-primary)`, 
                color: `var(--mood-primary)` 
              }}
              onClick={() => onNavigate('chat')}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Quick Chat
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl mb-4" style={{ color: `var(--mood-primary)` }}>
              Get Help When You Need It
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access support tools designed specifically for student life challenges
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card 
                  className="p-6 h-full bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all cursor-pointer group"
                  onClick={() => onNavigate(action.page)}
                >
                  <div className="space-y-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl" style={{ color: `var(--mood-primary)` }}>
                      {action.title}
                    </h3>
                    <p className="text-gray-600">
                      {action.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl mb-4" style={{ color: `var(--mood-primary)` }}>
              Why Students Choose MindSpace
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for the unique challenges of college life
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 h-full bg-white/70 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
                  <div className="space-y-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: `var(--mood-gradient)` }}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl" style={{ color: `var(--mood-primary)` }}>
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl mb-4" style={{ color: `var(--mood-primary)` }}>
              Real Stories from Real Students
            </h2>
            <p className="text-xl text-gray-600">
              See how MindSpace has helped students like you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 bg-white border-0 shadow-lg rounded-2xl h-full">
                  <div className="space-y-4">
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <div className="font-medium" style={{ color: `var(--mood-primary)` }}>
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ background: `var(--mood-background)` }}>
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl lg:text-5xl mb-6" style={{ color: `var(--mood-primary)` }}>
              Ready to Prioritize Your Mental Wellness?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of students who are already building healthier, happier lives
            </p>
            <Button 
              size="lg"
              className="text-white px-10 py-4 rounded-full hover:scale-105 transition-transform text-lg"
              style={{ background: `var(--mood-gradient)` }}
              onClick={() => isLoggedIn ? onNavigate('dashboard') : onNavigate('signup')}
            >
              {isLoggedIn ? 'Continue Journey' : 'Start Free Today'}
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer with Quick Access */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-full"
                  style={{ background: `var(--mood-gradient)` }}
                />
                <span className="text-xl font-semibold">MindSpace</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your digital companion for mental wellness and personal growth.
              </p>
            </div>

            {/* Quick Access */}
            <div>
              <h4 className="font-semibold mb-4 text-lg">Quick Access</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => onNavigate('chat')}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors w-full text-left"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat Support
                </button>
                <button 
                  onClick={() => onNavigate('appointments')}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors w-full text-left"
                >
                  <Phone className="w-4 h-4" />
                  Book Session
                </button>
                <button 
                  onClick={() => onNavigate('journal')}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors w-full text-left"
                >
                  <BookOpen className="w-4 h-4" />
                  Mood Journal
                </button>
                <button 
                  onClick={() => onNavigate('tests')}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors w-full text-left"
                >
                  <Brain className="w-4 h-4" />
                  Assessment
                </button>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4 text-lg">Resources</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => onNavigate('games')}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors w-full text-left"
                >
                  <Gamepad2 className="w-4 h-4" />
                  Mini Games
                </button>
                <button 
                  onClick={() => onNavigate('goals')}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors w-full text-left"
                >
                  <Target className="w-4 h-4" />
                  Custom Goals
                </button>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">
                  Crisis Resources
                </a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">
                  Mental Health Tips
                </a>
              </div>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4 text-lg">Support</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">
                  Help Center
                </a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 MindSpace. Made with ❤️ for student mental wellness.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              If you're in crisis, please contact emergency services or call the National Suicide Prevention Lifeline: 988
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}