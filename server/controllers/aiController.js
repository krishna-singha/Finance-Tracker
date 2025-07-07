import Groq from "groq-sdk";
import { successResponse, errorResponse } from "../utils/responseUtils.js";

// Initialize Groq AI
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const getAIAdvice = async (req, res) => {
  try {
    const { userPrompt, data } = req.body;

    if (!userPrompt) {
      return errorResponse(res, "User prompt is required", 400);
    }

    if (!process.env.GROQ_API_KEY) {
      return errorResponse(res, "Groq API key not configured", 500);
    }

    // Prepare the context with user's financial data
    const systemPrompt = `You are a professional financial advisor AI assistant. You help users with financial advice based on their data.

GUIDELINES:
- Provide helpful financial advice based on user's question
- If asked non-finance questions, politely redirect to financial topics
- Be concise (under 400 words)
- Use Indian Rupee (₹) for currency formatting
- Focus on actionable financial advice
- Be encouraging and supportive
- Only answer finance-related queries

DATA SHARING RULES:
- Share specific transaction details, amounts, and data ONLY if user explicitly asks for analysis of their data
- For general advice questions, provide general recommendations without specific data
- Always respect user's privacy unless they specifically request data analysis`;

    // Check if the question is finance-related
    const financeKeywords = ['money', 'budget', 'expense', 'income', 'save', 'invest', 'financial', 'finance', 'spending', 'earnings', 'salary', 'cost', 'price', 'rupee', 'bank', 'loan', 'debt', 'credit', 'account', 'transaction'];
    const isFinanceRelated = financeKeywords.some(keyword => 
      userPrompt.toLowerCase().includes(keyword)
    );

    // Check if user is asking for data analysis
    const dataAnalysisKeywords = ['analyze', 'analysis', 'my data', 'my transactions', 'my spending', 'my expenses', 'my income', 'total', 'amount', 'how much', 'spent', 'earned', 'breakdown', 'summary', 'review my', 'look at my', 'check my', 'spend total', 'total spend', 'spend', 'expense total', 'income total', 'show my', 'tell me my', 'what did i', 'how much did i', 'what have i'];
    const isDataAnalysisRequest = dataAnalysisKeywords.some(keyword => 
      userPrompt.toLowerCase().includes(keyword)
    );

    let userMessage;
    if (!isFinanceRelated) {
      userMessage = `The user asked: "${userPrompt}"
      
This question is not related to finance. Please politely redirect them to ask finance-related questions instead.`;
    } else if (isDataAnalysisRequest && data && data.length > 0) {
      // User specifically wants data analysis - share the data
      userMessage = `The user wants analysis of their financial data. Here is their transaction data:
${JSON.stringify(data, null, 2)}

User's question: ${userPrompt}

Please analyze this data and provide specific insights with actual numbers and details as requested.`;
    } else {
      // General financial advice without specific data
      const dataContext = data && data.length > 0 ? 
        "The user has financial transaction data available." : 
        "The user doesn't have much financial data yet.";
      
      userMessage = `Context: ${dataContext}

User's question: ${userPrompt}

Please provide helpful general financial advice without revealing specific data details.`;
    }

    // Use Groq API with Llama model
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      model: "llama3-8b-8192", // Updated to current supported model
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false
    });

    const suggestion = completion.choices[0]?.message?.content || "Sorry, I couldn't generate advice at this time.";

    return successResponse(res, {
      suggestion,
      userPrompt,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Error generating AI advice:", error);
    
    // Handle specific Groq API errors
    if (error.message?.includes('API_KEY') || error.message?.includes('authentication')) {
      return errorResponse(res, "Invalid API key configuration", 500);
    }
    
    if (error.message?.includes('rate limit') || error.message?.includes('quota')) {
      return errorResponse(res, "API rate limit exceeded. Please try again later.", 429);
    }

    if (error.message?.includes('timeout')) {
      return errorResponse(res, "Request timeout. Please try again.", 408);
    }

    return errorResponse(res, "Failed to generate AI advice. Please try again.", 500);
  }
};
