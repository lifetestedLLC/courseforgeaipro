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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">Settings</h1>
          <Link
            href="/dashboard"
            className="text-white px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition"
          >
            ← Dashboard
          </Link>
        </div>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-500 bg-opacity-20 border border-green-300 text-white'
                : 'bg-red-500 bg-opacity-20 border border-red-300 text-white'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Security */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">🔒 Security</h2>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-white mb-2 font-medium">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-opacity-90 transition disabled:opacity-50 shadow-lg flex items-center justify-center"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white border-opacity-20">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-white mb-1">Two-Factor Authentication</div>
                  <div className="text-sm text-white text-opacity-80">
                    Add an extra layer of security to your account
                  </div>
                </div>
                <button
                  disabled
                  className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg opacity-50 cursor-not-allowed font-medium"
                >
                  Coming Soon
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">🔔 Notifications</h2>

            <div className="space-y-4">
              <label className="flex justify-between items-center cursor-pointer p-4 bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition">
                <div>
                  <div className="font-bold text-white mb-1">Email Notifications</div>
                  <div className="text-sm text-white text-opacity-80">
                    Receive updates via email
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 cursor-pointer accent-purple-400"
                  disabled
                />
              </label>

              <label className="flex justify-between items-center cursor-pointer p-4 bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition">
                <div>
                  <div className="font-bold text-white mb-1">Course Updates</div>
                  <div className="text-sm text-white text-opacity-80">
                    Get notified about course changes
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 cursor-pointer accent-purple-400"
                  disabled
                />
              </label>

              <label className="flex justify-between items-center cursor-pointer p-4 bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition">
                <div>
                  <div className="font-bold text-white mb-1">Marketing Emails</div>
                  <div className="text-sm text-white text-opacity-80">
                    Receive tips and promotional content
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 cursor-pointer accent-purple-400"
                  disabled
                />
              </label>

              <label className="flex justify-between items-center cursor-pointer p-4 bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition">
                <div>
                  <div className="font-bold text-white mb-1">Weekly Progress Reports</div>
                  <div className="text-sm text-white text-opacity-80">
                    Get weekly summaries of your learning
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 cursor-pointer accent-purple-400"
                  disabled
                />
              </label>
            </div>

            <p className="mt-4 text-sm text-white text-opacity-70 italic">
              Note: Notification preferences will be saved in a future update
            </p>
          </div>

          {/* Preferences */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">⚙️ Preferences</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2 font-medium">Language</label>
                <select
                  disabled
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 opacity-50 cursor-not-allowed"
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Chinese</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">Timezone</label>
                <select
                  disabled
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 opacity-50 cursor-not-allowed"
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
                className="px-6 py-3 bg-white text-purple-600 rounded-lg font-bold opacity-50 cursor-not-allowed shadow-lg"
              >
                Save Preferences (Coming Soon)
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">🔗 Quick Links</h2>

            <div className="space-y-3">
              <Link
                href="/account"
                className="flex justify-between items-center p-4 bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition text-white no-underline"
              >
                <span className="font-medium">My Account</span>
                <span>→</span>
              </Link>

              <Link
                href="/subscription"
                className="flex justify-between items-center p-4 bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition text-white no-underline"
              >
                <span className="font-medium">Subscription & Billing</span>
                <span>→</span>
              </Link>

              <a
                href="#"
                className="flex justify-between items-center p-4 bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition text-white no-underline opacity-50 cursor-not-allowed"
              >
                <span className="font-medium">Privacy Policy</span>
                <span>→</span>
              </a>

              <a
                href="#"
                className="flex justify-between items-center p-4 bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition text-white no-underline opacity-50 cursor-not-allowed"
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
