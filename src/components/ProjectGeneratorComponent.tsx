"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { projectGenerator, ProjectConfig, Framework, Database, Styling } from '@/services/projectGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, Rocket, Github, CheckCircle, Code2, Database as DatabaseIcon, Palette, TestTube2, Globe } from 'lucide-react';
import { toast } from 'sonner';

const FRAMEWORKS: { value: Framework; label: string; description: string }[] = [
  { value: 'nextjs', label: 'Next.js', description: 'React framework with SSR/SSG' },
  { value: 'react', label: 'React', description: 'Popular UI library' },
  { value: 'vue', label: 'Vue.js', description: 'Progressive framework' },
  { value: 'express', label: 'Express.js', description: 'Node.js backend' },
  { value: 'nestjs', label: 'NestJS', description: 'TypeScript backend' },
  { value: 'django', label: 'Django', description: 'Python web framework' },
  { value: 'mern', label: 'MERN Stack', description: 'Full-stack MongoDB' },
  { value: 't3', label: 'T3 Stack', description: 'TypeScript full-stack' },
];

const DATABASES: { value: Database; label: string }[] = [
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'mongodb', label: 'MongoDB' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'sqlite', label: 'SQLite' },
  { value: 'none', label: 'None' },
];

const STYLING_OPTIONS: { value: Styling; label: string }[] = [
  { value: 'tailwind', label: 'Tailwind CSS' },
  { value: 'css-modules', label: 'CSS Modules' },
  { value: 'styled-components', label: 'Styled Components' },
  { value: 'sass', label: 'SASS/SCSS' },
];

