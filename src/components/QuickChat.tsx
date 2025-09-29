import React, { useState, useRef, useEffect } from 'react';
import { generateGeminiContent, SupportedMood } from './aiGemini';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { SharedSidebar } from './SharedSidebar';
import { Send, Bot, Mic, MicOff, Paperclip, MoreHorizontal, Menu } from 'lucide-react';
import type { MoodType, PageType } from '../App';

interface QuickChatProps {
  onNavigate: (page: PageType) => void;
  currentMood: MoodType;
  selectedLanguage: string;
  onMoodChange?: (mood: MoodType) => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
  supportType?: 'emotional' | 'practical' | 'crisis';
  detectedMood?: MoodType | null;
}

const translations = {
  en: {
    typeMessage: 'Type your message...',
    aiTyping: 'AI is typing...',
    online: 'online',
    voiceMessage: 'Voice message',
    attachFile: 'Attach file'
  },
  es: {
    typeMessage: 'Escribe tu mensaje...',
    aiTyping: 'IA está escribiendo...',
    online: 'en línea',
    voiceMessage: 'Mensaje de voz',
    attachFile: 'Adjuntar archivo'
  },
  fr: {
    typeMessage: 'Tapez votre message...',
    aiTyping: "L'IA tape...",
    online: 'en ligne',
    voiceMessage: 'Message vocal',
    attachFile: 'Joindre un fichier'
  },
  hi: {
    typeMessage: 'अपना संदेश लिखें...',
    aiTyping: 'AI टाइप कर रहा है...',
    online: 'ऑनलाइन',
    voiceMessage: 'आवाज़ संदेश',
    attachFile: 'फ़ाइल संलग्न करें'
  }
};

