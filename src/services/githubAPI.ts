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

  // Create a new repository
  async createRepository(
    name: string,
    description: string,
    isPrivate: boolean = false
  ): Promise<Repository> {
    return this.request('/user/repos', {
      method: 'POST',
      body: JSON.stringify({
        name,
        description,
        private: isPrivate,
        auto_init: true,
      }),
    });
  }

  // Create or update a file in a repository
  async createOrUpdateFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    sha?: string
  ): Promise<{ content: { sha: string }; commit: { sha: string } }> {
    const encodedContent = btoa(unescape(encodeURIComponent(content)));
    
    return this.request(`/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: encodedContent,
        ...(sha && { sha }),
      }),
    });
  }

  // Get file content from repository
  async getFileContent(
    owner: string,
    repo: string,
    path: string
  ): Promise<{ content: string; sha: string }> {
    const response = await this.request<{
      content: string;
      encoding: string;
      sha: string;
    }>(`/repos/${owner}/${repo}/contents/${path}`);

    const content = atob(response.content);
    return {
      content,
      sha: response.sha,
    };
  }

  // Delete a file from repository
  async deleteFile(
    owner: string,
    repo: string,
    path: string,
    message: string,
    sha: string
  ): Promise<void> {
    await this.request(`/repos/${owner}/${repo}/contents/${path}`, {
      method: 'DELETE',
      body: JSON.stringify({
        message,
        sha,
      }),
    });
  }

  // List branches
  async listBranches(owner: string, repo: string): Promise<{ name: string; commit: { sha: string } }[]> {
    return this.request(`/repos/${owner}/${repo}/branches`);
  }

  // Create a branch
  async createBranch(
    owner: string,
    repo: string,
    branchName: string,
    fromBranch: string = 'main'
  ): Promise<{ ref: string; object: { sha: string } }> {
    // Get SHA of the source branch
    const sourceBranch = await this.request<{ object: { sha: string } }>(
      `/repos/${owner}/${repo}/git/ref/heads/${fromBranch}`
    );

    return this.request(`/repos/${owner}/${repo}/git/refs`, {
      method: 'POST',
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha: sourceBranch.object.sha,
      }),
    });
  }

  // Fork a repository
  async forkRepository(owner: string, repo: string): Promise<Repository> {
    return this.request(`/repos/${owner}/${repo}/forks`, {
      method: 'POST',
    });
  }

  // Delete a repository
  async deleteRepository(owner: string, repo: string): Promise<void> {
    await this.request(`/repos/${owner}/${repo}`, {
      method: 'DELETE',
    });
  }

  // Get repository details
  async getRepository(owner: string, repo: string): Promise<Repository> {
    return this.request(`/repos/${owner}/${repo}`);
  }

  // Create a commit
  async createCommit(
    owner: string,
    repo: string,
    message: string,
    tree: string,
    parents: string[]
  ): Promise<{ sha: string }> {
    return this.request(`/repos/${owner}/${repo}/git/commits`, {
      method: 'POST',
      body: JSON.stringify({
        message,
        tree,
        parents,
      }),
    });
  }
}

export const githubAPI = new GitHubAPI();