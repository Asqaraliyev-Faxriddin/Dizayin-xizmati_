import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RedisService } from 'src/common/redis/redis.service';
import { EVerificationTypes, ICheckOtp } from 'src/common/types/verification';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { SendOtpDto, VerifyOtpDto } from './dto/create-verification.dto';
import { generateOtp } from 'src/core/utils/random';
import { secToMills } from 'src/core/utils/times'; 
import { SmsService } from 'src/common/services/sms.service';

@Injectable()
export class VerificationService {
    constructor(
        private prisma: PrismaService,
        private smsService: SmsService,
        private redis: RedisService,
    ) { }

    public getKey(
        type: EVerificationTypes,
        email: string,
        confirmation?: boolean,
    ) {
        const storeKeys: Record<EVerificationTypes, string> = {
            [EVerificationTypes.REGISTER]: 'reg_',
            [EVerificationTypes.RESET_PASSWORD]: 'respass_',
            [EVerificationTypes.EDIT_PHONE]: 'editphone_',
           
        };
        let key = storeKeys[type];
        if (confirmation) {
            key += 'cfm_';
        }
        key += email;
        return key;
    }

    private getMessage(type: EVerificationTypes, otp: string) {
        switch (type) {
            case EVerificationTypes.REGISTER:
                return `Dizayin xizmati platformasidan ro'yxatdan o'tish uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`;
            case EVerificationTypes.RESET_PASSWORD:
                return `Dizayin xizmati platformasida parolingizni tiklash uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`;
            case EVerificationTypes.EDIT_PHONE:
                return `Dizayin xizmati platformasida telefon raqamingizni o'zgartirish uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`;
}
    }
    private async throwIfUserExists(email: string) {
        const cleanedemail =email.replace(/\s+/g, '');

        const user = await this.prisma.user.findUnique({
            where: {
                email: cleanedemail,
            },
        });
        if (user) {
            throw new HttpException('email already used', HttpStatus.BAD_REQUEST);
        }
        return user;
    }

    private async throwIfUserNotExists(email: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    async sendOtp(payload: SendOtpDto) {
        const { type, email } = payload;
        const key = this.getKey(type, email);
        const session = await this.redis.get(key);

        if (session) {
            throw new HttpException(
                'Code already sent to user',
                HttpStatus.BAD_REQUEST,
            );
        }

        switch (type) {
            case EVerificationTypes.REGISTER:
                await this.throwIfUserExists(email);
                break;
          
            case EVerificationTypes.RESET_PASSWORD:
                await this.throwIfUserNotExists(email);
                break;
        }

        const otp = generateOtp();
        await this.redis.set(key, JSON.stringify(otp), secToMills(60));
        await this.smsService.sendSMS(
          this.getMessage(type, otp),
          email,
          otp
        );
        
        return { message: 'Confirmation code sent' };
    }

    async verifyOtp(payload: VerifyOtpDto) {
        
        console.log(payload);
        
        const { type, email, otp } = payload;
        const session = await this.redis.get(
            this.getKey(type, email),
        );


        console.log(session);
        
        if (!session) {
            throw new HttpException('OTP expired!', HttpStatus.BAD_REQUEST);
        }
        if (otp !== JSON.parse(session)) {
            throw new HttpException('Invalid OTP!', HttpStatus.BAD_REQUEST);
        }

        await this.redis.del(this.getKey(type, email));
        await this.redis.set(
            this.getKey(type, email, true),
            JSON.stringify(otp),
            secToMills(120),
        );

        return {
            success: true,
            message: 'Verified',
        };
    }

    public async checkConfirmOtp(payload: ICheckOtp) {
        const { type, email, otp } = payload;
        const session = await this.redis.get(
            this.getKey(type, email, true),
        );
        if (!session) {
            throw new HttpException('Session expired!', HttpStatus.BAD_REQUEST);
        }

        if (otp !== JSON.parse(session)) {
            throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
        }

        await this.redis.del(this.getKey(type, email, true));
        return true;
    }
}
