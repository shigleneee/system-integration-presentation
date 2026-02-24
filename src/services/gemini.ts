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
    title: 'Асуулт 1',
    question: 'Шинжилгээ (analysis)-ний үе шатанд ямар гол deliverable (гарц, баримт бичиг) бий болдог вэ? Шинжилгээний эцсийн deliverable юу вэ, түүнд ямар мэдээлэл багтдаг вэ?',
    answer: [
      "Шинжилгээний үе шатны гол гарц бол System Proposal буюу Системийн санал юм. Энэ нь шинэ системийг хөгжүүлэх эсэхийг шийдэх шийдвэр гаргах баримт бичиг болдог.",
      `Багтах мэдээлэл:
      • Шаардлагын тодорхойлолт
      • Ашиглалтын тохиолдлууд (Use cases)
      • Процессын загварууд
      • Өгөгдлийн загвар
      • Дахин хянасан техник-эдийн засгийн үндэслэл`
    ]
  },
  { 
    id: 2,
    title: 'Асуулт 2',
    question: 'As-is system (одоогийн систем) ба To-be system (шинэ/ирээдүйн систем) хоёрын ялгаа юу вэ?',
    answer: [
      "As-is system нь байгууллагад яг одоо ашиглагдаж буй, одоогийн нөхцөл байдал болон тулгарч буй асуудлуудыг агуулсан систем юм.",
      "To-be system нь шинжилгээний үр дүнд тодорхойлогдсон, одоогийн асуудлуудыг шийдвэрлэх зорилготой ирээдүйн шинэ систем юм."
    ]
  },
  { 
    id: 3,
    title: 'Асуулт 3',
    question: 'Requirements definition (шаардлагын тодорхойлолт)-ын зорилго юу вэ?',
    answer: [
      "Зорилго нь шинэ систем ямар функцүүдийг гүйцэтгэх болон ямар шинж чанартай байх ёстойг албан ёсоор баримтжуулахад оршино.",
      "Энэ нь хөгжүүлэлтийн баг болон хэрэглэгчдийн хооронд нэгдсэн ойлголт үүсгэж, системийн хамрах хүрээг тодорхойлдог."
    ]
  },
  { 
    id: 4,
    title: 'Асуулт 4',
    question: 'Шинжилгээний процессын үндсэн гурван алхам юу вэ? Аль алхмыг заримдаа алгасах эсвэл маш товч хийх нь бий вэ? Яагаад?',
    answer: [
      "Үндсэн 3 алхам: 1. Одоогийн нөхцөл байдлыг ойлгох, 2. Сайжруулалтын боломжуудыг тодорхойлох, 3. Шинэ системийн шаардлагыг тодорхойлох.",
      "Эхний алхам буюу 'Одоогийн нөхцөл байдлыг ойлгох'-ыг заримдаа алгасдаг. Учир нь хуучин систем маш их асуудалтай эсвэл байгууллагад өмнө нь ижил төрлийн систем байгаагүй тохиолдолд шууд 'To-be' систем рүү анхаарлаа хандуулдаг."
    ]
  },
  { 
    id: 5,
    title: 'Асуулт 5',
    question: 'BPA, BPI, BPR-ийн бизнесийн зорилгуудыг харьцуулж тайлбарла.',
    answer: [
      "BPA (Automation): Гар ажиллагааг автоматжуулж, үр ашгийг бага зэрэг нэмэгдүүлэх зорилготой.",
      "BPI (Improvement): Процессыг сайжруулж, зардал хэмнэх, үйл ажиллагааны хурдыг нэмэгдүүлэх зорилготой.",
      "BPR (Redesign): Хуучин процессыг бүрэн устгаж, үндсээр нь шинэчлэн асар их ашиг олох, өрсөлдөх чадварыг эрс нэмэгдүүлэх зорилготой."
    ]
  },
  { 
    id: 6,
    title: 'Асуулт 6',
    question: 'Problem analysis ба Root-cause analysis-ийг харьцуулж тайлбарла. Ямар нөхцөлд алийг нь ашиглах вэ?',
    answer: [
      "Problem analysis: Хэрэглэгчээс шууд асуудал болон шийдлийг асуудаг. Бага зэргийн сайжруулалт (BPA) хийхэд ашиглана.",
      "Root-cause analysis: Асуудлын жинхэнэ шалтгааныг 'Why-Five' гэх мэт аргаар олж тогтоодог. Асуудлын уг сурвалж нь тодорхойгүй, илүү гүнзгий өөрчлөлт (BPI) хийх шаардлагатай үед ашиглана."
    ]
  },
  { 
    id: 7,
    title: 'Асуулт 7',
    question: 'Duration analysis ба Activity-based costing-ийг харьцуулж тайлбарла.',
    answer: [
      "Duration analysis: Процесс бүрийн үргэлжлэх хугацааг нийт хугацаатай харьцуулж, саатал (bottleneck) үүсэж буй хэсгийг олдог.",
      "Activity-based costing: Процесс тус бүрт зарцуулагдаж буй шууд болон шууд бус санхүүгийн зардлыг тооцож, хамгийн их зардалтай үр ашиггүй хэсгийг тодорхойлдог."
    ]
  }
    // ... Асуултуудаа өмнөх байдлаар оруулаад яваарай. яг дарааллаар нь...
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
