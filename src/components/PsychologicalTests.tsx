import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { SharedSidebar } from './SharedSidebar';
import { 
  ArrowLeft, 
  Brain, 
  Heart, 
  Shield, 
  CheckCircle, 
  Clock,
  BarChart3,
  FileText,
  Award,
  Menu
} from 'lucide-react';
import type { MoodType, PageType } from '../App';

interface PsychologicalTestsProps {
  onNavigate: (page: PageType) => void;
  currentMood: MoodType;
  selectedLanguage: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  category: string;
}

interface TestResult {
  score: number;
  category: string;
  description: string;
  recommendations: string[];
}

const translations = {
  en: {
    title: 'Psychological Assessments',
    subtitle: 'Professional psychological tests to understand your mental health',
    takeTest: 'Take Test',
    retakeTest: 'Retake Test',
    viewResults: 'View Results',
    completed: 'Completed',
    inProgress: 'In Progress',
    notStarted: 'Not Started',
    question: 'Question',
    of: 'of',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit Test',
    results: 'Your Results',
    score: 'Score',
    recommendations: 'Recommendations',
    backToTests: 'Back to Tests'
  },
  es: {
    title: 'Evaluaciones Psicológicas',
    subtitle: 'Pruebas psicológicas profesionales para entender tu salud mental',
    takeTest: 'Tomar Prueba',
    retakeTest: 'Repetir Prueba',
    viewResults: 'Ver Resultados',
    completed: 'Completado',
    inProgress: 'En Progreso',
    notStarted: 'No Iniciado',
    question: 'Pregunta',
    of: 'de',
    next: 'Siguiente',
    previous: 'Anterior',
    submit: 'Enviar Prueba',
    results: 'Tus Resultados',
    score: 'Puntuación',
    recommendations: 'Recomendaciones',
    backToTests: 'Volver a Pruebas'
  },
  fr: {
    title: 'Évaluations Psychologiques',
    subtitle: 'Tests psychologiques professionnels pour comprendre votre santé mentale',
    takeTest: 'Passer le Test',
    retakeTest: 'Refaire le Test',
    viewResults: 'Voir Résultats',
    completed: 'Terminé',
    inProgress: 'En Cours',
    notStarted: 'Pas Commencé',
    question: 'Question',
    of: 'sur',
    next: 'Suivant',
    previous: 'Précédent',
    submit: 'Soumettre Test',
    results: 'Vos Résultats',
    score: 'Score',
    recommendations: 'Recommandations',
    backToTests: 'Retour aux Tests'
  },
  hi: {
    title: 'मनोवैज्ञानिक मूल्यांकन',
    subtitle: 'आपके मानसिक स्वास्थ्य को समझने के लिए पेशेवर मनोवैज्ञानिक परीक्षण',
    takeTest: 'परीक्षा लें',
    retakeTest: 'परीक्षा दोबारा लें',
    viewResults: 'परिणाम देखें',
    completed: 'पूर्ण',
    inProgress: 'प्रगति में',
    notStarted: 'शुरू नहीं हुआ',
    question: 'प्रश्न',
    of: 'का',
    next: 'अगला',
    previous: 'पिछला',
    submit: 'परीक्षा जमा करें',
    results: 'आपके परिणाम',
    score: 'स्कोर',
    recommendations: 'सिफारिशें',
    backToTests: 'परीक्षाओं पर वापस जाएं'
  }
};

