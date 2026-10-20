import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '@/shared/utils/analytics';

const PAGE_TITLES: Record<string, string> = {
  '/':                              'Sign In',
  '/sign-up':                       'Sign Up',
  '/forgot-pin':                    'Forgot PIN',
  '/otp-verification':              'OTP Verification',
  '/dashboard':                     'Supervisor Dashboard',
  '/engineer-dashboard':            'Engineer Dashboard',
  '/sitelist':                      'Site List (Quick)',
  '/profile':                       'User Profile',
  '/roles-rights':                  'Roles & Rights',
  '/users':                         'User List',
  '/users/create':                  'Create User',
  '/contacts':                      'Contact List',
  '/contacts/create':               'Create Contact',
  '/clients':                       'Client List',
  '/clients/create':                'Create Client',
  '/sites':                         'Site List',
  '/sites/create':                  'Create Site',
  '/suppliers':                     'Supplier List',
  '/suppliers/create':              'Create Supplier',
  '/workers':                       'Worker List',
  '/workers/create':                'Create Worker',
  '/worker-categories':             'Worker Category List',
  '/worker-categories/create':      'Create Worker Category',
  '/work-rate-abstracts':           'Work Rate Abstract List',
  '/work-rate-abstracts/create':    'Create Work Rate Abstract',
  '/work-modes':                    'Work Modes',
  '/workers/shift':                 'Shift Setup',
  '/attendance':                    'Attendance List',
  '/attendance/create':             'Create Attendance',
  '/materials':                     'Material List',
  '/materials/create':              'Create Material',
  '/materials/unit':                'Unit Setup',
  '/materials/purchase':            'Purchase List',
  '/materials/purchase/create':     'Create Purchase',
  '/materials/used':                'Material Used List',
  '/materials/used/create':         'Record Material Used',
  '/materials/shift':               'Material Shift List',
  '/materials/shift/create':        'Create Material Shift',
  '/curing':                        'Curing List',
  '/curing/create':                 'Create Curing',
  '/curing/types':                  'Curing Type List',
  '/curing/types/create':           'Create Curing Type',
  '/transactions/client':           'Client Transactions',
  '/transactions/client/create':    'Create Client Transaction',
  '/transactions/supplier':         'Supplier Transactions',
  '/transactions/supplier/create':  'Create Supplier Transaction',
  '/transactions/worker':           'Worker Transactions',
  '/transactions/worker/create':    'Create Worker Transaction',
  '/task':                          'Task List',
  '/task/create':                   'Create Task',
  '/reports/worker':                'Worker Report',
  '/reports/supervisor-attendance': 'Supervisor Attendance Report',
  '/reports/available-material':    'Available Material Report',
  '/reports/inventory-stock':       'Inventory Stock Report',
  '/reports/site-expense':          'Site Expense Report',
};

// Replaces UUID and numeric ID segments so GA groups dynamic routes together
function normalizePath(pathname: string): string {
  return pathname
    .replace(/\/[0-9a-f]{8}-[0-9a-f-]{27}/gi, '/:id')
    .replace(/\/\d+/g, '/:id');
}

function getPageTitle(pathname: string): string {
  const exact = PAGE_TITLES[pathname];
  if (exact) return exact;

  if (/\/users\/[^/]+\/edit/.test(pathname)) return 'Edit User';
  if (/\/contacts\/[^/]+\/edit/.test(pathname)) return 'Edit Contact';
  if (/\/clients\/[^/]+\/edit/.test(pathname)) return 'Edit Client';
  if (/\/sites\/[^/]+\/edit/.test(pathname)) return 'Edit Site';
  if (/\/suppliers\/[^/]+\/edit/.test(pathname)) return 'Edit Supplier';
  if (/\/workers\/[^/]+\/edit/.test(pathname)) return 'Edit Worker';
  if (/\/worker-categories\/[^/]+\/edit/.test(pathname)) return 'Edit Worker Category';
  if (/\/work-rate-abstracts\/[^/]+\/edit/.test(pathname)) return 'Edit Work Rate Abstract';
  if (/\/attendance\/[^/]+\/edit/.test(pathname)) return 'Edit Attendance';
  if (/\/materials\/[^/]+\/edit/.test(pathname)) return 'Edit Material';
  if (/\/materials\/purchase\/[^/]+\/edit/.test(pathname)) return 'Edit Purchase';
  if (/\/materials\/used\/[^/]+\/edit/.test(pathname)) return 'Edit Material Used';
  if (/\/materials\/shift\/[^/]+\/edit/.test(pathname)) return 'Edit Material Shift';
  if (/\/curing\/[^/]+\/edit/.test(pathname)) return 'Edit Curing';
  if (/\/curing\/types\/[^/]+\/edit/.test(pathname)) return 'Edit Curing Type';
  if (/\/transactions\/client\/[^/]+\/edit/.test(pathname)) return 'Edit Client Transaction';
  if (/\/transactions\/supplier\/[^/]+\/edit/.test(pathname)) return 'Edit Supplier Transaction';
  if (/\/transactions\/worker\/[^/]+\/edit/.test(pathname)) return 'Edit Worker Transaction';
  if (/\/task\/[^/]+\/edit/.test(pathname)) return 'Edit Task';
  if (/\/reports\/worker\/[^/]+/.test(pathname)) return 'Worker Report Details';
  if (/\/workers\/[^/]+\/worker-role-costs/.test(pathname)) return 'Worker Role Costs';
  if (/\/roles-rights\/[^/]+/.test(pathname)) return 'Page Role Configuration';

  return 'WorkInSite';
}

export function usePageTracking(): void {
  const location = useLocation();

  useEffect(() => {
    const normalizedPath = normalizePath(location.pathname);
    const title = getPageTitle(location.pathname);
    trackPageView(normalizedPath, title);
  }, [location.pathname]);
}
