import { ApiProperty } from "@nestjs/swagger"
import { UserRole } from "@prisma/client"
import { IsNotEmpty, IsString, Matches, IsPhoneNumber, Length, IsUUID, IsEnum, IsOptional, IS_OPTIONAL, IsEmail } from "class-validator"

export class registerDto {
    @ApiProperty({
        example:"Abduxoshim"
    })
    @IsNotEmpty()
    @IsString()
    @Length(3, 20)
    firstName: string

    @ApiProperty({
        example:"Sultonqulov"
    })
    @IsNotEmpty()
    @IsString()
    @Length(3, 20)
    lastName: string

    @ApiProperty({
        example: 'user@gmail.com',
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string

    @ApiProperty({
        example: "12345678"
    })
    @Matches(/^[a-zA-Z0-9]{6,20}$/)
    password: string

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole

    @ApiProperty({
        example: "0000"
    })
    @IsString()
    otp: string;

   
}
