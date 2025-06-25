import { render, screen } from '@testing-library/react';
import TimesheetPage from '../../apps/web/app/(protected)/time/timesheet/page';
import ReportsPage from '../../apps/web/app/(protected)/time/reports/page';
import ApprovalsPage from '../../apps/web/app/(protected)/time/approvals/page';
import InvoicingPage from '../../apps/web/app/(protected)/time/invoicing/page';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('@/lib/user', () => ({
  getSession: vi.fn().mockResolvedValue({
    user: { user_metadata: { current_workspace_id: 'ws1' } }
  })
}));

vi.mock('@/actions/time', () => ({
  getTimesheetEntries: vi.fn().mockResolvedValue({ entries: [] }),
  getTimeReports: vi.fn().mockResolvedValue({ reports: [] })
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn()
}));

describe('Time routes', () => {
  it('renders timesheet page', async () => {
    const Page = await TimesheetPage();
    render(Page);
    expect(screen.getByText(/timesheet/i)).toBeInTheDocument();
  });

  it('renders reports page', async () => {
    const Page = await ReportsPage();
    render(Page);
    expect(screen.getByText(/time reports/i)).toBeInTheDocument();
  });

  it('renders approvals page', async () => {
    const Page = await ApprovalsPage();
    render(Page);
    expect(screen.getByText(/approvals/i)).toBeInTheDocument();
  });

  it('renders invoicing page', async () => {
    const Page = await InvoicingPage();
    render(Page);
    expect(screen.getByText(/invoicing/i)).toBeInTheDocument();
  });
});
