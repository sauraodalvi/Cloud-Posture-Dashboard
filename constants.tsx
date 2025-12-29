
import { CloudProvider, Severity, Status, AssetType, Project, MisconfigDetail, Environment } from './types';

export const CLOUD_STATS: Record<CloudProvider, { score: number; misconfigs: number; critical: number; high: number; medium: number; low: number }> = {
  [CloudProvider.GCP]: { score: 76, misconfigs: 245, critical: 18, high: 42, medium: 85, low: 100 },
  [CloudProvider.AWS]: { score: 82, misconfigs: 112, critical: 8, high: 24, medium: 45, low: 35 },
  [CloudProvider.AZURE]: { score: 91, misconfigs: 58, critical: 3, high: 12, medium: 18, low: 25 },
};

export const MOCK_PROJECTS: Record<CloudProvider, Project[]> = {
  [CloudProvider.GCP]: [
    {
      id: 'gcp-p1',
      name: 'GKE-Cluster-Finance-Prod',
      provider: CloudProvider.GCP,
      environment: Environment.PROD,
      isConfigured: true,
      score: 64,
      criticalCount: 7,
      highCount: 15,
      assets: []
    },
    {
      id: 'gcp-p2',
      name: 'BigQuery-Analytics-Staging',
      provider: CloudProvider.GCP,
      environment: Environment.STAGING,
      isConfigured: true,
      score: 88,
      criticalCount: 1,
      highCount: 5,
      assets: []
    },
    {
      id: 'gcp-p3',
      name: 'IAM-Service-Accounts-Dev',
      provider: CloudProvider.GCP,
      environment: Environment.DEV,
      isConfigured: true,
      score: 94,
      criticalCount: 0,
      highCount: 2,
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
      score: 81,
      criticalCount: 4,
      highCount: 12,
      assets: []
    },
    {
      id: 'aws-p2',
      name: 'Lambda-Microservices-Staging',
      provider: CloudProvider.AWS,
      environment: Environment.STAGING,
      isConfigured: true,
      score: 95,
      criticalCount: 0,
      highCount: 1,
      assets: []
    }
  ],
  [CloudProvider.AZURE]: [
    {
      id: 'az-p1',
      name: 'Azure-AD-Identity-Prod',
      provider: CloudProvider.AZURE,
      environment: Environment.PROD,
      isConfigured: true,
      score: 96,
      criticalCount: 1,
      highCount: 3,
      assets: []
    },
    {
      id: 'az-p2',
      name: 'SQL-Managed-Instances',
      provider: CloudProvider.AZURE,
      environment: Environment.STAGING,
      isConfigured: true,
      score: 82,
      criticalCount: 2,
      highCount: 8,
      assets: []
    }
  ]
};

export const MOCK_DETAILED_ISSUES: MisconfigDetail[] = [
  // GCP Issues
  {
    id: 'iss-g1',
    projectId: 'gcp-p1',
    assetType: AssetType.NETWORK,
    title: 'Kubernetes API Server is Publicly Accessible',
    description: 'The GKE control plane endpoint is open to 0.0.0.0/0. Recommended to use authorized networks or private endpoints.',
    severity: Severity.CRITICAL,
    status: Status.OPEN,
    detectedTime: '4 mins ago'
  },
  {
    id: 'iss-g2',
    projectId: 'gcp-p2',
    assetType: AssetType.STORAGE,
    title: 'Public Access to BigQuery Datasets',
    description: 'The dataset "marketing_pii" has allAuthenticatedUsers permission, allowing anyone with a Google account to query data.',
    severity: Severity.CRITICAL,
    status: Status.OPEN,
    detectedTime: '18 mins ago'
  },
  {
    id: 'iss-g3',
    projectId: 'gcp-p1',
    assetType: AssetType.IAM,
    title: 'Default Service Account with Editor Role',
    description: 'Compute Engine default service account is being used with the broad Editor role. Follow least-privilege principle.',
    severity: Severity.HIGH,
    status: Status.IN_PROGRESS,
    detectedTime: '1 hour ago'
  },
  // AWS Issues
  {
    id: 'iss-a1',
    projectId: 'aws-p1',
    assetType: AssetType.STORAGE,
    title: 'Public Read Access on S3 Bucket "customer-attachments"',
    description: 'Bucket ACL allows "Everyone" read access. Sensitive files are potentially exposed via direct URL.',
    severity: Severity.CRITICAL,
    status: Status.OPEN,
    detectedTime: '12 mins ago'
  },
  {
    id: 'iss-a2',
    projectId: 'aws-p1',
    assetType: AssetType.NETWORK,
    title: 'Security Group allows Inbound RDP (3389) from Internet',
    description: 'The security group "sg-production-windows" allows port 3389 from 0.0.0.0/0, making it vulnerable to brute force attacks.',
    severity: Severity.HIGH,
    status: Status.OPEN,
    detectedTime: '45 mins ago'
  },
  // Azure Issues
  {
    id: 'iss-z1',
    projectId: 'az-p1',
    assetType: AssetType.IAM,
    title: 'Global Administrator without MFA Enabled',
    description: 'A user with the Global Administrator role has not registered for Multi-Factor Authentication (MFA).',
    severity: Severity.CRITICAL,
    status: Status.OPEN,
    detectedTime: '2 mins ago'
  },
  {
    id: 'iss-z2',
    projectId: 'az-p2',
    assetType: AssetType.LOGGING,
    title: 'Diagnostic Logging Disabled for SQL Database',
    description: 'Audit logging and diagnostic logs are not enabled for the SQL Managed Instance, violating compliance requirements.',
    severity: Severity.MEDIUM,
    status: Status.RESOLVED,
    detectedTime: '3 hours ago'
  }
];

export const SEVERITY_COLOR_MAP = {
  [Severity.CRITICAL]: 'bg-rose-600',
  [Severity.HIGH]: 'bg-amber-500',
  [Severity.MEDIUM]: 'bg-yellow-400',
  [Severity.LOW]: 'bg-blue-500',
};

export const SEVERITY_TEXT_MAP = {
  [Severity.CRITICAL]: 'text-rose-600',
  [Severity.HIGH]: 'text-amber-600',
  [Severity.MEDIUM]: 'text-yellow-600',
  [Severity.LOW]: 'text-blue-600',
};
