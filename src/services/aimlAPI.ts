// AIML API Service - Multi-Model AI Integration
// Supports Claude 3.5 Sonnet, Gemini 2.0 Flash, and GPT-4o

import OpenAI from 'openai';

export type AIModel = 'claude' | 'gemini' | 'gpt4' | 'auto';

export interface AIModelConfig {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
  temperature: number;
  bestFor: string[];
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIStreamChunk {
  text: string;
  done: boolean;
}

export interface CodeAnalysisResult {
  score: number;
  bugs: string[];
  security: string[];
  performance: string[];
  bestPractices: string[];
  suggestions: string[];
}

export const MODEL_CONFIGS: Record<AIModel, AIModelConfig | null> = {
  claude: {
    id: 'claude-3-5-sonnet-latest',
    name: 'Claude 3.5 Sonnet',
    description: 'Best for complex reasoning, architecture analysis, and refactoring',
    maxTokens: 8192,
    temperature: 0.7,
    bestFor: ['architecture', 'refactoring', 'documentation', 'code-review'],
  },
  gemini: {
    id: 'gemini-2.0-flash-exp',
    name: 'Gemini 2.0 Flash',
    description: 'Fastest model for code generation and quick snippets',
    maxTokens: 8192,
    temperature: 0.8,
    bestFor: ['code-generation', 'autocomplete', 'boilerplate'],
  },
  gpt4: {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Balanced model for testing, bug fixes, and general tasks',
    maxTokens: 4096,
    temperature: 0.7,
    bestFor: ['testing', 'bug-fixing', 'general'],
  },
  auto: null,
};

class AIMLAPI {
  private client: OpenAI | null = null;
  private readonly baseURL = 'https://api.aimlapi.com/v1';

