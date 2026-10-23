import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { normaliseSerial, SERIAL_TYPE_LABELS, SearchType } from '../common/enums.js';
import { NumberingService } from '../common/numbering.service.js';
import { PpsrGateway, type PpsrSearchOutcome } from '../ppsr/ppsr-gateway.js';
import type {
  DashboardSummaryDto,
  OrganisationGrantorSearchInput,
  RegistrationNumberSearchInput,
  SearchDto,
  SearchResultDto,
  SerialNumberSearchInput,
} from './search.dto.js';
import { Search } from './search.entity.js';

const DAY_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class SearchesService {
  private readonly feeCents: number;

  constructor(
    @InjectRepository(Search) private readonly searches: Repository<Search>,
    private readonly gateway: PpsrGateway,
    private readonly numbering: NumberingService,
    config: ConfigService,
  ) {
    this.feeCents = Number(config.get('SEARCH_FEE_CENTS', 400));
  }

  bySerialNumber(accountId: string, input: SerialNumberSearchInput) {
    const serialNumber = normaliseSerial(input.serialNumber);
    return this.run(accountId, {
      searchType: SearchType.SerialNumber,
      criteria: { serialNumberType: input.serialNumberType, serialNumber },
      criteriaSummary: `${SERIAL_TYPE_LABELS[input.serialNumberType]}: ${serialNumber}`,
      clientReference: input.clientReference,
      call: () => this.gateway.searchBySerialNumber(input.serialNumberType, serialNumber),
    });
  }

  byOrganisationGrantor(accountId: string, input: OrganisationGrantorSearchInput) {
    return this.run(accountId, {
      searchType: SearchType.OrganisationGrantor,
      criteria: { identifierType: input.identifierType, identifierNumber: input.identifierNumber },
      criteriaSummary: `${input.identifierType}: ${input.identifierNumber}`,
      clientReference: input.clientReference,
      call: () => this.gateway.searchByOrganisationGrantor(input.identifierType, input.identifierNumber),
    });
  }

  byRegistrationNumber(accountId: string, input: RegistrationNumberSearchInput) {
    return this.run(accountId, {
      searchType: SearchType.RegistrationNumber,
      criteria: { registrationNumber: input.registrationNumber },
      criteriaSummary: `Registration number: ${input.registrationNumber}`,
      clientReference: input.clientReference,
      call: () => this.gateway.searchByRegistrationNumber(input.registrationNumber),
    });
  }

  async history(accountId: string, q?: string): Promise<SearchDto[]> {
    const qb = this.searches.createQueryBuilder('s').where('s.accountId = :accountId', { accountId });
    const term = q?.trim();
    if (term) {
      qb.andWhere(
        new Brackets((w) => {
          for (const column of ['criteriaSummary', 'ppsrSearchNumber', 'reference', 'clientReference']) {
            w.orWhere(`s.${column} ILIKE :term`, { term: `%${term}%` });
          }
        }),
      );
    }
    const rows = await qb.orderBy('s.createdAt', 'DESC').take(100).getMany();
    return rows.map(toSearchDto);
  }

  async get(accountId: string, id: string): Promise<SearchResultDto> {
    const search = await this.searches.findOneBy({ id, accountId });
    if (!search) throw new NotFoundException('Search not found.');
    return toResultDto(search);
  }

  async dashboard(accountId: string): Promise<DashboardSummaryDto> {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const since = new Date(now.getTime() - 30 * DAY_MS);
    const base = () => this.searches.createQueryBuilder('s').where('s.accountId = :accountId', { accountId });

    const [month, withInterests, alerts, recent] = await Promise.all([
      base()
        .select('COUNT(*)', 'count')
        .addSelect('COALESCE(SUM(s.feeCents), 0)', 'spend')
        .andWhere('s.createdAt >= :monthStart', { monthStart })
        .getRawOne<{ count: string; spend: string }>(),
      base().andWhere('s.createdAt >= :since AND s.resultCount > 0', { since }).getCount(),
      base().andWhere('s.createdAt >= :since AND s.hasVehicleAlert', { since }).getCount(),
      base().orderBy('s.createdAt', 'DESC').take(6).getMany(),
    ]);

    return {
      searchesThisMonth: Number(month?.count ?? 0),
      spendThisMonthCents: Number(month?.spend ?? 0),
      withInterests30Days: withInterests,
      vehicleAlerts30Days: alerts,
      recentSearches: recent.map(toSearchDto),
    };
  }

  private async run(
    accountId: string,
    order: {
      searchType: SearchType;
      criteria: Record<string, string>;
      criteriaSummary: string;
      clientReference?: string;
      call: () => Promise<PpsrSearchOutcome>;
    },
  ): Promise<SearchResultDto> {
    // Call the register first: a failed PPSR call must not create a (chargeable) search record.
    const outcome = await order.call();
    const vehicle = outcome.vehicle;

    const search = await this.searches.save(
      this.searches.create({
        accountId,
        reference: await this.numbering.searchReference(),
        ppsrSearchNumber: outcome.ppsrSearchNumber,
        searchType: order.searchType,
        criteria: order.criteria,
        criteriaSummary: order.criteriaSummary,
        clientReference: order.clientReference?.trim() || null,
        resultCount: outcome.registrations.length,
        hasVehicleAlert: Boolean(vehicle && (vehicle.writtenOff.length || vehicle.stolen.length)),
        feeCents: this.feeCents,
        source: this.gateway.source,
        searchedAt: new Date(outcome.searchedAt),
        registrations: outcome.registrations,
        vehicle,
      }),
    );
    return toResultDto(search);
  }
}

function toSearchDto(s: Search): SearchDto {
  return {
    id: s.id,
    reference: s.reference,
    ppsrSearchNumber: s.ppsrSearchNumber,
    searchType: s.searchType,
    criteriaSummary: s.criteriaSummary,
    clientReference: s.clientReference,
    resultCount: s.resultCount,
    hasVehicleAlert: s.hasVehicleAlert,
    feeCents: s.feeCents,
    source: s.source,
    createdAt: s.createdAt,
  };
}

function toResultDto(s: Search): SearchResultDto {
  return {
    ...toSearchDto(s),
    searchedAt: s.searchedAt.toISOString(),
    registrations: s.registrations,
    vehicle: s.vehicle,
  };
}
