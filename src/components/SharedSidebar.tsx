import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { 
  Brain,
  MessageCircle, 
  Users,
  BookOpen,
  Target,
  Gamepad2,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  TestTube,
  Home,
  Calendar
} from 'lucide-react';
import type { PageType } from '../App';

interface SharedSidebarProps {
  onNavigate: (page: PageType) => void;
  currentPage: PageType;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  showMobile: boolean;
  onToggleMobile: () => void;
}

export function SharedSidebar({ 
  onNavigate, 
  currentPage, 
  collapsed, 
  onToggleCollapsed, 
  showMobile, 
  onToggleMobile 
}: SharedSidebarProps) {
  const navigationItems = [
    { icon: Home, label: 'Dashboard', page: 'dashboard' as PageType },
    { icon: MessageCircle, label: 'AI Chat', page: 'chat' as PageType },
    { icon: Users, label: 'Peer Support', page: 'peer-support' as PageType },
    { icon: Calendar, label: 'Appointment Booking', page: 'appointments' as PageType },
    { icon: TestTube, label: 'Test Assessments', page: 'tests' as PageType },
    { icon: BookOpen, label: 'Mood Journal', page: 'journal' as PageType },
    { icon: Target, label: 'Goals', page: 'goals' as PageType },
    { icon: Gamepad2, label: 'Mini Games', page: 'games' as PageType },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {showMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggleMobile}
        />
      )}

      {/* Sidebar */}
      <motion.div 
        className={`fixed left-0 top-0 h-full bg-white shadow-lg z-50 transform transition-all duration-300 ${
          showMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        animate={{ width: collapsed ? 64 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className={`p-6 ${collapsed ? 'p-3' : 'p-6'}`}>
          <div className={`flex items-center mb-8 ${collapsed ? 'justify-center' : 'gap-2'}`}>
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
              style={{ background: `var(--mood-gradient)` }}
            >
              <Brain className="w-4 h-4" />
            </div>
            {!collapsed && (
              <motion.span 
                className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                MindSpace
              </motion.span>
            )}
            
            {!collapsed && (
              <>
                {/* Close button for mobile */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleMobile}
                  className="ml-auto lg:hidden rounded-full p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
                
                {/* Collapse button for desktop */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleCollapsed}
                  className="ml-auto hidden lg:flex rounded-full p-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </>
            )}
            
            {collapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCollapsed}
                className="hidden lg:flex rounded-full p-1 absolute top-6 right-2"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          <nav className={`space-y-2 ${collapsed ? 'space-y-1' : 'space-y-2'}`}>
            {navigationItems.map((item) => (
              <motion.button
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                  onToggleMobile();
                }}
                className={`w-full flex items-center gap-3 rounded-lg transition-all duration-200 ${
                  currentPage === item.page 
                    ? 'text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-gray-100'
                } ${collapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'}`}
                style={currentPage === item.page ? { background: `var(--mood-gradient)` } : {}}
                title={collapsed ? item.label : undefined}
                whileHover={{ scale: collapsed ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className={`flex-shrink-0 ${collapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </motion.button>
            ))}
          </nav>
        </div>

        <div className={`absolute bottom-0 left-0 right-0 ${collapsed ? 'p-3' : 'p-6'}`}>
          <Separator className="mb-4" />
          <motion.button 
            className={`w-full flex items-center gap-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 ${
              collapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'
            }`}
            onClick={() => onNavigate('landing')}
            title={collapsed ? 'Sign Out' : undefined}
            whileHover={{ scale: collapsed ? 1.05 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className={`flex-shrink-0 ${collapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                Sign Out
              </motion.span>
            )}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}