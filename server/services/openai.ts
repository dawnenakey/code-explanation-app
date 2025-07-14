import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || ""
});

export interface CodeExplanationResult {
  explanation: string;
  detectedLanguage: string;
  keyPoints: string[];
  stepByStep: Array<{
    step: string;
    description: string;
    color: string;
  }>;
  concepts: Array<{
    name: string;
    description: string;
  }>;
  performanceNotes?: string;
  optimizationSuggestions?: Array<{
    issue: string;
    solution: string;
    example: string;
  }>;
  complexityAnalysis?: {
    timeComplexity: string;
    spaceComplexity: string;
    analysis: string;
  };
  blackboxComponents?: Array<{
    name: string;
    type: string;
    description: string;
    isBlackbox: boolean;
    riskLevel: "low" | "medium" | "high";
    recommendations: string[];
  }>;
}

export async function explainCode(code: string, language: string): Promise<CodeExplanationResult> {
  try {
    // Log API key status (without revealing the key)
    const hasApiKey = !!process.env.OPENAI_API_KEY;
    console.log(`OpenAI API Key present: ${hasApiKey}`);

    if (!hasApiKey) {
      throw new Error("OpenAI API key not found in environment variables");
    }
    const prompt = `Analyze the following code and provide a comprehensive explanation with algorithmic analysis in JSON format.

Code:
\`\`\`${language}
${code}
\`\`\`

Please respond with a JSON object containing:
- explanation: A clear overview of what the code does
- detectedLanguage: The actual programming language detected (be specific, e.g., "Python", "JavaScript", "Java")
- keyPoints: Array of 3-5 key points about the code
- stepByStep: Array of objects with step, description, and color fields for step-by-step breakdown
- concepts: Array of objects with name and description for key programming concepts used
- performanceNotes: Performance analysis and optimization suggestions
- optimizationSuggestions: Array of objects with issue, solution, and example fields for specific improvements
- complexityAnalysis: Object with timeComplexity, spaceComplexity, and analysis fields
- blackboxComponents: Array of objects with name, type, description, isBlackbox (boolean), riskLevel ("low"/"medium"/"high"), and recommendations array for enterprise security analysis

Focus on:
1. Educational explanations for beginners
2. Algorithmic complexity analysis (Big O notation)
3. Specific optimization recommendations with examples
4. Data structure efficiency suggestions
5. Common performance pitfalls and solutions
6. Enterprise security analysis for banking applications

For optimization suggestions, provide specific examples like:
- "This loop has O(n²) complexity. Consider using a HashMap to reduce it to O(n)"
- "Linear search is inefficient. Use binary search for sorted arrays"
- "Recursive approach may cause stack overflow. Consider iterative solution"
- "Multiple array iterations can be combined into a single loop"

For blackbox component analysis, identify:
- External libraries, APIs, or third-party services
- Components with unknown internal implementation
- Risk assessment for enterprise banking environments
- Security recommendations for each component
- Whether components are transparent (code visible) or blackbox (opaque)

Example blackbox components:
- External APIs (high risk - unknown data handling)
- Third-party libraries (medium risk - depends on reputation)
- Database drivers (low risk - well-established)
- Cloud services (medium-high risk - external dependency)

Be specific about data structure choices and algorithmic improvements.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert programming educator who explains code in a clear, beginner-friendly way. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    // Validate the response structure
    if (!result.explanation || !result.detectedLanguage) {
      throw new Error("Invalid response format from OpenAI");
    }

    return {
      explanation: result.explanation,
      detectedLanguage: result.detectedLanguage,
      keyPoints: result.keyPoints || [],
      stepByStep: result.stepByStep || [],
      concepts: result.concepts || [],
      performanceNotes: result.performanceNotes,
      optimizationSuggestions: result.optimizationSuggestions || [],
      complexityAnalysis: result.complexityAnalysis || {
        timeComplexity: "O(1)",
        spaceComplexity: "O(1)",
        analysis: "Basic complexity analysis"
      },
      blackboxComponents: result.blackboxComponents || []
    };
  } catch (error) {
    console.error("OpenAI API error:", error);

    // Log more detailed error information
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    throw new Error(`Failed to explain code: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}