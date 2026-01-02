
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

// Expanded issues to match the counts displayed in the Project Cards
export const MOCK_DETAILED_ISSUES: MisconfigDetail[] = [
  // GCP - gcp-p1 (Finance Prod) - Needs 7 Critical, 15 High
  {
    id: 'iss-g1', projectId: 'gcp-p1', assetType: AssetType.NETWORK,
    title: 'Kubernetes API Server is Publicly Accessible',
    description: 'The GKE control plane endpoint is open to 0.0.0.0/0. This exposes your cluster to scanning and brute force.',
    severity: Severity.CRITICAL, status: Status.OPEN, detectedTime: '4 mins ago'
  },
  {
    id: 'iss-g1-2', projectId: 'gcp-p1', assetType: AssetType.COMPUTE,
    title: 'Workload Identity is not enabled',
    description: 'Pods are using default Node Service Accounts, which are overly permissive.',
    severity: Severity.CRITICAL, status: Status.OPEN, detectedTime: '12 mins ago'
  },
  {
    id: 'iss-g1-3', projectId: 'gcp-p1', assetType: AssetType.NETWORK,
    title: 'Unrestricted Egress to Internal Metadata',
    description: 'Kubernetes pods can reach the cloud metadata server, allowing potential privilege escalation.',
    severity: Severity.CRITICAL, status: Status.OPEN, detectedTime: '15 mins ago'
  },
  {
    id: 'iss-g1-4', projectId: 'gcp-p1', assetType: AssetType.IAM,
    title: 'Key Rotation Policy Not Enforced',
    description: 'KMS keys have not been rotated in over 365 days. Violates PCI-DSS.',
    severity: Severity.CRITICAL, status: Status.OPEN, detectedTime: '22 mins ago'
  },
  {
    id: 'iss-g1-5', projectId: 'gcp-p1', assetType: AssetType.STORAGE,
    title: 'Unencrypted Disk Volumes (Production)',
    description: 'Persistent volumes are not using Customer Managed Encryption Keys (CMEK).',
    severity: Severity.CRITICAL, status: Status.OPEN, detectedTime: '30 mins ago'
  },
  {
    id: 'iss-g1-6', projectId: 'gcp-p1', assetType: AssetType.NETWORK,
    title: 'Default Network in Use',
    description: 'The cluster is deployed in the "default" VPC. Recommendation: Use a custom VPC with restricted firewall rules.',
    severity: Severity.CRITICAL, status: Status.OPEN, detectedTime: '45 mins ago'
  },
  {
    id: 'iss-g1-7', projectId: 'gcp-p1', assetType: AssetType.IAM,
    title: 'Overly Permissive GKE Cluster Admin',
    description: 'High number of users (12) have the cluster-admin role. Reduces accountability.',
    severity: Severity.CRITICAL, status: Status.OPEN, detectedTime: '1 hour ago'
  },
  // High severity placeholders for gcp-p1...
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: `iss-g1-h-${i}`, projectId: 'gcp-p1', assetType: AssetType.COMPUTE,
    title: `GKE Node Optimization Warning #${i + 1}`,
    description: 'Node pool configurations do not meet recommended performance and security baselines.',
    severity: Severity.HIGH, status: Status.OPEN, detectedTime: `${i + 2} hours ago`
  })),

  // GCP - gcp-p2 (BigQuery Staging)
  {
    id: 'iss-g2', projectId: 'gcp-p2', assetType: AssetType.STORAGE,
    title: 'Public Access to BigQuery Datasets',
    description: 'The dataset "marketing_pii" has allAuthenticatedUsers permission, allowing anyone to query data.',
    severity: Severity.CRITICAL, status: Status.OPEN, detectedTime: '18 mins ago'
  },

  // AWS - aws-p1 (E-Commerce Prod)
  {
    id: 'iss-a1', projectId: 'aws-p1', assetType: AssetType.STORAGE,
    title: 'Public Read Access on S3 Bucket "customer-attachments"',
    description: 'Bucket ACL allows "Everyone" read access. Sensitive files are potentially exposed via direct URL.',
    severity: Severity.CRITICAL, status: Status.OPEN, detectedTime: '12 mins ago'
  },

  // Azure - az-p1 (Identity Prod)
  {
    id: 'iss-z1', projectId: 'az-p1', assetType: AssetType.IAM,
    title: 'Global Administrator without MFA Enabled',
    description: 'A user with the Global Administrator role has not registered for Multi-Factor Authentication (MFA).',
    severity: Severity.CRITICAL, status: Status.OPEN, detectedTime: '2 mins ago'
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
