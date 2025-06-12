import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly usersService;
    constructor(config: ConfigService, usersService: UsersService);
    validate(payload: JwtPayload): Promise<UserResponseDto>;
}
export {};
