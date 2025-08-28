import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { VerifyCodeDto } from './dto/access-code.dto';

@Injectable()
export class AccessCodeService {
  private accessCode: string | null = null;
  private codeExpiration: Date | null = null;
  private readonly resend: Resend;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    const resendApiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error(
        'RESEND_API_KEY não foi encontrada nas variáveis de ambiente.',
      );
    }
    this.resend = new Resend(resendApiKey);
  }

  async generateAndStoreCode(): Promise<{ message: string }> {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    this.accessCode = code;

    this.codeExpiration = new Date();
    this.codeExpiration.setMinutes(this.codeExpiration.getMinutes() + 5);

    const emailsString = this.configService.get<string>('EMAIL_TO');
    if (!emailsString) {
      console.error('EMAIL_TO não configurado.');
      throw new InternalServerErrorException(
        'O e-mail de destino não está configurado.',
      );
    }

    const destinationEmails = emailsString
      .split(',')
      .map((email) => email.trim());

    try {
      await this.resend.emails.send({
        from: 'onboarding@resend.dev',
        to: destinationEmails,
        subject: 'Seu Código de Acesso ao Sistema',
        html: `<p>Olá!</p><p>Seu código de acesso é: <strong>${code}</strong></p><p>Ele expira em 5 minutos.</p>`,
      });
      console.log(
        `E-mail com código de acesso enviado para ${destinationEmails.join(', ')}`,
      );
      return {
        message: 'Um código de acesso foi enviado para o e-mail configurado.',
      };
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw new InternalServerErrorException(
        'Falha ao enviar o e-mail com o código.',
      );
    }
  }

  verifyCode(verifyCodeDto: VerifyCodeDto): { accessToken: string } {
    const now = new Date();

    if (
      !this.accessCode ||
      !this.codeExpiration ||
      this.accessCode !== verifyCodeDto.code ||
      now > this.codeExpiration
    ) {
      throw new UnauthorizedException('Código inválido ou expirado.');
    }

    this.accessCode = null;
    this.codeExpiration = null;

    const payload = { verified: true };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
