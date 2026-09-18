import React from 'react';
import { Clock, ArrowDown, ChevronRight, ShieldAlert, Terminal, Eye } from 'lucide-react';

export default function InteractiveTimeline({
  timeline = [],
  selectedEvent,
  onSelectEvent,
  activeStep
}) {
  return (
    <div className="soc-card p-6 space-y-6 bg-slate-900/90">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            Problem 11 Attack Progression Interactive Timeline
          </h3>
        </div>
        <span className="text-xs font-mono text-amber-400">Click any stage to view deep analysis</span>
      </div>

      {/* Diagram flow */}
      <div className="flex flex-col items-center max-w-2xl mx-auto space-y-2">
        {timeline.map((evt, idx) => {
          const isSelected = selectedEvent?.id === evt.id || selectedEvent?.time === evt.time;
          const isStoryStep = activeStep === idx;

          return (
            <React.Fragment key={evt.id || evt.time}>
              {/* Event Card Node */}
              <button
                onClick={() => onSelectEvent(evt)}
                className={`w-full p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 text-left ${
                  isSelected || isStoryStep
                    ? 'bg-slate-900 border-amber-500 shadow-lg shadow-amber-950/60 ring-2 ring-amber-500/50 scale-[1.02]'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Time Badge */}
                  <div className="w-16 h-12 rounded-lg bg-amber-950/80 border border-amber-500/50 flex flex-col items-center justify-center font-mono shrink-0">
                    <span className="text-xs font-bold text-amber-300">{evt.time}</span>
                    <span className="text-[9px] text-amber-400/80">EST</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-100">{evt.event}</span>
                      {evt.technique !== 'N/A' && (
                        <span className="px-2 py-0.5 bg-slate-900 text-amber-400 border border-amber-800/60 rounded text-[10px] font-mono">
                          {evt.technique}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Stage: <strong className="text-slate-300">{evt.stage_title || evt.stage}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                    evt.status === 'Detected' ? 'bg-rose-950 text-rose-300 border border-rose-500/50' :
                    evt.status === 'Contained' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {evt.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </button>

              {/* Downward Connector Arrow */}
              {idx < timeline.length - 1 && (
                <div className="flex items-center justify-center my-1 text-amber-500/80">
                  <ArrowDown className="w-4 h-4 animate-bounce-slow" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
