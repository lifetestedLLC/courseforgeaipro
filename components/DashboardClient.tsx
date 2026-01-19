'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Video, 
  FileQuestion, 
  Download, 
  TrendingUp,
  Plus,
  Settings,
  LogOut,
  Loader2,
  Shield
} from 'lucide-react';

interface DashboardStats {
  totalCourses: number;
  totalVideos: number;
  totalQuizzes: number;
  coursesThisMonth: number;
  videosThisMonth: number;
  quizzesThisMonth: number;
  totalExports: number;
  exportsThisMonth: number;
}

interface RecentCourse {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentCourses: RecentCourse[];
}

export default function DashboardClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchCurrentUser();
      fetchDashboardData();
    }
  }, [session]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/user/current');
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
      }
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setIsLoadingData(true);
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  if (status === 'loading' || isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Show loading state if data hasn't been fetched yet
  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
              {currentUser?.role === 'admin' && (
                <Link 
                  href="/admin"
                  className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold hover:bg-red-200 transition"
                >
                  <Shield className="w-4 h-4 mr-1" />
                  Admin
                </Link>
              )}
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
            Welcome to Your Creator Dashboard
          </h1>
          <p className="text-gray-600">
            Create, manage, and export your AI-powered courses
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<BookOpen className="w-6 h-6 text-primary-600" />}
            label="Total Courses"
            value={dashboardData.stats.totalCourses.toString()}
            trend={dashboardData.stats.coursesThisMonth > 0 ? `+${dashboardData.stats.coursesThisMonth} this month` : 'No activity this month'}
          />
          <StatCard
            icon={<Video className="w-6 h-6 text-accent-600" />}
            label="Videos Created"
            value={dashboardData.stats.totalVideos.toString()}
            trend={dashboardData.stats.videosThisMonth > 0 ? `+${dashboardData.stats.videosThisMonth} this month` : 'No activity this month'}
          />
          <StatCard
            icon={<FileQuestion className="w-6 h-6 text-green-600" />}
            label="Quizzes Generated"
            value={dashboardData.stats.totalQuizzes.toString()}
            trend={dashboardData.stats.quizzesThisMonth > 0 ? `+${dashboardData.stats.quizzesThisMonth} this month` : 'No activity this month'}
          />
          <StatCard
            icon={<Download className="w-6 h-6 text-blue-600" />}
            label="Exports"
            value={dashboardData.stats.totalExports.toString()}
            trend={dashboardData.stats.exportsThisMonth > 0 ? `+${dashboardData.stats.exportsThisMonth} this month` : 'No activity this month'}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/dashboard/generate">
              <ActionButton
                icon={<BookOpen className="w-6 h-6" />}
                title="Generate Course"
                description="Create a new AI-powered course"
                color="primary"
              />
            </Link>
            <Link href="/dashboard/generate">
              <ActionButton
                icon={<Video className="w-6 h-6" />}
                title="Create Video"
                description="Generate AI video content"
                color="accent"
              />
            </Link>
            <Link href="/dashboard/generate">
              <ActionButton
                icon={<FileQuestion className="w-6 h-6" />}
                title="Build Quiz"
                description="Create interactive assessments"
                color="green"
              />
            </Link>
          </div>
        </div>

        {/* Recent Courses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Courses</h2>
            <Link 
              href="/dashboard/generate"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Course
            </Link>
          </div>
          {dashboardData.recentCourses.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recentCourses.map((course) => (
                <CourseItem
                  key={course.id}
                  title={course.title}
                  description={course.description || ''}
                  status={course.status}
                  updatedAt={course.updatedAt}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No courses yet</h3>
              <p className="text-gray-500 mb-6">
                Start creating your first AI-powered course today
              </p>
              <Link
                href="/dashboard/generate"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Course
              </Link>
            </div>
          )}
        </div>

        {/* Integrations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Export & Integrations</h2>
          <p className="text-gray-600 mb-4">
            Connect your courses to popular learning platforms
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <IntegrationButton name="Coursera" connected={false} />
            <IntegrationButton name="Udemy" connected={false} />
            <IntegrationButton name="Teachable" connected={false} />
            <IntegrationButton name="Thinkific" connected={false} />
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
  trend 
}: { 
  icon: React.ReactNode, 
  label: string, 
  value: string, 
  trend: string 
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        {icon}
        <TrendingUp className="w-4 h-4 text-green-600" />
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-xs text-green-600 mt-2">{trend}</div>
    </div>
  );
}

function ActionButton({ 
  icon, 
  title, 
  description, 
  color 
}: { 
  icon: React.ReactNode, 
  title: string, 
  description: string, 
  color: string 
}) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600 hover:bg-primary-100',
    accent: 'bg-accent-50 text-accent-600 hover:bg-accent-100',
    green: 'bg-green-50 text-green-600 hover:bg-green-100',
  };

  return (
    <button className={`p-6 rounded-xl transition text-left ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="mb-3">{icon}</div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm opacity-75">{description}</p>
    </button>
  );
}

function CourseItem({ 
  title, 
  description,
  status, 
  updatedAt
}: { 
  title: string, 
  description: string,
  status: string, 
  updatedAt: string
}) {
  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus === 'published') return 'bg-green-100 text-green-800';
    if (normalizedStatus === 'draft') return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const statusDisplay = status.charAt(0).toUpperCase() + status.slice(1);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mb-2 overflow-hidden" style={{ 
              display: '-webkit-box', 
              WebkitLineClamp: 2, 
              WebkitBoxOrient: 'vertical' 
            }}>
              {description}
            </p>
          )}
          <div className="text-xs text-gray-500">
            Updated {formatDate(updatedAt)}
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4 ${getStatusColor(status)}`}>
          {statusDisplay}
        </span>
      </div>
    </div>
  );
}

function IntegrationButton({ 
  name, 
  connected 
}: { 
  name: string, 
  connected: boolean 
}) {
  return (
    <button className={`p-4 rounded-lg border-2 text-center transition ${
      connected 
        ? 'border-green-500 bg-green-50' 
        : 'border-gray-300 hover:border-primary-500'
    }`}>
      <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
        <span className="text-xl font-bold text-gray-500">{name[0]}</span>
      </div>
      <div className="font-semibold text-gray-900 text-sm">{name}</div>
      {connected && (
        <div className="text-xs text-green-600 mt-1">Connected</div>
      )}
    </button>
  );
}
