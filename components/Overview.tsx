
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
// Added Cloud to the imported icons from lucide-react
import { TrendingUp, TrendingDown, ArrowRight, ShieldCheck, AlertCircle, ShieldAlert, Cloud } from 'lucide-react';
import { CloudProvider, Severity } from '../types';

interface OverviewProps {
  navigateToCloud: (provider: CloudProvider) => void;
}

const Overview: React.FC<OverviewProps> = ({ navigateToCloud }) => {
  const barData = [
    { name: 'AWS', critical: 35, high: 45, medium: 20 },
    { name: 'Azure', critical: 15, high: 25, medium: 40 },
    { name: 'GCP', critical: 10, high: 15, medium: 35 },
  ];

  const trendData = [
    { day: 'Mon', count: 42 },
    { day: 'Tue', count: 38 },
    { day: 'Wed', count: 45 },
    { day: 'Thu', count: 35 },
    { day: 'Fri', count: 30 },
    { day: 'Sat', count: 28 },
    { day: 'Sun', count: 25 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Security Score Card */}
        <div className="flex-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">Global Security Score</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-900">82</span>
              <span className="text-slate-400 text-lg">/100</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-green-600 text-xs font-semibold">
              <TrendingUp size={14} />
              <span>+5% from last week</span>
            </div>
          </div>
          <div className="relative h-24 w-24">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
              <circle cx="48" cy="48" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.82)} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldCheck className="text-blue-600" size={32} />
            </div>
          </div>
        </div>

        {/* Severity Stats */}
        <div className="flex-[2] grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-slate-500 text-xs font-medium">Critical</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">5</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span className="text-slate-500 text-xs font-medium">High</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">12</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span className="text-slate-500 text-xs font-medium">Medium</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">42</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-slate-500 text-xs font-medium">Low</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">105</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Multi-Cloud Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-800">Issues by Cloud Provider</h3>
            <div className="flex items-center gap-4 text-xs font-medium">
               <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-400"></div> Critical</div>
               <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-orange-400"></div> High</div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: -20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="critical" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
                <Bar dataKey="high" stackId="a" fill="#f97316" />
                <Bar dataKey="medium" stackId="a" fill="#eab308" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {[CloudProvider.AWS, CloudProvider.AZURE, CloudProvider.GCP].map(p => (
              <button 
                key={p}
                onClick={() => navigateToCloud(p)}
                className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${p === CloudProvider.AWS ? 'bg-orange-50' : p === CloudProvider.AZURE ? 'bg-blue-50' : 'bg-red-50'}`}>
                    <Cloud className={p === CloudProvider.AWS ? 'text-orange-500' : p === CloudProvider.AZURE ? 'text-blue-500' : 'text-red-500'} size={18} />
                  </div>
                  <span className="font-medium text-slate-700">{p}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-500">{p === CloudProvider.AWS ? '60' : p === CloudProvider.AZURE ? '25' : '15'} issues</span>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 7-Day Trend */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-800">Critical Issues Trend</h3>
            <div className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded tracking-wider">Improving</div>
          </div>
          <p className="text-xs text-slate-400 mb-6">Daily snapshots of critical security findings across all accounts.</p>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis hide domain={[0, 'auto']} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm">
              <TrendingDown className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">40.5% decrease</p>
              <p className="text-xs text-slate-500">Critical risks dropped from 42 to 25 this week.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
