import { Global, Module } from '@nestjs/common';
import { ConstantStore } from '../data/constant-store.js';
import { NumberingService } from './numbering.service.js';

@Global()
@Module({
  providers: [NumberingService, ConstantStore],
  exports: [NumberingService, ConstantStore],
})
export class CommonModule {}
