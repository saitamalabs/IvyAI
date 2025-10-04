# 🛠️ IvyAI - Complete Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [API Keys Configuration](#api-keys-configuration)
4. [Installation Steps](#installation-steps)
5. [Development Workflow](#development-workflow)
6. [Troubleshooting](#troubleshooting)
7. [Production Deployment](#production-deployment)

---

## Prerequisites

### Required Software
- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Git**: Latest version ([Download](https://git-scm.com/))
- **Code Editor**: VS Code recommended ([Download](https://code.visualstudio.com/))

### Optional (Recommended)
- **Bun**: Fast JavaScript runtime ([Install](https://bun.sh/))
- **VS Code Extensions**:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript Vue Plugin (Volar)

---

## Environment Setup

### 1. GitHub OAuth Application

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in the details:
   ```
   Application Name: IvyAI (Development)
   Homepage URL: http://localhost:3000
   Authorization callback URL: http://localhost:3000/api/auth/callback
   ```
4. Click **"Register application"**
5. Copy the **Client ID**
6. Generate and copy a new **Client Secret**

**For Production:**
- Create a separate OAuth App
- Use production URL: `https://your-domain.vercel.app`
- Callback URL: `https://your-domain.vercel.app/api/auth/callback`

### 2. AIML API Key

1. Visit [AIML API](https://aimlapi.com)
2. Sign up for an account
3. Navigate to API Keys section
4. Generate a new API key
5. Copy the key (starts with `aiml_`)

**Features Available:**
- Claude 3.5 Sonnet (anthropic/claude-3.5-sonnet)
- Gemini 2.0 Flash (google/gemini-2.0-flash-exp)
- GPT-4o (openai/gpt-4o)

### 3. Google Gemini API Key (Optional)

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click **"Create API Key"**
4. Copy the generated key

**Note**: This is only needed for the legacy PR Reviewer feature. The main AI features use AIML API.

---

## API Keys Configuration

### Create Environment File

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your credentials:

```env
# ====================================
# GITHUB OAUTH CONFIGURATION
# ====================================
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
NEXT_PUBLIC_GITHUB_REDIRECT_URI=http://localhost:3000/api/auth/callback

# ====================================
# AIML API (MULTI-MODEL AI)
# ====================================
# Get from: https://aimlapi.com
# Supports: Claude 3.5 Sonnet, Gemini 2.0 Flash, GPT-4o
NEXT_PUBLIC_AIMLAPI_KEY=your_aimlapi_key_here

# ====================================
# GOOGLE GEMINI API (OPTIONAL)
# ====================================
# Get from: https://makersuite.google.com/app/apikey
# Used for: Legacy PR Reviewer feature
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

### Environment Variables Explanation

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_GITHUB_CLIENT_ID` | ✅ Yes | GitHub OAuth Client ID (public) |
| `GITHUB_CLIENT_ID` | ✅ Yes | GitHub OAuth Client ID (server) |
| `GITHUB_CLIENT_SECRET` | ✅ Yes | GitHub OAuth Client Secret |
| `NEXT_PUBLIC_GITHUB_REDIRECT_URI` | ✅ Yes | OAuth callback URL |
| `NEXT_PUBLIC_AIMLAPI_KEY` | ✅ Yes | AIML API key for multi-model AI |
| `NEXT_PUBLIC_GEMINI_API_KEY` | ❌ No | Google Gemini API (legacy feature) |

---

## Installation Steps

### Step 1: Clone Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/IvyAI.git

# Navigate to project directory
cd IvyAI
```

### Step 2: Install Dependencies

**Using npm:**
```bash
npm install
```

**Using bun (faster):**
```bash
bun install
```

**Expected installation time**: 2-5 minutes depending on internet speed

### Step 3: Verify Installation

Check if all dependencies are installed:
```bash
npm list --depth=0
```

Key packages to verify:
- `next`: ^15.3.5
- `react`: ^19.0.0
- `openai`: ^4.77.0
- `@monaco-editor/react`: ^4.6.0
- `tailwindcss`: ^4.0.0

### Step 4: Configure Environment

1. Ensure `.env` file exists with all required variables
2. Verify API keys are valid
3. Test GitHub OAuth callback URL is correct

### Step 5: Start Development Server

**Using npm:**
```bash
npm run dev
```

**Using bun:**
```bash
bun dev
```

**Expected output:**
```
▲ Next.js 15.3.5
- Local:        http://localhost:3000
- Environments: .env

✓ Ready in 2.3s
```

### Step 6: Verify Application

1. Open browser: `http://localhost:3000`
2. You should see the IvyAI landing page
3. Click "Sign in with GitHub"
4. Complete OAuth flow
5. You should be redirected to Dashboard

---

## Development Workflow

### Project Structure Overview

```
IvyAI/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   ├── services/            # API services
│   ├── contexts/            # React Context providers
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Utilities
│   └── utils/               # Helper functions
├── public/                  # Static assets
└── [config files]           # TS, Tailwind, etc.
```

### Available Scripts

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm start

# Run ESLint
npm run lint

# Type checking
npx tsc --noEmit
```

### Key Features Development Paths

**1. AI Playground**
- Entry: `src/app/playground/page.tsx`
- Component: `src/components/AIPlayground.tsx`
- Service: `src/services/aimlAPI.ts`

**2. Project Generator**
- Entry: `src/app/projects/page.tsx`
- Component: `src/components/ProjectGeneratorComponent.tsx`
- Service: `src/services/projectGenerator.ts`

**3. PR Reviewer**
- Entry: `src/app/review/page.tsx`
- Component: `src/components/PRReviewer.tsx`
- Services: `src/services/geminiAPI.ts`, `src/services/githubAPI.ts`

**4. Dashboard**
- Entry: `src/app/dashboard/page.tsx`
- Component: `src/components/Dashboard.tsx`

### Making Changes

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow TypeScript best practices
   - Use Tailwind CSS for styling
   - Keep components small and focused
   - Add proper types for all functions

3. **Test your changes:**
   ```bash
   npm run build
   ```

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

### Code Style Guidelines

- **TypeScript**: Strict mode enabled
- **Formatting**: Use consistent indentation (2 spaces)
- **Naming**: 
  - Components: PascalCase (`MyComponent.tsx`)
  - Functions: camelCase (`handleClick`)
  - Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Imports**: Group and sort (React → Third-party → Local)

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Module Not Found Errors

**Error**: `Cannot find module '@monaco-editor/react'`

**Solution**:
```bash
npm install @monaco-editor/react@^4.6.0
```

**Error**: `Cannot find module 'openai'`

**Solution**:
```bash
npm install openai@^4.77.0
```

#### 2. GitHub OAuth Not Working

**Symptoms**:
- Redirect to error page after OAuth
- "Invalid callback URL" error

**Solutions**:
1. Verify callback URL in GitHub OAuth App matches `.env`:
   ```
   Dev: http://localhost:3000/api/auth/callback
   ```
2. Check `NEXT_PUBLIC_GITHUB_CLIENT_ID` is correct
3. Ensure `GITHUB_CLIENT_SECRET` has no extra spaces
4. Try regenerating the client secret

#### 3. AI API Errors

**Error**: `AIML API key not configured`

**Solution**:
1. Verify `.env` has `NEXT_PUBLIC_AIMLAPI_KEY`
2. Restart dev server after adding environment variables
3. Check API key is valid at [AIML Dashboard](https://aimlapi.com/dashboard)

**Error**: `AI request failed: 401 Unauthorized`

**Solution**:
- API key might be invalid or expired
- Regenerate key from AIML dashboard
- Update `.env` file

#### 4. Build Errors

**Error**: Build fails with TypeScript errors

**Solution**:
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**Error**: `Module build failed: UnhandledSchemeError`

**Solution**:
- Check all imports are correct
- Ensure all dependencies are installed
- Restart dev server

#### 5. Monaco Editor Not Loading

**Symptoms**:
- Blank editor in AI Playground
- Console errors about Monaco

**Solution**:
```bash
# Reinstall Monaco editor
npm uninstall @monaco-editor/react
npm install @monaco-editor/react@^4.6.0
```

### Debug Mode

Enable verbose logging:

```bash
# Set debug environment variable
DEBUG=* npm run dev
```

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] All environment variables configured in Vercel
- [ ] GitHub OAuth callback URL updated for production
- [ ] API keys are production keys (not dev keys)
- [ ] Build completes successfully locally
- [ ] All features tested in production-like environment
- [ ] Security headers configured in `vercel.json`

### Vercel Deployment Steps

1. **Push to GitHub:**
   ```bash
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select "IvyAI" repository

3. **Configure Project:**
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Add Environment Variables:**
   ```
   NEXT_PUBLIC_GITHUB_CLIENT_ID=your_prod_client_id
   GITHUB_CLIENT_ID=your_prod_client_id
   GITHUB_CLIENT_SECRET=your_prod_client_secret
   NEXT_PUBLIC_GITHUB_REDIRECT_URI=https://your-app.vercel.app/api/auth/callback
   NEXT_PUBLIC_AIMLAPI_KEY=your_prod_aimlapi_key
   NEXT_PUBLIC_GEMINI_API_KEY=your_prod_gemini_key
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (2-5 minutes)
   - Visit your production URL

6. **Update GitHub OAuth:**
   - Add production callback URL: `https://your-app.vercel.app/api/auth/callback`
   - Test OAuth flow in production

### Post-Deployment Verification

- [ ] Landing page loads correctly
- [ ] GitHub OAuth works
- [ ] Dashboard shows correct data
- [ ] AI Playground generates code
- [ ] Project Generator creates projects
- [ ] PR Reviewer analyzes code

### Monitoring

**Vercel Analytics:**
- Enable in Vercel dashboard
- Monitor page load times
- Track user interactions

**Error Tracking:**
- Check Vercel deployment logs
- Monitor browser console for errors
- Set up error reporting (Sentry, etc.)

---

## Additional Resources

### Documentation Links
- [Next.js 15 Docs](https://nextjs.org/docs)
- [AIML API Docs](https://docs.aimlapi.com)
- [GitHub API Docs](https://docs.github.com/en/rest)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)

### Support
- GitHub Issues: [Report bugs](https://github.com/yourusername/IvyAI/issues)
- Discussions: [Ask questions](https://github.com/yourusername/IvyAI/discussions)
- Email: support@ivyai.dev

---

**Last Updated**: October 2025  
**Version**: 1.0.0  
**Maintainers**: IvyAI Team
