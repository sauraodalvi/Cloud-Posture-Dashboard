
import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, Search, ChevronRight, X, Cloud, AlertTriangle, ExternalLink, 
  Copy, Check, Send, TrendingUp, Filter, ArrowLeft, Loader2, Sparkles, 
  Zap, LayoutGrid, Activity, History, MoreVertical, Globe, Shield,
  Terminal, MousePointer2, ListFilter
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell, LabelList
} from 'recharts';
import { CloudProvider, Severity, Status, AssetType, Project, MisconfigDetail, Environment } from './types';
import { CLOUD_STATS, MOCK_PROJECTS, MOCK_DETAILED_ISSUES, SEVERITY_COLOR_MAP, SEVERITY_TEXT_MAP } from './constants';
import { getRemediation, RemediationGuidance } from './services/geminiService';

export default function App() {
  const [activeCloud, setActiveCloud] = useState<CloudProvider | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isGlobalFindings, setIsGlobalFindings] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<AssetType | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [aiGuidance, setAiGuidance] = useState<Record<string, RemediationGuidance>>({});
  const [loadingAi, setLoadingAi] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [remediationTab, setRemediationTab] = useState<'manual' | 'terraform' | 'cli'>('terraform');

  // Drawer Widths
  const DRAWER_1_WIDTH = 440;
  const DRAWER_2_WIDTH = 700;

  const handleIssueClick = async (issue: MisconfigDetail) => {
    setSelectedIssue(selectedIssue === issue.id ? null : issue.id);
    if (!aiGuidance[issue.id]) {
      setLoadingAi(issue.id);
      const guidance = await getRemediation(issue.title, issue.description);
      setAiGuidance(prev => ({ ...prev, [issue.id]: guidance }));
      setLoadingAi(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewAllFindings = () => {
    setIsGlobalFindings(true);
    setActiveCategoryFilter(null);
    setActiveCloud(CloudProvider.GCP); // Default context
    setActiveProject(null);
    setSelectedIssue(null);
  };

  const handleCategoryClick = (data: any) => {
    const assetType = data.type as AssetType;
    setIsGlobalFindings(true);
    setActiveCategoryFilter(assetType);
    setActiveCloud(CloudProvider.GCP); // Default context to show drawers
    setActiveProject(null);
    setSelectedIssue(null);
  };

  const handleProjectSelect = (proj: Project) => {
    setIsGlobalFindings(false);
    setActiveCategoryFilter(null);
    setActiveProject(proj);
    setSelectedIssue(null);
  };

  const filteredProjects = useMemo(() => {
    if (!activeCloud) return [];
    return MOCK_PROJECTS[activeCloud].filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activeCloud, searchTerm]);

  const closeDrawers = () => {
    setActiveCloud(null);
    setActiveProject(null);
    setIsGlobalFindings(false);
    setActiveCategoryFilter(null);
    setSelectedIssue(null);
  };

  // Determine which issues to display in the side panel
  const displayIssues = useMemo(() => {
    let base = isGlobalFindings ? MOCK_DETAILED_ISSUES : (activeProject ? MOCK_DETAILED_ISSUES.filter(iss => iss.projectId === activeProject.id) : []);
    if (activeCategoryFilter) {
      base = base.filter(iss => iss.assetType === activeCategoryFilter);
    }
    return base;
  }, [isGlobalFindings, activeProject, activeCategoryFilter]);

  // Aggregated data for Global Level with Percentages
  const misconfigTypeData = useMemo(() => {
    const raw = [
      { type: AssetType.IAM, count: 42 },
      { type: AssetType.NETWORK, count: 28 },
      { type: AssetType.STORAGE, count: 22 },
      { type: AssetType.COMPUTE, count: 18 },
      { type: AssetType.LOGGING, count: 12 },
    ];
    const total = raw.reduce((acc, curr) => acc + curr.count, 0);
    return raw.map(item => ({
      ...item,
      percentage: Math.round((item.count / total) * 100)
    }));
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden text-slate-900">
      {/* Level 1: Global Dashboard */}
      <main className={`flex-1 overflow-y-auto p-10 max-w-7xl mx-auto w-full transition-all duration-500 ease-in-out ${activeCloud ? 'pr-[480px] scale-[0.97] blur-[2px]' : ''}`}>
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-xl shadow-indigo-100">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-slate-900">Guardrail</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Multi-Cloud Security Posture</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search resources, projects..." 
                className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm w-80 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:outline-none transition-all shadow-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95">
              <Zap size={18} /> Deep Scan
            </button>
          </div>
        </header>

        {/* Global Overview Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Risk Score Widget */}
          <div className="lg:col-span-3 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Shield size={100} />
            </div>
            <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-4">Risk Health</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl font-black text-indigo-600 tracking-tighter">82</span>
              <span className="text-slate-300 font-bold text-xl">/100</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-emerald-600 font-bold text-xs bg-emerald-50 w-fit px-3 py-1 rounded-full">
              <TrendingUp size={14} /> +5.2% vs Last Week
            </div>
          </div>

          {/* Postural Velocity Chart */}
          <div className="lg:col-span-5 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative min-h-[220px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-black text-lg text-slate-800 tracking-tight">Postural Velocity</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">30-Day Risk Mitigation</p>
              </div>
            </div>
            <div className="absolute inset-x-8 bottom-6 top-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[{d:'W1', s:72},{d:'W2', s:78},{d:'W3', s:81},{d:'W4', s:82}]}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fill:'#94a3b8', fontSize:10, fontWeight:700}} />
                  <YAxis hide domain={[60, 100]} />
                  <Tooltip contentStyle={{borderRadius:'16px', border:'none', boxShadow:'0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Area type="monotone" dataKey="s" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Issues by Type Chart */}
          <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative min-h-[220px]">
            <h3 className="font-black text-lg text-slate-800 tracking-tight mb-2">Issue Dist.</h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4 italic">Click bars to filter findings</p>
            <div className="absolute inset-x-8 bottom-6 top-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={misconfigTypeData} layout="vertical" margin={{ left: -10 }}>
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="type" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill:'#94a3b8', fontSize:10, fontWeight:800}}
                    width={80}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800">
                            <p className="text-[10px] font-black uppercase text-indigo-400 mb-1">{payload[0].payload.type}</p>
                            <p className="text-lg font-black">{payload[0].value} <span className="text-xs font-medium text-slate-400">Issues</span></p>
                            <p className="text-[10px] font-bold text-emerald-400">{payload[0].payload.percentage}% of total</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#6366f1" 
                    radius={[0, 8, 8, 0]} 
                    barSize={14}
                    onClick={handleCategoryClick}
                    className="cursor-pointer"
                  >
                    <LabelList 
                      dataKey="percentage" 
                      position="right" 
                      content={(props: any) => {
                        const { x, y, width, value } = props;
                        return (
                          <text x={x + width + 8} y={y + 11} fill="#6366f1" fontSize={10} fontWeight={900} className="font-sans">
                            {value}%
                          </text>
                        );
                      }}
                    />
                    {misconfigTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.type === activeCategoryFilter ? '#4338ca' : '#6366f1'} className="hover:opacity-80 transition-opacity" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Cloud Inventory - Level 2 */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Connected Clouds</h3>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Level</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(Object.entries(CLOUD_STATS) as [CloudProvider, any][]).map(([provider, stats]) => (
                <button 
                  key={provider}
                  onClick={() => setActiveCloud(provider)}
                  className="group bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-200 hover:-translate-y-1 transition-all text-left relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className={`p-3 rounded-xl shadow-inner ${provider === CloudProvider.AWS ? 'bg-orange-50 text-orange-600' : provider === CloudProvider.AZURE ? 'bg-sky-50 text-sky-600' : 'bg-rose-50 text-rose-600'}`}>
                      <Cloud size={24} />
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{provider}</p>
                      <p className="text-2xl font-black text-slate-900 mt-1">{stats.score}<span className="text-xs text-slate-300">/100</span></p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    <div className="p-2 bg-rose-50 rounded-xl border border-rose-100 flex flex-col items-center">
                      <p className="text-[7px] font-black text-rose-600 uppercase tracking-widest mb-0.5">Crit</p>
                      <p className="text-sm font-black text-rose-700 leading-none">{stats.critical}</p>
                    </div>
                    <div className="p-2 bg-amber-50 rounded-xl border border-amber-100 flex flex-col items-center">
                      <p className="text-[7px] font-black text-amber-600 uppercase tracking-widest mb-0.5">High</p>
                      <p className="text-sm font-black text-amber-700 leading-none">{stats.high}</p>
                    </div>
                    <div className="p-2 bg-yellow-50 rounded-xl border border-yellow-100 flex flex-col items-center">
                      <p className="text-[7px] font-black text-yellow-600 uppercase tracking-widest mb-0.5">Med</p>
                      <p className="text-sm font-black text-yellow-700 leading-none">{stats.medium}</p>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-xl border border-blue-100 flex flex-col items-center">
                      <p className="text-[7px] font-black text-blue-600 uppercase tracking-widest mb-0.5">Low</p>
                      <p className="text-sm font-black text-blue-700 leading-none">{stats.low}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-indigo-600 font-bold text-xs">
                    Drill Down <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Priority Risk Inbox - New Level 1.5 Feature */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Priority Inbox</h3>
              <div className="bg-rose-100 text-rose-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Action Needed</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm flex flex-col h-[350px]">
              <div className="overflow-y-auto p-2 no-scrollbar">
                {MOCK_DETAILED_ISSUES.map(issue => (
                  <button 
                    key={issue.id}
                    onClick={() => {
                      const proj = Object.values(MOCK_PROJECTS).flat().find(p => p.id === issue.projectId);
                      if (proj) {
                        setIsGlobalFindings(false);
                        setActiveCloud(proj.provider);
                        setActiveProject(proj);
                        setSelectedIssue(issue.id);
                      }
                    }}
                    className="w-full p-4 hover:bg-slate-50 text-left transition-colors border-b border-slate-100 last:border-0 group"
                  >
                    <div className="flex gap-3">
                      <div className="mt-1">
                        <div className={`w-2 h-2 rounded-full ${SEVERITY_COLOR_MAP[issue.severity]} shadow-[0_0_8px_rgba(244,63,94,0.4)]`}></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-black text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">{issue.title}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">{issue.projectId} • {issue.assetType}</p>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-600" />
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-auto p-4 border-t border-slate-100 bg-slate-50/50">
                <button 
                  onClick={handleViewAllFindings}
                  className="w-full text-center text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors"
                >
                  View All {MOCK_DETAILED_ISSUES.length + 123} Findings
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* STACKED PANEL SYSTEM */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        
        {/* Level 3 Panel: Account/Project List */}
        <div 
          className={`absolute inset-y-0 right-0 bg-white shadow-2xl transition-all duration-500 ease-in-out pointer-events-auto border-l border-slate-200 flex flex-col z-40`}
          style={{ 
            width: `${DRAWER_1_WIDTH}px`,
            transform: activeCloud ? ((activeProject || isGlobalFindings) ? `translateX(-${DRAWER_2_WIDTH}px)` : 'translateX(0)') : 'translateX(100%)' 
          }}
        >
          {activeCloud && (
            <div className="h-full flex flex-col">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100">
                    <ListFilter size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">{activeCloud} Accounts</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select project to drill</p>
                  </div>
                </div>
                <button onClick={closeDrawers} className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-400">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search accounts..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all shadow-inner"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  {filteredProjects.map(proj => (
                    <button 
                      key={proj.id}
                      onClick={() => handleProjectSelect(proj)}
                      className={`w-full p-6 rounded-[2rem] text-left border transition-all flex flex-col gap-4 relative group ${
                        activeProject?.id === proj.id 
                          ? 'bg-indigo-600 border-indigo-600 shadow-2xl shadow-indigo-100 text-white translate-x-[-10px]' 
                          : 'bg-white border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-800 shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0 pr-4">
                          <h4 className="font-black text-lg truncate leading-tight mb-1">{proj.name}</h4>
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                            proj.environment === Environment.PROD ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {proj.environment}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black">{proj.score}%</p>
                          <p className={`text-[9px] font-bold uppercase tracking-tighter ${activeProject?.id === proj.id ? 'text-indigo-200' : 'text-slate-400'}`}>Health</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${activeProject?.id === proj.id ? 'bg-rose-300 animate-pulse' : 'bg-rose-600'}`}></div>
                          <span className="text-[11px] font-bold uppercase tracking-tight">{proj.criticalCount} Critical</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${activeProject?.id === proj.id ? 'bg-amber-300' : 'bg-amber-500'}`}></div>
                          <span className="text-[11px] font-bold uppercase tracking-tight">{proj.highCount} High</span>
                        </div>
                      </div>

                      <div className={`absolute right-4 bottom-8 transition-opacity ${activeProject?.id === proj.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                         <ChevronRight size={24} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Level 4 & 5 Panel: Operational Remediation */}
        <div 
          className={`absolute inset-y-0 right-0 bg-white shadow-2xl transition-all duration-500 ease-in-out pointer-events-auto border-l border-slate-200 flex flex-col z-50`}
          style={{ 
            width: `${DRAWER_2_WIDTH}px`,
            transform: (activeProject || isGlobalFindings) ? 'translateX(0)' : 'translateX(100%)'
          }}
        >
          {(activeProject || isGlobalFindings) && (
            <div className="h-full flex flex-col">
              <div className="p-8 border-b border-slate-200 flex justify-between items-center bg-white sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                    <Activity size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                      {isGlobalFindings ? (activeCategoryFilter ? `${activeCategoryFilter} Findings` : "Global Findings") : activeProject?.name}
                    </h3>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         {isGlobalFindings ? (activeCategoryFilter ? "Scoped View" : "Aggregate View") : `${activeProject?.provider} • ${activeProject?.environment}`}
                       </span>
                       <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                       <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                         <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> 
                         {isGlobalFindings ? "Multi-Account Sync" : "Active Scanning"}
                       </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <button onClick={() => { setIsGlobalFindings(false); setActiveProject(null); setActiveCategoryFilter(null); }} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                     <ArrowLeft size={24} />
                   </button>
                   <button onClick={closeDrawers} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                     <X size={24} />
                   </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar">
                {/* Asset Status Summary - Level 4 (Only shown for specific projects) */}
                {!isGlobalFindings && activeProject && (
                  <div className="grid grid-cols-3 gap-6">
                    {activeProject.assets.map(asset => (
                      <div key={asset.type} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{asset.type.split(' / ')[0]}</span>
                          <div className={`w-3 h-3 rounded-full ${asset.isMisconfig ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]' : 'bg-emerald-500'}`}></div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-slate-800 leading-none">{asset.successRate}%</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Passed</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Findings Table */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                      {isGlobalFindings ? (activeCategoryFilter ? `${activeCategoryFilter} Risk Stack` : "Priority Risk Stack") : "Project Misconfigurations"}
                    </h4>
                    <div className="flex items-center gap-4">
                       <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">History</button>
                       <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors flex items-center gap-1">
                         <ListFilter size={14}/> Filters
                       </button>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {displayIssues.map(issue => (
                      <div key={issue.id} className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all">
                        <button 
                          onClick={() => handleIssueClick(issue)}
                          className={`w-full p-8 flex justify-between items-center text-left transition-colors ${selectedIssue === issue.id ? 'bg-indigo-50/20' : 'hover:bg-slate-50'}`}
                        >
                          <div className="flex-1 pr-6">
                            <h5 className="text-xl font-black text-slate-900 leading-tight mb-2">{issue.title}</h5>
                            <div className="flex items-center gap-4">
                               <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase text-white ${SEVERITY_COLOR_MAP[issue.severity]}`}>
                                  {issue.severity}
                               </div>
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">• {issue.assetType}</span>
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">• {issue.projectId}</span>
                            </div>
                          </div>
                          <div className={`p-2 rounded-full transition-all ${selectedIssue === issue.id ? 'bg-indigo-600 text-white rotate-90' : 'bg-slate-100 text-slate-400'}`}>
                            <ChevronRight size={20} />
                          </div>
                        </button>
                        
                        {/* Level 5: Detailed Remediation Guidance */}
                        {selectedIssue === issue.id && (
                          <div className="p-10 border-t border-slate-100 bg-white space-y-10 animate-in slide-in-from-top-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                              <div className="space-y-8">
                               <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative overflow-hidden">
                                  <div className="absolute top-[-20px] right-[-20px] text-indigo-50 opacity-20">
                                    <Sparkles size={120} />
                                  </div>
                                  <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Sparkles size={16} /> AI Remediation Guide
                                  </h5>
                                  {loadingAi === issue.id ? (
                                    <div className="flex items-center gap-4 py-8 text-slate-500 font-bold italic">
                                       <Loader2 size={24} className="animate-spin text-indigo-600" /> Thinking...
                                    </div>
                                  ) : (
                                    <div className="space-y-6 text-sm leading-relaxed text-slate-700">
                                      <div>
                                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Impact (What)</p>
                                        <p className="font-semibold text-slate-800">{aiGuidance[issue.id]?.what}</p>
                                      </div>
                                      <div>
                                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Target Console (Where)</p>
                                        <p className="font-mono text-[11px] bg-white p-3 rounded-xl border border-indigo-100 text-indigo-700 shadow-inner">{aiGuidance[issue.id]?.where}</p>
                                      </div>
                                      <div className="pt-4 border-t border-slate-200">
                                        <div className="flex gap-4 mb-4">
                                          <button onClick={() => setRemediationTab('manual')} className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-colors ${remediationTab === 'manual' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'}`}>
                                            Manual Fix
                                          </button>
                                          <button onClick={() => setRemediationTab('cli')} className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-colors ${remediationTab === 'cli' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'}`}>
                                            CLI Steps
                                          </button>
                                        </div>
                                        {remediationTab === 'manual' ? (
                                          <p className="whitespace-pre-line font-medium leading-relaxed">{aiGuidance[issue.id]?.how}</p>
                                        ) : (
                                          <div className="bg-slate-900 rounded-xl p-4 font-mono text-[11px] text-emerald-400">
                                            $ gcloud storage buckets update ... --public-access-prevention
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                               </div>

                               <div className="flex gap-4">
                                  <button className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-100">
                                     <Send size={18} /> Push to Triage
                                  </button>
                                  <button className="p-4 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl hover:text-indigo-600 transition-all">
                                     <ExternalLink size={20} />
                                  </button>
                               </div>
                              </div>

                              <div className="space-y-6">
                                <div className="space-y-4">
                                  <div className="flex justify-between items-center px-1">
                                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Terraform Fix (IaC)</span>
                                     <button 
                                        onClick={() => copyToClipboard(aiGuidance[issue.id]?.terraform || '')}
                                        className={`text-[10px] font-black flex items-center gap-1.5 px-4 py-2 rounded-full transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-slate-100 hover:bg-slate-800'}`}
                                     >
                                        {copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? 'Copied' : 'Copy HCL'}
                                     </button>
                                  </div>
                                  <div className="bg-slate-900 rounded-[2.5rem] p-8 text-xs font-mono text-indigo-300 overflow-x-auto min-h-[350px] border border-slate-800 shadow-2xl">
                                     {loadingAi === issue.id ? (
                                       <div className="flex items-center gap-3 text-slate-600">
                                         <Loader2 size={16} className="animate-spin" /> # Synthesizing code...
                                       </div>
                                     ) : (
                                       <code className="block leading-relaxed whitespace-pre-wrap">{aiGuidance[issue.id]?.terraform}</code>
                                     )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {displayIssues.length === 0 && (
                       <div className="p-20 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] space-y-6">
                          <ShieldCheck size={48} className="mx-auto text-slate-300" />
                          <div>
                            <h6 className="text-xl font-black text-slate-800 mb-2">Clean Slate</h6>
                            <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">No active misconfigurations found in this category.</p>
                          </div>
                       </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-8 border-t border-slate-100 bg-white sticky bottom-0">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                       <div className="flex -space-x-4">
                          {[1,2,3].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400">
                              {String.fromCharCode(64 + i)}
                            </div>
                          ))}
                       </div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DevSecOps Active</p>
                    </div>
                    <button className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-sm font-black hover:bg-slate-800 shadow-xl transition-all">
                       Download Audit Trail
                    </button>
                 </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Backdrop */}
      {activeCloud && (
        <div 
          onClick={closeDrawers}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-[4px] z-30 transition-all duration-500 cursor-pointer pointer-events-auto"
        ></div>
      )}
    </div>
  );
}
