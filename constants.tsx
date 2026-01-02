
import { CloudProvider, Severity, Status, AssetType, Misconfiguration, MisconfigDetail } from './types';

export const MOCK_RECORDS: Misconfiguration[] = [
  {
    id: 'ISSUE-001',
    cloud: CloudProvider.AWS,
    account: 'aws-prod-01',
    resourceType: AssetType.IAM,
    resourceName: 'admin-over-privileged',
    severity: Severity.CRITICAL,
    status: Status.OPEN,
    description: 'User "deploy-bot" has full AdministratorAccess. Violates least-privilege principle.',
    remediation: 'Attach a scoped-down policy with only required permissions.',
    detectedAt: '2024-05-01T10:00:00Z'
  },
  {
    id: 'ISSUE-002',
    cloud: CloudProvider.AZURE,
    account: 'azure-main',
    resourceType: AssetType.IAM,
    resourceName: 'global-admin-mfa-disabled',
    severity: Severity.CRITICAL,
    status: Status.OPEN,
    description: 'Global Administrator "jordan@company.com" does not have MFA enabled.',
    remediation: 'Enable Multi-Factor Authentication immediately.',
    detectedAt: '2024-05-01T11:30:00Z'
  },
  {
    id: 'ISSUE-003',
    cloud: CloudProvider.GCP,
    account: 'gcp-data-lake',
    resourceType: AssetType.STORAGE,
    resourceName: 'public-bucket-detected',
    severity: Severity.CRITICAL,
    status: Status.OPEN,
    description: 'Storage bucket "customer-pii-v2" is publicly accessible to allAuthenticatedUsers.',
    remediation: 'Remove public access and enforce bucket-level IAM.',
    detectedAt: '2024-05-02T09:15:00Z'
  },
  {
    id: 'ISSUE-004',
    cloud: CloudProvider.AWS,
    account: 'aws-prod-01',
    resourceType: AssetType.DB,
    resourceName: 'rds-unencrypted-at-rest',
    severity: Severity.HIGH,
    status: Status.OPEN,
    description: 'Production RDS instance "billing-db" is not encrypted at rest.',
    remediation: 'Enable storage encryption using a KMS CMK.',
    detectedAt: '2024-05-02T14:00:00Z'
  },
  {
    id: 'ISSUE-005',
    cloud: CloudProvider.AZURE,
    account: 'azure-main',
    resourceType: AssetType.NETWORK,
    resourceName: 'nsg-ssh-open-anywhere',
    severity: Severity.HIGH,
    status: Status.OPEN,
    description: 'NSG allows inbound SSH (22) from 0.0.0.0/0.',
    remediation: 'Restrict SSH access to corporate CIDR blocks.',
    detectedAt: '2024-05-03T08:20:00Z'
  },
  {
    id: 'ISSUE-006',
    cloud: CloudProvider.AWS,
    account: 'aws-stg-02',
    resourceType: AssetType.IAM,
    resourceName: 'unused-access-keys',
    severity: Severity.MEDIUM,
    status: Status.OPEN,
    description: 'Access keys for "legacy-worker" have not been rotated in 180 days.',
    remediation: 'Deactivate old keys and rotate credentials.',
    detectedAt: '2024-05-03T10:45:00Z'
  },
  {
    id: 'ISSUE-007',
    cloud: CloudProvider.GCP,
    account: 'gcp-corp-01',
    resourceType: AssetType.IAM,
    resourceName: 'primitive-roles-assigned',
    severity: Severity.MEDIUM,
    status: Status.OPEN,
    description: 'User has "Owner" primitive role. Should use predefined granular roles.',
    remediation: 'Replace Owner role with specific IAM roles.',
    detectedAt: '2024-05-03T16:00:00Z'
  },
  {
    id: 'ISSUE-008',
    cloud: CloudProvider.AWS,
    account: 'aws-prod-01',
    resourceType: AssetType.IAM,
    resourceName: 'root-account-active',
    severity: Severity.CRITICAL,
    status: Status.OPEN,
    description: 'Root user login detected in the last 24 hours.',
    remediation: 'Audit root activity and enforce IAM user login.',
    detectedAt: '2024-05-04T02:00:00Z'
  },
  {
    id: 'ISSUE-009',
    cloud: CloudProvider.AZURE,
    account: 'azure-dev-sub',
    resourceType: AssetType.STORAGE,
    resourceName: 'diag-logs-disabled',
    severity: Severity.LOW,
    status: Status.OPEN,
    description: 'Diagnostic logging is disabled for sensitive storage account.',
    remediation: 'Enable diagnostic settings to Log Analytics.',
    detectedAt: '2024-05-04T05:30:00Z'
  },
  {
    id: 'ISSUE-010',
    cloud: CloudProvider.GCP,
    account: 'gcp-data-lake',
    resourceType: AssetType.IAM,
    resourceName: 'service-account-key-downloaded',
    severity: Severity.CRITICAL,
    status: Status.OPEN,
    description: 'User-managed service account key created for core service account.',
    remediation: 'Delete user-managed key and use Workload Identity.',
    detectedAt: '2024-05-04T09:00:00Z'
  },
  {
    id: 'ISSUE-011',
    cloud: CloudProvider.AWS,
    account: 'aws-stg-02',
    resourceType: AssetType.NETWORK,
    resourceName: 'vpc-flow-logs-disabled',
    severity: Severity.MEDIUM,
    status: Status.OPEN,
    description: 'VPC Flow Logs not enabled for staging environment.',
    remediation: 'Enable flow logs for visibility into network traffic.',
    detectedAt: '2024-05-04T12:00:00Z'
  },
  {
    id: 'ISSUE-012',
    cloud: CloudProvider.AZURE,
    account: 'azure-main',
    resourceType: AssetType.DB,
    resourceName: 'sql-audit-disabled',
    severity: Severity.MEDIUM,
    status: Status.OPEN,
    description: 'Auditing is disabled for Azure SQL Server.',
    remediation: 'Enable SQL audit logs to storage account.',
    detectedAt: '2024-05-04T15:00:00Z'
  },
  {
    id: 'ISSUE-013',
    cloud: CloudProvider.GCP,
    account: 'gcp-corp-01',
    resourceType: AssetType.IAM,
    resourceName: 'iam-external-users',
    severity: Severity.HIGH,
    status: Status.OPEN,
    description: 'External domain users have broad access to project resources.',
    remediation: 'Review and remove non-corporate domain users.',
    detectedAt: '2024-05-05T08:00:00Z'
  },
  {
    id: 'ISSUE-014',
    cloud: CloudProvider.AWS,
    account: 'aws-prod-01',
    resourceType: AssetType.STORAGE,
    resourceName: 's3-versioning-disabled',
    severity: Severity.LOW,
    status: Status.OPEN,
    description: 'Versioning is disabled for the deployment artifacts bucket.',
    remediation: 'Enable bucket versioning for data durability.',
    detectedAt: '2024-05-05T10:00:00Z'
  },
  {
    id: 'ISSUE-015',
    cloud: CloudProvider.AZURE,
    account: 'azure-dev-sub',
    resourceType: AssetType.NETWORK,
    resourceName: 'rdp-open-to-internet',
    severity: Severity.HIGH,
    status: Status.OPEN,
    description: 'Inbound RDP port (3389) open to the public internet.',
    remediation: 'Close port 3389 or restrict to VPN source IP.',
    detectedAt: '2024-05-05T13:00:00Z'
  },
  {
    id: 'ISSUE-016',
    cloud: CloudProvider.GCP,
    account: 'gcp-data-lake',
    resourceType: AssetType.DB,
    resourceName: 'cloudsql-public-ip',
    severity: Severity.HIGH,
    status: Status.OPEN,
    description: 'Cloud SQL instance has a public IP address assigned.',
    remediation: 'Disable public IP and use Private Service Access.',
    detectedAt: '2024-05-05T16:00:00Z'
  },
  {
    id: 'ISSUE-017',
    cloud: CloudProvider.AWS,
    account: 'aws-stg-02',
    resourceType: AssetType.IAM,
    resourceName: 'inline-policy-detected',
    severity: Severity.LOW,
    status: Status.OPEN,
    description: 'User has an inline policy attached instead of a managed policy.',
    remediation: 'Convert inline policy to a customer-managed policy.',
    detectedAt: '2024-05-06T09:00:00Z'
  },
  {
    id: 'ISSUE-018',
    cloud: CloudProvider.AZURE,
    account: 'azure-main',
    resourceType: AssetType.STORAGE,
    resourceName: 'insecure-transfer-allowed',
    severity: Severity.MEDIUM,
    status: Status.OPEN,
    description: 'Storage account allows non-HTTPS traffic.',
    remediation: 'Enable "Secure transfer required" in storage settings.',
    detectedAt: '2024-05-06T11:00:00Z'
  },
  {
    id: 'ISSUE-019',
    cloud: CloudProvider.GCP,
    account: 'gcp-corp-01',
    resourceType: AssetType.IAM,
    resourceName: 'default-service-account-used',
    severity: Severity.MEDIUM,
    status: Status.OPEN,
    description: 'Compute instances are using the highly-privileged default service account.',
    remediation: 'Assign a custom service account with minimal scopes.',
    detectedAt: '2024-05-06T14:00:00Z'
  },
  {
    id: 'ISSUE-020',
    cloud: CloudProvider.AWS,
    account: 'aws-prod-01',
    resourceType: AssetType.IAM,
    resourceName: 'critical-iam-misconfig',
    severity: Severity.CRITICAL,
    status: Status.OPEN,
    description: 'Undocumented critical IAM configuration detected.',
    remediation: 'Perform immediate audit of all security groups and IAM roles.',
    detectedAt: '2024-05-06T17:00:00Z'
  }
];

