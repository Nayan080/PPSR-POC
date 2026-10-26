import { Module } from '@nestjs/common';
import { DashboardController, SearchesController } from './searches.controller.js';
import { SearchesService } from './searches.service.js';

@Module({
  controllers: [SearchesController, DashboardController],
  providers: [SearchesService],
  exports: [SearchesService],
})
export class SearchesModule {}
