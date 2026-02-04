import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateRasmlarDto {
  @ApiPropertyOptional({
    example: 'New Title',
    description: 'Rasm sarlavhasi',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Rasm pullik bo‘lishi yoki yo‘qligi',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isPaid?: boolean;
}



export class GrantAccessDto {
  @ApiProperty({ example: 'user-uuid', description: 'Ruxsat beriladigan user ID' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 12, description: 'Ruxsat beriladigan rasm ID' })
  rasmId: number;
}




export class RasmResponseDto {
  @ApiProperty({ example: 12 })
  id: number;

  @ApiProperty({ example: 'My Vacation Photo' })
  title: string;

  @ApiProperty({ example: 'https://image.url' })
  imageUrl: string;

  @ApiProperty({ example: false })
  isPaid: boolean;

  @ApiProperty({ example: true, description: 'User rasmni yuklab olishi mumkin yoki yo‘q' })
  canDownload: boolean;
}
