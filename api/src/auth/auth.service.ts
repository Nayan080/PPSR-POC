import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { NumberingService } from '../common/numbering.service.js';
import { Account } from './account.entity.js';
import { AuthResponseDto, LoginDto, RegisterAccountDto } from './auth.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account) private readonly accounts: Repository<Account>,
    private readonly jwt: JwtService,
    private readonly numbering: NumberingService,
  ) {}

  async login({ email, password }: LoginDto): Promise<AuthResponseDto> {
    const account = await this.accounts
      .createQueryBuilder('a')
      .addSelect('a.passwordHash')
      .where('LOWER(a.email) = LOWER(:email)', { email })
      .getOne();
    if (!account || !(await bcrypt.compare(password, account.passwordHash))) {
      throw new UnauthorizedException('The email or password you entered is incorrect.');
    }
    return this.issue(account);
  }

  async register(dto: RegisterAccountDto): Promise<AuthResponseDto> {
    const email = dto.email.toLowerCase();
    if (await this.accounts.existsBy({ email })) {
      throw new ConflictException('An account with this email already exists.');
    }
    const account = await this.accounts.save(
      this.accounts.create({
        email,
        passwordHash: await bcrypt.hash(dto.password, 10),
        givenName: dto.givenName,
        familyName: dto.familyName,
        organisationName: dto.organisationName ?? null,
        customerNumber: await this.numbering.customerNumber(),
      }),
    );
    return this.issue(account);
  }

  async me(accountId: string): Promise<Account> {
    const account = await this.accounts.findOneBy({ id: accountId });
    if (!account) throw new NotFoundException();
    return account;
  }

  private async issue(account: Account): Promise<AuthResponseDto> {
    const { passwordHash: _, ...safe } = account;
    return {
      accessToken: await this.jwt.signAsync({ sub: account.id, email: account.email }),
      account: safe,
    };
  }
}
