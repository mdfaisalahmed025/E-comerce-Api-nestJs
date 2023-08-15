
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env', }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      // username:"flyfarin_fflv2",
      // password: "123Next2$",
      // host: "flyfarint.com",
      // database:"flyfarin_fflv2",

      username: 'root',
      password: '',
      host: '127.0.0.1',
      database: 'ecommerce',
      port: 3306,
      entities: [
        User
      ],
      synchronize: true,
    }),
    UserModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }