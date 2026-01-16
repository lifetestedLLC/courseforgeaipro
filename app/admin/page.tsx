'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  BookOpen, 
  Video, 
  FileQuestion,
  Settings,
  LogOut,
  Loader2,
  Shield,
  TrendingUp,
  Database
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  subscriptionTier: string | null;
  subscriptionStatus: string | null;
}

interface Stats {
  totalUsers: number;
  totalCourses: number;
  totalVideos: number;
  totalQuizzes: number;
  adminUsers: number;
  activeSubscriptions: number;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchCurrentUser();
    }
  }, [session]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/user/current');
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
        
        // Check if user is admin
        if (data.role !== 'admin') {
          router.push('/dashboard');
          return;
        }
        
        // If admin, fetch admin data
        fetchAdminData();
      }
    } catch (err) {
      console.error('Error fetching current user:', err);
      setError('Failed to load user data');
      setLoading(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch all users
      const usersResponse = await fetch('/api/admin/users');
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users);
      }
      
      // Fetch stats
      const statsResponse = await fetch('/api/admin/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Failed to load admin data');
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session || !currentUser || currentUser.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-primary-600">
                CourseForge AI
              </Link>
              <div className="flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                <Shield className="w-4 h-4" />
                <span>Admin Panel</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="text-sm text-gray-600 hover:text-primary-600"
              >
                Back to Dashboard
              </Link>
              <span className="text-sm text-gray-700">
                {session.user?.name || session.user?.email}
              </span>
              <button className="p-2 text-gray-600 hover:text-primary-600">
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={handleSignOut}
                className="flex items-center text-gray-600 hover:text-primary-600"
              >
                <LogOut className="w-5 h-5 mr-1" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage users, monitor system activity, and view analytics
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Users className="w-6 h-6 text-primary-600" />}
              label="Total Users"
              value={stats.totalUsers.toString()}
              subtext={`${stats.adminUsers} admin${stats.adminUsers !== 1 ? 's' : ''}`}
            />
            <StatCard
              icon={<BookOpen className="w-6 h-6 text-accent-600" />}
              label="Total Courses"
              value={stats.totalCourses.toString()}
              subtext="Created by users"
            />
            <StatCard
              icon={<Video className="w-6 h-6 text-green-600" />}
              label="Total Videos"
              value={stats.totalVideos.toString()}
              subtext="Generated content"
            />
            <StatCard
              icon={<FileQuestion className="w-6 h-6 text-blue-600" />}
              label="Total Quizzes"
              value={stats.totalQuizzes.toString()}
              subtext="Assessment items"
            />
          </div>
        )}

        {/* User Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
            <div className="text-sm text-gray-600">
              {users.length} user{users.length !== 1 ? 's' : ''} total
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.subscriptionTier ? (
                          <span className="capitalize">{user.subscriptionTier}</span>
                        ) : (
                          <span className="text-gray-400">Free</span>
                        )}
                      </div>
                      {user.subscriptionStatus && (
                        <div className="text-xs text-gray-500 capitalize">
                          {user.subscriptionStatus}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {users.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">
              No users found
            </div>
          )}
        </div>

        {/* System Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2" />
            System Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Environment</div>
              <div className="text-lg font-semibold text-gray-900">
                {process.env.NODE_ENV || 'production'}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Database Status</div>
              <div className="text-lg font-semibold text-green-600">
                Connected
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  icon, 
  label, 
  value, 
  subtext 
}: { 
  icon: React.ReactNode, 
  label: string, 
  value: string, 
  subtext: string 
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        {icon}
        <TrendingUp className="w-4 h-4 text-green-600" />
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-xs text-gray-500 mt-2">{subtext}</div>
    </div>
  );
}
