import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { DataSource, SearchType } from '../common/enums.js';
import type { RegistrationSummaryDto, VehicleDto } from './search.dto.js';

/**
 * A search a customer ordered through us. The PPSR response is stored as returned,
 * because a search certificate reflects the register at the time of search.
 */
@Entity('searches')
export class Search {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  reference: string;

  @Column({ type: 'varchar' })
  ppsrSearchNumber: string;

  @Index()
  @Column({ type: 'uuid' })
  accountId: string;

  @Column({ type: 'enum', enum: SearchType })
  searchType: SearchType;

  @Column({ type: 'jsonb' })
  criteria: Record<string, string>;

  @Column({ type: 'varchar' })
  criteriaSummary: string;

  @Column({ type: 'varchar', nullable: true })
  clientReference: string | null;

  @Column({ type: 'int' })
  resultCount: number;

  @Column({ type: 'boolean', default: false })
  hasVehicleAlert: boolean;

  @Column({ type: 'int' })
  feeCents: number;

  @Column({ type: 'enum', enum: DataSource })
  source: DataSource;

  @Column({ type: 'timestamptz' })
  searchedAt: Date;

  @Column({ type: 'jsonb' })
  registrations: RegistrationSummaryDto[];

  @Column({ type: 'jsonb', nullable: true })
  vehicle: VehicleDto | null;

  @Index()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
