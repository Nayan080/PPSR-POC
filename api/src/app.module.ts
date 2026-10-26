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
      useFactory: (config: ConfigService) => {
        const rawDbUrl = config.get<string>('DATABASE_URL');
        const dbUrl = rawDbUrl || 'postgres://ppsr:ppsr@localhost:5433/ppsr';
        const isSsl = config.get('DATABASE_SSL') === 'true' || dbUrl.includes('sslmode=');

        try {
          const parsed = new URL(dbUrl);
          console.log(
            `[TypeORM] Connecting to DB host: ${parsed.host}, database: ${parsed.pathname.slice(1)}, ssl: ${Boolean(isSsl)} (DATABASE_URL env set: ${Boolean(rawDbUrl)})`,
          );
        } catch {
          console.log(`[TypeORM] Using DB url (DATABASE_URL env set: ${Boolean(rawDbUrl)})`);
        }

        return {
          type: 'postgres',
          url: dbUrl,
          ssl: isSsl ? { rejectUnauthorized: false } : false,
          autoLoadEntities: true,
          // Schema is derived from entities for the PoC; switch to migrations before production.
          synchronize: config.get('DB_SYNCHRONIZE', 'true') === 'true',
        };
      },
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
