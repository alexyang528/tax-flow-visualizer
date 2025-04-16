import { taxData } from "@/data/tax-data";
import { ViewType, Employee, TaxConfig } from "@/types/payroll-tax-types";
import { employees, workplaces } from "@/data/employee-data";

export const getFilteredJurisdictions = (
  viewType: ViewType,
  selectedWorkplace: string,
  selectedEmployee: string,
  employee?: Employee
) => {
  // Always include Federal jurisdiction if there is a workplace
  const federalJurisdiction: string[] = ['Federal'];
  
  if (viewType === 'company') {
    if (selectedWorkplace === 'all') {
      const jurisdictions = Object.keys(taxData);
      return [...federalJurisdiction, ...jurisdictions.filter(j => j !== 'Federal')];
    }
    
    switch (selectedWorkplace) {
      case 'hq':
        return [...federalJurisdiction, 'New York'];
      case 'branch-ca':
        return [...federalJurisdiction, 'California'];
      case 'remote-dc':
        return [...federalJurisdiction, 'District of Columbia'];
      default:
        return Object.keys(taxData);
    }
  }
  
  else {
    if (!employee) return [];
    
    const applicableWorkplaces: string[] = [];
    
    if (employee.workplaces) {
      employee.workplaces.forEach(wp => {
        if (selectedWorkplace === 'all' || selectedWorkplace === wp) {
          applicableWorkplaces.push(wp);
        }
      });
    }
    
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
    if (selectedWorkplace === 'all') {
      // Add all workplaces except primary workplace (which is already included)
      employee.workplaces
        .filter(wp => wp !== primaryWorkplace)
        .forEach(wp => {
          let workplaceState: string | null = null;
          switch (wp) {
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
        });
    } else if (selectedWorkplace !== primaryWorkplace) {
      // Add single selected workplace if it's not the primary workplace
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
  viewType: ViewType,
  selectedEmployee?: string,
  selectedWorkplace?: string,
  employees: Employee[] = []
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
  
  // For employee view, we need to filter based on drivenBy and context
  const employee = employees.find(emp => emp.id === selectedEmployee);
  if (!employee) return [];
  
  // Always return all Federal taxes if the jurisdiction is Federal
  if (jurisdictionKey === 'Federal') {
    return Object.keys(taxData[jurisdictionKey]);
  }
  
  const residenceState = employee.residence?.state;
  const primaryWorkplace = employee.primaryWorkplace;
  let primaryWorkplaceState: string | null = null;
  
  // Get primary workplace state
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
  
  // Get selected workplace state
  let selectedWorkplaceState: string | null = null;
  if (selectedWorkplace && selectedWorkplace !== 'all') {
    switch (selectedWorkplace) {
      case 'hq':
        selectedWorkplaceState = 'New York';
        break;
      case 'branch-ca':
        selectedWorkplaceState = 'California';
        break;
      case 'remote-dc':
        selectedWorkplaceState = 'District of Columbia';
        break;
    }
  }

  // Get all company workplace states
  const companyWorkplaceStates = new Set<string>();
  workplaces.forEach(wp => {
    switch (wp.id) {
      case 'hq':
        companyWorkplaceStates.add('New York');
        break;
      case 'branch-ca':
        companyWorkplaceStates.add('California');
        break;
      case 'remote-dc':
        companyWorkplaceStates.add('District of Columbia');
        break;
    }
  });
  
  return Object.entries(taxData[jurisdictionKey])
    .filter(([_, config]) => {
      const drivenByFactors = config.drivenBy.split(', ');
      
      // Check if this jurisdiction matches any of the drivenBy factors
      if (drivenByFactors.includes('residence') && jurisdictionKey === residenceState) {
        // For residence-based taxes, check if company has a workplace in that state
        if (!companyWorkplaceStates.has(jurisdictionKey)) {
          // Mark as optional by adding a special prefix
          return true;
        }
      }
      
      // Check for primary workplace-driven taxes
      if (drivenByFactors.includes('primary workplace')) {
        // Only include primary workplace taxes if this is the primary workplace state
        // and the jurisdiction matches the primary workplace state
        return jurisdictionKey === primaryWorkplaceState;
      }
      
      // Check for workplace-driven taxes
      if (drivenByFactors.includes('workplace') && 
          (selectedWorkplace === 'all' || jurisdictionKey === selectedWorkplaceState)) {
        return true;
      }
      
      return false;
    })
    .map(([taxName]) => taxName);
};

export const getActualDrivenBy = (
  taxConfig: TaxConfig,
  employee: Employee,
  selectedWorkplace: string,
  jurisdictionKey: string
): string => {
  // Federal taxes are always applicable, no need to show driving factors
  if (jurisdictionKey === 'Federal') {
    return '';
  }

  const drivenByFactors = taxConfig.drivenBy.split(', ');
  const actualFactors: string[] = [];

  // Check if this is driven by residence
  if (drivenByFactors.includes('residence') && employee.residence.state === jurisdictionKey) {
    actualFactors.push('residence');
  }

  // Check if this is driven by workplace
  if (drivenByFactors.includes('workplace')) {
    // Get all workplace states for the employee
    const workplaceStates = new Set<string>();
    employee.workplaces.forEach(wp => {
      let workplaceState: string | null = null;
      switch (wp) {
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
      if (workplaceState) {
        workplaceStates.add(workplaceState);
      }
    });

    // If "All Workplaces" is selected, check if any workplace matches
    if (selectedWorkplace === 'all') {
      if (workplaceStates.has(jurisdictionKey)) {
        actualFactors.push('workplace');
      }
    } else {
      // Otherwise, check the specific selected workplace
      let selectedWorkplaceState: string | null = null;
      switch (selectedWorkplace) {
        case 'hq':
          selectedWorkplaceState = 'New York';
          break;
        case 'branch-ca':
          selectedWorkplaceState = 'California';
          break;
        case 'remote-dc':
          selectedWorkplaceState = 'District of Columbia';
          break;
      }
      if (selectedWorkplaceState === jurisdictionKey) {
        actualFactors.push('workplace');
      }
    }
  }

  // Check if this is driven by primary workplace
  if (drivenByFactors.includes('primary workplace')) {
    let primaryWorkplaceState: string | null = null;
    switch (employee.primaryWorkplace) {
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
    if (primaryWorkplaceState === jurisdictionKey) {
      actualFactors.push('primary workplace');
    }
  }

  return actualFactors.join(', ');
};
