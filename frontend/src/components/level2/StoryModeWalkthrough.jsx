import React, { useEffect } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Activity, ShieldAlert, Sparkles } from 'lucide-react';

export default function StoryModeWalkthrough({
  timeline = [],
  activeStep,
  setActiveStep,
  isPlaying,
  setIsPlaying
}) {
  const steps = [
    { num: 1, time: '08:10', title: 'External Service Mapping', stage: 'Reconnaissance' },
    { num: 2, time: '08:24', title: 'Initial Access', stage: 'Initial Access' },
    { num: 3, time: '09:05', title: 'Account Discovery', stage: 'Discovery' },
    { num: 4, time: '10:40', title: 'Collection / Limited Movement', stage: 'Collection' },
    { num: 5, time: '13:15', title: 'Detection', stage: 'Detection' },
    { num: 6, time: '15:00', title: 'Containment', stage: 'Containment' }
  ];

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps.length, setActiveStep]);

  const currentStep = steps[activeStep] || steps[0];

  return (
    <div className="soc-card p-5 bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border-amber-500/30 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              Story Mode — Step-by-Step Attack Walkthrough
            </h3>
            <p className="text-xs text-slate-400">
              Visual walkthrough of Problem 11 attack progression.
            </p>
          </div>
        </div>

        {/* Story Mode Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setActiveStep(0);
              setIsPlaying(true);
            }}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> START ATTACK ANALYSIS
          </button>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => {
                setIsPlaying(false);
                setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);
              }}
              className="px-2.5 py-1 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1 hover:bg-slate-800 rounded cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> PREVIOUS
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 cursor-pointer ${
                isPlaying ? 'bg-amber-950 text-amber-300 border border-amber-500/50' : 'bg-slate-800 text-slate-200'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400" /> PAUSE
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400" /> PLAY
                </>
              )}
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setActiveStep((prev) => (prev + 1) % steps.length);
              }}
              className="px-2.5 py-1 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1 hover:bg-slate-800 rounded cursor-pointer"
            >
              NEXT <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stepper Progress Indicator */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {steps.map((st, idx) => {
          const isActive = activeStep === idx;
          return (
            <button
              key={st.num}
              onClick={() => {
                setIsPlaying(false);
                setActiveStep(idx);
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-950/80 border-amber-500/80 text-amber-300 shadow-md ring-1 ring-amber-500/50'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                <span className="font-bold">STEP {st.num}</span>
                <span className="text-amber-400 font-bold">{st.time}</span>
              </div>
              <div className="text-xs font-bold text-slate-100 truncate">{st.title}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
