import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Calendar } from './ui/calendar';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { SharedSidebar } from './SharedSidebar';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Mic, 
  MicOff, 
  Save, 
  Edit3,
  Trash2,
  TrendingUp,
  Search,
  Filter,
  Menu
} from 'lucide-react';
import type { MoodType, PageType } from '../App';

interface MoodJournalProps {
  onNavigate: (page: PageType) => void;
  currentMood: MoodType;
  selectedLanguage: string;
}

interface JournalEntry {
  id: string;
  date: Date;
  mood: MoodType;
  moodScore: number; // 1-10
  title: string;
  content: string;
  isVoiceEntry: boolean;
  voiceTranscript?: string;
  tags: string[];
}

const translations = {
  en: {
    title: 'Mood Journal',
    subtitle: 'Track your daily emotions and thoughts',
    addEntry: 'Add New Entry',
    voiceEntry: 'Voice Entry',
    textEntry: 'Text Entry',
    selectDate: 'Select Date',
    moodRating: 'How do you feel? (1-10)',
    entryTitle: 'Entry Title',
    writeThoughts: 'Write your thoughts...',
    saveEntry: 'Save Entry',
    recording: 'Recording...',
    stopRecording: 'Stop Recording',
    startRecording: 'Start Recording',
    noEntries: 'No journal entries yet',
    moodTrend: 'Mood Trend',
    searchEntries: 'Search entries...'
  },
  es: {
    title: 'Diario del Estado de Ánimo',
    subtitle: 'Rastrea tus emociones y pensamientos diarios',
    addEntry: 'Agregar Nueva Entrada',
    voiceEntry: 'Entrada de Voz',
    textEntry: 'Entrada de Texto',
    selectDate: 'Seleccionar Fecha',
    moodRating: '¿Cómo te sientes? (1-10)',
    entryTitle: 'Título de la Entrada',
    writeThoughts: 'Escribe tus pensamientos...',
    saveEntry: 'Guardar Entrada',
    recording: 'Grabando...',
    stopRecording: 'Detener Grabación',
    startRecording: 'Iniciar Grabación',
    noEntries: 'Aún no hay entradas en el diario',
    moodTrend: 'Tendencia del Estado de Ánimo',
    searchEntries: 'Buscar entradas...'
  },
  fr: {
    title: 'Journal d\'Humeur',
    subtitle: 'Suivez vos émotions et pensées quotidiennes',
    addEntry: 'Ajouter Nouvelle Entrée',
    voiceEntry: 'Entrée Vocale',
    textEntry: 'Entrée Texte',
    selectDate: 'Sélectionner Date',
    moodRating: 'Comment vous sentez-vous? (1-10)',
    entryTitle: 'Titre de l\'Entrée',
    writeThoughts: 'Écrivez vos pensées...',
    saveEntry: 'Sauvegarder Entrée',
    recording: 'Enregistrement...',
    stopRecording: 'Arrêter Enregistrement',
    startRecording: 'Commencer Enregistrement',
    noEntries: 'Aucune entrée de journal encore',
    moodTrend: 'Tendance d\'Humeur',
    searchEntries: 'Rechercher entrées...'
  },
  hi: {
    title: 'मूड जर्नल',
    subtitle: 'अपनी दैनिक भावनाओं और विचारों को ट्रैक करें',
    addEntry: 'नई प्रविष्टि जोड़ें',
    voiceEntry: 'आवाज़ प्रविष्टि',
    textEntry: 'टेक्स्ट प्रविष्टि',
    selectDate: 'तारीख चुनें',
    moodRating: 'आप कैसा महसूस करते हैं? (1-10)',
    entryTitle: 'प्रविष्टि शीर्षक',
    writeThoughts: 'अपने विचार लिखें...',
    saveEntry: 'प्रविष्टि सहेजें',
    recording: 'रिकॉर्डिंग...',
    stopRecording: 'रिकॉर्डिंग बंद करें',
    startRecording: 'रिकॉर्डिंग शुरू करें',
    noEntries: 'अभी तक कोई जर्नल प्रविष्टि नहीं',
    moodTrend: 'मूड ट्रेंड',
    searchEntries: 'प्रविष्टियों को खोजें...'
  }
};

const moodEmojis = {
  happy: '😊',
  calm: '😌',
  sad: '😢',
  anxious: '😰',
  stressed: '😫',
  neutral: '😐'
};

