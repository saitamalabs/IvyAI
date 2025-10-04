// Project Generator Service - Autonomous Project Scaffolding
import { aimlAPI } from './aimlAPI';
import { githubAPI } from './githubAPI';

export type Framework = 'nextjs' | 'react' | 'vue' | 'express' | 'nestjs' | 'django' | 'mern' | 't3';
export type Database = 'postgresql' | 'mongodb' | 'mysql' | 'sqlite' | 'none';
export type Styling = 'tailwind' | 'css-modules' | 'styled-components' | 'sass';

export interface ProjectConfig {
  name: string;
  description: string;
  framework: Framework;
  database?: Database;
  features: {
    authentication?: boolean;
    api?: 'rest' | 'graphql';
    testing?: boolean;
    deployment?: boolean;
  };
  styling?: Styling;
}

export interface ProjectFile {
  path: string;
  content: string;
}

export interface GenerationProgress {
  step: string;
  progress: number;
  message: string;
}

export type ProgressCallback = (progress: GenerationProgress) => void;

class ProjectGeneratorService {
  /**
   * Generate a complete project structure
   */
  async generateProject(
    config: ProjectConfig,
    onProgress?: ProgressCallback
  ): Promise<ProjectFile[]> {
    const files: ProjectFile[] = [];

    try {
      // Step 1: Analyze requirements
      onProgress?.({
        step: 'analyzing',
        progress: 10,
        message: 'Analyzing project requirements...',
      });

      const architecture = await this.planArchitecture(config);

      // Step 2: Generate configuration files
      onProgress?.({
        step: 'config',
        progress: 20,
        message: 'Creating configuration files...',
      });

      files.push(...(await this.generateConfigFiles(config)));

      // Step 3: Generate core files
      onProgress?.({
        step: 'core',
        progress: 40,
        message: 'Generating core components...',
      });

      files.push(...(await this.generateCoreFiles(config, architecture)));

      // Step 4: Generate features
      onProgress?.({
        step: 'features',
        progress: 60,
        message: 'Adding requested features...',
      });

      if (config.features.authentication) {
        files.push(...(await this.generateAuthFiles(config)));
      }

      if (config.features.api) {
        files.push(...(await this.generateAPIFiles(config)));
      }

      if (config.features.testing) {
        files.push(...(await this.generateTestFiles(config)));
      }

      // Step 5: Generate documentation
      onProgress?.({
        step: 'docs',
        progress: 80,
        message: 'Generating documentation...',
      });

      files.push(...(await this.generateDocumentation(config, files)));

      // Step 6: Create .env.example
      onProgress?.({
        step: 'env',
        progress: 90,
        message: 'Creating environment template...',
      });

      files.push(this.generateEnvExample(config));

      onProgress?.({
        step: 'complete',
        progress: 100,
        message: 'Project generation complete!',
      });

      return files;
    } catch (error: any) {
      throw new Error(`Project generation failed: ${error.message}`);
    }
  }

  /**
   * Plan project architecture using AI
   */
  private async planArchitecture(config: ProjectConfig): Promise<string> {
    const prompt = `Plan the architecture for a ${config.framework} project:
Name: ${config.name}
Description: ${config.description}
Database: ${config.database || 'none'}
Features: ${JSON.stringify(config.features)}

Provide:
1. Directory structure
2. Key components/modules
3. Data flow
4. Best practices for this stack`;

    return await aimlAPI.chat([
      { role: 'system', content: 'You are an expert software architect.' },
      { role: 'user', content: prompt }
    ]);
  }

  /**
   * Generate configuration files
   */
  private async generateConfigFiles(config: ProjectConfig): Promise<ProjectFile[]> {
    const files: ProjectFile[] = [];

    // package.json
    const packageJson = await this.generatePackageJson(config);
    files.push({
      path: 'package.json',
      content: packageJson,
    });

    // tsconfig.json (for TS projects)
    if (
      config.framework === 'nextjs' ||
      config.framework === 'react' ||
      config.framework === 't3'
    ) {
      files.push({
        path: 'tsconfig.json',
        content: this.getTsConfig(config.framework),
      });
    }

    // Framework-specific configs
    if (config.framework === 'nextjs' || config.framework === 't3') {
      files.push({
        path: 'next.config.js',
        content: this.getNextConfig(),
      });
    }

    if (config.styling === 'tailwind') {
      files.push(
        {
          path: 'tailwind.config.js',
          content: this.getTailwindConfig(),
        },
        {
          path: 'postcss.config.js',
          content: this.getPostcssConfig(),
        }
      );
    }

    // .gitignore
    files.push({
      path: '.gitignore',
      content: this.getGitignore(config.framework),
    });

    return files;
  }

