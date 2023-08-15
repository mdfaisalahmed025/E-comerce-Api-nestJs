import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Agent } from 'http';
import { Repository } from 'typeorm';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { UploadedFiles } from '@nestjs/common';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    @InjectRepository(User) private userpository: Repository<User>,
    private readonly userService: UserService
  ) { }

  @Post('registration')
  @ApiConsumes('application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },

      }
    },
  })
  async Register(

    @Req() req: Request,
    @Res() res: Response,
    @Body() userdto: CreateUserDto
  ) {
    const ExistUser = await this.userService.getUserByEmail(userdto.email);
    if (ExistUser) {
      throw new HttpException(
        'User Already Exist,please try again with another email',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.userService.Register(userdto);
    return res
      .status(HttpStatus.CREATED)
      .json({ status: 'success', message: 'user registration successful' });
  }

  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
      },
      required: ['email', 'password'],
    },
  })

  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const token = await this.userService.login(email, password);
    return res.status(HttpStatus.CREATED).json({
      status: 'success',
      message: 'login successfull',
      access_token: token
    });
  }

  // @ApiBearerAuth()
  @Post('verify')
  async verify(@Req() req: Request) {
    const jwt_Token = req.headers['authorization'];
    return await this.userService.verifyToken(jwt_Token)
  }


  // @ApiBearerAuth()
  @Patch('update')

  @ApiConsumes('application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        companyName: { type: 'string', },
        companyAddress: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        tinFile: { type: 'string', format: 'binary' },
        atabcertificationcopy: { type: 'string', format: 'binary' },
        toabcertificationcopy: { type: 'string', format: 'binary' },
        tradelicensecopy: { type: 'string', format: 'binary' },
      }
    },
  })
  async updateagent(
    @UploadedFiles()
    @Req() req: Request,
    @Res() res: Response,
    @Body() UpdateuserDto: UpdateUserDto
  ) {
    const jwt_Token = req.headers['authorization'];
    const decodedtoken = await this.userService.verifyToken(jwt_Token)
    const userID = decodedtoken.userID
    const user = await this.userpository.findOne({ where: { userID } })
    if (!user) {
      throw new HttpException('agent not found', HttpStatus.NOT_FOUND)
    }



    if (UpdateuserDto.firstName !== undefined) {
      user.firstName = UpdateuserDto.firstName;
    }
    if (UpdateuserDto.lastName !== undefined) {
      user.lastName = UpdateuserDto.lastName;
    }

    if (UpdateuserDto.email !== undefined) {
      user.email = UpdateuserDto.email;
    }

    if (UpdateuserDto.password !== undefined) {
      user.password = await bcrypt.hash(UpdateuserDto.password, 10)
    }
    await this.userpository.save(user)
    return res
      .status(HttpStatus.CREATED)
      .json({ status: 'success', message: 'user update successful' });
  }

  @Get('all')
  async allagent() {
    const alluser = await this.userpository.find({ order: { created_At: 'DESC' } });
    return alluser;
  }

  @ApiBearerAuth()
  @Delete('delete')
  async deleteAgent(@Req() req: Request,
    @Res() res: Response,
  ) {
    const jwt_Token = req.headers['authorization'];
    const decodedToken = await this.userService.verifyToken(jwt_Token)
    const userID = decodedToken.agentid;
    await this.userpository.delete({ userID })
    return res
      .status(HttpStatus.CREATED)
      .json({ status: 'success', message: 'user deleted successful' });
  }

}