  setApiKey(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      baseURL: this.baseURL,
      dangerouslyAllowBrowser: true, // For frontend usage
    });
  }

  /**
   * Automatically select the best model for a given task type
   */
  private selectModelForTask(taskType: string): AIModel {
    const taskLower = taskType.toLowerCase();

    if (taskLower.includes('refactor') || taskLower.includes('architecture') || 
        taskLower.includes('review') || taskLower.includes('documentation')) {
      return 'claude';
    }

    if (taskLower.includes('generate') || taskLower.includes('create') || 
        taskLower.includes('boilerplate') || taskLower.includes('quick')) {
      return 'gemini';
    }

    if (taskLower.includes('test') || taskLower.includes('bug') || 
        taskLower.includes('fix') || taskLower.includes('debug')) {
      return 'gpt4';
    }

    // Default to Gemini for general tasks
    return 'gemini';
  }

  /**
   * Get model configuration for a specific model
   */
  getModelConfig(model: AIModel): AIModelConfig {
    if (model === 'auto') {
      return MODEL_CONFIGS.gemini!;
    }
    return MODEL_CONFIGS[model]!;
  }

  /**
   * Make a chat completion request to the AI
   */
  async chat(
    messages: AIMessage[],
    model: AIModel = 'auto',
    taskType: string = 'general'
  ): Promise<string> {
    if (!this.client) {
      throw new Error('AIML API client not initialized. Call setApiKey first.');
    }

    const selectedModel = model === 'auto' ? this.selectModelForTask(taskType) : model;
    const config = this.getModelConfig(selectedModel);

    console.log(`[AIML API] Using model: ${config.name} for task: ${taskType}`);

    try {
      const response = await this.client.chat.completions.create({
        model: config.id,
        messages: messages as any,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
      });

      const content = response.choices[0]?.message?.content || '';
      return content;
    } catch (error: any) {
      console.error('[AIML API] Error:', error);
      throw new Error(`AI request failed: ${error.message}`);
    }
  }

  /**
   * Stream chat completion
   */
  async *chatStream(
    messages: AIMessage[],
    model: AIModel = 'auto',
    taskType: string = 'general'
  ): AsyncGenerator<AIStreamChunk> {
    if (!this.client) {
      throw new Error('AIML API client not initialized. Call setApiKey first.');
    }

    const selectedModel = model === 'auto' ? this.selectModelForTask(taskType) : model;
    const config = this.getModelConfig(selectedModel);

    console.log(`[AIML API] Streaming with model: ${config.name}`);

    try {
      const stream = await this.client.chat.completions.create({
        model: config.id,
        messages: messages as any,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          yield {
            text: content,
            done: false,
          };
        }
      }

      yield {
        text: '',
        done: true,
      };
    } catch (error: any) {
      console.error('[AIML API] Stream error:', error);
      throw new Error(`AI stream failed: ${error.message}`);
    }
  }

  /**
   * Generate code from natural language description
   */
  async generateCode(
    description: string,
    language: string = 'typescript',
    context?: string
  ): Promise<string> {
    const systemPrompt = `You are an expert ${language} developer. Generate clean, production-ready code based on the user's description. Include appropriate comments and follow best practices.`;
    
    const userPrompt = context
      ? `Context:\n${context}\n\nTask: ${description}\n\nGenerate the code:`
      : `Generate ${language} code for: ${description}`;

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    return this.chat(messages, 'gemini', 'code-generation');
  }

  /**
   * Refactor existing code
   */
  async refactorCode(
    code: string,
    language: string,
    instructions?: string
  ): Promise<string> {
    const systemPrompt = `You are an expert code refactoring assistant. Improve code quality, readability, and performance while maintaining functionality.`;
    
    const userPrompt = instructions
      ? `Refactor this ${language} code following these instructions: ${instructions}\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide the refactored code:`
      : `Refactor this ${language} code to improve quality and follow best practices:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide the refactored code:`;

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    return this.chat(messages, 'claude', 'refactor');
  }

  /**
   * Analyze code for bugs, security issues, and improvements
   */
  async analyzeCode(
    code: string,
    language: string
  ): Promise<CodeAnalysisResult> {
    const systemPrompt = `You are a code analysis expert. Analyze code for bugs, security vulnerabilities, performance issues, and best practice violations.`;
    
    const userPrompt = `Analyze this ${language} code comprehensively:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide your analysis in this exact format:
SCORE: [1-10]
BUGS:
- [bug 1]
- [bug 2]
or BUGS: None

SECURITY:
- [security issue 1]
or SECURITY: None

PERFORMANCE:
- [performance issue 1]
or PERFORMANCE: None

BEST_PRACTICES:
- [best practice 1]
- [best practice 2]

SUGGESTIONS:
- [suggestion 1]
or SUGGESTIONS: None`;

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const response = await this.chat(messages, 'claude', 'code-review');
    return this.parseCodeAnalysis(response);
  }

  /**
   * Generate unit tests
   */
  async generateTests(
    code: string,
    language: string,
    framework?: string
  ): Promise<string> {
    const frameworkText = framework ? ` using ${framework}` : '';
    const systemPrompt = `You are a testing expert. Generate comprehensive unit tests with good coverage.`;
    
    const userPrompt = `Generate unit tests${frameworkText} for this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nInclude:
1. Happy path tests
2. Edge cases
3. Error handling
4. Mock data setup

Provide only the test code:`;

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    return this.chat(messages, 'gpt4', 'testing');
  }

  /**
   * Generate documentation
   */
  async generateDocumentation(
    code: string,
    language: string,
    docType: 'inline' | 'readme' | 'api' = 'inline'
  ): Promise<string> {
    const systemPrompt = `You are a documentation expert. Generate clear, comprehensive documentation.`;
    
    let userPrompt = `Generate ${docType} documentation for this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\n`;
    
    if (docType === 'inline') {
      userPrompt += 'Add inline comments and docstrings following best practices for the language.';
    } else if (docType === 'readme') {
      userPrompt += 'Create a README.md with overview, installation, usage, and examples.';
    } else if (docType === 'api') {
      userPrompt += 'Create API documentation with endpoints, parameters, responses, and examples.';
    }

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    return this.chat(messages, 'claude', 'documentation');
  }

  /**
   * Fix bugs in code
   */
  async fixBugs(
    code: string,
    language: string,
    bugDescription?: string
  ): Promise<string> {
    const systemPrompt = `You are a debugging expert. Identify and fix bugs while maintaining code functionality.`;
    
    const userPrompt = bugDescription
      ? `Fix the following bug in this ${language} code:\nBug: ${bugDescription}\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide the fixed code:`
      : `Identify and fix any bugs in this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide the fixed code:`;

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    return this.chat(messages, 'gpt4', 'bug-fixing');
  }

  /**
   * Explain code
   */
  async explainCode(code: string, language: string): Promise<string> {
    const systemPrompt = `You are a code explanation expert. Explain code clearly and thoroughly.`;
    
    const userPrompt = `Explain this ${language} code in detail:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nBreak down:
1. What the code does
2. How it works
3. Key concepts used
4. Potential improvements`;

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    return this.chat(messages, 'claude', 'explanation');
  }

  /**
   * Convert code to another language
   */
  async convertCode(
    code: string,
    fromLanguage: string,
    toLanguage: string
  ): Promise<string> {
    const systemPrompt = `You are a code translation expert. Convert code between languages while maintaining functionality and following target language best practices.`;
    
    const userPrompt = `Convert this ${fromLanguage} code to ${toLanguage}:\n\n\`\`\`${fromLanguage}\n${code}\n\`\`\`\n\nProvide idiomatic ${toLanguage} code:`;

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    return this.chat(messages, 'gemini', 'code-generation');
  }

  /**
   * Parse code analysis response
   */
  private parseCodeAnalysis(response: string): CodeAnalysisResult {
    const result: CodeAnalysisResult = {
      score: 7,
      bugs: [],
      security: [],
      performance: [],
      bestPractices: [],
      suggestions: [],
    };

    try {
      // Extract score
      const scoreMatch = response.match(/SCORE:\s*(\d+)/i);
      if (scoreMatch) {
        result.score = parseInt(scoreMatch[1], 10);
      }

      // Helper function to extract items
      const extractItems = (section: string): string[] => {
        const regex = new RegExp(
          `${section}:\\s*([\\s\\S]*?)(?=\\n(?:BUGS|SECURITY|PERFORMANCE|BEST_PRACTICES|SUGGESTIONS|$))`,
          'i'
        );
        const match = response.match(regex);

        if (!match || !match[1]) return [];

        const content = match[1].trim();
        if (content.toLowerCase() === 'none' || content === '') return [];

        return content
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.startsWith('-'))
          .map((line) => line.substring(1).trim())
          .filter((line) => line.length > 0);
      };

      result.bugs = extractItems('BUGS');
      result.security = extractItems('SECURITY');
      result.performance = extractItems('PERFORMANCE');
      result.bestPractices = extractItems('BEST_PRACTICES');
      result.suggestions = extractItems('SUGGESTIONS');
    } catch (error) {
      console.error('[AIML API] Error parsing analysis:', error);
    }

    return result;
  }
}

export const aimlAPI = new AIMLAPI();
