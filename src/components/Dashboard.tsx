"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { githubAPI, Repository, PullRequest } from '@/services/githubAPI';
import Header from './Header';
import PRCard from './PRCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, AlertCircle, FolderGit2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
            Select a repository to view and review pull requests
          </p>
        </div>

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