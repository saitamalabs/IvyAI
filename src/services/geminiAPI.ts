// Google Gemini AI Service for Code Review

import { PRFile } from './githubAPI';

export interface AIReviewResult {
  overallScore: number;
  bugs: string[];
  security: string[];
  performance: string[];
  bestPractices: string[];
  lineByLineFeedback: string[];
}

class GeminiAPI {
  private apiKey: string | null = null;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  setApiKey(key: string) {
    this.apiKey = key;
  }

  private createPrompt(files: PRFile[], language: string): string {
    const fileCount = files.length;
    let diffContent = '';

    files.forEach((file, index) => {
      diffContent += `\n### File ${index + 1}: ${file.filename}\n`;
      diffContent += `Status: ${file.status}\n`;
      diffContent += `Changes: +${file.additions} -${file.deletions}\n`;
      
      if (file.patch) {
        diffContent += `\`\`\`diff\n${file.patch}\n\`\`\`\n`;
      }
    });

    return `Analyze this pull request code changes and provide a comprehensive code review.

Programming Language: ${language}
Files Changed: ${fileCount}

Code Changes:
${diffContent}

Please provide:
1. Overall code quality score (1-10)
2. Potential bugs or issues (list each as a separate point)
3. Security concerns (list each as a separate point, or "None" if no concerns)
4. Performance optimization suggestions (list each as a separate point, or "None" if no suggestions)
5. Best practice recommendations (list each as a separate point)
6. Specific line-by-line feedback for critical issues (list each as a separate point, or "None" if no critical issues)

Format your response EXACTLY as follows:
SCORE: [number between 1-10]
BUGS:
- [bug 1]
- [bug 2]
or
BUGS: None

SECURITY:
- [security issue 1]
or
SECURITY: None

PERFORMANCE:
- [performance suggestion 1]
or
PERFORMANCE: None

BEST_PRACTICES:
- [best practice 1]
- [best practice 2]

LINE_FEEDBACK:
- [specific feedback 1]
or
LINE_FEEDBACK: None

Be constructive, specific, and actionable in your feedback.`;
  }

  private parseResponse(text: string): AIReviewResult {
    const result: AIReviewResult = {
      overallScore: 7,
      bugs: [],
      security: [],
      performance: [],
      bestPractices: [],
      lineByLineFeedback: [],
    };

    try {
      // Extract score
      const scoreMatch = text.match(/SCORE:\s*(\d+)/i);
      if (scoreMatch) {
        result.overallScore = parseInt(scoreMatch[1], 10);
      }

      // Helper function to extract items
      const extractItems = (section: string): string[] => {
        const regex = new RegExp(`${section}:\\s*([\\s\\S]*?)(?=\\n(?:BUGS|SECURITY|PERFORMANCE|BEST_PRACTICES|LINE_FEEDBACK|$))`, 'i');
        const match = text.match(regex);
        
        if (!match || !match[1]) return [];
        
        const content = match[1].trim();
        if (content.toLowerCase() === 'none' || content === '') return [];
        
        return content
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.startsWith('-'))
          .map(line => line.substring(1).trim())
          .filter(line => line.length > 0);
      };

      result.bugs = extractItems('BUGS');
      result.security = extractItems('SECURITY');
      result.performance = extractItems('PERFORMANCE');
      result.bestPractices = extractItems('BEST_PRACTICES');
      result.lineByLineFeedback = extractItems('LINE_FEEDBACK');

    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      // Return defaults if parsing fails
    }

    return result;
  }

  private async callGeminiAPI(prompt: string, maxTokens: number = 2048): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not set');
    }

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: maxTokens,
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Gemini API error response:', errorData);
        throw new Error(errorData?.error?.message || `Gemini API error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response from Gemini API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API call error:', error);
      throw error;
    }
  }

  async analyzeCodeReview(files: PRFile[], language: string): Promise<AIReviewResult> {
    const prompt = this.createPrompt(files, language);
    const analysisText = await this.callGeminiAPI(prompt);
    return this.parseResponse(analysisText);
  }

  async explainCode(code: string, language: string): Promise<string> {
    const prompt = `Explain this ${language} code in detail. Break down what each part does and why it's written this way:

\`\`\`${language}
${code}
\`\`\`

Provide a clear, beginner-friendly explanation.`;

    return await this.callGeminiAPI(prompt, 1024);
  }

  async generateTests(code: string, language: string, framework?: string): Promise<string> {
    const frameworkText = framework ? ` using ${framework}` : '';
    const prompt = `Generate comprehensive unit tests for this ${language} code${frameworkText}:

\`\`\`${language}
${code}
\`\`\`

Include:
1. Test cases for normal scenarios
2. Edge cases
3. Error handling tests
4. Comments explaining what each test verifies

Return only the test code, properly formatted.`;

    return await this.callGeminiAPI(prompt, 2048);
  }

  async suggestRefactoring(code: string, language: string): Promise<string> {
    const prompt = `Analyze this ${language} code and suggest refactoring improvements:

\`\`\`${language}
${code}
\`\`\`

Provide:
1. Specific refactoring suggestions
2. Improved code examples
3. Explanation of why each refactoring improves the code
4. Focus on: readability, maintainability, performance, and best practices`;

    return await this.callGeminiAPI(prompt, 2048);
  }

  async securityScan(code: string, language: string): Promise<string> {
    const prompt = `Perform a security audit of this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Identify:
1. Security vulnerabilities (SQL injection, XSS, CSRF, etc.)
2. Insecure practices
3. Data exposure risks
4. Authentication/authorization issues
5. Input validation problems

For each issue, provide:
- Severity (Critical/High/Medium/Low)
- Explanation
- Fix recommendation`;

    return await this.callGeminiAPI(prompt, 2048);
  }

  async generateDocumentation(code: string, language: string): Promise<string> {
    const prompt = `Generate comprehensive documentation for this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Include:
1. Overview/description
2. Function/class documentation
3. Parameter descriptions
4. Return value descriptions
5. Usage examples
6. Any important notes or warnings

Format using appropriate documentation style for ${language} (JSDoc, docstrings, etc.)`;

    return await this.callGeminiAPI(prompt, 2048);
  }

  async codeCompletion(partialCode: string, language: string): Promise<string> {
    const prompt = `Complete this ${language} code in a meaningful and logical way:

\`\`\`${language}
${partialCode}
\`\`\`

Provide only the completed code with brief inline comments explaining additions.`;

    return await this.callGeminiAPI(prompt, 1024);
  }
}

export const geminiAPI = new GeminiAPI();