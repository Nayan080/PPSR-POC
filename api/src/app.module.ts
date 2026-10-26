import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './auth/account.entity.js';
import { AuthModule } from './auth/auth.module.js';
import { CommonModule } from './common/common.module.js';
import { PpsrModule } from './ppsr/ppsr.module.js';
import { ReferenceController } from './reference/reference.controller.js';
import { SearchesModule } from './searches/searches.module.js';
import { SeedService } from './seed/seed.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL', 'postgres://ppsr:ppsr@localhost:5433/ppsr'),
        autoLoadEntities: true,
        // Schema is derived from entities for the PoC; switch to migrations before production.
        synchronize: config.get('DB_SYNCHRONIZE', 'true') === 'true',
      }),
    }),
    TypeOrmModule.forFeature([Account]),
    CommonModule,
    AuthModule,
    PpsrModule,
    SearchesModule,
  ],
  controllers: [ReferenceController],
  providers: [SeedService],
})
export class AppModule {}
