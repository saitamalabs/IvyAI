# 🤝 Contributing to IvyAI

First off, thank you for considering contributing to IvyAI! 🎉 It's people like you that make IvyAI such a great tool.

## 🎃 Hacktoberfest 2025

We're excited to participate in Hacktoberfest 2025! Here's how you can contribute:

### Hacktoberfest Quick Start
1. Register at [hacktoberfest.com](https://hacktoberfest.com)
2. Find issues labeled `hacktoberfest` or `good first issue`
3. Comment on the issue you want to work on
4. Wait for maintainer approval
5. Fork, code, and submit a PR
6. Celebrate when your PR gets merged! 🎉

### What Counts for Hacktoberfest?
- ✅ Bug fixes
- ✅ New features
- ✅ Documentation improvements
- ✅ UI/UX enhancements
- ✅ Tests additions
- ❌ Spam PRs (adding whitespace, minor formatting without permission)
- ❌ Duplicate PRs

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🚀 How Can I Contribute?

### 🐛 Reporting Bugs

Use our [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md) and include:
- Clear and descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if relevant
- Environment details

### 💡 Suggesting Features

Use our [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md) and describe:
- The problem you're trying to solve
- Your proposed solution
- Why it would be useful

### 🔨 Pull Requests

#### Setup Development Environment

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/IvyAI.git
cd IvyAI

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your API keys

# 4. Run dev server
npm run dev
```

#### Making Changes

```bash
# 1. Create a branch
git checkout -b feature/your-feature

# 2. Make changes and test
npm run build
npm run dev

# 3. Commit (use conventional commits)
git commit -m "feat: add amazing feature"

# 4. Push and create PR
git push origin feature/your-feature
```

## 📝 Style Guidelines

### Commit Messages (Conventional Commits)
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance

### Code Style
- ✅ Use TypeScript
- ✅ Follow existing patterns
- ✅ Use Tailwind CSS
- ✅ Add comments for complex logic
- ✅ Write clean, readable code

### React Components
```typescript
// Good ✅
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
};
```

## 🧪 Testing Checklist

Before submitting PR:
- [ ] `npm run build` passes
- [ ] Tested locally
- [ ] No console errors
- [ ] Responsive on mobile/desktop
- [ ] Works on Chrome, Firefox, Safari

## 🏷️ Issue Labels

- `hacktoberfest` - Hacktoberfest eligible
- `good first issue` - Great for newcomers
- `help wanted` - Community help needed
- `bug` - Something isn't working
- `enhancement` - New feature
- `documentation` - Docs improvements

## 🎯 Good First Issues

Perfect for beginners:
1. Fix typos in documentation
2. Improve UI/UX styling
3. Add error messages
4. Write tests
5. Add accessibility features

## 📬 Questions?

- **Discussions**: [GitHub Discussions](https://github.com/yourusername/IvyAI/discussions)
- **Issues**: [GitHub Issues](https://github.com/yourusername/IvyAI/issues)
- **Email**: contribute@ivyai.dev

## 🎉 Thank You!

Your contributions make IvyAI better for everyone! 💙

---

**Happy Coding! 🚀**
