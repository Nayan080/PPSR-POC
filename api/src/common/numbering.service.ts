import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

const SEQUENCES = ['search_ref_seq', 'customer_seq'];

/** Issues our own identifiers from PostgreSQL sequences so they are unique across instances. */
@Injectable()
export class NumberingService implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    for (const name of SEQUENCES) {
      await this.dataSource.query(`CREATE SEQUENCE IF NOT EXISTS ${name} START 1000`);
    }
  }

  private async next(sequence: string): Promise<number> {
    const [row] = await this.dataSource.query(`SELECT nextval('${sequence}') AS value`);
    return Number(row.value);
  }

  /** Our order reference for a search, e.g. S-0001042. Distinct from the PPSR search number. */
  async searchReference(): Promise<string> {
    return `S-${String(await this.next('search_ref_seq')).padStart(7, '0')}`;
  }

  async customerNumber(): Promise<string> {
    return `C${String(await this.next('customer_seq')).padStart(7, '0')}`;
  }
}
