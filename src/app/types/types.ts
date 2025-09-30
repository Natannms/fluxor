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