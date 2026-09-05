export type AdministratorRole="ADMIN"|"MODERATOR"|"SUPER_ADMIN"; export type AdministratorStatus="ACTIVE"|"INACTIVE"|"SUSPENDED";
export type Administrator={id:string;userId:string;role:AdministratorRole;permissions:Record<string,unknown>;status:AdministratorStatus;lastLoginAt?:string|null;createdBy?:string|null;createdAt:string;updatedAt:string};
export type AdministratorInput={userId:string;role:AdministratorRole;permissions:Record<string,unknown>;status:AdministratorStatus};
export type AdministratorAudit={id:string;adminId:string;action:string;targetType:string;targetId?:string|null;details:Record<string,unknown>;correlationId?:string|null;createdAt:string};
