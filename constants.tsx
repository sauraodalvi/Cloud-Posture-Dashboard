
import { CloudProvider, Severity, Status, AssetType, Project, MisconfigDetail, Environment } from './types';

export const CLOUD_STATS: Record<CloudProvider, { score: number; misconfigs: number; critical: number; high: number; medium: number; low: number }> = {
  [CloudProvider.GCP]: { score: 82, misconfigs: 145, critical: 12, high: 24, medium: 45, low: 64 },
  [CloudProvider.AWS]: { score: 88, misconfigs: 98, critical: 5, high: 15, medium: 32, low: 46 },
  [CloudProvider.AZURE]: { score: 94, misconfigs: 45, critical: 2, high: 8, medium: 12, low: 23 },
};

export const MOCK_PROJECTS: Record<CloudProvider, Project[]> = {
  [CloudProvider.GCP]: [
    {
      id: 'gcp-p1',
      name: 'Retail-Backend-Prod',
      provider: CloudProvider.GCP,
      environment: Environment.PROD,
      isConfigured: true,
      score: 78,
      criticalCount: 5,
      highCount: 12,
      assets: [
        { type: AssetType.STORAGE, successRate: 85, failRate: 15, isMisconfig: true, severity: Severity.CRITICAL },
        { type: AssetType.IAM, successRate: 92, failRate: 8, isMisconfig: true, severity: Severity.HIGH },
      ]
    },
    {
      id: 'gcp-p2',
      name: 'Data-Pipeline-Staging',
      provider: CloudProvider.GCP,
      environment: Environment.STAGING,
      isConfigured: true,
      score: 92,
      criticalCount: 0,
      highCount: 4,
      assets: []
    },
    {
      id: 'gcp-p3',
      name: 'Internal-Tools-Dev',
      provider: CloudProvider.GCP,
      environment: Environment.DEV,
      isConfigured: false,
      score: 65,
      criticalCount: 8,
      highCount: 15,
      assets: []
    }
  ],
  [CloudProvider.AWS]: [
    {
      id: 'aws-p1',
      name: 'E-Commerce-Core-Prod',
      provider: CloudProvider.AWS,
      environment: Environment.PROD,
      isConfigured: true,
      score: 91,
      criticalCount: 2,
      highCount: 8,
      assets: []
    }
  ],
  [CloudProvider.AZURE]: [
    {
      id: 'az-p1',
      name: 'Azure-Enterprise-AD',
      provider: CloudProvider.AZURE,
      environment: Environment.PROD,
      isConfigured: true,
      score: 96,
      criticalCount: 0,
      highCount: 2,
      assets: []
    }
  ]
};

export const MOCK_DETAILED_ISSUES: MisconfigDetail[] = [
  {
    id: 'iss-1',
    projectId: 'gcp-p1',
    assetType: AssetType.STORAGE,
    title: 'Public Access to user-data-prod GCS Bucket',
    description: 'The bucket "user-data-prod" allows allUsers access, exposing sensitive customer records to the public internet.',
    severity: Severity.CRITICAL,
    status: Status.OPEN,
    detectedTime: '12 mins ago'
  },
  {
    id: 'iss-2',
    projectId: 'gcp-p1',
    assetType: AssetType.IAM,
    title: 'Over-privileged Service Account',
    description: 'Service account "backup-svc" has Owner permissions on the project. Recommended to use storage.admin instead.',
    severity: Severity.HIGH,
    status: Status.IN_PROGRESS,
    detectedTime: '2 hours ago'
  }
];

export const SEVERITY_COLOR_MAP = {
  [Severity.CRITICAL]: 'bg-rose-600',
  [Severity.HIGH]: 'bg-amber-500',
  [Severity.MEDIUM]: 'bg-yellow-400',
  [Severity.LOW]: 'bg-blue-500',
};

// Added missing SEVERITY_TEXT_MAP export used in IssueDetails.tsx
export const SEVERITY_TEXT_MAP = {
  [Severity.CRITICAL]: 'text-rose-600',
  [Severity.HIGH]: 'text-amber-600',
  [Severity.MEDIUM]: 'text-yellow-600',
  [Severity.LOW]: 'text-blue-600',
};
