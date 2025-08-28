import { Controller, Post, Body } from '@nestjs/common';
import { AccessCodeService } from './access-code.service';
import { VerifyCodeDto, RequestCodeDto } from './dto/access-code.dto';

@Controller('access-code')
export class AccessCodeController {
  constructor(private readonly accessCodeService: AccessCodeService) {}

  @Post('request')
  requestCode(@Body() requestCodeDto: RequestCodeDto) {
    return this.accessCodeService.generateAndStoreCode(requestCodeDto);
  }

  @Post('verify')
  verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
    return this.accessCodeService.verifyCode(verifyCodeDto);
  }
}
