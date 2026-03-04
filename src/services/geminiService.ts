import { GoogleGenAI } from "@google/genai";
import { STUDY_PLAN_SCHEMA } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiService = {
  async getTutorResponse(prompt: string, history: { role: 'user' | 'model', parts: [{ text: string }] }[]) {
    const ai = getAI();
    const model = "gemini-3-flash-preview";
    
    // Limit history to last 10 messages to avoid token limits
    const limitedHistory = history.slice(-10);
    
    const response = await ai.models.generateContent({
      model,
      contents: limitedHistory.concat([{ role: 'user', parts: [{ text: prompt }] }]),
      config: {
        systemInstruction: `You are Abayas AI, an elite, highly intelligent tutor and mentor for Indian students (ages 15-20). 
        
        Key Traits:
        1. **Clarity**: Explain complex concepts (JEE, NEET, CBSE, Coding) with extreme clarity. Use analogies that an Indian student would understand.
        2. **Depth**: Explain the "why" behind answers. Show step-by-step logic.
        3. **Coding Mastery**: Expert in Python, Java, HTML, and SQL. Provide clean, optimized code.
        4. **Encouragement**: Be a mentor. Provide hints before full answers.
        5. **Context**: Deeply understand the Indian education system (NCERT, competitive exams).
        
        Format your responses using Markdown.`,
      }
    });
    return response.text;
  },

  async getCodingHelp(code: string, language: string, query: string) {
    const ai = getAI();
    const model = "gemini-3-flash-preview";
    const response = await ai.models.generateContent({
      model,
      contents: `Language: ${language}\nCode:\n${code}\n\nQuery: ${query}`,
      config: {
        systemInstruction: "You are a world-class AI Coding Architect. Provide intelligent, efficient, and bug-free solutions. Analyze for logic errors and performance. Use Markdown.",
      }
    });
    return response.text;
  },

  async generateStudyPlan(goal: string) {
    const ai = getAI();
    const model = "gemini-3-flash-preview";
    const response = await ai.models.generateContent({
      model,
      contents: `Create a personalized study plan for the goal: ${goal}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: STUDY_PLAN_SCHEMA,
        systemInstruction: "Create a realistic daily study plan for an Indian student. Balance school work with competitive exam prep.",
      }
    });
    return JSON.parse(response.text || "{}");
  },

  async generateNotes(studyMaterial: string) {
    const ai = getAI();
    const model = "gemini-3-flash-preview";
    const response = await ai.models.generateContent({
      model,
      contents: `Generate comprehensive, structured study notes from the following material:\n\n${studyMaterial}`,
      config: {
        systemInstruction: "You are an expert academic note-taker. Create clear, concise, and well-structured notes using Markdown. Include headings, bullet points, and highlight key terms. If the material is complex, simplify it without losing essential information.",
      }
    });
    return response.text;
  },

  async generateQuiz(topic: string) {
    const ai = getAI();
    const model = "gemini-3-flash-preview";
    const response = await ai.models.generateContent({
      model,
      contents: `Generate a 5-question multiple choice quiz about: ${topic}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  options: { type: "array", items: { type: "string" } },
                  correctAnswer: { type: "number", description: "Index of the correct option (0-3)" },
                  explanation: { type: "string" }
                },
                required: ["question", "options", "correctAnswer", "explanation"]
              }
            }
          },
          required: ["questions"]
        },
        systemInstruction: "You are an expert examiner. Create high-quality, challenging multiple-choice questions for Indian students (JEE/NEET level). Provide 4 options per question.",
      }
    });
    return JSON.parse(response.text || "{\"questions\": []}");
  }
};
