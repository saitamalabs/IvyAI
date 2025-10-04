# 📚 IvyAI - API Documentation

## Overview

IvyAI provides three main service layers for AI-powered development tools:
1. **AIML API Service** - Multi-model AI integration
2. **GitHub API Service** - Repository and code management
3. **Project Generator Service** - Autonomous project creation

---

## AIML API Service

**File**: `src/services/aimlAPI.ts`

### Configuration

```typescript
import { aimlAPI } from '@/services/aimlAPI';

// Initialize with API key
aimlAPI.setApiKey(process.env.NEXT_PUBLIC_AIMLAPI_KEY!);
```

### Supported Models

| Model | ID | Best For | Max Tokens |
|-------|-----|----------|------------|
| Claude 3.5 Sonnet | `anthropic/claude-3.5-sonnet` | Architecture, refactoring | 8192 |
| Gemini 2.0 Flash | `google/gemini-2.0-flash-exp` | Code generation | 8192 |
| GPT-4o | `openai/gpt-4o` | Testing, debugging | 4096 |

### Methods

#### `chat(messages, model, taskType)`

General purpose AI chat completion.

```typescript
const response = await aimlAPI.chat(
  [
    { role: 'system', content: 'You are a helpful coding assistant.' },
    { role: 'user', content: 'Explain async/await in JavaScript' }
  ],
  'auto', // or 'claude', 'gemini', 'gpt4'
  'general'
);
```

**Parameters:**
- `messages`: Array of message objects with `role` and `content`
- `model`: 'auto' | 'claude' | 'gemini' | 'gpt4'
- `taskType`: String describing the task (used for auto-selection)

**Returns**: `Promise<string>`

---

#### `chatStream(messages, model, taskType)`

Streaming chat completion for real-time responses.

```typescript
const stream = aimlAPI.chatStream(
  [{ role: 'user', content: 'Write a React component' }],
  'gemini',
  'code-generation'
);

for await (const chunk of stream) {
  if (!chunk.done) {
    console.log(chunk.text);
  }
}
```

**Returns**: `AsyncGenerator<AIStreamChunk>`

---

#### `generateCode(description, language, context?)`

Generate code from natural language description.

```typescript
const code = await aimlAPI.generateCode(
  'Create a login form with validation',
  'typescript',
  'Using React and Zod for validation'
);
```

**Parameters:**
- `description`: Natural language description of what to generate
- `language`: Programming language (typescript, javascript, python, etc.)
- `context`: Optional additional context

**Returns**: `Promise<string>` - Generated code

---

#### `refactorCode(code, language, instructions?)`

Refactor existing code to improve quality.

```typescript
const refactoredCode = await aimlAPI.refactorCode(
  originalCode,
  'typescript',
  'Use async/await instead of promises'
);
```

**Parameters:**
- `code`: Code to refactor
- `language`: Programming language
- `instructions`: Optional specific refactoring instructions

**Returns**: `Promise<string>` - Refactored code

---

#### `analyzeCode(code, language)`

Comprehensive code analysis for bugs, security, and performance.

```typescript
const analysis = await aimlAPI.analyzeCode(code, 'typescript');

console.log(analysis.score); // 1-10
console.log(analysis.bugs); // Array of bug descriptions
console.log(analysis.security); // Security issues
console.log(analysis.performance); // Performance suggestions
console.log(analysis.bestPractices); // Best practice recommendations
```

**Returns**: `Promise<CodeAnalysisResult>`

```typescript
interface CodeAnalysisResult {
  score: number; // 1-10
  bugs: string[];
  security: string[];
  performance: string[];
  bestPractices: string[];
  suggestions: string[];
}
```

---

#### `generateTests(code, language, framework?)`

Generate comprehensive unit tests.

```typescript
const tests = await aimlAPI.generateTests(
  functionCode,
  'typescript',
  'vitest'
);
```

**Parameters:**
- `code`: Code to test
- `language`: Programming language
- `framework`: Testing framework (jest, vitest, mocha, etc.)

