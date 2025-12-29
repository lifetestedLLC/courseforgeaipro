import GenerateClient from './GenerateClient';

// Prevent static generation for this page since it uses auth session
export const dynamic = 'force-dynamic';

export default function GeneratePage() {
  return <GenerateClient />;
}
