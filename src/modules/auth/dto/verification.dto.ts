import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMobilePhone, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty({
    example: '00000',
  })
  @IsString()
  otp: string;

  @ApiProperty({
    example: 'user@gmail.com.',
  })
  @IsEmail()
  @IsString()
  email: string;
}
