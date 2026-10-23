import type { DataSource, OrganisationIdentifierType, SerialNumberType } from '../common/enums.js';
import type { RegistrationSummaryDto, VehicleDto } from '../searches/search.dto.js';

/** What the PPSR returns for one search. */
export interface PpsrSearchOutcome {
  ppsrSearchNumber: string;
  searchedAt: string;
  registrations: RegistrationSummaryDto[];
  /** NEVDIS vehicle data; only returned for serial number searches of motor vehicles. */
  vehicle: VehicleDto | null;
}

export interface PpsrStatus {
  source: DataSource;
  connected: boolean;
  detail: string;
}

/**
 * The boundary between this service and the government register.
 * Everything else in the API depends on this abstraction, never on a specific transport,
 * so the mock and the AFSA B2G (SOAP) implementation are interchangeable via config.
 */
export abstract class PpsrGateway {
  abstract readonly source: DataSource;

  abstract searchBySerialNumber(type: SerialNumberType, serialNumber: string): Promise<PpsrSearchOutcome>;

  abstract searchByOrganisationGrantor(
    type: OrganisationIdentifierType,
    identifierNumber: string,
  ): Promise<PpsrSearchOutcome>;

  abstract searchByRegistrationNumber(registrationNumber: string): Promise<PpsrSearchOutcome>;

  abstract status(): Promise<PpsrStatus>;
}
