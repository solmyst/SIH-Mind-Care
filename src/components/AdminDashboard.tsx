import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Brain, 
  AlertTriangle,
  Calendar,
  BarChart3,
  Activity,
  Download,
  Filter,
  Eye,
  Shield
} from 'lucide-react';
import type { MoodType, PageType } from '../App';

interface AdminDashboardProps {
  onNavigate: (page: PageType) => void;
  currentMood: MoodType;
}

export function AdminDashboard({ onNavigate, currentMood }: AdminDashboardProps) {
  const weeklyStats = [
    { day: 'Mon', engagement: 85, stress: 45, wellbeing: 72 },
    { day: 'Tue', engagement: 78, stress: 52, wellbeing: 68 },
    { day: 'Wed', engagement: 92, stress: 38, wellbeing: 81 },
    { day: 'Thu', engagement: 88, stress: 42, wellbeing: 75 },
    { day: 'Fri', engagement: 95, stress: 61, wellbeing: 70 },
    { day: 'Sat', engagement: 73, stress: 35, wellbeing: 89 },
    { day: 'Sun', engagement: 67, stress: 28, wellbeing: 93 }
  ];

  const moodTrends = [
    { mood: 'happy', percentage: 28, change: '+5%', color: 'rgb(255, 193, 7)' },
    { mood: 'calm', percentage: 35, change: '+2%', color: 'rgb(33, 150, 243)' },
    { mood: 'stressed', percentage: 18, change: '-3%', color: 'rgb(255, 138, 128)' },
    { mood: 'anxious', percentage: 12, change: '-1%', color: 'rgb(76, 175, 80)' },
    { mood: 'sad', percentage: 7, change: '-2%', color: 'rgb(103, 58, 183)' }
  ];

  const alertItems = [
    {
      id: 1,
      type: 'stress_spike',
      message: 'Stress levels increased 15% this week',
      priority: 'high',
      timestamp: '2 hours ago',
      department: 'Engineering'
    },
    {
      id: 2,
      type: 'low_engagement',
      message: 'Wellness app usage down 8% in Arts department',
      priority: 'medium',
      timestamp: '5 hours ago',
      department: 'Arts & Humanities'
    },
    {
      id: 3,
      type: 'positive_trend',
      message: 'Meditation session completion up 22%',
      priority: 'low',
      timestamp: '1 day ago',
      department: 'Campus-wide'
    }
  ];

  const departmentData = [
    { name: 'Engineering', students: 2847, wellnessScore: 72, participation: 84 },
    { name: 'Business', students: 1923, wellnessScore: 78, participation: 91 },
    { name: 'Arts & Humanities', students: 1456, wellnessScore: 81, participation: 76 },
    { name: 'Sciences', students: 2134, wellnessScore: 69, participation: 88 },
    { name: 'Medicine', students: 892, wellnessScore: 65, participation: 95 }
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-50">
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
            onClick={() => onNavigate('landing')}
            className="rounded-full p-3"
            style={{ color: `var(--mood-primary)` }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl" style={{ color: `var(--mood-primary)` }}>
              Institution Dashboard
            </h1>
            <p className="text-gray-600">
              Anonymous wellness analytics and insights for campus mental health
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-full"
            style={{ borderColor: `var(--mood-primary)`, color: `var(--mood-primary)` }}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button
            variant="outline"
            className="rounded-full"
            style={{ borderColor: `var(--mood-primary)`, color: `var(--mood-primary)` }}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </motion.div>

      {/* Privacy Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-6"
      >
        <Card className="p-4 bg-green-50 border-green-200 rounded-2xl">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-600" />
            <div className="flex-1">
              <p className="text-green-800 text-sm">
                <strong>Privacy Protected:</strong> All data is anonymized and aggregated. 
                Individual student information is never accessible to maintain complete confidentiality.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {[
          {
            title: 'Active Students',
            value: '8,247',
            change: '+12%',
            changeType: 'increase',
            icon: Users,
            color: 'rgb(34, 197, 94)'
          },
          {
            title: 'Wellness Score',
            value: '74.2',
            change: '+3.1',
            changeType: 'increase',
            icon: Brain,
            color: 'rgb(59, 130, 246)'
          },
          {
            title: 'Daily Engagement',
            value: '85%',
            change: '+5%',
            changeType: 'increase',
            icon: Activity,
            color: 'rgb(168, 85, 247)'
          },
          {
            title: 'Stress Alerts',
            value: '23',
            change: '-8',
            changeType: 'decrease',
            icon: AlertTriangle,
            color: 'rgb(249, 115, 22)'
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: `${metric.color}20` }}
                >
                  <metric.icon className="w-6 h-6" style={{ color: metric.color }} />
                </div>
                <div className={`text-sm px-2 py-1 rounded-full ${
                  metric.changeType === 'increase' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {metric.change}
                </div>
              </div>
              <div>
                <h3 className="text-2xl mb-1" style={{ color: metric.color }}>
                  {metric.value}
                </h3>
                <p className="text-gray-600 text-sm">{metric.title}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Charts */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Weekly Trends */}
          <Card className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl" style={{ color: `var(--mood-primary)` }}>
                Weekly Wellness Trends
              </h3>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-gray-600">Engagement</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="text-gray-600">Stress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-gray-600">Wellbeing</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {weeklyStats.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 w-12">{day.day}</span>
                    <div className="flex gap-4 text-xs">
                      <span className="text-blue-600">{day.engagement}%</span>
                      <span className="text-red-500">{day.stress}%</span>
                      <span className="text-green-600">{day.wellbeing}%</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${day.engagement}%` }}
                        transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                      />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-red-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${day.stress}%` }}
                        transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                      />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-green-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${day.wellbeing}%` }}
                        transition={{ duration: 1, delay: 0.4 + index * 0.1 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Department Breakdown */}
          <Card className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-lg">
            <h3 className="text-xl mb-6" style={{ color: `var(--mood-primary)` }}>
              Department Insights
            </h3>
            
            <div className="space-y-4">
              {departmentData.map((dept, index) => (
                <motion.div
                  key={dept.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm" style={{ color: `var(--mood-primary)` }}>
                        {dept.name}
                      </h4>
                      <p className="text-xs text-gray-500">{dept.students} students</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm" style={{ color: `var(--mood-primary)` }}>
                        Score: {dept.wellnessScore}
                      </div>
                      <div className="text-xs text-gray-500">
                        {dept.participation}% participation
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Progress value={dept.wellnessScore} className="h-1.5" />
                    <Progress value={dept.participation} className="h-1.5" />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Right Column - Alerts & Mood */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Mood Distribution */}
          <Card className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-lg">
            <h3 className="text-xl mb-6" style={{ color: `var(--mood-primary)` }}>
              Mood Distribution
            </h3>
            
            <div className="space-y-4">
              {moodTrends.map((mood, index) => (
                <motion.div
                  key={mood.mood}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ background: mood.color }}
                      />
                      <span className="text-sm capitalize text-gray-700">
                        {mood.mood}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm" style={{ color: mood.color }}>
                        {mood.percentage}%
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        mood.change.startsWith('+') 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {mood.change}
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="h-2 rounded-full"
                      style={{ background: mood.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${mood.percentage}%` }}
                      transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Alerts */}
          <Card className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl" style={{ color: `var(--mood-primary)` }}>
                Wellness Alerts
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                style={{ color: `var(--mood-primary)` }}
              >
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {alertItems.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`p-4 rounded-xl border-l-4 ${
                    alert.priority === 'high' 
                      ? 'bg-red-50 border-red-400' 
                      : alert.priority === 'medium'
                      ? 'bg-yellow-50 border-yellow-400'
                      : 'bg-green-50 border-green-400'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full uppercase tracking-wide ${
                        alert.priority === 'high' 
                          ? 'bg-red-200 text-red-800' 
                          : alert.priority === 'medium'
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-green-200 text-green-800'
                      }`}>
                        {alert.priority}
                      </span>
                      <span className="text-xs text-gray-500">{alert.timestamp}</span>
                    </div>
                    
                    <p className="text-sm text-gray-700">{alert.message}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{alert.department}</span>
                      <Button variant="ghost" size="sm" className="text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-lg">
            <h3 className="text-lg mb-4" style={{ color: `var(--mood-primary)` }}>
              Quick Actions
            </h3>
            
            <div className="space-y-3">
              {[
                { label: 'Schedule Wellness Campaign', icon: Calendar },
                { label: 'View Detailed Analytics', icon: BarChart3 },
                { label: 'Export Monthly Report', icon: Download },
                { label: 'Configure Alerts', icon: AlertTriangle }
              ].map((action, index) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="w-full flex items-center gap-3 p-3 text-left rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <action.icon className="w-4 h-4" style={{ color: `var(--mood-primary)` }} />
                  <span className="text-sm text-gray-700">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}