export declare class AuditLog {
    id: number;
    userId: number;
    method: string;
    route: string;
    payload: any;
    actionType: string;
    entityId: string;
    summary: string;
    createdAt: Date;
}
