
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
  SNOOZED = 'Snoozed',
  RESOLVED = 'Resolved'
}

// Added COMPUTE to AssetType to fix reference errors in components.
export enum AssetType {
  IAM = 'IAM',
  STORAGE = 'Storage',
  DB = 'DB',
  NETWORK = 'Network',
  COMPUTE = 'Compute'
}

// Added Environment enum to fix missing export error in components.
export enum Environment {
  PROD = 'Prod',
  STAGING = 'Staging',
  DEV = 'Dev'
}

export interface Misconfiguration {
  id: string;
  cloud: CloudProvider;
  account: string;
  resourceType: AssetType;
  resourceName: string;
  severity: Severity;
  status: Status;
  description: string;
  remediation: string;
  detectedAt: string;
}

// Added MisconfigDetail interface to fix missing export error in IssueDetails.tsx.
export interface MisconfigDetail {
  id: string;
  title: string;
  projectId: string;
  severity: Severity;
  status: string;
  detectedTime: string;
  assetType: AssetType;
  description: string;
}
