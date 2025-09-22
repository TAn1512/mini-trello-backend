import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    async sendVerificationCode(to: string, code: string) {
        await this.transporter.sendMail({
            from: `"Mini Trello" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Your Verification Code',
            text: `Your verification code is: ${code}`,
        });
    }
}
