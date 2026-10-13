import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  Calendar, 
  Search, 
  Filter, 
  Sparkles, 
  PlusCircle, 
  ArrowRight,
  TrendingUp,
  HelpCircle
} from 'lucide-react';
import { FollowUpStatus, SupportPlan } from '../types';

export const FollowUpsPage: React.FC = () => {
  const { students, updateSupportPlanStatus, navigateTo } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPlanForUpdate, setSelectedPlanForUpdate] = useState<SupportPlan | null>(null);
  const [newStatus, setNewStatus] = useState<FollowUpStatus>('completed');
  const [outcomeNotes, setOutcomeNotes] = useState<string>('');
  const [observedAtt, setObservedAtt] = useState<number>(80);
  const [observedScore, setObservedScore] = useState<number>(65);

  // Aggregate all support plans across all students
  const allPlans: SupportPlan[] = [];
  students.forEach(student => {
    student.supportPlanHistory.forEach(plan => {
      allPlans.push(plan);
    });
  });

  const filteredPlans = allPlans.filter(plan => {
    if (statusFilter !== 'all' && plan.status !== statusFilter) return false;
    return true;
  });

  const handleOpenUpdateModal = (plan: SupportPlan) => {
    setSelectedPlanForUpdate(plan);
    setNewStatus(plan.status === 'in_progress' ? 'completed' : 'in_progress');
    setObservedAtt(plan.baselineAttendance + 5);
    setObservedScore(plan.baselineAcademic + 8);
    setOutcomeNotes('');
  };

  const handleSaveUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForUpdate) return;

    updateSupportPlanStatus(
      selectedPlanForUpdate.id,
      newStatus,
      outcomeNotes || `Status updated to ${newStatus.replace('_', ' ')}.`,
      observedAtt,
      observedScore
    );

    setSelectedPlanForUpdate(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#142B3B]/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE9DF] text-[#176B68] text-xs font-bold mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Active Accountability & Learning Loop</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#142B3B] tracking-tight">
            Intervention Follow-up Tracker
          </h1>
          <p className="text-xs sm:text-sm text-[#657582] mt-1 max-w-2xl leading-relaxed">
            Monitor educator commitments, log observational check-in notes, and track student response trajectories over scheduled review milestones ({allPlans.length} active plans).
          </p>
        </div>

        <button
          onClick={() => navigateTo('/intervention-lab')}
          className="px-4 py-2.5 bg-[#176B68] hover:bg-[#208783] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-[#DCE9DF]" />
          <span>New Support Plan</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl p-4 border border-[#142B3B]/10 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[#657582] font-semibold mr-2">Filter by Status:</span>
          {['all', 'planned', 'in_progress', 'awaiting_follow_up', 'completed', 'reassessment_needed'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-[#142B3B] text-white'
                  : 'bg-[#F8F7F2] text-[#657582] hover:bg-[#DCE9DF]/50'
              }`}
            >
              {st === 'all' ? 'All Plans' : st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <span className="text-xs text-[#657582] font-medium">
          Showing {filteredPlans.length} records
        </span>
      </div>

      {/* Support Plans List */}
      <div className="space-y-4">
        {filteredPlans.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#142B3B]/10 space-y-3">
            <Clock className="w-10 h-10 text-[#657582] mx-auto opacity-40" />
            <h3 className="font-heading font-bold text-base text-[#142B3B]">
              No support plans match this status filter
            </h3>
            <p className="text-xs text-[#657582] max-w-sm mx-auto">
              Create an intervention package in the What-If Lab to start tracking scheduled student checkpoints.
            </p>
            <button
              onClick={() => navigateTo('/intervention-lab')}
              className="px-4 py-2 bg-[#176B68] text-white text-xs font-bold rounded-xl shadow-sm"
            >
              Launch Intervention Lab
            </button>
          </div>
        ) : (
          filteredPlans.map(plan => {
            const student = students.find(s => s.id === plan.studentId || s.pseudonymousId === plan.studentPseudo);

            return (
              <div 
                key={plan.id}
                className="bg-white rounded-3xl p-6 border border-[#142B3B]/10 shadow-sm space-y-4 hover:border-[#176B68] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#142B3B]/10">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-lg text-[#142B3B]">
                      {plan.studentPseudo}
                    </span>
                    <span className="text-xs text-[#657582]">
                      Assigned to <span className="font-semibold text-[#142B3B]">{plan.assignedStaff}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                      plan.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                      plan.status === 'in_progress' ? 'bg-[#176B68]/15 text-[#176B68]' :
                      plan.status === 'planned' ? 'bg-[#E9A23B]/15 text-[#E9A23B]' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {plan.status.replace(/_/g, ' ')}
                    </span>
                    <button
                      onClick={() => handleOpenUpdateModal(plan)}
                      className="px-3 py-1 bg-[#176B68] hover:bg-[#208783] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                    >
                      Update Status
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-heading font-bold text-sm text-[#142B3B]">
                    {plan.interventionTitle}
                  </h4>
                  <p className="text-xs text-[#657582] leading-relaxed">
                    {plan.details}
                  </p>
                </div>

                {/* Leading Indicators & Target Deadline */}
                <div className="grid sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-[#F8F7F2] rounded-xl border border-[#142B3B]/5">
                    <div className="text-[10px] text-[#657582]">Target Review Deadline</div>
                    <div className="font-bold text-[#142B3B] mt-0.5">{plan.deadlineDate}</div>
                    <div className="text-[10px] text-[#176B68] mt-0.5">Created: {plan.createdDate}</div>
                  </div>

                  <div className="p-3 bg-[#F8F7F2] rounded-xl border border-[#142B3B]/5">
                    <div className="text-[10px] text-[#657582]">Baseline at Intake</div>
                    <div className="font-bold text-[#142B3B] mt-0.5">
                      Att: {plan.baselineAttendance}% • Score: {plan.baselineAcademic}%
                    </div>
                  </div>

                  <div className="p-3 bg-[#F8F7F2] rounded-xl border border-[#142B3B]/5">
                    <div className="text-[10px] text-[#657582]">Triggering Warning Signal</div>
                    <div className="font-bold text-[#D9675D] mt-0.5 truncate">
                      {plan.primaryWarningSignal}
                    </div>
                  </div>
                </div>

                {/* Observed Outcome Milestone if completed */}
                {plan.observedOutcome && (
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Observed Milestone Progress ({plan.observedOutcome.completedAt})</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 leading-relaxed">
                      {plan.observedOutcome.completionNotes}
                    </p>
                    <div className="text-[10px] text-emerald-600 font-semibold pt-1">
                      Observed Attendance Shift: +{plan.observedOutcome.attendanceChange}% • Observed Assessment Shift: +{plan.observedOutcome.academicChange} pts
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Scientific Principle Reminder */}
      <div className="p-4 rounded-2xl bg-white border border-[#142B3B]/10 text-[11px] text-[#657582] flex items-start gap-2.5 shadow-sm">
        <HelpCircle className="w-4 h-4 text-[#176B68] mt-0.5 flex-shrink-0" />
        <p className="leading-relaxed">
          <span className="font-bold text-[#142B3B]">Methodological Integrity Note: </span>
          Observed student attendance or grade improvements after support are recorded as correlated longitudinal changes, never proven causal certainties. Multiple external factors influence adolescent trajectories.
        </p>
      </div>

      {/* Update Status Modal */}
      {selectedPlanForUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#142B3B]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#142B3B]/10 max-w-md w-full p-6 space-y-4">
            <h3 className="font-heading font-bold text-base text-[#142B3B]">
              Update Support Plan Status
            </h3>
            <p className="text-xs text-[#657582]">
              Record milestone outcome for {selectedPlanForUpdate.studentPseudo}
            </p>

            <form onSubmit={handleSaveUpdate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#142B3B] mb-1">
                  New Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#F8F7F2] border border-[#142B3B]/15 rounded-xl text-xs font-semibold focus:outline-none"
                >
                  <option value="in_progress">In Progress</option>
                  <option value="awaiting_follow_up">Awaiting Follow-up</option>
                  <option value="completed">Completed (Milestone Achieved)</option>
                  <option value="reassessment_needed">Reassessment Needed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142B3B] mb-1">
                  Observed Outcome & Educator Notes *
                </label>
                <textarea
                  rows={3}
                  value={outcomeNotes}
                  onChange={(e) => setOutcomeNotes(e.target.value)}
                  placeholder="e.g. Completed 4 peer math sessions; student expressed greater confidence; attendance reached 78%..."
                  className="w-full p-2.5 bg-[#F8F7F2] border border-[#142B3B]/15 rounded-xl text-xs focus:ring-2 focus:ring-[#176B68]/30 focus:outline-none"
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
                    value={observedAtt}
                    onChange={(e) => setObservedAtt(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F8F7F2] border border-[#142B3B]/15 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#142B3B] mb-1">
                    Observed Assessment Avg (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={observedScore}
                    onChange={(e) => setObservedScore(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F8F7F2] border border-[#142B3B]/15 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPlanForUpdate(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#657582] hover:bg-[#F8F7F2] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#176B68] text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Confirm Status Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
