import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import type { Account } from '../auth/account.entity.js';
import type { Search } from '../searches/search.entity.js';

export const DEMO_ACCOUNT_CREDENTIALS = {
  email: 'demo@ppsr.test',
  password: 'Password123!',
};

const DEMO_ACCOUNT_ID = 'a0000000-0000-0000-0000-000000000001';

@Injectable()
export class ConstantStore {
  private accounts: Map<string, Account> = new Map();
  private searches: Search[] = [];

  constructor() {
    this.initDefaultAccount();
  }

  private initDefaultAccount() {
    // Demo account pre-seeded
    const demoAccount: Account = {
      id: DEMO_ACCOUNT_ID,
      customerNumber: 'C0001000',
      email: DEMO_ACCOUNT_CREDENTIALS.email,
      passwordHash: bcrypt.hashSync(DEMO_ACCOUNT_CREDENTIALS.password, 10),
      givenName: 'Alex',
      familyName: 'Morgan',
      organisationName: 'Morgan Motors Pty Ltd',
      createdAt: new Date(),
    };
    this.accounts.set(demoAccount.id, demoAccount);
  }

  // --- Accounts ---
  findAccountByEmail(email: string): Account | undefined {
    const lower = email.toLowerCase();
    for (const acc of this.accounts.values()) {
      if (acc.email.toLowerCase() === lower) return acc;
    }
    return undefined;
  }

  findAccountById(id: string): Account | undefined {
    return this.accounts.get(id);
  }

  addAccount(account: Account): Account {
    this.accounts.set(account.id, account);
    return account;
  }

  accountCount(): number {
    return this.accounts.size;
  }

  // --- Searches ---
  addSearch(search: Search): Search {
    this.searches.unshift(search); // newer first
    return search;
  }

  getSearch(id: string, accountId: string): Search | undefined {
    return this.searches.find((s) => s.id === id && s.accountId === accountId);
  }

  listSearches(accountId: string, term?: string): Search[] {
    let list = this.searches.filter((s) => s.accountId === accountId);
    if (term) {
      const lower = term.toLowerCase();
      list = list.filter(
        (s) =>
          s.criteriaSummary.toLowerCase().includes(lower) ||
          s.ppsrSearchNumber.toLowerCase().includes(lower) ||
          s.reference.toLowerCase().includes(lower) ||
          (s.clientReference && s.clientReference.toLowerCase().includes(lower)),
      );
    }
    return list.slice(0, 100);
  }

  getDashboardStats(accountId: string) {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const userSearches = this.searches.filter((s) => s.accountId === accountId);

    const thisMonth = userSearches.filter((s) => new Date(s.createdAt) >= monthStart);
    const searchesThisMonth = thisMonth.length;
    const spendThisMonthCents = thisMonth.reduce((acc, s) => acc + (s.feeCents || 0), 0);

    const recent30Days = userSearches.filter((s) => new Date(s.createdAt) >= thirtyDaysAgo);
    const withInterests30Days = recent30Days.filter((s) => s.resultCount > 0).length;
    const vehicleAlerts30Days = recent30Days.filter((s) => s.hasVehicleAlert).length;

    const recentSearches = userSearches.slice(0, 6);

    return {
      searchesThisMonth,
      spendThisMonthCents,
      withInterests30Days,
      vehicleAlerts30Days,
      recentSearches,
    };
  }
}
