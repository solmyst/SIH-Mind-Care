import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Select } from './ui/select';
import { Textarea } from './ui/textarea';
import { SharedSidebar } from './SharedSidebar';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  MapPin, 
  Star,
  User,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Phone,
  Menu
} from 'lucide-react';
import type { MoodType, PageType } from '../App';

interface AppointmentBookingProps {
  onNavigate: (page: PageType) => void;
  currentMood: MoodType;
  selectedLanguage: string;
}

interface Counselor {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  experience: string;
  rating: number;
  reviewCount: number;
  avatar: string;
  availability: string;
  nextAvailable: Date;
  languages: string[];
  sessionTypes: ('online' | 'offline')[];
  bio: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const translations = {
  en: {
    title: 'Book Appointment',
    subtitle: 'Schedule confidential sessions with mental health professionals',
    bookNew: 'Book New Appointment',
    upcoming: 'Upcoming',
    history: 'History',
    available: 'Available',
    nextAvailable: 'Next Available',
    bookSession: 'Book Session',
    reschedule: 'Reschedule',
    cancel: 'Cancel',
    years: 'years experience',
    rating: 'Rating',
    selectCounselor: 'Select Counselor',
    selectDateTime: 'Select Date & Time',
    selectType: 'Session Type',
    online: 'Online (Video)',
    offline: 'In-Person',
    confirmBooking: 'Confirm Booking',
    sessionNotes: 'Session Notes (Optional)',
    specialties: 'Specialties',
    languages: 'Languages',
    reviews: 'reviews'
  },
  es: {
    title: 'Reservar Cita',
    subtitle: 'Programa sesiones confidenciales con profesionales de salud mental',
    bookNew: 'Reservar Nueva Cita',
    upcoming: 'Próximas',
    history: 'Historial',
    available: 'Disponible',
    nextAvailable: 'Próxima Disponibilidad',
    bookSession: 'Reservar Sesión',
    reschedule: 'Reprogramar',
    cancel: 'Cancelar',
    years: 'años de experiencia',
    rating: 'Calificación',
    selectCounselor: 'Seleccionar Consejero',
    selectDateTime: 'Seleccionar Fecha y Hora',
    selectType: 'Tipo de Sesión',
    online: 'En Línea (Video)',
    offline: 'Presencial',
    confirmBooking: 'Confirmar Reserva',
    sessionNotes: 'Notas de Sesión (Opcional)',
    specialties: 'Especialidades',
    languages: 'Idiomas',
    reviews: 'reseñas'
  },
  fr: {
    title: 'Réserver Rendez-vous',
    subtitle: 'Planifiez des séances confidentielles avec des professionnels de la santé mentale',
    bookNew: 'Réserver Nouveau Rendez-vous',
    upcoming: 'À Venir',
    history: 'Historique',
    available: 'Disponible',
    nextAvailable: 'Prochaine Disponibilité',
    bookSession: 'Réserver Séance',
    reschedule: 'Reprogrammer',
    cancel: 'Annuler',
    years: 'années d\'expérience',
    rating: 'Note',
    selectCounselor: 'Sélectionner Conseiller',
    selectDateTime: 'Sélectionner Date et Heure',
    selectType: 'Type de Séance',
    online: 'En Ligne (Vidéo)',
    offline: 'En Personne',
    confirmBooking: 'Confirmer Réservation',
    sessionNotes: 'Notes de Séance (Optionnel)',
    specialties: 'Spécialités',
    languages: 'Langues',
    reviews: 'avis'
  },
  hi: {
    title: 'अपॉइंटमेंट बुक करें',
    subtitle: 'मानसिक स्वास्थ्य पेशेवरों के साथ गोपनीय सत्र निर्धारित करें',
    bookNew: 'नई अपॉइंटमेंट बुक करें',
    upcoming: 'आगामी',
    history: 'इतिहास',
    available: 'उपलब्ध',
    nextAvailable: 'अगली उपलब्धता',
    bookSession: 'सत्र बुक करें',
    reschedule: 'रीशेड्यूल करें',
    cancel: 'रद्द करें',
    years: 'साल का अनुभव',
    rating: 'रेटिंग',
    selectCounselor: 'काउंसलर चुनें',
    selectDateTime: 'दिनांक और समय चुनें',
    selectType: 'सत्र प्रकार',
    online: 'ऑनलाइन (वीडियो)',
    offline: 'व्यक्तिगत',
    confirmBooking: 'बुकिंग की पुष्टि करें',
    sessionNotes: 'सत्र नोट्स (वैकल्पिक)',
    specialties: 'विशेषताएं',
    languages: 'भाषाएं',
    reviews: 'समीक्षाएं'
  }
};

const counselors: Counselor[] = [
  {
    id: '1',
    name: 'Dr. Sharma Ji',
    title: 'Clinical Psychologist',
    specialties: ['Anxiety', 'Depression', 'Stress Management'],
    experience: '8 years',
    rating: 4.5,
    reviewCount: 127,
    avatar: '👩‍⚕️',
    availability: 'Available',
    nextAvailable: new Date('2024-03-12'),
    languages: ['English', 'Hindi'],
    sessionTypes: ['online', 'offline'],
    bio: 'Dr. Sharma specializes in cognitive behavioral therapy and has extensive experience helping students with academic stress and anxiety disorders.'
  },
  {
    id: '2',
    name: 'Dr. Rathi Ji',
    title: 'Counseling Psychologist',
    specialties: ['Anxiety', 'Depression', 'Relationship Issues'],
    experience: '8 years',
    rating: 4.5,
    reviewCount: 89,
    avatar: '👨‍⚕️',
    availability: 'Available',
    nextAvailable: new Date('2024-03-12'),
    languages: ['English', 'Hindi', 'Gujarati'],
    sessionTypes: ['online', 'offline'],
    bio: 'Dr. Rathi focuses on helping young adults navigate life transitions and build healthy coping mechanisms for stress and anxiety.'
  },
  {
    id: '3',
    name: 'Dr. Patel',
    title: 'Psychiatrist',
    specialties: ['Mood Disorders', 'Anxiety', 'ADHD'],
    experience: '12 years',
    rating: 4.8,
    reviewCount: 203,
    avatar: '👩‍⚕️',
    availability: 'Available',
    nextAvailable: new Date('2024-03-13'),
    languages: ['English', 'Hindi', 'Gujarati'],
    sessionTypes: ['online', 'offline'],
    bio: 'Dr. Patel is a board-certified psychiatrist with expertise in treating mood disorders and anxiety in college students.'
  }
];

const timeSlots: TimeSlot[] = [
  { time: '09:00 AM', available: true },
  { time: '10:00 AM', available: false },
  { time: '11:00 AM', available: true },
  { time: '12:00 PM', available: true },
  { time: '02:00 PM', available: true },
  { time: '03:00 PM', available: false },
  { time: '04:00 PM', available: true },
  { time: '05:00 PM', available: true }
];

const upcomingAppointments = [
  {
    id: '1',
    counselor: 'Dr. Sharma Ji',
    specialty: 'Anxiety And Depression',
    date: new Date('2024-03-11'),
    time: '2:00 PM',
    type: 'Video',
    notes: 'Focus on coping strategies for exam stress',
    status: 'confirmed'
  }
];

export function AppointmentBooking({ onNavigate, currentMood, selectedLanguage }: AppointmentBookingProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history' | 'book' | 'counselors'>('upcoming');
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [sessionType, setSessionType] = useState<'online' | 'offline'>('online');
  const [sessionNotes, setSessionNotes] = useState('');
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

  const handleBookSession = (counselor: Counselor) => {
    setSelectedCounselor(counselor);
    setShowBookingFlow(true);
    setBookingStep(1);
  };

  const handleConfirmBooking = () => {
    // Here you would typically send the booking data to your backend
    console.log('Booking confirmed:', {
      counselor: selectedCounselor,
      date: selectedDate,
      time: selectedTime,
      type: sessionType,
      notes: sessionNotes
    });
    
    setShowBookingFlow(false);
    setBookingStep(1);
    setActiveTab('upcoming');
  };

  const resetBookingFlow = () => {
    setShowBookingFlow(false);
    setBookingStep(1);
    setSelectedCounselor(null);
    setSelectedDate(new Date());
    setSelectedTime('');
    setSessionType('online');
    setSessionNotes('');
  };

  if (showBookingFlow && selectedCounselor) {
    return (
      <div className="min-h-screen" style={{ background: `var(--mood-background)` }}>
        {/* Shared Sidebar */}
        <SharedSidebar 
          onNavigate={onNavigate}
          currentPage="appointments"
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
          showMobile={showSidebar}
          onToggleMobile={() => setShowSidebar(!showSidebar)}
        />

        {/* Main Content */}
        <div className={`${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} transition-all duration-300 p-6`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Booking Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={resetBookingFlow}
                className="rounded-full p-3"
                style={{ color: `var(--mood-primary)` }}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl" style={{ color: `var(--mood-primary)` }}>
                  {t.bookSession}
                </h1>
                <p className="text-gray-600">
                  Step {bookingStep} of 3
                </p>
              </div>
            </div>
          </div>

          {/* Booking Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-8">
              {[1, 2, 3].map(step => (
                <div key={step} className="flex items-center gap-2">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      step <= bookingStep 
                        ? 'text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}
                    style={{ 
                      background: step <= bookingStep ? `var(--mood-gradient)` : undefined 
                    }}
                  >
                    {step < bookingStep ? <CheckCircle className="w-4 h-4" /> : step}
                  </div>
                  <span className={`text-sm ${
                    step <= bookingStep 
                      ? '' 
                      : 'text-gray-500'
                  }`} style={{ color: step <= bookingStep ? `var(--mood-primary)` : undefined }}>
                    {step === 1 ? t.selectCounselor : step === 2 ? t.selectDateTime : t.confirmBooking}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Card className="p-8 bg-white/70 backdrop-blur-sm rounded-3xl border-0 shadow-xl">
            <AnimatePresence mode="wait">
              {bookingStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* Counselor Details */}
                  <div className="text-center space-y-4">
                    <div className="text-4xl">{selectedCounselor.avatar}</div>
                    <div>
                      <h2 className="text-2xl mb-1" style={{ color: `var(--mood-primary)` }}>
                        {selectedCounselor.name}
                      </h2>
                      <p className="text-gray-600">{selectedCounselor.title}</p>
                    </div>
                  </div>

                  {/* Counselor Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm mb-2" style={{ color: `var(--mood-primary)` }}>
                          {t.specialties}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCounselor.specialties.map(specialty => (
                            <Badge key={specialty} variant="outline">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm mb-2" style={{ color: `var(--mood-primary)` }}>
                          {t.languages}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCounselor.languages.map(language => (
                            <Badge key={language} variant="secondary">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{selectedCounselor.rating} ({selectedCounselor.reviewCount} {t.reviews})</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span>{selectedCounselor.experience} {t.years}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">{t.available}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedCounselor.bio}
                    </p>
                  </div>

                  <Button
                    onClick={() => setBookingStep(2)}
                    className="w-full h-12 rounded-xl text-white"
                    style={{ background: `var(--mood-gradient)` }}
                  >
                    Continue
                  </Button>
                </motion.div>
              )}

              {bookingStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl text-center" style={{ color: `var(--mood-primary)` }}>
                    {t.selectDateTime}
                  </h2>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Calendar */}
                    <div>
                      <h4 className="text-sm mb-4" style={{ color: `var(--mood-primary)` }}>
                        Select Date
                      </h4>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        className="rounded-xl border border-gray-200"
                        disabled={(date) => date < new Date()}
                      />
                    </div>

                    {/* Time Slots */}
                    <div>
                      <h4 className="text-sm mb-4" style={{ color: `var(--mood-primary)` }}>
                        Available Times
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {timeSlots.map(slot => (
                          <Button
                            key={slot.time}
                            variant={selectedTime === slot.time ? 'default' : 'outline'}
                            onClick={() => slot.available && setSelectedTime(slot.time)}
                            disabled={!slot.available}
                            className="h-10 rounded-lg text-sm"
                            style={{
                              background: selectedTime === slot.time ? `var(--mood-gradient)` : undefined,
                              color: selectedTime === slot.time ? 'white' : undefined
                            }}
                          >
                            {slot.time}
                          </Button>
                        ))}
                      </div>

                      {/* Session Type */}
                      <div className="mt-6">
                        <h4 className="text-sm mb-4" style={{ color: `var(--mood-primary)` }}>
                          {t.selectType}
                        </h4>
                        <div className="space-y-2">
                          <Button
                            variant={sessionType === 'online' ? 'default' : 'outline'}
                            onClick={() => setSessionType('online')}
                            className="w-full justify-start rounded-lg"
                            style={{
                              background: sessionType === 'online' ? `var(--mood-gradient)` : undefined,
                              color: sessionType === 'online' ? 'white' : undefined
                            }}
                          >
                            <Video className="w-4 h-4 mr-2" />
                            {t.online}
                          </Button>
                          <Button
                            variant={sessionType === 'offline' ? 'default' : 'outline'}
                            onClick={() => setSessionType('offline')}
                            className="w-full justify-start rounded-lg"
                            style={{
                              background: sessionType === 'offline' ? `var(--mood-gradient)` : undefined,
                              color: sessionType === 'offline' ? 'white' : undefined
                            }}
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            {t.offline}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setBookingStep(1)}
                      className="flex-1 rounded-xl"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => setBookingStep(3)}
                      disabled={!selectedTime}
                      className="flex-1 rounded-xl text-white"
                      style={{ background: `var(--mood-gradient)` }}
                    >
                      Continue
                    </Button>
                  </div>
                </motion.div>
              )}