export function MoodJournal({ onNavigate, currentMood, selectedLanguage }: MoodJournalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [entryMode, setEntryMode] = useState<'text' | 'voice'>('text');
  const [isRecording, setIsRecording] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  
  const [newEntry, setNewEntry] = useState({
    mood: currentMood,
    moodScore: 5,
    title: '',
    content: '',
    isVoiceEntry: false,
    voiceTranscript: ''
  });

  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: new Date('2024-01-15'),
      mood: 'happy',
      moodScore: 8,
      title: 'Great day at university',
      content: 'Had an amazing presentation today and felt really confident. The feedback was positive and I feel like I\'m growing academically.',
      isVoiceEntry: false,
      tags: ['university', 'presentation', 'confidence']
    },
    {
      id: '2',
      date: new Date('2024-01-14'),
      mood: 'anxious',
      moodScore: 4,
      title: 'Pre-exam nerves',
      content: 'Feeling quite anxious about tomorrow\'s exam. I\'ve studied hard but can\'t shake off the nervous feeling.',
      isVoiceEntry: true,
      voiceTranscript: 'This was recorded as a voice note during my evening walk.',
      tags: ['exam', 'anxiety', 'study']
    },
    {
      id: '3',
      date: new Date('2024-01-13'),
      mood: 'calm',
      moodScore: 7,
      title: 'Meditation practice',
      content: 'Did a 20-minute meditation session today. Feeling much more centered and peaceful. It really helps with my daily stress.',
      isVoiceEntry: false,
      tags: ['meditation', 'peace', 'self-care']
    }
  ]);

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

  const handleSaveEntry = () => {
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      mood: newEntry.mood,
      moodScore: newEntry.moodScore,
      title: newEntry.title,
      content: newEntry.content,
      isVoiceEntry: entryMode === 'voice',
      voiceTranscript: entryMode === 'voice' ? newEntry.voiceTranscript : undefined,
      tags: extractTags(newEntry.content)
    };

    setEntries(prev => [entry, ...prev]);
    setNewEntry({
      mood: currentMood,
      moodScore: 5,
      title: '',
      content: '',
      isVoiceEntry: false,
      voiceTranscript: ''
    });
    setShowNewEntry(false);
  };

  const extractTags = (content: string): string[] => {
    // Simple tag extraction based on common emotional words
    const emotionalWords = ['happy', 'sad', 'anxious', 'stressed', 'calm', 'excited', 'worried', 'confident', 'tired', 'energetic'];
    const words = content.toLowerCase().split(' ');
    return emotionalWords.filter(word => words.some(w => w.includes(word)));
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate voice transcription
      setNewEntry(prev => ({
        ...prev,
        voiceTranscript: 'Voice recording completed and transcribed.',
        content: prev.content + ' [Voice note transcribed]'
      }));
    } else {
      setIsRecording(true);
    }
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const moodTrendData = entries.slice(0, 7).map(entry => ({
    date: entry.date.toLocaleDateString([], { weekday: 'short' }),
    score: entry.moodScore
  }));

  return (
    <div className="min-h-screen" style={{ background: `var(--mood-background)` }}>
      {/* Shared Sidebar */}
      <SharedSidebar 
        onNavigate={onNavigate}
        currentPage="journal"
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
        showMobile={showSidebar}
        onToggleMobile={() => setShowSidebar(!showSidebar)}
      />

      {/* Main Content */}
      <div className={`${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} transition-all duration-300`}>
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setShowSidebar(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl" style={{ color: `var(--mood-primary)` }}>
                  {t.title}
                </h1>
                <p className="text-gray-600">
                  {t.subtitle}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
      {/* Add Entry Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-end mb-8"
      >
        <Button
          onClick={() => setShowNewEntry(true)}
          className="rounded-full px-6 text-white"
          style={{ background: `var(--mood-gradient)` }}
        >
          <Edit3 className="w-4 h-4 mr-2" />
          {t.addEntry}
        </Button>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Left Sidebar - Calendar & Stats */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Calendar */}
          <Card className="p-4 bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-lg">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && date <= new Date() && setSelectedDate(date)}
              disabled={(date) => date > new Date()}
              className="w-full"
            />
          </Card>

          {/* Mood Trend */}
          <Card className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-lg">
            <h3 className="text-lg mb-4 flex items-center gap-2" style={{ color: `var(--mood-primary)` }}>
              <TrendingUp className="w-5 h-5" />
              {t.moodTrend}
            </h3>
            
            <div className="space-y-3">
              {moodTrendData.map((day, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-gray-600 w-12">{day.date}</span>
                  <div className="flex-1 mx-3">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `var(--mood-gradient)` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${day.score * 10}%` }}
                        transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                      />
                    </div>
                  </div>
                  <span className="text-sm w-6" style={{ color: `var(--mood-primary)` }}>
                    {day.score}
                  </span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="lg:col-span-3 space-y-6"
        >
          {/* Search Bar */}
          <Card className="p-4 bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-lg">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t.searchEntries}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ '--tw-ring-color': `var(--mood-primary)` } as any}
                />
              </div>
              <Button variant="outline" className="rounded-xl">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Journal Entries */}
          <div className="space-y-4">
            {filteredEntries.length === 0 ? (
              <Card className="p-12 bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-lg text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl mb-2" style={{ color: `var(--mood-primary)` }}>
                  {t.noEntries}
                </h3>
                <p className="text-gray-600 mb-6">Start documenting your wellness journey today</p>
                <Button
                  onClick={() => setShowNewEntry(true)}
                  className="rounded-full px-8 text-white"
                  style={{ background: `var(--mood-gradient)` }}
                >
                  {t.addEntry}
                </Button>
              </Card>
            ) : (
              filteredEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="space-y-4">
                      {/* Entry Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {moodEmojis[entry.mood]}
                          </div>
                          <div>
                            <h3 className="text-lg" style={{ color: `var(--mood-primary)` }}>
                              {entry.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {entry.date.toLocaleDateString()} • Score: {entry.moodScore}/10
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {entry.isVoiceEntry && (
                            <Badge variant="secondary" className="text-xs">
                              <Mic className="w-3 h-3 mr-1" />
                              Voice
                            </Badge>
                          )}
                          <Button variant="ghost" size="sm" className="rounded-full p-2">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="rounded-full p-2 text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Entry Content */}
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 leading-relaxed">
                          {entry.content}
                        </p>
                        {entry.voiceTranscript && (
                          <p className="text-sm text-gray-500 italic mt-2">
                            Voice note: {entry.voiceTranscript}
                          </p>
                        )}
                      </div>

                      {/* Tags */}
                      {entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {entry.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* New Entry Modal */}
      <AnimatePresence>
        {showNewEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={() => setShowNewEntry(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl mb-2" style={{ color: `var(--mood-primary)` }}>
                    {t.addEntry}
                  </h2>
                  <p className="text-gray-600">
                    {selectedDate.toLocaleDateString()}
                  </p>
                </div>

                {/* Entry Mode Toggle */}
                <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                  <Button
                    variant={entryMode === 'text' ? 'default' : 'ghost'}
                    onClick={() => setEntryMode('text')}
                    className="flex-1 rounded-lg"
                  >
                    {t.textEntry}
                  </Button>
                  <Button
                    variant={entryMode === 'voice' ? 'default' : 'ghost'}
                    onClick={() => setEntryMode('voice')}
                    className="flex-1 rounded-lg"
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    {t.voiceEntry}
                  </Button>
                </div>

                {/* Mood Rating */}
                <div className="space-y-3">
                  <label className="text-sm">{t.moodRating}</label>
                  <div className="flex gap-2">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(score => (
                      <Button
                        key={score}
                        variant={newEntry.moodScore === score ? 'default' : 'outline'}
                        onClick={() => setNewEntry(prev => ({ ...prev, moodScore: score }))}
                        className="w-10 h-10 rounded-full text-sm"
                        style={{
                          background: newEntry.moodScore === score ? `var(--mood-gradient)` : undefined,
                          color: newEntry.moodScore === score ? 'white' : undefined
                        }}
                      >
                        {score}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Entry Title */}
                <div className="space-y-2">
                  <label className="text-sm">{t.entryTitle}</label>
                  <input
                    type="text"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ '--tw-ring-color': `var(--mood-primary)` } as any}
                    placeholder="Give your entry a title..."
                  />
                </div>

                {/* Entry Content */}
                {entryMode === 'text' ? (
                  <div className="space-y-2">
                    <label className="text-sm">Content</label>
                    <Textarea
                      value={newEntry.content}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                      placeholder={t.writeThoughts}
                      className="min-h-32 resize-none focus:ring-2 focus:ring-opacity-50"
                      style={{ '--tw-ring-color': `var(--mood-primary)` } as any}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <Button
                        onClick={handleVoiceToggle}
                        className={`rounded-full w-20 h-20 ${
                          isRecording ? 'bg-red-500 hover:bg-red-600' : ''
                        }`}
                        style={{ background: isRecording ? undefined : `var(--mood-gradient)` }}
                      >
                        {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                      </Button>
                      <p className="text-sm text-gray-600 mt-2">
                        {isRecording ? t.recording : t.startRecording}
                      </p>
                    </div>
                    {newEntry.voiceTranscript && (
                      <div className="p-4 bg-gray-100 rounded-xl">
                        <p className="text-sm text-gray-700">{newEntry.voiceTranscript}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowNewEntry(false)}
                    className="flex-1 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveEntry}
                    disabled={!newEntry.title || (!newEntry.content && !newEntry.voiceTranscript)}
                    className="flex-1 rounded-xl text-white"
                    style={{ background: `var(--mood-gradient)` }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {t.saveEntry}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
        </main>
      </div>
    </div>
  );
}