import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  SlidersHorizontal, 
  Users, 
  Layers, 
  Lock, 
  Clock, 
  BarChart3,
  HelpCircle,
  Eye
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#142B3B] flex flex-col selection:bg-[#176B68]/20 selection:text-[#176B68]">
      {/* Top Navigation */}
      <header className="border-b border-[#142B3B]/10 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#176B68] to-[#208783] flex items-center justify-center text-white shadow-md">
            <Compass className="w-6 h-6 text-[#DCE9DF]" />
          </div>
          <div>
            <span className="font-heading text-xl font-extrabold tracking-tight text-[#142B3B] flex items-center gap-1.5">
              UDAAN <span className="text-[#176B68] text-xs font-bold px-2 py-0.5 rounded bg-[#DCE9DF]">AI</span>
            </span>
            <p className="text-[10px] text-[#657582] uppercase tracking-wider font-semibold">Retention Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              const el = document.getElementById('how-it-works');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden sm:inline-block text-xs font-semibold text-[#657582] hover:text-[#142B3B] transition-colors"
          >
            How It Works
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('intervention-lab-preview');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden sm:inline-block text-xs font-semibold text-[#657582] hover:text-[#142B3B] transition-colors"
          >
            What-If Lab
          </button>
          <button
            onClick={() => navigateTo('/dashboard')}
            className="px-4 py-2 bg-[#176B68] hover:bg-[#208783] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-12 pt-16 pb-20 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#DCE9DF] border border-[#176B68]/20 text-[#176B68] text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TECHFORMERS 2026 • Problem Statement 03</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#142B3B] leading-[1.12]">
              Every warning sign is an opportunity <span className="text-[#176B68] underline decoration-[#DCE9DF] decoration-wavy underline-offset-4">to help.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#657582] leading-relaxed max-w-2xl">
              UDAAN AI helps schools recognize early dropout risk signals, understand contributing factors, and coordinate timely, feasible student support before disengagement becomes irreversible.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigateTo('/dashboard')}
                className="px-6 py-3.5 bg-[#176B68] hover:bg-[#208783] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#176B68]/20 hover:shadow-[#176B68]/30 transition-all flex items-center gap-2 group"
              >
                <span>Explore Live Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-white hover:bg-[#F8F7F2] text-[#142B3B] font-bold text-sm rounded-xl border border-[#142B3B]/15 transition-all shadow-sm"
              >
                See How It Works
              </button>
            </div>

            {/* Micro Credibility Callouts */}
            <div className="pt-6 border-t border-[#142B3B]/10 grid grid-cols-3 gap-4">
              <div>
                <div className="font-heading font-extrabold text-xl text-[#142B3B]">82%</div>
                <div className="text-xs text-[#657582]">EWI Attendance Threshold</div>
              </div>
              <div>
                <div className="font-heading font-extrabold text-xl text-[#176B68]">Calibrated</div>
                <div className="text-xs text-[#657582]">Probabilistic Risk Outputs</div>
              </div>
              <div>
                <div className="font-heading font-extrabold text-xl text-[#142B3B]">Human-Led</div>
                <div className="text-xs text-[#657582]">Mandatory Staff Review</div>
              </div>
            </div>
          </div>

          {/* Hero Visual — Dynamic Signal Trajectory */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 shadow-2xl border border-[#142B3B]/10 relative overflow-hidden">
              {/* Decorative Subtle Botanical / Gradient Motif */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#DCE9DF]/50 to-transparent rounded-bl-full pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-[#142B3B]/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#D9675D]" />
                  <span className="font-mono text-xs font-bold text-[#142B3B]">ST-104</span>
                  <span className="text-[10px] text-[#657582]">Grade 10 • Sec B</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D9675D]/15 text-[#D9675D]">
                  Urgent Review
                </span>
              </div>

              {/* Visual Trajectory Chart Preview */}
              <div className="py-4 space-y-3">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-[#657582]">Calculated Retention Risk</span>
                  <span className="font-heading font-extrabold text-lg text-[#D9675D]">76%</span>
                </div>
                <div className="w-full bg-[#F8F7F2] h-2.5 rounded-full overflow-hidden border border-[#142B3B]/10">
                  <div className="bg-gradient-to-r from-[#E9A23B] to-[#D9675D] h-full rounded-full w-[76%]" />
                </div>

                {/* Key Signals */}
                <div className="pt-2 space-y-2">
                  <div className="text-[11px] font-bold text-[#142B3B] uppercase tracking-wider">
                    Identified Contributing Factors
                  </div>

                  <div className="p-2.5 bg-[#F8F7F2] rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[#142B3B]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D9675D]" />
                      <span>Attendance drop: 90% → 62%</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#D9675D] font-bold">+0.48 impact</span>
                  </div>

                  <div className="p-2.5 bg-[#F8F7F2] rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[#142B3B]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E9A23B]" />
                      <span>Math assessment decline: -24 pts</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#E9A23B] font-bold">+0.40 impact</span>
                  </div>
                </div>

                {/* Feasible Next Action */}
                <div className="pt-2">
                  <div className="p-3 bg-[#DCE9DF]/50 border border-[#176B68]/20 rounded-xl text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#176B68]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Recommended Feasible Support</span>
                    </div>
                    <p className="text-[11px] text-[#142B3B]">
                      Pair with senior math peer tutor + adjust morning transit schedule.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigateTo('/students/std-104')}
                className="w-full mt-2 py-2.5 bg-[#142B3B] hover:bg-[#142B3B]/90 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Examine Student Case Study</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#DCE9DF]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Problem In 3 Concise Points */}
      <section className="bg-white py-16 px-6 lg:px-12 border-y border-[#142B3B]/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#176B68]">The Retention Challenge</span>
            <h2 className="font-heading text-3xl font-extrabold text-[#142B3B] mt-1">
              Why School Dropout Warnings Go Unanswered
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#F8F7F2] border border-[#142B3B]/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#D9675D]/15 text-[#D9675D] flex items-center justify-center font-bold font-mono">
                01
              </div>
              <h3 className="font-heading font-bold text-lg text-[#142B3B]">Unseen Early Signals</h3>
              <p className="text-xs sm:text-sm text-[#657582] leading-relaxed">
                Dropout patterns develop 6 to 12 weeks before physical departure. By the time term grades are printed, the intervention window has already closed.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8F7F2] border border-[#142B3B]/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E9A23B]/15 text-[#E9A23B] flex items-center justify-center font-bold font-mono">
                02
              </div>
              <h3 className="font-heading font-bold text-lg text-[#142B3B]">Disconnected Resources</h3>
              <p className="text-xs sm:text-sm text-[#657582] leading-relaxed">
                Schools have finite tutoring hours and staff capacity. Standard tools flag at-risk students without checking whether proposed plans are operationally feasible.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8F7F2] border border-[#142B3B]/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#176B68]/15 text-[#176B68] flex items-center justify-center font-bold font-mono">
                03
              </div>
              <h3 className="font-heading font-bold text-lg text-[#142B3B]">Black-Box Skepticism</h3>
              <p className="text-xs sm:text-sm text-[#657582] leading-relaxed">
                Educators reject opaque AI scores that label students without explaining why. Real retention intelligence requires transparent, human-auditable factors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Stage Product Workflow */}
      <section id="how-it-works" className="py-20 px-6 lg:px-12 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#176B68]">Unified Intelligence Loop</span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#142B3B] mt-1">
            Detect. Understand. Support. Follow Up.
          </h2>
          <p className="text-sm text-[#657582] mt-2">
            A continuous four-stage lifecycle transforming statistical warning signs into compassionate educational action.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#142B3B]/10 shadow-sm relative group hover:border-[#176B68] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#142B3B] text-[#DCE9DF] flex items-center justify-center mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <div className="text-[11px] font-bold text-[#176B68] uppercase tracking-wider">Stage 01</div>
            <h3 className="font-heading font-bold text-base text-[#142B3B] mt-1">Detect Early Signals</h3>
            <p className="text-xs text-[#657582] mt-2 leading-relaxed">
              Monitors attendance velocity, consecutive Friday absences, and assessment micro-drops through the statistical Drift Detector.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#142B3B]/10 shadow-sm relative group hover:border-[#176B68] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#176B68] text-white flex items-center justify-center mb-4">
              <Eye className="w-5 h-5" />
            </div>
            <div className="text-[11px] font-bold text-[#176B68] uppercase tracking-wider">Stage 02</div>
            <h3 className="font-heading font-bold text-base text-[#142B3B] mt-1">Explainable Factors</h3>
            <p className="text-xs text-[#657582] mt-2 leading-relaxed">
              Breaks down probabilistic risk into specific contributing factors with directional weights, distinguishing correlation from causation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#142B3B]/10 shadow-sm relative group hover:border-[#176B68] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#E9A23B] text-white flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-[11px] font-bold text-[#176B68] uppercase tracking-wider">Stage 03</div>
            <h3 className="font-heading font-bold text-base text-[#142B3B] mt-1">Intervention Lab</h3>
            <p className="text-xs text-[#657582] mt-2 leading-relaxed">
              Explores support packages against live school resource constraints (tutoring slots, staff hours) to ensure actionable feasibility.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#142B3B]/10 shadow-sm relative group hover:border-[#176B68] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#8BA890] text-white flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-[11px] font-bold text-[#176B68] uppercase tracking-wider">Stage 04</div>
            <h3 className="font-heading font-bold text-base text-[#142B3B] mt-1">Follow-Up Loop</h3>
            <p className="text-xs text-[#657582] mt-2 leading-relaxed">
              Maintains accountability with scheduled check-in milestones, leading metrics tracking, and qualitative educator notes.
            </p>
          </div>
        </div>
      </section>

      {/* Signature Feature Showcase: What-If Lab */}
      <section id="intervention-lab-preview" className="bg-[#142B3B] text-white py-20 px-6 lg:px-12 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#DCE9DF] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Signature Capability</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              The What-If Intervention Lab
            </h2>

            <p className="text-sm text-white/70 leading-relaxed">
              Most predictive models stop at forecasting failure. UDAAN AI gives school counselors a sandbox to simulate and plan interventions against genuine resource capacities.
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-white/90">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#DCE9DF] mt-0.5 flex-shrink-0" />
                <span>Simulate 6 evidence-based support pathways (tutoring, family sync, mentoring).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#DCE9DF] mt-0.5 flex-shrink-0" />
                <span>Real-time school resource matcher prevents overcommitting scarce staff hours.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#DCE9DF] mt-0.5 flex-shrink-0" />
                <span>Scientifically grounded: does not fabricate magical instant probability drops.</span>
              </li>
            </ul>

            <button
              onClick={() => navigateTo('/intervention-lab')}
              className="px-6 py-3 bg-[#176B68] hover:bg-[#208783] text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <span>Test the Intervention Lab</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-mono text-xs font-bold text-[#DCE9DF]">WORKSPACE: ST-104</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">
                  Feasibility Confirmed
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-white/60">Tutoring Capacity</div>
                  <div className="font-bold text-white text-sm mt-0.5">6 of 25 Remaining</div>
                  <div className="text-[10px] text-emerald-300 mt-1">Available for assignment</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-white/60">Staff Mentoring Time</div>
                  <div className="font-bold text-white text-sm mt-0.5">8 of 30 Hours Left</div>
                  <div className="text-[10px] text-emerald-300 mt-1">Within safe threshold</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/20 border border-white/10 text-xs space-y-1">
                <div className="font-bold text-[#DCE9DF] text-[11px]">Primary Checkpoint (Day 14)</div>
                <p className="text-[11px] text-white/70">
                  Verify morning attendance stability and complete 1st math peer tutoring recap.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Responsible AI & Privacy Commitments */}
      <section className="py-16 px-6 lg:px-12 bg-white border-t border-[#142B3B]/10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-[#176B68]/10 text-[#176B68]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-2xl text-[#142B3B]">
                Responsible AI & Student Privacy Commitments
              </h2>
              <p className="text-xs text-[#657582]">Built from first principles for ethical educational deployment</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#F8F7F2] border border-[#142B3B]/10 space-y-1.5">
              <div className="font-bold text-[#142B3B]">Pseudonymous Identifiers</div>
              <p className="text-[#657582] leading-relaxed">
                Student IDs are strictly pseudonymized (ST-104) to guard against unintentional bias and privacy leaks.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F7F2] border border-[#142B3B]/10 space-y-1.5">
              <div className="font-bold text-[#142B3B]">No Automated Disciplinary Action</div>
              <p className="text-[#657582] leading-relaxed">
                Risk estimates never trigger punitive measures. They serve exclusively as early invitations for support.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F7F2] border border-[#142B3B]/10 space-y-1.5">
              <div className="font-bold text-[#142B3B]">Mandatory Human Review</div>
              <p className="text-[#657582] leading-relaxed">
                Predictions are not diagnoses. An authorized educator must review warning signals before any plan begins.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F7F2] border border-[#142B3B]/10 space-y-1.5">
              <div className="font-bold text-[#142B3B]">Model Versioning & Auditability</div>
              <p className="text-[#657582] leading-relaxed">
                Every inference records model version (1.0.0-techformers), confidence thresholds, and test calibration curves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[#142B3B] text-white/70 py-8 px-6 lg:px-12 text-xs border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#DCE9DF]" />
            <span className="font-bold text-white">UDAAN AI</span>
            <span>— TECHFORMERS 2026 Hackathon Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigateTo('/dashboard')} className="hover:text-white transition-colors">Dashboard</button>
            <button onClick={() => navigateTo('/students')} className="hover:text-white transition-colors">Directory</button>
            <button onClick={() => navigateTo('/intervention-lab')} className="hover:text-white transition-colors">Intervention Lab</button>
            <button onClick={() => navigateTo('/settings')} className="hover:text-white transition-colors">AI Ethics</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
