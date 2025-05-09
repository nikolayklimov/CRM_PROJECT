import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUsers(req: any): Promise<User[]>;
    create(dto: CreateUserDto): Promise<User>;
}
