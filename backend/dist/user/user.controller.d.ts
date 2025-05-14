import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';
import { AuditLogService } from '../audit-log/audit-log.service';
import { Request } from 'express';
export declare class UserController {
    private readonly userService;
    private readonly auditService;
    constructor(userService: UserService, auditService: AuditLogService);
    getAllUsers(req: Request): Promise<User[]>;
    create(req: Request, dto: CreateUserDto): Promise<User>;
    getUserBonuses(id: number): Promise<{
        leadId: number;
        amount: number;
        stagesClosed: string[];
        totalPercent: number;
        totalBonus: number;
    }[]>;
}
