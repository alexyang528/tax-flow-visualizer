
import { Employee, Workplace } from "@/types/payroll-tax-types";

export const workplaces: Workplace[] = [
  { id: 'all', name: 'All Workplaces' },
  { id: 'hq', name: 'Headquarters - New York' },
  { id: 'branch-ca', name: 'Branch Office - California' },
  { id: 'remote-dc', name: 'Remote Office - DC' }
];

export const employees: Employee[] = [
  { id: 'emp1', name: 'John Smith', workplaces: ['hq', 'remote-dc'], primaryWorkplace: 'hq', residence: { state: 'New Jersey', address: '123 Maple St, Jersey City, NJ 07302' } },
  { id: 'emp2', name: 'Sarah Johnson', workplaces: ['branch-ca'], primaryWorkplace: 'branch-ca', residence: { state: 'California', address: '456 Palm Ave, San Francisco, CA 94107' } },
  { id: 'emp3', name: 'Michael Brown', workplaces: ['remote-dc'], primaryWorkplace: 'remote-dc', residence: { state: 'Virginia', address: '789 Oak Rd, Arlington, VA 22201' } },
  { id: 'emp4', name: 'Emily Davis', workplaces: ['hq', 'branch-ca'], primaryWorkplace: 'hq', residence: { state: 'New York', address: '101 Broadway, New York, NY 10003' } },
  { id: 'emp5', name: 'David Wilson', workplaces: ['hq', 'remote-dc'], primaryWorkplace: 'remote-dc', residence: { state: 'Connecticut', address: '202 Elm St, Stamford, CT 06901' } },
  { id: 'emp6', name: 'Lisa Garcia', workplaces: ['branch-ca', 'remote-dc'], primaryWorkplace: 'branch-ca', residence: { state: 'Maryland', address: '303 Pine Ln, Bethesda, MD 20814' } }
];
