import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constant';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  JwtModule.register({
    secret: 'ddicfjdivfjdvijdovj',
    signOptions: { expiresIn: '1d' },
  }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtService],
})
export class UserModule { }
