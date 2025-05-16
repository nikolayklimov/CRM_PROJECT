import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SECRET_KEY', // или из .env
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      role: payload.role,
      managerLevel: payload.managerLevel,
      callCenter: payload.callCenter,
    };
  }
}