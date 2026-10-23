import { Logger, ServiceUnavailableException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { DataSource, type OrganisationIdentifierType, type SerialNumberType } from '../../common/enums.js';
import { PpsrGateway, type PpsrSearchOutcome, type PpsrStatus } from '../ppsr-gateway.js';

/**
 * AFSA PPSR B2G channel (SOAP over TLS, WSDL-defined).
 *
 * Not implemented yet: it needs the B2G WSDLs and Discovery credentials from AFSA
 * (https://www.ppsr.gov.au/request-b2g-discovery-access). To build it:
 *  1. Generate typed clients from the search service WSDL (current interface version).
 *  2. Map our inputs to the SearchBySerialNumber / SearchByGrantor / SearchByRegistrationNumber requests.
 *  3. Map responses (registrations + NEVDIS vehicle data, decoding written-off codes)
 *     to PpsrSearchOutcome, and SOAP faults to HTTP errors.
 *  4. Implement the mandatory Ping and ChangeB2GPassword operations.
 */
export class B2gPpsrGateway extends PpsrGateway {
  readonly source = DataSource.B2g;
  private readonly logger = new Logger(B2gPpsrGateway.name);
  private readonly endpoint: string | undefined;

  constructor(config: ConfigService) {
    super();
    this.endpoint = config.get<string>('PPSR_B2G_ENDPOINT');
    this.logger.warn('PPSR_GATEWAY=b2g selected, but the B2G client is not implemented yet.');
  }

  searchBySerialNumber(_type: SerialNumberType, _serialNumber: string): Promise<PpsrSearchOutcome> {
    return this.notReady();
  }

  searchByOrganisationGrantor(_type: OrganisationIdentifierType, _identifier: string): Promise<PpsrSearchOutcome> {
    return this.notReady();
  }

  searchByRegistrationNumber(_registrationNumber: string): Promise<PpsrSearchOutcome> {
    return this.notReady();
  }

  async status(): Promise<PpsrStatus> {
    return {
      source: this.source,
      connected: false,
      detail: this.endpoint ? `B2G client not implemented (${this.endpoint})` : 'PPSR_B2G_ENDPOINT not configured',
    };
  }

  private notReady(): never {
    throw new ServiceUnavailableException('The PPSR is not connected yet. Please try again later.');
  }
}
