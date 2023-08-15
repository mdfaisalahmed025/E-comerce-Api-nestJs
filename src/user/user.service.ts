

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';


@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userpository: Repository<User>,
    private readonly jwtService: JwtService) { }
  // Register user
  async Register(
    userdto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(userdto.password, 10)
    const newuser = await this.userpository.create({ ...userdto, password: hashedPassword });
    await this.userpository.save(newuser);
    await this.sendRegisterSuccecess(userdto)
    return this.generateToken(newuser)
  }

  // generate token 
  async generateToken(userdto: CreateUserDto): Promise<string> {
    const payload = { email: userdto.email, userID: userdto.userID };
    const token = await this.jwtService.signAsync(payload)
    userdto.access_token = token;
    await this.userpository.save(userdto);
    return token;
  }

  async sendRegisterSuccecess(authdto: CreateUserDto) {
    // Create a transporter with SMTP configuration
    const transporter = nodemailer.createTransport({
      host: 'b2b.flyfarint.com', // Replace with your email service provider's SMTP host
      port: 465, // Replace with your email service provider's SMTP port
      secure: true, // Use TLS for secure connection
      auth: {
        user: 'flyfarladies@mailservice.center', // Replace with your email address
        pass: 'YVWJCU.?UY^R', // Replace with your email password
      },
    });


    var currentDate = new Date();

    // Get the day, month, and year components
    var day = currentDate.getDate();
    var month = currentDate.toLocaleString('default', { month: 'long' });
    var year = currentDate.getFullYear();

    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    // Determine if it's AM or PM
    var amOrPm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)

    var formattedDate = month + ' ' + day + ', ' + year + ' ' + hours + ':' + minutes + ' ' + amOrPm;
    // Compose the email message
    const mailOptions = {
      from: 'flyfarladies@mailservice.center', // Replace with your email address
      to: authdto.email, // Recipient's email address
      subject: 'Welcome To Fly Far Trips',
      text: 'Congrats! your Registration has been Completed ',
      html: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Deposit Request</title>
        </head>
        <body>
          <div
            style="
              width: 700px;
              height: fit-content;
              margin: 0 auto;
              background-color: #efefef;
            "
          >
            <div style="width: 700px; height: 70px; background: #fe99a6">
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                align="center"
                style="
                  border-collapse: collapse;
                  border-spacing: 0;
                  padding: 0;
                  width: 700px;
                "
              >
                <tr>
                  <td
                    align="center"
                    valign="top"
                    style="
                      border-collapse: collapse;
                      border-spacing: 0;
                      color: #ffffff;
                      font-family: sans-serif;
                      font-size: 15px;
                      line-height: 38px;
                      padding: 20px 0 20px 0;
                      text-transform: uppercase;
                      letter-spacing: 5px;
                    "
                  >
                    Welcome to Fly Far Trips
                  </td>
                </tr>
              </table>
      
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                align="center"
                style="
                  border-collapse: collapse;
                  border-spacing: 0;
                  padding: 0;
                  width: 700px;
                "
              >
                <tr>
                  <td
                    valign="top"
                    style="
                      background-color: #efefef;
                      border-collapse: collapse;
                      border-spacing: 0;
                      color: #584660;
                      font-family: sans-serif;
                      font-size: 30px;
                      font-weight: 500;
                      line-height: 38px;
                      padding: 20px 40px 0px 55px;
                    "
                  >
                 
                  </td>
                </tr>
                <tr>
                  <td
                    valign="top"
                    style="
                      background-color: #efefef;
                      border-collapse: collapse;
                      border-spacing: 0;
                      color: #bc6277;
                      font-family: sans-serif;
                      font-size: 17px;
                      font-weight: 500;
                      line-height: 38px;
                      padding: 0px 40px 20px 55px;
                    "
                  >
                    ${formattedDate}
                  </td>
                </tr>
              </table>
      
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                align="center"
                style="
                  border-collapse: collapse;
                  border-spacing: 0;
                  padding: 0;
                  width: 620px;
                  background-color: #ffffff;
                "
              >
                <tr>
                  <td
                    valign="top"
                    style="
                      border-collapse: collapse;
                      border-spacing: 0;
                      color: #bc6277;
                      font-family: sans-serif;
                      font-size: 15px;
                      font-weight: 600;
                      line-height: 38px;
                      padding: 10px 20px 5px 20px;
                    "
                  >
                    Agent Details
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #dfdfdf">
                  <td
                    valign="top"
                    style="
                      border-collapse: collapse;
                      border-spacing: 0;
                      color: #767676;
                      font-family: sans-serif;
                      font-size: 14px;
                      font-weight: 500;
                      line-height: 38px;
                      padding: 5px 20px;
                      width: 180px;
                    "
                  >
                    firstName
                  </td>
                  <td
                    valign="top"
                    style="
                      border-collapse: collapse;
                      border-spacing: 0;
                      color: #767676;
                      font-family: sans-serif;
                      font-size: 14px;
                      font-weight: 500;
                      line-height: 38px;
                      padding: 5px 20px;
                    "
                  >
                    ${authdto.firstName}
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #dfdfdf">
                <td
                  valign="top"
                  style="
                    border-collapse: collapse;
                    border-spacing: 0;
                    color: #767676;
                    font-family: sans-serif;
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 38px;
                    padding: 5px 20px;
                    width: 180px;
                  "
                >
                  lastName
                </td>
                <td
                  valign="top"
                  style="
                    border-collapse: collapse;
                    border-spacing: 0;
                    color: #767676;
                    font-family: sans-serif;
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 38px;
                    padding: 5px 20px;
                  "
                >
                  ${authdto.lastName}
                </td>
              </tr>
                <tr style="border-bottom: 1px solid #dfdfdf">
                  <td
                    valign="top"
                    style="
                      border-collapse: collapse;
                      border-spacing: 0;
                      color: #767676;
                      font-family: sans-serif;
                      font-size: 14px;
                      font-weight: 500;
                      line-height: 38px;
                      padding: 5px 20px;
                      width: 180px;
                    "
                  >
                    password
                  </td>
                  <td
                    valign="top"
                    style="
                      border-collapse: collapse;
                      border-spacing: 0;
                      color: #767676;
                      font-family: sans-serif;
                      font-size: 14px;
                      font-weight: 500;
                      line-height: 38px;
                      padding: 5px 20px;
                    "
                  >
                  ${authdto.password}
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #dfdfdf">
                <td
                  valign="top"
                  style="
                    border-collapse: collapse;
                    border-spacing: 0;
                    color: #767676;
                    font-family: sans-serif;
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 38px;
                    padding: 5px 20px;
                    width: 180px;
                  "
                >
                  Company Address
                </td>
                <td
                  valign="top"
                  style="
                    border-collapse: collapse;
                    border-spacing: 0;
                    color: #767676;
                    font-family: sans-serif;
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 38px;
                    padding: 5px 20px;
                  "
                >
          
                </td>
              </tr>
              </table>
      
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                align="center"
                style="
                  border-collapse: collapse;
                  border-spacing: 0;
                  padding: 0;
                  width: 670px;
                  background-color: #702c8b;
                  margin-top: 25px;
                  text-align: center;
                  color: #ffffff !important;
                  text-decoration: none !important;
                "
              >
                <tr>
                  <td
                    valign="top"
                    style="
                      border-collapse: collapse;
                      border-spacing: 0;
                      font-family: sans-serif;
                      font-size: 16px;
                      font-weight: 500;
                      padding: 20px 20px 0px 20px;
                    "
                  >
                    Need more help?
                  </td>
                </tr>
      
                <tr>
                  <td
                    valign="top"
                    style="
                      border-collapse: collapse;
                      border-spacing: 0;
                      font-family: sans-serif;
                      font-size: 12px;
                      font-weight: 500;
                      line-height: 38px;
                      padding: 0px 20px 10px 20px;
                    "
                  >
                    Mail us at
                    <span style="color: #ffffff !important; text-decoration: none"
                      >support@flyfartrips.com</span
                    >
                    or Call us at 09606912912
                  </td>
                </tr>
              </table>
      
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                align="left"
                style="
                  border-collapse: collapse;
                  border-spacing: 0;
                  padding: 0;
                  width: 420px;
                  color: #ffffff;
                "
              >
                <tr>
                  <td
                    valign="top"
                    style="
                      border-collapse: collapse;
                      border-spacing: 0;
                      font-family: sans-serif;
                      font-size: 13px;
                      font-weight: 600;
                      padding: 20px 0px 0px 45px;
                      color: #767676;
                    "
                  >
                    <a style="padding-right: 20px; color: #584660" href="http://"
                      >Terms & Conditions</a
                    >
      
                    <a style="padding-right: 20px; color: #584660" href="http://"
                      >Booking Policy</a
                    >
      
                    <a style="padding-right: 20px; color: #584660" href="http://"
                      >Privacy Policy</a
                    >
                  </td>
                </tr>
              </table>
      
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                style="
                  border-collapse: collapse;
                  border-spacing: 0;
                  width: 700px;
                  color: #ffffff;
                  margin-top: 85px;
                "
              >
                <tr>
                  <td style="padding-left: 45px">
                    <img
                      style="padding-right: 5px"
                      src="./img/Vector (5).png"
                      href="http://"
                      alt=""
                    />
                    <img
                      style="padding-right: 5px"
                      src="./img/Vector (6).png"
                      href="http://"
                      alt=""
                    />
                    <img
                      style="padding-right: 5px"
                      src="./img/Vector (7).png"
                      href="http://"
                      alt=""
                    />
                  </td>
                </tr>
      
                <tr>
                  <td
                    style="
                      border-collapse: collapse;
                      border-spacing: 0;
                      font-family: sans-serif;
                      font-size: 13px;
                      font-weight: 500;
                      padding: 5px 0px 0px 45px;
                      color: #767676;
                      padding-bottom: 2px;
                    "
                  >
                    Ka 11/2A, Bashundhora R/A Road, Jagannathpur, Dhaka 1229.
                  </td>
      
                  <td
                    style="
                      border-collapse: collapse;
                      border-spacing: 0;
                      font-family: sans-serif;
                      font-weight: 500;
                      color: #767676;
                      padding-bottom: 20px;
      
                    "
                  >
                    <img width="100px" src="./img/logo 1 (1).png" alt="" />
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </body>
      </html>
      `

    }
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent successfully:', info.response);
      }
    });
  }


  // login user
  async login(email: string, password: string): Promise<string> {
    const user = await this.userpository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException("User does not exists", HttpStatus.BAD_REQUEST,);
    }

    if (user.isLocked) {
      throw new HttpException("your account is locked", HttpStatus.BAD_REQUEST);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.loginAttempts = user.loginAttempts + 1;
      await this.userpository.save(user);

      if (user.loginAttempts >= 5) {
        user.isLocked = true;
        await this.userpository.save(user);
        throw new HttpException("Account locked due to multiple failed login attempts", HttpStatus.BAD_REQUEST);
      }
      throw new HttpException("password is not correct", HttpStatus.BAD_REQUEST,);
    }
    user.loginAttempts = 0;
    await this.userpository.save(user);
    return this.generateToken(user);
  }


  //verified token
  async verifyToken(access_token?: string): Promise<any> {
    if (!access_token) {
      throw new HttpException('access token is required', HttpStatus.BAD_REQUEST);
    }
    const actualtoken = access_token.slice(7)
    try {
      const decoded = this.jwtService.verify(actualtoken);
      return decoded;
    } catch (error) {
      // Handle token verification or decoding errors
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
  }
  // validate email
  async getUserByEmail(email: string): Promise<User> {
    return this.userpository.findOne({ where: { email } });
  }
}

