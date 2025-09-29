import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { SharedSidebar } from './SharedSidebar';
import { 
  ArrowLeft, 
  MessageCircle, 
  Users, 
  Heart, 
  Star,
  Send,
  Mic,
  Shield,
  Volume2,
  ThumbsUp,
  Reply,
  MoreHorizontal,
  Menu,
  Plus,
  X,
  Edit3,
  Image as ImageIcon,
  Smile
} from 'lucide-react';
import type { MoodType, PageType } from '../App';

interface PeerSupportProps {
  onNavigate: (page: PageType) => void;
  currentMood: MoodType;
}

interface ForumPost {
  id: string;
  author: string;
  avatar: string;
  badge: string;
  timeAgo: string;
  title: string;
  content: string;
  mood: MoodType;
  likes: number;
  replies: number;
  isLiked: boolean;
  isAnonymous: boolean;
}

interface ChatMessage {
  id: string;
  author: string;
  avatar: string;
  message: string;
  timeAgo: string;
  isMe: boolean;
  mood?: MoodType;
}

export function PeerSupport({ onNavigate, currentMood }: PeerSupportProps) {
  const [activeTab, setActiveTab] = useState<'forum' | 'groups'>('forum');
  const [newMessage, setNewMessage] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showGuidelines, setShowGuidelines] = useState(true);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodType>(currentMood);

  const forumPosts: ForumPost[] = [
    {
      id: '1',
      author: 'Anonymous Helper',
      avatar: '🌟',
      badge: 'Supporter',
      timeAgo: '2 hours ago',
      title: 'Tips for managing exam stress',
      content: 'I wanted to share some techniques that really helped me during finals week. Breaking down study sessions into 25-minute chunks and taking regular breaks made such a difference...',
      mood: 'stressed',
      likes: 23,
      replies: 8,
      isLiked: false,
      isAnonymous: true
    },
    {
      id: '2',
      author: 'Study Buddy',
      avatar: '📚',
      badge: 'Mentor',
      timeAgo: '4 hours ago',
      title: 'Feeling overwhelmed with assignments',
      content: 'Anyone else feeling like there are not enough hours in the day? Looking for study partners or just someone to talk to...',
      mood: 'anxious',
      likes: 15,
      replies: 12,
      isLiked: true,
      isAnonymous: true
    },
    {
      id: '3',
      author: 'Mindful Student',
      avatar: '🧘',
      badge: 'Wellness Advocate',
      timeAgo: '6 hours ago',
      title: 'Meditation success story',
      content: 'Just wanted to share that I\'ve been doing daily meditation for 2 weeks now and it\'s really helping with my anxiety. Small steps make a big difference!',
      mood: 'calm',
      likes: 31,
      replies: 5,
      isLiked: false,
      isAnonymous: true
    }
  ];

  const groupChats: ChatMessage[] = [
    {
      id: '1',
      author: 'Alex',
      avatar: '🌸',
      message: 'Hope everyone is having a good day! Remember to take breaks 💙',
      timeAgo: '5 min ago',
      isMe: false,
      mood: 'happy'
    },
    {
      id: '2',
      author: 'You',
      avatar: '😊',
      message: 'Thanks Alex! Just finished a meditation session',
      timeAgo: '3 min ago',
      isMe: true,
      mood: currentMood
    },
    {
      id: '3',
      author: 'Jordan',
      avatar: '🌱',
      message: 'That\'s awesome! I should try that too',
      timeAgo: '1 min ago',
      isMe: false,
      mood: 'calm'
    }
  ];

  const badges = [
    { name: 'Helper', count: 25, color: 'bg-blue-100 text-blue-800' },
    { name: 'Supporter', count: 18, color: 'bg-green-100 text-green-800' },
    { name: 'Mentor', count: 12, color: 'bg-purple-100 text-purple-800' },
    { name: 'Wellness Advocate', count: 8, color: 'bg-pink-100 text-pink-800' }
  ];

  const moodOptions: { mood: MoodType; emoji: string; label: string }[] = [
    { mood: 'happy', emoji: '😊', label: 'Happy' },
    { mood: 'calm', emoji: '😌', label: 'Calm' },
    { mood: 'neutral', emoji: '😐', label: 'Neutral' },
    { mood: 'anxious', emoji: '😰', label: 'Anxious' },
    { mood: 'sad', emoji: '😢', label: 'Sad' },
    { mood: 'stressed', emoji: '😫', label: 'Stressed' },
  ];

  const handleCreatePost = () => {
    if (newPostTitle.trim() && newPostContent.trim()) {
      // Here you would normally submit the post to a backend
      console.log('Creating post:', { title: newPostTitle, content: newPostContent, mood: selectedMood });
      setNewPostTitle('');
      setNewPostContent('');
      setShowNewPost(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: `var(--mood-background)` }}>
      {/* Shared Sidebar */}
      <SharedSidebar 
        onNavigate={onNavigate}
        currentPage="peer-support"
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
                  Peer Support
                </h1>
                <p className="text-gray-600">
                  Connect with fellow students in a safe, anonymous space
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-600">Anonymous & Safe</span>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Safety Notice - Dismissible */}
          {showGuidelines && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <Card className="p-4 bg-blue-50 border-blue-200 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-blue-800 text-sm">
                      <strong>Safe Space Guidelines:</strong> All interactions are anonymous. Be kind, supportive, and respectful. 
                      If you're in crisis, please contact emergency services or campus counseling.
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowGuidelines(false)}
                    className="text-blue-600 hover:bg-blue-100 rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <div className="flex gap-2 p-1 bg-white/70 backdrop-blur-sm rounded-2xl border">
              {[
                { id: 'forum', label: 'Forum', icon: MessageCircle },
                { id: 'groups', label: 'Group Chat', icon: Users }
              ].map(tab => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 rounded-xl transition-all ${
                    activeTab === tab.id 
                      ? 'text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-white/50'
                  }`}
                  style={{ 
                    background: activeTab === tab.id ? `var(--mood-gradient)` : undefined 
                  }}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'forum' && (
              <motion.div
                key="forum"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* New Post Button */}
                <div className="flex justify-between items-center">
                  <h2 className="text-xl" style={{ color: `var(--mood-primary)` }}>
                    Community Forum
                  </h2>
                  <Button
                    onClick={() => setShowNewPost(true)}
                    className="rounded-full"
                    style={{ background: `var(--mood-gradient)`, color: 'white' }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Post
                  </Button>
                </div>

                {/* New Post Modal */}
                {showNewPost && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
                    onClick={() => setShowNewPost(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto"
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl" style={{ color: `var(--mood-primary)` }}>
                            Create New Post
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowNewPost(false)}
                            className="rounded-full p-2"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Post Title
                            </label>
                            <Input
                              value={newPostTitle}
                              onChange={(e) => setNewPostTitle(e.target.value)}
                              placeholder="What would you like to discuss?"
                              className="w-full"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Your Message
                            </label>
                            <Textarea
                              value={newPostContent}
                              onChange={(e) => setNewPostContent(e.target.value)}
                              placeholder="Share your thoughts, experiences, or ask for support..."
                              className="min-h-32 resize-none"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Current Mood
                            </label>
                            <div className="flex gap-2 flex-wrap">
                              {moodOptions.map((option) => (
                                <button
                                  key={option.mood}
                                  onClick={() => setSelectedMood(option.mood)}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-all ${
                                    selectedMood === option.mood
                                      ? 'text-white shadow-lg'
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }`}
                                  style={selectedMood === option.mood ? { 
                                    background: `var(--mood-gradient)` 
                                  } : {}}
                                >
                                  <span>{option.emoji}</span>
                                  <span>{option.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button
                            onClick={() => setShowNewPost(false)}
                            variant="outline"
                            className="flex-1 rounded-full"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleCreatePost}
                            disabled={!newPostTitle.trim() || !newPostContent.trim()}
                            className="flex-1 rounded-full text-white"
                            style={{ background: `var(--mood-gradient)` }}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Post
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Forum Posts */}
                <div className="space-y-4">
                  {forumPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="space-y-4">
                          {/* Post Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                                {post.avatar}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-700">{post.author}</span>
                                  <Badge className={badges.find(b => b.name === post.badge)?.color}>
                                    {post.badge}
                                  </Badge>
                                </div>
                                <span className="text-xs text-gray-500">{post.timeAgo}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div 
                                className="px-3 py-1 rounded-full text-xs capitalize"
                                style={{ 
                                  background: `var(--mood-accent)`, 
                                  color: `var(--mood-primary)` 
                                }}
                              >
                                {post.mood}
                              </div>
                              <Button variant="ghost" size="sm" className="rounded-full p-2">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Post Content */}
                          <div>
                            <h3 className="text-lg mb-2" style={{ color: `var(--mood-primary)` }}>
                              {post.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {post.content}
                            </p>
                          </div>

                          {/* Post Actions */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-4">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className={`flex items-center gap-2 rounded-full ${
                                  post.isLiked ? 'text-red-500' : 'text-gray-500'
                                }`}
                              >
                                <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                                {post.likes}
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="flex items-center gap-2 text-gray-500 rounded-full"
                              >
                                <Reply className="w-4 h-4" />
                                {post.replies}
                              </Button>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full text-xs"
                              style={{ borderColor: `var(--mood-primary)`, color: `var(--mood-primary)` }}
                            >
                              View Discussion
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'groups' && (
              <motion.div
                key="groups"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <h2 className="text-xl" style={{ color: `var(--mood-primary)` }}>
                  Group Chat - Daily Support Circle
                </h2>

                {/* Chat Messages */}
                <Card className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-lg h-96 flex flex-col">
                  <div className="flex-1 space-y-4 overflow-y-auto mb-4">
                    {groupChats.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex gap-3 ${message.isMe ? 'flex-row-reverse' : ''}`}
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm flex-shrink-0">
                          {message.avatar}
                        </div>
                        <div className={`max-w-xs ${message.isMe ? 'text-right' : ''}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-500">
                              {message.isMe ? 'You' : message.author}
                            </span>
                            <span className="text-xs text-gray-400">{message.timeAgo}</span>
                          </div>
                          <div 
                            className={`p-3 rounded-2xl text-sm ${
                              message.isMe 
                                ? 'text-white' 
                                : 'bg-gray-100 text-gray-700'
                            }`}
                            style={{ 
                              background: message.isMe ? `var(--mood-gradient)` : undefined 
                            }}
                          >
                            {message.message}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="flex gap-3 border-t border-gray-200 pt-4">
                    <input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Share your thoughts..."
                      className="flex-1 p-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ '--tw-ring-color': `var(--mood-primary)` } as any}
                    />
                    <Button
                      className="rounded-full p-3"
                      style={{ background: `var(--mood-gradient)` }}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>

                {/* Active Users */}
                <Card className="p-4 bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm" style={{ color: `var(--mood-primary)` }}>
                      Active Members (24)
                    </h3>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-gray-500">Online</span>
                    </div>
                  </div>
                  
                  <div className="flex -space-x-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div 
                        key={i}
                        className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs"
                      >
                        {['🌸', '🌱', '🌟', '⭐', '🦋', '🌈', '☀️', '🌙'][i]}
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                      +16
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}