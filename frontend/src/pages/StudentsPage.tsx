import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Search, 
  Filter, 
  ArrowUpDown, 
  PlusCircle, 
  Upload, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  RefreshCw,
  SlidersHorizontal,
  FileSpreadsheet
} from 'lucide-react';
import { Student } from '../types';

interface StudentsPageProps {
  onOpenAddModal: () => void;
  onOpenCsvModal: () => void;
}

export const StudentsPage: React.FC<StudentsPageProps> = ({ onOpenAddModal, onOpenCsvModal }) => {
  const { students, navigateTo, setSelectedStudentForLab, reassessStudentRisk } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [followUpFilter, setFollowUpFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'risk' | 'attendance' | 'academic' | 'pseudo'>('risk');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  // Filter logic
  const filteredStudents = students.filter(student => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = student.pseudonymousId.toLowerCase().includes(q);
      const matchStaff = student.assignedStaff.toLowerCase().includes(q);
      const matchIndicator = student.supportIndicators.some(ind => ind.toLowerCase().includes(q));
      if (!matchId && !matchStaff && !matchIndicator) return false;
    }

    // Grade filter
    if (gradeFilter !== 'all' && student.gradeLevel !== gradeFilter) return false;

    // Risk filter
    if (riskFilter !== 'all' && student.prediction !== riskFilter) return false;

    // Follow-up status filter
    if (followUpFilter !== 'all' && student.followUpStatus !== followUpFilter) return false;

    return true;
  });

  // Sort logic
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let factor = sortOrder === 'desc' ? -1 : 1;
    if (sortBy === 'risk') {
      return (a.riskProbability - b.riskProbability) * factor;
    }
    if (sortBy === 'attendance') {
      return (a.attendanceRate - b.attendanceRate) * factor;
    }
    if (sortBy === 'academic') {
      return (a.recentAverage - b.recentAverage) * factor;
    }
    if (sortBy === 'pseudo') {
      return a.pseudonymousId.localeCompare(b.pseudonymousId) * factor;
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedStudents.length / pageSize) || 1;
  const paginatedStudents = sortedStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (field: 'risk' | 'attendance' | 'academic' | 'pseudo') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header and Action Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#142B3B] tracking-tight">
            Student Retention Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#657582] mt-0.5">
            Privacy-protected student records, longitudinal trends, and support statuses ({students.length} total)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 bg-[#176B68] hover:bg-[#208783] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Student</span>
          </button>
          <button
            onClick={onOpenCsvModal}
            className="px-4 py-2 bg-white hover:bg-[#F8F7F2] text-[#142B3B] border border-[#142B3B]/15 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4 text-[#176B68]" />
            <span>Import CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#142B3B]/10 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#657582] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by ID (ST-104), staff, or indicator..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-[#F8F7F2] border border-[#142B3B]/10 rounded-xl text-xs sm:text-sm text-[#142B3B] focus:outline-none focus:ring-2 focus:ring-[#176B68]/30"
            />
          </div>

          {/* Grade Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#657582] font-medium hidden sm:inline">Grade:</span>
            <select
              value={gradeFilter}
              onChange={(e) => { setGradeFilter(e.target.value); setCurrentPage(1); }}
              className="bg-[#F8F7F2] border border-[#142B3B]/10 rounded-xl px-3 py-2 text-xs font-semibold text-[#142B3B] focus:outline-none cursor-pointer"
            >
              <option value="all">All Grades</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
            </select>
          </div>

          {/* Risk Level Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#657582] font-medium hidden sm:inline">Risk:</span>
            <select
              value={riskFilter}
              onChange={(e) => { setRiskFilter(e.target.value); setCurrentPage(1); }}
              className="bg-[#F8F7F2] border border-[#142B3B]/10 rounded-xl px-3 py-2 text-xs font-semibold text-[#142B3B] focus:outline-none cursor-pointer"
            >
              <option value="all">All Risk Levels</option>
              <option value="urgent_review_recommended">Urgent Review</option>
              <option value="review_recommended">Review Recommended</option>
              <option value="on_track">On Track</option>
            </select>
          </div>

          {/* Follow-up Status Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#657582] font-medium hidden sm:inline">Follow-up:</span>
            <select
              value={followUpFilter}
              onChange={(e) => { setFollowUpFilter(e.target.value); setCurrentPage(1); }}
              className="bg-[#F8F7F2] border border-[#142B3B]/10 rounded-xl px-3 py-2 text-xs font-semibold text-[#142B3B] focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="awaiting_follow_up">Awaiting Follow-up</option>
              <option value="completed">Completed</option>
              <option value="none">No Active Plan</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary */}
        <div className="flex items-center justify-between text-xs text-[#657582] pt-1 border-t border-[#142B3B]/5">
          <span>Showing {sortedStudents.length} of {students.length} students</span>
          <div className="flex items-center gap-2">
            <span>Sort:</span>
            <button
              onClick={() => toggleSort('risk')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${sortBy === 'risk' ? 'bg-[#176B68] text-white' : 'hover:bg-slate-100'}`}
            >
              Risk {sortBy === 'risk' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
            <button
              onClick={() => toggleSort('attendance')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${sortBy === 'attendance' ? 'bg-[#176B68] text-white' : 'hover:bg-slate-100'}`}
            >
              Attendance {sortBy === 'attendance' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
            <button
              onClick={() => toggleSort('academic')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${sortBy === 'academic' ? 'bg-[#176B68] text-white' : 'hover:bg-slate-100'}`}
            >
              Grade {sortBy === 'academic' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
          </div>
        </div>
      </div>

      {/* Student Cards / Table */}
      <div className="bg-white rounded-2xl border border-[#142B3B]/10 shadow-sm overflow-hidden">
        {sortedStudents.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-10 h-10 text-[#657582] mx-auto opacity-40" />
            <h3 className="font-heading font-bold text-base text-[#142B3B]">No student records match these filters</h3>
            <p className="text-xs text-[#657582] max-w-sm mx-auto">
              Try resetting your search query or adjusting the grade and risk level filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setGradeFilter('all');
                setRiskFilter('all');
                setFollowUpFilter('all');
              }}
              className="px-4 py-2 bg-[#F8F7F2] text-[#176B68] text-xs font-bold rounded-xl hover:bg-[#DCE9DF] transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#142B3B] text-white text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4">Attendance Rate</th>
                  <th className="py-3 px-4">Recent Average</th>
                  <th className="py-3 px-4">Absence Trend</th>
                  <th className="py-3 px-4">Retention Risk</th>
                  <th className="py-3 px-4">Follow-up Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#142B3B]/10">
                {paginatedStudents.map((student) => {
                  return (
                    <tr 
                      key={student.id} 
                      className="hover:bg-[#F8F7F2]/80 transition-colors cursor-pointer group"
                      onClick={() => navigateTo(`/students/${student.id}`)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#176B68] group-hover:underline">
                            {student.pseudonymousId}
                          </span>
                          {student.isDriftFlagged && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#D9675D]/15 text-[#D9675D]" title={student.driftReason}>
                              Drift
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#657582] truncate max-w-[160px]">
                          {student.assignedStaff}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-[#142B3B]">
                        {student.gradeLevel} <span className="text-[#657582]">({student.section})</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold ${
                            student.attendanceRate < 75 ? 'text-[#D9675D]' :
                            student.attendanceRate < 82 ? 'text-[#E9A23B]' :
                            'text-emerald-700'
                          }`}>
                            {student.attendanceRate}%
                          </span>
                          {student.attendanceRate < 82 && (
                            <span className="text-[9px] text-[#D9675D] font-mono">(&lt;82%)</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-[#142B3B]">{student.recentAverage}%</span>
                          <span className={`text-[10px] font-mono ${student.recentAverage - student.previousAverage < 0 ? 'text-[#D9675D]' : 'text-emerald-700'}`}>
                            ({student.recentAverage - student.previousAverage > 0 ? '+' : ''}{(student.recentAverage - student.previousAverage).toFixed(0)})
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          student.recentAbsenceTrend === 'critical' ? 'bg-[#D9675D]/15 text-[#D9675D]' :
                          student.recentAbsenceTrend === 'increasing' ? 'bg-[#E9A23B]/15 text-[#E9A23B]' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {student.recentAbsenceTrend}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          student.prediction === 'urgent_review_recommended' ? 'bg-[#D9675D]/15 text-[#D9675D]' :
                          student.prediction === 'review_recommended' ? 'bg-[#E9A23B]/15 text-[#E9A23B]' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {(student.riskProbability * 100).toFixed(0)}% Risk
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          student.followUpStatus === 'in_progress' ? 'bg-[#176B68]/15 text-[#176B68]' :
                          student.followUpStatus === 'planned' ? 'bg-[#E9A23B]/15 text-[#E9A23B]' :
                          student.followUpStatus === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-slate-100 text-[#657582]'
                        }`}>
                          {student.followUpStatus.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedStudentForLab(student);
                              navigateTo('/intervention-lab');
                            }}
                            className="p-1.5 bg-[#DCE9DF] hover:bg-[#DCE9DF]/80 text-[#176B68] rounded-lg transition-colors"
                            title="Launch Intervention Lab for this student"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => navigateTo(`/students/${student.id}`)}
                            className="px-2.5 py-1 bg-[#142B3B] hover:bg-[#142B3B]/90 text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"
                          >
                            <span>Profile</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {sortedStudents.length > pageSize && (
          <div className="p-4 border-t border-[#142B3B]/10 flex items-center justify-between text-xs text-[#657582] bg-[#F8F7F2]/50">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-3 py-1 bg-white border border-[#142B3B]/10 rounded-lg font-semibold hover:bg-[#F8F7F2] disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="px-3 py-1 bg-white border border-[#142B3B]/10 rounded-lg font-semibold hover:bg-[#F8F7F2] disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
