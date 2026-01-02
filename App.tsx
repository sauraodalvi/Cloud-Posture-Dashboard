
import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, Search, ChevronRight, ChevronLeft, X, Cloud, AlertTriangle, ExternalLink, 
  Copy, Check, Send, TrendingUp, Filter, ArrowLeft, Loader2, Sparkles, 
  Zap, LayoutGrid, Activity, History, MoreVertical, Globe, Shield,
  Terminal, MousePointer2, ListFilter, Bell, RefreshCw, Calendar,
  LayoutDashboard, Database, AlertCircle, FileText, Settings, 
  ShieldAlert, Eye, MessageSquare, ChevronDown, Clock, Code
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell, LabelList, PieChart, Pie
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const DRAWER_1_WIDTH = 420;
  const DRAWER_2_WIDTH = 780;

  const handleProjectSelect = (proj: Project) => {
    setActiveProject(proj);
    setIsGlobalFindings(false);
    setSelectedIssue(null);
    setActiveCategoryFilter(null);
  };

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

  const closeDrawers = () => {
    setActiveCloud(null);
    setActiveProject(null);
    setIsGlobalFindings(false);
    setActiveCategoryFilter(null);
    setSelectedIssue(null);
  };

  const findProviderByProjectId = (id: string) => {
    for (const [provider, projects] of Object.entries(MOCK_PROJECTS)) {
      if (projects.some(p => p.id === id)) return provider as CloudProvider;
    }
    return CloudProvider.GCP;
  };

  const handleInboxItemClick = (issue: MisconfigDetail) => {
    const provider = findProviderByProjectId(issue.projectId);
    setActiveCloud(provider);
    setIsGlobalFindings(true);
    setSelectedIssue(issue.id);
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: AlertCircle, label: 'Issues' },
    { icon: ShieldCheck, label: 'Compliance' },
    { icon: Database, label: 'Inventory' },
    { icon: ShieldAlert, label: 'Security' },
    { icon: Activity, label: 'Remediate' },
    { icon: Settings, label: 'Settings' },
  ];

  const handleCategoryClick = (data: any) => {
    const assetType = data.type as AssetType;
    setIsGlobalFindings(true);
    setActiveCategoryFilter(assetType);
    setActiveCloud(CloudProvider.GCP);
    setActiveProject(null);
    setSelectedIssue(null);
  };

  const displayIssues = useMemo(() => {
    let base = isGlobalFindings ? MOCK_DETAILED_ISSUES : (activeProject ? MOCK_DETAILED_ISSUES.filter(iss => iss.projectId === activeProject.id) : []);
    if (activeCategoryFilter) base = base.filter(iss => iss.assetType === activeCategoryFilter);
    // Explicitly filter by active project if not in global findings mode
    if (!isGlobalFindings && activeProject) {
      base = MOCK_DETAILED_ISSUES.filter(iss => iss.projectId === activeProject.id);
    }
    return base;
  }, [isGlobalFindings, activeProject, activeCategoryFilter]);

  const filteredProjects = useMemo(() => {
    if (!activeCloud) return [];
    const projects = MOCK_PROJECTS[activeCloud] || [];
    if (!searchTerm) return projects;
    return projects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [activeCloud, searchTerm]);

  const misconfigTypeData = useMemo(() => {
    const raw = [
      { type: AssetType.IAM, count: 52 },
      { type: AssetType.NETWORK, count: 48 },
      { type: AssetType.STORAGE, count: 32 },
      { type: AssetType.COMPUTE, count: 28 },
      { type: AssetType.LOGGING, count: 15 },
    ];
    const total = raw.reduce((acc, curr) => acc + curr.count, 0);
    return raw.map(item => ({
      ...item,
      percentage: Math.round((item.count / total) * 100)
    }));
  }, []);

  const priorityInboxItems = useMemo(() => {
    return MOCK_DETAILED_ISSUES
      .filter(i => i.severity === Severity.CRITICAL)
      .sort((a, b) => a.detectedTime.localeCompare(b.detectedTime))
      .slice(0, 4);
  }, []);

  return (
    <div className="flex h-screen bg-[#F1F5F9] font-sans overflow-hidden text-[#1E293B]">
      
      {/* SIDEBAR */}
      <aside className={`${isSidebarCollapsed ? 'w-16' : 'w-64'} bg-[#020617] flex flex-col shrink-0 transition-all duration-300 relative z-30 shadow-2xl`}>
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-8 bg-indigo-600 text-white p-1 rounded-full z-10 shadow-lg"
        >
          {isSidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        <div className="h-16 flex items-center justify-center border-b border-white/5">
          <ShieldCheck size={26} className="text-indigo-500" />
          {!isSidebarCollapsed && <span className="ml-3 text-white font-black text-sm uppercase tracking-widest">AccuKnox</span>}
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1">
          {sidebarItems.map((item) => (
            <button key={item.label} className={`w-full flex items-center h-10 rounded-md transition-all ${isSidebarCollapsed ? 'justify-center' : 'px-3 gap-3'} ${item.active ? 'bg-indigo-600/90 text-white' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'}`}>
              <item.icon size={18} />
              {!isSidebarCollapsed && <span className="text-xs font-bold truncate tracking-wide">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* TOP NAVBAR */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <Globe size={12} /> <span>Multi-Cloud Operations</span> <ChevronRight size={10} /> <span className="text-slate-900">Dashboard</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="h-8 px-3 bg-white border border-slate-200 rounded text-[10px] font-black text-slate-700 hover:bg-slate-50 uppercase tracking-tighter shadow-sm flex items-center gap-1.5">
              <RefreshCw size={12} /> Refresh
            </button>
            <div className="h-8 px-3 bg-[#020617] text-white rounded flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter shadow-md">
              <Calendar size={12} /> Last 7 Days <ChevronDown size={10} />
            </div>
            <div className="w-8 h-8 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs shadow-sm">AJ</div>
          </div>
        </header>

        {/* DASHBOARD */}
        <div className={`flex-1 overflow-y-auto p-6 space-y-6 transition-all duration-500 ${activeCloud ? 'blur-lg opacity-40 scale-[0.99] pointer-events-none' : ''}`}>
          
          {/* Top Integrated Row */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Risk Health */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-indigo-200 transition-colors">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Health Score</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-slate-900 tracking-tighter">82</span>
                <span className="text-slate-300 font-bold text-xl">/100</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded w-fit uppercase tracking-tight">
                <TrendingUp size={12} /> +5.2% Trend
              </div>
            </div>

            {/* Postural Velocity */}
            <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative h-40">
              <div className="flex justify-between items-start">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Velocity Timeline</h3>
                <span className="text-[9px] font-bold text-slate-300 uppercase">Updates every 4h</span>
              </div>
              <div className="absolute inset-x-6 bottom-4 top-14">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[{d:'W1', s:72},{d:'W2', s:78},{d:'W3', s:81},{d:'W4', s:82}]}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fill:'#94a3b8', fontSize:10, fontWeight:700}} />
                    <YAxis hide domain={[60, 100]} />
                    <Area type="monotone" dataKey="s" stroke="#6366f1" strokeWidth={3} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Issue Distribution */}
            <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-40 relative overflow-hidden">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Risk Distribution</h3>
              <div className="absolute inset-x-6 bottom-4 top-12">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={misconfigTypeData} layout="vertical" margin={{ left: -25 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="type" type="category" axisLine={false} tickLine={false} tick={{fill:'#64748b', fontSize:9, fontWeight:800}} width={80} />
                    <Bar dataKey="count" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={10} onClick={handleCategoryClick} className="cursor-pointer">
                      <LabelList dataKey="percentage" position="right" content={(props: any) => <text x={props.x + props.width + 6} y={props.y + 8} fill="#4f46e5" fontSize={9} fontWeight={900}>{props.value}%</text>} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Cloud Providers Row */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(Object.entries(CLOUD_STATS) as [CloudProvider, any][]).map(([provider, stats]) => (
              <button 
                key={provider}
                onClick={() => setActiveCloud(provider)}
                className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-xl transition-all text-left relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-2.5 rounded-lg bg-slate-50 text-slate-900 border border-slate-200 shadow-inner group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors`}>
                    <Cloud size={20} />
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{provider}</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">{stats.score}<span className="text-xs text-slate-300 font-bold">/100</span></p>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-1.5 mb-6">
                  {[
                    { l: 'Crit', v: stats.critical, c: 'rose' },
                    { l: 'High', v: stats.high, c: 'amber' },
                    { l: 'Med', v: stats.medium, c: 'yellow' },
                    { l: 'Low', v: stats.low, c: 'blue' }
                  ].map(s => (
                    <div key={s.l} className={`py-2 flex flex-col items-center rounded bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-all`}>
                      <span className={`text-[7px] font-black text-${s.c}-600 uppercase tracking-widest`}>{s.l}</span>
                      <span className="text-sm font-black text-slate-800">{s.v}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-[10px] font-black text-indigo-600 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                  Explore Infrastructure <ChevronRight size={14} />
                </div>
              </button>
            ))}
          </section>

          {/* Priority Inbox */}
          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
             <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} className="text-rose-600" />
                  <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Critical Alert Inbox</h3>
                </div>
                <span className="bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest shadow-sm">Real-time Feed</span>
             </div>
             <div className="divide-y divide-slate-100">
                {priorityInboxItems.map(issue => (
                  <button key={issue.id} onClick={() => handleInboxItemClick(issue)} className="w-full h-16 px-6 hover:bg-slate-50 text-left transition-all flex items-center gap-5 group">
                     <div className={`w-2 h-2 rounded-full ${SEVERITY_COLOR_MAP[issue.severity]} shrink-0 shadow-sm animate-pulse`}></div>
                     <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-slate-800 truncate group-hover:text-indigo-600 transition-colors tracking-tight">{issue.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter bg-slate-100 px-1.5 py-0.5 rounded">{issue.projectId}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{issue.assetType}</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-2 text-slate-400 font-black text-[9px] uppercase tracking-tighter opacity-60">
                       <Clock size={12} /> {issue.detectedTime}
                     </div>
                     <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
             </div>
          </section>
        </div>

        {/* DRAWER SYSTEM - ENHANCED UI & LOGIC */}
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
           
           {/* Level 3: Projects List */}
           <div 
             className={`absolute inset-y-0 right-0 bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.15)] transition-all duration-500 ease-in-out pointer-events-auto border-l border-slate-200 flex flex-col z-[101]`}
             style={{ 
               width: `${DRAWER_1_WIDTH}px`, 
               transform: activeCloud ? ((activeProject || isGlobalFindings) ? `translateX(-${DRAWER_2_WIDTH}px)` : 'translateX(0)') : 'translateX(100%)' 
             }}
           >
             {activeCloud && (
               <div className="h-full flex flex-col">
                 <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-[#020617] text-white">
                    <div className="flex items-center gap-4">
                       <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20"><Cloud size={24} /></div>
                       <div>
                          <h3 className="font-black text-lg tracking-tight uppercase leading-none mb-1">{activeCloud} Accounts</h3>
                          <p className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase">Infrastructure Inventory</p>
                       </div>
                    </div>
                    <button onClick={closeDrawers} className="p-2 hover:bg-white/10 rounded-lg text-white/60 transition-colors"><X size={20} /></button>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-slate-50/50">
                    <div className="relative mb-6">
                      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" placeholder="Search projects by ID or Name..." className="w-full pl-12 pr-4 h-12 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 shadow-sm transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    
                    {filteredProjects.map(proj => (
                      <button 
                        key={proj.id} 
                        onClick={() => handleProjectSelect(proj)} 
                        className={`w-full p-6 rounded-2xl text-left border transition-all flex flex-col gap-5 relative group ${
                          activeProject?.id === proj.id 
                            ? 'bg-[#020617] border-indigo-500 text-white shadow-2xl scale-[1.02] z-10' 
                            : 'bg-white border-slate-100 hover:border-indigo-200 text-slate-800 shadow-sm'
                        }`}
                      >
                         <div className="flex justify-between items-start">
                            <div>
                              <span className={`text-[9px] font-black uppercase tracking-widest block mb-1.5 ${activeProject?.id === proj.id ? 'text-indigo-400' : 'text-slate-400'}`}>{proj.environment}</span>
                              <h4 className="font-black text-sm truncate max-w-[240px] leading-tight">{proj.name}</h4>
                            </div>
                            <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black shadow-inner ${activeProject?.id === proj.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                              SCORE: {proj.score}%
                            </div>
                         </div>
                         <div className={`flex items-center gap-6 pt-5 border-t ${activeProject?.id === proj.id ? 'border-white/10' : 'border-slate-50'}`}>
                            <div className="flex flex-col">
                               <span className={`text-[8px] font-black uppercase mb-1 tracking-widest ${activeProject?.id === proj.id ? 'text-rose-400' : 'text-rose-600'}`}>Critical</span>
                               <span className="text-sm font-black">{proj.criticalCount}</span>
                            </div>
                            <div className="flex flex-col">
                               <span className={`text-[8px] font-black uppercase mb-1 tracking-widest ${activeProject?.id === proj.id ? 'text-amber-400' : 'text-amber-600'}`}>High Issues</span>
                               <span className="text-sm font-black">{proj.highCount}</span>
                            </div>
                         </div>
                         <ChevronRight size={20} className={`absolute right-6 top-1/2 -translate-y-1/2 transition-all ${activeProject?.id === proj.id ? 'text-indigo-400 opacity-100' : 'text-slate-200 opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`} />
                      </button>
                    ))}
                 </div>
               </div>
             )}
           </div>

           {/* Level 4/5: Detailed Findings and AI Remediation */}
           <div 
             className={`absolute inset-y-0 right-0 bg-[#F8FAFC] shadow-[-30px_0_80px_rgba(0,0,0,0.2)] transition-all duration-500 ease-in-out pointer-events-auto border-l border-slate-200 flex flex-col z-[102]`}
             style={{ 
               width: `${DRAWER_2_WIDTH}px`, 
               transform: (activeProject || isGlobalFindings) ? 'translateX(0)' : 'translateX(100%)' 
             }}
           >
              {(activeProject || isGlobalFindings) && (
                <div className="h-full flex flex-col">
                   <div className="p-8 border-b border-slate-200 flex justify-between items-center bg-white sticky top-0 z-10 shadow-sm">
                      <div className="flex items-center gap-5">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner"><ShieldAlert size={28} /></div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                             <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">{activeCloud} Security Scan</span>
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                          </div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase truncate max-w-md">
                            {isGlobalFindings ? "Critical Scan Results" : activeProject?.name}
                          </h3>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => { setIsGlobalFindings(false); setActiveProject(null); setActiveCategoryFilter(null); setSelectedIssue(null); }} className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all">
                          <ArrowLeft size={24} />
                        </button>
                        <button onClick={closeDrawers} className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all">
                          <X size={24} />
                        </button>
                      </div>
                   </div>

                   <div className="flex-1 overflow-y-auto p-10 space-y-6 no-scrollbar">
                      {displayIssues.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
                           <ShieldCheck size={64} className="opacity-20" />
                           <p className="font-bold text-sm tracking-widest uppercase">No matching issues found</p>
                        </div>
                      ) : displayIssues.map(issue => (
                        <div key={issue.id} className={`bg-white border rounded-3xl overflow-hidden transition-all duration-300 ${selectedIssue === issue.id ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-2xl' : 'border-slate-100 hover:border-indigo-200 hover:shadow-xl'}`}>
                           <button onClick={() => handleIssueClick(issue)} className={`w-full p-8 flex justify-between items-start text-left group transition-colors ${selectedIssue === issue.id ? 'bg-indigo-50/10' : ''}`}>
                              <div className="flex-1 pr-12">
                                 <div className="flex items-center gap-3 mb-4">
                                    <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase text-white shadow-sm ${SEVERITY_COLOR_MAP[issue.severity]}`}>{issue.severity}</div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{issue.assetType}</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{issue.detectedTime}</span>
                                 </div>
                                 <h5 className="text-lg font-black text-slate-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{issue.title}</h5>
                                 <p className="text-sm text-slate-500 line-clamp-2 font-medium leading-relaxed">{issue.description}</p>
                              </div>
                              <div className={`p-2.5 rounded-xl transition-all shadow-sm ${selectedIssue === issue.id ? 'bg-indigo-600 text-white rotate-90 scale-110' : 'bg-slate-100 text-slate-400'}`}>
                                <ChevronRight size={24} />
                              </div>
                           </button>

                           {selectedIssue === issue.id && (
                             <div className="px-10 pb-10 pt-0 animate-in slide-in-from-top-4 duration-500">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-10 bg-[#FBFCFE] rounded-3xl border border-slate-100 shadow-inner">
                                   <div className="lg:col-span-7 space-y-10">
                                      <div className="relative group">
                                         <div className="absolute -top-12 -right-4 opacity-5 group-hover:opacity-10 transition-opacity"><Sparkles size={120} /></div>
                                         <h6 className="text-[11px] font-black text-indigo-600 uppercase mb-6 flex items-center gap-3 tracking-[0.2em]">
                                           <div className="p-2 bg-indigo-100 rounded-xl shadow-inner"><Sparkles size={18} className="animate-pulse" /></div> 
                                           AI Synthesis Engine
                                         </h6>
                                         
                                         {loadingAi === issue.id ? (
                                           <div className="flex flex-col items-center justify-center py-10 space-y-5">
                                              <div className="relative">
                                                <Loader2 size={40} className="animate-spin text-indigo-500" />
                                                <div className="absolute inset-0 flex items-center justify-center"><Zap size={14} className="text-indigo-400" /></div>
                                              </div>
                                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Running Neural Security Analysis...</p>
                                           </div>
                                         ) : (
                                            <div className="space-y-8 animate-in fade-in duration-700">
                                               <div>
                                                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Context & Risk Impact</p>
                                                  <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                                                    <p className="font-black text-slate-800 text-[13px] leading-relaxed italic">"{aiGuidance[issue.id]?.what}"</p>
                                                  </div>
                                               </div>
                                               <div>
                                                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Remediation Steps</p>
                                                  <p className="text-sm text-slate-600 font-medium leading-loose pl-1">{aiGuidance[issue.id]?.how}</p>
                                               </div>
                                            </div>
                                         )}
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <button className="h-12 bg-[#020617] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 hover:shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95">
                                           <Send size={16} /> Triage Case
                                        </button>
                                        <button className="h-12 bg-white text-slate-900 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm">
                                           <MessageSquare size={16} /> Contact SecOps
                                        </button>
                                      </div>
                                   </div>
                                   
                                   <div className="lg:col-span-5 flex flex-col">
                                      <div className="flex justify-between items-end mb-4">
                                         <div>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Automation Script</span>
                                            <h4 className="text-xs font-black text-indigo-600 tracking-tight flex items-center gap-2 uppercase">
                                              <Terminal size={14} /> HashiCorp Terraform
                                            </h4>
                                         </div>
                                         <button 
                                           onClick={() => copyToClipboard(aiGuidance[issue.id]?.terraform || '')} 
                                           className={`h-8 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm transition-all flex items-center gap-2 ${copied ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:scale-95'}`}
                                         >
                                            {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy HCL</>}
                                         </button>
                                      </div>
                                      <div className="bg-[#020617] p-8 rounded-[2rem] text-[10px] font-mono text-indigo-200 flex-1 overflow-auto min-h-[220px] shadow-2xl border border-white/5 relative group">
                                         <div className="absolute bottom-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity"><Code size={40} /></div>
                                         <pre className="whitespace-pre-wrap leading-relaxed relative z-10">{aiGuidance[issue.id]?.terraform || '// Synthesizing automated fix...\n// Consulting cloud security policies...'}</pre>
                                      </div>
                                   </div>
                                </div>
                             </div>
                           )}
                        </div>
                      ))}
                   </div>
                </div>
              )}
           </div>
        </div>

      </div>

      {activeCloud && <div onClick={closeDrawers} className="fixed inset-0 bg-[#020617]/50 backdrop-blur-md z-[90] cursor-pointer transition-opacity duration-500 animate-in fade-in"></div>}
    </div>
  );
}
