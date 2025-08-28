import { Controller, Post, Body } from '@nestjs/common';
import { AccessCodeService } from './access-code.service';
import { VerifyCodeDto } from './dto/access-code.dto';

@Controller('access-code')
export class AccessCodeController {
  constructor(private readonly accessCodeService: AccessCodeService) {}

  @Post('request')
  requestCode() {
    return this.accessCodeService.generateAndStoreCode();
  }

  @Post('verify')
  verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
    return this.accessCodeService.verifyCode(verifyCodeDto);
  }
}
