import AccountClient from '@/components/AccountClient';

// Prevent static generation for this page since it uses auth session
export const dynamic = 'force-dynamic';

export default function AccountPage() {
  return <AccountClient />;
}
