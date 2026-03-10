const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

if (!API_KEY) {
    console.warn("VITE_GROQ_API_KEY is not set in .env file");
}

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
    async sendMessage(message: string, history: { role: "user" | "assistant"; content: string }[] = []) {
        if (!API_KEY) {
            throw new Error("Groq API Key is missing. Please add VITE_GROQ_API_KEY to your .env file.");
        }

        try {
            // Ensure history doesn't start with an assistant message if it's the first one
            // Groq/OpenAI usually expect the first non-system message to be from the 'user'
            let filteredHistory = [...history];
            if (filteredHistory.length > 0 && filteredHistory[0].role === 'assistant') {
                filteredHistory = filteredHistory.slice(1);
            }

            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: SYSTEM_INSTRUCTION },
                        ...filteredHistory,
                        { role: "user", content: message }
                    ],
                    max_tokens: 1000,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || "Failed to get response from Groq");
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error("Error calling Groq API:", error);
            throw error;
        }
    }
};
