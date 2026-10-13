import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Menu, 
  Search, 
  Bell, 
  Calendar, 
  Sparkles, 
  ShieldAlert,
  ArrowRight,
  User,
  SlidersHorizontal
} from 'lucide-react';

interface TopBarProps {
  onOpenMobileMenu: () => void;
  onOpenAddModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenMobileMenu, onOpenAddModal }) => {
  const { 
    students, 
    reportingPeriod, 
    setReportingPeriod, 
    navigateTo, 
    userRole, 
    setSelectedStudentForLab 
  } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Search matches
  const filteredStudents = searchQuery.trim() 
    ? students.filter(s => 
        s.pseudonymousId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.gradeLevel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.supportIndicators.some(ind => ind.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  // Urgent alerts for notification center
  const urgentAlerts = students.filter(s => s.prediction === 'urgent_review_recommended');

  const roleLabel = {
    school_administrator: 'Administrator',
    teacher: 'Class Teacher',
    authorized_support_staff: 'Support Specialist'
  }[userRole];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#142B3B]/10 px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-[#142B3B] hover:bg-[#F8F7F2] transition-colors"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative flex-1">
          <div className="relative">
            <Search className="w-4 h-4 text-[#657582] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search pseudonymous ID (e.g. ST-104), grade, or signal..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full pl-10 pr-4 py-2 bg-[#F8F7F2] border border-[#142B3B]/10 rounded-xl text-xs sm:text-sm text-[#142B3B] placeholder-[#657582] focus:outline-none focus:ring-2 focus:ring-[#176B68]/30 focus:border-[#176B68] transition-all"
            />
          </div>

          {/* Search Dropdown Results */}
          {isSearchOpen && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[#142B3B]/10 py-2 z-50">
              <div className="px-3 py-1 text-[11px] font-semibold text-[#657582] uppercase tracking-wider">
                Matching Student Records
              </div>
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                  <button
                    key={student.id}
                    onClick={() => {
                      navigateTo(`/students/${student.id}`);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-[#F8F7F2] flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-[#142B3B] flex items-center gap-2">
                        <span>{student.pseudonymousId}</span>
                        <span className="text-[10px] text-[#657582] font-normal">({student.gradeLevel})</span>
                      </div>
                      <p className="text-[11px] text-[#657582] truncate max-w-xs">
                        Att: {student.attendanceRate}% • Rec: {student.recentAverage}%
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      student.prediction === 'urgent_review_recommended' 
                        ? 'bg-[#D9675D]/15 text-[#D9675D]'
                        : student.prediction === 'review_recommended'
                        ? 'bg-[#E9A23B]/15 text-[#E9A23B]'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {student.prediction.replace(/_/g, ' ')}
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-3 text-xs text-[#657582] text-center">
                  No matching student records found for "{searchQuery}".
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Period Filter, Demo Indicator, Notifications, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Reporting Period Filter */}
        <div className="hidden md:flex items-center gap-1.5 bg-[#F8F7F2] px-2.5 py-1.5 rounded-xl border border-[#142B3B]/10 text-xs text-[#142B3B]">
          <Calendar className="w-3.5 h-3.5 text-[#176B68]" />
          <span className="text-[#657582] font-medium">Period:</span>
          <select
            value={reportingPeriod}
            onChange={(e) => setReportingPeriod(e.target.value)}
            aria-label="Reporting period filter"
            className="bg-transparent text-xs font-semibold text-[#142B3B] focus:outline-none cursor-pointer"
          >
            <option value="term1">Term 1 (Weeks 1-10)</option>
            <option value="last30">Last 30 Days</option>
            <option value="year">Full Academic Year</option>
          </select>
        </div>

        {/* DEMO DATA Pill */}
        <div className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#E9A23B]/15 border border-[#E9A23B]/30 text-[11px] font-bold text-[#E9A23B] tracking-wide">
          <span>DEMO DATA</span>
        </div>

        {/* Quick Launch What-If Lab */}
        <button
          onClick={() => {
            const urgent = students.find(s => s.prediction === 'urgent_review_recommended') || students[0];
            setSelectedStudentForLab(urgent);
            navigateTo('/intervention-lab');
          }}
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#DCE9DF] hover:bg-[#DCE9DF]/80 text-[#176B68] text-xs font-semibold transition-colors"
          title="Open What-If Intervention Lab"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#176B68]" />
          <span>Intervention Lab</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-[#142B3B] hover:bg-[#F8F7F2] relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-[#657582]" />
            {urgentAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D9675D] ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-[#142B3B]/10 p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[#142B3B]/10 mb-2">
                <span className="text-xs font-bold text-[#142B3B] flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#D9675D]" />
                  Active Warning Signals ({urgentAlerts.length})
                </span>
                <span className="text-[10px] text-[#657582]">Action Required</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {urgentAlerts.slice(0, 4).map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      navigateTo(`/students/${s.id}`);
                      setShowNotifications(false);
                    }}
                    className="w-full p-2 rounded-xl bg-[#F8F7F2] hover:bg-[#DCE9DF]/30 text-left transition-colors flex items-start gap-2.5"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#D9675D] mt-1.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#142B3B]">
                        <span>{s.pseudonymousId}</span>
                        <span className="text-[10px] text-[#D9675D] font-bold">{(s.riskProbability * 100).toFixed(0)}% Risk</span>
                      </div>
                      <p className="text-[11px] text-[#657582] truncate mt-0.5">
                        {s.contributingFactors[0]?.factor || 'Steep attendance decline'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  navigateTo('/risk-analysis');
                  setShowNotifications(false);
                }}
                className="w-full mt-2 pt-2 border-t border-[#142B3B]/10 text-center text-xs font-semibold text-[#176B68] hover:underline flex items-center justify-center gap-1"
              >
                <span>View all flagged students</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* User Role Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#142B3B]/10">
          <div className="w-8 h-8 rounded-full bg-[#142B3B] text-[#DCE9DF] flex items-center justify-center font-bold text-xs shadow-sm">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-[#142B3B] leading-tight">{roleLabel}</div>
            <div className="text-[10px] text-[#657582] leading-tight">UDAAN Portal</div>
          </div>
        </div>
      </div>
    </header>
  );
};
