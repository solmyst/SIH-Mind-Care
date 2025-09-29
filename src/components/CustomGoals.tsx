import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { SharedSidebar } from './SharedSidebar';
import { 
  ArrowLeft, 
  Plus, 
  Target, 
  Calendar, 
  CheckCircle,
  Circle,
  Edit3,
  Trash2,
  Star,
  TrendingUp,
  BookOpen,
  Heart,
  Zap,
  Menu
} from 'lucide-react';
import type { MoodType, PageType } from '../App';

interface CustomGoalsProps {
  onNavigate: (page: PageType) => void;
  currentMood: MoodType;
  selectedLanguage: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'wellness' | 'academic' | 'personal' | 'social';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Date;
  notes: string[];
}

const translations = {
  en: {
    title: 'Custom Goals',
    subtitle: 'Set and track your personal wellness and life goals',
    addGoal: 'Add New Goal',
    editGoal: 'Edit Goal',
    goalTitle: 'Goal Title',
    description: 'Description',
    category: 'Category',
    targetValue: 'Target',
    currentValue: 'Current',
    unit: 'Unit',
    deadline: 'Deadline',
    priority: 'Priority',
    notes: 'Notes',
    saveGoal: 'Save Goal',
    updateGoal: 'Update Goal',
    deleteGoal: 'Delete Goal',
    markComplete: 'Mark Complete',
    addNote: 'Add Note',
    progress: 'Progress',
    wellness: 'Wellness',
    academic: 'Academic',
    personal: 'Personal',
    social: 'Social',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    completed: 'Completed',
    inProgress: 'In Progress',
    overdue: 'Overdue'
  },
  es: {
    title: 'Objetivos Personalizados',
    subtitle: 'Establece y rastrea tus objetivos personales de bienestar y vida',
    addGoal: 'Agregar Nuevo Objetivo',
    editGoal: 'Editar Objetivo',
    goalTitle: 'Título del Objetivo',
    description: 'Descripción',
    category: 'Categoría',
    targetValue: 'Meta',
    currentValue: 'Actual',
    unit: 'Unidad',
    deadline: 'Fecha Límite',
    priority: 'Prioridad',
    notes: 'Notas',
    saveGoal: 'Guardar Objetivo',
    updateGoal: 'Actualizar Objetivo',
    deleteGoal: 'Eliminar Objetivo',
    markComplete: 'Marcar Completado',
    addNote: 'Agregar Nota',
    progress: 'Progreso',
    wellness: 'Bienestar',
    academic: 'Académico',
    personal: 'Personal',
    social: 'Social',
    low: 'Bajo',
    medium: 'Medio',
    high: 'Alto',
    completed: 'Completado',
    inProgress: 'En Progreso',
    overdue: 'Vencido'
  },
  fr: {
    title: 'Objectifs Personnalisés',
    subtitle: 'Définissez et suivez vos objectifs personnels de bien-être et de vie',
    addGoal: 'Ajouter Nouvel Objectif',
    editGoal: 'Modifier Objectif',
    goalTitle: 'Titre de l\'Objectif',
    description: 'Description',
    category: 'Catégorie',
    targetValue: 'Cible',
    currentValue: 'Actuel',
    unit: 'Unité',
    deadline: 'Date Limite',
    priority: 'Priorité',
    notes: 'Notes',
    saveGoal: 'Sauvegarder Objectif',
    updateGoal: 'Mettre à Jour Objectif',
    deleteGoal: 'Supprimer Objectif',
    markComplete: 'Marquer Terminé',
    addNote: 'Ajouter Note',
    progress: 'Progrès',
    wellness: 'Bien-être',
    academic: 'Académique',
    personal: 'Personnel',
    social: 'Social',
    low: 'Faible',
    medium: 'Moyen',
    high: 'Élevé',
    completed: 'Terminé',
    inProgress: 'En Cours',
    overdue: 'En Retard'
  },
  hi: {
    title: 'कस्टम लक्ष्य',
    subtitle: 'अपने व्यक्तिगत कल्याण और जीवन लक्ष्य निर्धारित करें और ट्रैक करें',
    addGoal: 'नया लक्ष्य जोड़ें',
    editGoal: 'लक्ष्य संपादित करें',
    goalTitle: 'लक्ष्य शीर्षक',
    description: 'विवरण',
    category: 'श्रेणी',
    targetValue: 'लक्ष्य',
    currentValue: 'वर्तमान',
    unit: 'इकाई',
    deadline: 'समय सीमा',
    priority: 'प्राथमिकता',
    notes: 'नोट्स',
    saveGoal: 'लक्ष्य सहेजें',
    updateGoal: 'लक्ष्य अपडेट करें',
    deleteGoal: 'लक्ष्य हटाएं',
    markComplete: 'पूर्ण चिह्नित करें',
    addNote: 'नोट जोड़ें',
    progress: 'प्रगति',
    wellness: 'कल्याण',
    academic: 'शैक्षणिक',
    personal: 'व्यक्तिगत',
    social: 'सामाजिक',
    low: 'कम',
    medium: 'मध्यम',
    high: 'उच्च',
    completed: 'पूर्ण',
    inProgress: 'प्रगति में',
    overdue: 'समय सीमा समाप्त'
  }
};

