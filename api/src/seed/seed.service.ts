import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { OrganisationIdentifierType, SerialNumberType } from '../common/enums.js';
import { ConstantStore } from '../data/constant-store.js';
import { SearchesService } from '../searches/searches.service.js';

export const DEMO_ACCOUNT = { email: 'demo@ppsr.test', password: 'Password123!' };

/** Creates a demo customer with search history so the PoC is explorable straight away. */
@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly store: ConstantStore,
    private readonly searches: SearchesService,
  ) {}

  async onApplicationBootstrap() {
    if (process.env.SEED === 'false') return;
    const account = this.store.findAccountByEmail(DEMO_ACCOUNT.email);
    if (!account) return;

    if (this.store.listSearches(account.id).length > 0) return;
    this.logger.log('Seeding demo search history…');

    try {
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
    } catch (err) {
      this.logger.warn(`Failed to seed demo searches: ${err}`);
    }
  }
}
