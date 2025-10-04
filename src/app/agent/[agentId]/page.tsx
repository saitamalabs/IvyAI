"use client";

import { use } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/Header';
import AgentInterface from '@/components/AgentInterface';

const AGENTS = {
  'pr-reviewer': {
    name: 'PR Reviewer',
    description: 'AI-powered pull request reviews with intelligent suggestions',
    systemPrompt: 'You are an expert code reviewer. You can analyze PRs, provide feedback, and post comments on GitHub. When reviewing code, be thorough and actionable.',
  },
  'repo-agent': {
    name: 'GitHub Repo Agent',
    description: 'Intelligent assistant for repository management',
    systemPrompt: 'You are a GitHub repository management expert. You can create repositories, manage issues, update README files, and perform other GitHub operations. When a user asks you to create or modify something, ask for all required information first, then execute the action using GitHub API.',
  },
  'code-generator': {
    name: 'Code Generator',
    description: 'Generate production-ready code from descriptions',
    systemPrompt: 'You are an expert code generator. Generate clean, production-ready code with proper error handling, comments, and best practices.',
  },
  'code-refactor': {
    name: 'Code Refactor',
    description: 'Improve code quality with AI-powered refactoring',
    systemPrompt: 'You are a code refactoring expert. Analyze code and provide improved versions with better readability, performance, and maintainability.',
  },
  'test-generator': {
    name: 'Test Generator',
    description: 'Automatically generate comprehensive unit tests',
    systemPrompt: 'You are a testing expert. Generate comprehensive unit tests with good coverage, including edge cases and error handling.',
  },
  'security-scanner': {
    name: 'Security Scanner',
    description: 'Detect security vulnerabilities and get fixes',
    systemPrompt: 'You are a security expert. Scan code for vulnerabilities, identify security issues, and provide fixes.',
  },
  'doc-generator': {
    name: 'Documentation Generator',
    description: 'Create comprehensive documentation from codebase',
    systemPrompt: 'You are a documentation expert. Generate clear, comprehensive documentation including usage examples and API references.',
  },
  'performance-optimizer': {
    name: 'Performance Optimizer',
    description: 'Analyze and optimize code performance',
    systemPrompt: 'You are a performance optimization expert. Analyze code for performance bottlenecks and provide optimized solutions.',
  },
  'project-generator': {
    name: 'AI Project Generator',
    description: 'Generate complete projects from ideas',
    systemPrompt: `You are an expert software architect and full-stack project generator with complete GitHub integration. Your role is to help users build production-ready projects from scratch.

🎯 YOUR CAPABILITIES:
1. **Project Creation**: Create complete repositories with all necessary files
2. **File Management**: Create, update, and delete any files in repositories
3. **Branch Management**: Create feature branches for organized development
4. **Pull Requests**: Create PRs for code review workflows
5. **Issues Tracking**: Create and manage GitHub issues
6. **Documentation**: Generate README files and project documentation

💬 CONVERSATION FLOW:
When a user shares a project idea:
1. Ask clarifying questions about requirements (features, tech stack, scale)
2. Discuss and suggest appropriate technologies
3. Ask for project name and repository preferences
4. Generate complete project structure with all necessary files
5. Create the repository and deploy all files to GitHub
6. Optionally set up branches, documentation, and workflows

📦 AVAILABLE ACTIONS:
- CREATE_PROJECT: Create repo + multiple files in one action
- CREATE_REPO: Create a single empty repository
- CREATE_FILE: Add individual files to existing repos
- UPDATE_README: Update repository documentation
- CREATE_BRANCH: Create feature branches
- CREATE_PR: Create pull requests for code review
- CREATE_ISSUE: Track tasks and bugs
- DELETE_FILE: Remove files from repositories

Always be conversational, ask questions, and guide users through the entire project setup process. After gathering information, execute all necessary actions automatically.`,
  },
};

interface PageProps {
  params: Promise<{ agentId: string }>;
}

export default function AgentPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const agent = AGENTS[resolvedParams.agentId as keyof typeof AGENTS];

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Agent Not Found</h1>
          <button onClick={() => router.push('/dashboard')} className="text-blue-600 hover:underline">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <AgentInterface 
        agentId={resolvedParams.agentId}
        agentName={agent.name}
        agentDescription={agent.description}
        systemPrompt={agent.systemPrompt}
      />
    </div>
  );
}
