import { TaxData } from "@/types/payroll-tax-types";

export const taxData: TaxData = {
  "Federal": {
    "Federal Income Tax": {
      parameters: [
        { id: 'w4Filing', name: 'Filing Status', type: 'select', options: ['Single', 'Married Filing Jointly', 'Head of Household'] },
        { id: 'w4Dependents', name: 'Number of Dependents', type: 'number' },
        { id: 'w4OtherIncome', name: 'Other Income', type: 'currency' },
        { id: 'w4Deductions', name: 'Deductions', type: 'currency' },
        { id: 'w4ExtraWithholding', name: 'Extra Withholding', type: 'currency' }
      ],
      drivenBy: null
    },
    "FICA - Social Security": {
      parameters: [
        { id: 'ficaSSWage', name: 'YTD Social Security Wages', type: 'currency', readonly: true },
        { id: 'ficaSSRate', name: 'Current Rate', type: 'percentage', value: '6.2%', readonly: true },
        { id: 'ficaSSCap', name: 'Annual Cap', type: 'currency', value: '$160,200', readonly: true }
      ],
      drivenBy: null
    },
    "FICA - Medicare": {
      parameters: [
        { id: 'ficaMedWage', name: 'YTD Medicare Wages', type: 'currency', readonly: true },
        { id: 'ficaMedRate', name: 'Base Rate', type: 'percentage', value: '1.45%', readonly: true },
        { id: 'ficaMedAddlRate', name: 'Additional Rate', type: 'percentage', value: '0.9%', readonly: true },
        { id: 'ficaMedAddlThreshold', name: 'Additional Rate Threshold', type: 'currency', value: '$200,000', readonly: true }
      ],
      drivenBy: null
    },
    "FUTA": {
      parameters: [
        { id: 'futaWage', name: 'YTD FUTA Wages', type: 'currency', readonly: true },
        { id: 'futaRate', name: 'Rate', type: 'percentage', value: '0.6%', readonly: true },
        { id: 'futaCap', name: 'Annual Cap', type: 'currency', value: '$7,000', readonly: true }
      ],
      drivenBy: null
    }
  },
  "California": {
    "CA Income Tax": {
      parameters: [
        { id: 'caFilingStatus', name: 'Filing Status', type: 'select', options: ['Single', 'Married', 'Head of Household'] },
        { id: 'caAllowances', name: 'Allowances', type: 'number' },
        { id: 'caAddlWithholding', name: 'Additional Withholding', type: 'currency' }
      ],
      drivenBy: 'residence, workplace'
    },
    "CA SDI": {
      parameters: [
        { id: 'caSDIWage', name: 'YTD SDI Wages', type: 'currency', readonly: true },
        { id: 'caSDIRate', name: 'Rate', type: 'percentage', value: '1.1%', readonly: true },
        { id: 'caSDICap', name: 'Annual Cap', type: 'currency', value: '$153,164', readonly: true }
      ],
      drivenBy: 'primary workplace'
    },
    "CA State Unemployment Insurance Tax": {
      parameters: [
        { id: 'caSUIWage', name: 'YTD SUI Wages', type: 'currency', readonly: true },
        { id: 'caSUIRate', name: 'Rate', type: 'percentage', value: '3.4%', readonly: true },
        { id: 'caSUICap', name: 'Annual Cap', type: 'currency', value: '$7,000', readonly: true }
      ],
      drivenBy: 'primary workplace'
    },
    "California Employment Training Tax": {
      parameters: [
        { id: 'caETTWage', name: 'YTD ETT Wages', type: 'currency', readonly: true },
        { id: 'caETTRate', name: 'Rate', type: 'percentage', value: '0.1%', readonly: true },
        { id: 'caETTCap', name: 'Annual Cap', type: 'currency', value: '$7,000', readonly: true }
      ],
      drivenBy: 'primary workplace'
    }
  },
  "New York": {
    "NY Income Tax": {
      parameters: [
        { id: 'nyFilingStatus', name: 'Filing Status', type: 'select', options: ['Single', 'Married Filing Jointly', 'Head of Household'] },
        { id: 'nyAllowances', name: 'Allowances', type: 'number' },
        { id: 'nyAddlWithholding', name: 'Additional Withholding', type: 'currency' }
      ],
      drivenBy: 'residence, workplace'
    },
    "NY City Tax": {
      parameters: [
        { id: 'nycFilingStatus', name: 'Filing Status', type: 'select', options: ['Single', 'Married Filing Jointly', 'Head of Household'] },
        { id: 'nycAllowances', name: 'Allowances', type: 'number' },
        { id: 'nycAddlWithholding', name: 'Additional Withholding', type: 'currency' }
      ],
      drivenBy: 'residence'
    },
    "New York State Unemployment Insurance Tax": {
      parameters: [
        { id: 'nySUIWage', name: 'YTD SUI Wages', type: 'currency', readonly: true },
        { id: 'nySUIRate', name: 'Rate', type: 'percentage', value: '2.1%', readonly: true },
        { id: 'nySUICap', name: 'Annual Cap', type: 'currency', value: '$12,000', readonly: true }
      ],
      drivenBy: 'primary workplace'
    },
    "NY Reemployment Fund": {
      parameters: [
        { id: 'nyREFWage', name: 'YTD REF Wages', type: 'currency', readonly: true },
        { id: 'nyREFRate', name: 'Rate', type: 'percentage', value: '0.075%', readonly: true },
        { id: 'nyREFCap', name: 'Annual Cap', type: 'currency', value: '$12,000', readonly: true }
      ],
      drivenBy: 'primary workplace'
    },
    "NY Paid Family Leave": {
      parameters: [
        { id: 'nyPFLWage', name: 'YTD PFL Wages', type: 'currency', readonly: true },
        { id: 'nyPFLRate', name: 'Rate', type: 'percentage', value: '0.455%', readonly: true },
        { id: 'nyPFLCap', name: 'Annual Cap', type: 'currency', value: '$82,654', readonly: true }
      ],
      drivenBy: 'primary workplace'
    },
    "NY SDI": {
      parameters: [
        { id: 'nySDIRate', name: 'Weekly Rate', type: 'currency', value: '$0.50', readonly: true },
        { id: 'nySDICap', name: 'Annual Cap', type: 'currency', value: '$26.00', readonly: true }
      ],
      drivenBy: 'primary workplace'
    }
  },
  "District of Columbia": {
    "DC Income Tax": {
      parameters: [
        { id: 'dcFilingStatus', name: 'Filing Status', type: 'select', options: ['Single', 'Married/Domestic Partner Filing Jointly', 'Head of Household'] },
        { id: 'dcAllowances', name: 'Allowances', type: 'number' },
        { id: 'dcAddlWithholding', name: 'Additional Withholding', type: 'currency' }
      ],
      drivenBy: 'residence, workplace'
    },
    "DC Paid Family Leave": {
      parameters: [
        { id: 'dcPFLWage', name: 'YTD PFL Wages', type: 'currency', readonly: true },
        { id: 'dcPFLRate', name: 'Rate', type: 'percentage', value: '0.62%', readonly: true }
      ],
      drivenBy: 'primary workplace'
    },
    "District of Columbia State Unemployment Insurance Tax": {
      parameters: [
        { id: 'dcSUIWage', name: 'YTD SUI Wages', type: 'currency', readonly: true },
        { id: 'dcSUIRate', name: 'Rate', type: 'percentage', value: '2.7%', readonly: true },
        { id: 'dcSUICap', name: 'Annual Cap', type: 'currency', value: '$9,000', readonly: true }
      ],
      drivenBy: 'primary workplace'
    },
    "DC Administrative Funding Tax": {
      parameters: [
        { id: 'dcAFTWage', name: 'YTD AFT Wages', type: 'currency', readonly: true },
        { id: 'dcAFTRate', name: 'Rate', type: 'percentage', value: '0.2%', readonly: true },
        { id: 'dcAFTCap', name: 'Annual Cap', type: 'currency', value: '$9,000', readonly: true }
      ],
      drivenBy: 'primary workplace'
    }
  },
  "New Jersey": {
    "NJ Income Tax": {
      parameters: [
        { id: 'njFilingStatus', name: 'Filing Status', type: 'select', options: ['Single', 'Married/Civil Union Filing Jointly', 'Head of Household'] },
        { id: 'njAllowances', name: 'Allowances', type: 'number' },
        { id: 'njAddlWithholding', name: 'Additional Withholding', type: 'currency' }
      ],
      drivenBy: 'residence, workplace'
    },
    "New Jersey State Unemployment Insurance Tax": {
      parameters: [
        { id: 'njUIWage', name: 'YTD UI Wages', type: 'currency', readonly: true },
        { id: 'njUIRate', name: 'Rate', type: 'percentage', value: '0.3825%', readonly: true },
        { id: 'njUICap', name: 'Annual Cap', type: 'currency', value: '$41,100', readonly: true }
      ],
      drivenBy: 'primary workplace'
    },
    "NJ Disability Insurance": {
      parameters: [
        { id: 'njDIWage', name: 'YTD DI Wages', type: 'currency', readonly: true },
        { id: 'njDIRate', name: 'Rate', type: 'percentage', value: '0.16%', readonly: true },
        { id: 'njDICap', name: 'Annual Cap', type: 'currency', value: '$41,100', readonly: true }
      ],
      drivenBy: 'primary workplace'
    },
    "NJ Family Leave Insurance": {
      parameters: [
        { id: 'njFLIWage', name: 'YTD FLI Wages', type: 'currency', readonly: true },
        { id: 'njFLIRate', name: 'Rate', type: 'percentage', value: '0.14%', readonly: true },
        { id: 'njFLICap', name: 'Annual Cap', type: 'currency', value: '$41,100', readonly: true }
      ],
      drivenBy: 'primary workplace'
    }
  },
  "Virginia": {
    "VA Income Tax": {
      parameters: [
        { id: 'vaFilingStatus', name: 'Filing Status', type: 'select', options: ['Single', 'Married Filing Jointly', 'Head of Household'] },
        { id: 'vaExemptions', name: 'Exemptions', type: 'number' },
        { id: 'vaAddlWithholding', name: 'Additional Withholding', type: 'currency' }
      ],
      drivenBy: 'residence, workplace'
    },
    "Virginia State Unemployment Insurance Tax": {
      parameters: [
        { id: 'vaSUIWage', name: 'YTD SUI Wages', type: 'currency', readonly: true },
        { id: 'vaSUIRate', name: 'Rate', type: 'percentage', value: '2.5%', readonly: true },
        { id: 'vaSUICap', name: 'Annual Cap', type: 'currency', value: '$8,000', readonly: true }
      ],
      drivenBy: 'primary workplace'
    }
  },
  "Connecticut": {
    "CT Income Tax": {
      parameters: [
        { id: 'ctFilingStatus', name: 'Filing Status', type: 'select', options: ['Single', 'Married Filing Jointly', 'Head of Household'] },
        { id: 'ctWithholdingCode', name: 'Withholding Code', type: 'select', options: ['A', 'B', 'C', 'D', 'E', 'F'] },
        { id: 'ctAddlWithholding', name: 'Additional Withholding', type: 'currency' }
      ],
      drivenBy: 'residence, workplace'
    },
    "Connecticut State Unemployment Insurance Tax": {
      parameters: [
        { id: 'ctSUIWage', name: 'YTD SUI Wages', type: 'currency', readonly: true },
        { id: 'ctSUIRate', name: 'Rate', type: 'percentage', value: '3.0%', readonly: true },
        { id: 'ctSUICap', name: 'Annual Cap', type: 'currency', value: '$15,000', readonly: true }
      ],
      drivenBy: 'primary workplace'
    },
    "Connecticut Paid Leave": {
      parameters: [
        { id: 'ctPLWage', name: 'YTD PL Wages', type: 'currency', readonly: true },
        { id: 'ctPLRate', name: 'Rate', type: 'percentage', value: '0.5%', readonly: true },
        { id: 'ctPLCap', name: 'Annual Cap', type: 'currency', value: '$150,000', readonly: true }
      ],
      drivenBy: 'primary workplace'
    }
  },
  "Maryland": {
    "MD Income Tax": {
      parameters: [
        { id: 'mdFilingStatus', name: 'Filing Status', type: 'select', options: ['Single', 'Married Filing Jointly', 'Head of Household'] },
        { id: 'mdExemptions', name: 'Exemptions', type: 'number' },
        { id: 'mdAddlWithholding', name: 'Additional Withholding', type: 'currency' }
      ],
      drivenBy: 'residence, workplace'
    },
    "Maryland State Unemployment Insurance Tax": {
      parameters: [
        { id: 'mdSUIWage', name: 'YTD SUI Wages', type: 'currency', readonly: true },
        { id: 'mdSUIRate', name: 'Rate', type: 'percentage', value: '2.6%', readonly: true },
        { id: 'mdSUICap', name: 'Annual Cap', type: 'currency', value: '$8,500', readonly: true }
      ],
      drivenBy: 'primary workplace'
    }
  }
};
