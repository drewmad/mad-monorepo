import { redirect } from 'next/navigation';

export default function DashboardsRootPage() {
  redirect('/dashboards/workspace');
}