**Returns**: `Promise<string>` - Test code

---

#### `generateDocumentation(code, language, docType)`

Generate documentation for code.

```typescript
const docs = await aimlAPI.generateDocumentation(
  code,
  'typescript',
  'inline' // or 'readme', 'api'
);
```

**Parameters:**
- `code`: Code to document
- `language`: Programming language
- `docType`: 'inline' | 'readme' | 'api'

**Returns**: `Promise<string>` - Documentation

---

#### `fixBugs(code, language, bugDescription?)`

Identify and fix bugs in code.

```typescript
const fixedCode = await aimlAPI.fixBugs(
  buggyCode,
  'javascript',
  'Fix memory leak in event listeners'
);
```

**Returns**: `Promise<string>` - Fixed code

---

#### `explainCode(code, language)`

Get detailed explanation of code functionality.

```typescript
const explanation = await aimlAPI.explainCode(code, 'python');
```

**Returns**: `Promise<string>` - Code explanation

---

#### `convertCode(code, fromLanguage, toLanguage)`

Convert code between programming languages.

```typescript
const jsCode = await aimlAPI.convertCode(
  pythonCode,
  'python',
  'javascript'
);
```

**Returns**: `Promise<string>` - Converted code

---

## GitHub API Service

**File**: `src/services/githubAPI.ts`

### Configuration

```typescript
import { githubAPI } from '@/services/githubAPI';

// Set access token
githubAPI.setToken(accessToken);
```

### Authentication Methods

#### `getUser()`

Get authenticated user information.

```typescript
const user = await githubAPI.getUser();
// Returns: { login, id, avatar_url, name, email, bio, public_repos, followers, following }
```

---

### Repository Methods

#### `getUserRepositories(perPage?)`

Get user's repositories.

```typescript
const repos = await githubAPI.getUserRepositories(100);
```

**Parameters:**
- `perPage`: Number of repos per page (default: 100)

**Returns**: `Promise<Repository[]>`

---

#### `createRepository(name, description, isPrivate?)`

Create a new repository.

```typescript
const repo = await githubAPI.createRepository(
  'my-new-project',
  'An awesome project',
  false
);
```

**Returns**: `Promise<Repository>`

---

#### `getRepository(owner, repo)`

Get repository details.

```typescript
const repo = await githubAPI.getRepository('username', 'repo-name');
```

---

#### `deleteRepository(owner, repo)`

Delete a repository (use with caution!).

```typescript
await githubAPI.deleteRepository('username', 'repo-name');
```

---

#### `forkRepository(owner, repo)`

Fork a repository.

```typescript
const forkedRepo = await githubAPI.forkRepository('original-owner', 'repo-name');
```

---

### File Operations

#### `createOrUpdateFile(owner, repo, path, content, message, sha?)`

Create or update a file in repository.

```typescript
await githubAPI.createOrUpdateFile(
  'username',
  'repo-name',
  'src/index.ts',
  'console.log("Hello");',
  'Add index.ts'
);
```