  /**
   * Generate core application files
   */
  private async generateCoreFiles(
    config: ProjectConfig,
    architecture: string
  ): Promise<ProjectFile[]> {
    const files: ProjectFile[] = [];

    if (config.framework === 'nextjs' || config.framework === 't3') {
      // Generate Next.js structure
      const appCode = await aimlAPI.generateCode(
        `Create a Next.js app router page.tsx for: ${config.description}`,
        'typescript',
        architecture
      );

      files.push({
        path: 'src/app/page.tsx',
        content: appCode,
      });

      files.push({
        path: 'src/app/layout.tsx',
        content: this.getNextLayout(config),
      });
    } else if (config.framework === 'react') {
      // Generate React structure
      const appCode = await aimlAPI.generateCode(
        `Create a React App.tsx for: ${config.description}`,
        'typescript',
        architecture
      );

      files.push({
        path: 'src/App.tsx',
        content: appCode,
      });

      files.push({
        path: 'src/main.tsx',
        content: this.getReactMain(),
      });
    } else if (config.framework === 'express') {
      // Generate Express structure
      const serverCode = await aimlAPI.generateCode(
        `Create an Express.js server for: ${config.description}`,
        'typescript',
        architecture
      );

      files.push({
        path: 'src/server.ts',
        content: serverCode,
      });

      files.push({
        path: 'src/app.ts',
        content: this.getExpressApp(config),
      });
    }

    return files;
  }

  /**
   * Generate authentication files
   */
  private async generateAuthFiles(config: ProjectConfig): Promise<ProjectFile[]> {
    const files: ProjectFile[] = [];

    const authCode = await aimlAPI.generateCode(
      `Create authentication system for ${config.framework} with JWT and password hashing`,
      'typescript'
    );

    if (config.framework === 'nextjs') {
      files.push({
        path: 'src/lib/auth.ts',
        content: authCode,
      });

      const loginPage = await aimlAPI.generateCode(
        'Create a Next.js login page with form validation',
        'typescript'
      );

      files.push({
        path: 'src/app/login/page.tsx',
        content: loginPage,
      });
    } else if (config.framework === 'express') {
      files.push({
        path: 'src/controllers/auth.controller.ts',
        content: authCode,
      });

      const authMiddleware = await aimlAPI.generateCode(
        'Create Express JWT authentication middleware',
        'typescript'
      );

      files.push({
        path: 'src/middleware/auth.middleware.ts',
        content: authMiddleware,
      });
    }

    return files;
  }

  /**
   * Generate API files
   */
  private async generateAPIFiles(config: ProjectConfig): Promise<ProjectFile[]> {
    const files: ProjectFile[] = [];

    if (config.features.api === 'rest') {
      const apiCode = await aimlAPI.generateCode(
        `Create REST API endpoints for ${config.description}`,
        'typescript'
      );

      if (config.framework === 'nextjs') {
        files.push({
          path: 'src/app/api/route.ts',
          content: apiCode,
        });
      } else if (config.framework === 'express') {
        files.push({
          path: 'src/routes/api.routes.ts',
          content: apiCode,
        });
      }
    }

    return files;
  }

  /**
   * Generate test files
   */
  private async generateTestFiles(config: ProjectConfig): Promise<ProjectFile[]> {
    const files: ProjectFile[] = [];

    const testConfig = {
      path: 'vitest.config.ts',
      content: this.getVitestConfig(),
    };

    files.push(testConfig);

    // Generate sample tests
    const testCode = await aimlAPI.generateTests(
      `Sample component for ${config.name}`,
      'typescript',
      'vitest'
    );

    files.push({
      path: 'src/__tests__/example.test.ts',
      content: testCode,
    });

    return files;
  }

  /**
   * Generate documentation
   */
  private async generateDocumentation(
    config: ProjectConfig,
    generatedFiles: ProjectFile[]
  ): Promise<ProjectFile[]> {
    const files: ProjectFile[] = [];

    // Generate README.md
    const readmePrompt = `Create a comprehensive README.md for:
Project: ${config.name}
Description: ${config.description}
Framework: ${config.framework}
Database: ${config.database}
Features: ${JSON.stringify(config.features)}

Include:
- Overview
- Installation steps
- Environment variables
- Usage instructions
- Project structure
- Development commands`;

    const readme = await aimlAPI.generateDocumentation(
      readmePrompt,
      'markdown',
      'readme'
    );

    files.push({
      path: 'README.md',
      content: readme,
    });

    return files;
  }

  /**
   * Generate .env.example file
   */
  private generateEnvExample(config: ProjectConfig): ProjectFile {
    let content = '# Environment Variables\n\n';

    if (config.database && config.database !== 'none') {
      content += `# Database\nDATABASE_URL=\n\n`;
    }

    if (config.features.authentication) {
      content += `# Authentication\nJWT_SECRET=\nJWT_EXPIRES_IN=7d\n\n`;
    }

    content += `# API Keys\n# Add your API keys here\n`;

    return {
      path: '.env.example',
      content,
    };
  }

