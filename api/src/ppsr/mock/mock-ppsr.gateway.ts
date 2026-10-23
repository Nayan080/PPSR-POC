import { setTimeout as sleep } from 'node:timers/promises';
import { DataSource, type OrganisationIdentifierType, SerialNumberType } from '../../common/enums.js';
import type { RegistrationSummaryDto } from '../../searches/search.dto.js';
import { PpsrGateway, type PpsrSearchOutcome, type PpsrStatus } from '../ppsr-gateway.js';
import { MOCK_REGISTRATIONS, MOCK_VEHICLES } from './mock-register.js';

/** Answers searches from fictional fixtures, mimicking the B2G responses (including latency). */
export class MockPpsrGateway extends PpsrGateway {
  readonly source = DataSource.Mock;
  // Seeded from the clock so search numbers stay unique across restarts.
  private counter = Math.floor(Date.now() / 1000) % 90_000;

  async searchBySerialNumber(type: SerialNumberType, serialNumber: string) {
    return this.respond(
      (r) => r.serialNumberType === type && r.serialNumber === serialNumber,
      MOCK_VEHICLES[serialNumber] && type === SerialNumberType.Vin ? MOCK_VEHICLES[serialNumber] : null,
    );
  }

  async searchByOrganisationGrantor(_type: OrganisationIdentifierType, identifierNumber: string) {
    // The register matches an ABN on the ACN it contains (its last 9 digits).
    const acn = identifierNumber.slice(-9);
    return this.respond((r) => r.grantor?.identifierNumber?.slice(-9) === acn);
  }

  async searchByRegistrationNumber(registrationNumber: string) {
    return this.respond((r) => r.registrationNumber === registrationNumber);
  }

  async status(): Promise<PpsrStatus> {
    return { source: this.source, connected: true, detail: 'Built-in test register (fictional data)' };
  }

  private async respond(
    match: (r: RegistrationSummaryDto) => boolean,
    vehicle: PpsrSearchOutcome['vehicle'] = null,
  ): Promise<PpsrSearchOutcome> {
    await sleep(250 + Math.random() * 350);
    const now = new Date();
    const registrations = MOCK_REGISTRATIONS.filter(
      (r) => !r.removed && (!r.endTime || new Date(r.endTime) > now) && match(r),
    ).map(({ removed: _, ...r }) => r);

    this.counter += 1;
    const day = now.toISOString().slice(0, 10).replaceAll('-', '');
    return {
      ppsrSearchNumber: `${day}${String(this.counter).padStart(5, '0')}`,
      searchedAt: now.toISOString(),
      registrations,
      vehicle,
    };
  }
}
