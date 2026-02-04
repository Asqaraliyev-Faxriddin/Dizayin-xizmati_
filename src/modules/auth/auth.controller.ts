import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';
import { refreshTokenDto } from './dto/refresh-token.dto';
import { ResetPasswordDto } from './dto/verification.dto';
import { ApiOperation } from '@nestjs/swagger';
import { EVerificationTypes } from 'src/common/types/verification';

@Controller('api/v1/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiOperation({
        description:
            'Create user and get tokens. You should send register type verification & verify that before register.',
        summary: 'OTP verification',
    })
    @Post('register')
    register(@Body() payload: registerDto) {
        return this.authService.register(payload)
    }

    @Post('login')
    login(@Body() payload: loginDto) {
        return this.authService.login(payload)
    }

    @Post('refresh-token')
    refreshToken(@Body() token: refreshTokenDto) {
        return this.authService.refreshToken(token)
    }

    @ApiOperation({
        description: `First you should send code with type=${EVerificationTypes.RESET_PASSWORD} & verify it.`,
        summary: 'OTP verification',
    })
    @Post("reset-password")
    resetPassword(@Body() payload: ResetPasswordDto) {
        return this.authService.resetPassword(payload)
    }
}