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

  /**
   * Retry logic for transient failures (500, 502, 503, 504)
   * Retries up to maxRetries times with exponential backoff
   */
  private async retryRequest<T>(
    fn: () => Promise<T>,
    maxRetries: number = 2,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;

        // Don't retry for non-transient errors
        const shouldRetry = error.status && [500, 502, 503, 504].includes(error.status);
        
        if (!shouldRetry || attempt === maxRetries) {
          throw error;
        }

        // Exponential backoff: wait longer after each retry
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  /**
   * Enhanced error handling for GitHub API requests
   * Provides user-friendly error messages for different scenarios
   * Includes automatic retry for transient server errors
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.token) {
      throw new Error('Authentication required. Please sign in with GitHub.');
    }

    return this.retryRequest(async () => {
      const url = `${this.baseUrl}${endpoint}`;
      const headers = {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...options.headers,
      };

      try {
        const response = await fetch(url, {
          ...options,
          headers,
        });

        if (!response.ok) {
          await this.handleErrorResponse(response, endpoint);
        }

        // Handle empty responses (e.g., DELETE requests)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        }
        
        return {} as T;
      } catch (error) {
        // Handle network errors
        if (error instanceof TypeError) {
          throw new Error('Network error. Please check your internet connection and try again.');
        }
        // Re-throw if it's already a handled error
        throw error;
      }
    });
  }

  /**
   * Handle different HTTP error status codes with specific user-friendly messages
   */
  private async handleErrorResponse(response: Response, endpoint: string): Promise<never> {
    let errorData: any = {};
    
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }

    const status = response.status;
    let errorMessage = '';

    switch (status) {
      case 401:
        errorMessage = 'Authentication failed. Your session may have expired. Please sign in again.';
        break;

      case 403:
        // Check if it's rate limiting
        if (response.headers.get('X-RateLimit-Remaining') === '0') {
          const resetTime = response.headers.get('X-RateLimit-Reset');
          const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000) : null;
          const timeUntilReset = resetDate 
            ? Math.ceil((resetDate.getTime() - Date.now()) / 60000)
            : 'unknown';
          
          errorMessage = `GitHub API rate limit exceeded. Please try again in ${timeUntilReset} minutes.`;
        } else {
          errorMessage = 'Access forbidden. You may not have permission to perform this action.';
        }
        break;

      case 404:
        errorMessage = 'Resource not found. The repository, file, or branch may not exist.';
        break;

      case 422:
        // Validation errors - check for specific cases
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const errorMessages = errorData.errors.map((e: any) => e.message).join(', ');
          
          if (errorMessages.includes('already exists')) {
            const match = endpoint.match(/repos\/([^\/]+)\/([^\/]+)/);
            const repoName = match ? match[2] : 'this name';
            errorMessage = `A repository with the name "${repoName}" already exists. Please choose a different name.`;
          } else if (errorMessages.includes('Name already exists')) {
            errorMessage = 'This name is already taken. Please choose a different one.';
          } else {
            errorMessage = `Validation error: ${errorMessages}`;
          }
        } else if (errorData.message) {
          errorMessage = `Validation error: ${errorData.message}`;
        } else {
          errorMessage = 'Invalid request. Please check your input and try again.';
        }
        break;

      case 409:
        errorMessage = 'Conflict. The resource you\'re trying to modify has been changed by someone else.';
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        errorMessage = 'GitHub is experiencing issues. Please try again in a few moments.';
        break;

      default:
        errorMessage = errorData.message || `GitHub API error (${status}). Please try again.`;
    }

    // Create error object with additional context
    const error = new Error(errorMessage);
    (error as any).status = status;
    (error as any).endpoint = endpoint;
    (error as any).originalError = errorData;
    
    throw error;
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
      throw new Error('Authentication required. Please sign in with GitHub.');
    }

    const url = `${this.baseUrl}/repos/${owner}/${repo}/pulls/${prNumber}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/vnd.github.v3.diff',
        },
      });

      if (!response.ok) {
        const status = response.status;
        let errorMessage = '';

        switch (status) {
          case 401:
            errorMessage = 'Authentication failed. Please sign in again.';
            break;
          case 403:
            errorMessage = 'Access forbidden. You may not have permission to view this pull request.';
            break;
          case 404:
            errorMessage = `Pull request #${prNumber} not found in ${owner}/${repo}.`;
            break;
          default:
            errorMessage = `Failed to fetch pull request diff (${status}). Please try again.`;
        }

        throw new Error(errorMessage);
      }

      return response.text();
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      throw error;
    }
  }

  // Create a new repository
  async createRepository(
    name: string,
    description: string,
    isPrivate: boolean = false,
    autoInit: boolean = true
  ): Promise<Repository> {
    return this.request('/user/repos', {
      method: 'POST',
      body: JSON.stringify({
        name,
        description,
        private: isPrivate,
        auto_init: autoInit,
      }),
    });
  }

  // Create an issue
  async createIssue(
    owner: string,
    repo: string,
    title: string,
    body?: string
  ): Promise<{ id: number; number: number; title: string; body: string; html_url: string }> {
    return this.request(`/repos/${owner}/${repo}/issues`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        body: body || '',
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

  // Create a pull request
  async createPullRequest(
    owner: string,
    repo: string,
    title: string,
    body: string,
    head: string,
    base: string = 'main'
  ): Promise<PullRequest> {
    return this.request(`/repos/${owner}/${repo}/pulls`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        body,
        head,
        base,
      }),
    });
  }

  // Update repository
  async updateRepository(
    owner: string,
    repo: string,
    data: {
      name?: string;
      description?: string;
      private?: boolean;
      homepage?: string;
    }
  ): Promise<Repository> {
    return this.request(`/repos/${owner}/${repo}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

export const githubAPI = new GitHubAPI();