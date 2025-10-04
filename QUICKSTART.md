# ⚡ IvyAI - Quick Start Guide

Get up and running with IvyAI in 5 minutes!

## 🚀 Fast Setup

### Step 1: Clone & Install (2 min)

```bash
# Clone repository
git clone https://github.com/yourusername/IvyAI.git
cd IvyAI

# Install dependencies
npm install
# or
bun install
```

### Step 2: Environment Setup (2 min)

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Get API Keys:**
   - GitHub OAuth: https://github.com/settings/developers
   - AIML API: https://aimlapi.com
   - Gemini (optional): https://makersuite.google.com/app/apikey

3. **Configure `.env`:**
   ```env
   NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   NEXT_PUBLIC_GITHUB_REDIRECT_URI=http://localhost:3000/api/auth/callback
   NEXT_PUBLIC_AIMLAPI_KEY=your_aimlapi_key
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
   ```

### Step 3: Run (1 min)

```bash
npm run dev
```

Open http://localhost:3000 🎉

---

## 📱 First Steps

### 1. Sign In with GitHub
- Click "Sign in with GitHub" on landing page
- Authorize IvyAI
- You'll be redirected to the dashboard

### 2. Try AI Playground
- Click "Playground" in navigation
- Write or paste code
- Try quick actions:
  - **Refactor** - Improve code
  - **Analyze** - Find bugs
  - **Test** - Generate tests
  - **Explain** - Understand code

### 3. Generate a Project
- Click "Projects" in navigation
- Enter project details
- Select framework (Next.js, React, etc.)
- Choose features
- Click "Generate Project"
- Deploy to GitHub (optional)

### 4. Review a PR
- Click "Dashboard" in navigation
- Select a repository
- Choose a pull request
- Click "Analyze with AI"
- Post review to GitHub

---

## 🎯 Common Tasks

### Generate Code
```
1. Go to AI Playground
2. Type: "Create a login form with validation"
3. Click "Generate"
4. Copy the generated code
```

### Refactor Code
```
1. Paste your code in editor
2. Type: "Refactor to use async/await"
3. Click "Refactor"
4. Apply the changes
```

### Create Full Project
```
1. Go to Projects
2. Name: "my-app"
3. Description: "Todo app with auth"
4. Framework: Next.js
5. Database: PostgreSQL
6. Features: ✓ Authentication ✓ API ✓ Testing
7. Click "Generate Project"
8. Wait 2 minutes
9. Deploy to GitHub
```

---

## 🔧 Troubleshooting

### Issue: OAuth not working
**Fix:**
```bash
# Verify .env file
cat .env | grep GITHUB

# Check callback URL matches:
# GitHub: http://localhost:3000/api/auth/callback
# .env: http://localhost:3000/api/auth/callback
```

### Issue: AI not responding
**Fix:**
```bash
# Check API key
cat .env | grep AIMLAPI_KEY

# Restart server
npm run dev
```

### Issue: Monaco editor not loading
**Fix:**
```bash
npm install @monaco-editor/react@^4.6.0
npm run dev
```

---

## 📚 Learn More

- **Full Setup Guide**: See `SETUP.md`
- **API Documentation**: See `API.md`
- **Features Guide**: See `FEATURES.md`
- **README**: See `README.md`

---

## 💡 Tips

### Get Better Results
- ✅ Be specific in prompts
- ✅ Provide context
- ✅ Use the right AI model
- ✅ Iterate on results

### Model Selection
- **Auto**: Let AI choose (recommended)
- **Claude**: Complex refactoring
- **Gemini**: Fast code generation
- **GPT-4**: Testing & debugging

### Keyboard Shortcuts
- `Ctrl+Enter` / `Cmd+Enter`: Generate code
- `Ctrl+/` / `Cmd+/`: Toggle comment
- `Ctrl+S` / `Cmd+S`: Save (auto in browser)

---

## 🆘 Need Help?

- **Issues**: https://github.com/yourusername/IvyAI/issues
- **Discussions**: https://github.com/yourusername/IvyAI/discussions
- **Email**: support@ivyai.dev

---

## ⭐ Next Steps

1. ✅ Complete setup
2. ⭐ Star the repo
3. 🎨 Try AI Playground
4. 🚀 Generate your first project
5. 🔍 Review a pull request
6. 📢 Share with friends

---

**Happy Coding! 🎉**

Built with ❤️ by the IvyAI Team
