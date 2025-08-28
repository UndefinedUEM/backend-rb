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
    const { email: requestedEmail } = requestCodeDto;

    const allowedEmailsString =
      this.configService.get<string>('ALLOWED_EMAILS');
    const ownerEmail = this.configService.get<string>('OWNER_EMAIL');

    if (!allowedEmailsString || !ownerEmail) {
      console.error('ALLOWED_EMAILS ou OWNER_EMAIL não configurados.');
      throw new InternalServerErrorException(
        'As variáveis de ambiente de e-mail não estão configuradas.',
      );
    }

    const allowedEmails = allowedEmailsString.split(',').map((e) => e.trim());

    if (!allowedEmails.includes(requestedEmail)) {
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
        to: ownerEmail,
        subject: `Solicitação de Acesso ao Sistema - ${requestedEmail}`,
        html: `<p>Olá!</p>
               <p>O usuário com o e-mail <strong>${requestedEmail}</strong> solicitou acesso ao sistema.</p>
               <p>O código de acesso é: <strong>${code}</strong></p>
               <p>Este código expira em 5 minutos.</p>`,
      });
      console.log(
        `E-mail de notificação sobre ${requestedEmail} enviado para ${ownerEmail}`,
      );
      return {
        message: `Uma solicitação de acesso foi enviada. Por favor, aguarde o código.`,
      };
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw new InternalServerErrorException(
        'Falha ao enviar o e-mail de notificação.',
      );
    }
  }

  // O método verifyCode continua exatamente o mesmo
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
