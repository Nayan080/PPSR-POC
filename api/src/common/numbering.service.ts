import { Injectable } from '@nestjs/common';

/** Issues our own identifiers from sequences so they are unique across calls. */
@Injectable()
export class NumberingService {
  private searchSeq = 1042;
  private customerSeq = 1000;

  /** Our order reference for a search, e.g. S-0001042. Distinct from the PPSR search number. */
  async searchReference(): Promise<string> {
    this.searchSeq += 1;
    return `S-${String(this.searchSeq).padStart(7, '0')}`;
  }

  async customerNumber(): Promise<string> {
    this.customerSeq += 1;
    return `C${String(this.customerSeq).padStart(7, '0')}`;
  }
}
