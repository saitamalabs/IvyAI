"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { githubAPI, Repository, PullRequest } from '@/services/githubAPI';
import { aimlAPI } from '@/services/aimlAPI';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Send,
  Loader2,
  User,
  Bot,
  FolderGit2,
  GitPullRequest,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Code,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  action?: {
    type: string;
    status: 'pending' | 'completed' | 'failed';
    data?: any;
  };
}

interface AgentInterfaceProps {
  agentId: string;
  agentName: string;
  agentDescription: string;
  systemPrompt: string;
}

export default function AgentInterface({
  agentId,
  agentName,
  agentDescription,
  systemPrompt,
}: AgentInterfaceProps) {
  const { accessToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [selectedPR, setSelectedPR] = useState<PullRequest | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_AIMLAPI_KEY;
    if (apiKey) {
      aimlAPI.setApiKey(apiKey);
    }
    if (accessToken) {
      githubAPI.setToken(accessToken);
      // Load repos for agents that need repository selection
      if (agentId === 'pr-reviewer' || agentId === 'repo-agent') {
        loadRepositories();
      }
    }

    // Welcome message
    setMessages([{
      role: 'assistant',
      content: `Hi! I'm the ${agentName}. ${agentDescription}\n\nHow can I help you today?`,
      timestamp: new Date()
    }]);
  }, [agentId, agentName, agentDescription, accessToken]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadRepositories = async () => {
    try {
      const repos = await githubAPI.getUserRepositories();
      setRepositories(repos);
    } catch (error) {
      console.error('Failed to load repositories:', error);
    }
  };

  const handleRepoChange = async (repoFullName: string) => {
    const repo = repositories.find(r => r.full_name === repoFullName);
    if (!repo) return;

    setSelectedRepo(repo);
    try {
      const [owner, repoName] = repo.full_name.split('/');
      const prs = await githubAPI.getPullRequests(owner, repoName);
      setPullRequests(prs);

      setMessages(prev => [...prev, {
        role: 'system',
        content: `Selected repository: ${repo.full_name} (${prs.length} open PRs)`,
        timestamp: new Date()
      }]);
    } catch (error) {
      toast.error('Failed to load pull requests');
    }
  };

  const handlePRSelect = (pr: PullRequest) => {
    setSelectedPR(pr);
    setMessages(prev => [...prev, {
      role: 'system',
      content: `Selected PR #${pr.number}: "${pr.title}"`,
      timestamp: new Date()
    }]);
  };

  // Parse AI response for action requests
  const parseActionRequest = (response: string): any => {
    // Check if AI is requesting to create a repository
    if (response.includes('[CREATE_REPO]')) {
      const match = response.match(/\[CREATE_REPO\]([\s\S]*?)\[\/CREATE_REPO\]/);
      if (match) {
        try {
          return { type: 'create_repo', data: JSON.parse(match[1]) };
        } catch (e) {
          return null;
        }
      }
    }

    // Check for other actions
    if (response.includes('[CREATE_ISSUE]')) {
      const match = response.match(/\[CREATE_ISSUE\]([\s\S]*?)\[\/CREATE_ISSUE\]/);
      if (match) {
        try {
          return { type: 'create_issue', data: JSON.parse(match[1]) };
        } catch (e) {
          return null;
        }
      }
    }

    if (response.includes('[UPDATE_README]')) {
      const match = response.match(/\[UPDATE_README\]([\s\S]*?)\[\/UPDATE_README\]/);
      if (match) {
        try {
          return { type: 'update_readme', data: JSON.parse(match[1]) };
        } catch (e) {
          return null;
        }
      }
    }

    if (response.includes('[CREATE_FILE]')) {
      const match = response.match(/\[CREATE_FILE\]([\s\S]*?)\[\/CREATE_FILE\]/);
      if (match) {
        try {
          return { type: 'create_file', data: JSON.parse(match[1]) };
        } catch (e) {
          return null;
        }
      }
    }

    if (response.includes('[CREATE_PROJECT]')) {
      const match = response.match(/\[CREATE_PROJECT\]([\s\S]*?)\[\/CREATE_PROJECT\]/);
      if (match) {
        try {
          return { type: 'create_project', data: JSON.parse(match[1]) };
        } catch (e) {
          return null;
        }
      }
    }

    if (response.includes('[CREATE_BRANCH]')) {
      const match = response.match(/\[CREATE_BRANCH\]([\s\S]*?)\[\/CREATE_BRANCH\]/);
      if (match) {
        try {
          return { type: 'create_branch', data: JSON.parse(match[1]) };
        } catch (e) {
          return null;
        }
      }
    }

    if (response.includes('[CREATE_PR]')) {
      const match = response.match(/\[CREATE_PR\]([\s\S]*?)\[\/CREATE_PR\]/);
      if (match) {
        try {
          return { type: 'create_pr', data: JSON.parse(match[1]) };
        } catch (e) {
          return null;
        }
      }
    }

    if (response.includes('[DELETE_FILE]')) {
      const match = response.match(/\[DELETE_FILE\]([\s\S]*?)\[\/DELETE_FILE\]/);
      if (match) {
        try {
          return { type: 'delete_file', data: JSON.parse(match[1]) };
        } catch (e) {
          return null;
        }
      }
    }

    return null;
  };

  // Execute GitHub actions
  const executeAction = async (action: any, messageIndex: number) => {
    try {
      let result: any;
      
      switch (action.type) {
        case 'create_repo':
          result = await githubAPI.createRepository(
            action.data.name,
            action.data.description,
            action.data.private || false,
            action.data.auto_init || false
          );
          
          setMessages(prev => prev.map((msg, idx) => 
            idx === messageIndex 
              ? { ...msg, action: { ...msg.action!, status: 'completed', data: result } }
              : msg
          ));
          
          toast.success(`Repository "${action.data.name}" created successfully!`);
          await loadRepositories();
          break;

        case 'create_issue':
          if (!selectedRepo) {
            toast.error('Please select a repository first');
            return;
          }
          const [owner, repo] = selectedRepo.full_name.split('/');
          result = await githubAPI.createIssue(
            owner,
            repo,
            action.data.title,
            action.data.body
          );
          
          setMessages(prev => prev.map((msg, idx) => 
            idx === messageIndex 
              ? { ...msg, action: { ...msg.action!, status: 'completed', data: result } }
              : msg
          ));
          
          toast.success('Issue created successfully!');
          break;

        case 'update_readme':
          if (!selectedRepo) {
            toast.error('Please select a repository first');
            return;
          }
          const [ownerReadme, repoReadme] = selectedRepo.full_name.split('/');
          try {
            const existingFile = await githubAPI.getFileContent(ownerReadme, repoReadme, 'README.md').catch(() => null);
            result = await githubAPI.createOrUpdateFile(
              ownerReadme,
              repoReadme,
              'README.md',
              action.data.content,
              'Update README.md',
              existingFile?.sha
            );
            setMessages(prev => prev.map((msg, idx) => 
              idx === messageIndex 
                ? { ...msg, action: { ...msg.action!, status: 'completed', data: result } }
                : msg
            ));
            toast.success('README updated successfully!');
          } catch (err: any) {
            throw err;
          }
          break;

        case 'create_file':
          if (!selectedRepo) {
            toast.error('Please select a repository first');
            return;
          }
          const [ownerFile, repoFile] = selectedRepo.full_name.split('/');
          result = await githubAPI.createOrUpdateFile(
            ownerFile,
            repoFile,
            action.data.path,
            action.data.content,
            action.data.message || `Create ${action.data.path}`
          );
          
          setMessages(prev => prev.map((msg, idx) => 
            idx === messageIndex 
              ? { ...msg, action: { ...msg.action!, status: 'completed', data: result } }
              : msg
          ));
          
          toast.success(`File "${action.data.path}" created successfully!`);
          break;

        case 'create_project':
          // Create repo first
          toast('Creating repository...', { icon: '🚀' });
          const newRepo = await githubAPI.createRepository(
            action.data.repoName,
            action.data.description,
            action.data.private || false,
            false  // Don't auto-init to avoid conflicts
          );
          
          // Then create all files
          const files = action.data.files || [];
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            toast(`Creating ${file.path}... (${i + 1}/${files.length})`, { icon: '📄' });
            
            await githubAPI.createOrUpdateFile(
              newRepo.owner.login,
              newRepo.name,
              file.path,
              file.content,
              file.message || `Add ${file.path}`
            );
          }
          
          result = { repo: newRepo, filesCreated: files.length };
          
          setMessages(prev => prev.map((msg, idx) => 
            idx === messageIndex 
              ? { ...msg, action: { ...msg.action!, status: 'completed', data: result } }
              : msg
          ));
          
          toast.success(`Project created with ${files.length} files!`);
          await loadRepositories();
          break;

        case 'create_branch':
          if (!selectedRepo) {
            toast.error('Please select a repository first');
            return;
          }
          const [ownerBranch, repoBranch] = selectedRepo.full_name.split('/');
          result = await githubAPI.createBranch(
            ownerBranch,
            repoBranch,
            action.data.branchName,
            action.data.fromBranch || 'main'
          );
          
          setMessages(prev => prev.map((msg, idx) => 
            idx === messageIndex 
              ? { ...msg, action: { ...msg.action!, status: 'completed', data: result } }
              : msg
          ));
          
          toast.success(`Branch "${action.data.branchName}" created!`);
          break;

        case 'create_pr':
          if (!selectedRepo) {
            toast.error('Please select a repository first');
            return;
          }
          const [ownerPR, repoPR] = selectedRepo.full_name.split('/');
          result = await githubAPI.createPullRequest(
            ownerPR,
            repoPR,
            action.data.title,
            action.data.body || '',
            action.data.head,
            action.data.base || 'main'
          );
          
          setMessages(prev => prev.map((msg, idx) => 
            idx === messageIndex 
              ? { ...msg, action: { ...msg.action!, status: 'completed', data: result } }
              : msg
          ));
          
          toast.success(`Pull Request #${result.number} created!`);
          break;

        case 'delete_file':
          if (!selectedRepo) {
            toast.error('Please select a repository first');
            return;
          }
          const [ownerDel, repoDel] = selectedRepo.full_name.split('/');
          const fileToDelete = await githubAPI.getFileContent(ownerDel, repoDel, action.data.path);
          await githubAPI.deleteFile(
            ownerDel,
            repoDel,
            action.data.path,
            action.data.message || `Delete ${action.data.path}`,
            fileToDelete.sha
          );
          
          setMessages(prev => prev.map((msg, idx) => 
            idx === messageIndex 
              ? { ...msg, action: { ...msg.action!, status: 'completed', data: { path: action.data.path } } }
              : msg
          ));
          
          toast.success(`File "${action.data.path}" deleted!`);
          break;

        default:
          toast.error('Unknown action type');
      }
    } catch (error: any) {
      setMessages(prev => prev.map((msg, idx) => 
        idx === messageIndex 
          ? { ...msg, action: { ...msg.action!, status: 'failed' } }
          : msg
      ));
      toast.error(`Action failed: ${error.message}`);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_AIMLAPI_KEY;
      if (!apiKey) {
        throw new Error('AIML API key not configured');
      }

      // Build context (only for agents that use repositories)
      let context = '';
      if (agentId === 'pr-reviewer' || agentId === 'repo-agent') {
        if (selectedRepo) {
          context += `Current Repository: ${selectedRepo.full_name}\n`;
        }
        if (selectedPR) {
          context += `Current PR: #${selectedPR.number} - ${selectedPR.title}\n`;
        }
      }

      // Enhanced system prompt for actions
      const enhancedSystemPrompt = `${systemPrompt}

IMPORTANT: When you need to perform GitHub actions, use these formats:

1. To create a repository:
[CREATE_REPO]
{
  "name": "repo-name",
  "description": "Repository description",
  "private": false,
  "auto_init": true
}
[/CREATE_REPO]

2. To create an issue:
[CREATE_ISSUE]
{
  "title": "Issue title",
  "body": "Issue description"
}
[/CREATE_ISSUE]

3. To update README:
[UPDATE_README]
{
  "content": "README content in markdown"
}
[/UPDATE_README]

4. To create a file in the selected repository:
[CREATE_FILE]
{
  "path": "path/to/file.txt",
  "content": "File content here",
  "message": "Commit message (optional)"
}
[/CREATE_FILE]

5. To create a complete project (repository + multiple files):
[CREATE_PROJECT]
{
  "repoName": "project-name",
  "description": "Project description",
  "private": false,
  "files": [
    {
      "path": "README.md",
      "content": "# Project Title",
      "message": "Add README"
    },
    {
      "path": "src/index.js",
      "content": "console.log('Hello');",
      "message": "Add main file"
    }
  ]
}
[/CREATE_PROJECT]

6. To create a new branch:
[CREATE_BRANCH]
{
  "branchName": "feature-name",
  "fromBranch": "main"
}
[/CREATE_BRANCH]

7. To create a pull request:
[CREATE_PR]
{
  "title": "PR Title",
  "body": "PR description",
  "head": "feature-branch",
  "base": "main"
}
[/CREATE_PR]

8. To delete a file:
[DELETE_FILE]
{
  "path": "path/to/file.txt",
  "message": "Delete file (optional)"
}
[/DELETE_FILE]

Before executing actions, ALWAYS ask the user for required information. For example:
- For creating a repo: ask for name, description, visibility (public/private)
- For creating an issue: ask for title and description
- For updating README: ask for the content
- For creating a file: ask for file path, content, and commit message
- For creating a project: ask about project idea, tech stack, features, then generate appropriate files
- For creating a branch: ask for branch name and base branch
- For creating a PR: ask for title, description, source and target branches
- For deleting a file: ask for file path and confirmation

After getting all required info, include the action tag in your response.`;

      const prompt = context ? `${context}\n\nUser: ${userMessage.content}` : userMessage.content;

      const response = await aimlAPI.chat([
        { role: 'system', content: enhancedSystemPrompt },
        ...messages.filter(m => m.role !== 'system').map(m => ({ 
          role: m.role, 
          content: m.content 
        })),
        { role: 'user', content: prompt }
      ]);

      // Parse for actions
      const action = parseActionRequest(response);
      const cleanResponse = response
        .replace(/\[CREATE_REPO\][\s\S]*?\[\/CREATE_REPO\]/g, '')
        .replace(/\[CREATE_ISSUE\][\s\S]*?\[\/CREATE_ISSUE\]/g, '')
        .replace(/\[UPDATE_README\][\s\S]*?\[\/UPDATE_README\]/g, '')
        .replace(/\[CREATE_FILE\][\s\S]*?\[\/CREATE_FILE\]/g, '')
        .replace(/\[CREATE_PROJECT\][\s\S]*?\[\/CREATE_PROJECT\]/g, '')
        .replace(/\[CREATE_BRANCH\][\s\S]*?\[\/CREATE_BRANCH\]/g, '')
        .replace(/\[CREATE_PR\][\s\S]*?\[\/CREATE_PR\]/g, '')
        .replace(/\[DELETE_FILE\][\s\S]*?\[\/DELETE_FILE\]/g, '')
        .trim();

      const assistantMessage: Message = {
        role: 'assistant',
        content: cleanResponse,
        timestamp: new Date(),
        action: action ? { ...action, status: 'pending' as const } : undefined
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Auto-execute action if found
      if (action) {
        setTimeout(() => {
          const msgIndex = messages.length + 1; // +1 because we just added user message
          executeAction(action, msgIndex);
        }, 500);
      }
    } catch (error: any) {
      toast.error('Failed to get response', {
        description: error.message
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-80px)]">
      <div className="h-full flex gap-4">
        {/* Sidebar for PR Reviewer and Repo Agent */}
        {(agentId === 'pr-reviewer' || agentId === 'repo-agent') && (
          <Card className="w-80 flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">Repositories</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col gap-4">
              <Select onValueChange={handleRepoChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select repository..." />
                </SelectTrigger>
                <SelectContent>
                  {repositories.map((repo) => (
                    <SelectItem key={repo.id} value={repo.full_name}>
                      <div className="flex items-center gap-2">
                        <FolderGit2 className="w-4 h-4" />
                        <span className="truncate">{repo.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {agentId === 'pr-reviewer' && selectedRepo && pullRequests.length > 0 && (
                <div className="flex-1 overflow-hidden flex flex-col">
                  <Label className="mb-2">Pull Requests ({pullRequests.length})</Label>
                  <ScrollArea className="flex-1">
                    <div className="space-y-2">
                      {pullRequests.map((pr) => (
                        <Card
                          key={pr.id}
                          className={`cursor-pointer transition-all hover:border-blue-500 ${
                            selectedPR?.id === pr.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                          onClick={() => handlePRSelect(pr)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start gap-2">
                              <GitPullRequest className="w-4 h-4 mt-0.5 text-green-600" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">#{pr.number}</p>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {pr.title}
                                </p>
                                <Badge variant="outline" className="mt-1 text-xs">
                                  {pr.state}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Main Chat Area */}
        <Card className="flex-1 flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{agentName}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{agentDescription}</p>
              </div>
              <Badge variant="outline">GPT-4o</Badge>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index}>
                    {message.role === 'system' ? (
                      <div className="flex justify-center">
                        <Badge variant="secondary" className="text-xs">
                          {message.content}
                        </Badge>
                      </div>
                    ) : (
                      <div
                        className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                            <Bot className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div className="flex flex-col gap-2 max-w-[70%]">
                          <div
                            className={`rounded-2xl px-4 py-3 ${
                              message.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                          
                          {/* Action Status */}
                          {message.action && (
                            <div className={`px-3 py-2 rounded-lg border ${
                              message.action.status === 'completed' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                              message.action.status === 'failed' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                              'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            }`}>
                              <div className="flex items-center gap-2 text-sm">
                                {message.action.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-600" />}
                                {message.action.status === 'failed' && <AlertCircle className="w-4 h-4 text-red-600" />}
                                {message.action.status === 'pending' && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
                                <span className="font-medium">
                                  {message.action.type === 'create_repo' && 'Creating repository...'}
                                  {message.action.type === 'create_issue' && 'Creating issue...'}
                                  {message.action.type === 'update_readme' && 'Updating README...'}
                                  {message.action.type === 'create_file' && 'Creating file...'}
                                  {message.action.type === 'create_project' && 'Creating project...'}
                                  {message.action.type === 'create_branch' && 'Creating branch...'}
                                  {message.action.type === 'create_pr' && 'Creating pull request...'}
                                  {message.action.type === 'delete_file' && 'Deleting file...'}
                                </span>
                              </div>
                              {message.action.status === 'completed' && message.action.data && (
                                <p className="text-xs mt-1 text-muted-foreground">
                                  {message.action.type === 'create_repo' && `Repository created: ${message.action.data.html_url}`}
                                  {message.action.type === 'create_issue' && `Issue #${message.action.data.number} created`}
                                  {message.action.type === 'create_file' && `File created successfully`}
                                  {message.action.type === 'update_readme' && `README updated successfully`}
                                  {message.action.type === 'create_project' && `Project created: ${message.action.data.repo.html_url} (${message.action.data.filesCreated} files)`}
                                  {message.action.type === 'create_branch' && `Branch created successfully`}
                                  {message.action.type === 'create_pr' && `Pull Request #${message.action.data.number} created`}
                                  {message.action.type === 'delete_file' && `File deleted: ${message.action.data.path}`}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                        {message.role === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={`Ask ${agentName} anything...`}
                  className="resize-none"
                  rows={2}
                  disabled={loading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={loading || !input.trim()}
                  size="icon"
                  className="shrink-0 h-full"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
