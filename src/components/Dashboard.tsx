"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Header from './Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Code2, 
  GitPullRequest, 
  Bot, 
  FileCode, 
  Sparkles, 
  Rocket,
  TestTube2,
  Shield,
  Zap,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  category: string;
}

const FEATURES: Feature[] = [
  {
    id: 'pr-reviewer',
    name: 'PR Reviewer',
    description: 'AI-powered pull request reviews with intelligent suggestions',
    icon: GitPullRequest,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    category: 'Code Review'
  },
  {
    id: 'repo-agent',
    name: 'GitHub Repo Agent',
    description: 'Intelligent assistant for repository management and analysis',
    icon: Bot,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    category: 'Repository'
  },
  {
    id: 'code-generator',
    name: 'Code Generator',
    description: 'Generate production-ready code from natural language descriptions',
    icon: Code2,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    category: 'Generation'
  },
  {
    id: 'code-refactor',
    name: 'Code Refactor',
    description: 'Improve code quality with AI-powered refactoring suggestions',
    icon: Sparkles,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    category: 'Optimization'
  },
  {
    id: 'test-generator',
    name: 'Test Generator',
    description: 'Automatically generate comprehensive unit tests for your code',
    icon: TestTube2,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100 dark:bg-pink-900/20',
    category: 'Testing'
  },
  {
    id: 'security-scanner',
    name: 'Security Scanner',
    description: 'Detect security vulnerabilities and get fix recommendations',
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    category: 'Security'
  },
  {
    id: 'doc-generator',
    name: 'Documentation Generator',
    description: 'Create comprehensive documentation from your codebase',
    icon: FileCode,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
    category: 'Documentation'
  },
  {
    id: 'performance-optimizer',
    name: 'Performance Optimizer',
    description: 'Analyze and optimize code performance automatically',
    icon: Zap,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    category: 'Optimization'
  },
  {
    id: 'project-generator',
    name: 'AI Project Generator',
    description: 'Generate complete projects from ideas with AI guidance',
    icon: Rocket,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/20',
    category: 'Generation'
  }
];

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name || user?.login}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Choose an AI agent below to get started
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.id}
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-blue-500"
                onClick={() => router.push(`/agent/${feature.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <Badge variant="outline" className="w-fit mb-2 text-xs">
                    {feature.category}
                  </Badge>
                  <CardTitle className="text-lg">{feature.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <div className="mt-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium">
                    <MessageSquare className="w-4 h-4" />
                    <span>Open Agent</span>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}