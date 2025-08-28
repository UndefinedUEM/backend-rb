import { Controller, Post, Body } from '@nestjs/common';
import { AccessCodeService, VerifyCodeDto } from './access-code.service';

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
