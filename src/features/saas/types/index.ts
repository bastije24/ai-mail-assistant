export type UserRole = 'org_admin' | 'dept_admin' | 'member';
export type UserStatus = 'active' | 'pending' | 'invited';
export type EmailPriority = 'low' | 'medium' | 'high' | 'urgent';
export type EmailStatus = 'open' | 'in_progress' | 'waiting_approval' | 'done';
export type Tone = 'formal' | 'friendly' | 'short';
export type JoinMode = 'open' | 'approval';

export interface Organization {
  id: string;
  name: string;
  seatsTotal: number;
  seatsUsed: number;
  joinCode: string;
  joinCodeExpiry: Date;
  joinMode: JoinMode;
  allowedDomains: string[];
  restrictToDomains: boolean;
  plan: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  departments: string[];
  avatar?: string;
  timezone?: string;
  whatsappNumber?: string;
  urgentMode: boolean;
  urgentThreshold: 'urgent' | 'high_urgent';
  quietHours?: { start: string; end: string };
  tone: Tone;
  dailyBriefTime?: string;
  dailyBriefChannels: ('email' | 'push')[];
  connectedAccounts: {
    gmail?: boolean;
    outlook?: boolean;
  };
}

export interface Department {
  id: string;
  name: string;
  membersCount: number;
  defaultOwnerId?: string;
  defaultOwnerName?: string;
}

export interface EmailItem {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  priority: EmailPriority;
  status: EmailStatus;
  assignedTo?: string;
  assignedToId?: string;
  departmentId?: string;
  departmentName?: string;
  receivedAt: Date;
  tags: string[];
  summary?: string;
  suggestedReply?: string;
  requiresApproval?: boolean;
  deadline?: Date;
}

export interface RoutingRule {
  id: string;
  name: string;
  enabled: boolean;
  conditions: {
    senderDomain?: string;
    subjectKeywords?: string[];
    recipientAlias?: string;
    aiCategory?: string;
    priorityGte?: EmailPriority;
  };
  actions: {
    assignTo: 'department' | 'user';
    assignToId: string;
    assignToName: string;
    priorityOverride?: EmailPriority;
    deadlineHours?: number;
    requireApproval?: boolean;
  };
  lastEdited: Date;
}

export interface OrgPolicies {
  allowedChannels: {
    email: boolean;
    push: boolean;
    teams: boolean;
    slack: boolean;
    whatsapp: boolean;
  };
  autoSendDisabled: boolean;
  requireApprovalExternal: boolean;
  dataRetentionDays: 30 | 90 | 180;
}

export interface PendingApproval {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  requestedAt: Date;
}