const categoryIcons = {
  wellness: Heart,
  academic: BookOpen,
  personal: Star,
  social: TrendingUp
};

const categoryColors = {
  wellness: 'rgb(34, 197, 94)',
  academic: 'rgb(59, 130, 246)',
  personal: 'rgb(168, 85, 247)',
  social: 'rgb(249, 115, 22)'
};

export function CustomGoals({ onNavigate, currentMood, selectedLanguage }: CustomGoalsProps) {
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newNote, setNewNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  
  const [goalForm, setGoalForm] = useState({
    title: '',
    description: '',
    category: 'wellness' as Goal['category'],
    targetValue: 10,
    currentValue: 0,
    unit: 'days',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    priority: 'medium' as Goal['priority']
  });

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Daily Meditation Practice',
      description: 'Meditate for at least 10 minutes every day to improve mental clarity and reduce stress',
      category: 'wellness',
      targetValue: 30,
      currentValue: 12,
      unit: 'days',
      deadline: new Date('2024-04-01'),
      priority: 'high',
      completed: false,
      createdAt: new Date('2024-03-01'),
      notes: [
        'Started with 5-minute sessions',
        'Using guided meditation app',
        'Feeling more focused during study sessions'
      ]
    },
    {
      id: '2',
      title: 'Complete Research Project',
      description: 'Finish the semester research project on mental health interventions',
      category: 'academic',
      targetValue: 100,
      currentValue: 65,
      unit: 'percent',
      deadline: new Date('2024-03-25'),
      priority: 'high',
      completed: false,
      createdAt: new Date('2024-02-15'),
      notes: [
        'Literature review completed',
        'Data collection in progress',
        'Need to start writing methodology section'
      ]
    },
    {
      id: '3',
      title: 'Read Self-Help Books',
      description: 'Read 5 books about personal development and mental wellness',
      category: 'personal',
      targetValue: 5,
      currentValue: 2,
      unit: 'books',
      deadline: new Date('2024-06-01'),
      priority: 'medium',
      completed: false,
      createdAt: new Date('2024-01-01'),
      notes: [
        'Finished "Atomic Habits"',
        'Currently reading "The Power of Now"'
      ]
    }
  ]);

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

  const handleSaveGoal = () => {
    const newGoal: Goal = {
      id: editingGoal?.id || Date.now().toString(),
      ...goalForm,
      completed: false,
      createdAt: editingGoal?.createdAt || new Date(),
      notes: editingGoal?.notes || []
    };

    if (editingGoal) {
      setGoals(prev => prev.map(goal => goal.id === editingGoal.id ? newGoal : goal));
    } else {
      setGoals(prev => [...prev, newGoal]);
    }

    resetForm();
  };

  const resetForm = () => {
    setGoalForm({
      title: '',
      description: '',
      category: 'wellness',
      targetValue: 10,
      currentValue: 0,
      unit: 'days',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      priority: 'medium'
    });
    setShowGoalForm(false);
    setEditingGoal(null);
  };

  const handleEditGoal = (goal: Goal) => {
    setGoalForm({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      targetValue: goal.targetValue,
      currentValue: goal.currentValue,
      unit: goal.unit,
      deadline: goal.deadline,
      priority: goal.priority
    });
    setEditingGoal(goal);
    setShowGoalForm(true);
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  const toggleGoalComplete = (goalId: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, completed: !goal.completed, currentValue: goal.completed ? goal.currentValue : goal.targetValue }
        : goal
    ));
  };

  const updateGoalProgress = (goalId: string, newValue: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, currentValue: Math.min(newValue, goal.targetValue) }
        : goal
    ));
  };

  const addNoteToGoal = (goalId: string, note: string) => {
    if (!note.trim()) return;
    
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, notes: [...goal.notes, note] }
        : goal
    ));
    setNewNote('');
  };

  const filteredGoals = selectedCategory === 'all' 
    ? goals 
    : goals.filter(goal => goal.category === selectedCategory);

  const getGoalStatus = (goal: Goal) => {
    if (goal.completed) return 'completed';
    if (new Date() > goal.deadline) return 'overdue';
    return 'inProgress';
  };

  const getProgressPercentage = (goal: Goal) => {
    return Math.round((goal.currentValue / goal.targetValue) * 100);
  };

  return (
    <div className="min-h-screen" style={{ background: `var(--mood-background)` }}>
      {/* Shared Sidebar */}
      <SharedSidebar 
        onNavigate={onNavigate}
        currentPage="goals"
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
          onClick={() => setShowGoalForm(true)}
          className="rounded-full px-6 text-white"
          style={{ background: `var(--mood-gradient)` }}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t.addGoal}
        </Button>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
            className="rounded-full"
            style={{
              background: selectedCategory === 'all' ? `var(--mood-gradient)` : undefined,
              color: selectedCategory === 'all' ? 'white' : undefined
            }}
          >
            All Goals
          </Button>
          {Object.entries(categoryIcons).map(([category, Icon]) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
              style={{
                background: selectedCategory === category ? categoryColors[category as keyof typeof categoryColors] : undefined,
                color: selectedCategory === category ? 'white' : undefined
              }}
            >
              <Icon className="w-4 h-4 mr-2" />
              {t[category as keyof typeof t] as string}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Goals Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredGoals.map((goal, index) => {
            const CategoryIcon = categoryIcons[goal.category];
            const status = getGoalStatus(goal);
            const progress = getProgressPercentage(goal);
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                layout
              >
                <Card className={`p-6 bg-white/70 backdrop-blur-sm rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all ${
                  goal.completed ? 'opacity-75' : ''
                }`}>
                  <div className="space-y-4">
                    {/* Goal Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ background: `${categoryColors[goal.category]}20` }}
                        >
                          <CategoryIcon 
                            className="w-5 h-5" 
                            style={{ color: categoryColors[goal.category] }}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 
                            className={`text-lg mb-1 ${goal.completed ? 'line-through' : ''}`}
                            style={{ color: `var(--mood-primary)` }}
                          >
                            {goal.title}
                          </h3>
                          <p className="text-gray-600 text-sm">{goal.description}</p>
                          
                          <div className="flex items-center gap-4 mt-2 text-xs">
                            <Badge 
                              variant="outline"
                              className="capitalize"
                              style={{ 
                                borderColor: categoryColors[goal.category],
                                color: categoryColors[goal.category]
                              }}
                            >
                              {t[goal.category as keyof typeof t] as string}
                            </Badge>
                            
                            <Badge 
                              variant={goal.priority === 'high' ? 'destructive' : goal.priority === 'medium' ? 'default' : 'secondary'}
                              className="capitalize"
                            >
                              {t[goal.priority as keyof typeof t] as string}
                            </Badge>
                            
                            <Badge 
                              variant={status === 'completed' ? 'default' : status === 'overdue' ? 'destructive' : 'secondary'}
                              className="capitalize"
                              style={{
                                background: status === 'completed' ? '#10B981' : undefined,
                                color: status === 'completed' ? 'white' : undefined
                              }}
                            >
                              {t[status as keyof typeof t] as string}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditGoal(goal)}
                          className="rounded-full p-2"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="rounded-full p-2 text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{t.progress}</span>
                        <span style={{ color: `var(--mood-primary)` }}>
                          {goal.currentValue} / {goal.targetValue} {goal.unit}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="0"
                          max={goal.targetValue}
                          value={goal.currentValue}
                          onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value) || 0)}
                          className="w-20 h-8 text-xs"
                          disabled={goal.completed}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleGoalComplete(goal.id)}
                          className="text-xs px-3"
                        >
                          {goal.completed ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <Circle className="w-3 h-3 mr-1" />
                          )}
                          {goal.completed ? 'Completed' : t.markComplete}
                        </Button>
                      </div>
                    </div>

                    {/* Deadline */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {goal.deadline.toLocaleDateString()}</span>
                      {new Date() > goal.deadline && !goal.completed && (
                        <Badge variant="destructive" className="text-xs ml-2">
                          {t.overdue}
                        </Badge>
                      )}
                    </div>

                    {/* Notes */}
                    {goal.notes.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">{t.notes}:</p>
                        <div className="space-y-1">
                          {goal.notes.slice(-2).map((note, noteIndex) => (
                            <div key={noteIndex} className="text-xs p-2 bg-gray-50 rounded-lg">
                              {note}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add Note */}
                    <div className="flex gap-2">
                      <Input
                        placeholder={t.addNote}
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="flex-1 h-8 text-xs"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addNoteToGoal(goal.id, newNote);
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addNoteToGoal(goal.id, newNote)}
                        className="px-3"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Goal Form Modal */}
      <AnimatePresence>
        {showGoalForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={() => !editingGoal && resetForm()}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="space-y-6">
                <h2 className="text-2xl" style={{ color: `var(--mood-primary)` }}>
                  {editingGoal ? t.editGoal : t.addGoal}
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-sm mb-2 block">{t.goalTitle}</label>
                    <Input
                      value={goalForm.title}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter your goal title..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm mb-2 block">{t.description}</label>
                    <Textarea
                      value={goalForm.description}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your goal in detail..."
                      className="min-h-20"
                    />
                  </div>

                  <div>
                    <label className="text-sm mb-2 block">{t.category}</label>
                    <select
                      value={goalForm.category}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, category: e.target.value as Goal['category'] }))}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ '--tw-ring-color': `var(--mood-primary)` } as any}
                    >
                      <option value="wellness">{t.wellness}</option>
                      <option value="academic">{t.academic}</option>
                      <option value="personal">{t.personal}</option>
                      <option value="social">{t.social}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm mb-2 block">{t.priority}</label>
                    <select
                      value={goalForm.priority}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, priority: e.target.value as Goal['priority'] }))}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ '--tw-ring-color': `var(--mood-primary)` } as any}
                    >
                      <option value="low">{t.low}</option>
                      <option value="medium">{t.medium}</option>
                      <option value="high">{t.high}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm mb-2 block">{t.targetValue}</label>
                    <Input
                      type="number"
                      min="1"
                      value={goalForm.targetValue}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, targetValue: parseInt(e.target.value) || 1 }))}
                    />
                  </div>

                  <div>
                    <label className="text-sm mb-2 block">{t.unit}</label>
                    <Input
                      value={goalForm.unit}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, unit: e.target.value }))}
                      placeholder="e.g., days, books, hours..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm mb-2 block">{t.deadline}</label>
                    <Input
                      type="date"
                      value={goalForm.deadline.toISOString().split('T')[0]}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, deadline: new Date(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    className="flex-1 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveGoal}
                    disabled={!goalForm.title || !goalForm.description}
                    className="flex-1 rounded-xl text-white"
                    style={{ background: `var(--mood-gradient)` }}
                  >
                    {editingGoal ? t.updateGoal : t.saveGoal}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {filteredGoals.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="p-12 bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-lg text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl mb-2" style={{ color: `var(--mood-primary)` }}>
              No goals found
            </h3>
            <p className="text-gray-600 mb-6">
              {selectedCategory === 'all' 
                ? 'Start setting your personal goals to track your progress'
                : `No ${selectedCategory} goals found. Create one to get started!`
              }
            </p>
            <Button
              onClick={() => setShowGoalForm(true)}
              className="rounded-full px-8 text-white"
              style={{ background: `var(--mood-gradient)` }}
            >
              <Target className="w-4 h-4 mr-2" />
              {t.addGoal}
            </Button>
          </Card>
        </motion.div>
      )}
      </div>
    </div>
  );
}