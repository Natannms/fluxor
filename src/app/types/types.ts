export type Company = {
    id: string;
    name: string;
    description?: string | null;
    type: 'MARKETING' | 'SOFTWARE';
    memberships?: any[];
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt?: Date | null;
    ownerId?: string;
    owner?: string;
}

export type Membership = {
    id: string;
    userId: string;
    companyId: string;
    role: 'COLABORADOR' | 'ADMIN_EMPRESA' | 'GESTOR'; // Ajuste para refletir o enum do Prisma
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
    user?: any;
    company?: any;
};

export type Invite = {
  id: string;
  inviterId: string;
  companyId: string;
  token: string;
  createdAt: Date;
};

export type Process = {
  id: string;
  companyId: string;
  createdById: string;
  name: string;
  code: string;
  description?: string | null;
  department: string;
  objective?: string | null;
  scopeInclude?: string | null;
  scopeExclude?: string | null;
  trigger?: string | null;
  inputs: string[];
  outputs: string[];
  resources: string[];
  stage: ProcessStage;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

export type ProcessStage = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'PUBLISHED';