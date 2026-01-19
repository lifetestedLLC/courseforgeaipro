'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function SettingsClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to change password' });
      }
    } catch (error) {
      console.error('Password change error:', error);
      setMessage({ type: 'error', text: 'Failed to change password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600">
                CourseForge AI
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {session.user?.name || session.user?.email}
              </span>
              <Link 
                href="/dashboard"
                className="text-gray-600 hover:text-primary-600 font-medium text-sm"
              >
                ← Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Security */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🔒 Security</h2>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Two-Factor Authentication</div>
                  <div className="text-sm text-gray-600">
                    Add an extra layer of security to your account
                  </div>
                </div>
                <button
                  disabled
                  className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed font-medium"
                >
                  Coming Soon
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🔔 Notifications</h2>

            <div className="space-y-4">
              <label className="flex justify-between items-center cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Email Notifications</div>
                  <div className="text-sm text-gray-600">
                    Receive updates via email
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 cursor-pointer accent-primary-600"
                  disabled
                />
              </label>

              <label className="flex justify-between items-center cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Course Updates</div>
                  <div className="text-sm text-gray-600">
                    Get notified about course changes
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 cursor-pointer accent-primary-600"
                  disabled
                />
              </label>

              <label className="flex justify-between items-center cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Marketing Emails</div>
                  <div className="text-sm text-gray-600">
                    Receive tips and promotional content
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 cursor-pointer accent-primary-600"
                  disabled
                />
              </label>

              <label className="flex justify-between items-center cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Weekly Progress Reports</div>
                  <div className="text-sm text-gray-600">
                    Get weekly summaries of your learning
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 cursor-pointer accent-primary-600"
                  disabled
                />
              </label>
            </div>

            <p className="mt-4 text-sm text-gray-500 italic">
              Note: Notification preferences will be saved in a future update
            </p>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">⚙️ Preferences</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Language</label>
                <select
                  disabled
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 opacity-50 cursor-not-allowed"
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Chinese</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Timezone</label>
                <select
                  disabled
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 opacity-50 cursor-not-allowed"
                >
                  <option>UTC</option>
                  <option>EST (UTC-5)</option>
                  <option>PST (UTC-8)</option>
                  <option>GMT</option>
                  <option>CET (UTC+1)</option>
                </select>
              </div>

              <button
                disabled
                className="px-6 py-3 bg-gray-200 text-gray-500 rounded-lg font-medium opacity-50 cursor-not-allowed"
              >
                Save Preferences (Coming Soon)
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🔗 Quick Links</h2>

            <div className="space-y-3">
              <Link
                href="/account"
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-gray-900 no-underline"
              >
                <span className="font-medium">My Account</span>
                <span>→</span>
              </Link>

              <Link
                href="/subscription"
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-gray-900 no-underline"
              >
                <span className="font-medium">Subscription & Billing</span>
                <span>→</span>
              </Link>

              <a
                href="#"
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-gray-900 no-underline opacity-50 cursor-not-allowed"
              >
                <span className="font-medium">Privacy Policy</span>
                <span>→</span>
              </a>

              <a
                href="#"
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-gray-900 no-underline opacity-50 cursor-not-allowed"
              >
                <span className="font-medium">Terms of Service</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
