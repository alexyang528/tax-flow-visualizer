
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
      drivenBy: 'residence'
    },
    "FICA - Social Security": {
      parameters: [
        { id: 'ficaSSWage', name: 'YTD Social Security Wages', type: 'currency', readonly: true },
        { id: 'ficaSSRate', name: 'Current Rate', type: 'percentage', value: '6.2%', readonly: true },
        { id: 'ficaSSCap', name: 'Annual Cap', type: 'currency', value: '$160,200', readonly: true }
      ],
      drivenBy: 'residence, workplace, primary workplace'
    },
    "FICA - Medicare": {
      parameters: [
        { id: 'ficaMedWage', name: 'YTD Medicare Wages', type: 'currency', readonly: true },
        { id: 'ficaMedRate', name: 'Base Rate', type: 'percentage', value: '1.45%', readonly: true },
        { id: 'ficaMedAddlRate', name: 'Additional Rate', type: 'percentage', value: '0.9%', readonly: true },
        { id: 'ficaMedAddlThreshold', name: 'Additional Rate Threshold', type: 'currency', value: '$200,000', readonly: true }
      ],
      drivenBy: 'residence, workplace, primary workplace'
    },
    "FUTA": {
      parameters: [
        { id: 'futaWage', name: 'YTD FUTA Wages', type: 'currency', readonly: true },
        { id: 'futaRate', name: 'Rate', type: 'percentage', value: '0.6%', readonly: true },
        { id: 'futaCap', name: 'Annual Cap', type: 'currency', value: '$7,000', readonly: true }
      ],
      drivenBy: 'workplace'
    }
  },
  "California": {
    "CA Income Tax": {
      parameters: [
        { id: 'caFilingStatus', name: 'Filing Status', type: 'select', options: ['Single', 'Married', 'Head of Household'] },
        { id: 'caAllowances', name: 'Allowances', type: 'number' },
        { id: 'caAddlWithholding', name: 'Additional Withholding', type: 'currency' }
      ],
      drivenBy: 'residence'
    },
    "CA SDI": {
      parameters: [
        { id: 'caSDIWage', name: 'YTD SDI Wages', type: 'currency', readonly: true },
        { id: 'caSDIRate', name: 'Rate', type: 'percentage', value: '1.1%', readonly: true },
        { id: 'caSDICap', name: 'Annual Cap', type: 'currency', value: '$153,164', readonly: true }
      ],
      drivenBy: 'residence'
    },
    "CA SUI": {
      parameters: [
        { id: 'caSUIWage', name: 'YTD SUI Wages', type: 'currency', readonly: true },
        { id: 'caSUIRate', name: 'Rate', type: 'percentage', value: '3.4%', readonly: true },
        { id: 'caSUICap', name: 'Annual Cap', type: 'currency', value: '$7,000', readonly: true }
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
      drivenBy: 'residence'
    },
    "NY SDI": {
      parameters: [
        { id: 'nySDIRate', name: 'Weekly Rate', type: 'currency', value: '$0.50', readonly: true },
        { id: 'nySDICap', name: 'Annual Cap', type: 'currency', value: '$26.00', readonly: true }
      ],
      drivenBy: 'workplace'
    },
    "NY Paid Family Leave": {
      parameters: [
        { id: 'nyPFLWage', name: 'YTD PFL Wages', type: 'currency', readonly: true },
        { id: 'nyPFLRate', name: 'Rate', type: 'percentage', value: '0.455%', readonly: true },
        { id: 'nyPFLCap', name: 'Annual Cap', type: 'currency', value: '$82,654', readonly: true }
      ],
      drivenBy: 'workplace'
    }
  },
  "District of Columbia": {
    "DC Income Tax": {
      parameters: [
        { id: 'dcFilingStatus', name: 'Filing Status', type: 'select', options: ['Single', 'Married/Domestic Partner Filing Jointly', 'Head of Household'] },
        { id: 'dcAllowances', name: 'Allowances', type: 'number' },
        { id: 'dcAddlWithholding', name: 'Additional Withholding', type: 'currency' }
      ],
      drivenBy: 'residence'
    },
    "DC Paid Family Leave": {
      parameters: [
        { id: 'dcPFLWage', name: 'YTD PFL Wages', type: 'currency', readonly: true },
        { id: 'dcPFLRate', name: 'Rate', type: 'percentage', value: '0.62%', readonly: true }
      ],
      drivenBy: 'workplace'
    }
  },
  "New Jersey": {
    "NJ Income Tax": {
      parameters: [
        { id: 'njFilingStatus', name: 'Filing Status', type: 'select', options: ['Single', 'Married/Civil Union Filing Jointly', 'Head of Household'] },
        { id: 'njAllowances', name: 'Allowances', type: 'number' },
        { id: 'njAddlWithholding', name: 'Additional Withholding', type: 'currency' }
      ],
      drivenBy: 'residence'
    },
    "NJ Unemployment Insurance": {
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
      drivenBy: 'residence'
    },
    "NJ Family Leave Insurance": {
      parameters: [
        { id: 'njFLIWage', name: 'YTD FLI Wages', type: 'currency', readonly: true },
        { id: 'njFLIRate', name: 'Rate', type: 'percentage', value: '0.14%', readonly: true },
        { id: 'njFLICap', name: 'Annual Cap', type: 'currency', value: '$41,100', readonly: true }
      ],
      drivenBy: 'residence'
    }
  },
  "Virginia": {
    "VA Income Tax": {
      parameters: [
        { id: 'vaFilingStatus', name: 'Filing Status', type: 'select', options: ['Single', 'Married Filing Jointly', 'Head of Household'] },
        { id: 'vaExemptions', name: 'Exemptions', type: 'number' },
        { id: 'vaAddlWithholding', name: 'Additional Withholding', type: 'currency' }
      ],
      drivenBy: 'residence'
    }
  },
  "Connecticut": {
    "CT Income Tax": {
      parameters: [
        { id: 'ctFilingStatus', name: 'Filing Status', type: 'select', options: ['Single', 'Married Filing Jointly', 'Head of Household'] },
        { id: 'ctWithholdingCode', name: 'Withholding Code', type: 'select', options: ['A', 'B', 'C', 'D', 'E', 'F'] },
        { id: 'ctAddlWithholding', name: 'Additional Withholding', type: 'currency' }
      ],
      drivenBy: 'residence'
    }
  },
  "Maryland": {
    "MD Income Tax": {
      parameters: [
        { id: 'mdFilingStatus', name: 'Filing Status', type: 'select', options: ['Single', 'Married Filing Jointly', 'Head of Household'] },
        { id: 'mdExemptions', name: 'Exemptions', type: 'number' },
        { id: 'mdAddlWithholding', name: 'Additional Withholding', type: 'currency' }
      ],
      drivenBy: 'residence'
    }
  }
};
