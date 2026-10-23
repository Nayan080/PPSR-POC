export enum PartyType {
  Organisation = 'ORGANISATION',
  Individual = 'INDIVIDUAL',
}

export enum OrganisationIdentifierType {
  Abn = 'ABN',
  Acn = 'ACN',
  Arbn = 'ARBN',
  Arsn = 'ARSN',
}

export enum CollateralType {
  Consumer = 'CONSUMER',
  Commercial = 'COMMERCIAL',
}

export enum CollateralClass {
  MotorVehicle = 'MOTOR_VEHICLE',
  Watercraft = 'WATERCRAFT',
  Aircraft = 'AIRCRAFT',
  Agriculture = 'AGRICULTURE',
  OtherGoods = 'OTHER_GOODS',
  AllPap = 'ALL_PAP',
  AllPapExcept = 'ALL_PAP_EXCEPT',
  Account = 'ACCOUNT',
  InvestmentInstrument = 'INVESTMENT_INSTRUMENT',
  IntellectualProperty = 'INTELLECTUAL_PROPERTY',
}

export enum SerialNumberType {
  Vin = 'VIN',
  ChassisNumber = 'CHASSIS_NUMBER',
  ManufacturersNumber = 'MANUFACTURERS_NUMBER',
  HullIdentificationNumber = 'HIN',
  OfficialNumber = 'OFFICIAL_NUMBER',
  AircraftSerial = 'AIRCRAFT_SERIAL',
}

export enum SearchType {
  SerialNumber = 'SERIAL_NUMBER',
  OrganisationGrantor = 'ORGANISATION_GRANTOR',
  RegistrationNumber = 'REGISTRATION_NUMBER',
}

/** Where a search result came from. MOCK is the built-in fixture register used before B2G access. */
export enum DataSource {
  Mock = 'MOCK',
  B2g = 'B2G',
}

export const COLLATERAL_CLASS_LABELS: Record<CollateralClass, string> = {
  [CollateralClass.MotorVehicle]: 'Motor vehicle',
  [CollateralClass.Watercraft]: 'Watercraft',
  [CollateralClass.Aircraft]: 'Aircraft',
  [CollateralClass.Agriculture]: 'Agriculture',
  [CollateralClass.OtherGoods]: 'Other goods',
  [CollateralClass.AllPap]: 'All present and after-acquired property – no exceptions',
  [CollateralClass.AllPapExcept]: 'All present and after-acquired property – with exceptions',
  [CollateralClass.Account]: 'Account',
  [CollateralClass.InvestmentInstrument]: 'Investment instrument',
  [CollateralClass.IntellectualProperty]: 'Intellectual property',
};

export const SERIAL_TYPE_LABELS: Record<SerialNumberType, string> = {
  [SerialNumberType.Vin]: 'Vehicle identification number (VIN)',
  [SerialNumberType.ChassisNumber]: 'Chassis number',
  [SerialNumberType.ManufacturersNumber]: "Motor vehicle manufacturer's number",
  [SerialNumberType.HullIdentificationNumber]: 'Hull identification number (HIN)',
  [SerialNumberType.OfficialNumber]: 'Official number',
  [SerialNumberType.AircraftSerial]: 'Aircraft serial number',
};

export function normaliseSerial(value: string) {
  return value.replace(/[\s-]/g, '').toUpperCase();
}
