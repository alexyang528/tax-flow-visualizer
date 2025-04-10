
export interface TaxParameter {
  id: string;
  name: string;
  type: 'select' | 'number' | 'currency' | 'percentage';
  options?: string[];
  value?: string;
  readonly?: boolean;
}

export interface TaxConfig {
  parameters: TaxParameter[];
  drivenBy: 'workplace' | 'residence' | 'primary workplace' | 'residence, workplace' | 'workplace, primary workplace' | 'residence, primary workplace' | 'residence, workplace, primary workplace';
}

export interface JurisdictionTaxes {
  [taxName: string]: TaxConfig;
}

export interface TaxData {
  [jurisdiction: string]: JurisdictionTaxes;
}

export interface Workplace {
  id: string;
  name: string;
}

export interface EmployeeResidence {
  state: string;
  address: string;
}

export interface Employee {
  id: string;
  name: string;
  workplaces: string[];
  primaryWorkplace: string;
  residence: EmployeeResidence;
}

export interface ExemptedTaxes {
  [jurisdiction: string]: string[];
}

export interface ExpandedState {
  [taxName: string]: boolean;
}

export type ViewType = 'company' | 'employee';