const psychologicalTests = [
  {
    id: 'anxiety',
    name: 'Anxiety Assessment (GAD-7)',
    description: 'Generalized Anxiety Disorder 7-item scale to measure anxiety levels',
    icon: Brain,
    duration: '5-7 minutes',
    questions: [
      {
        id: 1,
        question: 'Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?',
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        category: 'anxiety'
      },
      {
        id: 2,
        question: 'Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?',
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        category: 'anxiety'
      },
      {
        id: 3,
        question: 'Over the last 2 weeks, how often have you been bothered by worrying too much about different things?',
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        category: 'anxiety'
      },
      {
        id: 4,
        question: 'Over the last 2 weeks, how often have you been bothered by trouble relaxing?',
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        category: 'anxiety'
      },
      {
        id: 5,
        question: 'Over the last 2 weeks, how often have you been bothered by being so restless that it is hard to sit still?',
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        category: 'anxiety'
      },
      {
        id: 6,
        question: 'Over the last 2 weeks, how often have you been bothered by becoming easily annoyed or irritable?',
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        category: 'anxiety'
      },
      {
        id: 7,
        question: 'Over the last 2 weeks, how often have you been bothered by feeling afraid, as if something awful might happen?',
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        category: 'anxiety'
      }
    ]
  },
  {
    id: 'depression',
    name: 'Depression Screening (PHQ-9)',
    description: 'Patient Health Questionnaire-9 for depression screening',
    icon: Heart,
    duration: '5-8 minutes',
    questions: [
      {
        id: 1,
        question: 'Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?',
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        category: 'depression'
      },
      {
        id: 2,
        question: 'Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?',
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        category: 'depression'
      },
      {
        id: 3,
        question: 'Over the last 2 weeks, how often have you been bothered by trouble falling or staying asleep, or sleeping too much?',
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        category: 'depression'
      },
      {
        id: 4,
        question: 'Over the last 2 weeks, how often have you been bothered by feeling tired or having little energy?',
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        category: 'depression'
      },
      {
        id: 5,
        question: 'Over the last 2 weeks, how often have you been bothered by poor appetite or overeating?',
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        category: 'depression'
      },
      {
        id: 6,
        question: 'Over the last 2 weeks, how often have you been bothered by feeling bad about yourself or that you are a failure?',
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        category: 'depression'
      },
      {
        id: 7,
        question: 'Over the last 2 weeks, how often have you been bothered by trouble concentrating on things?',
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        category: 'depression'
      },
      {
        id: 8,
        question: 'Over the last 2 weeks, how often have you been bothered by moving or speaking slowly or being fidgety?',
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        category: 'depression'
      },
      {
        id: 9,
        question: 'Over the last 2 weeks, how often have you been bothered by thoughts that you would be better off dead?',
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        category: 'depression'
      }
    ]
  },
  {
    id: 'stress',
    name: 'Stress Assessment (PSS-10)',
    description: 'Perceived Stress Scale to measure stress levels in various life situations',
    icon: Shield,
    duration: '4-6 minutes',
    questions: [
      {
        id: 1,
        question: 'In the last month, how often have you been upset because of something that happened unexpectedly?',
        options: ['Never', 'Almost never', 'Sometimes', 'Fairly often', 'Very often'],
        category: 'stress'
      },
      {
        id: 2,
        question: 'In the last month, how often have you felt that you were unable to control the important things in your life?',
        options: ['Never', 'Almost never', 'Sometimes', 'Fairly often', 'Very often'],
        category: 'stress'
      },
      {
        id: 3,
        question: 'In the last month, how often have you felt nervous and stressed?',
        options: ['Never', 'Almost never', 'Sometimes', 'Fairly often', 'Very often'],
        category: 'stress'
      },
      {
        id: 4,
        question: 'In the last month, how often have you felt confident about your ability to handle your personal problems?',
        options: ['Very often', 'Fairly often', 'Sometimes', 'Almost never', 'Never'],
        category: 'stress'
      },
      {
        id: 5,
        question: 'In the last month, how often have you felt that things were going your way?',
        options: ['Very often', 'Fairly often', 'Sometimes', 'Almost never', 'Never'],
        category: 'stress'
      },
      {
        id: 6,
        question: 'In the last month, how often have you found that you could not cope with all the things that you had to do?',
        options: ['Never', 'Almost never', 'Sometimes', 'Fairly often', 'Very often'],
        category: 'stress'
      },
      {
        id: 7,
        question: 'In the last month, how often have you been able to control irritations in your life?',
        options: ['Very often', 'Fairly often', 'Sometimes', 'Almost never', 'Never'],
        category: 'stress'
      },
      {
        id: 8,
        question: 'In the last month, how often have you felt that you were on top of things?',
        options: ['Very often', 'Fairly often', 'Sometimes', 'Almost never', 'Never'],
        category: 'stress'
      },
      {
        id: 9,
        question: 'In the last month, how often have you been angered because of things that happened that were outside of your control?',
        options: ['Never', 'Almost never', 'Sometimes', 'Fairly often', 'Very often'],
        category: 'stress'
      },
      {
        id: 10,
        question: 'In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?',
        options: ['Never', 'Almost never', 'Sometimes', 'Fairly often', 'Very often'],
        category: 'stress'
      }
    ]
  }
];

