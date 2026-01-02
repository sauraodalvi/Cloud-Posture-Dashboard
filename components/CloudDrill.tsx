
import React from 'react';
import { ChevronLeft, Filter, PieChart as PieIcon, Info } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { CloudProvider, AssetType } from '../types';

// Define Environment locally as it is missing from types.ts
enum Environment {
  PROD = 'Prod',
  STAGING = 'Staging',
  DEV = 'Dev'
}

interface CloudDrillProps {
  provider: CloudProvider;
  onBack: () => void;
  onNavigateToDetails: (env: Environment, service: AssetType) => void;
}

const CloudDrill: React.FC<CloudDrillProps> = ({ provider, onBack, onNavigateToDetails }) => {
  const pieData = [
    { name: 'Storage', value: 40 },
    { name: 'IAM', value: 30 },
    { name: 'Network', value: 20 },
    { name: 'Database', value: 10 },
  ];
  const COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981'];

  const environments = [Environment.PROD, Environment.STAGING, Environment.DEV];
  // Replaced AssetType.COMPUTE with AssetType.DB as COMPUTE is missing from AssetType enum
  const services = [AssetType.STORAGE, AssetType.IAM, AssetType.NETWORK, AssetType.DB];

  const heatmapData: Record<string, number> = {
    [`${Environment.PROD}-${AssetType.STORAGE}`]: 12,
    [`${Environment.PROD}-${AssetType.IAM}`]: 8,
    [`${Environment.PROD}-${AssetType.NETWORK}`]: 15,
    [`${Environment.PROD}-${AssetType.DB}`]: 4,
    [`${Environment.STAGING}-${AssetType.STORAGE}`]: 5,
    [`${Environment.STAGING}-${AssetType.IAM}`]: 2,
    [`${Environment.STAGING}-${AssetType.NETWORK}`]: 6,
    [`${Environment.STAGING}-${AssetType.DB}`]: 1,
    [`${Environment.DEV}-${AssetType.STORAGE}`]: 3,
    [`${Environment.DEV}-${AssetType.IAM}`]: 1,
    [`${Environment.DEV}-${AssetType.NETWORK}`]: 2,
    [`${Environment.DEV}-${AssetType.DB}`]: 0,
  };

  const getHeatmapColor = (count: number) => {
    if (count > 10) return 'bg-red-500 text-white';
    if (count > 5) return 'bg-orange-500 text-white';
    if (count > 0) return 'bg-yellow-400 text-slate-800';
    return 'bg-slate-100 text-slate-400';
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
          <ChevronLeft size={24} />
        </button>
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
            <span>Overview</span>
            <ChevronLeft size={12} className="rotate-180" />
            <span className="text-slate-900">{provider}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{provider} Posture Drill</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Heatmap Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-800">Issue Heatmap</h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-500">
              <Filter size={14} /> Filter Heatmap
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-5 gap-4 mb-4">
                <div className="h-10"></div>
                {services.map(s => (
                  <div key={s} className="h-10 flex items-center justify-center font-semibold text-xs text-slate-500 uppercase tracking-wider">{s}</div>
                ))}
              </div>
              
              {environments.map(env => (
                <div key={env} className="grid grid-cols-5 gap-4 mb-4">
                  <div className="h-20 flex items-center font-bold text-slate-700">{env}</div>
                  {services.map(service => {
                    const count = heatmapData[`${env}-${service}`] || 0;
                    return (
                      <button 
                        key={service}
                        onClick={() => onNavigateToDetails(env, service)}
                        className={`h-20 rounded-xl flex flex-col items-center justify-center transition-all hover:scale-[1.02] cursor-pointer relative overflow-hidden group ${getHeatmapColor(count)}`}
                      >
                        <span className="text-2xl font-bold">{count}</span>
                        <span className="text-[10px] font-bold uppercase opacity-80">Issues</span>
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Info size={12} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-8 text-[10px] font-bold uppercase text-slate-400">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-red-500"></div> Critical (&gt;10)</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-orange-500"></div> High (6-10)</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-yellow-400"></div> Medium (1-5)</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-slate-100"></div> None</div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <PieIcon size={18} className="text-blue-500" /> Service Distribution
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                    <span className="text-slate-600">{d.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl text-white">
            <h3 className="font-semibold mb-4">Top At-Risk Accounts</h3>
            <div className="space-y-4">
              {[
                { name: 'Prod-Account-01', count: 35, color: 'bg-red-500' },
                { name: 'Marketing-App', count: 18, color: 'bg-orange-500' },
                { name: 'Core-Infrastructure', count: 12, color: 'bg-yellow-500' }
              ].map(acc => (
                <div key={acc.name} className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-400">{acc.name}</span>
                    <span className="text-white">{acc.count} Crit</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className={`${acc.color} h-full rounded-full`} style={{ width: `${(acc.count / 40) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 text-xs font-bold uppercase tracking-widest text-blue-400 border border-blue-400/30 rounded-lg hover:bg-blue-400/10 transition-colors">
              View All 52 Accounts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudDrill;
