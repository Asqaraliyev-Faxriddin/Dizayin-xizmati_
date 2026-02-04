import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateRasmlarDto {
  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Avatar image file',
  })
  image?: any;

  @ApiProperty({
    example: 'My Vacation Photo',
    description: 'Rasm sarlavhasi',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Rasm pullik bo‘lishi yoki yo‘qligi',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isPaid?: boolean;
}
