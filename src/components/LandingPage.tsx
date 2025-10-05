"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, Sparkles, GitPullRequest, Globe, Github, Zap, Shield, Bot, Rocket, TestTube2, FileCode, Check, Star, Users, ArrowRight, Play } from 'lucide-react';
import Image from 'next/image';
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';
import Header from './Header';

export default function LandingPage() {
  const { login } = useAuth();

  const features = [
    {
      icon: Sparkles,
      title: 'Multi-Model AI',
      description: 'Access Claude 3.5 Sonnet, Gemini 2.0 Flash, and GPT-4o for optimal code generation and analysis.',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      icon: Rocket,
      title: 'Autonomous Code Generation',
      description: 'Generate complete, production-ready projects from natural language. Full-stack apps in minutes.',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      icon: Github,
      title: 'GitHub Integration',
      description: 'Seamless integration with GitHub. Review PRs, create repos, and manage code directly from IvyAI.',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      icon: FileCode,
      title: 'Project Scaffolding',
      description: 'Choose from Next.js, React, Vue, Express, and more. Auto-configure auth, database, and deployment.',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      icon: TestTube2,
      title: 'Automated Testing',
      description: 'Generate comprehensive unit tests with edge cases, mocks, and high coverage automatically.',
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-100 dark:bg-pink-900/20',
    },
    {
      icon: Zap,
      title: 'One-Click Deployment',
      description: 'Deploy directly to Vercel with automatic configuration. From code to production instantly.',
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
  ];

  const pricing = [
    { name: 'Free', price: '$0', features: ['100 AI requests/month', '3 projects', 'GitHub integration', 'Community support'] },
    { name: 'Pro', price: '$19', features: ['Unlimited AI requests', 'Unlimited projects', 'Priority support', 'Advanced analytics', 'Team features'] },
    { name: 'Enterprise', price: 'Custom', features: ['Custom AI models', 'Dedicated support', 'SLA guarantee', 'On-premise deployment', 'Custom integrations'] },
  ];

  const stats = [
    { icon: Users, value: '10K+', label: 'Developers' },
    { icon: Code, value: '1M+', label: 'Lines Generated' },
    { icon: Rocket, value: '50K+', label: 'Projects Created' },
    { icon: Star, value: '4.9/5', label: 'User Rating' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-950 pt-20">
          <div className="absolute inset-0 bg-grid-gray-900/[0.04] dark:bg-grid-white/[0.02] bg-[size:20px_20px]" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 relative">
            <div className="text-center max-w-5xl mx-auto">
              {/* Announcement Banner */}
              <div className="mb-8 flex justify-center">
                <div className="group relative inline-flex items-center justify-center rounded-full border border-blue-200/50 bg-blue-50 transition-all ease-in hover:cursor-pointer hover:bg-blue-100 dark:border-blue-800/50 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 px-4 py-2">
                  <AnimatedShinyText className="inline-flex items-center justify-center text-blue-900 dark:text-blue-100 transition ease-out hover:text-blue-700 hover:duration-300 dark:hover:text-blue-200">
                    <span className="text-sm font-medium">🎉 IvyAI Now Live: Autonomous Multi-Agent Development - Try Free </span>
                    <ArrowRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                  </AnimatedShinyText>
                </div>
              </div>
              
              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Build Apps with
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                  AI Superpowers
                </span>
              </h1>
              
              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                Generate entire projects, review code, and deploy with a single command. 
                IvyAI is the AI coding agent that competes with GitHub Copilot.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Button 
                  onClick={login}
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transition-all"
                >
                  <Github className="w-5 h-5 mr-2" />
                  Start Building Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 py-6 border-2"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Play className="w-5 h-5 mr-2" />
                  See How It Works
                </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>100% open source</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Deploy in 5 minutes</span>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">
                Powerful Features
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Everything you need to build faster
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                From code generation to deployment, IvyAI has you covered
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-blue-500">
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className={`w-7 h-7 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">
                Simple Pricing
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Choose your plan
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Start free, upgrade when you need more power
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricing.map((plan, index) => (
                <Card key={index} className={`relative ${index === 1 ? 'border-blue-500 border-2 shadow-2xl scale-105' : ''}`}>
                  {index === 1 && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                      {plan.price !== 'Custom' && <span className="text-gray-600 dark:text-gray-400">/month</span>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      onClick={login}
                      className={`w-full ${index === 1 ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : ''}`}
                      variant={index === 1 ? 'default' : 'outline'}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to 10x your development speed?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of developers building with AI. Start for free, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                onClick={login}
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100"
              >
                <Github className="w-5 h-5 mr-2" />
                Start Building Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-lg px-8 py-6 border-2 border-white text-white hover:bg-white/10"
                onClick={() => window.open('https://github.com', '_blank')}
              >
                View on GitHub
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="about" className="py-12 border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <Image 
                  src="/logo.png" 
                  alt="IvyAI Logo" 
                  width={40} 
                  height={40}
                  className="w-10 h-10"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  IvyAI
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
                <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
                <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                  GitHub
                </a>
                <span>MIT License</span>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                Built with ❤️ by developers
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
              <p>
                Powered by Claude 3.5 Sonnet • Gemini 2.0 Flash • GPT-4o • GitHub API
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}