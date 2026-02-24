// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// export async function generateOfficeImage() {
//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash-image",
//       contents: {
//         parts: [
//           {
//             text: "A high-fidelity, cinematic isometric 3D environment of a modern software engineer's office. Style: Cyberpunk-Lite with cozy plants and high-tech hardware. Zones: a dual-monitor desk with code on screens, a mechanical keyboard with glowing RGB lights, a half-eaten pizza box on a side table, a coffee station with a steaming mug, a whiteboard with hand-drawn scribbles and flowcharts, a server rack with blinking LEDs, and a cluttered bookshelf. Lighting: Golden Hour mixed with neon blue accents. Unreal Engine 5 render style, clean lines, professional but creative, 16:9 aspect ratio.",
//           },
//         ],
//       },
//       config: {
//         imageConfig: {
//           aspectRatio: "16:9",
//         },
//       },
//     });

//     for (const part of response.candidates?.[0]?.content?.parts || []) {
//       if (part.inlineData) {
//         return `data:image/png;base64,${part.inlineData.data}`;
//       }
//     }
//     return null;
//   } catch (error) {
//     console.error("Error generating image:", error);
//     return "https://picsum.photos/seed/cyberpunk/1920/1080"; // Fallback placeholder
//   }
// }

// export async function generateQuestions() {
//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-3-flash-preview",
//       contents: "Generate 29 software engineering trivia questions. Each question should have a short title (the object it's hidden in, e.g., 'The RGB Keyboard', 'The Pizza Box', 'The Scribbled Whiteboard', 'The Monstera Plant', 'The Debugging Rubber Duck'), the question itself, and the correct answer. Format as JSON array of objects: { id: number, title: string, question: string, answer: string }.",
//       config: {
//         responseMimeType: "application/json",
//       },
//     });

//     const text = response.text || "[]";
//     return JSON.parse(text);
//   } catch (error) {
//     console.error("Error generating questions:", error);
//     // Fallback questions if API fails
//     return Array.from({ length: 29 }, (_, i) => ({
//       id: i,
//       title: `Hidden Artifact #${i + 1}`,
//       question: "What is the primary purpose of version control systems like Git?",
//       answer: "To track changes in source code during software development."
//     }));
//   }
// }

/** * STATIC LAB DATA BYPASS
 * This version removes the API calls so your app runs instantly 
 * without an API key or internet errors.
 **/

export async function generateOfficeImage() {
  // Replace this URL with the local path to your Office Image if you have one
  // Or keep this high-quality placeholder
  return "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1920&h=1080"; 
}

export async function generateQuestions() {
  // PASTE YOUR 29 ANSWERS HERE
  // This ensures the teacher sees YOUR lab work, not AI trivia.
  const labData = [
    { 
        id: 1, 
        title: 'The RGB Keyboard', 
        question: 'Lab Task 1: [Your Question]', 
        answer: '[Your Lab Result/Answer]' 
    },
    { 
        id: 2, 
        title: 'The Pizza Box', 
        question: 'Lab Task 2: [Your Question]', 
        answer: '[Your Lab Result/Answer]' 
    },
    // ... Repeat for all 29 items
  ];

  // If you haven't filled all 29 yet, this fills the rest with placeholders
  const fullList = Array.from({ length: 29 }, (_, i) => {
    return labData[i] || {
      id: i + 1,
      title: `Office Artifact #${i + 1}`,
      question: `Question for lab item ${i + 1}`,
      answer: `This is the laboratory result for item ${i + 1}.`
    };
  });

  return fullList;
}