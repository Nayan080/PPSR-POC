import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/auth.decorators.js';
import { COLLATERAL_CLASS_LABELS, CollateralClass, SERIAL_TYPE_LABELS, SerialNumberType } from '../common/enums.js';

export class SerialNumberTypeOptionDto {
  @ApiProperty({ enum: SerialNumberType, enumName: 'SerialNumberType' })
  value: SerialNumberType;

  @ApiProperty()
  label: string;
}

export class CollateralClassOptionDto {
  @ApiProperty({ enum: CollateralClass, enumName: 'CollateralClass' })
  value: CollateralClass;

  @ApiProperty()
  label: string;
}

export class ReferenceDataDto {
  @ApiProperty({ type: [CollateralClassOptionDto] })
  collateralClasses: CollateralClassOptionDto[];

  @ApiProperty({ type: [SerialNumberTypeOptionDto] })
  serialNumberTypes: SerialNumberTypeOptionDto[];
}

@ApiTags('Reference')
@Controller('reference')
export class ReferenceController {
  @Public()
  @Get()
  @ApiOkResponse({ type: ReferenceDataDto })
  getReferenceData(): ReferenceDataDto {
    return {
      collateralClasses: Object.values(CollateralClass).map((value) => ({
        value,
        label: COLLATERAL_CLASS_LABELS[value],
      })),
      serialNumberTypes: Object.values(SerialNumberType).map((value) => ({ value, label: SERIAL_TYPE_LABELS[value] })),
    };
  }
}
