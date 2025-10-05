"use client";

import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { aimlAPI } from '@/services/aimlAPI';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Code, Play, Download, Copy, FileUp, RefreshCw, Bug, FileText, TestTube2, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

const LANGUAGES = [
  'typescript',
  'javascript',
  'python',
  'java',
  'go',
  'rust',
  'cpp',
  'csharp',
  'php',
  'ruby',
];

const TEMPLATES = {
  react: {
    name: 'React Component',
    language: 'typescript',
    code: `import React from 'react';

interface Props {
  title: string;
}

export const MyComponent: React.FC<Props> = ({ title }) => {
  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
};`,
  },
  express: {
    name: 'Express API',
    language: 'typescript',
    code: `import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
  },
  python: {
    name: 'Python Function',
    language: 'python',
    code: `def process_data(data: list) -> dict:
    """Process input data and return results."""
    result = {
        'count': len(data),
        'sum': sum(data),
    }
    return result`,
  },
};

export default function AIPlayground() {
  const { theme } = useTheme();
  const [code, setCode] = useState(TEMPLATES.react.code);
  const [language, setLanguage] = useState<string>('typescript');
  // Using GPT-4o via AIML API
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [outputCode, setOutputCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('output');
  const [tokensUsed, setTokensUsed] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleAIAction = async (action: string, customPrompt?: string) => {
    const apiKey = process.env.NEXT_PUBLIC_AIMLAPI_KEY;
    if (!apiKey) {
      toast.error('AIML API key not configured', {
        description: 'Please add NEXT_PUBLIC_AIMLAPI_KEY to your environment variables',
      });
      return;
    }

    setLoading(true);
    try {
      aimlAPI.setApiKey(apiKey);

      let result = '';
      const userMessage = customPrompt || prompt;

      // Add user message to chat
      setChatHistory((prev) => [...prev, { role: 'user', content: userMessage }]);

      switch (action) {
        case 'generate':
          result = await aimlAPI.generateCode(userMessage, language, code);
          setOutputCode(result);
          setActiveTab('output');
          break;

        case 'refactor':
          result = await aimlAPI.refactorCode(code, language, userMessage);
          setOutputCode(result);
          setActiveTab('output');
          break;

        case 'analyze':
          const analysis = await aimlAPI.analyzeCode(code, language);
          result = `Code Quality Score: ${analysis.score}/10\n\n`;
          if (analysis.bugs.length) result += `🐛 Bugs:\n${analysis.bugs.map((b) => `- ${b}`).join('\n')}\n\n`;
          if (analysis.security.length) result += `🔒 Security:\n${analysis.security.map((s) => `- ${s}`).join('\n')}\n\n`;
          if (analysis.performance.length) result += `⚡ Performance:\n${analysis.performance.map((p) => `- ${p}`).join('\n')}\n\n`;
          if (analysis.bestPractices.length) result += `✨ Best Practices:\n${analysis.bestPractices.map((bp) => `- ${bp}`).join('\n')}`;
          setExplanation(result);
          setActiveTab('explanation');
          break;

        case 'test':
          result = await aimlAPI.generateTests(code, language, 'vitest');
          setOutputCode(result);
          setActiveTab('output');
          break;

        case 'document':
          result = await aimlAPI.generateDocumentation(code, language, 'inline');
          setOutputCode(result);
          setActiveTab('output');
          break;

        case 'fix':
          result = await aimlAPI.fixBugs(code, language, userMessage);
          setOutputCode(result);
          setActiveTab('output');
          break;

        case 'explain':
          result = await aimlAPI.explainCode(code, language);
          setExplanation(result);
          setActiveTab('explanation');
          break;

        case 'chat':
          result = await aimlAPI.chat([
            { role: 'system', content: `You are a helpful coding assistant. The user is working with ${language} code.` },
            { role: 'user', content: userMessage },
          ]);
          setExplanation(result);
          setActiveTab('explanation');
          break;
      }

      // Add AI response to chat
      setChatHistory((prev) => [...prev, { role: 'assistant', content: result }]);
      setPrompt('');
      toast.success('AI action completed!');

      // Estimate tokens (rough approximation)
      const estimatedTokens = Math.ceil((userMessage.length + result.length) / 4);
      setTokensUsed((prev) => prev + estimatedTokens);
    } catch (error: any) {
      toast.error('AI request failed', {
        description: error.message,
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCode = () => {
    setCode(outputCode);
    toast.success('Code applied to editor');
  };

  const handleDownload = () => {
    const blob = new Blob([outputCode || code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language === 'typescript' ? 'ts' : language === 'javascript' ? 'js' : language}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Code downloaded');
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleTemplateSelect = (templateKey: string) => {
    const template = TEMPLATES[templateKey as keyof typeof TEMPLATES];
    setCode(template.code);
    setLanguage(template.language);
    toast.success(`Template "${template.name}" loaded`);
  };

  const examplePrompts = [
    'Refactor this code to use async/await',
    'Add error handling and logging',
    'Optimize for performance',
    'Convert to TypeScript',
    'Add input validation',
  ];

  return (
    <div className="h-full flex flex-col gap-4 p-4 pt-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Playground</h2>
          <p className="text-sm text-muted-foreground">
            Interactive coding environment powered by multi-model AI
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            Model: GPT-4o
          </Badge>
          <Badge variant="outline">
            Tokens: {tokensUsed.toLocaleString()}
          </Badge>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 grid grid-cols-3 gap-4 min-h-0">
        {/* Left Panel - Input */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Code Editor</CardTitle>
              <div className="flex items-center gap-2">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[140px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={handleTemplateSelect}>
                  <SelectTrigger className="w-[140px] h-8">
                    <SelectValue placeholder="Template" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TEMPLATES).map(([key, template]) => (
                      <SelectItem key={key} value={key}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 min-h-0">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value: string | undefined) => setCode(value || '')}
              theme={theme === 'dark' ? 'vs-dark' : 'light'}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </CardContent>
        </Card>

        {/* Center Panel - AI Chat */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI Assistant
            </CardTitle>
            <CardDescription>
              Powered by GPT-4o via AIML API
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-3 min-h-0">
            {/* Chat History */}
            <div className="flex-1 overflow-y-auto space-y-2 p-2 bg-muted/30 rounded-lg">
              {chatHistory.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                  Start by typing a prompt or clicking an action button
                </div>
              ) : (
                chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-8'
                        : 'bg-muted mr-8'
                    }`}
                  >
                    <p className="text-xs font-semibold mb-1">
                      {msg.role === 'user' ? 'You' : 'AI'}
                    </p>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Example Prompts */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Quick actions:</p>
              <div className="flex flex-wrap gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAIAction('refactor')}
                  disabled={loading || !code}
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Refactor
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAIAction('analyze')}
                  disabled={loading || !code}
                >
                  <Bug className="w-3 h-3 mr-1" />
                  Analyze
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAIAction('test')}
                  disabled={loading || !code}
                >
                  <TestTube2 className="w-3 h-3 mr-1" />
                  Tests
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAIAction('document')}
                  disabled={loading || !code}
                >
                  <FileText className="w-3 h-3 mr-1" />
                  Docs
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAIAction('explain')}
                  disabled={loading || !code}
                >
                  <Code className="w-3 h-3 mr-1" />
                  Explain
                </Button>
              </div>
            </div>

            {/* Input */}
            <div className="space-y-2">
              <Textarea
                placeholder="Describe what you want to do..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[80px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    handleAIAction('generate');
                  }
                }}
              />
              <Button
                onClick={() => handleAIAction('generate')}
                disabled={loading || !prompt}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Panel - Output */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Output</CardTitle>
              <div className="flex items-center gap-1">
                {outputCode && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleApplyCode}
                    >
                      <Wand2 className="w-4 h-4 mr-1" />
                      Apply
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(outputCode)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleDownload}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 min-h-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="mx-4">
                <TabsTrigger value="output">Code</TabsTrigger>
                <TabsTrigger value="explanation">Explanation</TabsTrigger>
              </TabsList>
              <TabsContent value="output" className="flex-1 mt-0 min-h-0">
                {outputCode ? (
                  <Editor
                    height="100%"
                    language={language}
                    value={outputCode}
                    theme={theme === 'dark' ? 'vs-dark' : 'light'}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 13,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                    }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-muted-foreground p-4">
                    Generated code will appear here
                  </div>
                )}
              </TabsContent>
              <TabsContent value="explanation" className="flex-1 mt-0 overflow-y-auto p-4">
                {explanation ? (
                  <div className="prose dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-sm">{explanation}</pre>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                    AI explanations and analysis will appear here
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
