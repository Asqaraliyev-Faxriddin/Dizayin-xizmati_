import { IsNotEmpty, IsString, IsEmail, Matches, IsJWT } from "class-validator"

export class refreshTokenDto {
    @IsNotEmpty()
    @IsJWT()
    token:string
}
