import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsEmail } from "class-validator"



export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

let userCount = Math.floor(Math.random()*1000)
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number
    @Column({ type: "varchar" })
    userID: string
    @BeforeInsert()
    generateUserId() {
        userCount++;
        this.userID = `U${100 + userCount}`;
    }
    @Column({ type: "varchar" })
    firstName: string
    @Column({ type: "varchar" })
    lastName: string
    @IsEmail()
    @Column({ type: "varchar" })
    email: string
    @Column({ type: "varchar" })
    password: string
    @Column({ type: "varchar" })
    walletbalance: number
    @Column({ type: "varchar" })
    access_token: string
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_At: Date;
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_At: Date;
    @Column()
    ipAddress: string;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    loginTime: Date;
    @Column()
    browserName: string;
    @Column()
    activeStatus: boolean;
    @Column({ default: 0 })
    loginAttempts: number;
    @Column({ default: false })
    isLocked: boolean;
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    join_At: Date;
    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER, // Set the default role to 'user'
    })
    Role: UserRole

}