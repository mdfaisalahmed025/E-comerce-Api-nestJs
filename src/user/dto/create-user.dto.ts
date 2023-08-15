import { ApiProperty } from "@nestjs/swagger"



export class CreateUserDto {
    @ApiProperty()
    firstName: string
    @ApiProperty()
    userID: string
    @ApiProperty()
    lastName: string
    @ApiProperty()
    email: string
    @ApiProperty()
    password: string
    @ApiProperty()
    access_token: string
    @ApiProperty()
    created_At: Date
    @ApiProperty()
    updated_At: Date
}
