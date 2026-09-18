import React from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { BarChart3, PieChart as PieIcon } from 'lucide-react';

export default function VisualCharts({ ports = [], findings = [] }) {
  // 1. Risk Distribution
  const riskCounts = {
    HIGH: ports.filter(p => p.risk_level === 'HIGH').length,
    MEDIUM: ports.filter(p => p.risk_level === 'MEDIUM').length,
    LOW: ports.filter(p => p.risk_level === 'LOW').length,
    INFO: ports.filter(p => p.risk_level === 'INFO').length,
  };

  const riskData = [
    { name: 'High Risk', value: riskCounts.HIGH, color: '#F43F5E' },
    { name: 'Medium Risk', value: riskCounts.MEDIUM, color: '#F59E0B' },
    { name: 'Low Risk', value: riskCounts.LOW, color: '#10B981' },
    { name: 'Info', value: riskCounts.INFO, color: '#06B6D4' },
  ].filter(d => d.value > 0);

  // 2. Open Ports by Service
  const serviceMap = {};
  ports.forEach(p => {
    serviceMap[p.service_name] = (serviceMap[p.service_name] || 0) + 1;
  });
  const serviceData = Object.keys(serviceMap).map(svc => ({
    service: svc,
    count: serviceMap[svc]
  }));

  // 3. Exposure by Network Zone
  const exposureCounts = {
    Public: ports.filter(p => p.exposure_category === 'Public').length,
    Management: ports.filter(p => p.exposure_category === 'Management').length,
    Internal: ports.filter(p => p.exposure_category === 'Internal').length,
  };
  const exposureData = [
    { zone: 'Public', count: exposureCounts.Public, color: '#06B6D4' },
    { zone: 'Management', count: exposureCounts.Management, color: '#F43F5E' },
    { zone: 'Internal', count: exposureCounts.Internal, color: '#A855F7' },
  ];

  // Custom Dark Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs font-mono">
          <p className="text-slate-200 font-bold">{payload[0].name || payload[0].payload.service || payload[0].payload.zone}</p>
          <p className="text-cyan-400">Count: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
      {/* Chart 1: Risk Distribution */}
      <div className="soc-card p-5">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
          <PieIcon className="w-4 h-4 text-cyan-400" />
          <h4 className="font-bold text-xs uppercase text-slate-200">Risk Severity Distribution</h4>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskData.length > 0 ? riskData : [{ name: 'No Risks', value: 1, color: '#334155' }]}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Exposure by Network Zone */}
      <div className="soc-card p-5">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
          <BarChart3 className="w-4 h-4 text-purple-400" />
          <h4 className="font-bold text-xs uppercase text-slate-200">Exposure by Network Zone</h4>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={exposureData}>
              <XAxis dataKey="zone" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {exposureData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
