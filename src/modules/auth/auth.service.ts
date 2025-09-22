import {
  Injectable,
  Inject,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '../../common/mailer.service';
import { SignupDto } from './dto/signup.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import axios from 'axios';


@Injectable()
export class AuthService {
  private db;

  constructor(
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    @Inject('FIREBASE') private readonly firebase: any,
  ) {
    this.db = this.firebase.firestore;
  }

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
  }

  private async saveVerificationCode(email: string, code: string) {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 phút
    await this.db.collection('verificationCodes').doc(email).set({
      code,
      createdAt: new Date(),
      expiresAt,
    });
  }

  private async validateVerificationCode(email: string, verificationCode: string) {
    const doc = await this.db.collection('verificationCodes').doc(email).get();

    if (!doc.exists) {
      throw new UnauthorizedException('Verification code not found');
    }

    const data = doc.data();
    if (data.code !== verificationCode) {
      throw new UnauthorizedException('Invalid verification code');
    }

    if (data.expiresAt.toDate() < new Date()) {
      throw new UnauthorizedException('Verification code expired');
    }

    await this.db.collection('verificationCodes').doc(email).delete();
  }

  async signup(dto: SignupDto) {
    const userRef = this.db.collection('users').doc(dto.email);
    const exists = await userRef.get();

    if (exists.exists) {
      throw new ConflictException('User already exists');
    }

    const code = this.generateCode();
    await this.saveVerificationCode(dto.email, code);

    await this.mailerService.sendVerificationCode(dto.email, code);

    return { message: 'Verification code sent to email' };
  }

  async verifySignup(dto: VerifyCodeDto) {
    await this.validateVerificationCode(dto.email, dto.verificationCode);

    const userRef = this.db.collection('users').doc(dto.email);
    await userRef.set({
      email: dto.email,
      createdAt: new Date(),
    });

    const payload = { email: dto.email, sub: dto.email };
    const accessToken = this.jwtService.sign(payload);

    return { email: dto.email, accessToken };
  }

  async signin(email: string) {
    const userRef = this.db.collection('users').doc(email);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new NotFoundException('Email not found');
    }

    const code = this.generateCode();
    await this.saveVerificationCode(email, code);

    await this.mailerService.sendVerificationCode(email, code);

    return { message: 'Verification code sent to email' };
  }



  async verifySignin(email: string, verificationCode: string) {
    await this.validateVerificationCode(email, verificationCode);

    const payload = { email, sub: email };
    const accessToken = this.jwtService.sign(payload);

    return { email, accessToken };
  }

  async githubLogin(code: string) {
    try {
      console.log('GitHub login code:', code);

      const tokenRes = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        { headers: { Accept: 'application/json' } },
      );

      const accessToken = tokenRes.data.access_token;
      if (!accessToken) throw new UnauthorizedException('Invalid GitHub code');

      const userRes = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const { id, login, email, avatar_url } = userRes.data;

      const userRef = this.db.collection('users').doc(`${login}`);
      const doc = await userRef.get();
      const userEmail = email || login;

      if (!doc.exists) {
        await userRef.set({
          provider: 'github',
          githubId: id,
          username: login,
          email: userEmail,
          avatar: avatar_url,
          createdAt: new Date(),
        });
      }

      const payload = { sub: id, email: userEmail };
      const jwt = this.jwtService.sign(payload);


      return { accessToken: jwt, provider: 'github', email: userEmail };
    } catch (err) {
      throw new UnauthorizedException('GitHub authentication failed');
    }
  }

}
