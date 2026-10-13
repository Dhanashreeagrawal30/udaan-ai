import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings, 
  ShieldCheck, 
  UserCheck, 
  Activity, 
  SlidersHorizontal, 
  RefreshCw, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Lock,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { UserRole } from '../types';

export const SettingsPage: React.FC = () => {
  const { 
    userRole, 
    setUserRole, 
    backendStatus, 
    forceDemoMode, 
    setForceDemoMode, 
    refreshBackendHealth, 
    resources, 
    updateResourceCapacity, 
    resetDemoData, 
    addToast 
  } = useApp();

  const [isTestingHealth, setIsTestingHealth] = useState(false);

  const handleTestBackend = async () => {
    setIsTestingHealth(true);
    await refreshBackendHealth();
    setIsTestingHealth(false);
    addToast('info', 'Backend Checked', backendStatus.isConnected ? 'Connected to Python FastAPI engine.' : 'Backend offline; operating in Demo Mode.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#142B3B]/10 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE9DF] text-[#176B68] text-xs font-bold mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>System Governance & Preferences</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#142B3B] tracking-tight">
          Settings & AI Ethics Framework
        </h1>
        <p className="text-xs sm:text-sm text-[#657582] mt-1 leading-relaxed">
          Configure role-based access, verify machine learning service health, manage school resource quotas, and review Responsible AI governance commitments.
        </p>
      </div>

      {/* 1. Role-Based Authorization Settings */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#142B3B]/10 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-[#142B3B]/10">
          <div className="p-2 bg-[#176B68]/10 text-[#176B68] rounded-xl">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-[#142B3B]">
              Role-Based Access Control (RBAC)
            </h3>
            <p className="text-xs text-[#657582]">
              Simulate different stakeholder perspectives across the retention lifecycle
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 text-xs">
          {[
            {
              role: 'school_administrator' as UserRole,
              title: 'School Administrator',
              desc: 'Full administrative access: school capacity management, system exports, and cohort governance.'
            },
            {
              role: 'teacher' as UserRole,
              title: 'Class Teacher',
              desc: 'Classroom student reviews, academic warning detection, and support plan creation.'
            },
            {
              role: 'authorized_support_staff' as UserRole,
              title: 'Authorized Support Staff',
              desc: 'Specialist counseling intake, check-in note logging, and student welfare referrals.'
            }
          ].map(r => (
            <div
              key={r.role}
              onClick={() => setUserRole(r.role)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                userRole === r.role
                  ? 'border-[#176B68] bg-[#DCE9DF]/30 shadow-sm'
                  : 'border-[#142B3B]/10 hover:border-[#142B3B]/20 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-heading font-bold text-sm text-[#142B3B]">{r.title}</span>
                {userRole === r.role && <CheckCircle2 className="w-4 h-4 text-[#176B68]" />}
              </div>
              <p className="text-[11px] text-[#657582] leading-relaxed mt-1">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Machine Learning Prediction Service Diagnostics */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#142B3B]/10 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#142B3B]/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#142B3B] text-white rounded-xl">
              <Activity className="w-5 h-5 text-[#DCE9DF]" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-[#142B3B]">
                ML Prediction Service Diagnostics
              </h3>
              <p className="text-xs text-[#657582]">
                Python FastAPI (`127.0.0.1:8000`) connection telemetry & demo mode switch
              </p>
            </div>
          </div>

          <button
            onClick={handleTestBackend}
            disabled={isTestingHealth}
            className="px-3 py-1.5 bg-[#F8F7F2] hover:bg-[#DCE9DF] text-[#142B3B] border border-[#142B3B]/10 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#176B68] ${isTestingHealth ? 'animate-spin' : ''}`} />
            <span>Test Connection</span>
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#F8F7F2] border border-[#142B3B]/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#657582]">Python Service Status:</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                backendStatus.isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {backendStatus.isConnected ? '● Connected (Port 8000)' : '○ Offline / Standby'}
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-[#657582]">
              <span>Model Artifact:</span>
              <span className="font-mono text-[#142B3B]">udaan_model.joblib (v1.0.0)</span>
            </div>
            <div className="flex justify-between text-[11px] text-[#657582]">
              <span>Algorithm:</span>
              <span className="text-[#142B3B]">Calibrated RandomForestClassifier</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F7F2] border border-[#142B3B]/10 flex flex-col justify-between">
            <div>
              <div className="font-bold text-sm text-[#142B3B] mb-1">Simulated Demonstration Mode</div>
              <p className="text-[11px] text-[#657582] leading-relaxed">
                When enabled, the frontend utilizes embedded calibrated client weights, ensuring seamless evaluation even if the Python server is halted.
              </p>
            </div>
            <div className="pt-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#142B3B]">Force Demo Mode:</span>
              <input
                type="checkbox"
                checked={forceDemoMode}
                onChange={(e) => setForceDemoMode(e.target.checked)}
                className="w-4 h-4 rounded text-[#176B68] focus:ring-[#176B68] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. School Resource Capacity Controls */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#142B3B]/10 shadow-sm space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-[#142B3B]/10">
          <div className="p-2 bg-[#E9A23B]/15 text-[#E9A23B] rounded-xl">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-[#142B3B]">
              School Resource Allocation Quotas
            </h3>
            <p className="text-xs text-[#657582]">
              Adjust available tutoring slots, faculty hours, and counseling capacity
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          {resources.map((res) => (
            <div key={res.id} className="p-4 rounded-2xl bg-[#F8F7F2] border border-[#142B3B]/10 space-y-2">
              <div className="font-bold text-[#142B3B] truncate">{res.label}</div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#657582]">{res.allocatedUnits} allocated of</span>
                <input
                  type="number"
                  min={res.allocatedUnits}
                  max={100}
                  value={res.totalCapacity}
                  onChange={(e) => updateResourceCapacity(res.id, Number(e.target.value))}
                  className="w-16 px-2 py-1 bg-white border border-[#142B3B]/15 rounded-lg text-xs font-bold text-center"
                />
              </div>
              <div className="text-[10px] text-[#657582]">{res.unitDescription}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Responsible AI & Student Privacy Framework (MANDATORY REQUIREMENT) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#142B3B]/10 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-[#142B3B]/10">
          <div className="p-2 bg-[#176B68]/10 text-[#176B68] rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-[#142B3B]">
              Responsible AI & Ethical Retention Framework
            </h3>
            <p className="text-xs text-[#657582]">
              Formal principles governing UDAAN AI deployment
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#F8F7F2] border border-[#142B3B]/10 space-y-1.5">
            <div className="font-bold text-[#142B3B]">1. Strictly Non-Punitive</div>
            <p className="text-[#657582] leading-relaxed">
              Risk predictions are never used for academic tracking, disciplinary sorting, or exclusionary actions. They serve solely as invitations for student support.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F7F2] border border-[#142B3B]/10 space-y-1.5">
            <div className="font-bold text-[#142B3B]">2. Human Review Mandatory</div>
            <p className="text-[#657582] leading-relaxed">
              An educator or counselor must examine warning signals and confer with the student before implementing an intervention package. No automated intervention occurs.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F7F2] border border-[#142B3B]/10 space-y-1.5">
            <div className="font-bold text-[#142B3B]">3. Pseudonymity & Data Minimization</div>
            <p className="text-[#657582] leading-relaxed">
              PII is masked through pseudonymous tokens (ST-104). Only necessary behavioral signals (attendance velocity, assessment trends) are captured.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F7F2] border border-[#142B3B]/10 space-y-1.5">
            <div className="font-bold text-[#142B3B]">4. Transparent Auditability</div>
            <p className="text-[#657582] leading-relaxed">
              Every inference logs model version, training provenance, and feature contribution vectors to prevent black-box decision making.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Demo Data Management */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#142B3B]/10 shadow-sm flex items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-bold text-base text-[#142B3B]">Reset Demonstration Dataset</h3>
          <p className="text-xs text-[#657582] mt-0.5">
            Clear locally saved state and restore the original 12 student cohort including ST-104.
          </p>
        </div>
        <button
          onClick={resetDemoData}
          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </div>
  );
};
