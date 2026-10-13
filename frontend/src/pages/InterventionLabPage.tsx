import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  BookOpen, 
  HeartHandshake, 
  Home, 
  Coins, 
  UserCheck, 
  SlidersHorizontal,
  FileCheck2,
  HelpCircle,
  Columns
} from 'lucide-react';
import { Student, SupportPlan } from '../types';

export const InterventionLabPage: React.FC = () => {
  const { 
    students, 
    resources, 
    selectedStudentForLab, 
    setSelectedStudentForLab, 
    createSupportPlan, 
    navigateTo 
  } = useApp();

  // Current selected student
  const activeStudent: Student = selectedStudentForLab || 
    students.find(s => s.prediction === 'urgent_review_recommended') || 
    students[0];

  // Selected interventions state
  const [selectedActions, setSelectedActions] = useState<string[]>([
    'academic_tutoring',
    'supportive_teacher_checkin'
  ]);

  const [followUpDays, setFollowUpDays] = useState<number>(14);
  const [assignedStaff, setAssignedStaff] = useState<string>(activeStudent.assignedStaff || 'Ms. Priya Sharma');
  const [customNotes, setCustomNotes] = useState<string>('Bi-weekly math mentoring paired with morning transit alignment check-in.');
  const [compareMode, setCompareMode] = useState<boolean>(false);

  // Intervention options catalogue
  const INTERVENTION_OPTIONS = [
    {
      id: 'academic_tutoring',
      title: 'Targeted Academic Tutoring',
      icon: BookOpen,
      category: 'academic',
      resourceType: 'math_tutoring',
      unitsNeeded: 2,
      description: 'Structured 1-on-1 remediation in subject areas exhibiting sudden grade drops.',
      rationale: 'Directly addresses conceptual bottlenecks before the next unit exam.'
    },
    {
      id: 'supportive_teacher_checkin',
      title: '1-on-1 Faculty Mentor Check-in',
      icon: HeartHandshake,
      category: 'mentorship',
      resourceType: 'teacher_mentoring',
      unitsNeeded: 1,
      description: 'Weekly 15-minute informal check-in during advisory period to build teacher-student rapport.',
      rationale: 'Establishes psychological safety and identifies non-academic disengagement causes early.'
    },
    {
      id: 'family_guardian_meeting',
      title: 'Collaborative Family Alignment',
      icon: Home,
      category: 'mentorship',
      resourceType: 'teacher_mentoring',
      unitsNeeded: 1,
      description: 'Non-punitive home-school sync regarding morning commute or external sibling responsibilities.',
      rationale: 'Addresses structural external factors driving repeated unexcused morning absences.'
    },
    {
      id: 'financial_welfare_review',
      title: 'Emergency Student Welfare Support',
      icon: Coins,
      category: 'welfare',
      resourceType: 'financial_welfare_review',
      unitsNeeded: 1,
      description: 'Review eligibility for subsidized transportation vouchers, meal credits, or school kits.',
      rationale: 'Alleviates economic friction that prevents regular classroom attendance.'
    },
    {
      id: 'peer_study_circle',
      title: 'Guided Peer Study Buddy System',
      icon: Users,
      category: 'academic',
      resourceType: 'peer_study_circles',
      unitsNeeded: 1,
      description: 'Pair student with high-achieving peer mentor in small collaborative study cohort.',
      rationale: 'Fosters social belonging and study habit reinforcement with minimal teacher overhead.'
    },
    {
      id: 'counselor_referral',
      title: 'Specialist Counseling Assessment',
      icon: UserCheck,
      category: 'mentorship',
      resourceType: 'counselor_hours',
      unitsNeeded: 2,
      description: 'Evaluation by certified student wellbeing counselor for chronic stress or anxiety.',
      rationale: 'Provides professional counseling when warning signs reflect persistent emotional strain.'
    }
  ];

  const toggleAction = (id: string) => {
    setSelectedActions(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  // Live Resource Constraint Feasibility Engine
  const tutoringResource = resources.find(r => r.type === 'math_tutoring');
  const mentoringResource = resources.find(r => r.type === 'teacher_mentoring');
  const counselorResource = resources.find(r => r.type === 'counselor_hours');

  const tutoringSlotsLeft = tutoringResource ? (tutoringResource.totalCapacity - tutoringResource.allocatedUnits) : 6;
  const mentoringHoursLeft = mentoringResource ? (mentoringResource.totalCapacity - mentoringResource.allocatedUnits) : 9;

  const requiresTutoring = selectedActions.includes('academic_tutoring');
  const isTutoringFeasible = !requiresTutoring || tutoringSlotsLeft >= 2;

  const requiresMentoring = selectedActions.includes('supportive_teacher_checkin') || selectedActions.includes('family_guardian_meeting');
  const isMentoringFeasible = !requiresMentoring || mentoringHoursLeft >= 1;

  const isOverallFeasible = isTutoringFeasible && isMentoringFeasible && selectedActions.length > 0;

  // Save Support Plan
  const handleSavePlan = () => {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + followUpDays);

    const primaryAction = INTERVENTION_OPTIONS.find(a => selectedActions.includes(a.id)) || INTERVENTION_OPTIONS[0];

    const plan: SupportPlan = {
      id: `plan-${Date.now()}`,
      studentId: activeStudent.id,
      studentPseudo: activeStudent.pseudonymousId,
      primaryWarningSignal: activeStudent.contributingFactors[0]?.factor || 'Calculated retention risk threshold exceeded',
      interventionType: primaryAction.id,
      interventionTitle: `${primaryAction.title} (+${selectedActions.length - 1} supporting actions)`,
      details: customNotes,
      assignedStaff,
      createdDate: new Date().toISOString().slice(0, 10),
      deadlineDate: deadline.toISOString().slice(0, 10),
      status: 'planned',
      resourceType: primaryAction.resourceType,
      allocatedUnits: primaryAction.unitsNeeded,
      baselineAttendance: activeStudent.attendanceRate,
      baselineAcademic: activeStudent.recentAverage,
      leadingMetrics: [
        { metric: 'Bi-weekly Attendance', target: 'Reach >= 75%', checkpointDays: 14 },
        { metric: 'Upcoming Unit Assessment', target: 'Score >= 55%', checkpointDays: Math.min(21, followUpDays) }
      ]
    };

    createSupportPlan(plan);
    navigateTo('/follow-ups');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Workspace Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#142B3B]/10 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE9DF] text-[#176B68] text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Signature Workspace • Feasibility-Aware Planning</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#142B3B] tracking-tight">
              The What-If Intervention Lab
            </h1>
            <p className="text-xs sm:text-sm text-[#657582] mt-1 max-w-2xl leading-relaxed">
              Explore feasible student support pathways against live school resource capacities. Transparent feasibility rules ensure that planned support can actually be delivered.
            </p>
          </div>

          {/* Student Selector Dropdown */}
          <div className="bg-[#F8F7F2] p-3 rounded-2xl border border-[#142B3B]/10 flex flex-col sm:flex-row items-center gap-3">
            <span className="text-xs font-bold text-[#142B3B] whitespace-nowrap">Active Student:</span>
            <select
              value={activeStudent.id}
              onChange={(e) => {
                const found = students.find(s => s.id === e.target.value);
                if (found) setSelectedStudentForLab(found);
              }}
              className="bg-white border border-[#142B3B]/15 text-xs font-bold text-[#142B3B] rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#176B68]/30 cursor-pointer w-full sm:w-auto"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.pseudonymousId} ({s.gradeLevel} • {(s.riskProbability * 100).toFixed(0)}% Risk)
                </option>
              ))}
            </select>

            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`px-3 py-2 text-xs font-bold rounded-xl border transition-colors flex items-center gap-1.5 ${
                compareMode 
                  ? 'bg-[#142B3B] text-white border-[#142B3B]' 
                  : 'bg-white text-[#142B3B] border-[#142B3B]/15 hover:bg-[#F8F7F2]'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>{compareMode ? 'Exit Compare' : 'Compare Plans'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Selected Student Profile Mini-Card */}
      <div className="bg-white rounded-2xl p-5 border border-[#142B3B]/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#142B3B] text-white flex items-center justify-center font-mono font-bold text-base shadow-sm">
            {activeStudent.pseudonymousId}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-base text-[#142B3B]">{activeStudent.pseudonymousId}</span>
              <span className="text-xs text-[#657582]">({activeStudent.gradeLevel} • Sec {activeStudent.section})</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeStudent.prediction === 'urgent_review_recommended' ? 'bg-[#D9675D]/15 text-[#D9675D]' :
                activeStudent.prediction === 'review_recommended' ? 'bg-[#E9A23B]/15 text-[#E9A23B]' :
                'bg-emerald-100 text-emerald-800'
              }`}>
                {(activeStudent.riskProbability * 100).toFixed(0)}% Risk
              </span>
            </div>
            <p className="text-xs text-[#657582] mt-0.5">
              Attendance: <span className="font-bold text-[#142B3B]">{activeStudent.attendanceRate}%</span> • Recent Avg: <span className="font-bold text-[#142B3B]">{activeStudent.recentAverage}%</span> • Baseline: {activeStudent.previousAverage}%
            </p>
          </div>
        </div>

        <button
          onClick={() => navigateTo(`/students/${activeStudent.id}`)}
          className="text-xs font-bold text-[#176B68] hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <span>Examine Full Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Compare Mode Side-by-Side Comparison */}
      {compareMode && (
        <div className="bg-white rounded-3xl p-6 border border-[#142B3B]/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#142B3B]/10">
            <h3 className="font-heading font-bold text-base text-[#142B3B] flex items-center gap-2">
              <Columns className="w-4 h-4 text-[#176B68]" />
              <span>Side-by-Side Scenario Plan Comparison</span>
            </h3>
            <span className="text-xs text-[#657582]">Scenario Evaluation Mode</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Scenario A: Selected Configuration */}
            <div className="p-5 rounded-2xl bg-[#F8F7F2] border-2 border-[#176B68] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm text-[#142B3B]">Scenario A (Current Draft)</span>
                <span className="text-[10px] font-bold bg-[#176B68] text-white px-2 py-0.5 rounded">Selected</span>
              </div>
              <p className="text-xs text-[#657582]">
                Focused on {selectedActions.length} coordinated actions: {selectedActions.map(a => a.replace(/_/g, ' ')).join(', ')}.
              </p>
              <div className="text-xs space-y-1 pt-1">
                <div className="flex justify-between text-[#142B3B]">
                  <span>Tutoring Slots Required:</span>
                  <span className="font-bold">{requiresTutoring ? '2 slots' : 'None'}</span>
                </div>
                <div className="flex justify-between text-[#142B3B]">
                  <span>Checkpoint Frequency:</span>
                  <span className="font-bold">Every {followUpDays} days</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Feasibility Status:</span>
                  <span>{isOverallFeasible ? 'Feasible' : 'Constrained'}</span>
                </div>
              </div>
            </div>

            {/* Scenario B: Peer-Led Alternative */}
            <div className="p-5 rounded-2xl bg-[#F8F7F2] border border-[#142B3B]/15 space-y-3 opacity-90">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm text-[#142B3B]">Scenario B (Low Resource Alternative)</span>
                <span className="text-[10px] font-bold bg-slate-200 text-[#142B3B] px-2 py-0.5 rounded">Alternative</span>
              </div>
              <p className="text-xs text-[#657582]">
                Guided Peer Study Circle + Bi-weekly Teacher Mentoring (Conserves faculty slots).
              </p>
              <div className="text-xs space-y-1 pt-1">
                <div className="flex justify-between text-[#142B3B]">
                  <span>Tutoring Slots Required:</span>
                  <span className="font-bold">0 (Peer cohort)</span>
                </div>
                <div className="flex justify-between text-[#142B3B]">
                  <span>Checkpoint Frequency:</span>
                  <span className="font-bold">Every 14 days</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Feasibility Status:</span>
                  <span>100% Feasible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Lab Workspace Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Support Options Matrix */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-[#142B3B]/10 shadow-sm space-y-5">
          <div className="pb-3 border-b border-[#142B3B]/10">
            <h3 className="font-heading font-bold text-lg text-[#142B3B]">
              Step 1: Select Intervention Support Actions
            </h3>
            <p className="text-xs text-[#657582] mt-0.5">
              Choose evidence-based actions aligned with {activeStudent.pseudonymousId}'s specific signals
            </p>
          </div>

          <div className="space-y-3">
            {INTERVENTION_OPTIONS.map((action) => {
              const Icon = action.icon;
              const isSelected = selectedActions.includes(action.id);

              return (
                <div
                  key={action.id}
                  onClick={() => toggleAction(action.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-[#176B68] bg-[#DCE9DF]/25 shadow-sm'
                      : 'border-[#142B3B]/10 hover:border-[#142B3B]/25 bg-white'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl flex-shrink-0 transition-colors ${
                    isSelected ? 'bg-[#176B68] text-white' : 'bg-[#F8F7F2] text-[#142B3B]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-bold text-sm text-[#142B3B]">{action.title}</h4>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // handled by parent div
                        className="w-4 h-4 rounded text-[#176B68] focus:ring-[#176B68] cursor-pointer"
                      />
                    </div>
                    <p className="text-xs text-[#657582] mt-1 leading-relaxed">
                      {action.description}
                    </p>
                    <div className="mt-2 text-[11px] text-[#176B68] font-medium flex items-center gap-1.5">
                      <span>Rationale:</span>
                      <span className="text-[#142B3B]">{action.rationale}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: School Resource Matcher & Feasibility */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live School Resource Capacity Gauges */}
          <div className="bg-white rounded-3xl p-6 border border-[#142B3B]/10 shadow-sm space-y-4">
            <div className="pb-3 border-b border-[#142B3B]/10">
              <h3 className="font-heading font-bold text-base text-[#142B3B] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#176B68]" />
                <span>School Resource Capacity Tracker</span>
              </h3>
              <p className="text-xs text-[#657582] mt-0.5">
                Live availability of faculty, tutoring, and support hours
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Tutoring Slots Gauge */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-[#142B3B]">Math Tutoring Slots</span>
                  <span className="font-mono text-[#657582]">
                    {tutoringSlotsLeft} of {tutoringResource?.totalCapacity || 25} available
                  </span>
                </div>
                <div className="w-full bg-[#F8F7F2] h-2 rounded-full overflow-hidden border border-[#142B3B]/10">
                  <div
                    style={{ width: `${((tutoringResource?.allocatedUnits || 19) / (tutoringResource?.totalCapacity || 25)) * 100}%` }}
                    className="bg-[#176B68] h-full rounded-full"
                  />
                </div>
              </div>

              {/* Mentoring Hours Gauge */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-[#142B3B]">Faculty Mentoring Slots</span>
                  <span className="font-mono text-[#657582]">
                    {mentoringHoursLeft} of {mentoringResource?.totalCapacity || 35} available
                  </span>
                </div>
                <div className="w-full bg-[#F8F7F2] h-2 rounded-full overflow-hidden border border-[#142B3B]/10">
                  <div
                    style={{ width: `${((mentoringResource?.allocatedUnits || 26) / (mentoringResource?.totalCapacity || 35)) * 100}%` }}
                    className="bg-[#176B68] h-full rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Feasibility Evaluation Card */}
            <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
              isOverallFeasible
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}>
              <div className="flex items-center gap-2 font-bold">
                {isOverallFeasible ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Feasibility Check Passed: Plan is Deliverable</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Capacity Alert: Resource Rebalancing Recommended</span>
                  </>
                )}
              </div>
              <p className="text-[11px] leading-relaxed">
                {isOverallFeasible
                  ? 'The proposed intervention package fits cleanly within active faculty time and student tutoring quotas.'
                  : 'Tutoring or mentoring quotas are near capacity. Consider pairing student with a Guided Peer Study Circle as a viable alternative.'}
              </p>
            </div>
          </div>

          {/* Plan Settings & Save Action */}
          <div className="bg-white rounded-3xl p-6 border border-[#142B3B]/10 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-base text-[#142B3B]">
              Step 2: Assignee & Follow-up Timeline
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#142B3B] mb-1">
                  Primary Staff Member Responsible
                </label>
                <input
                  type="text"
                  value={assignedStaff}
                  onChange={(e) => setAssignedStaff(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8F7F2] border border-[#142B3B]/15 rounded-xl font-medium focus:ring-2 focus:ring-[#176B68]/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#142B3B] mb-1">
                  Target Review Horizon
                </label>
                <select
                  value={followUpDays}
                  onChange={(e) => setFollowUpDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#F8F7F2] border border-[#142B3B]/15 rounded-xl font-medium focus:ring-2 focus:ring-[#176B68]/30 focus:outline-none"
                >
                  <option value={7}>7 Days (Immediate Checkpoint)</option>
                  <option value={14}>14 Days (Standard 2-Week Milestone)</option>
                  <option value={21}>21 Days (3-Week Assessment Cycle)</option>
                  <option value={30}>30 Days (End of Term Review)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#142B3B] mb-1">
                  Specific Educator Support Notes
                </label>
                <textarea
                  rows={3}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full p-2.5 bg-[#F8F7F2] border border-[#142B3B]/15 rounded-xl focus:ring-2 focus:ring-[#176B68]/30 focus:outline-none"
                />
              </div>
            </div>

            {/* Scientific Requirement Disclaimer */}
            <div className="p-3 bg-[#F8F7F2] rounded-xl text-[11px] text-[#657582] leading-relaxed border border-[#142B3B]/10">
              <span className="font-bold text-[#142B3B]">Scientific Principle: </span>
              Intervention planning does not alter mathematical risk output instantaneously. True progress is measured at scheduled follow-up checkpoints.
            </div>

            {/* Save Button */}
            <button
              onClick={handleSavePlan}
              disabled={selectedActions.length === 0}
              className="w-full py-3 bg-[#176B68] hover:bg-[#208783] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FileCheck2 className="w-4 h-4 text-[#DCE9DF]" />
              <span>Save & Schedule Support Plan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
