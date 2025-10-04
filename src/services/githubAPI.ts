// GitHub API Service

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
}

export interface PullRequest {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: string;
  user: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  head: {
    ref: string;
    sha: string;
  };
  base: {
    ref: string;
    sha: string;
  };
  html_url: string;
  diff_url: string;
  merged: boolean;
}

export interface PRFile {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
  contents_url: string;
}

class GitHubAPI {
  private token: string | null = null;
  private baseUrl = 'https://api.github.com';

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.token) {
      throw new Error('GitHub token not set');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `GitHub API error: ${response.status}`);
    }

    return response.json();
  }

  // Get authenticated user
  async getUser() {
    return this.request<{
      login: string;
      id: number;
      avatar_url: string;
      name: string | null;
      email: string | null;
      bio: string | null;
      public_repos: number;
      followers: number;
      following: number;
    }>('/user');
  }

  // Get user repositories
  async getUserRepositories(perPage: number = 100): Promise<Repository[]> {
    return this.request<Repository[]>(`/user/repos?per_page=${perPage}&sort=updated`);
  }

  // Get pull requests for a repository
  async getPullRequests(owner: string, repo: string, state: string = 'all'): Promise<PullRequest[]> {
    return this.request<PullRequest[]>(`/repos/${owner}/${repo}/pulls?state=${state}&per_page=50`);
  }

  // Get a specific pull request
  async getPullRequest(owner: string, repo: string, prNumber: number): Promise<PullRequest> {
    return this.request<PullRequest>(`/repos/${owner}/${repo}/pulls/${prNumber}`);
  }

  // Get files changed in a pull request
  async getPullRequestFiles(owner: string, repo: string, prNumber: number): Promise<PRFile[]> {
    return this.request<PRFile[]>(`/repos/${owner}/${repo}/pulls/${prNumber}/files`);
  }

  // Post a comment on a pull request
  async postPRComment(owner: string, repo: string, prNumber: number, body: string): Promise<{ id: number; body: string; created_at: string }> {
    return this.request(`/repos/${owner}/${repo}/issues/${prNumber}/comments`, {
      method: 'POST',
      body: JSON.stringify({ body }),
    });
  }

  // Create a review on a pull request
  async createPRReview(
    owner: string, 
    repo: string, 
    prNumber: number, 
    body: string, 
    event: 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT' = 'COMMENT'
  ): Promise<{ id: number; body: string; state: string; created_at: string }> {
    return this.request(`/repos/${owner}/${repo}/pulls/${prNumber}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ body, event }),
    });
  }

  // Get diff for a pull request
  async getPullRequestDiff(owner: string, repo: string, prNumber: number): Promise<string> {
    if (!this.token) {
      throw new Error('GitHub token not set');
    }

    const url = `${this.baseUrl}/repos/${owner}/${repo}/pulls/${prNumber}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github.v3.diff',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch diff: ${response.status}`);
    }

    return response.text();
  }
}

export const githubAPI = new GitHubAPI();