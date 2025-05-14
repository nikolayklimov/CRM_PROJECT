import { BonusService } from './bonus.service';
import { Request } from 'express';
export declare class BonusController {
    private readonly bonusService;
    constructor(bonusService: BonusService);
    getMyTodayBonus(req: Request & {
        user?: any;
    }): Promise<{
        bonus: number;
    }>;
    getBonusesByLead(id: number, req: Request & {
        user?: any;
    }): Promise<import("./manager-bonus.entity").ManagerBonus[]>;
}
