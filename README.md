# 🤖 IvyAI - AI-Powered Code Review Assistant

An intelligent code review assistant that leverages Google Gemini AI and GitHub integration to provide automated, comprehensive code reviews for pull requests.

## ✨ Features

- **🎯 AI-Powered Reviews** - Automated code analysis using Google Gemini AI
- **🔍 Comprehensive Analysis** - Detects bugs, security issues, performance problems, and best practice violations
- **🔗 GitHub Integration** - Direct integration with GitHub repositories and pull requests
- **📊 Quality Scoring** - Provides overall code quality scores (1-10)
- **💬 Automated Comments** - Post AI-generated reviews directly to GitHub PRs
- **🎨 Modern UI** - Beautiful, responsive interface built with Next.js 15 and Tailwind CSS
- **🌓 Dark Mode** - Full dark mode support

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- GitHub OAuth App credentials
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
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

   Then configure the following variables:
   
   **GitHub OAuth Setup:**
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Create a new OAuth App
   - Set Authorization callback URL to: `http://localhost:3000/api/auth/callback`
   - Copy Client ID and Client Secret to your `.env` file:
     ```env
     NEXT_PUBLIC_GITHUB_CLIENT_ID=your_client_id_here
     GITHUB_CLIENT_ID=your_client_id_here
     GITHUB_CLIENT_SECRET=your_client_secret_here
     NEXT_PUBLIC_GITHUB_REDIRECT_URI=http://localhost:3000/api/auth/callback
     ```

   **Google Gemini API:**
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add it to your `.env` file:
     ```env
     NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
     ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

1. **Sign in with GitHub** - Click "Sign in with GitHub" on the landing page
2. **Select Repository** - Choose a repository from the dropdown
3. **View Pull Requests** - Browse all PRs in the selected repository
4. **Review PR** - Click on a PR to view details
5. **AI Analysis** - Click "Analyze with AI" to get automated code review
6. **Post Comment** - Review the AI suggestions and post them directly to GitHub

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (with Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI, shadcn/ui
- **AI:** Google Gemini 2.5 Pro (Most Advanced Model)
- **Authentication:** GitHub OAuth
- **API:** GitHub REST API

## 📁 Project Structure

```
IvyAI/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── api/         # API routes
│   │   ├── auth/        # Authentication pages
│   │   ├── dashboard/   # Dashboard page
│   │   └── review/      # PR review page
│   ├── components/       # React components
│   │   └── ui/          # shadcn/ui components
│   ├── contexts/         # React contexts
│   ├── services/         # API services
│   └── utils/           # Utility functions
├── public/              # Static assets
└── package.json         # Dependencies
```

## 🚀 Deployment to Vercel

1. **Push your code to GitHub**

2. **Import project to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   
   Add the following environment variables in Vercel project settings:
   ```
   NEXT_PUBLIC_GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   NEXT_PUBLIC_GITHUB_REDIRECT_URI=https://your-domain.vercel.app/api/auth/callback
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Update GitHub OAuth App**
   - Update the Authorization callback URL in your GitHub OAuth App settings
   - Add: `https://your-domain.vercel.app/api/auth/callback`

5. **Deploy**
   - Vercel will automatically deploy your app
   - Every push to main branch will trigger a new deployment

## 🔒 Security Notes

- Never commit `.env` file to version control
- Store sensitive credentials securely
- The current implementation stores tokens in localStorage (consider using HTTP-only cookies for production)
- Review and update dependencies regularly
- Use environment variables for all sensitive data in production

## 📝 Known Issues

- **npm audit vulnerabilities:** There are moderate severity vulnerabilities in transitive dependencies (esbuild, prismjs). These are tracked in the respective package repositories and don't affect runtime security for this application type.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for code analysis
- GitHub for repository integration
- shadcn/ui for beautiful UI components
- Next.js team for the amazing framework

---

**Built with ❤️ using Next.js, Google Gemini AI, and GitHub API**
