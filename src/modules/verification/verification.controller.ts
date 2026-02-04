import { Body, Controller, Post } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { SendOtpDto, VerifyOtpDto } from './dto/create-verification.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EVerificationTypes } from 'src/common/types/verification';

@ApiTags('Verification')
@Controller('api/v1/verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @ApiOperation({
    description: `Valid types: ${EVerificationTypes.REGISTER}, ${EVerificationTypes.RESET_PASSWORD}, ${EVerificationTypes.EDIT_PHONE}`,
  })
  @Post('send')
  sendOtp(@Body() body: SendOtpDto) {
    return this.verificationService.sendOtp(body);
  }

  @ApiOperation({
    description: `Valid types: ${EVerificationTypes.REGISTER}, ${EVerificationTypes.RESET_PASSWORD}, ${EVerificationTypes.EDIT_PHONE}`,
  })
  @Post('verify')
  verifyOtp(@Body() body: VerifyOtpDto) {
    return this.verificationService.verifyOtp(body);
  }
}

