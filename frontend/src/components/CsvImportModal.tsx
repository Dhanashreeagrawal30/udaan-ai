import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Upload, FileText, CheckCircle2, AlertTriangle, Download, ArrowRight } from 'lucide-react';
import Papa from 'papaparse';
import { Student, AbsenceTrend } from '../types';
import { inferStudentRiskClientSide } from '../services/mlEngine';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RowError {
  row: number;
  message: string;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({ isOpen, onClose }) => {
  const { importStudents, addToast } = useApp();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rowErrors, setRowErrors] = useState<RowError[]>([]);
  const [validStudents, setValidStudents] = useState<Student[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview' | 'complete'>('upload');

  if (!isOpen) return null;

  const downloadTemplate = () => {
    const templateData = `pseudonymous_id,grade_level,section,attendance_rate,recent_average,previous_average,recent_absence_trend,missed_assessments,assigned_staff,support_indicators
ST-701,Grade 10,A,74.5,56.0,72.0,increasing,2,Ms. Priya Sharma,Math difficulty; Commute issues
ST-702,Grade 11,B,66.0,49.5,70.0,critical,3,Mr. David Chen,Attendance drop; Chemistry backlog
ST-703,Grade 9,C,88.0,78.0,75.0,stable,0,Ms. Anita Desai,Sports team; On track`;

    const blob = new Blob([templateData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'udaan_student_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (file: File) => {
    setCsvFile(file);
    setRowErrors([]);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setHeaders(results.meta.fields || []);
        processData(results.data);
      },
      error: (err) => {
        setRowErrors([{ row: 0, message: `Failed to parse CSV: ${err.message}` }]);
      }
    });
  };

  const processData = (rows: any[]) => {
    const errors: RowError[] = [];
    const validList: Student[] = [];

    rows.forEach((row, idx) => {
      const rowNum = idx + 2; // header is row 1
      const pseudoId = row.pseudonymous_id || row.student_id || row.id;

      if (!pseudoId || !pseudoId.trim()) {
        errors.push({ row: rowNum, message: 'Missing pseudonymous student ID' });
        return;
      }

      const attRate = parseFloat(row.attendance_rate || row.attendance);
      if (isNaN(attRate) || attRate < 0 || attRate > 100) {
        errors.push({ row: rowNum, message: `Invalid attendance rate "${row.attendance_rate}" (Must be 0-100)` });
        return;
      }

      const recAvg = parseFloat(row.recent_average || row.recent_score || row.average);
      if (isNaN(recAvg) || recAvg < 0 || recAvg > 100) {
        errors.push({ row: rowNum, message: `Invalid recent average "${row.recent_average}" (Must be 0-100)` });
        return;
      }

      const prevAvg = parseFloat(row.previous_average || row.prior_average || recAvg.toString());
      const rawTrend = (row.recent_absence_trend || row.trend || 'stable').toLowerCase();
      const trend: AbsenceTrend = (rawTrend === 'critical' || rawTrend === 'increasing') ? rawTrend : 'stable';
      const missed = parseInt(row.missed_assessments || '0', 10) || 0;

      // Predict risk
      const inference = inferStudentRiskClientSide({
        student_id: pseudoId.trim().toUpperCase(),
        features: {
          attendance_rate: attRate,
          recent_average: recAvg,
          previous_average: isNaN(prevAvg) ? recAvg : prevAvg,
          recent_absence_trend: trend,
          missed_assessments: missed
        }
      });

      const student: Student = {
        id: `csv-${Date.now()}-${idx}`,
        pseudonymousId: pseudoId.trim().toUpperCase(),
        gradeLevel: (row.grade_level || 'Grade 10') as any,
        section: row.section || 'A',
        academicYear: '2025-2026',
        attendanceRate: attRate,
        recentAverage: recAvg,
        previousAverage: isNaN(prevAvg) ? recAvg : prevAvg,
        recentAbsenceTrend: trend,
        missedAssessments: missed,
        homeworkCompletionRate: Math.round(attRate * 0.7 + recAvg * 0.3),
        riskProbability: inference.risk_probability,
        prediction: inference.prediction,
        assignedStaff: row.assigned_staff || 'Academic Counseling Desk',
        followUpStatus: 'none',
        lastAssessedAt: new Date().toISOString(),
        reportingPeriod: 'Term 1 (Weeks 1-10)',
        supportIndicators: (row.support_indicators || '')
          .split(';')
          .map((s: string) => s.trim())
          .filter(Boolean),
        weeklyAttendanceHistory: [
          { week: 'W1', rate: Math.min(100, attRate + 3), presentDays: 5, unexcusedDays: 0, excusedDays: 0 },
          { week: 'W2', rate: attRate, presentDays: 4, unexcusedDays: 1, excusedDays: 0 }
        ],
        assessmentHistory: [
          { id: `as-csv-${idx}`, subject: 'Term 1 Review', assessmentName: 'Standard Diagnostic', score: recAvg, term: 'Term 1', date: new Date().toISOString().slice(0, 10) }
        ],
        contributingFactors: inference.contributing_factors,
        supportPlanHistory: [],
        followUpNotes: []
      };

      validList.push(student);
    });

    setParsedRows(rows);
    setRowErrors(errors);
    setValidStudents(validList);
    setStep('preview');
  };

  const handleConfirmImport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      importStudents(validStudents);
      setIsProcessing(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#142B3B]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#142B3B]/10 max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#142B3B]/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#176B68]/10 text-[#176B68] rounded-xl">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-[#142B3B]">Bulk CSV Student Import</h3>
              <p className="text-xs text-[#657582]">Seamless data integration with automatic ML validation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#657582] hover:bg-[#F8F7F2]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {step === 'upload' && (
            <div className="space-y-4">
              <div 
                className="border-2 border-dashed border-[#176B68]/30 rounded-2xl p-8 text-center hover:border-[#176B68] transition-colors bg-[#F8F7F2]/50 cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileUpload(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.csv';
                  input.onchange = (e: any) => {
                    if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                  };
                  input.click();
                }}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#DCE9DF] text-[#176B68] flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="font-heading font-bold text-sm text-[#142B3B]">
                  Click to select CSV or drag file here
                </h4>
                <p className="text-xs text-[#657582] mt-1">
                  Supports comma-delimited UTF-8 CSV files with pseudonymous headers
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F8F7F2] rounded-xl border border-[#142B3B]/10">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#176B68]" />
                  <span className="text-xs font-medium text-[#142B3B]">Need the exact CSV format?</span>
                </div>
                <button
                  type="button"
                  onClick={downloadTemplate}
                  className="px-3 py-1.5 text-xs font-semibold text-[#176B68] bg-white rounded-lg border border-[#176B68]/30 hover:bg-[#DCE9DF]/50 flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Sample Template</span>
                </button>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#142B3B]">Import Summary</h4>
                  <p className="text-xs text-[#657582]">
                    Total records found: {parsedRows.length} • Valid: {validStudents.length} • Flagged errors: {rowErrors.length}
                  </p>
                </div>
                <button
                  onClick={() => setStep('upload')}
                  className="text-xs text-[#176B68] font-semibold hover:underline"
                >
                  Upload different file
                </button>
              </div>

              {rowErrors.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-amber-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Row Validation Warnings ({rowErrors.length})</span>
                  </div>
                  <ul className="list-disc list-inside text-amber-700 text-[11px] max-h-24 overflow-y-auto">
                    {rowErrors.map((err, i) => (
                      <li key={i}>Row {err.row}: {err.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Preview Table */}
              <div className="border border-[#142B3B]/10 rounded-xl overflow-hidden max-h-56 overflow-y-auto text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#142B3B] text-white text-[11px] uppercase tracking-wider sticky top-0">
                    <tr>
                      <th className="p-2.5">ID</th>
                      <th className="p-2.5">Grade</th>
                      <th className="p-2.5">Attendance</th>
                      <th className="p-2.5">Recent Avg</th>
                      <th className="p-2.5">Trend</th>
                      <th className="p-2.5">Predicted Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#142B3B]/10">
                    {validStudents.slice(0, 5).map((s) => (
                      <tr key={s.id} className="hover:bg-[#F8F7F2]">
                        <td className="p-2.5 font-mono font-bold text-[#142B3B]">{s.pseudonymousId}</td>
                        <td className="p-2.5 text-[#657582]">{s.gradeLevel}</td>
                        <td className="p-2.5 font-semibold">{s.attendanceRate}%</td>
                        <td className="p-2.5 font-semibold">{s.recentAverage}%</td>
                        <td className="p-2.5 capitalize text-[#657582]">{s.recentAbsenceTrend}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.prediction === 'urgent_review_recommended'
                              ? 'bg-[#D9675D]/15 text-[#D9675D]'
                              : s.prediction === 'review_recommended'
                              ? 'bg-[#E9A23B]/15 text-[#E9A23B]'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {(s.riskProbability * 100).toFixed(0)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#142B3B]/10 flex items-center justify-end gap-3 bg-[#F8F7F2]/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#657582] hover:bg-[#F8F7F2] rounded-xl"
          >
            Cancel
          </button>
          {step === 'preview' && (
            <button
              onClick={handleConfirmImport}
              disabled={validStudents.length === 0 || isProcessing}
              className="px-5 py-2 text-xs font-bold bg-[#176B68] hover:bg-[#208783] text-white rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Import {validStudents.length} Valid Records</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
