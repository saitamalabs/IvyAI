"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Sparkles, GitPullRequest, Globe, Github, Zap, Shield, Bot } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function LandingPage() {
  const { login } = useAuth();

  const features = [
    {
      icon: Bot,
      title: 'Intelligent PR Reviews',
      description: 'AI-powered code analysis using Google Gemini to identify bugs, security issues, and code quality problems.',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      icon: Zap,
      title: 'Automated Feedback',
      description: 'Get instant, actionable code quality suggestions and best practice recommendations in seconds.',
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
    {
      icon: Github,
      title: 'Direct GitHub Integration',
      description: 'Seamlessly connect to GitHub, review PRs, and post AI-generated comments directly to pull requests.',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      icon: Globe,
      title: 'Multiple Languages',
      description: 'Support for JavaScript, TypeScript, Python, Java, Go, Ruby, and many more programming languages.',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Connect GitHub',
      description: 'Authenticate with your GitHub account to access your repositories and pull requests.',
    },
    {
      number: '2',
      title: 'Select & Review',
      description: 'Choose a repository and PR, then let our AI analyze the code changes for issues and improvements.',
    },
    {
      number: '3',
      title: 'Post Feedback',
      description: 'Review AI suggestions and post comprehensive feedback directly to your pull request on GitHub.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">IvyAI</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Powered by Google Gemini AI
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              IvyAI
            </span>
            <br />
            AI Code Review Assistant
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            Supercharge your code reviews with AI-powered insights. Analyze pull requests, identify bugs, 
            security issues, and get best practice recommendations instantly.
          </p>
          
          <Button 
            onClick={login}
            size="lg"
            className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Github className="w-5 h-5 mr-2" />
            Connect with GitHub
          </Button>
          
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
            Free to use • No credit card required
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Powerful Features
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
            How It Works
          </h3>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Get started in three simple steps and transform your code review process
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
                    {step.number}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 opacity-30" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-none text-white">
          <CardContent className="py-12 text-center">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Improve Your Code Reviews?
            </h3>
            <p className="text-lg mb-6 text-blue-100">
              Join developers using AI to write better code, faster.
            </p>
            <Button 
              onClick={login}
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6"
            >
              <Github className="w-5 h-5 mr-2" />
              Get Started Now
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400">
          <p className="mb-2">
            Built with ❤️ for{' '}
            <a 
              href="https://hacktoberfest.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Hacktoberfest 2024
            </a>
          </p>
          <p className="text-sm">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              View on GitHub
            </a>
            {' • '}
            <span>MIT License</span>
            {' • '}
            <span>Powered by Google Gemini AI & GitHub</span>
          </p>
        </footer>
      </main>
    </div>
  );
}