# 🔒 Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of IvyAI seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### 🚨 Please DO NOT:
- Open a public GitHub issue for security vulnerabilities
- Disclose the vulnerability publicly before it has been addressed

### ✅ Please DO:
1. **Email us** at security@ivyai.dev with:
   - Type of vulnerability
   - Full paths of source file(s) related to the vulnerability
   - Location of the affected source code (tag/branch/commit or direct URL)
   - Step-by-step instructions to reproduce the issue
   - Proof-of-concept or exploit code (if possible)
   - Impact of the vulnerability

2. **Wait for acknowledgment** - We'll respond within 48 hours

3. **Work with us** - We may ask for additional information or guidance

### What to expect:
- **Confirmation** of receipt within 48 hours
- **Assessment** of the issue and estimated fix timeline within 7 days
- **Regular updates** on the progress
- **Credit** in the security advisory (if you wish)

## Security Best Practices for Contributors

When contributing to IvyAI:

1. **Never commit sensitive data**:
   - API keys, passwords, tokens
   - `.env` files
   - Private keys or certificates

2. **Validate all inputs**:
   - Sanitize user input
   - Use parameterized queries
   - Validate file uploads

3. **Keep dependencies updated**:
   ```bash
   npm audit
   npm audit fix
   ```

4. **Follow secure coding practices**:
   - Use HTTPS for all external requests
   - Implement proper authentication/authorization
   - Avoid SQL injection, XSS, CSRF

5. **Review code carefully**:
   - Check for security issues in PRs
   - Use ESLint security plugins
   - Run security scans

## Security Features

IvyAI implements the following security measures:

- ✅ OAuth 2.0 authentication via GitHub
- ✅ Environment variable protection
- ✅ Secure token handling
- ✅ CORS configuration
- ✅ Input validation
- ✅ Dependency vulnerability scanning

## Bug Bounty Program

We currently do not offer a paid bug bounty program, but we:
- Publicly acknowledge security researchers (with permission)
- Provide detailed credit in security advisories
- Appreciate and recognize all valid security reports

## Security Updates

Subscribe to security updates:
- Watch this repository
- Enable notifications for security advisories
- Follow our releases page

## Contact

- **Security Issues**: security@ivyai.dev
- **General Support**: support@ivyai.dev
- **GitHub**: [@yourusername](https://github.com/yourusername)

---

**Thank you for helping keep IvyAI and its users safe!** 🔒
