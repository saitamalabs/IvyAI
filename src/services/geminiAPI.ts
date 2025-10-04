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

  async analyzeCodeReview(files: PRFile[], language: string): Promise<AIReviewResult> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not set');
    }

    const prompt = this.createPrompt(files, language);

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
            maxOutputTokens: 2048,
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || `Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response from Gemini API');
      }

      const analysisText = data.candidates[0].content.parts[0].text;
      return this.parseResponse(analysisText);

    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }
}

export const geminiAPI = new GeminiAPI();