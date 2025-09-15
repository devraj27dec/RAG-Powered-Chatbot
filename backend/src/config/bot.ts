const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });

async function sendPrompt(prompt: string): Promise<string> {
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

async function generateEmbedding(text: string) {
  try {
    const result = await embeddingModel.embedContent(text);
    return result.embedding?.values || [];
  } catch (err) {
    console.error("⚠️ Embedding error:", err?.message || err);
    // return empty vector so app keeps working
    return [];
  }
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error("Vectors must be the same length");
  }

  const dot = vecA.reduce((acc, v, i) => acc + v * (vecB[i] ?? 0), 0);
  const normA = Math.sqrt(vecA.reduce((acc, v) => acc + v * v, 0));
  const normB = Math.sqrt(vecB.reduce((acc, v) => acc + v * v, 0));

  if (normA === 0 || normB === 0) return 0;
  return dot / (normA * normB);
}

module.exports = { sendPrompt, generateEmbedding, cosineSimilarity };
