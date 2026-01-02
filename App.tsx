
import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  List, 
  Layout, 
  ChevronRight, 
  X, 
  Filter, 
  Download, 
  Clock, 
  CheckCircle, 
  Info, 
  Layers,
  Zap,
  MoreVertical,
  ChevronLeft
} from 'lucide-react';
import { CloudProvider, Severity, Status, AssetType, Misconfiguration } from './types';
import { MOCK_RECORDS, SEVERITY_COLORS } from './constants';

type Frame = 'COVER' | 'OVERVIEW' | 'LIST';

export default function App() {
  const [currentFrame, setCurrentFrame] = useState<Frame>('COVER');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    severity: [] as Severity[],
    cloud: [] as CloudProvider[],
    resourceType: [] as AssetType[]
  });
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [records, setRecords] = useState<Misconfiguration[]>(MOCK_RECORDS);

  // Filter Logic (Persistent across frames)
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const sMatch = filters.severity.length === 0 || filters.severity.includes(r.severity);
      const cMatch = filters.cloud.length === 0 || filters.cloud.includes(r.cloud);
      const tMatch = filters.resourceType.length === 0 || filters.resourceType.includes(r.resourceType);
      return sMatch && cMatch && tMatch;
    });
  }, [records, filters]);

  const selectedIssue = useMemo(() => records.find(r => r.id === selectedIssueId), [records, selectedIssueId]);

  // Actions
  const handleResolve = (id: string) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: Status.RESOLVED } : r));
    setSelectedIssueId(null);
  };

  const handleSnoozeBulk = () => {
    setRecords(prev => prev.map(r => selectedRows.has(r.id) ? { ...r, status: Status.SNOOZED } : r));
    setSelectedRows(new Set());
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

  // UI Components
  // Changed children to optional to fix "children is missing" TS errors.
  const Annotation = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
    <div className={`absolute z-50 bg-yellow-100 border border-yellow-300 p-2 text-[10px] font-bold shadow-sm rotate-1 w-44 ${className}`}>
      <div className="flex gap-1.5 items-start">
        <Zap size={10} className="mt-0.5 text-yellow-600 shrink-0" />
        <p>{children}</p>
      </div>
    </div>
  );

  const SeverityBadge = ({ sev }: { sev: Severity }) => (
    <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded border ${SEVERITY_COLORS[sev]} border-current`}>
      {sev}
    </span>
  );

  // --- RENDERING ---

  if (currentFrame === 'COVER') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <div className="max-w-4xl w-full bg-white border border-gray-200 shadow-2xl p-16 relative overflow-hidden">
          <Annotation className="-top-2 -right-2">Decision: Cover frame aligns stakeholders on persona & scope.</Annotation>
          
          <header className="mb-12 border-b-4 border-black pb-6">
            <h1 className="text-5xl font-black uppercase tracking-tighter text-black">Cloud Posture Dashboard</h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Internal MVP: AccuKnox Guardrail</p>
          </header>

          <div className="grid grid-cols-2 gap-16 mb-16">
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Problem Statement</h2>
              <p className="text-gray-800 text-sm leading-relaxed">
                Security Ops lack a unified operational console. This dashboard provides 10-second situational awareness across AWS, Azure, and GCP without setup friction.
              </p>
            </section>
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Persona</h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center font-bold">JL</div>
                <div>
                  <p className="text-sm font-bold text-black">Jordan Lee</p>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Cloud Security Engineer</p>
                </div>
              </div>
            </section>
          </div>

          <div className="grid grid-cols-3 gap-8 mb-16">
            {[
              { label: 'Risk Identification', val: '< 3m' },
              { label: 'Cloud Visibility', val: 'Unified' },
              { label: 'UX Priority', val: 'Table-First' }
            ].map(m => (
              <div key={m.label} className="border-l-2 border-gray-200 pl-4">
                <p className="text-2xl font-black text-black">{m.val}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase">{m.label}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button 
              onClick={() => setCurrentFrame('OVERVIEW')}
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
      {/* Sidebar */}
      <aside className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6 gap-8">
        <Shield size={28} className="text-black" />
        <nav className="flex flex-col gap-6">
          <button onClick={() => setCurrentFrame('OVERVIEW')} className={`p-2 rounded ${currentFrame === 'OVERVIEW' ? 'bg-gray-100 text-black' : 'text-gray-400 hover:text-black'}`}><Layout size={20} /></button>
          <button onClick={() => setCurrentFrame('LIST')} className={`p-2 rounded ${currentFrame === 'LIST' ? 'bg-gray-100 text-black' : 'text-gray-400 hover:text-black'}`}><List size={20} /></button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-6">
            <h2 className="text-sm font-black uppercase tracking-tight">{currentFrame === 'OVERVIEW' ? 'Posture Overview' : 'Inventory List'}</h2>
            <div className="h-4 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
              <Layers size={14} />
              <span>ALL CONNECTED CLOUDS</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Clock size={12} /> Last Sync: 2m ago
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300"></div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 relative">
          <Annotation className="top-8 right-8">Operational Console: No onboarding UI. Data is pre-connected.</Annotation>

          {/* Persistent Filter Bar */}
          <div className="flex items-center gap-4 mb-8 bg-white p-4 border border-gray-200 rounded-sm">
            <div className="flex items-center gap-2 mr-4">
              <Filter size={14} className="text-gray-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Filters</span>
            </div>
            <div className="flex gap-2">
              {Object.values(Severity).map(s => (
                <button 
                  key={s} onClick={() => toggleFilter('severity', s)}
                  className={`px-3 py-1 text-[10px] font-black border uppercase tracking-widest transition-all ${filters.severity.includes(s) ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="h-4 w-px bg-gray-200 mx-2"></div>
            <div className="flex gap-2">
              {Object.values(CloudProvider).map(c => (
                <button 
                  key={c} onClick={() => toggleFilter('cloud', c)}
                  className={`px-3 py-1 text-[10px] font-black border uppercase tracking-widest transition-all ${filters.cloud.includes(c) ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {currentFrame === 'OVERVIEW' ? (
            <div className="space-y-8">
              <div className="grid grid-cols-4 gap-6">
                {[
                  { label: 'Connected Assets', val: '1,248' },
                  { label: 'Active Issues', val: records.filter(r => r.status === Status.OPEN).length },
                  { label: 'Critical Risks', val: records.filter(r => r.severity === Severity.CRITICAL && r.status === Status.OPEN).length, accent: 'text-red-600' },
                  { label: 'High Priority', val: records.filter(r => r.severity === Severity.HIGH && r.status === Status.OPEN).length, accent: 'text-orange-600' }
                ].map(s => (
                  <div key={s.label} className="bg-white p-6 border border-gray-200 rounded-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{s.label}</p>
                    <p className={`text-4xl font-black ${s.accent || 'text-black'}`}>{s.val}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-gray-200 rounded-sm relative">
                <Annotation className="-top-4 left-8">Table-First: No charts. Speed over visual flair.</Annotation>
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Top 10 Critical Findings</h3>
                  <button onClick={() => setCurrentFrame('LIST')} className="text-[10px] font-black text-black hover:underline uppercase">View Full Inventory</button>
                </div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-[9px] font-black uppercase text-gray-400 tracking-widest">
                      <th className="px-6 py-4">Severity</th>
                      <th className="px-6 py-4">Cloud</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Resource</th>
                      <th className="px-6 py-4">Account</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredRecords.slice(0, 10).map(r => (
                      <tr 
                        key={r.id} onClick={() => setSelectedIssueId(r.id)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4"><SeverityBadge sev={r.severity} /></td>
                        <td className="px-6 py-4 text-[11px] font-bold">{r.cloud}</td>
                        <td className="px-6 py-4 text-[11px] text-gray-400">{r.resourceType}</td>
                        <td className="px-6 py-4 text-[11px] font-black text-black truncate max-w-[200px]">{r.resourceName}</td>
                        <td className="px-6 py-4 text-[11px] text-gray-400">{r.account}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${r.status === Status.RESOLVED ? 'bg-gray-50 text-gray-300 border-gray-100' : 'bg-white text-black border-black'}`}>{r.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-sm relative">
              <Annotation className="-top-4 left-1/2 -translate-x-1/2">Bulk Action: Jordan selects multiple for batch snooze.</Annotation>
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Inventory ({filteredRecords.length})</h3>
                  <div className="h-4 w-px bg-gray-200"></div>
                  <button 
                    disabled={selectedRows.size === 0}
                    onClick={handleSnoozeBulk}
                    className={`px-4 py-1.5 text-[10px] font-black uppercase border tracking-widest transition-all ${selectedRows.size > 0 ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'}`}
                  >
                    Snooze Selected ({selectedRows.size})
                  </button>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-black text-gray-400">
                  <span>1 - {filteredRecords.length} of {records.length}</span>
                  <div className="flex gap-1">
                    <button className="p-1 border border-gray-200 rounded hover:bg-gray-100"><ChevronLeft size={14} /></button>
                    <button className="p-1 border border-gray-200 rounded hover:bg-gray-100"><ChevronRight size={14} /></button>
                  </div>
                </div>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[9px] font-black uppercase text-gray-400 tracking-widest">
                    <th className="px-6 py-4 w-12"><input type="checkbox" onChange={(e) => {
                      if (e.target.checked) setSelectedRows(new Set(filteredRecords.map(x => x.id))); else setSelectedRows(new Set());
                    }} /></th>
                    <th className="px-6 py-4">Severity</th>
                    <th className="px-6 py-4">Cloud</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Resource</th>
                    <th className="px-6 py-4">Account</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Detected</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRecords.map(r => (
                    <tr 
                      key={r.id} onClick={() => setSelectedIssueId(r.id)}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${selectedRows.has(r.id) ? 'bg-gray-50' : ''}`}
                    >
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={selectedRows.has(r.id)} onChange={() => toggleRow(r.id)} />
                      </td>
                      <td className="px-6 py-4"><SeverityBadge sev={r.severity} /></td>
                      <td className="px-6 py-4 text-[11px] font-bold">{r.cloud}</td>
                      <td className="px-6 py-4 text-[11px] text-gray-400">{r.resourceType}</td>
                      <td className="px-6 py-4 text-[11px] font-black text-black">{r.resourceName}</td>
                      <td className="px-6 py-4 text-[11px] text-gray-400">{r.account}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${r.status === Status.RESOLVED ? 'bg-gray-50 text-gray-300 border-gray-100' : 'bg-white text-black border-black'}`}>{r.status}</span>
                      </td>
                      <td className="px-6 py-4 text-[10px] text-gray-400 font-mono">{new Date(r.detectedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Side Panel Overlay */}
      <div 
        className={`fixed inset-y-0 right-0 w-[400px] bg-white border-l border-gray-200 shadow-2xl transition-transform duration-300 z-50 flex flex-col ${selectedIssueId ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {selectedIssue && (
          <>
            <header className="h-16 px-8 border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <SeverityBadge sev={selectedIssue.severity} />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{selectedIssue.id}</span>
              </div>
              <button onClick={() => setSelectedIssueId(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400"><X size={20} /></button>
            </header>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 relative">
              <Annotation className="top-4 -left-12">Decision: Right-side panel keeps inventory context visible.</Annotation>
              
              <section>
                <h2 className="text-2xl font-black text-black uppercase tracking-tighter leading-none mb-4">{selectedIssue.resourceName}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 border border-gray-100 rounded-sm">
                    <p className="text-[8px] font-black uppercase text-gray-400 mb-1 tracking-widest">Provider</p>
                    <p className="text-xs font-black text-black">{selectedIssue.cloud}</p>
                  </div>
                  <div className="bg-gray-50 p-3 border border-gray-100 rounded-sm">
                    <p className="text-[8px] font-black uppercase text-gray-400 mb-1 tracking-widest">Asset Type</p>
                    <p className="text-xs font-black text-black">{selectedIssue.resourceType}</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2"><Info size={14} /> Why this matters</h3>
                <p className="text-sm text-gray-800 leading-relaxed italic border-l-2 border-gray-200 pl-4">
                  {selectedIssue.description}
                </p>
              </section>

              <section>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2"><CheckCircle size={14} /> Recommended Remediation</h3>
                <p className="text-sm font-bold text-gray-900 leading-relaxed bg-gray-50 p-4 border border-gray-100 rounded-sm">
                  {selectedIssue.remediation}
                </p>
              </section>
            </div>

            <footer className="p-8 border-t border-gray-100 bg-gray-50 grid grid-cols-2 gap-4 shrink-0">
              <button 
                onClick={() => handleResolve(selectedIssue.id)}
                className="py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                Resolve Issue
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button className="py-4 bg-white border border-gray-200 text-gray-500 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50">Snooze</button>
                <button className="py-4 bg-white border border-gray-200 text-gray-500 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50">Export</button>
              </div>
            </footer>
          </>
        )}
      </div>

      {/* Dim Overlay */}
      {selectedIssueId && (
        <div 
          onClick={() => setSelectedIssueId(null)}
          className="fixed inset-0 bg-black/10 backdrop-blur-[1px] z-40 animate-in fade-in"
        ></div>
      )}
    </div>
  );
}
