import { type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PenLine, FileText, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  user?: any;
  onLogout?: () => void;
}

export default function Layout({ children, activeTab, onTabChange, user, onLogout }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Sidebar / Navigation */}
      <nav className="fixed left-0 top-0 h-full w-20 border-r border-[#141414] flex flex-col items-center py-8 gap-8 bg-[#E4E3E0] z-50">
        <div className="w-12 h-12 bg-[#141414] rounded-full flex items-center justify-center text-[#E4E3E0] mb-8">
          <PenLine size={24} />
        </div>
        
        <NavItem 
          icon={<LayoutDashboard size={20} />} 
          active={activeTab === 'dashboard'} 
          onClick={() => onTabChange('dashboard')} 
          label="Dashboard"
        />
        <NavItem 
          icon={<PenLine size={20} />} 
          active={activeTab === 'generate'} 
          onClick={() => onTabChange('generate')} 
          label="Generate"
        />
        <NavItem 
          icon={<FileText size={20} />} 
          active={activeTab === 'my-notes'} 
          onClick={() => onTabChange('my-notes')} 
          label="My Notes"
        />
        
        <div className="mt-auto flex flex-col gap-8">
          {user && (
            <NavItem 
              icon={<LogOut size={20} />} 
              active={false} 
              onClick={onLogout || (() => {})} 
              label="Logout"
            />
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pl-20 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-8 max-w-6xl mx-auto"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Grid Overlay for Technical Vibe */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `linear-gradient(#141414 1px, transparent 1px), linear-gradient(90deg, #141414 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
    </div>
  );
}

function NavItem({ icon, active, onClick, label }: { icon: ReactNode, active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative p-3 rounded-xl transition-all duration-200",
        active ? "bg-[#141414] text-[#E4E3E0]" : "hover:bg-[#d4d3d0] text-[#141414]"
      )}
    >
      {icon}
      <span className="absolute left-full ml-4 px-2 py-1 bg-[#141414] text-[#E4E3E0] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {label}
      </span>
      {active && (
        <motion.div 
          layoutId="active-indicator"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#141414] rounded-l-full" 
        />
      )}
    </button>
  );
}
