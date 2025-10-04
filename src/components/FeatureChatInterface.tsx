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
import {
  X,
  Send,
  Loader2,
  User,
  Bot,
  FolderGit2,
  GitPullRequest,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  category: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface FeatureChatInterfaceProps {
  feature: Feature;
  onClose: () => void;
}

export default function FeatureChatInterface({ feature, onClose }: FeatureChatInterfaceProps) {
  const { accessToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [selectedPR, setSelectedPR] = useState<PullRequest | null>(null);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize AIML API
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_AIMLAPI_KEY;
    if (apiKey) {
      aimlAPI.setApiKey(apiKey);
    }
  }, []);

  // Load repositories for PR Reviewer
  useEffect(() => {
    if (feature.id === 'pr-reviewer' && accessToken) {
      loadRepositories();
    }
  }, [feature.id, accessToken]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadRepositories = async () => {
    setLoadingRepos(true);
    try {
      githubAPI.setToken(accessToken!);
      const repos = await githubAPI.getUserRepositories();
      setRepositories(repos);
    } catch (error) {
      toast.error('Failed to load repositories');
    } finally {
      setLoadingRepos(false);
    }
  };

  const handleRepoChange = async (repoFullName: string) => {
    const repo = repositories.find(r => r.full_name === repoFullName);
    if (!repo) return;

    setSelectedRepo(repo);
    setLoadingRepos(true);
    try {
      const [owner, repoName] = repo.full_name.split('/');
      const prs = await githubAPI.getPullRequests(owner, repoName);
      setPullRequests(prs);
      
      // Add system message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Loaded ${prs.length} pull request(s) from ${repo.full_name}. You can select a PR or ask me anything about this repository!`,
        timestamp: new Date()
      }]);
    } catch (error) {
      toast.error('Failed to load pull requests');
    } finally {
      setLoadingRepos(false);
    }
  };

  const handlePRSelect = (pr: PullRequest) => {
    setSelectedPR(pr);
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `Selected PR #${pr.number}: "${pr.title}". What would you like to know or do with this PR?`,
      timestamp: new Date()
    }]);
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

      // Build context based on feature
      let systemPrompt = '';
      let context = '';

      switch (feature.id) {
        case 'pr-reviewer':
          systemPrompt = 'You are an expert code reviewer. Analyze pull requests and provide detailed feedback on code quality, bugs, security, and best practices.';
          if (selectedPR && selectedRepo) {
            context = `Repository: ${selectedRepo.full_name}\nPR #${selectedPR.number}: ${selectedPR.title}\nState: ${selectedPR.state}\n`;
          }
          break;
        
        case 'repo-agent':
          systemPrompt = 'You are a GitHub repository assistant. Help users manage, analyze, and understand their repositories.';
          if (selectedRepo) {
            context = `Repository: ${selectedRepo.full_name}\nDescription: ${selectedRepo.description || 'N/A'}\n`;
          }
          break;

        case 'code-generator':
          systemPrompt = 'You are a code generation expert. Generate clean, production-ready code based on user requirements.';
          break;

        case 'code-refactor':
          systemPrompt = 'You are a code refactoring expert. Improve code quality, readability, and maintainability.';
          break;

        case 'test-generator':
          systemPrompt = 'You are a test generation expert. Create comprehensive unit tests with good coverage.';
          break;

        case 'security-scanner':
          systemPrompt = 'You are a security expert. Identify vulnerabilities and provide fix recommendations.';
          break;

        case 'doc-generator':
          systemPrompt = 'You are a documentation expert. Create clear, comprehensive documentation.';
          break;

        case 'performance-optimizer':
          systemPrompt = 'You are a performance optimization expert. Analyze and improve code performance.';
          break;

        default:
          systemPrompt = 'You are a helpful AI coding assistant.';
      }

      const prompt = context ? `${context}\n\nUser Query: ${userMessage.content}` : userMessage.content;

      const response = await aimlAPI.chat([
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: prompt }
      ]);

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      toast.error('Failed to get response', {
        description: error.message
      });
      
      // Add error message
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <CardHeader className="border-b shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <div>
                <CardTitle className="text-xl">{feature.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar for PR Reviewer */}
          {feature.id === 'pr-reviewer' && (
            <div className="w-80 border-r p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800/50">
              <div className="space-y-4">
                {/* Repository Selector */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Repository</label>
                  <Select onValueChange={handleRepoChange} disabled={loadingRepos}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose repository..." />
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
                </div>

                {/* Pull Requests List */}
                {selectedRepo && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Pull Requests ({pullRequests.length})</label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRepoChange(selectedRepo.full_name)}
                      >
                        <RefreshCw className="w-3 h-3" />
                      </Button>
                    </div>
                    <ScrollArea className="h-[400px]">
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

                        {pullRequests.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No pull requests found
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <feature.icon className={`w-16 h-16 mx-auto mb-4 ${feature.color} opacity-20`} />
                    <h3 className="text-lg font-semibold mb-2">Start a Conversation</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Ask me anything about {feature.name.toLowerCase()}. I'm here to help!
                    </p>
                  </div>
                )}

                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
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
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-white" />
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
            </ScrollArea>

            {/* Input */}
            <div className="border-t p-4 shrink-0">
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
                  placeholder={`Ask about ${feature.name.toLowerCase()}...`}
                  className="resize-none"
                  rows={2}
                  disabled={loading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={loading || !input.trim()}
                  size="icon"
                  className="shrink-0"
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
          </div>
        </div>
      </Card>
    </div>
  );
}
