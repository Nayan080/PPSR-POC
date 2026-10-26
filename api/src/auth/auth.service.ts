import { randomUUID } from 'node:crypto';
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { NumberingService } from '../common/numbering.service.js';
import { ConstantStore } from '../data/constant-store.js';
import { Account } from './account.entity.js';
import { AuthResponseDto, LoginDto, RegisterAccountDto } from './auth.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly store: ConstantStore,
    private readonly jwt: JwtService,
    private readonly numbering: NumberingService,
  ) {}

  async login({ email, password }: LoginDto): Promise<AuthResponseDto> {
    const account = this.store.findAccountByEmail(email);
    if (!account || !(await bcrypt.compare(password, account.passwordHash))) {
      throw new UnauthorizedException('The email or password you entered is incorrect.');
    }
    return this.issue(account);
  }

  async register(dto: RegisterAccountDto): Promise<AuthResponseDto> {
    const email = dto.email.toLowerCase();
    if (this.store.findAccountByEmail(email)) {
      throw new ConflictException('An account with this email already exists.');
    }
    const account: Account = {
      id: randomUUID(),
      email,
      passwordHash: await bcrypt.hash(dto.password, 10),
      givenName: dto.givenName,
      familyName: dto.familyName,
      organisationName: dto.organisationName ?? null,
      customerNumber: await this.numbering.customerNumber(),
      createdAt: new Date(),
    };
    this.store.addAccount(account);
    return this.issue(account);
  }

  async me(accountId: string): Promise<Account> {
    const account = this.store.findAccountById(accountId);
    if (!account) throw new NotFoundException();
    return account;
  }

  private async issue(account: Account): Promise<AuthResponseDto> {
    const { passwordHash: _, ...safe } = account;
    return {
      accessToken: await this.jwt.signAsync({ sub: account.id, email: account.email }),
      account: safe as Account,
    };
  }
}
