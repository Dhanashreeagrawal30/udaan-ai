import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  LayoutDashboard, 
  Users, 
  Activity, 
  Sparkles, 
  Clock, 
  FileText, 
  Settings, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  PlusCircle,
  Upload,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  onOpenAddModal: () => void;
  onOpenCsvModal: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  onOpenAddModal, 
  onOpenCsvModal, 
  isMobileOpen, 
  setIsMobileOpen 
}) => {
  const { 
    currentRoute, 
    navigateTo, 
    students, 
    userRole, 
    setUserRole, 
    backendStatus, 
    forceDemoMode,
    refreshBackendHealth 
  } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  // Compute urgent counts
  const urgentCount = students.filter(s => s.prediction === 'urgent_review_recommended').length;
  const pendingFollowUps = students.filter(s => s.followUpStatus === 'in_progress' || s.followUpStatus === 'planned').length;

  const navItems = [
    { label: 'Overview', route: '/dashboard', icon: LayoutDashboard, badge: null },
    { label: 'Student Directory', route: '/students', icon: Users, badge: students.length },
    { label: 'Risk & Drift Analytics', route: '/risk-analysis', icon: Activity, badge: urgentCount > 0 ? `${urgentCount} urgent` : null, badgeColor: 'bg-[#D9675D]/15 text-[#D9675D]' },
    { label: 'Intervention Lab', route: '/intervention-lab', icon: Sparkles, badge: 'Signature', badgeColor: 'bg-[#176B68]/15 text-[#176B68]' },
    { label: 'Follow-up Tracker', route: '/follow-ups', icon: Clock, badge: pendingFollowUps > 0 ? `${pendingFollowUps}` : null, badgeColor: 'bg-[#E9A23B]/15 text-[#E9A23B]' },
    { label: 'Reports & Exports', route: '/reports', icon: FileText, badge: null },
    { label: 'System & Privacy', route: '/settings', icon: Settings, badge: null },
  ];

  const handleNav = (route: string) => {
    navigateTo(route);
    setIsMobileOpen(false);
  };

  const isModelOnline = backendStatus.isConnected && !forceDemoMode;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#142B3B] text-white transition-all duration-300 ease-in-out flex flex-col border-r border-white/10
          ${collapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <button 
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 text-left group overflow-hidden focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#176B68] to-[#208783] flex items-center justify-center text-white shadow-md flex-shrink-0 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 text-[#DCE9DF]" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="font-heading text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  UDAAN <span className="text-[#DCE9DF] text-xs font-semibold px-1.5 py-0.5 rounded bg-white/10">AI</span>
                </span>
                <p className="text-[10px] text-white/60 truncate uppercase tracking-wider font-medium">Student Retention</p>
              </div>
            )}
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label="Toggle sidebar expansion"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Model Connection Badge */}
        <div className="px-3 pt-3">
          <button
            onClick={refreshBackendHealth}
            title={isModelOnline ? "Connected to Python FastAPI ML backend" : "Operating in simulated demo mode"}
            className={`w-full text-left p-2 rounded-lg text-xs flex items-center gap-2 border transition-colors ${
              isModelOnline 
                ? 'bg-[#176B68]/30 border-[#176B68]/50 text-[#DCE9DF] hover:bg-[#176B68]/40'
                : 'bg-[#E9A23B]/20 border-[#E9A23B]/40 text-[#E9A23B] hover:bg-[#E9A23B]/30'
            }`}
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isModelOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            {!collapsed && (
              <span className="truncate font-medium">
                {isModelOnline ? 'ML Backend Live' : 'Demo Mode (Offline)'}
              </span>
            )}
          </button>
        </div>

        {/* Quick Action Buttons */}
        {!collapsed && (
          <div className="px-3 pt-3 flex gap-2">
            <button
              onClick={onOpenAddModal}
              className="flex-1 py-1.5 px-2 text-xs font-medium bg-[#176B68] hover:bg-[#208783] text-white rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Student</span>
            </button>
            <button
              onClick={onOpenCsvModal}
              className="py-1.5 px-2 text-xs font-medium bg-white/10 hover:bg-white/15 text-white/90 rounded-lg flex items-center justify-center gap-1 transition-colors"
              title="Import student CSV"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route || (item.route !== '/' && currentRoute.startsWith(item.route));

            return (
              <button
                key={item.route}
                onClick={() => handleNav(item.route)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group text-left ${
                  isActive
                    ? 'bg-white/15 text-white shadow-sm font-semibold'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${
                  isActive ? 'text-[#DCE9DF]' : 'text-white/60 group-hover:text-white'
                }`} />
                
                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-white/20 text-white'}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Role Switcher & Footer */}
        <div className="p-3 border-t border-white/10 bg-black/10">
          {!collapsed ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span className="font-medium flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-[#DCE9DF]" />
                  Active Role
                </span>
                <span className="text-[10px] uppercase font-mono px-1 py-0.5 bg-white/10 rounded">
                  TECHFORMERS
                </span>
              </div>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as any)}
                aria-label="Active user role"
                className="w-full bg-[#142B3B] border border-white/20 text-white text-xs rounded-lg p-2 focus:ring-1 focus:ring-[#176B68] focus:border-[#176B68] cursor-pointer"
              >
                <option value="school_administrator">School Administrator</option>
                <option value="teacher">Class Teacher</option>
                <option value="authorized_support_staff">Authorized Support Staff</option>
              </select>
              <div className="pt-1 flex items-center justify-between text-[11px] text-white/50">
                <span>UDAAN v1.0.0</span>
                <button 
                  onClick={() => handleNav('/settings')}
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ShieldCheck className="w-3 h-3 text-[#DCE9DF]" />
                  <span>AI Ethics</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={() => handleNav('/settings')}
                className="p-2 text-white/60 hover:text-white"
                title="Active role: School Administrator"
              >
                <UserCheck className="w-5 h-5 text-[#DCE9DF]" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
