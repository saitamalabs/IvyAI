"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { NumberTicker } from '@/components/ui/number-ticker';
import { Particles } from '@/components/ui/particles';
import { BorderBeam } from '@/components/ui/border-beam';
import { Meteors } from '@/components/ui/meteors';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import AgentInterface from '@/components/AgentInterface';
import { DashboardHome } from '@/components/DashboardHome';
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
  ArrowRight,
  Github,
  TrendingUp,
  Star,
  MapPin,
  Building2,
  Link as LinkIcon,
  Calendar,
  Users,
  ChevronLeft
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

// Skeleton Loading Component
function AgentCardSkeleton() {
  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <Skeleton className="w-16 h-16 rounded-2xl mb-4" />
        <Skeleton className="h-5 w-24 mb-2" />
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        <div className="mt-4 flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded-full ml-auto" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [githubStats, setGithubStats] = useState({
    repos: 0,
    publicRepos: 0,
    followers: 0,
    following: 0,
  });
  const [githubProfile, setGithubProfile] = useState({
    location: '',
    company: '',
    blog: '',
    createdAt: '',
    htmlUrl: '',
  });

  // Fetch real GitHub data
  useEffect(() => {
    const fetchGitHubStats = async () => {
      if (user?.login) {
        try {
          const response = await fetch(`https://api.github.com/users/${user.login}`);
          if (response.ok) {
            const data = await response.json();
            setGithubStats({
              repos: data.public_repos || 0,
              publicRepos: data.public_repos || 0,
              followers: data.followers || 0,
              following: data.following || 0,
            });
            setGithubProfile({
              location: data.location || '',
              company: data.company || '',
              blog: data.blog || '',
              createdAt: data.created_at || '',
              htmlUrl: data.html_url || '',
            });
          }
        } catch (error) {
          console.error('Failed to fetch GitHub stats:', error);
        }
      }
      setLoading(false);
    };

    const timer = setTimeout(() => {
      fetchGitHubStats();
    }, 500);

    return () => clearTimeout(timer);
  }, [user]);

  // Dynamic stats based on real data
  const stats = [
    { 
      icon: Bot, 
      value: FEATURES.length, 
      label: 'AI Agents Available', 
      color: 'text-blue-500',
      suffix: ''
    },
    { 
      icon: Github, 
      value: githubStats.repos, 
      label: 'GitHub Repositories', 
      color: 'text-purple-500',
      suffix: ''
    },
    { 
      icon: Star, 
      value: githubStats.followers, 
      label: 'GitHub Followers', 
      color: 'text-yellow-500',
      suffix: ''
    },
    { 
      icon: TrendingUp, 
      value: githubStats.following, 
      label: 'GitHub Following', 
      color: 'text-green-500',
      suffix: ''
    },
  ];

  // Filter features by category
  const filteredFeatures = selectedCategory === 'all' 
    ? FEATURES 
    : FEATURES.filter(f => f.category.toLowerCase() === selectedCategory);

  // Find hero card (AI Project Generator)
  const heroFeature = FEATURES.find(f => f.id === 'project-generator');
  const regularFeatures = FEATURES.filter(f => f.id !== 'project-generator');

  // Handle agent selection
  const handleAgentClick = (agentId: string) => {
    setSelectedAgent(agentId);
  };

  const handleBackToDashboard = () => {
    setSelectedAgent(null);
  };

  // Get selected agent details
  const selectedAgentData = selectedAgent ? FEATURES.find(f => f.id === selectedAgent) : null;

  // Get gradient class based on category
  const getGradientClass = (category: string) => {
    const gradients: Record<string, string> = {
      'Generation': 'from-purple-500/10 to-purple-600/5',
      'Code Review': 'from-blue-500/10 to-blue-600/5',
      'Repository': 'from-green-500/10 to-green-600/5',
      'Testing': 'from-pink-500/10 to-pink-600/5',
      'Security': 'from-red-500/10 to-red-600/5',
      'Documentation': 'from-indigo-500/10 to-indigo-600/5',
      'Optimization': 'from-orange-500/10 to-orange-600/5',
    };
    return gradients[category] || 'from-gray-500/10 to-gray-600/5';
  };

  return (
    <SidebarProvider>
      <AppSidebar onAgentSelect={handleAgentClick} onDashboardClick={handleBackToDashboard} />
      <SidebarInset>
        {/* Header with breadcrumb */}
        <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 z-50">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleBackToDashboard();
                  }}
                  className="cursor-pointer"
                >
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              {selectedAgentData && (
                <>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{selectedAgentData.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
              {!selectedAgent && (
                <>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>AI Agents</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          {/* Show Agent Interface if selected */}
          {selectedAgent && selectedAgentData ? (
            <>
              <div className="mb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleBackToDashboard}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </div>
              <AgentInterface 
                agentId={selectedAgent}
                agentName={selectedAgentData.name}
                agentDescription={selectedAgentData.description}
                systemPrompt={`You are ${selectedAgentData.name}, ${selectedAgentData.description}`}
              />
            </>
          ) : (
            <>
              {/* Dashboard Home View */}
              <DashboardHome 
                user={user}
                githubStats={githubStats}
                githubProfile={githubProfile}
                loading={loading}
              />

              {/* Quick Access to Agents */}
              <Card className="mt-6 border-2">
                <CardHeader>
                  <CardTitle>Quick Access to AI Agents</CardTitle>
                  <CardDescription>Click on any agent from the sidebar or cards below to get started</CardDescription>
                </CardHeader>
              </Card>

              {/* Category Filter */}
              <Tabs defaultValue="all" className="my-6" onValueChange={setSelectedCategory}>
                <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-5">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="generation">Generation</TabsTrigger>
                  <TabsTrigger value="code review">Code Review</TabsTrigger>
                  <TabsTrigger value="testing">Testing</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
              </Tabs>

        {/* Bento Grid with Features */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 9 }).map((_, index) => (
              <AgentCardSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
            {/* Hero Card - AI Project Generator */}
            {heroFeature && selectedCategory === 'all' && (
              <Card 
                className="col-span-1 md:col-span-2 md:row-span-2 relative overflow-hidden cursor-pointer group border-2 hover:border-purple-500 transition-all"
                onClick={() => handleAgentClick(heroFeature.id)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${getGradientClass(heroFeature.category)} opacity-50`} />
                <BorderBeam size={250} duration={12} delay={9} />
                <Meteors number={20} />
                
                <CardContent className="relative z-10 h-full flex flex-col justify-between p-6">
                  <div>
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-20 h-20 rounded-2xl ${heroFeature.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <heroFeature.icon className={`w-10 h-10 ${heroFeature.color}`} />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {heroFeature.category}
                      </Badge>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      {heroFeature.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      {heroFeature.description}
                    </p>
                  </div>
                  
                  <ShimmerButton className="w-full mt-6">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Launch Agent
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </ShimmerButton>
                </CardContent>
              </Card>
            )}

            {/* Regular Agent Cards */}
            {(selectedCategory === 'all' ? regularFeatures : filteredFeatures).map((feature) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={feature.id}
                  className="relative group cursor-pointer hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 border-2 hover:border-blue-500"
                  onClick={() => handleAgentClick(feature.id)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${getGradientClass(feature.category)} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  
                  <CardContent className="relative z-10 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                        <Icon className={`w-7 h-7 ${feature.color}`} />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {feature.category}
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {feature.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:gap-3 transition-all">
                      <MessageSquare className="w-4 h-4" />
                      <span>Open Agent</span>
                      <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}