  /**
   * Deploy project to GitHub
   */
  async deployToGitHub(
    files: ProjectFile[],
    repoName: string,
    description: string,
    onProgress?: ProgressCallback
  ): Promise<string> {
    try {
      onProgress?.({
        step: 'creating-repo',
        progress: 10,
        message: 'Creating GitHub repository...',
      });

      // Create repository
      const repo = await githubAPI.createRepository(repoName, description);

      onProgress?.({
        step: 'uploading-files',
        progress: 30,
        message: 'Uploading files to GitHub...',
      });

      // Upload files in batches
      const batchSize = 10;
      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        await Promise.all(
          batch.map(async (file) => {
            // Check if file exists (especially README.md from auto_init)
            try {
              const existingFile = await githubAPI.getFileContent(
                repo.owner.login,
                repo.name,
                file.path
              ).catch(() => null);
              
              return githubAPI.createOrUpdateFile(
                repo.owner.login,
                repo.name,
                file.path,
                file.content,
                `Add ${file.path}`,
                existingFile?.sha
              );
            } catch (err) {
              // If file doesn't exist, create it without SHA
              return githubAPI.createOrUpdateFile(
                repo.owner.login,
                repo.name,
                file.path,
                file.content,
                `Add ${file.path}`
              );
            }
          })
        );

        const progress = 30 + ((i + batch.length) / files.length) * 60;
        onProgress?.({
          step: 'uploading-files',
          progress: Math.round(progress),
          message: `Uploaded ${i + batch.length}/${files.length} files...`,
        });
      }

      onProgress?.({
        step: 'complete',
        progress: 100,
        message: 'Deployment complete!',
      });

      return repo.html_url;
    } catch (error: any) {
      throw new Error(`GitHub deployment failed: ${error.message}`);
    }
  }

  // ===== Template Methods =====

  private async generatePackageJson(config: ProjectConfig): Promise<string> {
    const dependencies: Record<string, string> = {};
    const devDependencies: Record<string, string> = {};

    // Framework-specific dependencies
    if (config.framework === 'nextjs') {
      dependencies['next'] = '^15.0.0';
      dependencies['react'] = '^19.0.0';
      dependencies['react-dom'] = '^19.0.0';
      devDependencies['typescript'] = '^5.0.0';
      devDependencies['@types/react'] = '^19.0.0';
      devDependencies['@types/node'] = '^20.0.0';
    }

    if (config.styling === 'tailwind') {
      devDependencies['tailwindcss'] = '^4.0.0';
      devDependencies['postcss'] = '^8.0.0';
      devDependencies['autoprefixer'] = '^10.0.0';
    }

    if (config.features.testing) {
      devDependencies['vitest'] = '^1.0.0';
    }

    const packageJson = {
      name: config.name,
      version: '0.1.0',
      description: config.description,
      scripts: {
        dev: config.framework === 'nextjs' ? 'next dev' : 'npm run start',
        build: config.framework === 'nextjs' ? 'next build' : 'tsc',
        start: config.framework === 'nextjs' ? 'next start' : 'node dist/server.js',
        test: config.features.testing ? 'vitest' : 'echo "No tests configured"',
      },
      dependencies,
      devDependencies,
    };

    return JSON.stringify(packageJson, null, 2);
  }

  private getTsConfig(framework: Framework): string {
    return JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2020',
          lib: ['ES2020', 'DOM', 'DOM.Iterable'],
          jsx: 'preserve',
          module: 'ESNext',
          moduleResolution: 'bundler',
          resolveJsonModule: true,
          allowJs: true,
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true,
          noEmit: true,
          incremental: true,
          paths: {
            '@/*': ['./src/*'],
          },
        },
        include: ['src/**/*', 'next-env.d.ts'],
        exclude: ['node_modules'],
      },
      null,
      2
    );
  }

  private getNextConfig(): string {
    return `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
`;
  }

  private getTailwindConfig(): string {
    return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;
  }

  private getPostcssConfig(): string {
    return `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
  }

  private getGitignore(framework: Framework): string {
    return `# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/
dist/

# Environment
.env
.env.local
.env*.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
`;
  }

  private getNextLayout(config: ProjectConfig): string {
    return `import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '${config.name}',
  description: '${config.description}',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`;
  }

  private getReactMain(): string {
    return `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;
  }

  private getExpressApp(config: ProjectConfig): string {
    return `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
`;
  }

  private getVitestConfig(): string {
    return `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
`;
  }
}

export const projectGenerator = new ProjectGeneratorService();
