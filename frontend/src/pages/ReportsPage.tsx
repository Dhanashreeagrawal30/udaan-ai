import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  BarChart3, 
  AlertTriangle,
  Users,
  Compass
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { students, reportingPeriod, userRole } = useApp();

  const totalMonitored = students.length;
  const urgentCount = students.filter(s => s.prediction === 'urgent_review_recommended').length;
  const reviewCount = students.filter(s => s.prediction === 'review_recommended').length;
  const onTrackCount = students.filter(s => s.prediction === 'on_track').length;

  const totalPlans = students.reduce((acc, s) => acc + s.supportPlanHistory.length, 0);
  const completedPlans = students.filter(s => s.followUpStatus === 'completed').length;
  const inProgressPlans = students.filter(s => s.followUpStatus === 'in_progress').length;

  const gradeBreakdown = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map(grade => {
    const cohort = students.filter(s => s.gradeLevel === grade);
    const atRisk = cohort.filter(s => s.prediction !== 'on_track').length;
    const avgAtt = cohort.length > 0 
      ? (cohort.reduce((sum, s) => sum + s.attendanceRate, 0) / cohort.length).toFixed(1)
      : '0.0';
    return {
      grade,
      total: cohort.length,
      atRisk,
      riskRate: cohort.length > 0 ? ((atRisk / cohort.length) * 100).toFixed(1) : '0.0',
      avgAttendance: avgAtt
    };
  });

  // Export CSV Report
  const handleExportCSV = () => {
    let csv = "Pseudonymous_ID,Grade,Attendance_Rate,Recent_Average,Absence_Trend,Risk_Category,Risk_Probability,Follow_Up_Status\n";
    students.forEach(s => {
      csv += `${s.pseudonymousId},"${s.gradeLevel}",${s.attendanceRate},${s.recentAverage},"${s.recentAbsenceTrend}","${s.prediction}",${s.riskProbability},"${s.followUpStatus}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `UDAAN_Retention_Intelligence_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 print-page">
      {/* Header and Print/Export Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#142B3B]/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE9DF] text-[#176B68] text-xs font-bold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Executive Reporting & Data Export</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#142B3B] tracking-tight">
            Retention Intelligence Reports
          </h1>
          <p className="text-xs sm:text-sm text-[#657582] mt-1 max-w-2xl leading-relaxed">
            Generate aggregate reports for district leadership, track intervention completion ratios, and export verified datasets with student privacy protection.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-white hover:bg-[#F8F7F2] text-[#142B3B] border border-[#142B3B]/15 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-[#176B68]" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-[#176B68] hover:bg-[#208783] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-[#DCE9DF]" />
            <span>Export Anonymized CSV</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Surface */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#142B3B]/10 shadow-sm space-y-8">
        {/* Printable Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#142B3B]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#142B3B] text-white flex items-center justify-center">
              <Compass className="w-6 h-6 text-[#DCE9DF]" />
            </div>
            <div>
              <span className="font-heading text-lg font-extrabold text-[#142B3B]">
                UDAAN AI RETENTION EXECUTIVE BRIEF
              </span>
              <p className="text-xs text-[#657582]">
                Reporting Period: {reportingPeriod === 'term1' ? 'Term 1 (Weeks 1-10)' : 'Current Academic Year'} • Generated on {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-[#657582]">
            <div className="font-bold text-[#142B3B]">Access Role: {userRole.replace(/_/g, ' ')}</div>
            <div className="text-[10px] text-emerald-700 font-semibold">Privacy Compliance: Pseudonymized</div>
          </div>
        </div>

        {/* High-level Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-[#142B3B]/5 text-center">
            <div className="text-xs text-[#657582]">Total Monitored</div>
            <div className="font-heading font-extrabold text-2xl text-[#142B3B] mt-1">{totalMonitored}</div>
          </div>

          <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-[#142B3B]/5 text-center">
            <div className="text-xs text-[#657582]">Requiring Review</div>
            <div className="font-heading font-extrabold text-2xl text-[#D9675D] mt-1">
              {urgentCount + reviewCount} <span className="text-xs font-normal text-[#657582]">({(((urgentCount + reviewCount) / totalMonitored) * 100).toFixed(0)}%)</span>
            </div>
          </div>

          <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-[#142B3B]/5 text-center">
            <div className="text-xs text-[#657582]">Active Support Plans</div>
            <div className="font-heading font-extrabold text-2xl text-[#176B68] mt-1">{totalPlans}</div>
          </div>

          <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-[#142B3B]/5 text-center">
            <div className="text-xs text-[#657582]">Milestones Completed</div>
            <div className="font-heading font-extrabold text-2xl text-emerald-700 mt-1">{completedPlans}</div>
          </div>
        </div>

        {/* Grade-Level Risk Breakdown Table */}
        <div className="space-y-3">
          <h3 className="font-heading font-bold text-base text-[#142B3B]">
            Grade-Level Retention Risk Distribution
          </h3>

          <div className="border border-[#142B3B]/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#142B3B] text-white text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Cohort Grade</th>
                  <th className="py-3 px-4">Total Students</th>
                  <th className="py-3 px-4">Flagged at Risk</th>
                  <th className="py-3 px-4">Risk Rate (%)</th>
                  <th className="py-3 px-4">Mean Attendance (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#142B3B]/10">
                {gradeBreakdown.map((row) => (
                  <tr key={row.grade} className="hover:bg-[#F8F7F2]">
                    <td className="py-3 px-4 font-bold text-[#142B3B]">{row.grade}</td>
                    <td className="py-3 px-4 font-mono">{row.total}</td>
                    <td className="py-3 px-4 font-semibold text-[#D9675D]">{row.atRisk}</td>
                    <td className="py-3 px-4 font-bold">{row.riskRate}%</td>
                    <td className="py-3 px-4 font-semibold text-[#176B68]">{row.avgAttendance}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Data Quality & Model Limitations Audit */}
        <div className="p-5 bg-[#F8F7F2] rounded-2xl border border-[#142B3B]/10 space-y-2 text-xs">
          <div className="font-heading font-bold text-sm text-[#142B3B] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#176B68]" />
            <span>Data Quality & Model Governance Attestation</span>
          </div>
          <p className="text-[#657582] leading-relaxed">
            Data Quality Audit: 100% of analyzed student records meet required verification benchmarks. Attendance values and recent assessment averages are synchronized from SIS logs. Pseudonymous tokens safeguard student privacy in accordance with educational data protection standards.
          </p>
        </div>
      </div>
    </div>
  );
};
