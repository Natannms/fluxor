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
    departments?: Department[]; // já adicionado
}

export type Membership = {
    id: string;
    userId: string;
    companyId: string;
    role: 'COLABORADOR' | 'ADMIN_EMPRESA' | 'GESTOR';
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
    user?: any;
    company?: any;
    departmentId?: string | null;
    department?: Department | null;
    
};

export type Department = {
  id: string;
  name: string;
  companyId: string;
  company?: Company;
  memberships?: Membership[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

// novo: tipos para permissão de instância de WhatsApp
export type WhatsappPermissionTarget = 'MEMBERSHIP' | 'DEPARTMENT';

export type WhatsappInstancePermission = {
  id: string;
  companyId: string;
  company?: Company;
  instanceId: string;
  instanceName?: string | null;
  targetType: WhatsappPermissionTarget;
  membershipId?: string | null;
  membership?: Membership | null;
  departmentId?: string | null;
  department?: Department | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

export type Invite = {
  id: string;
  inviterId: string;
  companyId: string;
  token: string;
  createdAt: Date;
};

export type WhatsappIntegration = {
  integration?: string;
  token?: string;
  webhook_wa_business?: string;
};

export type WhatsappInstance = {
  name: string;
  instanceId: string;
  owner?: string;
  profileName?: string;
  profilePictureUrl?: string | null;
  profileStatus?: string;
  status: 'open' | 'close' | string;
  serverUrl: string;
  apikey: string;
  integration: WhatsappIntegration;
};

export type WhatsappInstanceEnvelope = {
  instance: WhatsappInstance;
};

export type WhatsappContact = {
  id: string;
  remoteJid: string;
  pushName: string;
  profilePicUrl: string | null;
  createdAt: string;
  updatedAt: string;
  instanceId: string;
  isGroup: boolean;
  isSaved: boolean;
  type: 'contact' | string;
};

// Mensagem de conversa (exemplo de payload recebido)
export type WhatsappMessage = {
  id: string;
  key: {
    id: string;
    fromMe: boolean;
    remoteJid: string;
    senderLid?: string | null;
  };
  pushName?: string | null;
  messageType: "conversation" | string;
  message: {
    conversation?: string;
    messageContextInfo?: {
      messageSecret?: string;
      deviceListMetadata?: {
        senderKeyHash?: string;
        senderTimestamp?: string; // veio como string no exemplo
        recipientKeyHash?: string;
        recipientTimestamp?: string; // veio como string no exemplo
      };
      deviceListMetadataVersion?: number;
      [k: string]: unknown;
    };
    [k: string]: unknown;
  };
  messageTimestamp: number;
  instanceId: string;
  source: "android" | "ios" | "web" | string;
  contextInfo?: unknown | null;
  MessageUpdate?: unknown[];
};

export type WhatsappMessagesPage = {
  messages: {
    total: number;
    pages: number;
    currentPage: number;
    records: WhatsappMessage[];
  };
};