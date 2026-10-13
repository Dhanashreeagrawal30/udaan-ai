import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, UserPlus, Sparkles, AlertCircle } from 'lucide-react';
import { AbsenceTrend } from '../types';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose }) => {
  const { addStudent, students } = useApp();

  const nextIndex = students.length + 105;
  const [pseudoId, setPseudoId] = useState(`ST-${nextIndex}`);
  const [gradeLevel, setGradeLevel] = useState<'Grade 9' | 'Grade 10' | 'Grade 11' | 'Grade 12'>('Grade 10');
  const [section, setSection] = useState('A');
  const [attendanceRate, setAttendanceRate] = useState<number>(75);
  const [recentAverage, setRecentAverage] = useState<number>(62);
  const [previousAverage, setPreviousAverage] = useState<number>(74);
  const [absenceTrend, setAbsenceTrend] = useState<AbsenceTrend>('increasing');
  const [missedAssessments, setMissedAssessments] = useState<number>(1);
  const [assignedStaff, setAssignedStaff] = useState('Ms. Priya Sharma');
  const [indicators, setIndicators] = useState('Mathematics hesitation, Recent absence cluster');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!pseudoId.trim()) {
      setError('Pseudonymous student ID is required (e.g. ST-105).');
      return;
    }

    if (attendanceRate < 0 || attendanceRate > 100) {
      setError('Attendance rate must be between 0% and 100%.');
      return;
    }

    if (recentAverage < 0 || recentAverage > 100) {
      setError('Recent average must be between 0% and 100%.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addStudent({
        pseudonymousId: pseudoId.trim().toUpperCase(),
        gradeLevel,
        section,
        academicYear: '2025-2026',
        attendanceRate: Number(attendanceRate),
        recentAverage: Number(recentAverage),
        previousAverage: Number(previousAverage),
        recentAbsenceTrend: absenceTrend,
        missedAssessments: Number(missedAssessments),
        homeworkCompletionRate: Math.round(Number(attendanceRate) * 0.7 + Number(recentAverage) * 0.3),
        riskProbability: 0.5,
        prediction: 'review_recommended',
        assignedStaff,
        followUpStatus: 'none',
        lastAssessedAt: new Date().toISOString(),
        reportingPeriod: 'Term 1 (Weeks 1-10)',
        supportIndicators: indicators.split(',').map(s => s.trim()).filter(Boolean)
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to enroll student');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#142B3B]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#142B3B]/10 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-[#142B3B]/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#176B68]/10 text-[#176B68] rounded-xl">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-[#142B3B]">Enroll Student Record</h3>
              <p className="text-xs text-[#657582]">Privacy-first pseudonymized student intake</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#657582] hover:bg-[#F8F7F2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#142B3B] mb-1">
                Pseudonymous ID *
              </label>
              <input
                type="text"
                value={pseudoId}
                onChange={(e) => setPseudoId(e.target.value)}
                placeholder="ST-105"
                className="w-full px-3 py-2 bg-[#F8F7F2] border border-[#142B3B]/15 rounded-xl text-xs sm:text-sm font-mono focus:ring-2 focus:ring-[#176B68]/30 focus:border-[#176B68] focus:outline-none"
                required
              />
              <span className="text-[10px] text-[#657582]">Masked for student privacy</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#142B3B] mb-1">
                Grade & Section *
              </label>
              <div className="flex gap-2">
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value as any)}
                  className="flex-1 px-3 py-2 bg-[#F8F7F2] border border-[#142B3B]/15 rounded-xl text-xs focus:ring-2 focus:ring-[#176B68]/30 focus:outline-none"
                >
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-16 px-2 py-2 bg-[#F8F7F2] border border-[#142B3B]/15 rounded-xl text-xs focus:outline-none"
                >
                  <option value="A">Sec A</option>
                  <option value="B">Sec B</option>
                  <option value="C">Sec C</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#142B3B] mb-1">
                Attendance Rate (%) *
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={attendanceRate}
                onChange={(e) => setAttendanceRate(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#F8F7F2] border border-[#142B3B]/15 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68]/30 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#142B3B] mb-1">
                Absence Velocity Trend *
              </label>
              <select
                value={absenceTrend}
                onChange={(e) => setAbsenceTrend(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#F8F7F2] border border-[#142B3B]/15 rounded-xl text-xs focus:ring-2 focus:ring-[#176B68]/30 focus:outline-none"
              >
                <option value="stable">Stable (Routine)</option>
                <option value="increasing">Increasing (Spike noticed)</option>
                <option value="critical">Critical (Accelerating absences)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#142B3B] mb-1">
                Recent Assessment Avg (%) *
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={recentAverage}
                onChange={(e) => setRecentAverage(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#F8F7F2] border border-[#142B3B]/15 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68]/30 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#142B3B] mb-1">
                Prior Term Baseline (%) *
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={previousAverage}
                onChange={(e) => setPreviousAverage(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#F8F7F2] border border-[#142B3B]/15 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68]/30 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#142B3B] mb-1">
                Missed Assessments (Count)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={missedAssessments}
                onChange={(e) => setMissedAssessments(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#F8F7F2] border border-[#142B3B]/15 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68]/30 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#142B3B] mb-1">
                Assigned Staff Member
              </label>
              <input
                type="text"
                value={assignedStaff}
                onChange={(e) => setAssignedStaff(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8F7F2] border border-[#142B3B]/15 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68]/30 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#142B3B] mb-1">
              Support Context Indicators (Comma-separated)
            </label>
            <input
              type="text"
              value={indicators}
              onChange={(e) => setIndicators(e.target.value)}
              placeholder="e.g. Sibling care, Math struggle, Bus route change"
              className="w-full px-3 py-2 bg-[#F8F7F2] border border-[#142B3B]/15 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68]/30 focus:outline-none"
            />
          </div>

          <div className="p-3 bg-[#DCE9DF]/40 rounded-xl text-[11px] text-[#142B3B] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#176B68] flex-shrink-0" />
            <span>
              Real ML inference will be automatically computed immediately upon saving this record.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#657582] hover:bg-[#F8F7F2] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold bg-[#176B68] hover:bg-[#208783] text-white rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Running ML Inference...</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Enroll & Assess Risk</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