export function QuickChat({ onNavigate, currentMood, selectedLanguage, onMoodChange }: QuickChatProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

  // Initialize with empty messages - no dummy data
  useEffect(() => {
    setMessages([]);
  }, []);

  // Add welcome message when user first interacts
  const addWelcomeMessage = () => {
    const welcomeMessage: Message = {
      id: 'welcome',
      text: `Hello! I'm your personal AI mental health assistant. I'm here to listen, understand, and provide personalized support. I can also detect your mood from our conversation and adjust the theme accordingly. How are you feeling today?`,
      sender: 'ai',
      timestamp: new Date(),
      supportType: 'emotional',
      detectedMood: 'neutral'
    };
    setMessages([welcomeMessage]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mood mapping for emoji display

  const moodEmojis: Record<MoodType, string> = {
    happy: '😊',
    calm: '😌',
    neutral: '😐',
    anxious: '😰',
    sad: '😢',
    stressed: '😫',
  };


  // Map SupportedMood to MoodType
  function mapSupportedMoodToMoodType(mood: SupportedMood | null): MoodType | null {
    if (!mood) return null;
    if (mood === 'stressed') return 'stressed';
    if (mood === 'calm') return 'calm';
    if (mood === 'sad') return 'sad';
    if (mood === 'anxious') return 'anxious';
    if (mood === 'happy') return 'happy';
    if (mood === 'neutral') return 'neutral';
    return null;
  }



  const sendMessage = async () => {
    if (!message.trim()) return;

    // Add welcome message if this is the first message
    if (messages.length === 0) {
      addWelcomeMessage();
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages((prev: Message[]) => [...prev, newMessage]);
    setMessage('');

    setAiTyping(true);
    try {
      // Get response from Gemini including text, detected mood, and crisis status
      console.log('📤 Sending message to Gemini:', message);
      const { text: aiText, mood: detectedMood, isCrisis } = await generateGeminiContent(message);
      console.log('📥 Gemini response:', { aiText: aiText.substring(0, 100) + '...', detectedMood, isCrisis });
      setAiTyping(false);

      // Update theme based on detected mood from Gemini's JSON
      if (detectedMood) {
        const mappedMood = mapSupportedMoodToMoodType(detectedMood);
        if (mappedMood && mappedMood !== currentMood) {
          console.log('🎭 Mood change detected:', currentMood, '->', mappedMood);
          
          // Call parent's mood change handler
          if (onMoodChange) {
            onMoodChange(mappedMood);
          }
          
          // Also dispatch event for other components
          const event = new CustomEvent('moodChange', { detail: mappedMood });
          window.dispatchEvent(event);
          
          // Show a subtle notification about mood change
          setTimeout(() => {
            setMessages((prev: Message[]) => [...prev, {
              id: (Date.now() + 2).toString(),
              text: `🎭 I detected your mood as "${mappedMood}" and adjusted the theme colors to match. The interface now reflects your emotional state.`,
              sender: 'ai',
              timestamp: new Date(),
              supportType: 'emotional',
              detectedMood: mappedMood,
            }]);
          }, 500);
        }
      }

      // Determine support type based on response
      let supportType: 'emotional' | 'practical' | 'crisis';
      if (isCrisis) {
        supportType = 'crisis';
      } else if (message.toLowerCase().includes('how') || message.toLowerCase().includes('what should') || message.toLowerCase().includes('help me')) {
        supportType = 'practical';
      } else {
        supportType = 'emotional';
      }
      
      // Get the mapped mood for display
      const mappedMoodForDisplay = detectedMood ? mapSupportedMoodToMoodType(detectedMood) : null;
      
      setMessages((prev: Message[]) => [...prev, {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: 'ai',
        timestamp: new Date(),
        supportType,
        detectedMood: mappedMoodForDisplay,
      }]);
    } catch (e) {
      setAiTyping(false);
      setMessages((prev: Message[]) => [...prev, {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I am having trouble responding right now.',
        sender: 'ai',
        timestamp: new Date(),
      }]);
    }
  };



  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Listen for mood change event to update theme
  useEffect(() => {
    function onMoodChange(e: any) {
      if (e.detail && typeof e.detail === 'string') {
        // Call parent or update theme if needed
        if (typeof window !== 'undefined') {
          // Optionally, you can call a prop or update state here
        }
      }
    }
    window.addEventListener('moodChange', onMoodChange);
    return () => window.removeEventListener('moodChange', onMoodChange);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: `var(--mood-background)` }}>
      {/* Shared Sidebar */}
      <SharedSidebar 
        onNavigate={onNavigate}
        currentPage="chat"
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
        showMobile={showSidebar}
        onToggleMobile={() => setShowSidebar(!showSidebar)}
      />

      {/* Main Content - Responsive */}
      <div className={`${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} transition-all duration-300 p-2 sm:p-4 lg:p-6`}>
        {/* Header - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4"
        >
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Button
              variant="ghost"
              onClick={() => setShowSidebar(true)}
              className="lg:hidden rounded-full p-2 sm:p-3 flex-shrink-0"
              style={{ color: `var(--mood-primary)` }}
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate" style={{ color: `var(--mood-primary)` }}>
                AI Chat Assistant
              </h1>
              <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
                Your personal mental health companion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm flex-shrink-0">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-gray-600">
              AI {t.online}
            </span>
            <span className="text-gray-500 hidden sm:inline">
              • {currentMood}
            </span>
          </div>
        </motion.div>

        {/* Chat Container - Responsive */}
        <div className="w-full max-w-4xl mx-auto px-2 sm:px-0">
          <Card className="h-[calc(100vh-8rem)] sm:h-[600px] bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-0 shadow-xl flex flex-col">
            {/* Chat Header - Responsive */}
            <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div 
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `var(--mood-gradient)` }}
                  >
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base lg:text-lg font-medium truncate" style={{ color: `var(--mood-primary)` }}>
                      AI Mental Health Assistant
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      <span className="hidden sm:inline">Current mood: </span>
                      <span className="font-medium" style={{ color: `var(--mood-primary)` }}>{currentMood}</span> 
                      <span className="ml-1">{moodEmojis[currentMood]}</span>
                    </p>
                  </div>
                </div>

                <Button variant="ghost" size="sm" className="rounded-full p-1 sm:p-2 flex-shrink-0">
                  <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area - Responsive */}
            <div className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto space-y-3 sm:space-y-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                    style={{ background: `var(--mood-gradient)` }}
                  >
                    🤖
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2" style={{ color: `var(--mood-primary)` }}>
                      AI Mental Health Assistant
                    </h3>
                    <p className="text-gray-600 max-w-md">
                      Start a conversation and I'll provide personalized support. I can also detect your mood and adjust the theme to match how you're feeling.
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    Type a message below to begin...
                  </div>
                </div>
              )}
              
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm flex-shrink-0">
                        {msg.supportType === 'crisis' ? '🚨' : moodEmojis[currentMood]}
                      </div>
                    )}
                    {msg.sender === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm flex-shrink-0">
                        👤
                      </div>
                    )}
                    
                    <div className={`max-w-xs sm:max-w-sm lg:max-w-md ${msg.sender === 'user' ? 'text-right' : ''}`}>
                      <div 
                        className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          msg.sender === 'user' 
                            ? 'text-white' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                        style={{ 
                          background: msg.sender === 'user' ? `var(--mood-gradient)` : undefined 
                        }}
                      >
                        {msg.text}
                      </div>
                      
                      <div className={`text-xs text-gray-500 mt-1 flex items-center gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {msg.supportType && (
                          <Badge 
                            className={`text-xs ${
                              msg.supportType === 'crisis' ? 'bg-red-100 text-red-800' :
                              msg.supportType === 'practical' ? 'bg-blue-100 text-blue-800' :
                              msg.detectedMood === 'happy' ? 'bg-yellow-100 text-yellow-800' :
                              msg.detectedMood === 'sad' ? 'bg-purple-100 text-purple-800' :
                              msg.detectedMood === 'stressed' ? 'bg-orange-100 text-orange-800' :
                              msg.detectedMood === 'anxious' ? 'bg-green-100 text-green-800' :
                              msg.detectedMood === 'calm' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {msg.detectedMood || msg.supportType}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {aiTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                    🤖
                  </div>
                  <div className="bg-gray-100 p-4 rounded-2xl">
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input - Responsive */}
            <div className="p-3 sm:p-4 lg:p-6 border-t border-gray-200">
              <div className="flex gap-2 sm:gap-3 items-end">
                <div className="flex-1 relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={t.typeMessage}
                    className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl sm:rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-opacity-50 pr-16 sm:pr-24 text-sm sm:text-base"
                    style={{ '--tw-ring-color': `var(--mood-primary)` } as any}
                    rows={1}
                  />
                  
                  <div className="absolute right-2 sm:right-3 bottom-2 sm:bottom-3 flex gap-1 sm:gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full p-1 sm:p-2 hidden sm:flex"
                      onClick={() => setIsRecording(!isRecording)}
                      title={t.voiceMessage}
                    >
                      {isRecording ? (
                        <MicOff className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                      ) : (
                        <Mic className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full p-1 sm:p-2 hidden sm:flex"
                      title={t.attachFile}
                    >
                      <Paperclip className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                    </Button>
                  </div>
                </div>
                
                <Button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="rounded-full p-2 sm:p-3 flex-shrink-0"
                  style={{ background: `var(--mood-gradient)` }}
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}