'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { getEffectiveTier } from '@/lib/subscription';
import type { SubscriptionTier } from '@/types/template';

interface CurrentUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  subscriptionTier: string | null;
  subscriptionStatus: string | null;
}

export default function AccountClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showEmailChange, setShowEmailChange] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCurrentUser();
    }
  }, [status]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/user/current');
      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
        setName(userData.name || '');
        setEmail(userData.email || '');
        setNewEmail(userData.email || '');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setCurrentUser(data.user);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/user/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Email changed successfully! Please log in again.' });
        setShowEmailChange(false);
        setTimeout(() => signOut({ callbackUrl: '/login' }), 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to change email' });
      }
    } catch (error) {
      console.error('Email change error:', error);
      setMessage({ type: 'error', text: 'Failed to change email. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePassword, confirmation: deleteConfirmation }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Account deleted successfully' });
        setTimeout(() => signOut({ callbackUrl: '/' }), 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete account' });
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      setMessage({ type: 'error', text: 'Failed to delete account. Please try again.' });
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
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            My Account
          </h1>
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
          {/* Profile Information */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-white mb-2 font-medium">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">Email Address</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="flex-1 px-4 py-3 rounded-lg bg-white bg-opacity-50 text-gray-600 cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmailChange(!showEmailChange)}
                    className="px-4 py-3 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition"
                  >
                    Change
                  </button>
                </div>
              </div>

              {showEmailChange && (
                <div className="bg-white bg-opacity-10 p-4 rounded-lg space-y-4">
                  <h3 className="text-lg font-semibold text-white">Change Email</h3>
                  <div>
                    <label className="block text-white mb-2">New Email</label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Confirm Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleEmailChange}
                    disabled={loading}
                    className="w-full px-6 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-opacity-90 transition disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Email'}
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-opacity-90 transition disabled:opacity-50 shadow-lg flex items-center justify-center"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Account Settings */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-white border-opacity-20">
                <div>
                  <div className="font-bold text-white mb-1">Change Password</div>
                  <div className="text-sm text-white text-opacity-90">
                    Update your password regularly for security
                  </div>
                </div>
                <Link
                  href="/settings"
                  className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-opacity-90 transition font-bold"
                >
                  Update
                </Link>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-white border-opacity-20">
                <div>
                  <div className="font-bold text-white mb-1">Subscription Plan</div>
                  <div className="text-sm text-white text-opacity-90">
                    {(() => {
                      const effectiveTier = getEffectiveTier(
                        (currentUser?.subscriptionTier as SubscriptionTier) || null,
                        currentUser?.role
                      );
                      const tierDisplay = effectiveTier.charAt(0).toUpperCase() + effectiveTier.slice(1);
                      const isAdmin = currentUser?.role === 'admin';
                      
                      return (
                        <>
                          {tierDisplay} Plan
                          {isAdmin && ' (Admin - Unlimited Access)'}
                          {!isAdmin && ` - ${currentUser?.subscriptionStatus || 'Upgrade for more features'}`}
                        </>
                      );
                    })()}
                  </div>
                </div>
                <Link
                  href="/subscription"
                  className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-opacity-90 transition font-bold"
                >
                  Manage
                </Link>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-white mb-1">Delete Account</div>
                  <div className="text-sm text-white text-opacity-90">
                    Permanently delete your account and data
                  </div>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Delete Account</h3>
            <p className="text-gray-600 mb-4">
              This action is permanent and cannot be undone. All your data will be deleted.
            </p>
            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Type "DELETE" to confirm</label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Enter your password</label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || deleteConfirmation !== 'DELETE'}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Delete Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
