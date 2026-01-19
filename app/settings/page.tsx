import SettingsClient from '@/components/SettingsClient';

// Prevent static generation for this page since it uses auth session
export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  return <SettingsClient />;
}
