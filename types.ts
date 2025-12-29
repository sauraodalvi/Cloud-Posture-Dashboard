
export enum CloudProvider {
  AWS = 'AWS',
  AZURE = 'Azure',
  GCP = 'GCP'
}

export enum Severity {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export enum Status {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  ON_HOLD = 'On Hold'
}

export enum AssetType {
  IAM = 'Access / IAM',
  NETWORK = 'Network',
  STORAGE = 'Storage',
  COMPUTE = 'Compute',
  LOGGING = 'Logging & Monitoring',
  COMPLIANCE = 'Compliance'
}

export enum Environment {
  PROD = 'Production',
  STAGING = 'Staging',
  DEV = 'Development'
}

export interface AssetStats {
  type: AssetType;
  successRate: number; 
  failRate: number;    
  isMisconfig: boolean;
  severity: Severity;
}

export interface Project {
  id: string;
  name: string;
  provider: CloudProvider;
  environment: Environment;
  isConfigured: boolean;
  score: number;
  criticalCount: number;
  highCount: number;
  assets: AssetStats[];
}

export interface MisconfigDetail {
  id: string;
  projectId: string;
  assetType: AssetType;
  title: string;
  description: string;
  severity: Severity;
  status: Status;
  detectedTime: string;
}

export interface DashboardSummary {
  globalScore: number;
  totalIssues: number;
  severityCounts: Record<Severity, number>;
  trend: number;
}
