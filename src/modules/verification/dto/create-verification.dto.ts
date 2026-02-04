import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsMobilePhone, IsString } from 'class-validator';
import { EVerificationTypes } from 'src/common/types/verification';

export class SendOtpDto {
  @ApiProperty({
    enum: EVerificationTypes,
  })
  @IsEnum(EVerificationTypes)
  type: EVerificationTypes;

  @ApiProperty({
    example: 'user@gmail.com',
  })
 @IsEmail()
  @IsString()
  email: string;
}

export class VerifyOtpDto extends SendOtpDto {
  @ApiProperty({
    example: '000000',
  })
  @IsString()
  otp: string;
}
