import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module.js';
import { CommonModule } from './common/common.module.js';
import { PpsrModule } from './ppsr/ppsr.module.js';
import { ReferenceController } from './reference/reference.controller.js';
import { SearchesModule } from './searches/searches.module.js';
import { SeedService } from './seed/seed.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    CommonModule,
    AuthModule,
    PpsrModule,
    SearchesModule,
  ],
  controllers: [ReferenceController],
  providers: [SeedService],
})
export class AppModule {}
