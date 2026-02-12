import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.warn("VITE_GEMINI_API_KEY is not set in .env file");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// System instruction to guide the AI's behavior and knowledge base
const SYSTEM_INSTRUCTION = `
You are the AI Assistant for PlaceIQ, an advanced placement preparation platform for AI & Data Science students.
Your goal is to help students with their learning journey, coding doubts, and placement preparation.

Knowledge Base (PlaceIQ Platform):
- **Core Features**: AI-driven learning paths, Mock Interviews, Resume Builder, Coding Challenges.
- **Curriculum**: Python, Java, Data Structures, Algorithms, Machine Learning, Deep Learning, NLP.
- **Placement**: Resume review, company-specific preparation (Google, Amazon, Microsoft, etc.).
- **User Context**: You are talking to a student. Be encouraging, precise, and helpful.

Capabilities:
1. Explain complex coding concepts simply.
2. Debug code snippets provided by the user.
3. Suggest learning paths based on their goals.
4. Provide interview tips and common questions.

Constraints:
- Do not provide full solutions to homework unless asked for an explanation.
- Keep responses concise and formatted (use Markdown).
- If you don't know something specific to the user's private data (like their exact grades), say you don't have access to that yet but can help with general advice.
`;

export const aiService = {
    async sendMessage(message: string, history: { role: "user" | "model"; parts: { text: string }[] }[] = []) {
        if (!API_KEY) {
            throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
        }

        try {
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                systemInstruction: SYSTEM_INSTRUCTION
            });

            const chat = model.startChat({
                history: history,
                generationConfig: {
                    maxOutputTokens: 1000,
                },
            });

            const result = await chat.sendMessage(message);
            const response = await result.response;
            const text = response.text();
            return text;
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            throw error;
        }
    }
};
