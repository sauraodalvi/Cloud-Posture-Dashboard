
import React, { useState, useMemo, useEffect } from 'react';
import {
  Shield,
  List,
  Layout,
  ChevronRight,
  X,
  Filter,
  Clock,
  CheckCircle,
  Info,
  Layers,
  Zap,
  ChevronLeft,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  StickyNote,
  Download,
  RotateCcw
} from 'lucide-react';
import { CloudProvider, Severity, Status, AssetType, Misconfiguration } from './types';
import { MOCK_RECORDS, SEVERITY_COLORS } from './constants';

type Frame = 'COVER' | 'OVERVIEW' | 'LIST';

const WALKTHROUGH_STEPS = [
  {
    anchorId: 'cloud-filter',
    title: 'Cloud Filter',
    text: 'You’re viewing all connected cloud accounts by default to avoid blind spots.'
  },
  {
    anchorId: 'severity-summary',
    title: 'Severity Summary',
    text: 'Start here to quickly spot critical and high-risk misconfigurations.'
  },
  {
    anchorId: 'table-preview',
    title: 'Table Preview',
    text: 'This table lists urgent issues—click any row to inspect details.'
  },
  {
    anchorId: 'filter-chips',
    title: 'Filter Chips',
    text: 'Use filters to narrow issues by severity, cloud, or resource type.'
  },
  {
    anchorId: 'panel-header',
    title: 'Issue Details',
    text: 'Review impact, affected resources, and remediation here.'
  },
  {
    anchorId: 'action-buttons',
    title: 'Action Buttons',
    text: 'Take lightweight actions without risky automation.'
  }
];

