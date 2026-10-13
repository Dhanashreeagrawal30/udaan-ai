import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight, 
  TrendingDown, 
  TrendingUp, 
  ShieldAlert, 
  PlusCircle, 
  Upload, 
  Calendar,
  Activity,
  ArrowRight
} from 'lucide-react';

interface DashboardPageProps {
  onOpenAddModal: () => void;
  onOpenCsvModal: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onOpenAddModal, onOpenCsvModal }) => {
  const { 
    students, 
    reportingPeriod, 
    navigateTo, 
    setSelectedStudentForLab,
    backendStatus,
    forceDemoMode
  } = useApp();

  // Dynamic calculations derived from single unified data state
  const totalMonitored = students.length;
  const urgentCount = students.filter(s => s.prediction === 'urgent_review_recommended').length;
  const reviewCount = students.filter(s => s.prediction === 'review_recommended').length;
  const totalRequiringReview = urgentCount + reviewCount;
  const onTrackCount = students.filter(s => s.prediction === 'on_track').length;

  const activePlansCount = students.reduce((acc, s) => acc + s.supportPlanHistory.length, 0);
  const pendingFollowUps = students.filter(s => 
    s.followUpStatus === 'in_progress' || s.followUpStatus === 'planned' || s.followUpStatus === 'awaiting_follow_up'
  ).length;
  const completedPlansCount = students.filter(s => s.followUpStatus === 'completed').length;

  // Average attendance calculation
  const avgAttendance = totalMonitored > 0
    ? (students.reduce((sum, s) => sum + s.attendanceRate, 0) / totalMonitored).toFixed(1)
    : '0.0';

  // Urgent attention students (sorted by risk probability descending)
  const priorityStudents = [...students]
    .filter(s => s.prediction === 'urgent_review_recommended' || s.prediction === 'review_recommended')
    .sort((a, b) => b.riskProbability - a.riskProbability)
    .slice(0, 4);

  // Time-appropriate greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#142B3B]/10 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#176B68]">
                {getGreeting()}, School Team
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E9A23B]/15 text-[#E9A23B] border border-[#E9A23B]/30">
                DEMO DATA
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#142B3B] tracking-tight">
              School Student Retention Overview
            </h1>
            <p className="text-xs sm:text-sm text-[#657582] mt-1 max-w-xl">
              Active monitoring for {reportingPeriod === 'term1' ? 'Term 1 (Weeks 1-10)' : reportingPeriod === 'last30' ? 'the Last 30 Days' : 'Academic Year 2025-2026'}. All early warning indicators derive from calibrated multi-factor regression models.
            </p>
          </div>

          {/* Quick Action Button Group */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2.5 bg-[#176B68] hover:bg-[#208783] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Enroll Student</span>
            </button>
            <button
              onClick={onOpenCsvModal}
              className="px-4 py-2.5 bg-white hover:bg-[#F8F7F2] text-[#142B3B] border border-[#142B3B]/15 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4 text-[#176B68]" />
              <span>Import CSV</span>
            </button>
            <button
              onClick={() => {
                const urgent = students.find(s => s.prediction === 'urgent_review_recommended') || students[0];
                setSelectedStudentForLab(urgent);
                navigateTo('/intervention-lab');
              }}
              className="px-4 py-2.5 bg-[#DCE9DF] hover:bg-[#DCE9DF]/80 text-[#176B68] text-xs font-bold rounded-xl transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Intervention Lab</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Monitored */}
        <div className="bg-white rounded-2xl p-5 border border-[#142B3B]/10 shadow-sm relative overflow-hidden group hover:border-[#176B68] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#657582]">Monitored Cohort</span>
            <div className="p-2 bg-[#F8F7F2] text-[#142B3B] rounded-xl group-hover:bg-[#DCE9DF] transition-colors">
              <Users className="w-4 h-4 text-[#176B68]" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-heading text-2xl font-extrabold text-[#142B3B]">{totalMonitored}</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-[#657582]">
              <span className="font-semibold text-[#176B68]">{avgAttendance}%</span>
              <span>avg school attendance</span>
            </div>
          </div>
        </div>

        {/* Requiring Review */}
        <div className="bg-white rounded-2xl p-5 border border-[#142B3B]/10 shadow-sm relative overflow-hidden group hover:border-[#D9675D] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#657582]">Requiring Review</span>
            <div className="p-2 bg-[#D9675D]/10 text-[#D9675D] rounded-xl">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-heading text-2xl font-extrabold text-[#D9675D]">{totalRequiringReview}</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-[#657582]">
              <span className="font-bold text-[#D9675D]">{urgentCount} critical</span>
              <span>• {reviewCount} moderate</span>
            </div>
          </div>
        </div>

        {/* Pending Follow-ups */}
        <div className="bg-white rounded-2xl p-5 border border-[#142B3B]/10 shadow-sm relative overflow-hidden group hover:border-[#E9A23B] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#657582]">Follow-ups Pending</span>
            <div className="p-2 bg-[#E9A23B]/10 text-[#E9A23B] rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-heading text-2xl font-extrabold text-[#E9A23B]">{pendingFollowUps}</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-[#657582]">
              <span className="font-semibold text-[#142B3B]">{completedPlansCount} resolved</span>
              <span>this reporting term</span>
            </div>
          </div>
        </div>

        {/* Active Support Plans */}
        <div className="bg-white rounded-2xl p-5 border border-[#142B3B]/10 shadow-sm relative overflow-hidden group hover:border-[#176B68] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#657582]">Active Support Plans</span>
            <div className="p-2 bg-[#176B68]/10 text-[#176B68] rounded-xl">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-heading text-2xl font-extrabold text-[#176B68]">{activePlansCount}</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-[#657582]">
              <span className="font-semibold text-[#176B68]">100% human reviewed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts & Analytics Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Attendance Trajectory Over Weeks */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-[#142B3B]/10 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#142B3B]/10">
            <div>
              <h3 className="font-heading font-bold text-base text-[#142B3B] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#176B68]" />
                <span>Weekly Attendance Trajectory vs Early Warning Benchmark</span>
              </h3>
              <p className="text-xs text-[#657582] mt-0.5">
                Comparison of overall cohort baseline vs flagged students requiring review
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-[#657582]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#176B68]" /> Cohort Avg
              </span>
              <span className="flex items-center gap-1.5 text-[#D9675D]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D9675D]" /> Flagged Group
              </span>
            </div>
          </div>

          {/* Custom SVG Data Visualization for Attendance Trend */}
          <div className="pt-2">
            <div className="h-56 w-full relative flex flex-col justify-between">
              {/* Reference Threshold Line at 82% */}
              <div className="absolute top-[36%] left-0 right-0 border-b border-dashed border-[#E9A23B] z-0 flex justify-end">
                <span className="bg-[#E9A23B]/15 text-[#E9A23B] text-[10px] font-bold px-1.5 py-0.5 rounded -translate-y-3">
                  82% EWI Threshold
                </span>
              </div>

              {/* Chart SVG */}
              <svg className="w-full h-44 overflow-visible" viewBox="0 0 500 160">
                {/* Cohort average curve (stays high around 90%) */}
                <path
                  d="M 20,25 Q 120,28 250,26 T 480,24"
                  fill="none"
                  stroke="#176B68"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Flagged students curve (steep drop from 88 to 62%) */}
                <path
                  d="M 20,32 Q 130,55 250,95 T 480,128"
                  fill="none"
                  stroke="#D9675D"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                <circle cx="20" cy="25" r="4" fill="#176B68" />
                <circle cx="130" cy="28" r="4" fill="#176B68" />
                <circle cx="250" cy="26" r="4" fill="#176B68" />
                <circle cx="370" cy="25" r="4" fill="#176B68" />
                <circle cx="480" cy="24" r="4" fill="#176B68" />

                <circle cx="20" cy="32" r="4" fill="#D9675D" />
                <circle cx="130" cy="55" r="4" fill="#D9675D" />
                <circle cx="250" cy="95" r="4" fill="#D9675D" />
                <circle cx="370" cy="118" r="4" fill="#D9675D" />
                <circle cx="480" cy="128" r="5" fill="#D9675D" stroke="#FFFFFF" strokeWidth="2" />
              </svg>

              {/* Weeks X-Axis */}
              <div className="flex justify-between text-[11px] text-[#657582] font-mono border-t border-[#142B3B]/10 pt-2">
                <span>Week 1</span>
                <span>Week 3</span>
                <span>Week 5</span>
                <span>Week 7</span>
                <span>Week 10 (Current)</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#F8F7F2] rounded-xl text-xs text-[#657582] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-[#D9675D]" />
              <span>Flagged group shows sustained 28% drop in Friday attendance over consecutive weeks.</span>
            </span>
            <button
              onClick={() => navigateTo('/risk-analysis')}
              className="text-[#176B68] font-bold hover:underline flex items-center gap-1"
            >
              <span>Examine Drift</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Risk Distribution Breakdown */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-[#142B3B]/10 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-base text-[#142B3B]">
              Cohort Risk Profile
            </h3>
            <p className="text-xs text-[#657582] mt-0.5">
              Probabilistic categorization from ML engine
            </p>

            {/* Segmented Risk Bar */}
            <div className="mt-5 space-y-4">
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100">
                <div 
                  style={{ width: `${(onTrackCount / totalMonitored) * 100}%` }} 
                  className="bg-emerald-500 h-full transition-all" 
                  title={`On Track: ${onTrackCount}`}
                />
                <div 
                  style={{ width: `${(reviewCount / totalMonitored) * 100}%` }} 
                  className="bg-[#E9A23B] h-full transition-all" 
                  title={`Review Recommended: ${reviewCount}`}
                />
                <div 
                  style={{ width: `${(urgentCount / totalMonitored) * 100}%` }} 
                  className="bg-[#D9675D] h-full transition-all" 
                  title={`Urgent Review: ${urgentCount}`}
                />
              </div>

              {/* Legend & Numbers */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8F7F2] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D9675D]" />
                    <span className="font-semibold text-[#142B3B]">Urgent Review Needed</span>
                  </div>
                  <span className="font-heading font-bold text-[#D9675D]">{urgentCount} students</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8F7F2] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E9A23B]" />
                    <span className="font-semibold text-[#142B3B]">Review Recommended</span>
                  </div>
                  <span className="font-heading font-bold text-[#E9A23B]">{reviewCount} students</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8F7F2] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-[#142B3B]">On Track (Protective Buffer)</span>
                  </div>
                  <span className="font-heading font-bold text-emerald-700">{onTrackCount} students</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#DCE9DF]/40 rounded-xl text-[11px] text-[#176B68] font-medium leading-relaxed">
            Note: Predictions reflect statistical risk patterns, not fixed outcomes. Human review is required before taking intervention steps.
          </div>
        </div>
      </div>

      {/* Actionable Student Review Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#142B3B]/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#142B3B]/10">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#142B3B]">
              Students Requiring Review & Planned Action
            </h3>
            <p className="text-xs text-[#657582] mt-0.5">
              Ranked by composite risk probability and recent trajectory deceleration
            </p>
          </div>
          <button
            onClick={() => navigateTo('/students')}
            className="text-xs font-bold text-[#176B68] hover:underline flex items-center gap-1.5"
          >
            <span>View Complete Directory ({students.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-[#657582] border-b border-[#142B3B]/10">
              <tr>
                <th className="py-3 px-3">Student ID</th>
                <th className="py-3 px-3">Grade</th>
                <th className="py-3 px-3">Attendance</th>
                <th className="py-3 px-3">Recent Avg</th>
                <th className="py-3 px-3">Velocity Trend</th>
                <th className="py-3 px-3">Estimated Risk</th>
                <th className="py-3 px-3">Assigned Staff</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#142B3B]/10">
              {priorityStudents.map((s) => (
                <tr key={s.id} className="hover:bg-[#F8F7F2]/80 transition-colors">
                  <td className="py-3.5 px-3">
                    <button
                      onClick={() => navigateTo(`/students/${s.id}`)}
                      className="font-mono font-bold text-[#176B68] hover:underline text-left"
                    >
                      {s.pseudonymousId}
                    </button>
                  </td>
                  <td className="py-3.5 px-3 font-medium text-[#142B3B]">{s.gradeLevel}</td>
                  <td className="py-3.5 px-3">
                    <span className={`font-semibold ${s.attendanceRate < 75 ? 'text-[#D9675D]' : s.attendanceRate < 82 ? 'text-[#E9A23B]' : 'text-emerald-700'}`}>
                      {s.attendanceRate}%
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-semibold text-[#142B3B]">{s.recentAverage}%</span>
                    <span className="text-[10px] text-[#657582] ml-1">
                      ({s.recentAverage - s.previousAverage > 0 ? '+' : ''}{(s.recentAverage - s.previousAverage).toFixed(0)})
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                      s.recentAbsenceTrend === 'critical' ? 'bg-[#D9675D]/15 text-[#D9675D]' :
                      s.recentAbsenceTrend === 'increasing' ? 'bg-[#E9A23B]/15 text-[#E9A23B]' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {s.recentAbsenceTrend}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      s.prediction === 'urgent_review_recommended' ? 'bg-[#D9675D]/15 text-[#D9675D]' :
                      s.prediction === 'review_recommended' ? 'bg-[#E9A23B]/15 text-[#E9A23B]' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {(s.riskProbability * 100).toFixed(0)}% Risk
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-[#657582]">{s.assignedStaff}</td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedStudentForLab(s);
                        navigateTo('/intervention-lab');
                      }}
                      className="px-3 py-1 bg-[#176B68] hover:bg-[#208783] text-white text-[11px] font-bold rounded-lg transition-colors inline-flex items-center gap-1 shadow-sm"
                    >
                      <span>Open Lab</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
