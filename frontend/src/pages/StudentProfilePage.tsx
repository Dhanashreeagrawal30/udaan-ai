import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Sparkles, 
  RefreshCw, 
  Calendar, 
  TrendingDown, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  FileText, 
  PlusCircle, 
  AlertCircle, 
  HelpCircle,
  Activity,
  ArrowRight
} from 'lucide-react';

interface StudentProfilePageProps {
  studentId: string;
}

export const StudentProfilePage: React.FC<StudentProfilePageProps> = ({ studentId }) => {
  const { 
    students, 
    navigateTo, 
    reassessStudentRisk, 
    setSelectedStudentForLab, 
    updateSupportPlanStatus,
    userRole
  } = useApp();

  const [isReassessing, setIsReassessing] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [newObservedAtt, setNewObservedAtt] = useState<number | undefined>(undefined);
  const [newObservedScore, setNewObservedScore] = useState<number | undefined>(undefined);

  // Match by id or pseudonymousId
  const student = students.find(s => s.id === studentId || s.pseudonymousId === studentId);

  if (!student) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-[#142B3B]/10 max-w-lg mx-auto space-y-4">
        <AlertCircle className="w-12 h-12 text-[#657582] mx-auto opacity-50" />
        <h2 className="font-heading font-bold text-lg text-[#142B3B]">Student Record Not Found</h2>
        <p className="text-xs text-[#657582]">
          The requested pseudonymous student identifier does not exist or may have been unassigned.
        </p>
        <button
          onClick={() => navigateTo('/students')}
          className="px-4 py-2 bg-[#176B68] text-white text-xs font-bold rounded-xl"
        >
          Return to Student Directory
        </button>
      </div>
    );
  }

  const handleReassess = async () => {
    setIsReassessing(true);
    try {
      await reassessStudentRisk(student.id);
    } finally {
      setIsReassessing(false);
    }
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const activePlan = student.supportPlanHistory[0];
    const planId = activePlan ? activePlan.id : `plan-adhoc-${Date.now()}`;

    updateSupportPlanStatus(
      planId,
      student.followUpStatus === 'none' ? 'in_progress' : student.followUpStatus,
      newNoteText,
      newObservedAtt ?? student.attendanceRate,
      newObservedScore ?? student.recentAverage
    );

    setNewNoteText('');
    setShowNoteModal(false);
  };

  const acadDelta = student.recentAverage - student.previousAverage;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Back Button */}
      <button
        onClick={() => navigateTo('/students')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#657582] hover:text-[#142B3B] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Student Directory</span>
      </button>

      {/* Student Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#142B3B]/10 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#142B3B] tracking-tight">
                {student.pseudonymousId}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                student.prediction === 'urgent_review_recommended' ? 'bg-[#D9675D]/15 text-[#D9675D]' :
                student.prediction === 'review_recommended' ? 'bg-[#E9A23B]/15 text-[#E9A23B]' :
                'bg-emerald-100 text-emerald-800'
              }`}>
                {student.prediction.replace(/_/g, ' ')}
              </span>
              {student.isDriftFlagged && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D9675D]/15 text-[#D9675D] border border-[#D9675D]/30">
                  Statistical Drift Flag
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#657582]">
              {student.gradeLevel} • Section {student.section} • Assigned to <span className="font-semibold text-[#142B3B]">{student.assignedStaff}</span>
            </p>

            {/* Context Indicators Pills */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {student.supportIndicators.map((ind, i) => (
                <span key={i} className="text-[11px] px-2 py-0.5 rounded-lg bg-[#F8F7F2] border border-[#142B3B]/10 text-[#142B3B]">
                  {ind}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleReassess}
              disabled={isReassessing}
              className="px-4 py-2.5 bg-white hover:bg-[#F8F7F2] text-[#142B3B] border border-[#142B3B]/15 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-[#176B68] ${isReassessing ? 'animate-spin' : ''}`} />
              <span>{isReassessing ? 'Evaluating Model...' : 'Reassess Risk (ML)'}</span>
            </button>

            <button
              onClick={() => {
                setSelectedStudentForLab(student);
                navigateTo('/intervention-lab');
              }}
              className="px-4 py-2.5 bg-[#176B68] hover:bg-[#208783] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#DCE9DF]" />
              <span>Open Intervention Lab</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Quantitative Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-[#142B3B]/10 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#657582]">
            <span>Attendance Rate</span>
            <Calendar className="w-4 h-4 text-[#176B68]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`font-heading text-2xl font-extrabold ${student.attendanceRate < 82 ? 'text-[#D9675D]' : 'text-emerald-700'}`}>
              {student.attendanceRate}%
            </span>
            <span className="text-xs text-[#657582]">/ 82% benchmark</span>
          </div>
          <div className="mt-1 text-[11px] text-[#657582]">
            {student.attendanceRate < 82 ? 'Below early warning threshold' : 'Protective attendance range'}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#142B3B]/10 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#657582]">
            <span>Recent Assessment Avg</span>
            <Activity className="w-4 h-4 text-[#176B68]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-heading text-2xl font-extrabold text-[#142B3B]">
              {student.recentAverage}%
            </span>
            <span className={`text-xs font-semibold ${acadDelta < 0 ? 'text-[#D9675D]' : 'text-emerald-700'}`}>
              ({acadDelta > 0 ? '+' : ''}{acadDelta.toFixed(0)} pts)
            </span>
          </div>
          <div className="mt-1 text-[11px] text-[#657582]">
            Prior baseline: {student.previousAverage}%
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#142B3B]/10 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#657582]">
            <span>Absence Velocity</span>
            <Clock className="w-4 h-4 text-[#E9A23B]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-heading text-xl font-extrabold capitalize text-[#142B3B]">
              {student.recentAbsenceTrend}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-[#657582]">
            {student.missedAssessments} missed assessments recorded
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#142B3B]/10 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#657582]">
            <span>Estimated Retention Risk</span>
            <ShieldAlert className="w-4 h-4 text-[#D9675D]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`font-heading text-2xl font-extrabold ${student.riskProbability >= 0.65 ? 'text-[#D9675D]' : student.riskProbability >= 0.40 ? 'text-[#E9A23B]' : 'text-emerald-700'}`}>
              {(student.riskProbability * 100).toFixed(0)}%
            </span>
            <span className="text-[10px] text-[#657582]">probability</span>
          </div>
          <div className="mt-1 text-[10px] text-[#657582] truncate">
            Last assessed: {new Date(student.lastAssessedAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Longitudinal Attendance Timeline & Academic History */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Attendance Timeline */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-[#142B3B]/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#142B3B]/10">
            <div>
              <h3 className="font-heading font-bold text-base text-[#142B3B]">
                Attendance Timeline & Absence Patterns
              </h3>
              <p className="text-xs text-[#657582]">
                10-week longitudinal tracking of daily presence and absence clusters
              </p>
            </div>
          </div>

          {/* Timeline Bar Chart */}
          <div className="space-y-2 pt-2">
            {student.weeklyAttendanceHistory.map((weekData, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <span className="font-mono font-bold w-9 text-[#657582]">{weekData.week}</span>
                <div className="flex-1 bg-[#F8F7F2] h-6 rounded-lg overflow-hidden flex border border-[#142B3B]/5">
                  <div
                    style={{ width: `${weekData.rate}%` }}
                    className={`h-full transition-all flex items-center justify-end pr-2 text-[10px] font-bold text-white ${
                      weekData.rate < 75 ? 'bg-[#D9675D]' :
                      weekData.rate < 82 ? 'bg-[#E9A23B]' :
                      'bg-[#176B68]'
                    }`}
                  >
                    {weekData.rate}%
                  </div>
                </div>
                <div className="w-24 text-[10px] text-right text-[#657582]">
                  {weekData.unexcusedDays > 0 ? (
                    <span className="text-[#D9675D] font-semibold">{weekData.unexcusedDays} unexcused</span>
                  ) : (
                    <span>0 unexcused</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {student.isDriftFlagged && (
            <div className="p-3 bg-[#D9675D]/10 rounded-xl text-xs text-[#D9675D] flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold">Longitudinal Flag: </span>
                <span>{student.driftReason}</span>
              </div>
            </div>
          )}
        </div>

        {/* Academic Assessment Progress */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-[#142B3B]/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#142B3B]/10">
            <div>
              <h3 className="font-heading font-bold text-base text-[#142B3B]">
                Academic Subject Scores
              </h3>
              <p className="text-xs text-[#657582]">
                Term 1 evaluations and submission status
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {student.assessmentHistory.map((as) => (
              <div key={as.id} className="p-3 bg-[#F8F7F2] rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#142B3B]">{as.subject}</div>
                  <div className="text-[11px] text-[#657582]">{as.assessmentName}</div>
                </div>
                <div className="text-right">
                  {as.isMissed ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D9675D]/15 text-[#D9675D]">
                      Missed / 0%
                    </span>
                  ) : (
                    <div className="font-heading font-bold text-sm text-[#142B3B]">{as.score}%</div>
                  )}
                  <div className="text-[10px] text-[#657582]">{as.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Explainable Risk Reports Panel (CORE REQUIREMENT) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#142B3B]/10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#142B3B]/10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176B68] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explainable AI Risk Report</span>
            </div>
            <h3 className="font-heading font-extrabold text-xl text-[#142B3B]">
              Contributing Factors & Diagnostic Rationale
            </h3>
          </div>
          <div className="text-xs text-[#657582] font-mono">
            Model: v1.0.0-techformers • Calibrated RF
          </div>
        </div>

        {/* Factors Breakdown */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-[#142B3B] uppercase tracking-wider">
            Key Signals Influencing Risk Calculation
          </div>

          {student.contributingFactors.map((factor, index) => {
            const isNegative = factor.direction === 'increases_estimated_risk';
            return (
              <div key={index} className="p-4 rounded-2xl bg-[#F8F7F2] border border-[#142B3B]/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-semibold text-[#142B3B]">
                    <span className={`w-2.5 h-2.5 rounded-full ${isNegative ? 'bg-[#D9675D]' : 'bg-emerald-500'}`} />
                    <span>{factor.factor}</span>
                  </div>
                  <span className={`text-[11px] font-mono font-bold ${isNegative ? 'text-[#D9675D]' : 'text-emerald-700'}`}>
                    {isNegative ? `+${(factor.importance * 100).toFixed(0)}% risk weight` : `-${(factor.importance * 100).toFixed(0)}% buffer`}
                  </span>
                </div>

                {/* Relative Importance Bar */}
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, factor.importance * 200)}%` }}
                    className={`h-full rounded-full ${isNegative ? 'bg-[#D9675D]' : 'bg-emerald-500'}`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Suggested Human Review Steps */}
        <div className="p-5 rounded-2xl bg-[#DCE9DF]/40 border border-[#176B68]/20 space-y-3">
          <h4 className="font-heading font-bold text-sm text-[#176B68] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#176B68]" />
            <span>Recommended Educator Action Protocol</span>
          </h4>
          <ol className="list-decimal list-inside text-xs text-[#142B3B] space-y-1.5 leading-relaxed">
            <li>Schedule informal 15-minute alignment check-in with the student during advisory period.</li>
            <li>Consult with parent/guardian regarding morning commute schedule or external obligations.</li>
            <li>Review Mathematics foundational concepts with subject teacher before the next unit exam.</li>
            <li>Launch What-If Intervention Lab to verify school tutoring capacity before committing slots.</li>
          </ol>
        </div>

        {/* Scientific Integrity Disclaimer */}
        <div className="p-4 rounded-2xl bg-[#F8F7F2] text-[11px] text-[#657582] leading-relaxed border border-[#142B3B]/10 space-y-1">
          <div className="font-bold text-[#142B3B] flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#176B68]" />
            <span>Scientific & Ethical Notice: Correlation ≠ Causation</span>
          </div>
          <p>
            Educational risk predictions represent statistical patterns across historical cohorts, not certainties or medical diagnoses. Factors such as attendance drop or missed assignments indicate disengagement opportunities, not fixed student limitations. Mandatory human review by school educators is required before initiating support actions.
          </p>
        </div>
      </div>

      {/* Support Plan History & Follow-Up Tracker */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#142B3B]/10 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#142B3B]/10">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#142B3B]">
              Intervention History & Educator Follow-ups
            </h3>
            <p className="text-xs text-[#657582]">
              Tracked support commitments and longitudinal observations
            </p>
          </div>
          <button
            onClick={() => setShowNoteModal(true)}
            className="px-3.5 py-2 bg-[#176B68] hover:bg-[#208783] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Log Check-in Note</span>
          </button>
        </div>

        {student.supportPlanHistory.length > 0 ? (
          <div className="space-y-4">
            {student.supportPlanHistory.map((plan) => (
              <div key={plan.id} className="p-5 rounded-2xl bg-[#F8F7F2] border border-[#142B3B]/10 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-heading font-bold text-sm text-[#142B3B]">
                      {plan.interventionTitle}
                    </h4>
                    <p className="text-xs text-[#657582] mt-0.5">
                      Assigned to {plan.assignedStaff} • Target Deadline: {plan.deadlineDate}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                    plan.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                    plan.status === 'in_progress' ? 'bg-[#176B68]/15 text-[#176B68]' :
                    'bg-[#E9A23B]/15 text-[#E9A23B]'
                  }`}>
                    {plan.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-[#142B3B] leading-relaxed">
                  {plan.details}
                </p>

                {plan.observedOutcome && (
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs text-emerald-800 space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Observed Milestone Outcome ({plan.observedOutcome.completedAt})</span>
                    </div>
                    <p className="text-[11px] text-emerald-700">
                      {plan.observedOutcome.completionNotes}
                    </p>
                    <div className="text-[10px] text-emerald-600">
                      Attendance Delta: +{plan.observedOutcome.attendanceChange}% • Academic Delta: +{plan.observedOutcome.academicChange} pts
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-[#F8F7F2] rounded-2xl text-center text-xs text-[#657582] space-y-2">
            <p>No active support plan scheduled yet for this student.</p>
            <button
              onClick={() => {
                setSelectedStudentForLab(student);
                navigateTo('/intervention-lab');
              }}
              className="text-[#176B68] font-bold hover:underline"
            >
              Open What-If Intervention Lab to create a support plan →
            </button>
          </div>
        )}

        {/* Past Progress Notes */}
        {student.followUpNotes.length > 0 && (
          <div className="pt-4 border-t border-[#142B3B]/10 space-y-3">
            <div className="text-xs font-bold text-[#142B3B] uppercase tracking-wider">
              Educator Progress Log
            </div>
            <div className="space-y-2">
              {student.followUpNotes.map(fn => (
                <div key={fn.id} className="p-3 bg-white rounded-xl border border-[#142B3B]/10 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[#657582] text-[11px]">
                    <span className="font-semibold text-[#142B3B]">{fn.author}</span>
                    <span>{fn.date}</span>
                  </div>
                  <p className="text-[#142B3B] leading-relaxed">{fn.notes}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Log Check-in Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#142B3B]/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#142B3B]/10 max-w-md w-full p-6 space-y-4">
            <h3 className="font-heading font-bold text-base text-[#142B3B]">
              Log Educator Check-in Note
            </h3>
            <p className="text-xs text-[#657582]">
              Record qualitative observations and updated metrics for {student.pseudonymousId}
            </p>

            <form onSubmit={handleSaveNote} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#142B3B] mb-1">
                  Observations & Conversation Notes *
                </label>
                <textarea
                  rows={4}
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="e.g. Met with student during advisory; discussed morning transportation and reviewed math homework..."
                  className="w-full p-3 bg-[#F8F7F2] border border-[#142B3B]/15 rounded-xl text-xs focus:ring-2 focus:ring-[#176B68]/30 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#142B3B] mb-1">
                    Observed Attendance (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newObservedAtt ?? student.attendanceRate}
                    onChange={(e) => setNewObservedAtt(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F8F7F2] border border-[#142B3B]/15 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#142B3B] mb-1">
                    Observed Score (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newObservedScore ?? student.recentAverage}
                    onChange={(e) => setNewObservedScore(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F8F7F2] border border-[#142B3B]/15 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#657582] hover:bg-[#F8F7F2] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#176B68] text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Save Check-in Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
