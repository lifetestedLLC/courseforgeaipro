import Link from 'next/link';
import { 
  BookOpen, 
  Video, 
  FileQuestion, 
  Download, 
  TrendingUp,
  Plus,
  Settings,
  LogOut
} from 'lucide-react';

export default function Dashboard() {
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
              <button className="p-2 text-gray-600 hover:text-primary-600">
                <Settings className="w-5 h-5" />
              </button>
              <Link href="/" className="flex items-center text-gray-600 hover:text-primary-600">
                <LogOut className="w-5 h-5 mr-1" />
                <span className="text-sm">Logout</span>
              </Link>
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
            value="12"
            trend="+3 this month"
          />
          <StatCard
            icon={<Video className="w-6 h-6 text-accent-600" />}
            label="Videos Created"
            value="48"
            trend="+15 this month"
          />
          <StatCard
            icon={<FileQuestion className="w-6 h-6 text-green-600" />}
            label="Quizzes Generated"
            value="89"
            trend="+22 this month"
          />
          <StatCard
            icon={<Download className="w-6 h-6 text-blue-600" />}
            label="Exports"
            value="25"
            trend="+8 this month"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <ActionButton
              icon={<BookOpen className="w-6 h-6" />}
              title="Generate Course"
              description="Create a new AI-powered course"
              color="primary"
            />
            <ActionButton
              icon={<Video className="w-6 h-6" />}
              title="Create Video"
              description="Generate AI video content"
              color="accent"
            />
            <ActionButton
              icon={<FileQuestion className="w-6 h-6" />}
              title="Build Quiz"
              description="Create interactive assessments"
              color="green"
            />
          </div>
        </div>

        {/* Recent Courses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Courses</h2>
            <button className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
              <Plus className="w-4 h-4 mr-1" />
              New Course
            </button>
          </div>
          <div className="space-y-4">
            <CourseItem
              title="Introduction to Python Programming"
              status="Published"
              progress={100}
              videos={12}
              quizzes={8}
            />
            <CourseItem
              title="Web Development Masterclass"
              status="Draft"
              progress={65}
              videos={8}
              quizzes={5}
            />
            <CourseItem
              title="Data Science Fundamentals"
              status="In Progress"
              progress={45}
              videos={5}
              quizzes={3}
            />
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Export & Integrations</h2>
          <p className="text-gray-600 mb-4">
            Connect your courses to popular learning platforms
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <IntegrationButton name="Coursera" connected={true} />
            <IntegrationButton name="Udemy" connected={true} />
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
  status, 
  progress, 
  videos, 
  quizzes 
}: { 
  title: string, 
  status: string, 
  progress: number, 
  videos: number, 
  quizzes: number 
}) {
  const statusColor = {
    'Published': 'bg-green-100 text-green-800',
    'Draft': 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <Video className="w-4 h-4 mr-1" />
              {videos} videos
            </span>
            <span className="flex items-center">
              <FileQuestion className="w-4 h-4 mr-1" />
              {quizzes} quizzes
            </span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[status as keyof typeof statusColor]}`}>
          {status}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary-600 h-2 rounded-full transition-all" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-xs text-gray-600 mt-1">{progress}% complete</div>
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
