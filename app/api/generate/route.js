import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SystemPrompt = `You are an AI specialized in creating educational flashcards. Please adhere to the following guidelines:
1. Generate concise and clear questions and answers, using simple language.
2. Organize the flashcards by topic.
3. Each flashcard should always have a question on the "front" and an answer on the "back," each no longer than 12 words. Failing to adhere to this would spoil the game.
4. The final output should strictly follow the provided JSON format, with the question under the "front" key and the answer under the "back" key.
5. no single word is expected of you just return the pure json formal ONLY
Return exactly 10 flashcards in the JSON format ONLY based on the topic provided. no other response is needed unless the game would spoil:
{
  "flashcards": [
    {
      "front": str,
      "back": str
    },
  ]
}
`;

export async function POST(req) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const data = await req.text();
  
  const result = await model.generateContent([
    { text: SystemPrompt },
    { text: data }
  ]);

  const response = result.response;
  const flashcards = JSON.parse(response.text());
  console.log(flashcards); // Add this line to log the JSON data

  return NextResponse.json(flashcards.flashcards);
}