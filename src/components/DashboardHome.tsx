"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { NumberTicker } from '@/components/ui/number-ticker';
import { Particles } from '@/components/ui/particles';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  Github,
  Star,
  GitFork,
  Users,
  Code2,
  TrendingUp,
  Calendar,
  Activity
} from 'lucide-react';

interface DashboardHomeProps {
  user: any;
  githubStats: {
    repos: number;
    followers: number;
    following: number;
  };
  githubProfile: {
    location: string;
    company: string;
    blog: string;
    createdAt: string;
  };
  loading: boolean;
}

export function DashboardHome({ user, githubStats, githubProfile, loading }: DashboardHomeProps) {
  // Mock data for charts - In real app, fetch from GitHub API
  const repoActivityData = [
    { month: "Jan", commits: 45, prs: 12 },
    { month: "Feb", commits: 52, prs: 15 },
    { month: "Mar", commits: 48, prs: 10 },
    { month: "Apr", commits: 61, prs: 18 },
    { month: "May", commits: 55, prs: 14 },
    { month: "Jun", commits: 67, prs: 20 },
  ];

  const languagesData = [
    { language: "TypeScript", percentage: 45, color: "#3178c6" },
    { language: "JavaScript", percentage: 30, color: "#f7df1e" },
    { language: "Python", percentage: 15, color: "#3776ab" },
    { language: "Go", percentage: 10, color: "#00add8" },
  ];

  const stats = [
    { 
      icon: Github, 
      value: githubStats.repos, 
      label: 'Repositories', 
      color: 'text-purple-500',
      trend: '+12%'
    },
    { 
      icon: Star, 
      value: githubStats.followers, 
      label: 'Followers', 
      color: 'text-yellow-500',
      trend: '+8%'
    },
    { 
      icon: Users, 
      value: githubStats.following, 
      label: 'Following', 
      color: 'text-green-500',
      trend: '+5%'
    },
    { 
      icon: Activity, 
      value: 234, 
      label: 'Contributions', 
      color: 'text-blue-500',
      trend: '+23%'
    },
  ];

  return (
    <>
      {/* Welcome Section with Particles */}
      <div className="relative mb-6 rounded-3xl bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 dark:from-blue-600/20 dark:via-purple-600/20 dark:to-pink-600/20 p-8 overflow-hidden">
        <Particles
          className="absolute inset-0"
          quantity={50}
          ease={80}
          color="#ffffff"
          refresh
        />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            {user?.avatar_url && (
              <img 
                src={user.avatar_url} 
                alt={user.name || user.login || 'User'} 
                className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
              />
            )}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                Welcome back, {user?.name || user?.login}! 👋
              </h1>
              {user?.bio && (
                <p className="text-gray-600 dark:text-gray-400 text-sm max-w-2xl">
                  {user.bio}
                </p>
              )}
              {githubProfile.location && (
                <Badge variant="outline" className="mt-2">
                  📍 {githubProfile.location}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                  <Badge variant="secondary" className="text-xs text-green-600">
                    {stat.trend}
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {loading ? (
                    <Skeleton className="h-9 w-16" />
                  ) : (
                    <NumberTicker value={stat.value} />
                  )}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Activity Chart */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              GitHub Activity
            </CardTitle>
            <CardDescription>Commits and PRs over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                commits: {
                  label: "Commits",
                  color: "hsl(var(--chart-1))",
                },
                prs: {
                  label: "Pull Requests",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <AreaChart data={repoActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="commits" 
                  stroke="hsl(var(--chart-1))" 
                  fill="hsl(var(--chart-1))" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="prs" 
                  stroke="hsl(var(--chart-2))" 
                  fill="hsl(var(--chart-2))" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Languages Chart */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-purple-500" />
              Top Languages
            </CardTitle>
            <CardDescription>Your most used programming languages</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                percentage: {
                  label: "Usage",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <BarChart data={languagesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="language" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="percentage" 
                  fill="hsl(var(--chart-1))"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-500" />
            Recent GitHub Activity
          </CardTitle>
          <CardDescription>Your latest contributions and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { type: "commit", repo: "IvyAI/main", message: "feat: add sidebar navigation", time: "2 hours ago" },
              { type: "pr", repo: "IvyAI/main", message: "fix: dashboard layout issues", time: "5 hours ago" },
              { type: "commit", repo: "IvyAI/main", message: "refactor: improve performance", time: "1 day ago" },
              { type: "pr", repo: "IvyAI/main", message: "docs: update README", time: "2 days ago" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'commit' ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-green-100 dark:bg-green-900/20'
                }`}>
                  {activity.type === 'commit' ? (
                    <Code2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <GitFork className="w-5 h-5 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {activity.message}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.repo} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
