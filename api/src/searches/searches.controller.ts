import { Body, Controller, Get, HttpCode, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiServiceUnavailableResponse, ApiTags } from '@nestjs/swagger';
import { type AuthUser, CurrentUser } from '../auth/auth.decorators.js';
import {
  DashboardSummaryDto,
  OrganisationGrantorSearchInput,
  RegistrationNumberSearchInput,
  SearchDto,
  SearchHistoryQuery,
  SearchResultDto,
  SerialNumberSearchInput,
} from './search.dto.js';
import { SearchesService } from './searches.service.js';

@ApiTags('Searches')
@ApiBearerAuth()
@ApiServiceUnavailableResponse({ description: 'The PPSR could not be reached' })
@Controller('searches')
export class SearchesController {
  constructor(private readonly service: SearchesService) {}

  @Post('serial-number')
  @HttpCode(200)
  @ApiOkResponse({ type: SearchResultDto })
  searchBySerialNumber(@CurrentUser() user: AuthUser, @Body() input: SerialNumberSearchInput) {
    return this.service.bySerialNumber(user.accountId, input);
  }

  @Post('organisation-grantor')
  @HttpCode(200)
  @ApiOkResponse({ type: SearchResultDto })
  searchByOrganisationGrantor(@CurrentUser() user: AuthUser, @Body() input: OrganisationGrantorSearchInput) {
    return this.service.byOrganisationGrantor(user.accountId, input);
  }

  @Post('registration-number')
  @HttpCode(200)
  @ApiOkResponse({ type: SearchResultDto })
  searchByRegistrationNumber(@CurrentUser() user: AuthUser, @Body() input: RegistrationNumberSearchInput) {
    return this.service.byRegistrationNumber(user.accountId, input);
  }

  @Get()
  @ApiOkResponse({ type: [SearchDto] })
  listSearches(@CurrentUser() user: AuthUser, @Query() query: SearchHistoryQuery) {
    return this.service.history(user.accountId, query.q);
  }

  @Get(':id')
  @ApiOkResponse({ type: SearchResultDto })
  getSearch(@CurrentUser() user: AuthUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.service.get(user.accountId, id);
  }
}

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly service: SearchesService) {}

  @Get()
  @ApiOkResponse({ type: DashboardSummaryDto })
  getDashboardSummary(@CurrentUser() user: AuthUser) {
    return this.service.dashboard(user.accountId);
  }
}
