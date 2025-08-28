import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { RequestCodeDto, VerifyCodeDto } from './dto/access-code.dto';

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

  async generateAndStoreCode(
    requestCodeDto: RequestCodeDto,
  ): Promise<{ message: string }> {
    const { email } = requestCodeDto;

    const allowedEmailsString = this.configService.get<string>('EMAIL_TO');
    if (!allowedEmailsString) {
      console.error('EMAIL_TO não configurado.');
      throw new InternalServerErrorException(
        'A lista de e-mails permitidos não está configurada.',
      );
    }

    const allowedEmails = allowedEmailsString.split(',').map((e) => e.trim());

    if (!allowedEmails.includes(email)) {
      throw new UnauthorizedException(
        'Este e-mail não tem permissão para acessar o sistema.',
      );
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    this.accessCode = code;

    this.codeExpiration = new Date();
    this.codeExpiration.setMinutes(this.codeExpiration.getMinutes() + 5);

    try {
      await this.resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Seu Código de Acesso ao Sistema',
        html: `<p>Olá!</p><p>Seu código de acesso é: <strong>${code}</strong></p><p>Ele expira em 5 minutos.</p>`,
      });
      console.log(`E-mail com código de acesso enviado para ${email}`);
      return { message: `Um código de acesso foi enviado para ${email}.` };
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
