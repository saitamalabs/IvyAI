// AIML API Service - OpenAI GPT-4o Integration
// Simple wrapper using AIML API as proxy to OpenAI
// Example: https://api.aimlapi.com/v1

import OpenAI from 'openai';

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

class AIMLAPI {
  private client: OpenAI | null = null;
  private readonly baseURL = 'https://api.aimlapi.com/v1';
  private readonly model = 'gpt-4o';

  /**
   * Initialize the OpenAI client with AIML API
   * Example:
   * client = OpenAI(
   *   base_url="https://api.aimlapi.com/v1",
   *   api_key="<YOUR_AIMLAPI_KEY>",    
   * )
   */
  setApiKey(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      baseURL: this.baseURL,
      dangerouslyAllowBrowser: true,
    });
  }

  /**
   * Make a chat completion request
   * Simple wrapper for client.chat.completions.create()
   */
  async chat(messages: AIMessage[]): Promise<string> {
    if (!this.client) {
      throw new Error('AIML API client not initialized. Call setApiKey first.');
    }

    console.log(`[AIML API] Using model: ${this.model}`);

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: messages as any,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error: any) {
      console.error('[AIML API] Error:', error);
      throw new Error(`AI request failed: ${error.message}`);
    }
  }

  /**
   * Stream chat completion
   */
  async *chatStream(messages: AIMessage[]): AsyncGenerator<AIStreamChunk> {
    if (!this.client) {
      throw new Error('AIML API client not initialized. Call setApiKey first.');
    }

    console.log(`[AIML API] Streaming with model: ${this.model}`);

    try {
      const stream = await this.client.chat.completions.create({
        model: this.model,
        messages: messages as any,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          yield { text: content, done: false };
        }
      }

      yield { text: '', done: true };
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

    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);
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

    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);
  }

  /**
   * Analyze code for bugs, security issues, and improvements
   */
  async analyzeCode(code: string, language: string): Promise<CodeAnalysisResult> {
    const systemPrompt = `You are a code analysis expert. Analyze code for bugs, security vulnerabilities, performance issues, and best practice violations.`;
    
    const userPrompt = `Analyze this ${language} code comprehensively:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide your analysis in this exact format:
SCORE: [1-10]
BUGS:
- [bug 1]
or BUGS: None

SECURITY:
- [security issue 1]
or SECURITY: None

PERFORMANCE:
- [performance issue 1]
or PERFORMANCE: None

BEST_PRACTICES:
- [best practice 1]

SUGGESTIONS:
- [suggestion 1]
or SUGGESTIONS: None`;

    const response = await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);
    
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

    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);
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

    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);
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

    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);
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

    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);
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

    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);
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
