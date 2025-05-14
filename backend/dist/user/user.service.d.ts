import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';
import { Stage } from '../stage/stage.entity';
export declare class UserService {
    private userRepository;
    private stageRepository;
    constructor(userRepository: Repository<User>, stageRepository: Repository<Stage>);
    findAll(): Promise<User[]>;
    createUser(dto: CreateUserDto): Promise<User>;
    getBonusesByUserId(userId: number): Promise<{
        leadId: number;
        amount: number;
        stagesClosed: string[];
        totalPercent: number;
        totalBonus: number;
    }[]>;
}