              {bookingStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl text-center" style={{ color: `var(--mood-primary)` }}>
                    {t.confirmBooking}
                  </h2>

                  {/* Booking Summary */}
                  <div className="p-6 bg-gray-50 rounded-xl space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{selectedCounselor.avatar}</div>
                      <div>
                        <h3 className="text-lg" style={{ color: `var(--mood-primary)` }}>
                          {selectedCounselor.name}
                        </h3>
                        <p className="text-sm text-gray-600">{selectedCounselor.title}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-gray-500" />
                        <span>{selectedDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{selectedTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {sessionType === 'online' ? (
                          <Video className="w-4 h-4 text-gray-500" />
                        ) : (
                          <MapPin className="w-4 h-4 text-gray-500" />
                        )}
                        <span>{sessionType === 'online' ? t.online : t.offline}</span>
                      </div>
                    </div>
                  </div>

                  {/* Session Notes */}
                  <div>
                    <h4 className="text-sm mb-2" style={{ color: `var(--mood-primary)` }}>
                      {t.sessionNotes}
                    </h4>
                    <Textarea
                      value={sessionNotes}
                      onChange={(e) => setSessionNotes(e.target.value)}
                      placeholder="Share any specific topics or concerns you'd like to discuss..."
                      className="min-h-24"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setBookingStep(2)}
                      className="flex-1 rounded-xl"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={handleConfirmBooking}
                      className="flex-1 rounded-xl text-white"
                      style={{ background: `var(--mood-gradient)` }}
                    >
                      Confirm Booking
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: `var(--mood-background)` }}>
      {/* Shared Sidebar */}
      <SharedSidebar 
        onNavigate={onNavigate}
        currentPage="appointments"
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
          className="flex items-center justify-between mb-8"
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
              <h1 className="text-3xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {t.title}
              </h1>
              <p className="text-gray-600">{t.subtitle}</p>
            </div>
          </div>

