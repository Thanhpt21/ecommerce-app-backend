// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { Request } from 'express'; 
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.accessToken, // 👈 lấy từ cookie
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') || 'defaultSecret',  // ✅ fallback
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.getUserById(payload.sub);
    if (!user) throw new UnauthorizedException();
    return new UserResponseDto(user); // gắn vào request.user
  }
}