export const SEVERITY_COLORS: Record<Severity, string> = {
  [Severity.CRITICAL]: 'text-red-600 bg-white border-red-600',
  [Severity.HIGH]: 'text-orange-600 bg-white border-orange-600',
  [Severity.MEDIUM]: 'text-yellow-600 bg-white border-yellow-600',
  [Severity.LOW]: 'text-gray-400 bg-white border-gray-400'
};

// Added missing members for IssueDetails.tsx
export const MOCK_DETAILED_ISSUES: MisconfigDetail[] = [
  {
    id: 'ISSUE-001',
    title: 'S3 Public Access Block Disabled',
    projectId: 'aws-prod-01',
    severity: Severity.CRITICAL,
    status: 'Open',
    detectedTime: '2 hours ago',
    assetType: AssetType.STORAGE,
    description: 'The S3 bucket "customer-data" has public access blocks disabled, potentially exposing sensitive data.'
  },
  {
    id: 'ISSUE-002',
    title: 'MFA Not Enabled for Global Admin',
    projectId: 'azure-main',
    severity: Severity.CRITICAL,
    status: 'Open',
    detectedTime: '3 hours ago',
    assetType: AssetType.IAM,
    description: 'A global administrator account does not have multi-factor authentication enabled.'
  },
  {
    id: 'ISSUE-003',
    title: 'Publicly Accessible Storage Bucket',
    projectId: 'gcp-data-lake',
    severity: Severity.CRITICAL,
    status: 'Open',
    detectedTime: '5 hours ago',
    assetType: AssetType.STORAGE,
    description: 'A Cloud Storage bucket is publicly accessible, which could lead to data leakage.'
  },
  {
    id: 'ISSUE-004',
    title: 'Overly Permissive IAM Policy',
    projectId: 'aws-stg-02',
    severity: Severity.HIGH,
    status: 'Open',
    detectedTime: '1 day ago',
    assetType: AssetType.IAM,
    description: 'An IAM policy allows excessive permissions to multiple services.'
  },
  {
    id: 'ISSUE-005',
    title: 'NSG SSH Open to Internet',
    projectId: 'azure-main',
    severity: Severity.HIGH,
    status: 'Open',
    detectedTime: '1 day ago',
    assetType: AssetType.NETWORK,
    description: 'Network Security Group allows inbound SSH traffic from any IP address.'
  },
  {
    id: 'ISSUE-006',
    title: 'Unencrypted Compute Disk',
    projectId: 'gcp-corp-01',
    severity: Severity.MEDIUM,
    status: 'Open',
    detectedTime: '2 days ago',
    assetType: AssetType.COMPUTE,
    description: 'A compute instance disk is not encrypted with a customer-managed key.'
  }
];

export const SEVERITY_TEXT_MAP: Record<Severity, string> = {
  [Severity.CRITICAL]: 'text-red-600',
  [Severity.HIGH]: 'text-orange-600',
  [Severity.MEDIUM]: 'text-yellow-600',
  [Severity.LOW]: 'text-gray-400'
};

export const SEVERITY_COLOR_MAP: Record<Severity, string> = {
  [Severity.CRITICAL]: 'bg-red-500',
  [Severity.HIGH]: 'bg-orange-500',
  [Severity.MEDIUM]: 'bg-yellow-500',
  [Severity.LOW]: 'bg-gray-400'
};