export default function App() {
  const [currentFrame, setCurrentFrame] = useState<Frame>('COVER');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [showCloudDropdown, setShowCloudDropdown] = useState(false);
  const [globalCloudFilter, setGlobalCloudFilter] = useState<CloudProvider | 'ALL'>('ALL');

  const [highlightToggle, setHighlightToggle] = useState(false);

  const [filters, setFilters] = useState({
    severity: [] as Severity[],
    cloud: [] as CloudProvider[],
    resourceType: [] as AssetType[]
  });

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [records, setRecords] = useState<Misconfiguration[]>(MOCK_RECORDS);
  const [walkthroughActive, setWalkthroughActive] = useState(false);
  const [walkthroughStep, setWalkthroughStep] = useState(0);

  // Filter Logic
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      // Global Cloud Filter (from dropdown)
      const gCloudMatch = globalCloudFilter === 'ALL' || r.cloud === globalCloudFilter;
      // List View Chips
      const sMatch = filters.severity.length === 0 || filters.severity.includes(r.severity);
      const cMatch = filters.cloud.length === 0 || filters.cloud.includes(r.cloud);
      const tMatch = filters.resourceType.length === 0 || filters.resourceType.includes(r.resourceType);

      return gCloudMatch && sMatch && cMatch && tMatch;
    });
  }, [records, filters, globalCloudFilter]);

  const selectedIssue = useMemo(() => records.find(r => r.id === selectedIssueId), [records, selectedIssueId]);

  // Actions
  const handleUpdateStatus = (id: string, newStatus: Status) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    if (newStatus !== Status.OPEN) setSelectedIssueId(null);
  };

  const handleSnoozeBulk = () => {
    setRecords(prev => prev.map(r => selectedRows.has(r.id) ? { ...r, status: Status.SNOOZED } : r));
    setSelectedRows(new Set());
  };

  const handleExport = (id?: string) => {
    console.log(`Exporting ${id || "view"} to CSV...`);
  };

  const toggleFilter = (cat: keyof typeof filters, val: any) => {
    setFilters(prev => {
      const curr = prev[cat] as any[];
      return { ...prev, [cat]: curr.includes(val) ? curr.filter(v => v !== val) : [...curr, val] };
    });
  };

  const toggleRow = (id: string) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const triggerHighlight = () => {
    setHighlightToggle(true);
    setTimeout(() => setHighlightToggle(false), 800);
  };

  // UI Components
  const Annotation = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => {
    if (!showAnnotations) return null;
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          triggerHighlight();
        }}
        className={`absolute z-[60] bg-yellow-100 border border-yellow-300 p-2 text-[10px] font-bold shadow-md rotate-1 w-44 cursor-pointer hover:scale-105 transition-transform select-none ${className}`}
      >
        <div className="flex gap-1.5 items-start">
          <Zap size={10} className="mt-0.5 text-yellow-600 shrink-0" />
          <p className="leading-tight">{children}</p>
        </div>
      </div>
    );
  };

  const SeverityBadge = ({ sev }: { sev: Severity }) => (
    <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded border ${SEVERITY_COLORS[sev]} border-current`}>
      {sev}
    </span>
  );

  const WalkthroughOverlay = () => {
    if (!walkthroughActive) return null;
    const step = WALKTHROUGH_STEPS[walkthroughStep];
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center">
        <div className="fixed inset-0 bg-black/40" onClick={() => setWalkthroughActive(false)} />
        <div className="bg-white border-2 border-black p-6 w-80 shadow-2xl relative z-[101]">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Step {walkthroughStep + 1}/6</h4>
            <button onClick={() => setWalkthroughActive(false)}><X size={14} /></button>
          </div>
          <h3 className="text-sm font-black uppercase mb-2">{step.title}</h3>
          <p className="text-xs text-gray-700 leading-relaxed mb-6 italic">“{step.text}”</p>
          <div className="flex justify-between">
            <button onClick={() => setWalkthroughActive(false)} className="text-[10px] font-bold uppercase text-gray-400">Skip</button>
            <button
              onClick={() => {
                if (walkthroughStep < WALKTHROUGH_STEPS.length - 1) setWalkthroughStep(prev => prev + 1);
                else setWalkthroughActive(false);
              }}
              className="px-4 py-1.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
            >
              {walkthroughStep === WALKTHROUGH_STEPS.length - 1 ? 'Done' : 'Next'} <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- RENDERING ---

  if (currentFrame === 'COVER') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 grayscale">
        <div className="max-w-4xl w-full bg-white border border-gray-200 shadow-2xl p-16 relative overflow-hidden">
          {/* Repositioned annotation to not overlap the main title */}
          <header className="mb-12 border-b-4 border-black pb-6">
            <h1 className="text-5xl font-black uppercase tracking-tighter text-black">AccuKnox</h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Cloud Posture Dashboard — by Saurao Dalvi</p>
          </header>

          <div className="grid grid-cols-2 gap-12 mb-12">
            <div className="space-y-12">
              <section>
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Problem Statement</h2>
                <p className="text-gray-800 text-sm leading-relaxed">
                  Security engineers struggle to prioritize risks across AWS, Azure, and GCP accounts. This console focuses on identifying top risks in under 3 minutes via a "table-first" operational view.
                </p>
              </section>

              <section>
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Success Metrics</h2>
                <ul className="text-xs font-bold text-gray-700 space-y-2">
                  <li className="flex items-center gap-2">• <span className="text-black">Critical risk identification in {"<"} 10s</span></li>
                  <li className="flex items-center gap-2">• <span className="text-black">Zero-setup multi-cloud visibility</span></li>
                  <li className="flex items-center gap-2">• <span className="text-black">Decisive manual remediation guidance</span></li>
                </ul>
              </section>
            </div>

            <section className="bg-gray-50 p-6 rounded-sm border border-gray-200 h-80 overflow-y-auto custom-scrollbar shadow-inner text-xs">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 sticky top-0 bg-gray-50 pb-2 border-b border-gray-200 w-full z-10">
                User Guide & Glossary
              </h2>
              <div className="space-y-6">

                {/* Terminology */}
                <div>
                  <h3 className="text-[10px] font-black uppercase text-black mb-2 flex items-center gap-2 border-b border-gray-200 pb-1">
                    <HelpCircle size={12} /> 1. Terminology "Un-Complicated"
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-black mb-1">The Cloud Providers (The "Landlords")</h4>
                      <p className="text-gray-600 mb-1">Renting tech space instead of buying.</p>
                      <ul className="pl-4 list-disc text-gray-600 space-y-1">
                        <li><strong className="text-black">AWS/Azure/GCP:</strong> Landlords you rent from (Amazon, Microsoft, Google).</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-black mb-1">The "Assets" (Your Digital Stuff)</h4>
                      <ul className="pl-4 list-disc text-gray-600 space-y-1">
                        <li><strong className="text-black">IAM (Keycard System):</strong> Controls access. <em>Risk: Giving master keys to strangers.</em></li>
                        <li><strong className="text-black">S3 (Digital Filing Cabinets):</strong> Stores files. <em>Risk: Leaving the drawer open for public access.</em></li>
                        <li><strong className="text-black">EC2 (Virtual Computers):</strong> Servers running apps. <em>Risk: Leaving windows (ports) open.</em></li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-black mb-1">The Risk Levels</h4>
                      <ul className="pl-4 list-disc text-gray-600 space-y-1">
                        <li><strong className="text-red-600">Critical (🚨):</strong> EMERGENCY. Front door unlocked. Fix NOW.</li>
                        <li><strong className="text-orange-500">High:</strong> URGENT. Broken window latch. Don't ignore.</li>
                        <li><strong className="text-gray-500">Medium/Low:</strong> MAINTENANCE. Housekeeping tasks.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* App Usage */}
                <div className="pt-2">
                  <h3 className="text-[10px] font-black uppercase text-black mb-2 flex items-center gap-2 border-b border-gray-200 pb-1">
                    <Layout size={12} /> 2. How to Use the App
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-black mb-1">Overview (Morning Coffee View)</h4>
                      <p className="text-gray-600">Get a 10-second health check. If "Critical Risks" &gt; 0, that's your job today.</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-black mb-1">Inventory (To-Do List)</h4>
                      <ul className="pl-4 list-disc text-gray-600 space-y-1">
                        <li><strong className="text-black">Filtering:</strong> Focus on one thing (e.g., "Today is IAM day").</li>
                        <li><strong className="text-black">Bulk Actions:</strong> Select multiple rows to "Snooze" false alarms.</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-black mb-1">Issue Details (Doctor's Note)</h4>
                      <p className="text-gray-600">Click any row to see:</p>
                      <ul className="pl-4 list-disc text-gray-600 space-y-1">
                        <li><strong className="text-black">Description:</strong> Plain English explanation of the problem.</li>
                        <li><strong className="text-black">Remediation:</strong> Copy-paste commands to fix it.</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-black mb-1">Sticky Notes (Training Wheels)</h4>
                      <p className="text-gray-600">Yellow notes explain features. Click any note to find the "Toggle" button.</p>
                    </div>
                  </div>
                </div>

              </div>
            </section>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowAnnotations(!showAnnotations)}
              className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-300 ${highlightToggle ? 'text-yellow-600 scale-110' : 'text-gray-400 hover:text-black'}`}
            >
              <StickyNote size={14} /> {showAnnotations ? 'Hide' : 'Show'} Annotations
            </button>
            <button
              onClick={() => {
                setCurrentFrame('OVERVIEW');
                setWalkthroughActive(true);
              }}
              className="h-14 px-10 bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center gap-3"
            >
              Start Prototype <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 grayscale overflow-hidden relative">
      <WalkthroughOverlay />

      {/* Sidebar */}
      <aside className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6 gap-8 shrink-0 z-50">
        <Shield size={28} className="text-black" />
        <nav className="flex flex-col gap-6">
          <button onClick={() => setCurrentFrame('OVERVIEW')} className={`p-2 rounded ${currentFrame === 'OVERVIEW' ? 'bg-gray-100 text-black' : 'text-gray-400 hover:text-black'}`} title="Overview"><Layout size={20} /></button>
          <button onClick={() => setCurrentFrame('LIST')} className={`p-2 rounded ${currentFrame === 'LIST' ? 'bg-gray-100 text-black' : 'text-gray-400 hover:text-black'}`} title="Inventory"><List size={20} /></button>
        </nav>
        <div className="mt-auto flex flex-col gap-4">
          <button
            onClick={() => setShowAnnotations(!showAnnotations)}
            className={`p-2 rounded transition-all duration-300 ${highlightToggle ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-110' : ''} ${showAnnotations ? 'text-yellow-600 bg-yellow-50 border border-yellow-200' : 'text-gray-400 hover:text-black'}`}
            title="Toggle Notes"
          >
            <StickyNote size={20} />
          </button>
          <button onClick={() => { setWalkthroughStep(0); setWalkthroughActive(true); }} className="p-2 text-gray-400 hover:text-black" title="Help"><HelpCircle size={20} /></button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0 z-40">
          <div className="flex items-center gap-6 relative">
            <h2 className="text-sm font-black uppercase tracking-tight">{currentFrame === 'OVERVIEW' ? 'Posture Overview' : 'Detailed Inventory'}</h2>
            <div className="h-4 w-px bg-gray-200"></div>

            {/* Functional Cloud Filter Dropdown */}
            <div className="relative">
              <div
                id="cloud-filter"
                onClick={() => setShowCloudDropdown(!showCloudDropdown)}
                className="flex items-center gap-2 text-[10px] font-bold text-black border border-black px-3 py-1 bg-white rounded-sm cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <Layers size={14} />
                <span className="uppercase">{globalCloudFilter === 'ALL' ? 'ALL CONNECTED CLOUDS' : globalCloudFilter}</span>
                <ChevronDown size={12} className={`transition-transform ${showCloudDropdown ? 'rotate-180' : ''}`} />
              </div>

              {showCloudDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-black shadow-xl z-[70] py-1">
                  {['ALL', ...Object.values(CloudProvider)].map((cloud) => (
                    <button
                      key={cloud}
                      onClick={() => {
                        setGlobalCloudFilter(cloud as any);
                        setShowCloudDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-[10px] font-bold uppercase hover:bg-gray-100 transition-colors ${globalCloudFilter === cloud ? 'bg-gray-50' : ''}`}
                    >
                      {cloud === 'ALL' ? 'All Connected Clouds' : cloud}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Annotation className="top-12 left-0">All-cloud default ensures comprehensive visibility, but filterable per account.</Annotation>
          </div>
          <div className="flex items-center gap-4">

            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Clock size={12} /> Sync: 2m ago
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center font-bold text-[10px]">JL</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 relative no-scrollbar">
          <Annotation className="top-4 right-8">Operational Console: No onboarding UI. Data is pre-connected.</Annotation>

          {currentFrame === 'OVERVIEW' ? (
            <div className="space-y-8 max-w-7xl mx-auto">
              <div id="severity-summary" className="grid grid-cols-4 gap-6">
                {[
                  { label: 'Cloud Assets', val: globalCloudFilter === 'ALL' ? '1,248' : globalCloudFilter === 'AWS' ? '512' : '368' },
                  { label: 'Open Issues', val: filteredRecords.filter(r => r.status === Status.OPEN).length },
                  { label: 'Critical Risks', val: filteredRecords.filter(r => r.severity === Severity.CRITICAL && r.status === Status.OPEN).length, accent: 'text-red-600' },
                  { label: 'High Priority', val: filteredRecords.filter(r => r.severity === Severity.HIGH && r.status === Status.OPEN).length, accent: 'text-orange-600' }
                ].map(s => (
                  <div key={s.label} className="bg-white p-6 border border-gray-200 rounded-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{s.label}</p>
                    <p className={`text-4xl font-black ${s.accent || 'text-black'}`}>{s.val}</p>
                  </div>
                ))}
              </div>

              <div id="table-preview" className="bg-white border border-gray-200 rounded-sm relative overflow-visible">
                <Annotation className="-top-6 right-0">Table-first design prioritizes speed over visual charts.</Annotation>
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Urgent Findings ({globalCloudFilter === 'ALL' ? 'All' : globalCloudFilter})</h3>
                  <button onClick={() => setCurrentFrame('LIST')} className="text-[10px] font-black text-black hover:underline uppercase flex items-center gap-1">Inventory Explorer <ArrowRight size={12} /></button>
                </div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200 text-[9px] font-black uppercase text-gray-400 tracking-widest bg-white">
                      <th className="px-6 py-4">Severity</th>
                      <th className="px-6 py-4">Cloud</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Resource Name</th>
                      <th className="px-6 py-4">Account ID</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {filteredRecords.filter(r => r.severity === Severity.CRITICAL || r.severity === Severity.HIGH).slice(0, 10).map(r => (
                      <tr key={r.id} onClick={() => setSelectedIssueId(r.id)} className="hover:bg-gray-50 cursor-pointer transition-colors group">
                        <td className="px-6 py-4"><SeverityBadge sev={r.severity} /></td>
                        <td className="px-6 py-4 text-[11px] font-bold">{r.cloud}</td>
                        <td className="px-6 py-4 text-[11px] text-gray-400">{r.resourceType}</td>
                        <td className="px-6 py-4 text-[11px] font-black text-black truncate max-w-[180px]">{r.resourceName}</td>
                        <td className="px-6 py-4 text-[11px] text-gray-400 font-mono">{r.account}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${r.status === Status.OPEN ? 'text-red-500 border-red-200' : 'text-gray-400 border-gray-200'}`}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div id="filter-chips" className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 mr-2">
                  <Filter size={14} className="text-gray-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Inventory Filters</span>
                </div>
                {Object.values(Severity).map(s => (
                  <button key={s} onClick={() => toggleFilter('severity', s)} className={`px-3 py-1 text-[10px] font-black border tracking-widest uppercase transition-all ${filters.severity.includes(s) ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'}`}>{s}</button>
                ))}
                <div className="h-4 w-px bg-gray-200 mx-2"></div>
                {Object.values(AssetType).map(t => (
                  <button key={t} onClick={() => toggleFilter('resourceType', t)} className={`px-3 py-1 text-[10px] font-black border tracking-widest uppercase transition-all ${filters.resourceType.includes(t) ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'}`}>{t}</button>
                ))}
              </div>

              <div className="bg-white border border-gray-200 rounded-sm overflow-visible relative shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <div className="flex items-center gap-4 relative">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Inventory ({filteredRecords.length})</h3>
                    <div className="h-4 w-px bg-gray-200"></div>
                    <button
                      disabled={selectedRows.size === 0}
                      onClick={handleSnoozeBulk}
                      className={`px-4 py-1.5 text-[10px] font-black uppercase border tracking-widest transition-all ${selectedRows.size > 0 ? 'bg-black text-white border-black shadow-lg' : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'}`}
                    >
                      Bulk Snooze ({selectedRows.size})
                    </button>
                    <Annotation className="-bottom-20 -left-4">Multi-select allows engineers to batch process low-risk issues quickly.</Annotation>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <span>{filteredRecords.length} Results</span>
                    <button onClick={() => handleExport()} className="hover:text-black transition-colors flex items-center gap-1 border border-gray-200 px-2 py-1 rounded">
                      <Download size={12} /> CSV
                    </button>
                  </div>
                </div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white border-b border-gray-200 text-[9px] font-black uppercase text-gray-400 tracking-widest">
                      <th className="px-6 py-4 w-12"><input type="checkbox" onChange={(e) => {
                        if (e.target.checked) setSelectedRows(new Set(filteredRecords.map(x => x.id))); else setSelectedRows(new Set());
                      }} /></th>
                      <th className="px-6 py-4">Severity</th>
                      <th className="px-6 py-4">Cloud</th>
                      <th className="px-6 py-4">Resource</th>
                      <th className="px-6 py-4">Account ID</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {filteredRecords.map(r => (
                      <tr
                        key={r.id} onClick={() => setSelectedIssueId(r.id)}
                        className={`hover:bg-gray-50 cursor-pointer transition-colors ${selectedRows.has(r.id) ? 'bg-gray-100' : ''}`}
                      >
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" checked={selectedRows.has(r.id)} onChange={() => toggleRow(r.id)} />
                        </td>
                        <td className="px-6 py-4"><SeverityBadge sev={r.severity} /></td>
                        <td className="px-6 py-4 text-[11px] font-bold">{r.cloud}</td>
                        <td className="px-6 py-4">
                          <div className="text-[11px] font-black text-black leading-tight">{r.resourceName}</div>
                          <div className="text-[9px] text-gray-400 uppercase font-bold">{r.resourceType}</div>
                        </td>
                        <td className="px-6 py-4 text-[11px] text-gray-400 font-mono">{r.account}</td>
                        <td className="px-6 py-4 text-[10px] font-black uppercase tracking-tighter">
                          <span className={r.status === Status.OPEN ? 'text-red-500' : r.status === Status.SNOOZED ? 'text-orange-400' : 'text-green-600'}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Frame 4: Side Panel (Issue Details) */}
      <div
        className={`fixed inset-y-0 right-0 w-[420px] bg-white border-l border-gray-200 shadow-2xl transition-transform duration-300 z-[100] flex flex-col ${selectedIssueId ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {selectedIssue && (
          <>
            <header id="panel-header" className="h-16 px-8 border-b border-gray-200 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-3">
                <SeverityBadge sev={selectedIssue.severity} />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{selectedIssue.id}</span>
              </div>
              <button onClick={() => setSelectedIssueId(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"><X size={20} /></button>
            </header>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 relative no-scrollbar">
              {/* Repositioned annotation to not overlap content */}

              <section>
                <h2 className="text-2xl font-black text-black uppercase tracking-tighter leading-tight mb-4">{selectedIssue.resourceName}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 border border-gray-100 rounded-sm">
                    <p className="text-[8px] font-black uppercase text-gray-400 mb-1 tracking-widest">Cloud Provider</p>
                    <p className="text-xs font-black text-black">{selectedIssue.cloud}</p>
                  </div>
                  <div className="bg-gray-50 p-3 border border-gray-100 rounded-sm">
                    <p className="text-[8px] font-black uppercase text-gray-400 mb-1 tracking-widest">Resource Type</p>
                    <p className="text-xs font-black text-black">{selectedIssue.resourceType}</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2"><Info size={14} /> Description</h3>
                <p className="text-sm text-gray-800 leading-relaxed italic border-l-2 border-gray-200 pl-4">
                  {selectedIssue.description}
                </p>
              </section>

              <section>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2"><CheckCircle size={14} /> Remediation Steps</h3>
                <div className="text-sm font-bold text-gray-900 leading-relaxed bg-gray-50 p-4 border border-gray-100 rounded-sm whitespace-pre-line">
                  {selectedIssue.remediation}
                </div>
              </section>
            </div>

            <footer id="action-buttons" className="p-8 border-t border-gray-100 bg-gray-50 space-y-4 shrink-0">
              {selectedIssue.status === Status.OPEN ? (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleUpdateStatus(selectedIssue.id, Status.RESOLVED)}
                    className="py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    Mark Resolved
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedIssue.id, Status.SNOOZED)}
                    className="py-4 bg-white border border-gray-200 text-gray-700 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
                  >
                    Snooze
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleUpdateStatus(selectedIssue.id, Status.OPEN)}
                  className="w-full py-4 bg-gray-200 text-black text-[10px] font-black uppercase tracking-widest hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw size={14} /> Reopen Issue
                </button>
              )}

              <button
                onClick={() => handleExport(selectedIssue.id)}
                className="w-full py-3 bg-white border border-gray-200 text-gray-500 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 flex items-center justify-center gap-1 transition-all"
              >
                <Download size={14} /> Export CSV
              </button>
            </footer>
          </>
        )}
      </div>

      {/* Dim Overlay */}
      {selectedIssueId && (
        <div
          onClick={() => setSelectedIssueId(null)}
          className="fixed inset-0 bg-black/10 backdrop-blur-[1px] z-[90]"
        ></div>
      )}
    </div>
  );
}
