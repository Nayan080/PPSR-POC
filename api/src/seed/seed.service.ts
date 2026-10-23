import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../auth/account.entity.js';
import { AuthService } from '../auth/auth.service.js';
import { OrganisationIdentifierType, SerialNumberType } from '../common/enums.js';
import { SearchesService } from '../searches/searches.service.js';

export const DEMO_ACCOUNT = { email: 'demo@ppsr.test', password: 'Password123!' };

/** Creates a demo customer with a little search history so the PoC is explorable straight away. */
@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Account) private readonly accounts: Repository<Account>,
    private readonly auth: AuthService,
    private readonly searches: SearchesService,
  ) {}

  async onApplicationBootstrap() {
    if (process.env.SEED === 'false' || (await this.accounts.count()) > 0) return;
    this.logger.log('Seeding demo data…');

    const { account } = await this.auth.register({
      ...DEMO_ACCOUNT,
      givenName: 'Alex',
      familyName: 'Morgan',
      organisationName: 'Morgan Motors Pty Ltd',
    });

    // History is only seeded from the mock register; a live B2G search would be chargeable.
    if (process.env.PPSR_GATEWAY === 'b2g') return;
    await this.searches.bySerialNumber(account.id, {
      serialNumberType: SerialNumberType.Vin,
      serialNumber: 'JTMHV05J604123456',
      clientReference: 'Trade-in #4471',
    });
    await this.searches.bySerialNumber(account.id, {
      serialNumberType: SerialNumberType.Vin,
      serialNumber: 'KMHCT41DAEU123456',
      clientReference: 'Trade-in #4472',
    });
    await this.searches.byOrganisationGrantor(account.id, {
      identifierType: OrganisationIdentifierType.Acn,
      identifierNumber: '604512378',
      clientReference: 'Fleet purchase – Northside',
    });
    this.logger.log(`Demo account ready: ${DEMO_ACCOUNT.email}`);
  }
}
