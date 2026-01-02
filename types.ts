
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

export enum AssetType {
  IAM = 'IAM',
  STORAGE = 'Storage',
  DB = 'DB',
  NETWORK = 'Network'
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
