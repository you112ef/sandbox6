import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Code2, 
  Users, 
  Zap, 
  Shield, 
  Monitor, 
  GitBranch,
  Rocket,
  Sparkles,
  ArrowRight,
  Github,
  Chrome
} from 'lucide-react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

const features = [
  {
    icon: Code2,
    title: 'AI-Powered Development',
    description: 'Multiple AI agents including Claude, GPT-5, and Gemini for intelligent code generation and assistance.',
  },
  {
    icon: Users,
    title: 'Real-time Collaboration',
    description: 'Work together with your team in real-time with live editing, comments, and version control.',
  },
  {
    icon: Zap,
    title: 'Instant Deployment',
    description: 'Deploy to Vercel, Netlify, or Fly.io with one click. See your changes live immediately.',
  },
  {
    icon: Shield,
    title: 'Secure Sandboxing',
    description: 'Isolated Docker containers ensure secure code execution with resource limits and network restrictions.',
  },
  {
    icon: Monitor,
    title: 'Advanced Monitoring',
    description: 'Real-time performance metrics, error tracking, and comprehensive logging dashboard.',
  },
  {
    icon: GitBranch,
    title: 'Version Control',
    description: 'Built-in Git integration with GitHub sync, branching, and rollback capabilities.',
  },
];

const templates = [
  { name: 'React App', description: 'Modern React with Vite', badge: 'Popular' },
  { name: 'Next.js', description: 'Full-stack Next.js application', badge: 'Featured' },
  { name: 'Node.js API', description: 'Express REST API boilerplate', badge: null },
  { name: 'Python Flask', description: 'Flask web application', badge: null },
  { name: 'Vue.js', description: 'Vue 3 with Composition API', badge: null },
  { name: 'TypeScript', description: 'TypeScript starter template', badge: 'New' },
];

export default function HomePage() {
  // Remove server-side session check for now - will be handled client-side

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Vibecode Clone</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="w-4 h-4 mr-1" />
            AI-Powered Development Platform
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Build, Collaborate, Deploy
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The complete platform for AI-assisted development. Create applications with multiple AI agents, 
            collaborate in real-time, and deploy instantly to the cloud.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8">
                Start Building
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="text-lg px-8">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A comprehensive development environment with AI assistance, collaboration tools, and deployment automation.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Templates Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/30 rounded-3xl my-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Start from Templates</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from our curated collection of starter templates and boilerplates.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  {template.badge && (
                    <Badge variant={template.badge === 'Popular' ? 'default' : template.badge === 'Featured' ? 'secondary' : 'outline'}>
                      {template.badge}
                    </Badge>
                  )}
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Building?</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join thousands of developers who are already building amazing applications with AI assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8">
                <Rocket className="w-5 h-5 mr-2" />
                Get Started Free
              </Button>
            </Link>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub Integration
              </div>
              <div className="flex items-center gap-2">
                <Chrome className="w-4 h-4" />
                Live Preview
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold">Vibecode Clone</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The complete AI-powered development platform for modern applications.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/features" className="hover:text-foreground">Features</Link></li>
                <li><Link href="/templates" className="hover:text-foreground">Templates</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-foreground">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground">About</Link></li>
                <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-foreground">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/help" className="hover:text-foreground">Help Center</Link></li>
                <li><Link href="/community" className="hover:text-foreground">Community</Link></li>
                <li><Link href="/status" className="hover:text-foreground">Status</Link></li>
                <li><Link href="/security" className="hover:text-foreground">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Vibecode Clone. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}