export function PsychologicalTests({ onNavigate, currentMood, selectedLanguage }: PsychologicalTestsProps) {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState<TestResult | null>(null);

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

  const currentTestData = psychologicalTests.find(test => test.id === selectedTest);

  const calculateResults = (testId: string, answers: { [key: number]: number }): TestResult => {
    const totalQuestions = currentTestData?.questions.length || 0;
    const maxScore = testId === 'stress' ? 40 : (totalQuestions * 3); // Stress test has 5 options (0-4), others have 4 options (0-3)
    const rawScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const percentage = (rawScore / maxScore) * 100;

    let category: string;
    let description: string;
    let recommendations: string[];

    if (testId === 'anxiety') {
      if (percentage <= 25) {
        category = 'Minimal Anxiety';
        description = 'Your anxiety levels appear to be within the normal range.';
        recommendations = [
          'Continue with healthy coping strategies',
          'Regular exercise and mindfulness practice',
          'Maintain good sleep hygiene'
        ];
      } else if (percentage <= 50) {
        category = 'Mild Anxiety';
        description = 'You may be experiencing mild anxiety symptoms.';
        recommendations = [
          'Practice relaxation techniques daily',
          'Consider talking to friends or family',
          'Monitor your stress levels'
        ];
      } else if (percentage <= 75) {
        category = 'Moderate Anxiety';
        description = 'You appear to be experiencing moderate anxiety symptoms.';
        recommendations = [
          'Consider speaking with a counselor',
          'Practice deep breathing exercises',
          'Limit caffeine and alcohol intake'
        ];
      } else {
        category = 'Severe Anxiety';
        description = 'You may be experiencing significant anxiety symptoms.';
        recommendations = [
          'Strongly recommend speaking with a mental health professional',
          'Consider counseling or therapy',
          'Practice grounding techniques'
        ];
      }
    } else if (testId === 'depression') {
      if (percentage <= 25) {
        category = 'Minimal Depression';
        description = 'Your mood appears to be within the normal range.';
        recommendations = [
          'Maintain healthy lifestyle habits',
          'Stay connected with friends and family',
          'Engage in activities you enjoy'
        ];
      } else if (percentage <= 50) {
        category = 'Mild Depression';
        description = 'You may be experiencing mild depression symptoms.';
        recommendations = [
          'Increase physical activity',
          'Practice self-care regularly',
          'Consider talking to someone you trust'
        ];
      } else if (percentage <= 75) {
        category = 'Moderate Depression';
        description = 'You appear to be experiencing moderate depression symptoms.';
        recommendations = [
          'Consider professional counseling',
          'Maintain a regular sleep schedule',
          'Practice gratitude and mindfulness'
        ];
      } else {
        category = 'Severe Depression';
        description = 'You may be experiencing significant depression symptoms.';
        recommendations = [
          'Strongly recommend speaking with a mental health professional',
          'Consider therapy or counseling',
          'Reach out to trusted friends or family'
        ];
      }
    } else { // stress
      if (percentage <= 25) {
        category = 'Low Stress';
        description = 'Your stress levels appear to be well-managed.';
        recommendations = [
          'Continue with current coping strategies',
          'Maintain work-life balance',
          'Keep up with healthy habits'
        ];
      } else if (percentage <= 50) {
        category = 'Moderate Stress';
        description = 'You may be experiencing moderate stress levels.';
        recommendations = [
          'Practice time management techniques',
          'Try stress-reduction activities',
          'Ensure adequate rest and relaxation'
        ];
      } else if (percentage <= 75) {
        category = 'High Stress';
        description = 'You appear to be experiencing high stress levels.';
        recommendations = [
          'Consider stress management counseling',
          'Practice regular meditation or yoga',
          'Evaluate and reduce stressors where possible'
        ];
      } else {
        category = 'Very High Stress';
        description = 'You may be experiencing very high stress levels.';
        recommendations = [
          'Strongly recommend speaking with a counselor',
          'Consider professional stress management programs',
          'Take immediate steps to reduce stress'
        ];
      }
    }

    return {
      score: Math.round(percentage),
      category,
      description,
      recommendations
    };
  };

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleNext = () => {
    if (currentQuestion < (currentTestData?.questions.length || 0) - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitTest = () => {
    if (selectedTest && currentTestData) {
      const results = calculateResults(selectedTest, answers);
      setTestResults(results);
      setShowResults(true);
    }
  };

  const resetTest = () => {
    setSelectedTest(null);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setTestResults(null);
  };

  if (showResults && testResults) {
    return (
      <div className="min-h-screen" style={{ background: `var(--mood-background)` }}>
        {/* Shared Sidebar */}
        <SharedSidebar 
          onNavigate={onNavigate}
          currentPage="tests"
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
          <Card className="p-8 bg-white/70 backdrop-blur-sm rounded-3xl border-0 shadow-xl">
            <div className="text-center space-y-6">
              {/* Results Header */}
              <div>
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ background: `var(--mood-gradient)` }}
                >
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl mb-2" style={{ color: `var(--mood-primary)` }}>
                  {t.results}
                </h2>
                <p className="text-gray-600">
                  {currentTestData?.name}
                </p>
              </div>

              {/* Score Circle */}
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <motion.path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    strokeDasharray={`${testResults.score}, 100`}
                    initial={{ strokeDasharray: "0, 100" }}
                    animate={{ strokeDasharray: `${testResults.score}, 100` }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--mood-primary)" />
                      <stop offset="100%" stopColor="var(--mood-secondary)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl" style={{ color: `var(--mood-primary)` }}>
                      {testResults.score}
                    </div>
                    <div className="text-xs text-gray-500">Score</div>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <Badge 
                  className="text-lg px-6 py-2"
                  style={{ 
                    background: `var(--mood-accent)`,
                    color: `var(--mood-primary)`
                  }}
                >
                  {testResults.category}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
                {testResults.description}
              </p>

              {/* Recommendations */}
              <div className="text-left max-w-2xl mx-auto">
                <h3 className="text-xl mb-4" style={{ color: `var(--mood-primary)` }}>
                  {t.recommendations}
                </h3>
                <div className="space-y-3">
                  {testResults.recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{rec}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={resetTest}
                  className="rounded-full px-8"
                >
                  {t.backToTests}
                </Button>
                <Button
                  onClick={() => onNavigate('appointments')}
                  className="rounded-full px-8 text-white"
                  style={{ background: `var(--mood-gradient)` }}
                >
                  Book Counseling Session
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
        </div>
      </div>
    );
  }

  if (selectedTest && currentTestData) {
    const currentQ = currentTestData.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / currentTestData.questions.length) * 100;

    return (
      <div className="min-h-screen" style={{ background: `var(--mood-background)` }}>
        {/* Shared Sidebar */}
        <SharedSidebar 
          onNavigate={onNavigate}
          currentPage="tests"
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
          {/* Test Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setShowSidebar(true)}
                className="lg:hidden rounded-full p-3"
                style={{ color: `var(--mood-primary)` }}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                onClick={resetTest}
                className="rounded-full p-3"
                style={{ color: `var(--mood-primary)` }}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {currentTestData.name}
                </h1>
                <p className="text-gray-600">
                  {t.question} {currentQuestion + 1} {t.of} {currentTestData.questions.length}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Progress value={progress} className="h-2" />
          </motion.div>

          {/* Question Card */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 bg-white/70 backdrop-blur-sm rounded-3xl border-0 shadow-xl">
              <div className="space-y-8">
                {/* Question */}
                <div className="text-center space-y-4">
                  <h2 className="text-xl leading-relaxed" style={{ color: `var(--mood-primary)` }}>
                    {currentQ.question}
                  </h2>
                </div>

                {/* Options */}
                <div className="space-y-4">
                  {currentQ.options.map((option, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Button
                        variant={answers[currentQ.id] === index ? 'default' : 'outline'}
                        onClick={() => handleAnswerSelect(currentQ.id, index)}
                        className={`w-full p-6 text-left justify-start rounded-2xl transition-all ${
                          answers[currentQ.id] === index 
                            ? 'text-white shadow-lg scale-105' 
                            : 'hover:scale-102'
                        }`}
                        style={{
                          background: answers[currentQ.id] === index ? `var(--mood-gradient)` : undefined
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div 
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              answers[currentQ.id] === index 
                                ? 'border-white' 
                                : 'border-gray-300'
                            }`}
                          >
                            {answers[currentQ.id] === index && (
                              <div className="w-3 h-3 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="text-base">{option}</span>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="rounded-full px-8"
                  >
                    {t.previous}
                  </Button>

                  {currentQuestion === currentTestData.questions.length - 1 ? (
                    <Button
                      onClick={handleSubmitTest}
                      disabled={answers[currentQ.id] === undefined}
                      className="rounded-full px-8 text-white"
                      style={{ background: `var(--mood-gradient)` }}
                    >
                      {t.submit}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      disabled={answers[currentQ.id] === undefined}
                      className="rounded-full px-8 text-white"
                      style={{ background: `var(--mood-gradient)` }}
                    >
                      {t.next}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
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
        currentPage="tests"
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
        </motion.div>

      {/* Tests Grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {psychologicalTests.map((test, index) => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="p-6 bg-white/70 backdrop-blur-sm rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all h-full">
              <div className="space-y-6">
                {/* Test Icon */}
                <div className="text-center">
                  <div 
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ background: `var(--mood-gradient)` }}
                  >
                    <test.icon className="w-8 h-8 text-white" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Professional Assessment
                  </Badge>
                </div>

                {/* Test Info */}
                <div className="text-center space-y-2">
                  <h3 className="text-xl" style={{ color: `var(--mood-primary)` }}>
                    {test.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {test.description}
                  </p>
                </div>

                {/* Test Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{test.duration}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>{test.questions.length} questions</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <BarChart3 className="w-4 h-4" />
                    <span>Instant results with recommendations</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => setSelectedTest(test.id)}
                  className="w-full rounded-2xl text-white"
                  style={{ background: `var(--mood-gradient)` }}
                >
                  {t.takeTest}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-12 max-w-4xl mx-auto"
      >
        <Card className="p-6 bg-yellow-50 border-yellow-200 rounded-2xl">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="mb-2">
                <strong>Important Disclaimer:</strong> These assessments are for educational and self-awareness purposes only. 
                They are not a substitute for professional diagnosis or treatment.
              </p>
              <p>
                If you are experiencing severe symptoms or thoughts of self-harm, please contact a mental health professional 
                or emergency services immediately.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
      </div>
    </div>
  );
}