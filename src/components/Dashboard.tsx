"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { githubAPI, Repository, PullRequest } from '@/services/githubAPI';
import Header from './Header';
import PRCard from './PRCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, FolderGit2, Sparkles, Rocket, Code, GitBranch, Star, GitFork, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const { user, accessToken } = useAuth();
  const router = useRouter();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRepositories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const repos = await githubAPI.getUserRepositories();
      setRepositories(repos);
    } catch (err) {
      setError('Failed to load repositories. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      githubAPI.setToken(accessToken);
      loadRepositories();
    }
  }, [accessToken, loadRepositories]);

  const handleRepoChange = async (repoFullName: string) => {
    const repo = repositories.find(r => r.full_name === repoFullName);
    if (!repo) return;

    setSelectedRepo(repo);
    setLoading(true);
    setError(null);
    try {
      const [owner, repoName] = repo.full_name.split('/');
      const prs = await githubAPI.getPullRequests(owner, repoName);
      setPullRequests(prs);
    } catch (err) {
      setError('Failed to load pull requests. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewPR = (pr: PullRequest) => {
    if (selectedRepo) {
      const [owner, repoName] = selectedRepo.full_name.split('/');
      router.push(`/review?owner=${owner}&repo=${repoName}&pr=${pr.number}`);
    }
  };

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
            Your AI-powered coding workspace
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200 dark:border-blue-800">
            <Link href="/playground">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
                <CardTitle className="text-lg">AI Playground</CardTitle>
                <CardDescription className="text-sm">
                  Interactive coding with multi-model AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Generate, refactor, and analyze code
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200 dark:border-purple-800">
            <Link href="/projects">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Rocket className="w-8 h-8 text-purple-600" />
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
                <CardTitle className="text-lg">Project Generator</CardTitle>
                <CardDescription className="text-sm">
                  Create full-stack projects with AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Autonomous project scaffolding
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-green-200 dark:border-green-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Code className="w-8 h-8 text-green-600" />
                <Badge variant="secondary">Active</Badge>
              </div>
              <CardTitle className="text-lg">PR Reviewer</CardTitle>
              <CardDescription className="text-sm">
                AI-powered code reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Select a repository below to review PRs
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        {user && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Repositories</p>
                    <p className="text-2xl font-bold">{repositories.length}</p>
                  </div>
                  <FolderGit2 className="w-8 h-8 text-blue-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Public Repos</p>
                    <p className="text-2xl font-bold">{user.public_repos}</p>
                  </div>
                  <GitBranch className="w-8 h-8 text-green-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Followers</p>
                    <p className="text-2xl font-bold">{user.followers}</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Following</p>
                    <p className="text-2xl font-bold">{user.following}</p>
                  </div>
                  <GitFork className="w-8 h-8 text-purple-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Repository Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Repository</CardTitle>
            <CardDescription>
              Choose a repository to view its pull requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={handleRepoChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a repository" />
              </SelectTrigger>
              <SelectContent>
                {repositories.map((repo) => (
                  <SelectItem key={repo.id} value={repo.full_name}>
                    <div className="flex items-center gap-2">
                      <FolderGit2 className="w-4 h-4" />
                      <span>{repo.full_name}</span>
                      {repo.private && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                          Private
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Pull Requests List */}
        {!loading && selectedRepo && pullRequests.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Pull Requests ({pullRequests.length})
            </h3>
            <div className="space-y-4">
              {pullRequests.map((pr) => (
                <PRCard key={pr.id} pr={pr} onReview={() => handleReviewPR(pr)} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && selectedRepo && pullRequests.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FolderGit2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Pull Requests Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                This repository doesn't have any pull requests yet.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Initial State */}
        {!loading && !selectedRepo && repositories.length > 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FolderGit2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Select a Repository
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose a repository from the dropdown above to view its pull requests
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}