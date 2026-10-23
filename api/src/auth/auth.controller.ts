import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { type AuthUser, CurrentUser, Public } from './auth.decorators.js';
import { AccountDto, AuthResponseDto, LoginDto, RegisterAccountDto } from './auth.dto.js';
import { AuthService } from './auth.service.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({ type: AuthResponseDto })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Public()
  @Post('register')
  @ApiOkResponse({ type: AuthResponseDto })
  registerAccount(@Body() dto: RegisterAccountDto) {
    return this.auth.register(dto);
  }

  @ApiBearerAuth()
  @Get('me')
  @ApiOkResponse({ type: AccountDto })
  getCurrentAccount(@CurrentUser() user: AuthUser) {
    return this.auth.me(user.accountId);
  }
}
