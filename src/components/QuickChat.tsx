importimport React, { useState, useRef, useEffect } from 'react';
import { generateGeminiContent, SupportedMood } from './aiGemini';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { SharedSidebar } from './SharedSidebar';
impo                        {msg.sender === 'user' && <span role="img" aria-label="user">👤</span>}t { ArrowLeft, Send, Bot, Mic, MicOff, Paperclip, MoreHorizontal, Menu } from 'lucide-react';eact, { useState, useRef, useEffect } from 'react';
import { generateGeminiContent, SupportedMood } from './aiGemini';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { SharedSidebar } from './SharedSidebar';
imp                        {msg.sender === 'user' && <span role="img" aria-label="user">👤</span>}rt { ArrowLeft, Send, Bot, Mic, MicOff, Paperclip, MoreHorizontal, Menu } from 'lucide-react';
import type { MoodType, PageType } from '../App';

interface QuickChatProps {
  onNavigate: (page: PageType) => void;
  currentMood: MoodType;
  selectedLanguage: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
  supportType?: 'emotional' | 'practical' | 'crisis';
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

export function QuickChat({ onNavigate, currentMood, selectedLanguage }: QuickChatProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

  const aiMessages: Message[] = [
    {
      id: '1',
      text: 'Hello! I\'m your personal AI mental health assistant. I\'m here to listen, understand, and provide personalized support based on how you\'re feeling. How are you doing today?',
      sender: 'ai',
      timestamp: new Date(Date.now() - 5000),
      supportType: 'emotional'
    }
  ];

  useEffect(() => {
    setMessages(aiMessages);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mood mapping for theme change

  // Mood mapping for theme and emoji
  const moodKeywords: Record<string, MoodType> = {
    happy: 'happy',
    calm: 'calm',
    sad: 'sad',
    anxious: 'anxious',
    stressed: 'stressed',
    neutral: 'neutral',
  };

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

  // Detect if crisis detected in Gemini JSON
  function isCrisisDetected(response: string): boolean {
    try {
      const jsonMatch = response.match(/\{[\s\S]*?\}/);
      if (!jsonMatch) return false;
      const json = JSON.parse(jsonMatch[0]);
      return json.crisis_detected === 'true';
    } catch {
      return false;
    }
  }

  const sendMessage = async () => {
    if (!message.trim()) return;

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
      const { text: aiText, mood: detectedMood, isCrisis } = await generateGeminiContent(message);
      setAiTyping(false);

      // Update theme based on detected mood from Gemini's JSON
      if (detectedMood) {
        const mappedMood = mapSupportedMoodToMoodType(detectedMood);
        const event = new CustomEvent('moodChange', { detail: mappedMood });
        window.dispatchEvent(event);
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
      
      setMessages((prev: Message[]) => [...prev, {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: 'ai',
        timestamp: new Date(),
        supportType,
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

  const getResponseType = (userMessage: string): 'emotional' | 'practical' | 'crisis' => {
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('help') || lowerMessage.includes('how to') || lowerMessage.includes('what should')) {
      return 'practical';
    }
    if (lowerMessage.includes('crisis') || lowerMessage.includes('emergency') || lowerMessage.includes('hurt')) {
      return 'crisis';
    }
    return 'emotional';
  };

  const getAIResponse = (userMessage: string, mood: MoodType) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Crisis responses
    if (lowerMessage.includes('hurt myself') || lowerMessage.includes('suicide') || lowerMessage.includes('kill myself')) {
      return "I'm very concerned about what you're sharing. Your life has value and you deserve support. Please reach out to a crisis helpline or emergency services immediately. In the US, you can call 988 for the Suicide & Crisis Lifeline. I'm here to support you, but professional help is crucial right now.";
    }
    
    // Practical responses based on keywords
    if (lowerMessage.includes('sleep') || lowerMessage.includes('tired')) {
      return "Sleep issues can really impact our mental health. Try establishing a consistent bedtime routine, avoiding screens 1 hour before bed, and creating a calm environment. Would you like some specific sleep hygiene tips tailored to your situation?";
    }
    
    if (lowerMessage.includes('study') || lowerMessage.includes('exam') || lowerMessage.includes('assignment')) {
      return "Academic stress is very common. Breaking tasks into smaller chunks, using the Pomodoro Technique (25 min work, 5 min break), and setting realistic goals can help. What specific aspect of studying is challenging you most?";
    }
    
    if (lowerMessage.includes('friends') || lowerMessage.includes('social') || lowerMessage.includes('lonely')) {
      return "Social connections are so important for our wellbeing. It's normal to feel lonely sometimes. Consider joining campus clubs, study groups, or activities that align with your interests. Small steps like saying hi to classmates can make a difference. What social activities have you enjoyed in the past?";
    }
    
    // Mood-based responses
    const responses = {
      happy: "I'm so glad to hear you're feeling positive! That energy is wonderful. What's been contributing to this good mood? Sometimes understanding what brings us joy helps us recreate those moments.",
      calm: "It sounds like you're in a peaceful space right now. That's really valuable. What practices or situations help you maintain this sense of calm? I'd love to help you build on these positive experiences.",
      sad: "I hear you, and I want you to know that what you're feeling is completely valid. Sadness is a natural part of the human experience. Would you like to talk about what's been weighing on your heart, or would you prefer some gentle coping strategies?",
      anxious: "Anxiety can feel overwhelming, but you're not alone in this. Let's focus on what we can control right now. Would you like to try a quick breathing exercise with me, or would it help to talk through what's creating these anxious feelings?",
      stressed: "Stress can feel like a heavy weight. You're being proactive by reaching out, which shows real strength. Would you like to explore some stress management techniques, or would it help to talk through what's creating this pressure in your life?",
      neutral: "Thank you for connecting with me today. Everyone's mental health journey is unique, and I'm here to support you wherever you are. What would feel most helpful right now - talking through something specific, learning some wellness strategies, or just having someone listen?"
    };
    
    return responses[mood] || responses.neutral;
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

      {/* Main Content */}
      <div className={`${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} transition-all duration-300 p-6`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-6"
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
              <h1 className="text-3xl" style={{ color: `var(--mood-primary)` }}>
                AI Chat Assistant
              </h1>
              <p className="text-gray-600">
                Your personal mental health companion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-600">
              AI {t.online}
            </span>
          </div>
        </motion.div>

        {/* Chat Container */}
        <div className="max-w-4xl mx-auto">
          <Card className="h-[600px] bg-white/70 backdrop-blur-sm rounded-3xl border-0 shadow-xl flex flex-col">
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: `var(--mood-gradient)` }}
                  >
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg" style={{ color: `var(--mood-primary)` }}>
                      AI Mental Health Assistant
                    </h3>
                    <p className="text-sm text-gray-600">
                      Personalized support based on your current mood: {currentMood}
                    </p>
                  </div>
                </div>

                <Button variant="ghost" size="sm" className="rounded-full">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {msg.sender !== 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm flex-shrink-0">
                        {msg.sender === 'ai' && msg.supportType !== 'crisis' && moodEmojis[currentMood]}
                        {msg.sender === 'ai' && msg.supportType === 'crisis' && '🚨'}
                        {msg.sender === 'user' && '�'}
                      </div>
                    )}
                    
                    <div className={`max-w-md ${msg.sender === 'user' ? 'text-right' : ''}`}>
                      <div 
                        className={`p-4 rounded-2xl text-sm leading-relaxed ${
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
                              'bg-green-100 text-green-800'
                            }`}
                          >
                            {msg.supportType}
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

            {/* Message Input */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t.typeMessage}
                    className="w-full p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-opacity-50 pr-24"
                    style={{ '--tw-ring-color': `var(--mood-primary)` } as any}
                    rows={1}
                  />
                  
                  <div className="absolute right-3 bottom-3 flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full p-2"
                      onClick={() => setIsRecording(!isRecording)}
                      title={t.voiceMessage}
                    >
                      {isRecording ? (
                        <MicOff className="w-4 h-4 text-red-500" />
                      ) : (
                        <Mic className="w-4 h-4 text-gray-500" />
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full p-2"
                      title={t.attachFile}
                    >
                      <Paperclip className="w-4 h-4 text-gray-500" />
                    </Button>
                  </div>
                </div>
                
                <Button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="rounded-full p-3"
                  style={{ background: `var(--mood-gradient)` }}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}