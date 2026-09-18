import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, AreaChart, Area } from 'recharts';
import { BarChart3, PieChart as PieIcon, Activity } from 'lucide-react';

export default function AttackAnalysisCharts() {
  const eventsByStageData = [
    { stage: 'Recon', count: 1, color: '#38bdf8' },
    { stage: 'Initial Access', count: 1, color: '#f43f5e' },
    { stage: 'Discovery', count: 1, color: '#c084fc' },
    { stage: 'Collection', count: 1, color: '#fbbf24' },
    { stage: 'Detection', count: 1, color: '#ef4444' },
    { stage: 'Containment', count: 1, color: '#34d399' }
  ];

  const mitreMappingData = [
    { name: 'T1566.001 Spearphishing', value: 1, fill: '#f43f5e' },
    { name: 'T1087 Account Discovery', value: 1, fill: '#c084fc' },
    { name: 'T1041 Exfiltration C2', value: 1, fill: '#fbbf24' },
    { name: 'T1071.001 Web Protocols', value: 1, fill: '#ef4444' }
  ];

  const statusDistributionData = [
    { status: 'Observed', count: 1, fill: '#38bdf8' },
    { status: 'Simulated', count: 3, fill: '#c084fc' },
    { status: 'Detected', count: 1, fill: '#ef4444' },
    { status: 'Contained', count: 1, fill: '#34d399' }
  ];

  const timelineProgressionData = [
    { time: '08:10', step: 1, label: 'Recon' },
    { time: '08:24', step: 2, label: 'Access' },
    { time: '09:05', step: 3, label: 'Discovery' },
    { time: '10:40', step: 4, label: 'Collection' },
    { time: '13:15', step: 5, label: 'Detection' },
    { time: '15:00', step: 6, label: 'Containment' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Chart 1: Attack Timeline Progression */}
      <div className="soc-card p-5 space-y-3 bg-slate-900/90">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
            Chart 1: Attack Timeline Progression
          </h4>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineProgressionData}>
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 6]} stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
              <Area type="monotone" dataKey="step" stroke="#f59e0b" fill="#78350f" fillOpacity={0.4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Security Events by Stage */}
      <div className="soc-card p-5 space-y-3 bg-slate-900/90">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <BarChart3 className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
            Chart 2: Security Events by Stage
          </h4>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={eventsByStageData}>
              <XAxis dataKey="stage" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {eventsByStageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: MITRE Technique Mapping */}
      <div className="soc-card p-5 space-y-3 bg-slate-900/90">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <PieIcon className="w-4 h-4 text-purple-400" />
          <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
            Chart 3: MITRE Technique Distribution
          </h4>
        </div>
        <div className="h-48 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={mitreMappingData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                {mitreMappingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: Detection & Containment Status */}
      <div className="soc-card p-5 space-y-3 bg-slate-900/90">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
            Chart 4: Detection & Categorical Status
          </h4>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusDistributionData}>
              <XAxis dataKey="status" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {statusDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
