import { taxData } from "@/data/tax-data";
import { ViewType } from "@/types/payroll-tax-types";
import { employees, workplaces } from "@/data/employee-data";

export const getFilteredJurisdictions = (
  viewType: ViewType,
  selectedWorkplace: string,
  selectedEmployee: string
) => {
  if (viewType === 'company') {
    if (selectedWorkplace === 'all') {
      const jurisdictions = Object.keys(taxData);
      return ['Federal', ...jurisdictions.filter(j => j !== 'Federal')];
    }
    
    switch (selectedWorkplace) {
      case 'hq':
        return ['Federal', 'New York'];
      case 'branch-ca':
        return ['Federal', 'California'];
      case 'remote-dc':
        return ['Federal', 'District of Columbia'];
      default:
        return Object.keys(taxData);
    }
  }
  
  else {
    const employee = employees.find(emp => emp.id === selectedEmployee);
    if (!employee) return [];
    
    const applicableWorkplaces: string[] = [];
    
    if (employee.workplaces) {
      employee.workplaces.forEach(wp => {
        if (selectedWorkplace === 'all' || selectedWorkplace === wp) {
          applicableWorkplaces.push(wp);
        }
      });
    }
    
    let federalJurisdiction: string[] = ['Federal'];
    let residenceJurisdiction: string[] = [];
    let primaryJurisdictions: string[] = [];
    let otherJurisdictions: string[] = [];
    
    const residenceState = employee.residence?.state;
    
    let primaryWorkplaceState: string | null = null;
    const primaryWorkplace = employee.primaryWorkplace;
    
    // Always include the primary workplace state regardless of the selected workplace filter
    switch (primaryWorkplace) {
      case 'hq':
        primaryWorkplaceState = 'New York';
        break;
      case 'branch-ca':
        primaryWorkplaceState = 'California';
        break;
      case 'remote-dc':
        primaryWorkplaceState = 'District of Columbia';
        break;
    }
    
    const stateJurisdictions = new Set<string>();
    
    // Always include residence state
    if (residenceState && taxData[residenceState]) {
      if (residenceState === primaryWorkplaceState) {
        residenceJurisdiction.push(`${residenceState} (Residence, Primary Workplace)`);
      } else {
        residenceJurisdiction.push(`${residenceState} (Residence)`);
      }
      stateJurisdictions.add(residenceState);
    }
    
    // Always include primary workplace state
    if (primaryWorkplaceState && !stateJurisdictions.has(primaryWorkplaceState)) {
      primaryJurisdictions.push(`${primaryWorkplaceState} (Primary Workplace)`);
      stateJurisdictions.add(primaryWorkplaceState);
    }
    
    // Only include other workplaces if they match the selectedWorkplace filter
    if (selectedWorkplace === 'all' || selectedWorkplace === primaryWorkplace) {
      // Primary workplace already included above
    } else {
      // Add workplaces that match the filter
      let workplaceState: string | null = null;
      
      switch (selectedWorkplace) {
        case 'hq':
          workplaceState = 'New York';
          break;
        case 'branch-ca':
          workplaceState = 'California';
          break;
        case 'remote-dc':
          workplaceState = 'District of Columbia';
          break;
      }
      
      if (workplaceState && !stateJurisdictions.has(workplaceState)) {
        otherJurisdictions.push(workplaceState);
        stateJurisdictions.add(workplaceState);
      }
    }
    
    return [
      ...federalJurisdiction,
      ...residenceJurisdiction,
      ...primaryJurisdictions,
      ...otherJurisdictions
    ];
  }
};

export const getApplicableTaxes = (
  jurisdiction: string,
  viewType: ViewType
) => {
  const jurisdictionKey = jurisdiction
    .replace(" (Residence, Primary Workplace)", "")
    .replace(" (Residence)", "")
    .replace(" (Primary Workplace)", "");
  
  if (!taxData[jurisdictionKey]) {
    return [];
  }
  
  if (viewType === 'company') {
    return Object.keys(taxData[jurisdictionKey]);
  }
  
  if (jurisdiction.includes(" (Residence, Primary Workplace)")) {
    // Include all taxes driven by residence, primary workplace, or both
    return Object.entries(taxData[jurisdictionKey])
      .filter(([_, config]) => {
        const drivenByFactors = config.drivenBy.split(', ');
        return drivenByFactors.includes('residence') || 
               drivenByFactors.includes('primary workplace') ||
               drivenByFactors.length === 3;
      })
      .map(([taxName]) => taxName);
  }
  else if (jurisdiction.includes(" (Residence)")) {
    // Include only taxes driven by residence
    return Object.entries(taxData[jurisdictionKey])
      .filter(([_, config]) => {
        const drivenByFactors = config.drivenBy.split(', ');
        return drivenByFactors.includes('residence');
      })
      .map(([taxName]) => taxName);
  }
  else if (jurisdiction.includes(" (Primary Workplace)")) {
    // Include taxes driven by primary workplace
    return Object.entries(taxData[jurisdictionKey])
      .filter(([_, config]) => {
        const drivenByFactors = config.drivenBy.split(', ');
        return drivenByFactors.includes('primary workplace');
      })
      .map(([taxName]) => taxName);
  }
  else if (jurisdiction === 'Federal') {
    return Object.keys(taxData[jurisdictionKey]);
  }
  else {
    // For other workplaces, include only taxes driven by workplace
    return Object.entries(taxData[jurisdictionKey])
      .filter(([_, config]) => {
        const drivenByFactors = config.drivenBy.split(', ');
        return drivenByFactors.includes('workplace');
      })
      .map(([taxName]) => taxName);
  }
};
