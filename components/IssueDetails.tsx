
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Code, 
  Copy, 
  Check, 
  Send, 
  MessageSquare,
  Sparkles,
  Loader2
} from 'lucide-react';
import { CloudProvider, AssetType, Misconfiguration } from '../types';
import { MOCK_RECORDS, SEVERITY_COLORS } from '../constants';
/**
 * Fixed import: Using 'getRemediation' as the exported member from geminiService.
 */
import { getRemediation, RemediationGuidance } from '../services/geminiService';

// Define Environment locally as it is missing from types.ts
enum Environment {
  PROD = 'Prod',
  STAGING = 'Staging',
  DEV = 'Dev'
}

interface IssueDetailsProps {
  provider: CloudProvider;
  environment: Environment;
  service: AssetType;
  onBack: () => void;
}

const IssueDetails: React.FC<IssueDetailsProps> = ({ provider, environment, service, onBack }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [guidance, setGuidance] = useState<Record<string, RemediationGuidance>>({});
  const [loadingGuidance, setLoadingGuidance] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);

  // Replaced MOCK_DETAILED_ISSUES with MOCK_RECORDS and adjusted filtering
  const filteredIssues = useMemo(() => {
    return MOCK_RECORDS.filter(m => 
      m.resourceType === service
    );
  }, [service]);

  const toggleExpand = async (issue: Misconfiguration) => {
    if (expandedId === issue.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(issue.id);

    if (!guidance[issue.id] && !loadingGuidance[issue.id]) {
      setLoadingGuidance(prev => ({ ...prev, [issue.id]: true }));
      /**
       * Fixed call: Using issue.resourceName as title for getRemediation
       */
      const result = await getRemediation(issue.resourceName, issue.description);
      setGuidance(prev => ({ ...prev, [issue.id]: result }));
      setLoadingGuidance(prev => ({ ...prev, [issue.id]: false }));
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500 pb-20">
       <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
          <ChevronLeft size={24} />
        </button>
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
            <span>Overview</span>
            <ChevronLeft size={12} className="rotate-180" />
            <span>{provider}</span>
            <ChevronLeft size={12} className="rotate-180" />
            <span className="text-slate-900">{environment} {service}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {filteredIssues.length} Findings in {environment} {service}
          </h2>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4">Resource & Type</th>
              <th className="px-6 py-4">Severity</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Detected</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredIssues.map((issue) => (
              <React.Fragment key={issue.id}>
                <tr className={`hover:bg-slate-50 transition-colors cursor-pointer ${expandedId === issue.id ? 'bg-blue-50/30' : ''}`} onClick={() => toggleExpand(issue)}>
                  <td className="px-6 py-5">
                    <div className="font-semibold text-slate-800">{issue.resourceName}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{issue.account}</div>
                  </td>
                  <td className="px-6 py-5">
                    {/* Replaced SEVERITY_TEXT_MAP/SEVERITY_COLOR_MAP with SEVERITY_COLORS */}
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${SEVERITY_COLORS[issue.severity]} border border-slate-200`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                      {issue.severity}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-md">
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-500 font-medium">
                    {new Date(issue.detectedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-slate-400 hover:text-blue-600 transition-colors">
                      {expandedId === issue.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </td>
                </tr>
                {expandedId === issue.id && (
                  <tr>
                    <td colSpan={5} className="bg-slate-50/50 px-6 py-8 border-t border-slate-200">
                      <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <Sparkles size={14} className="text-blue-500" /> AI Insights
                            </h4>
                            {loadingGuidance[issue.id] ? (
                              <div className="flex items-center gap-3 text-slate-500 text-sm italic py-4">
                                <Loader2 size={18} className="animate-spin text-blue-500" />
                                Gemini is analyzing risk and generating fix...
                              </div>
                            ) : guidance[issue.id] ? (
                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm font-bold text-slate-700 mb-1">Impact Analysis</p>
                                  <p className="text-sm text-slate-600 leading-relaxed">{guidance[issue.id].what}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-700 mb-1">Remediation Steps</p>
                                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{guidance[issue.id].how}</p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-slate-400 italic">No AI guidance available for this issue.</p>
                            )}
                          </div>
                          <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                              <MessageSquare size={14} /> Assign to Slack
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors">
                              <ExternalLink size={14} /> Open Cloud Console
                            </button>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Code size={14} /> Fix with Infrastructure as Code
                          </h4>
                          <div className="relative group">
                            <pre className="bg-slate-900 text-blue-300 p-4 rounded-xl text-[11px] font-mono leading-relaxed overflow-x-auto min-h-[120px]">
                              <code>{guidance[issue.id]?.terraform || "# Loading Terraform snippet..."}</code>
                            </pre>
                            <button 
                              onClick={() => handleCopy(guidance[issue.id]?.terraform || "", issue.id)}
                              className="absolute top-3 right-3 p-2 bg-slate-800 text-slate-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
                            >
                              {copied === issue.id ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {filteredIssues.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            No misconfigurations found matching this category.
          </div>
        )}
      </div>

      {/* Bulk Actions Footer */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 z-[60] border border-slate-700 animate-in slide-in-from-bottom-full duration-500">
        <div className="flex items-center gap-3 pr-6 border-r border-slate-700">
           <div className="w-5 h-5 rounded border border-slate-600 flex items-center justify-center">
             <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
           </div>
           <span className="text-sm font-medium">5 Selected</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-blue-400 transition-colors">
             <Send size={14} /> Send to Jira
          </button>
          <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-blue-400 transition-colors">
             <Check size={14} /> Mark Resolved
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;
