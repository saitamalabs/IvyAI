# 🤖 IvyAI - AI Coding Agent SaaS Platform

[![Hacktoberfest 2025](https://img.shields.io/badge/Hacktoberfest-2025-blueviolet)](https://hacktoberfest.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Contributors](https://img.shields.io/github/contributors/yourusername/IvyAI)](https://github.com/yourusername/IvyAI/graphs/contributors)

A comprehensive AI coding agent that competes with GitHub Copilot. Build complete projects, review code, and accelerate development with multi-model AI integration (Claude 3.5 Sonnet, Gemini 2.0 Flash, GPT-4o).

## 🎃 Hacktoberfest 2025

**We're participating in Hacktoberfest 2025!** This is a great opportunity to contribute to open source and earn swag. Check out our [Hacktoberfest Issues](https://github.com/yourusername/IvyAI/labels/hacktoberfest) to get started!

### How to Participate
1. 🍴 Fork this repository
2. 🔍 Browse [good first issues](https://github.com/yourusername/IvyAI/labels/good%20first%20issue)
3. 🛠️ Pick an issue and comment that you're working on it
4. 💻 Make your changes following our [Contributing Guidelines](#-contributing)
5. 🚀 Submit a PR and wait for review
6. 🎉 Get your PR merged and celebrate!

**Read our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.**

## ✨ Key Features

### 🚀 **AI Project Generator**
- **Autonomous Project Scaffolding** - Generate complete full-stack projects from natural language descriptions
- **Multi-Framework Support** - Next.js, React, Vue, Express, NestJS, Django, MERN, T3 Stack
- **Database Integration** - PostgreSQL, MongoDB, MySQL, SQLite support
- **Feature-Rich** - Authentication, REST/GraphQL APIs, Testing, Deployment configs
- **GitHub Deployment** - Automatic repository creation and code push

### 💻 **AI Playground**
- **Multi-Model AI** - Claude 3.5 Sonnet (architecture), Gemini 2.0 Flash (code gen), GPT-4o (testing)
- **Interactive Code Editor** - Monaco editor with syntax highlighting
- **Real-Time AI Chat** - Natural language code generation and refactoring
- **Code Analysis** - Bug detection, security scanning, performance optimization
- **Test Generation** - Automated unit test creation
- **Documentation** - Auto-generate inline docs and README files

### 🔍 **AI Code Reviewer**
- **PR Analysis** - Automated code review for GitHub pull requests
- **Comprehensive Feedback** - Bugs, security, performance, best practices
- **Quality Scoring** - 1-10 code quality assessment
- **Direct Integration** - Post reviews as GitHub comments
- **Security Scanning** - Vulnerability detection

### 🔗 **GitHub Integration**
- **Full API Support** - Repos, branches, PRs, commits, files
- **OAuth Authentication** - Secure GitHub sign-in
- **Repository Management** - Create, fork, delete repositories
- **File Operations** - Create, update, delete files programmatically

## 🎯 Core Technologies

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS 4
- **AI**: AIML API (Claude 3.5 Sonnet, Gemini 2.0 Flash, GPT-4o) + Google Gemini
- **Authentication**: GitHub OAuth + JWT
- **Editor**: Monaco Editor (VS Code engine)
- **UI**: Radix UI + shadcn/ui components
- **Deployment**: Vercel-ready

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** or Bun
- **GitHub OAuth App** credentials ([Create here](https://github.com/settings/developers))
- **AIML API Key** ([Get here](https://aimlapi.com))
- **Google Gemini API Key** (optional, for legacy PR reviewer) ([Get here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/IvyAI.git
   cd IvyAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Configure the following:

   **GitHub OAuth:**
   ```env
   NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   NEXT_PUBLIC_GITHUB_REDIRECT_URI=http://localhost:3000/api/auth/callback
   ```

   **AIML API (Multi-Model AI):**
   ```env
   NEXT_PUBLIC_AIMLAPI_KEY=your_aimlapi_key
   ```

   **Google Gemini (Legacy PR Reviewer):**
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### 🎯 Dashboard
- **Overview** - View GitHub stats, repositories, and quick actions
- **Quick Access** - Navigate to Playground, Projects, or PR Reviewer

### 💻 AI Playground
1. **Write/Paste Code** - Use Monaco editor or load templates
2. **Select AI Model** - Choose Auto, Claude, Gemini, or GPT-4
3. **Natural Language Prompts** - Describe what you want
4. **Quick Actions**:
   - **Refactor** - Improve code quality and structure
   - **Analyze** - Get bugs, security, performance insights
   - **Test** - Generate comprehensive unit tests
   - **Document** - Add inline comments and docs
   - **Explain** - Get detailed code explanations
5. **Apply Changes** - Use generated code in your editor

### 🚀 Project Generator
1. **Project Details** - Enter name and description
2. **Select Stack**:
   - Framework (Next.js, React, Vue, Express, etc.)
   - Database (PostgreSQL, MongoDB, MySQL, etc.)
   - Styling (Tailwind, CSS Modules, etc.)
3. **Choose Features**:
   - Authentication (JWT + bcrypt)
   - API (REST or GraphQL)
   - Testing (Vitest)
   - Deployment configs
4. **Generate** - AI creates complete project structure
5. **Deploy to GitHub** - Automatic repo creation and push
6. **Clone & Run** - Follow setup instructions

### 🔍 PR Reviewer
1. **Select Repository** - Choose from your GitHub repos
2. **View Pull Requests** - Browse all PRs
3. **AI Analysis** - Get automated code review
4. **Security Scan** - Check for vulnerabilities
5. **Generate Tests** - Create test cases for PR code
6. **Post Review** - Add AI feedback to GitHub PR

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 15 with App Router & Turbopack
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI + shadcn/ui
- **Editor:** Monaco Editor (@monaco-editor/react)
- **Animations:** Framer Motion
- **Icons:** Lucide React

### AI Integration
- **AIML API:**
  - Claude 3.5 Sonnet (anthropic/claude-3.5-sonnet)
  - Gemini 2.0 Flash (google/gemini-2.0-flash-exp)
  - GPT-4o (openai/gpt-4o)
- **Google Gemini:** 2.5 Pro (legacy PR reviewer)
- **OpenAI SDK:** For AIML API communication

### Backend & APIs
- **Authentication:** GitHub OAuth + JWT
- **GitHub API:** Full REST API integration
- **API Client:** Native Fetch + OpenAI SDK

### Deployment
- **Platform:** Vercel
- **Build:** Next.js optimized production build
- **Environment:** Edge-ready serverless functions

## 📁 Project Structure

```
IvyAI/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/              # GitHub OAuth endpoints
│   │   ├── dashboard/             # Main dashboard
│   │   ├── playground/            # AI Playground
│   │   ├── projects/              # Project Generator
│   │   ├── review/                # PR Reviewer
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Landing page
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── AIPlayground.tsx       # Interactive code editor
│   │   ├── ProjectGeneratorComponent.tsx
│   │   ├── Dashboard.tsx
│   │   ├── PRReviewer.tsx
│   │   ├── Header.tsx
│   │   └── LandingPage.tsx
│   ├── services/
│   │   ├── aimlAPI.ts             # Multi-model AI service
│   │   ├── geminiAPI.ts           # Google Gemini service
│   │   ├── githubAPI.ts           # GitHub API client
│   │   └── projectGenerator.ts    # Project scaffolding
│   ├── contexts/
│   │   └── AuthContext.tsx        # Auth state management
│   ├── hooks/                     # Custom React hooks
│   ├── lib/                       # Utility libraries
│   └── utils/                     # Helper functions
├── public/                        # Static assets
├── .env.example                   # Environment template
├── package.json                   # Dependencies
├── tailwind.config.js             # Tailwind configuration
└── tsconfig.json                  # TypeScript configuration
```

## 🚀 Deployment to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/IvyAI)

### Manual Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   
   In Vercel project settings, add:
   ```
   NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   NEXT_PUBLIC_GITHUB_REDIRECT_URI=https://your-app.vercel.app/api/auth/callback
   NEXT_PUBLIC_AIMLAPI_KEY=your_aimlapi_key
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
   ```

4. **Update GitHub OAuth**
   - Go to GitHub OAuth App settings
   - Add production callback URL: `https://your-app.vercel.app/api/auth/callback`

5. **Deploy**
   - Click "Deploy"
   - Vercel builds and deploys automatically
   - Every push to main triggers new deployment

### Environment Setup

**Development:**
```
http://localhost:3000/api/auth/callback
```

**Production:**
```
https://your-app.vercel.app/api/auth/callback
```

## 🔒 Security Best Practices

### Implemented
- ✅ GitHub OAuth secure authentication
- ✅ Environment variable configuration
- ✅ API key client-side protection
- ✅ CORS headers configured
- ✅ Secure token handling

### Recommendations
- 🔐 Store GitHub tokens in httpOnly cookies (production)
- 🔐 Implement rate limiting on API routes
- 🔐 Add CSRF protection
- 🔐 Rotate API keys regularly
- 🔐 Enable Vercel Security Headers
- 🔐 Use Vercel Edge Config for sensitive data

### Environment Variables
- Never commit `.env` to version control
- Use different keys for dev/prod
- Rotate keys after team member changes
- Monitor API usage for anomalies

## 🎨 AI Model Selection Guide

### When to Use Each Model

**Claude 3.5 Sonnet** (Best for):
- 🏗️ Architecture planning and design
- 🔄 Complex refactoring tasks
- 📚 Documentation generation
- 🔍 In-depth code reviews
- 🧠 Multi-step reasoning

**Gemini 2.0 Flash** (Best for):
- ⚡ Fast code generation
- 🚀 Boilerplate creation
- 🔧 Quick fixes and snippets
- 📝 Simple refactoring
- 💨 Autocomplete suggestions

**GPT-4o** (Best for):
- 🧪 Test case generation
- 🐛 Bug identification and fixes
- 🔧 General coding tasks
- 💡 Code explanations
- ⚖️ Balanced performance/quality

**Auto Mode**:
- 🤖 Automatically selects best model based on task
- Analyzes prompt keywords
- Optimizes for speed vs quality

## 📊 Features Comparison

| Feature | IvyAI | GitHub Copilot | Cursor |
|---------|-------|----------------|--------|
| Multi-Model AI | ✅ (3 models) | ❌ | ✅ |
| Project Generation | ✅ | ❌ | ❌ |
| Code Review | ✅ | ❌ | Limited |
| GitHub Integration | ✅ Full | ✅ Limited | ❌ |
| Interactive Playground | ✅ | ❌ | ✅ |
| Free Tier | ✅ | ❌ | Limited |
| Self-Hosted | ✅ | ❌ | ❌ |

## 🐛 Troubleshooting

### Common Issues

**1. Monaco Editor not loading**
```bash
npm install @monaco-editor/react@^4.6.0
```

**2. OpenAI module not found**
```bash
npm install openai@^4.77.0
```

**3. GitHub OAuth not working**
- Verify callback URL matches exactly
- Check client ID/secret are correct
- Ensure OAuth app is active

**4. AI API errors**
- Verify API key is valid
- Check API quota/limits
- Ensure proper environment variable format

**5. Build errors**
```bash
rm -rf .next node_modules
npm install
npm run build
```

## 🤝 Contributing

We love your input! We want to make contributing to IvyAI as easy and transparent as possible, whether it's:

- 🐛 Reporting a bug
- 💬 Discussing the current state of the code
- 🚀 Submitting a fix
- 💡 Proposing new features
- 👨‍💻 Becoming a maintainer

### Quick Start for Contributors

1. **Fork** the repository (click Fork button at top right)
2. **Clone** your fork
   ```bash
   git clone https://github.com/YOUR_USERNAME/IvyAI.git
   cd IvyAI
   ```
3. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   # or
   git checkout -b fix/bug-fix
   ```
4. **Install** dependencies
   ```bash
   npm install
   ```
5. **Make** your changes
6. **Test** thoroughly
   ```bash
   npm run build
   npm run dev
   ```
7. **Commit** with a descriptive message
   ```bash
   git commit -m "feat: add amazing feature"
   # or
   git commit -m "fix: resolve issue #123"
   ```
8. **Push** to your fork
   ```bash
   git push origin feature/amazing-feature
   ```
9. **Open** a Pull Request

### Contribution Guidelines

#### Code Style
- ✅ Use TypeScript for type safety
- ✅ Follow existing code structure and naming conventions
- ✅ Use Tailwind CSS for styling (no inline styles)
- ✅ Write clean, self-documenting code
- ✅ Add comments for complex logic

#### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Examples:
```bash
feat: add dark mode toggle to dashboard
fix: resolve authentication redirect issue
docs: update installation instructions
```

#### Pull Request Process
1. 📝 Update README.md with details of changes if needed
2. 🧪 Ensure all tests pass and app builds successfully
3. 📸 Add screenshots for UI changes
4. 🔗 Link related issues in PR description
5. ✅ Wait for review from maintainers
6. 🔄 Address any requested changes
7. 🎉 Celebrate when merged!

#### What to Contribute?

**Good First Issues** (Perfect for beginners):
- 🎨 UI/UX improvements
- 📝 Documentation enhancements
- 🐛 Bug fixes
- ✅ Adding tests
- 🌐 Translations

**Advanced Contributions**:
- 🚀 New AI agents/features
- ⚡ Performance optimizations
- 🔧 Refactoring
- 🧪 Integration testing
- 📦 New project templates

**Hacktoberfest Special**:
Look for issues labeled with:
- `hacktoberfest` - Hacktoberfest eligible
- `good first issue` - Beginner friendly
- `help wanted` - We need help!
- `enhancement` - New features

### Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to keep our community respectful and inclusive.

### Questions?

- 💬 Open a [Discussion](https://github.com/yourusername/IvyAI/discussions)
- 🐛 Report bugs via [Issues](https://github.com/yourusername/IvyAI/issues)
- 📧 Email: contribute@ivyai.dev

## 📈 Roadmap

### Phase 1 (Current) ✅
- [x] Multi-model AI integration
- [x] AI Playground
- [x] Project Generator
- [x] PR Reviewer
- [x] GitHub integration

### Phase 2 (Q1 2026)
- [ ] VS Code Extension
- [ ] Team collaboration features
- [ ] Custom AI model training
- [ ] Project templates marketplace
- [ ] Advanced analytics dashboard

### Phase 3 (Q2 2026)
- [ ] JetBrains plugin
- [ ] CLI tool
- [ ] CI/CD integration
- [ ] Mobile app
- [ ] API for third-party integrations

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **AIML API** - Multi-model AI infrastructure
- **Anthropic** - Claude 3.5 Sonnet
- **Google** - Gemini 2.0 Flash
- **OpenAI** - GPT-4o
- **Vercel** - Hosting and deployment
- **shadcn/ui** - Beautiful UI components
- **Next.js** - React framework
- **GitHub** - OAuth and API

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/IvyAI/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/IvyAI/discussions)
- **Email**: support@ivyai.dev
- **Discord**: [Join our community](https://discord.gg/ivyai)

## ⭐ Star History

If you find IvyAI useful, please consider giving it a star! ⭐

---

**Built with ❤️ by developers, for developers**

**Powered by**: Next.js 15 • TypeScript • Tailwind CSS • Claude • Gemini • GPT-4 • GitHub API
