import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { githubAPI, PullRequest, PRFile } from '@/services/githubAPI';
import { geminiAPI, AIReviewResult } from '@/services/geminiAPI';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ArrowLeft, Code, GitPullRequest, AlertCircle, Sparkles, TestTube, Shield, FileText, Lightbulb, FileCode, CheckCircle, XCircle, MessageSquare, Send } from 'lucide-react';
import { formatDate, getPrimaryLanguage } from '@/utils/formatters';
import { toast } from 'sonner';
import Header from './Header';

interface PRReviewerProps {
  owner: string;
  repo: string;
  prNumber: number;
}
export default function PRReviewer({ owner, repo, prNumber }: PRReviewerProps) {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [pr, setPr] = useState<PullRequest | null>(null);
  const [files, setFiles] = useState<PRFile[]>([]);
  const [aiReview, setAiReview] = useState<AIReviewResult | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // New AI features states
  const [generatedTests, setGeneratedTests] = useState<string>('');
  const [securityScan, setSecurityScan] = useState<string>('');
  const [refactoringSuggestions, setRefactoringSuggestions] = useState<string>('');
  const [generatedDocs, setGeneratedDocs] = useState<string>('');
  const [generatingTests, setGeneratingTests] = useState(false);
  const [scanningcode, setScanningCode] = useState(false);
  const [generatingDocs, setGeneratingDocs] = useState(false);
  const [suggestingRefactoring, setSuggestingRefactoring] = useState(false);

  const loadPRDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [prData, filesData] = await Promise.all([
        githubAPI.getPullRequest(owner, repo, prNumber),
        githubAPI.getPullRequestFiles(owner, repo, prNumber),
      ]);
      setPr(prData);
      setFiles(filesData);
    } catch (err) {
      setError('Failed to load pull request details. Please try again.');
      console.error(err);
      toast.error('Failed to load PR details');
    } finally {
      setLoading(false);
    }
  }, [owner, repo, prNumber]);

  useEffect(() => {
    if (accessToken) {
      githubAPI.setToken(accessToken);
      loadPRDetails();
    }
  }, [accessToken, loadPRDetails]);

  const analyzeWithAI = async () => {
    if (!files.length) {
      toast.error('No files to analyze');
      return;
    }

    // Get Gemini API key from environment
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    console.log('[PR Reviewer] Gemini API key present:', !!apiKey);
    
    if (!apiKey) {
      toast.error('Gemini API key not configured', {
        description: 'Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables',
        duration: 5000,
      });
      setError('Please configure NEXT_PUBLIC_GEMINI_API_KEY in your environment variables');
      return;
    }

    setAnalyzing(true);
    setError(null);
    
    try {
      console.log('[PR Reviewer] Starting AI analysis...');
      toast.loading('Analyzing code with AI...', { id: 'ai-analysis' });
      
      geminiAPI.setApiKey(apiKey);
      const language = getPrimaryLanguage(files);
      console.log('[PR Reviewer] Detected language:', language);
      console.log('[PR Reviewer] Files to analyze:', files.length);
      
      const review = await geminiAPI.analyzeCodeReview(files, language);
      console.log('[PR Reviewer] AI analysis completed:', review);
      
      setAiReview(review);
      setComment(formatAIReviewForComment(review));
      
      toast.success('AI analysis completed!', { id: 'ai-analysis' });
    } catch (err: any) {
      const errorMessage = err?.message || 'Unknown error occurred';
      console.error('[PR Reviewer] AI analysis error:', err);
      
      setError(`Failed to analyze code: ${errorMessage}`);
      toast.error('AI analysis failed', {
        description: errorMessage,
        id: 'ai-analysis',
        duration: 5000,
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const formatAIReviewForComment = (review: AIReviewResult): string => {
    let comment = `## 🤖 AI Code Review\n\n`;
    comment += `**Overall Quality Score:** ${review.overallScore}/10\n\n`;
    
    if (review.bugs.length > 0) {
      comment += `### 🐛 Potential Bugs\n`;
      review.bugs.forEach(bug => comment += `- ${bug}\n`);
      comment += `\n`;
    }
    
    if (review.security.length > 0) {
      comment += `### 🔒 Security Concerns\n`;
      review.security.forEach(sec => comment += `- ${sec}\n`);
      comment += `\n`;
    }
    
    if (review.performance.length > 0) {
      comment += `### ⚡ Performance Suggestions\n`;
      review.performance.forEach(perf => comment += `- ${perf}\n`);
      comment += `\n`;
    }
    
    if (review.bestPractices.length > 0) {
      comment += `### ✨ Best Practices\n`;
      review.bestPractices.forEach(bp => comment += `- ${bp}\n`);
      comment += `\n`;
    }
    
    if (review.lineByLineFeedback.length > 0) {
      comment += `### 📝 Specific Feedback\n`;
      review.lineByLineFeedback.forEach(fb => comment += `- ${fb}\n`);
    }
    
    comment += `\n---\n*Generated by IvyAI - AI Code Review Assistant*`;
    return comment;
  };

  const postComment = async () => {
    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setPosting(true);
    try {
      await githubAPI.postPRComment(owner, repo, prNumber, comment);
      toast.success('Comment posted successfully!');
      setComment('');
      setAiReview(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to post comment');
    } finally {
      setPosting(false);
    }
  };

  const useAISuggestion = () => {
    if (aiReview) {
      setComment(formatAIReviewForComment(aiReview));
      toast.success('AI suggestion loaded');
    }
  };

  const handleGenerateTests = async () => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      toast.error('Gemini API key not configured');
      return;
    }

    setGeneratingTests(true);
    try {
      geminiAPI.setApiKey(apiKey);
      const language = getPrimaryLanguage(files);
      const allCode = files.map(f => f.patch || '').join('\n\n');
      const tests = await geminiAPI.generateTests(allCode, language);
      setGeneratedTests(tests);
      toast.success('Tests generated successfully!');
    } catch (err: any) {
      toast.error('Failed to generate tests', { description: err?.message });
    } finally {
      setGeneratingTests(false);
    }
  };

  const handleSecurityScan = async () => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      toast.error('Gemini API key not configured');
      return;
    }

    setScanningCode(true);
    try {
      geminiAPI.setApiKey(apiKey);
      const language = getPrimaryLanguage(files);
      const allCode = files.map(f => f.patch || '').join('\n\n');
      const scan = await geminiAPI.securityScan(allCode, language);
      setSecurityScan(scan);
      toast.success('Security scan completed!');
    } catch (err: any) {
      toast.error('Security scan failed', { description: err?.message });
    } finally {
      setScanningCode(false);
    }
  };

  const handleGenerateDocs = async () => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      toast.error('Gemini API key not configured');
      return;
    }

    setGeneratingDocs(true);
    try {
      geminiAPI.setApiKey(apiKey);
      const language = getPrimaryLanguage(files);
      const allCode = files.map(f => f.patch || '').join('\n\n');
      const docs = await geminiAPI.generateDocumentation(allCode, language);
      setGeneratedDocs(docs);
      toast.success('Documentation generated!');
    } catch (err: any) {
      toast.error('Failed to generate documentation', { description: err?.message });
    } finally {
      setGeneratingDocs(false);
    }
  };

  const handleSuggestRefactoring = async () => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      toast.error('Gemini API key not configured');
      return;
    }

    setSuggestingRefactoring(true);
    try {
      geminiAPI.setApiKey(apiKey);
      const language = getPrimaryLanguage(files);
      const allCode = files.map(f => f.patch || '').join('\n\n');
      const suggestions = await geminiAPI.suggestRefactoring(allCode, language);
      setRefactoringSuggestions(suggestions);
      toast.success('Refactoring suggestions generated!');
    } catch (err: any) {
      toast.error('Failed to generate suggestions', { description: err?.message });
    } finally {
      setSuggestingRefactoring(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (!pr) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="w-5 h-5" />
                <p>Pull request not found</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => router.push('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* PR Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">
                  #{pr.number} {pr.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {owner}/{repo} • {pr.user.login} • {formatDate(pr.created_at)}
                </CardDescription>
              </div>
              <Badge className={`${pr.state === 'open' ? 'bg-green-500' : 'bg-gray-500'} text-white`}>
                {pr.state}
              </Badge>
            </div>
          </CardHeader>
          {pr.body && (
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {pr.body}
              </p>
            </CardContent>
          )}
        </Card>

        {/* Files Changed */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="w-5 h-5" />
              Files Changed ({files.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-mono text-sm">{file.filename}</p>
                    <p className="text-xs text-gray-500">
                      <span className="text-green-600">+{file.additions}</span>
                      {' '}
                      <span className="text-red-600">-{file.deletions}</span>
                    </p>
                  </div>
                  <Badge variant="outline">{file.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Tools Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI-Powered Tools
            </CardTitle>
            <CardDescription>
              Analyze, test, and improve your code with AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="review" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="review" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Review
                </TabsTrigger>
                <TabsTrigger value="security" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="tests" className="text-xs">
                  <TestTube className="w-3 h-3 mr-1" />
                  Tests
                </TabsTrigger>
                <TabsTrigger value="refactor" className="text-xs">
                  <Lightbulb className="w-3 h-3 mr-1" />
                  Refactor
                </TabsTrigger>
                <TabsTrigger value="docs" className="text-xs">
                  <FileText className="w-3 h-3 mr-1" />
                  Docs
                </TabsTrigger>
              </TabsList>

              {/* Code Review Tab */}
              <TabsContent value="review" className="space-y-4">
                <Button 
                  onClick={analyzeWithAI}
                  disabled={analyzing || files.length === 0}
                  className="w-full"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing Code...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Analyze with AI
                    </>
                  )}
                </Button>

                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <AlertCircle className="w-5 h-5" />
                      <p>{error}</p>
                    </div>
                  </div>
                )}

                {aiReview && (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-semibold mb-2">Overall Quality Score</h4>
                      <div className="flex items-center gap-2">
                        <div className="text-3xl font-bold text-blue-600">{aiReview.overallScore}/10</div>
                        {aiReview.overallScore >= 8 && <CheckCircle className="w-6 h-6 text-green-600" />}
                        {aiReview.overallScore < 6 && <XCircle className="w-6 h-6 text-red-600" />}
                      </div>
                    </div>

                    {aiReview.bugs.length > 0 && (
                      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <h4 className="font-semibold mb-2">🐛 Potential Bugs</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {aiReview.bugs.map((bug, i) => <li key={i} className="text-sm">{bug}</li>)}
                        </ul>
                      </div>
                    )}

                    {aiReview.security.length > 0 && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <h4 className="font-semibold mb-2">🔒 Security Concerns</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {aiReview.security.map((sec, i) => <li key={i} className="text-sm">{sec}</li>)}
                        </ul>
                      </div>
                    )}

                    {aiReview.performance.length > 0 && (
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <h4 className="font-semibold mb-2">⚡ Performance</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {aiReview.performance.map((perf, i) => <li key={i} className="text-sm">{perf}</li>)}
                        </ul>
                      </div>
                    )}

                    {aiReview.bestPractices.length > 0 && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <h4 className="font-semibold mb-2">✨ Best Practices</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {aiReview.bestPractices.map((bp, i) => <li key={i} className="text-sm">{bp}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* Security Scan Tab */}
              <TabsContent value="security" className="space-y-4">
                <Button onClick={handleSecurityScan} disabled={scanningcode || files.length === 0} className="w-full">
                  {scanningcode ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Scanning...</>
                  ) : (
                    <><Shield className="w-4 h-4 mr-2" />Run Security Scan</>
                  )}
                </Button>
                {securityScan && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm">{securityScan}</pre>
                  </div>
                )}
              </TabsContent>

              {/* Generate Tests Tab */}
              <TabsContent value="tests" className="space-y-4">
                <Button onClick={handleGenerateTests} disabled={generatingTests || files.length === 0} className="w-full">
                  {generatingTests ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>
                  ) : (
                    <><TestTube className="w-4 h-4 mr-2" />Generate Unit Tests</>
                  )}
                </Button>
                {generatedTests && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm font-mono">{generatedTests}</pre>
                  </div>
                )}
              </TabsContent>

              {/* Refactoring Tab */}
              <TabsContent value="refactor" className="space-y-4">
                <Button onClick={handleSuggestRefactoring} disabled={suggestingRefactoring || files.length === 0} className="w-full">
                  {suggestingRefactoring ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing...</>
                  ) : (
                    <><Lightbulb className="w-4 h-4 mr-2" />Suggest Refactoring</>
                  )}
                </Button>
                {refactoringSuggestions && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm">{refactoringSuggestions}</pre>
                  </div>
                )}
              </TabsContent>

              {/* Documentation Tab */}
              <TabsContent value="docs" className="space-y-4">
                <Button onClick={handleGenerateDocs} disabled={generatingDocs || files.length === 0} className="w-full">
                  {generatingDocs ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>
                  ) : (
                    <><FileText className="w-4 h-4 mr-2" />Generate Documentation</>
                  )}
                </Button>
                {generatedDocs && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm">{generatedDocs}</pre>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Comment Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Post Comment
            </CardTitle>
            <CardDescription>
              Write a custom comment or use the AI-generated review
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiReview && (
              <Button 
                onClick={useAISuggestion}
                variant="outline"
                className="w-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Use AI Suggestion
              </Button>
            )}
            
            <Textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review comment here..."
              className="min-h-[200px] font-mono text-sm"
            />
            
            <Button 
              onClick={postComment}
              disabled={posting || !comment.trim()}
              className="w-full"
            >
              {posting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Post Comment to GitHub
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}