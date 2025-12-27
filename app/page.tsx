import Link from 'next/link';
import { Sparkles, Video, FileQuestion, Zap, Download, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600">
                CourseForge AI
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-700 hover:text-primary-600">Features</Link>
              <Link href="#pricing" className="text-gray-700 hover:text-primary-600">Pricing</Link>
              <Link href="#integrations" className="text-gray-700 hover:text-primary-600">Integrations</Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-primary-600">Dashboard</Link>
              <Link href="/login" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Create Professional Courses <br />
              <span className="text-primary-600">With AI-Powered Tools</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Generate complete courses, create engaging videos, build interactive quizzes, 
              and export to top learning platforms. All powered by advanced AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/dashboard" 
                className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition"
              >
                Start Free Trial
              </Link>
              <Link 
                href="#features" 
                className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition"
              >
                Explore Features
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Create Courses
            </h2>
            <p className="text-xl text-gray-600">
              Powerful AI tools designed for course creators
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Sparkles className="w-8 h-8 text-primary-600" />}
              title="AI Course Generation"
              description="Create comprehensive course outlines, lesson plans, and content in minutes. Our AI understands your subject and generates professional curriculum."
            />
            <FeatureCard
              icon={<Video className="w-8 h-8 text-primary-600" />}
              title="AI Video Creation"
              description="Turn your scripts into engaging videos with AI-generated voiceovers, animations, and professional editing automatically."
            />
            <FeatureCard
              icon={<FileQuestion className="w-8 h-8 text-primary-600" />}
              title="Interactive Quizzes"
              description="Generate quizzes and assessments automatically. Multiple choice, true/false, and essay questions tailored to your content."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-primary-600" />}
              title="Smart Content Tools"
              description="AI writing assistant, content summarizer, translation tools, and more to enhance your course materials."
            />
            <FeatureCard
              icon={<Download className="w-8 h-8 text-primary-600" />}
              title="Platform Integrations"
              description="Export your courses to Coursera, Udemy, Teachable, and other platforms with one click. Standard-compliant formats."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-primary-600" />}
              title="Creator Dashboard"
              description="Manage all your courses, track progress, analytics, and collaborate with your team from one central hub."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Affordable Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              name="Starter"
              price="$19"
              period="/month"
              features={[
                "20 AI-generated courses/month",
                "25 AI videos/month",
                "Unlimited quizzes",
                "Basic integrations",
                "Email support"
              ]}
              trialText="14-day free trial"
            />
            <PricingCard
              name="Professional"
              price="$49"
              period="/month"
              features={[
                "40 AI-generated courses/month",
                "65 AI videos/month",
                "Unlimited quizzes",
                "All integrations",
                "Priority support",
                "Team collaboration"
              ]}
              highlighted
              trialText="14-day free trial"
            />
            <PricingCard
              name="Enterprise"
              price="$149"
              period="/month"
              features={[
                "Unlimited courses",
                "Unlimited videos",
                "Unlimited quizzes",
                "Custom integrations",
                "24/7 support",
                "Advanced analytics",
                "White-label option"
              ]}
              trialText="30-day free trial"
            />
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section id="integrations" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Export to Your Favorite Platforms
            </h2>
            <p className="text-xl text-gray-600">
              Seamlessly integrate with leading learning management systems
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <IntegrationCard name="Coursera" />
            <IntegrationCard name="Udemy" />
            <IntegrationCard name="Teachable" />
            <IntegrationCard name="Thinkific" />
            <IntegrationCard name="Kajabi" />
            <IntegrationCard name="Podia" />
            <IntegrationCard name="LearnDash" />
            <IntegrationCard name="Custom LMS" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Create Your First Course?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of creators using AI to build amazing educational content
          </p>
          <Link 
            href="/dashboard" 
            className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">CourseForge AI</h3>
              <p className="text-sm">
                Create professional courses with the power of AI. courseforgeai.org
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="hover:text-white">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="#integrations" className="hover:text-white">Integrations</Link></li>
                <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
                <li><Link href="/api" className="hover:text-white">API</Link></li>
                <li><Link href="/status" className="hover:text-white">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} CourseForge AI (courseforgeai.org). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function PricingCard({ 
  name, 
  price, 
  period, 
  features, 
  highlighted = false,
  trialText
}: { 
  name: string, 
  price: string, 
  period: string, 
  features: string[], 
  highlighted?: boolean,
  trialText: string
}) {
  return (
    <div className={`p-8 rounded-xl ${highlighted ? 'bg-primary-600 text-white shadow-xl scale-105' : 'bg-white border border-gray-200'}`}>
      <h3 className={`text-2xl font-bold mb-2 ${highlighted ? 'text-white' : 'text-gray-900'}`}>{name}</h3>
      <div className="mb-6">
        <span className={`text-4xl font-bold ${highlighted ? 'text-white' : 'text-gray-900'}`}>{price}</span>
        <span className={highlighted ? 'text-primary-100' : 'text-gray-600'}>{period}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start">
            <svg className={`w-5 h-5 mr-2 mt-0.5 ${highlighted ? 'text-white' : 'text-primary-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className={highlighted ? 'text-primary-50' : 'text-gray-600'}>{feature}</span>
          </li>
        ))}
      </ul>
      <Link 
        href="/dashboard"
        className={`block text-center py-3 px-6 rounded-lg font-semibold transition ${
          highlighted 
            ? 'bg-white text-primary-600 hover:bg-gray-100' 
            : 'bg-primary-600 text-white hover:bg-primary-700'
        }`}
      >
        {trialText}
      </Link>
    </div>
  );
}

function IntegrationCard({ name }: { name: string }) {
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-400">{name[0]}</span>
      </div>
      <h4 className="font-semibold text-gray-900">{name}</h4>
    </div>
  );
}
