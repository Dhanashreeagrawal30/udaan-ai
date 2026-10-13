import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Activity, 
  TrendingDown, 
  AlertTriangle, 
  ShieldAlert, 
  SlidersHorizontal, 
  Sparkles, 
  BarChart3, 
  ArrowRight, 
  HelpCircle,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { fetchModelMetrics } from '../services/api';
import { ModelMetricsInfo } from '../types';

export const RiskAnalysisPage: React.FC = () => {
  const { students, navigateTo, setSelectedStudentForLab } = useApp();

  const [activeTab, setActiveTab] = useState<'drift' | 'model_metrics'>('drift');
  const [driftThreshold, setDriftThreshold] = useState<'standard' | 'sensitive' | 'conservative'>('standard');
  const [modelMetrics, setModelMetrics] = useState<ModelMetricsInfo | null>(null);

  useEffect(() => {
    fetchModelMetrics().then(setModelMetrics);
  }, []);

  // Filter students exhibiting statistical drift
  const driftStudents = students.filter(s => {
    const attDrop = 100 - s.attendanceRate;
    const gradeDrop = s.previousAverage - s.recentAverage;

    if (driftThreshold === 'sensitive') {
      return attDrop > 12 || gradeDrop > 10 || s.missedAssessments >= 1;
    }
    if (driftThreshold === 'conservative') {
      return attDrop > 25 || gradeDrop > 20 || s.missedAssessments >= 3;
    }
    // Standard
    return attDrop > 18 || gradeDrop > 14 || s.missedAssessments >= 2;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#142B3B]/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE9DF] text-[#176B68] text-xs font-bold mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Time-Series Trajectory Analysis</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#142B3B] tracking-tight">
            Risk Analytics & Drift Detector
          </h1>
          <p className="text-xs sm:text-sm text-[#657582] mt-1 max-w-2xl leading-relaxed">
            Detect meaningful trajectory shifts before students reach severe disengagement. Statistical drift filters distinguish transient fluctuations from chronic decline.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#F8F7F2] p-1.5 rounded-2xl border border-[#142B3B]/10 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('drift')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'drift'
                ? 'bg-white text-[#142B3B] shadow-sm'
                : 'text-[#657582] hover:text-[#142B3B]'
            }`}
          >
            Drift Detector ({driftStudents.length})
          </button>
          <button
            onClick={() => setActiveTab('model_metrics')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'model_metrics'
                ? 'bg-white text-[#142B3B] shadow-sm'
                : 'text-[#657582] hover:text-[#142B3B]'
            }`}
          >
            ML Model Diagnostics
          </button>
        </div>
      </div>

      {activeTab === 'drift' ? (
        <div className="space-y-6">
          {/* Sensitivity Controls Bar */}
          <div className="bg-white rounded-2xl p-4 border border-[#142B3B]/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#142B3B]">
              <SlidersHorizontal className="w-4 h-4 text-[#176B68]" />
              <span>Drift Sensitivity Setting:</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setDriftThreshold('sensitive')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                  driftThreshold === 'sensitive' ? 'bg-[#176B68] text-white' : 'bg-[#F8F7F2] text-[#657582]'
                }`}
              >
                High Sensitivity (&gt;12% drop)
              </button>
              <button
                onClick={() => setDriftThreshold('standard')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                  driftThreshold === 'standard' ? 'bg-[#176B68] text-white' : 'bg-[#F8F7F2] text-[#657582]'
                }`}
              >
                Standard (Recommended, &gt;18% drop)
              </button>
              <button
                onClick={() => setDriftThreshold('conservative')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                  driftThreshold === 'conservative' ? 'bg-[#176B68] text-white' : 'bg-[#F8F7F2] text-[#657582]'
                }`}
              >
                Conservative (&gt;25% drop)
              </button>
            </div>
          </div>

          {/* Drift Flagged Students Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {driftStudents.map(student => {
              const acadDelta = student.recentAverage - student.previousAverage;
              return (
                <div 
                  key={student.id}
                  className="bg-white rounded-3xl p-6 border border-[#142B3B]/10 shadow-sm space-y-4 hover:border-[#176B68] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-lg text-[#142B3B]">{student.pseudonymousId}</span>
                      <p className="text-xs text-[#657582]">{student.gradeLevel} • Assigned to {student.assignedStaff}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      student.prediction === 'urgent_review_recommended' ? 'bg-[#D9675D]/15 text-[#D9675D]' :
                      student.prediction === 'review_recommended' ? 'bg-[#E9A23B]/15 text-[#E9A23B]' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {(student.riskProbability * 100).toFixed(0)}% Risk
                    </span>
                  </div>

                  {/* Drift Sparkline & Metrics */}
                  <div className="p-4 rounded-2xl bg-[#F8F7F2] space-y-2">
                    <div className="text-[11px] font-bold text-[#142B3B] uppercase tracking-wider">
                      Flagged Trajectory Deceleration
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <div className="text-[10px] text-[#657582]">Current Attendance</div>
                        <div className="font-bold text-[#D9675D] text-sm">{student.attendanceRate}%</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#657582]">Academic Delta</div>
                        <div className="font-bold text-[#D9675D] text-sm">{acadDelta.toFixed(0)} pts</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#657582]">Absence Velocity</div>
                        <div className="font-bold capitalize text-[#142B3B] text-sm">{student.recentAbsenceTrend}</div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#657582] leading-relaxed">
                    {student.driftReason || 'Multiple unexcused absences and declining assessment average detected over recent reporting window.'}
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#142B3B]/10">
                    <button
                      onClick={() => navigateTo(`/students/${student.id}`)}
                      className="px-3 py-1.5 bg-[#F8F7F2] hover:bg-[#F8F7F2]/80 text-[#142B3B] text-xs font-semibold rounded-xl"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => {
                        setSelectedStudentForLab(student);
                        navigateTo('/intervention-lab');
                      }}
                      className="px-3.5 py-1.5 bg-[#176B68] hover:bg-[#208783] text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
                    >
                      <span>Simulate Support Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Model Metrics & Calibration Evaluation View */
        <div className="space-y-6">
          {modelMetrics ? (
            <div className="space-y-6">
              {/* Core Validation Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-[#142B3B]/10 shadow-sm text-center">
                  <div className="text-[11px] text-[#657582]">ROC-AUC Score</div>
                  <div className="font-heading font-extrabold text-2xl text-[#176B68] mt-1">
                    {modelMetrics.metrics.roc_auc.toFixed(4)}
                  </div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">High Discriminative Ability</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#142B3B]/10 shadow-sm text-center">
                  <div className="text-[11px] text-[#657582]">Test Accuracy</div>
                  <div className="font-heading font-extrabold text-2xl text-[#142B3B] mt-1">
                    {(modelMetrics.metrics.accuracy * 100).toFixed(1)}%
                  </div>
                  <div className="text-[10px] text-[#657582] mt-0.5">N={modelMetrics.test_samples} Held-out Set</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#142B3B]/10 shadow-sm text-center">
                  <div className="text-[11px] text-[#657582]">Test Recall</div>
                  <div className="font-heading font-extrabold text-2xl text-[#142B3B] mt-1">
                    {(modelMetrics.metrics.recall * 100).toFixed(1)}%
                  </div>
                  <div className="text-[10px] text-[#176B68] mt-0.5">Minimizes Missed Students</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#142B3B]/10 shadow-sm text-center">
                  <div className="text-[11px] text-[#657582]">Precision</div>
                  <div className="font-heading font-extrabold text-2xl text-[#142B3B] mt-1">
                    {(modelMetrics.metrics.precision * 100).toFixed(1)}%
                  </div>
                  <div className="text-[10px] text-[#657582] mt-0.5">Review Confirmation</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#142B3B]/10 shadow-sm text-center">
                  <div className="text-[11px] text-[#657582]">F1-Score</div>
                  <div className="font-heading font-extrabold text-2xl text-[#142B3B] mt-1">
                    {modelMetrics.metrics.f1_score.toFixed(4)}
                  </div>
                  <div className="text-[10px] text-[#657582] mt-0.5">Balanced Measure</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#142B3B]/10 shadow-sm text-center">
                  <div className="text-[11px] text-[#657582]">Brier Loss</div>
                  <div className="font-heading font-extrabold text-2xl text-[#142B3B] mt-1">
                    {modelMetrics.metrics.brier_score.toFixed(4)}
                  </div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">Well Calibrated Probabilities</div>
                </div>
              </div>

              {/* Confusion Matrix and Feature Importances */}
              <div className="grid lg:grid-cols-12 gap-8">
                {/* Confusion Matrix */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-[#142B3B]/10 shadow-sm space-y-4">
                  <h3 className="font-heading font-bold text-base text-[#142B3B]">
                    Held-Out Confusion Matrix
                  </h3>
                  <p className="text-xs text-[#657582]">
                    Evaluated on 875 unseen student records with 0.40 early warning threshold
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                      <div className="text-[11px] text-emerald-700 font-semibold">True Negatives (TN)</div>
                      <div className="font-heading font-extrabold text-xl text-emerald-900 mt-1">
                        {modelMetrics.confusion_matrix.true_negatives}
                      </div>
                      <div className="text-[10px] text-emerald-600 mt-0.5">Correctly classified on-track</div>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                      <div className="text-[11px] text-amber-700 font-semibold">False Positives (FP)</div>
                      <div className="font-heading font-extrabold text-xl text-amber-900 mt-1">
                        {modelMetrics.confusion_matrix.false_positives}
                      </div>
                      <div className="text-[10px] text-amber-600 mt-0.5">Support offered proactively</div>
                    </div>

                    <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-center">
                      <div className="text-[11px] text-rose-700 font-semibold">False Negatives (FN)</div>
                      <div className="font-heading font-extrabold text-xl text-rose-900 mt-1">
                        {modelMetrics.confusion_matrix.false_negatives}
                      </div>
                      <div className="text-[10px] text-rose-600 mt-0.5">Minimizing this is retention priority</div>
                    </div>

                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                      <div className="text-[11px] text-emerald-700 font-semibold">True Positives (TP)</div>
                      <div className="font-heading font-extrabold text-xl text-emerald-900 mt-1">
                        {modelMetrics.confusion_matrix.true_positives}
                      </div>
                      <div className="text-[10px] text-emerald-600 mt-0.5">Accurately flagged for review</div>
                    </div>
                  </div>
                </div>

                {/* Global Feature Importances */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-[#142B3B]/10 shadow-sm space-y-4">
                  <h3 className="font-heading font-bold text-base text-[#142B3B]">
                    Global Feature Importance (Random Forest Splits)
                  </h3>
                  <p className="text-xs text-[#657582]">
                    Relative information gain across 120 decision estimators
                  </p>

                  <div className="space-y-3 pt-2">
                    {modelMetrics.feature_importances.map((f, i) => (
                      <div key={i} className="text-xs space-y-1">
                        <div className="flex justify-between text-[#142B3B] font-semibold">
                          <span>{f.label}</span>
                          <span className="font-mono text-[#176B68]">{(f.importance * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-[#F8F7F2] h-2 rounded-full overflow-hidden border border-[#142B3B]/10">
                          <div
                            style={{ width: `${f.importance * 100 * 3.2}%` }}
                            className="bg-[#176B68] h-full rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-[#657582]">Loading model validation telemetry...</div>
          )}
        </div>
      )}
    </div>
  );
};
