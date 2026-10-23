import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import {
  CollateralClass,
  CollateralType,
  DataSource,
  OrganisationIdentifierType,
  SearchType,
  SerialNumberType,
} from '../common/enums.js';
import { PartyDto } from '../common/party.dto.js';

/* ---------- Inputs ---------- */

class SearchInputBase {
  @ApiPropertyOptional({ description: "Customer's own reference, e.g. a deal or file number", maxLength: 60 })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  clientReference?: string;
}

export class SerialNumberSearchInput extends SearchInputBase {
  @ApiProperty({ enum: SerialNumberType, enumName: 'SerialNumberType' })
  @IsEnum(SerialNumberType)
  serialNumberType: SerialNumberType;

  @ApiProperty({ example: '6T1BF3FK40X012345' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  serialNumber: string;
}

export class OrganisationGrantorSearchInput extends SearchInputBase {
  @ApiProperty({ enum: OrganisationIdentifierType, enumName: 'OrganisationIdentifierType' })
  @IsEnum(OrganisationIdentifierType)
  identifierType: OrganisationIdentifierType;

  @ApiProperty()
  @Matches(/^\d{9}(\d{2})?$/, { message: 'Identifier must be 9 or 11 digits' })
  identifierNumber: string;
}

export class RegistrationNumberSearchInput extends SearchInputBase {
  @ApiProperty()
  @Matches(/^\d{15}$/, { message: 'Registration number must be 15 digits' })
  registrationNumber: string;
}

/* ---------- Register data (as returned by the PPSR) ---------- */

export class AddressForServiceDto {
  @ApiProperty()
  contactName: string;

  @ApiProperty({ type: String, nullable: true })
  email: string | null;

  @ApiProperty()
  postalAddress: string;
}

export class RegistrationSummaryDto {
  @ApiProperty()
  registrationNumber: string;

  @ApiProperty({ enum: CollateralType, enumName: 'CollateralType' })
  collateralType: CollateralType;

  @ApiProperty({ enum: CollateralClass, enumName: 'CollateralClass' })
  collateralClass: CollateralClass;

  @ApiProperty({ enum: SerialNumberType, enumName: 'SerialNumberType', nullable: true })
  serialNumberType: SerialNumberType | null;

  @ApiProperty({ type: String, nullable: true })
  serialNumber: string | null;

  @ApiProperty({ type: String, nullable: true })
  collateralDescription: string | null;

  @ApiProperty({
    type: PartyDto,
    nullable: true,
    description: 'Not disclosed for consumer property described by serial number',
  })
  grantor: PartyDto | null;

  @ApiProperty({ type: [String] })
  securedParties: string[];

  @ApiProperty({ type: AddressForServiceDto })
  addressForService: AddressForServiceDto;

  @ApiProperty()
  isPmsi: boolean;

  @ApiProperty()
  isInventory: boolean;

  @ApiProperty({ type: String, nullable: true })
  proceedsDescription: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  startTime: string;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, description: 'Null means no stated end time' })
  endTime: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  lastChanged: string;
}

/* ---------- Vehicle data (NEVDIS, returned with serial number searches) ---------- */

export class WrittenOffNotificationDto {
  @ApiProperty({ description: 'State or territory that recorded the notification' })
  jurisdiction: string;

  @ApiProperty({ type: String, format: 'date' })
  incidentDate: string;

  @ApiProperty({ description: 'e.g. Statutory or Repairable write-off' })
  category: string;

  @ApiProperty({ type: [String], description: 'Decoded damage descriptions' })
  damage: string[];
}

export class StolenNotificationDto {
  @ApiProperty()
  jurisdiction: string;

  @ApiProperty({ type: String, format: 'date' })
  reportedDate: string;

  @ApiProperty()
  summary: string;
}

export class VehicleDto {
  @ApiProperty()
  vin: string;

  @ApiProperty({ type: String, nullable: true })
  make: string | null;

  @ApiProperty({ type: String, nullable: true })
  model: string | null;

  @ApiProperty({ type: Number, nullable: true })
  year: number | null;

  @ApiProperty({ type: String, nullable: true })
  colour: string | null;

  @ApiProperty({ type: String, nullable: true })
  bodyType: string | null;

  @ApiProperty({ type: String, nullable: true })
  engineNumber: string | null;

  @ApiProperty({ type: String, nullable: true })
  registrationPlate: string | null;

  @ApiProperty({ type: String, nullable: true })
  registrationState: string | null;

  @ApiProperty({ type: String, format: 'date', nullable: true })
  registrationExpiry: string | null;

  @ApiProperty({ type: [WrittenOffNotificationDto] })
  writtenOff: WrittenOffNotificationDto[];

  @ApiProperty({ type: [StolenNotificationDto] })
  stolen: StolenNotificationDto[];
}

/* ---------- Our search records ---------- */

export class SearchDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Our order reference' })
  reference: string;

  @ApiProperty({ description: 'Search number issued by the PPSR (appears on the certificate)' })
  ppsrSearchNumber: string;

  @ApiProperty({ enum: SearchType, enumName: 'SearchType' })
  searchType: SearchType;

  @ApiProperty()
  criteriaSummary: string;

  @ApiProperty({ type: String, nullable: true })
  clientReference: string | null;

  @ApiProperty()
  resultCount: number;

  @ApiProperty({ description: 'Vehicle has a written-off or stolen notification' })
  hasVehicleAlert: boolean;

  @ApiProperty({ description: 'Amount charged, in cents (incl. GST)' })
  feeCents: number;

  @ApiProperty({ enum: DataSource, enumName: 'DataSource' })
  source: DataSource;

  @ApiProperty()
  createdAt: Date;
}

export class SearchResultDto extends SearchDto {
  @ApiProperty({ type: String, format: 'date-time', description: 'Time the PPSR performed the search' })
  searchedAt: string;

  @ApiProperty({ type: [RegistrationSummaryDto] })
  registrations: RegistrationSummaryDto[];

  @ApiProperty({ type: VehicleDto, nullable: true })
  vehicle: VehicleDto | null;
}

export class SearchHistoryQuery {
  @ApiPropertyOptional({ description: 'Filter by criteria, PPSR search number, our reference or client reference' })
  @IsOptional()
  @IsString()
  q?: string;
}

export class DashboardSummaryDto {
  @ApiProperty()
  searchesThisMonth: number;

  @ApiProperty({ description: 'Total charged this month, in cents' })
  spendThisMonthCents: number;

  @ApiProperty({ description: 'Searches in the last 30 days that found at least one registration' })
  withInterests30Days: number;

  @ApiProperty({ description: 'Searches in the last 30 days with a written-off or stolen vehicle' })
  vehicleAlerts30Days: number;

  @ApiProperty({ type: [SearchDto] })
  recentSearches: SearchDto[];
}
