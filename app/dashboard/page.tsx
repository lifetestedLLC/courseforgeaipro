import DashboardClient from '@/components/DashboardClient';

// Prevent static generation for this page since it uses auth session
export const dynamic = 'force-dynamic';

export default function Dashboard() {
  return <DashboardClient />;
}