**Parameters:**
- `sha`: Required for updates (file's current SHA)

---

#### `getFileContent(owner, repo, path)`

Get file content from repository.

```typescript
const { content, sha } = await githubAPI.getFileContent(
  'username',
  'repo-name',
  'README.md'
);
```

---

#### `deleteFile(owner, repo, path, message, sha)`

Delete a file from repository.

```typescript
await githubAPI.deleteFile(
  'username',
  'repo-name',
  'old-file.js',
  'Remove old file',
  fileSHA
);
```

---

### Pull Request Methods

#### `getPullRequests(owner, repo, state?)`

Get pull requests for a repository.

```typescript
const prs = await githubAPI.getPullRequests('username', 'repo-name', 'open');
```

**Parameters:**
- `state`: 'open' | 'closed' | 'all' (default: 'all')

---

#### `getPullRequest(owner, repo, prNumber)`

Get specific pull request.

```typescript
const pr = await githubAPI.getPullRequest('username', 'repo-name', 42);
```

---

#### `getPullRequestFiles(owner, repo, prNumber)`

Get files changed in a pull request.

```typescript
const files = await githubAPI.getPullRequestFiles('username', 'repo-name', 42);
```

---

#### `postPRComment(owner, repo, prNumber, body)`

Post a comment on a pull request.

```typescript
await githubAPI.postPRComment(
  'username',
  'repo-name',
  42,
  'Great work! LGTM 👍'
);
```

---

#### `createPRReview(owner, repo, prNumber, body, event)`

Create a review on a pull request.

```typescript
await githubAPI.createPRReview(
  'username',
  'repo-name',
  42,
  'Review comments here',
  'APPROVE' // or 'REQUEST_CHANGES', 'COMMENT'
);
```

---

### Branch Operations

#### `listBranches(owner, repo)`

List all branches.

```typescript
const branches = await githubAPI.listBranches('username', 'repo-name');
```

---

#### `createBranch(owner, repo, branchName, fromBranch?)`

Create a new branch.

```typescript
await githubAPI.createBranch(
  'username',
  'repo-name',
  'feature/new-feature',
  'main'
);
```

---

## Project Generator Service

**File**: `src/services/projectGenerator.ts`

### Configuration

```typescript
import { projectGenerator } from '@/services/projectGenerator';
```

### Methods

#### `generateProject(config, onProgress?)`

Generate a complete project structure.

```typescript
const config: ProjectConfig = {
  name: 'my-app',
  description: 'An awesome app',
  framework: 'nextjs',
  database: 'postgresql',
  features: {
    authentication: true,
    api: 'rest',
    testing: true,
    deployment: true
  },
  styling: 'tailwind'
};

const files = await projectGenerator.generateProject(
  config,
  (progress) => {
    console.log(`${progress.step}: ${progress.message} (${progress.progress}%)`);
  }
);
```

**Parameters:**
- `config`: Project configuration object
- `onProgress`: Optional callback for progress updates

**Returns**: `Promise<ProjectFile[]>`

```typescript
interface ProjectFile {
  path: string;
  content: string;
}
```

---

#### `deployToGitHub(files, repoName, description, onProgress?)`

Deploy generated project to GitHub.

```typescript
const repoUrl = await projectGenerator.deployToGitHub(
  files,
  'my-new-project',
  'Project description',
  (progress) => {
    console.log(progress.message);
  }
);
```

**Returns**: `Promise<string>` - Repository URL

---

## TypeScript Types

### Common Types

```typescript
// AI Models
type AIModel = 'claude' | 'gemini' | 'gpt4' | 'auto';

// Project Frameworks
type Framework = 'nextjs' | 'react' | 'vue' | 'express' | 'nestjs' | 'django' | 'mern' | 't3';

// Databases
type Database = 'postgresql' | 'mongodb' | 'mysql' | 'sqlite' | 'none';

// Styling Options
type Styling = 'tailwind' | 'css-modules' | 'styled-components' | 'sass';

// Project Configuration
interface ProjectConfig {
  name: string;
  description: string;
  framework: Framework;
  database?: Database;
  features: {
    authentication?: boolean;
    api?: 'rest' | 'graphql';
    testing?: boolean;
    deployment?: boolean;
  };
  styling?: Styling;
}

// GitHub Repository
interface Repository {
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

// Pull Request
interface PullRequest {
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
  html_url: string;
  merged: boolean;
}
```

---

## Error Handling

All services throw errors that should be caught:

```typescript
try {
  const result = await aimlAPI.generateCode('Create a button', 'typescript');
} catch (error: any) {
  console.error('AI Error:', error.message);
  // Handle error appropriately
}
```

Common error types:
- **API Key Errors**: Invalid or missing API keys
- **Rate Limit Errors**: Too many requests
- **Network Errors**: Connection issues
- **Validation Errors**: Invalid parameters

---

## Best Practices

### 1. API Key Management

```typescript
// ✅ Good - Check for API key
const apiKey = process.env.NEXT_PUBLIC_AIMLAPI_KEY;
if (!apiKey) {
  throw new Error('API key not configured');
}
aimlAPI.setApiKey(apiKey);

// ❌ Bad - Assume API key exists
aimlAPI.setApiKey(process.env.NEXT_PUBLIC_AIMLAPI_KEY!);
```

### 2. Error Handling

```typescript
// ✅ Good - Handle errors gracefully
try {
  const code = await aimlAPI.generateCode(prompt, language);
  return code;
} catch (error: any) {
  toast.error('Code generation failed', {
    description: error.message
  });
  return null;
}
```

### 3. Progress Feedback

```typescript
// ✅ Good - Provide user feedback
const files = await projectGenerator.generateProject(config, (progress) => {
  setProgress(progress.progress);
  setMessage(progress.message);
});
```

### 4. Type Safety

```typescript
// ✅ Good - Use TypeScript types
const analysis: CodeAnalysisResult = await aimlAPI.analyzeCode(code, 'typescript');

// ❌ Bad - Untyped results
const analysis = await aimlAPI.analyzeCode(code, 'typescript');
```

---

## Rate Limits

### AIML API
- **Free Tier**: 100 requests/day
- **Pro Tier**: 10,000 requests/day
- **Enterprise**: Unlimited

### GitHub API
- **Authenticated**: 5,000 requests/hour
- **Search**: 30 requests/minute

---

## Examples

### Complete AI Playground Flow

```typescript
import { aimlAPI } from '@/services/aimlAPI';

async function playgroundExample() {
  // Initialize
  aimlAPI.setApiKey(process.env.NEXT_PUBLIC_AIMLAPI_KEY!);
  
  const userCode = `
    function hello(name) {
      console.log('Hello ' + name);
    }
  `;
  
  // Analyze code
  const analysis = await aimlAPI.analyzeCode(userCode, 'javascript');
  console.log('Code Score:', analysis.score);
  
  // Refactor code
  const refactored = await aimlAPI.refactorCode(
    userCode,
    'javascript',
    'Use template literals and add type annotations'
  );
  
  // Generate tests
  const tests = await aimlAPI.generateTests(refactored, 'javascript', 'jest');
  
  // Generate documentation
  const docs = await aimlAPI.generateDocumentation(refactored, 'javascript', 'inline');
  
  return { analysis, refactored, tests, docs };
}
```

### Complete Project Generation Flow

```typescript
import { projectGenerator } from '@/services/projectGenerator';
import { githubAPI } from '@/services/githubAPI';

async function createFullProject() {
  // Set GitHub token
  githubAPI.setToken(accessToken);
  
  // Configure project
  const config: ProjectConfig = {
    name: 'awesome-app',
    description: 'My awesome application',
    framework: 'nextjs',
    database: 'postgresql',
    features: {
      authentication: true,
      api: 'rest',
      testing: true,
      deployment: true
    },
    styling: 'tailwind'
  };
  
  // Generate project
  const files = await projectGenerator.generateProject(config, (progress) => {
    console.log(`[${progress.progress}%] ${progress.message}`);
  });
  
  // Deploy to GitHub
  const repoUrl = await projectGenerator.deployToGitHub(
    files,
    config.name,
    config.description,
    (progress) => {
      console.log(`[${progress.progress}%] ${progress.message}`);
    }
  );
  
  console.log('Project deployed:', repoUrl);
  return repoUrl;
}
```

---

## Changelog

### v1.0.0 (Current)
- ✅ Multi-model AI integration (Claude, Gemini, GPT-4)
- ✅ Complete GitHub API wrapper
- ✅ Autonomous project generator
- ✅ Code analysis and refactoring
- ✅ Test and documentation generation

### Future Versions
- v1.1.0: Real-time collaboration
- v1.2.0: Custom AI model training
- v2.0.0: Plugin system

---

**Last Updated**: October 2025  
**API Version**: 1.0.0  
**Maintainers**: IvyAI Team
