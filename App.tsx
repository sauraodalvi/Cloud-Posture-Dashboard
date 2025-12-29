
import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, Search, ChevronRight, ChevronLeft, X, Cloud, AlertTriangle, ExternalLink, 
  Copy, Check, Send, TrendingUp, Filter, ArrowLeft, Loader2, Sparkles, 
  Zap, LayoutGrid, Activity, History, MoreVertical, Globe, Shield,
  Terminal, MousePointer2, ListFilter, Bell, RefreshCw, Calendar,
  LayoutDashboard, Database, AlertCircle, FileText, Settings, 
  ShieldAlert, Eye, MessageSquare, ChevronDown
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const DRAWER_1_WIDTH = 420;
  const DRAWER_2_WIDTH = 780;

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

  // Helper to find a cloud provider given a projectId
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
    { icon: Database, label: 'Inventory' },
    { icon: AlertCircle, label: 'Issues' },
    { icon: ShieldCheck, label: 'Compliance' },
    { icon: ShieldAlert, label: 'Runtime Protection' },
    { icon: Activity, label: 'Remediation' },
    { icon: Bell, label: 'Monitors / Alerts' },
    { icon: FileText, label: 'Reports' },
    { icon: MessageSquare, label: 'Notifications' },
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
    // If drilling down via a specific project, only show that project's issues
    if (activeProject) base = base.filter(iss => iss.projectId === activeProject.id);
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

  const handleProjectSelect = (proj: Project) => {
    setActiveProject(proj);
    setIsGlobalFindings(false);
    setSelectedIssue(null);
    setActiveCategoryFilter(null);
  };

  const priorityInboxItems = useMemo(() => {
    return MOCK_DETAILED_ISSUES
      .filter(i => i.severity === Severity.CRITICAL)
      .sort((a, b) => a.detectedTime.localeCompare(b.detectedTime))
      .slice(0, 5);
  }, []);

  return (
    <div className="flex h-screen bg-[#F0F4F9] font-sans overflow-hidden text-[#1E293B]">
      
      {/* SIDEBAR */}
      <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-[#050E21] flex flex-col shrink-0 transition-all duration-300 relative z-30 shadow-2xl`}>
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-10 bg-[#10192E] border border-slate-800 text-slate-400 p-1.5 rounded-full z-10 hover:text-white shadow-lg transition-transform hover:scale-110"
        >
          {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className={`p-6 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-2'}`}>
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white shrink-0">
            <ShieldCheck size={20} />
          </div>
          {!isSidebarCollapsed && <span className="text-white font-bold tracking-widest text-lg uppercase truncate">AccuKnox</span>}
        </div>

        <div className="mt-4 px-3 flex-1 overflow-y-auto no-scrollbar">
          {!isSidebarCollapsed && (
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input type="text" placeholder="Search" className="w-full bg-[#10192E] border-none rounded-md py-2 pl-9 pr-4 text-xs text-slate-400" />
            </div>
          )}
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button key={item.label} className={`w-full flex items-center px-3 py-2.5 rounded-md transition-all ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} ${item.active ? 'bg-[#3C3FE1] text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-[#10192E]'}`}>
                <item.icon size={18} />
                {!isSidebarCollapsed && <span className="text-xs font-semibold truncate">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        {!isSidebarCollapsed && (
          <div className="p-4 mb-4">
            <div className="bg-[#10192E] p-4 rounded-lg border border-slate-800">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-3">Onboarding</p>
              <div className="space-y-2 text-[10px]">
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">✓</div><span className="text-slate-300">Cloud Accounts</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">✓</div><span className="text-slate-300">Clusters</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border border-slate-600 text-slate-600 flex items-center justify-center">3</div><span className="text-slate-500">Registry</span></div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 relative">
        
        {/* TOP NAVBAR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-20">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>Home</span> <ChevronRight size={12} /> <span className="text-slate-900 font-bold uppercase">Dashboard</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-600 hover:bg-slate-50">
              <RefreshCw size={14} /> Refresh
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#000840] text-white rounded-md text-xs font-bold">
              <Calendar size={14} /> Last 7 days <ChevronDown size={14} />
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs border border-indigo-200">AJ</div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className={`flex-1 overflow-y-auto p-8 space-y-8 transition-all duration-500 ${activeCloud ? 'blur-[8px] opacity-40 scale-[0.98]' : ''}`}>
          
          {/* Global Row */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3 bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-4">Risk Health</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-indigo-600 tracking-tighter">82</span>
                <span className="text-slate-300 font-bold text-xl">/100</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-emerald-600 font-bold text-xs bg-emerald-50 w-fit px-3 py-1 rounded-full">
                <TrendingUp size={14} /> +5.2% vs Last Week
              </div>
            </div>

            <div className="lg:col-span-5 bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative min-h-[220px]">
              <h3 className="font-bold text-sm text-slate-800 tracking-tight mb-6">Postural Velocity</h3>
              <div className="absolute inset-x-8 bottom-6 top-20">
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
                    <Tooltip contentStyle={{borderRadius:'8px', border:'none'}} />
                    <Area type="monotone" dataKey="s" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative min-h-[220px]">
              <h3 className="font-bold text-sm text-slate-800 tracking-tight mb-2">Issue Distribution</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 italic">Click bars to filter</p>
              <div className="absolute inset-x-8 bottom-6 top-24">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={misconfigTypeData} layout="vertical" margin={{ left: -10 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="type" type="category" axisLine={false} tickLine={false} tick={{fill:'#94a3b8', fontSize:10, fontWeight:800}} width={80} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} content={({ active, payload }) => active && payload ? (
                      <div className="bg-slate-900 text-white p-2 rounded-lg text-[10px] font-bold">
                        {payload[0].payload.type}: {payload[0].value} ({payload[0].payload.percentage}%)
                      </div>
                    ) : null} />
                    <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={12} onClick={handleCategoryClick} className="cursor-pointer">
                      <LabelList dataKey="percentage" position="right" content={(props: any) => <text x={props.x + props.width + 5} y={props.y + 10} fill="#6366f1" fontSize={9} fontWeight={900}>{props.value}%</text>} />
                      {misconfigTypeData.map((e, i) => <Cell key={i} fill={e.type === activeCategoryFilter ? '#4338ca' : '#6366f1'} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Cloud Providers Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(Object.entries(CLOUD_STATS) as [CloudProvider, any][]).map(([provider, stats]) => (
              <button 
                key={provider}
                onClick={() => setActiveCloud(provider)}
                className="group bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all text-left relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className={`p-3 rounded-lg shadow-inner ${provider === CloudProvider.AWS ? 'bg-orange-50 text-orange-600' : provider === CloudProvider.AZURE ? 'bg-sky-50 text-sky-600' : 'bg-rose-50 text-rose-600'}`}>
                    <Cloud size={20} />
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{provider}</p>
                    <p className="text-xl font-black text-slate-900 mt-1">{stats.score}<span className="text-xs text-slate-300">/100</span></p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {[
                    { l: 'Crit', v: stats.critical, c: 'rose' },
                    { l: 'High', v: stats.high, c: 'amber' },
                    { l: 'Med', v: stats.medium, c: 'yellow' },
                    { l: 'Low', v: stats.low, c: 'blue' }
                  ].map(s => (
                    <div key={s.l} className={`p-2 bg-${s.c}-50 rounded-lg border border-${s.c}-100 flex flex-col items-center`}>
                      <p className={`text-[7px] font-black text-${s.c}-600 uppercase mb-0.5`}>{s.l}</p>
                      <p className={`text-sm font-black text-${s.c}-700 leading-none`}>{s.v}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-indigo-600 font-bold text-xs uppercase tracking-widest opacity-80 group-hover:opacity-100">
                  Explore <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </section>

          {/* Priority Inbox Section */}
          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Priority Remediation Inbox</h3>
                <span className="bg-rose-100 text-rose-600 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Action Required</span>
             </div>
             <div className="divide-y divide-slate-100">
                {priorityInboxItems.map(issue => (
                  <button key={issue.id} onClick={() => handleInboxItemClick(issue)} className="w-full p-5 hover:bg-slate-50 text-left transition-all flex items-center gap-5 group">
                     <div className={`w-2.5 h-2.5 rounded-full ${SEVERITY_COLOR_MAP[issue.severity]} shrink-0 shadow-sm animate-pulse`}></div>
                     <div className="flex-1">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{issue.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{issue.projectId}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{issue.assetType}</span>
                        </div>
                     </div>
                     <div className="text-[10px] font-black text-slate-400 uppercase pr-2">{issue.detectedTime}</div>
                     <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-600 transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
             </div>
          </section>
        </div>

        {/* DRAWERS SYSTEM */}
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
           
           {/* Level 3: Projects Drawer */}
           <div 
             className={`absolute inset-y-0 right-0 bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.1)] transition-all duration-500 ease-in-out pointer-events-auto border-l border-slate-200 flex flex-col z-[101]`}
             style={{ 
               width: `${DRAWER_1_WIDTH}px`, 
               transform: activeCloud ? ((activeProject || isGlobalFindings) ? `translateX(-${DRAWER_2_WIDTH}px)` : 'translateX(0)') : 'translateX(100%)' 
             }}
           >
             {activeCloud && (
               <div className="h-full flex flex-col">
                 <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-[#050E21] text-white">
                    <div className="flex items-center gap-4">
                       <div className="bg-indigo-600 p-2.5 rounded-xl"><Cloud size={24} /></div>
                       <div>
                          <h3 className="font-black text-lg tracking-tight uppercase">{activeCloud} Accounts</h3>
                          <p className="text-[10px] font-bold text-indigo-300 tracking-widest uppercase">Select project to drill down</p>
                       </div>
                    </div>
                    <button onClick={closeDrawers} className="p-2 hover:bg-white/10 rounded-lg text-white/60 transition-colors"><X size={20} /></button>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto p-8 space-y-5 no-scrollbar bg-slate-50/50">
                    <div className="relative mb-4">
                      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" placeholder="Filter projects..." className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    {filteredProjects.map(proj => (
                      <button 
                        key={proj.id} 
                        onClick={() => handleProjectSelect(proj)} 
                        className={`w-full p-6 rounded-2xl text-left border transition-all flex flex-col gap-6 relative group ${
                          activeProject?.id === proj.id 
                            ? 'bg-[#000840] border-[#000840] text-white shadow-2xl scale-[1.02] z-10' 
                            : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-md text-slate-800'
                        }`}
                      >
                         <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">{proj.environment}</span>
                              <h4 className="font-black text-base truncate max-w-[200px] leading-tight">{proj.name}</h4>
                            </div>
                            <div className={`px-2 py-1 rounded-lg text-[10px] font-black ${activeProject?.id === proj.id ? 'bg-indigo-500' : 'bg-slate-100'} transition-colors`}>
                              SCORE: {proj.score}%
                            </div>
                         </div>
                         <div className={`flex items-center gap-6 pt-5 border-t ${activeProject?.id === proj.id ? 'border-white/10' : 'border-slate-50'}`}>
                            <div className="flex flex-col">
                               <span className="text-[8px] font-black opacity-50 uppercase mb-1">Critical</span>
                               <span className={`text-sm font-black ${activeProject?.id === proj.id ? 'text-white' : 'text-rose-600'}`}>{proj.criticalCount}</span>
                            </div>
                            <div className="flex flex-col">
                               <span className="text-[8px] font-black opacity-50 uppercase mb-1">High</span>
                               <span className={`text-sm font-black ${activeProject?.id === proj.id ? 'text-white' : 'text-amber-500'}`}>{proj.highCount}</span>
                            </div>
                         </div>
                         <div className="absolute top-1/2 -translate-y-1/2 right-6 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                            <ChevronRight size={20} className={activeProject?.id === proj.id ? 'text-indigo-400' : 'text-slate-300'} />
                         </div>
                      </button>
                    ))}
                 </div>
               </div>
             )}
           </div>

           {/* Level 4/5: Findings Drawer */}
           <div 
             className={`absolute inset-y-0 right-0 bg-[#F8FAFC] shadow-[-30px_0_80px_rgba(0,0,0,0.15)] transition-all duration-500 ease-in-out pointer-events-auto border-l border-slate-200 flex flex-col z-[102]`}
             style={{ 
               width: `${DRAWER_2_WIDTH}px`, 
               transform: (activeProject || isGlobalFindings) ? 'translateX(0)' : 'translateX(100%)' 
             }}
           >
              {(activeProject || isGlobalFindings) && (
                <div className="h-full flex flex-col">
                   <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 shadow-sm">
                      <div className="flex items-center gap-5">
                        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 shadow-inner"><Activity size={28} /></div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">
                            {isGlobalFindings ? (activeCategoryFilter ? `${activeCategoryFilter} Security Findings` : "All Critical Findings") : activeProject?.name}
                          </h3>
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning {activeCloud} Infrastructure</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => { setIsGlobalFindings(false); setActiveProject(null); setActiveCategoryFilter(null); setSelectedIssue(null); }} className="p-2.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-all">
                          <ArrowLeft size={22} />
                        </button>
                        <button onClick={closeDrawers} className="p-2.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all">
                          <X size={22} />
                        </button>
                      </div>
                   </div>

                   <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
                      {displayIssues.map(issue => (
                        <div key={issue.id} className={`bg-white border rounded-3xl overflow-hidden shadow-sm transition-all duration-300 ${selectedIssue === issue.id ? 'ring-2 ring-indigo-500/20 border-indigo-200' : 'border-slate-100 hover:border-indigo-100 hover:shadow-md'}`}>
                           <button onClick={() => handleIssueClick(issue)} className={`w-full p-8 flex justify-between items-start text-left transition-colors ${selectedIssue === issue.id ? 'bg-slate-50/50' : 'hover:bg-slate-50/30'}`}>
                              <div className="flex-1 pr-10">
                                 <div className="flex items-center gap-3 mb-3">
                                    <div className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase text-white ${SEVERITY_COLOR_MAP[issue.severity]}`}>{issue.severity}</div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{issue.assetType}</span>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">•</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{issue.detectedTime}</span>
                                 </div>
                                 <h5 className="text-base font-black text-slate-900 leading-snug">{issue.title}</h5>
                                 <p className="text-xs text-slate-500 mt-2 line-clamp-2 font-medium">{issue.description}</p>
                              </div>
                              <div className={`p-2 rounded-xl transition-all ${selectedIssue === issue.id ? 'bg-indigo-600 text-white rotate-90' : 'bg-slate-100 text-slate-400'}`}>
                                <ChevronRight size={20} />
                              </div>
                           </button>

                           {selectedIssue === issue.id && (
                             <div className="p-10 border-t border-slate-100 bg-[#FBFCFE] animate-in slide-in-from-top-4 duration-500">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                   <div className="space-y-8">
                                      <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                                         <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><Sparkles size={80} /></div>
                                         <h6 className="text-[11px] font-black text-indigo-600 uppercase mb-6 flex items-center gap-2">
                                           <div className="p-1.5 bg-indigo-100 rounded-lg"><Sparkles size={16}/></div> 
                                           Remediation Intelligence
                                         </h6>
                                         
                                         {loadingAi === issue.id ? (
                                           <div className="flex flex-col items-center justify-center py-10 space-y-4">
                                              <Loader2 size={32} className="animate-spin text-indigo-500" />
                                              <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Consulting Gemini Engine...</p>
                                           </div>
                                         ) : (
                                            <div className="space-y-6 text-sm leading-relaxed">
                                               <div>
                                                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Risk Context</p>
                                                  <p className="font-bold text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-100">{aiGuidance[issue.id]?.what}</p>
                                               </div>
                                               <div className="pt-2">
                                                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Suggested Action</p>
                                                  <p className="font-medium text-slate-600 leading-relaxed italic">{aiGuidance[issue.id]?.how}</p>
                                               </div>
                                            </div>
                                         )}
                                      </div>
                                      <div className="flex flex-col gap-3">
                                         <button className="w-full py-4 bg-[#000840] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 hover:shadow-xl transition-all flex items-center justify-center gap-3">
                                            <Send size={16} /> Execute Triage Flow
                                         </button>
                                         <button className="w-full py-4 bg-white text-[#000840] border border-[#000840]/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                                            <MessageSquare size={16} /> Assign to Security Team
                                         </button>
                                      </div>
                                   </div>
                                   
                                   <div className="space-y-4">
                                      <div className="flex justify-between items-end mb-1">
                                         <div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Automation Template</span>
                                            <h4 className="text-sm font-black text-slate-800">Terraform HCL</h4>
                                         </div>
                                         <button 
                                           onClick={() => copyToClipboard(aiGuidance[issue.id]?.terraform || '')} 
                                           className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${copied ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                                         >
                                            {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy Code</>}
                                         </button>
                                      </div>
                                      <div className="bg-[#050E21] p-8 rounded-3xl text-[11px] font-mono text-indigo-200 min-h-[300px] shadow-2xl relative overflow-hidden group">
                                         <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity"><Terminal size={40} /></div>
                                         <pre className="relative z-10 whitespace-pre-wrap leading-relaxed">
                                            {aiGuidance[issue.id]?.terraform || '// Awaiting AI synthesis...'}
                                         </pre>
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

      {/* GLOBAL BACKDROP */}
      {activeCloud && (
        <div 
          onClick={closeDrawers} 
          className="fixed inset-0 bg-[#050E21]/60 backdrop-blur-[4px] z-[90] transition-opacity duration-500 cursor-pointer pointer-events-auto"
        ></div>
      )}
    </div>
  );
}
