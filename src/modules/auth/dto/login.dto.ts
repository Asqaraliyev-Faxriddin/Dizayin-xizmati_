import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, IsEmail, Matches } from "class-validator"

export class loginDto {
    @ApiProperty({
        example: "user@gmail.com"
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
}
