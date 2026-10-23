import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Search } from './search.entity.js';
import { DashboardController, SearchesController } from './searches.controller.js';
import { SearchesService } from './searches.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Search])],
  controllers: [SearchesController, DashboardController],
  providers: [SearchesService],
  exports: [SearchesService],
})
export class SearchesModule {}
