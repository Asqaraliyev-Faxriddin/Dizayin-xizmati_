
import { JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

export const JWTAccessOptions: JwtSignOptions = {
  secret: 'j+El3er&nI!n}g~S8623x',
  expiresIn: '31d',
};

export const JWTRefreshOptions: JwtSignOptions = {
  secret: 'j+El3er&nI!n}g~S8623x',
  expiresIn: '29d',
};  

export const JWTAccessVerifyOptions: JwtVerifyOptions = {
  secret: 'j+El3er&nI!n}g~S8623x',
};