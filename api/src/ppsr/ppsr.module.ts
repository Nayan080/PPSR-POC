import { Controller, Get, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/auth.decorators.js';
import { DataSource } from '../common/enums.js';
import { B2gPpsrGateway } from './b2g/b2g-ppsr.gateway.js';
import { MockPpsrGateway } from './mock/mock-ppsr.gateway.js';
import { PpsrGateway } from './ppsr-gateway.js';

export class PpsrStatusDto {
  @ApiProperty({ enum: DataSource, enumName: 'DataSource' })
  source: DataSource;

  @ApiProperty()
  connected: boolean;

  @ApiProperty()
  detail: string;
}

@ApiTags('PPSR')
@Controller('ppsr')
export class PpsrStatusController {
  constructor(private readonly gateway: PpsrGateway) {}

  @Public()
  @Get('status')
  @ApiOkResponse({ type: PpsrStatusDto })
  getPpsrStatus() {
    return this.gateway.status();
  }
}

@Global()
@Module({
  controllers: [PpsrStatusController],
  providers: [
    {
      provide: PpsrGateway,
      inject: [ConfigService],
      // PPSR_GATEWAY=mock (default) uses fixtures; PPSR_GATEWAY=b2g talks to AFSA.
      useFactory: (config: ConfigService) =>
        config.get('PPSR_GATEWAY', 'mock') === 'b2g' ? new B2gPpsrGateway(config) : new MockPpsrGateway(),
    },
  ],
  exports: [PpsrGateway],
})
export class PpsrModule {}