export default function ProjectGeneratorComponent() {
  const { user, accessToken } = useAuth();
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [framework, setFramework] = useState<Framework>('nextjs');
  const [database, setDatabase] = useState<Database>('postgresql');
  const [styling, setStyling] = useState<Styling>('tailwind');
  const [features, setFeatures] = useState({
    authentication: false,
    api: 'rest' as 'rest' | 'graphql',
    testing: false,
    deployment: false,
  });
  const [generating, setGenerating] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [generatedRepoUrl, setGeneratedRepoUrl] = useState('');
  const [generatedFiles, setGeneratedFiles] = useState<any[]>([]);

  const handleGenerate = async () => {
    if (!projectName || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_AIMLAPI_KEY;
    if (!apiKey) {
      toast.error('AIML API key not configured');
      return;
    }

    setGenerating(true);
    setProgress(0);
    setCurrentStep('');

    try {
      const config: ProjectConfig = {
        name: projectName,
        description,
        framework,
        database: database === 'none' ? undefined : database,
        features,
        styling,
      };

      const files = await projectGenerator.generateProject(config, (progressUpdate) => {
        setProgress(progressUpdate.progress);
        setCurrentStep(progressUpdate.message);
      });

      setGeneratedFiles(files);
      toast.success('Project generated successfully!', {
        description: `${files.length} files created`,
      });
    } catch (error: any) {
      toast.error('Project generation failed', {
        description: error.message,
      });
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const handleDeployToGitHub = async () => {
    if (!accessToken || !generatedFiles.length) {
      toast.error('No project to deploy');
      return;
    }

    setDeploying(true);
    setProgress(0);

    try {
      const repoUrl = await projectGenerator.deployToGitHub(
        generatedFiles,
        projectName,
        description,
        (progressUpdate) => {
          setProgress(progressUpdate.progress);
          setCurrentStep(progressUpdate.message);
        }
      );

      setGeneratedRepoUrl(repoUrl);
      toast.success('Project deployed to GitHub!', {
        description: 'Repository created successfully',
      });
    } catch (error: any) {
      toast.error('GitHub deployment failed', {
        description: error.message,
      });
      console.error(error);
    } finally {
      setDeploying(false);
    }
  };

  const handleReset = () => {
    setProjectName('');
    setDescription('');
    setFramework('nextjs');
    setDatabase('postgresql');
    setStyling('tailwind');
    setFeatures({
      authentication: false,
      api: 'rest',
      testing: false,
      deployment: false,
    });
    setGeneratedFiles([]);
    setGeneratedRepoUrl('');
    setProgress(0);
    setCurrentStep('');
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Rocket className="w-8 h-8" />
          AI Project Generator
        </h1>
        <p className="text-muted-foreground mt-2">
          Generate complete, production-ready projects with AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Basic information about your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  placeholder="my-awesome-project"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  disabled={generating || deploying}
                />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what your project does..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  disabled={generating || deploying}
                />
              </div>
            </CardContent>
          </Card>

          {/* Stack Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Technology Stack</CardTitle>
              <CardDescription>Choose your framework and tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="framework" className="flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  Framework *
                </Label>
                <Select
                  value={framework}
                  onValueChange={(v) => setFramework(v as Framework)}
                  disabled={generating || deploying}
                >
                  <SelectTrigger id="framework">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FRAMEWORKS.map((fw) => (
                      <SelectItem key={fw.value} value={fw.value}>
                        <div>
                          <div className="font-medium">{fw.label}</div>
                          <div className="text-xs text-muted-foreground">{fw.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="database" className="flex items-center gap-2">
                  <DatabaseIcon className="w-4 h-4" />
                  Database
                </Label>
                <Select
                  value={database}
                  onValueChange={(v) => setDatabase(v as Database)}
                  disabled={generating || deploying}
                >
                  <SelectTrigger id="database">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DATABASES.map((db) => (
                      <SelectItem key={db.value} value={db.value}>
                        {db.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="styling" className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Styling
                </Label>
                <Select
                  value={styling}
                  onValueChange={(v) => setStyling(v as Styling)}
                  disabled={generating || deploying}
                >
                  <SelectTrigger id="styling">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STYLING_OPTIONS.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>Select additional features to include</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="auth"
                  checked={features.authentication}
                  onCheckedChange={(checked) =>
                    setFeatures({ ...features, authentication: checked as boolean })
                  }
                  disabled={generating || deploying}
                />
                <Label htmlFor="auth" className="cursor-pointer">
                  Authentication (JWT + Password Hashing)
                </Label>
              </div>

              <div className="space-y-2">
                <Label>API Type</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rest"
                      checked={features.api === 'rest'}
                      onCheckedChange={() => setFeatures({ ...features, api: 'rest' })}
                      disabled={generating || deploying}
                    />
                    <Label htmlFor="rest" className="cursor-pointer">
                      REST API
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="graphql"
                      checked={features.api === 'graphql'}
                      onCheckedChange={() => setFeatures({ ...features, api: 'graphql' })}
                      disabled={generating || deploying}
                    />
                    <Label htmlFor="graphql" className="cursor-pointer">
                      GraphQL
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="testing"
                  checked={features.testing}
                  onCheckedChange={(checked) =>
                    setFeatures({ ...features, testing: checked as boolean })
                  }
                  disabled={generating || deploying}
                />
                <Label htmlFor="testing" className="cursor-pointer flex items-center gap-2">
                  <TestTube2 className="w-4 h-4" />
                  Testing Setup (Vitest)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="deployment"
                  checked={features.deployment}
                  onCheckedChange={(checked) =>
                    setFeatures({ ...features, deployment: checked as boolean })
                  }
                  disabled={generating || deploying}
                />
                <Label htmlFor="deployment" className="cursor-pointer flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Deployment Config (Vercel/Docker)
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions & Progress Panel */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleGenerate}
                disabled={generating || deploying || !projectName || !description}
                className="w-full"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
                    Generate Project
                  </>
                )}
              </Button>

              {generatedFiles.length > 0 && !generatedRepoUrl && (
                <Button
                  onClick={handleDeployToGitHub}
                  disabled={!accessToken || deploying}
                  variant="outline"
                  className="w-full"
                >
                  {deploying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Github className="w-4 h-4 mr-2" />
                      Deploy to GitHub
                    </>
                  )}
                </Button>
              )}

              {(generatedFiles.length > 0 || generatedRepoUrl) && (
                <Button onClick={handleReset} variant="ghost" className="w-full">
                  Start New Project
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Progress */}
          {(generating || deploying) && (
            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Progress value={progress} className="w-full" />
                <div className="text-sm text-muted-foreground">{currentStep}</div>
                <div className="text-xs text-muted-foreground text-right">
                  {progress}%
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success State */}
          {generatedRepoUrl && (
            <Card className="border-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  Deployment Complete!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>GitHub Repository</Label>
                  <a
                    href={generatedRepoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {generatedRepoUrl}
                  </a>
                </div>
                <div className="pt-3 space-y-2">
                  <Label>Next Steps:</Label>
                  <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                    <li>Clone the repository</li>
                    <li>Install dependencies</li>
                    <li>Configure environment variables</li>
                    <li>Run the development server</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Files Generated */}
          {generatedFiles.length > 0 && !generatedRepoUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Files</CardTitle>
                <CardDescription>{generatedFiles.length} files created</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-[300px] overflow-y-auto space-y-1">
                  {generatedFiles.map((file, i) => (
                    <div
                      key={i}
                      className="text-xs font-mono bg-muted px-2 py-1 rounded"
                    >
                      {file.path}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">How it works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p>1. AI analyzes your requirements</p>
              <p>2. Generates complete project structure</p>
              <p>3. Creates all necessary files</p>
              <p>4. Optionally deploys to GitHub</p>
              <p>5. Project ready to use!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