        <Button
          onClick={() => setActiveTab('book')}
          className="rounded-full px-6 text-white"
          style={{ background: `var(--mood-gradient)` }}
        >
          + {t.bookNew}
        </Button>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex gap-2 p-1 bg-white/70 backdrop-blur-sm rounded-2xl border max-w-lg">
          {(['upcoming', 'history', 'counselors'] as const).map(tab => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-xl transition-all capitalize ${
                activeTab === tab 
                  ? 'text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-white/50'
              }`}
              style={{ 
                background: activeTab === tab ? `var(--mood-gradient)` : undefined 
              }}
            >
              {tab === 'counselors' ? 'Counselors' : t[tab]}
            </Button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 'upcoming' && (
          <motion.div
            key="upcoming"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {upcomingAppointments.length === 0 ? (
              <Card className="p-12 bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-lg text-center">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl mb-2" style={{ color: `var(--mood-primary)` }}>
                  No upcoming appointments
                </h3>
                <p className="text-gray-600 mb-6">Book your first session with a mental health professional</p>
                <Button
                  onClick={() => setActiveTab('book')}
                  className="rounded-full px-8 text-white"
                  style={{ background: `var(--mood-gradient)` }}
                >
                  {t.bookNew}
                </Button>
              </Card>
            ) : (
              upcomingAppointments.map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">👩‍⚕️</div>
                        <div>
                          <h3 className="text-lg" style={{ color: `var(--mood-primary)` }}>
                            {appointment.counselor}
                          </h3>
                          <p className="text-sm text-gray-600">{appointment.specialty}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              {appointment.date.toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {appointment.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <Video className="w-4 h-4" />
                              {appointment.type}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-full">
                          {t.reschedule}
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-full text-red-600">
                          {t.cancel}
                        </Button>
                      </div>
                    </div>
                    
                    {appointment.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{appointment.notes}</p>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="p-12 bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-lg text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl mb-2" style={{ color: `var(--mood-primary)` }}>
                No appointment history
              </h3>
              <p className="text-gray-600">Your past appointments will appear here</p>
            </Card>
          </motion.div>
        )}

        {activeTab === 'counselors' && (
          <motion.div
            key="counselors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-xl" style={{ color: `var(--mood-primary)` }}>
              Our Counselors
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {counselors.map((counselor, index) => (
                <motion.div
                  key={counselor.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all h-full">
                    <div className="space-y-4">
                      {/* Counselor Header */}
                      <div className="text-center">
                        <div className="text-4xl mb-2">{counselor.avatar}</div>
                        <h3 className="text-lg" style={{ color: `var(--mood-primary)` }}>
                          {counselor.name}
                        </h3>
                        <p className="text-sm text-gray-600">{counselor.title}</p>
                      </div>

                      {/* Counselor Info */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{t.rating}:</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>{counselor.rating}/5.0 ({counselor.reviewCount})</span>
                          </div>
                        </div>

                        <div className="text-sm">
                          <span className="text-gray-600 block mb-1">{t.specialties}:</span>
                          <div className="flex flex-wrap gap-1">
                            {counselor.specialties.map(specialty => (
                              <Badge key={specialty} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="text-sm">
                          <span className="text-gray-600 block mb-1">{t.languages}:</span>
                          <div className="flex flex-wrap gap-1">
                            {counselor.languages.map(language => (
                              <Badge key={language} variant="secondary" className="text-xs">
                                {language}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="text-sm text-gray-600">
                          <strong>{counselor.experience} {t.years}</strong>
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {counselor.bio}
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <Button
                          onClick={() => handleBookSession(counselor)}
                          className="w-full rounded-xl text-white"
                          style={{ background: `var(--mood-gradient)` }}
                        >
                          {t.bookSession}
                        </Button>
                        <div className="text-xs text-center text-gray-500">
                          Next available: {counselor.nextAvailable.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'book' && (
          <motion.div
            key="book"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-xl" style={{ color: `var(--mood-primary)` }}>
              Available Counselors
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {counselors.map((counselor, index) => (
                <motion.div
                  key={counselor.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all h-full">
                    <div className="space-y-4">
                      {/* Counselor Header */}
                      <div className="text-center">
                        <div className="text-4xl mb-2">{counselor.avatar}</div>
                        <h3 className="text-lg" style={{ color: `var(--mood-primary)` }}>
                          {counselor.name}
                        </h3>
                        <p className="text-sm text-gray-600">{counselor.title}</p>
                      </div>

                      {/* Counselor Info */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{t.rating}:</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>{counselor.rating}/5.0</span>
                          </div>
                        </div>

                        <div className="text-sm">
                          <span className="text-gray-600 block mb-1">{t.specialties}:</span>
                          <div className="flex flex-wrap gap-1">
                            {counselor.specialties.slice(0, 2).map(specialty => (
                              <Badge key={specialty} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="text-sm">
                          <span className="text-gray-600">{t.nextAvailable}: </span>
                          <span>{counselor.nextAvailable.toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        onClick={() => handleBookSession(counselor)}
                        className="w-full rounded-xl text-white"
                        style={{ background: `var(--mood-gradient)` }}
                      >
                        {t.bookSession}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}