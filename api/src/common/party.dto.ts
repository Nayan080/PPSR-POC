import { ApiProperty } from '@nestjs/swagger';
import { OrganisationIdentifierType, PartyType } from './enums.js';

/** An organisation or individual as disclosed on the register. */
export class PartyDto {
  @ApiProperty({ enum: PartyType, enumName: 'PartyType' })
  partyType: PartyType;

  @ApiProperty({ type: String, nullable: true })
  organisationName: string | null;

  @ApiProperty({ enum: OrganisationIdentifierType, enumName: 'OrganisationIdentifierType', nullable: true })
  identifierType: OrganisationIdentifierType | null;

  @ApiProperty({ type: String, nullable: true })
  identifierNumber: string | null;

  @ApiProperty({ type: String, nullable: true })
  givenNames: string | null;

  @ApiProperty({ type: String, nullable: true })
  familyName: string | null;
}
