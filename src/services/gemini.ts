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
  // Pointing to the file you just put in /public
  return "/office2.png"; 
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
  },
  
  

  { 
    id: 8,
    title: 'Асуулт 8',
    question: 'Хэрэв цаг хугацаа болон зардал чухал биш байсан бол BPR төслүүд одоогийн (as-is) системийг илүү гүн ойлгоход илүү их цаг зарцуулах нь ашигтай байх уу? Яагаад?',
    answer: [
      "Үгүй, тийм ч ашигтай биш",
      "Business Process Reengineering (BPR)-ийн гол зорилго нь одоогийн байгаа процессыг бага зэрэг сайжруулах бус, харин процессыг сууриар нь шинэчлэх байдаг.",
      "Хэрэв as-is системийг хэт гүнзгий судалж, түүнд их цаг зарцуулбал шинжилгээний баг хуучин арга барил, одоогийн системийн логикт баригдаж, бүтээлчээр сэтгэх чадвар нь хязгаарлагддаг. Үүнийг шинжилгээний саажилт (analysis paralysis) гэж нэрлэх нь бий. ",
      "BPR-ийн хувьд одоогийн системийг зөвхөн суурь асуудлуудыг нь ойлгох хэмжээнд судалж, харин ирээдүйн to-be загварт илүү анхаарах нь зүйтэй."
    ]
  },
  { 
    id: 9,
    title: 'Асуулт 9',
    question: 'Шинжилгээний тохиромжтой стратегийг сонгоход ямар хүчин зүйлс чухал вэ?',
    answer: [
      `• Бизнесийн хэрэгцээ (Business need)
      • Төслийн зардал (Project cost)
      • Цаг хугацаа (Time pressure)
      • Эрсдэл (Risk)
      • Бизнесийн үнэ цэнэ (Potential business value)`
    ]
  },
  { 
    id: 10,
    title: 'Асуулт 10',
    question: 'Interview (ярилцлага) хийх 5 үндсэн алхмыг тайлбарла.',
    answer: [
      "1. Ярилцлага өгөх хүмүүсийг сонгох. Төсөлд хэрэгцээтэй мэдээлэл өгч чадах хэрэглэгчид, менежерүүд, оролцогч талуудыг сонгох.",
      "2. Ярилцлагын асуултуудыг боловсруулах. Нээлттэй, хаалттай болон тодруулах асуултуудыг бэлтгэх.",
      "3. Ярилцлагад бэлтгэх. Цагаа товлох, ярилцлагын төлөвлөгөөг гаргаж, оролцогчид мэдээлэл өгөх.",
      "4. Ярилцлагыг явуулах. Мэдээлэл цуглуулах, харилцаа тогтоох, тэмдэглэл хөтлөх.",
      "5. Ярилцлагын дараах ажил. Ярилцлагын тэмдэглэлийг нэгтгэж тайлан болгох, оролцогчоос тодруулах зүйл байвал асуух, баярласнаа илэрхийлэх."
    ]
  },
  { 
    id: 11,
    title: 'Асуулт 11',
    question: 'Closed-ended question, Open-ended question, Probing question гурвын ялгаа юу вэ? Аль нөхцөлд аль төрлийг ашиглах вэ?',
    answer: [
      "Closed-ended questions (Хаалттай асуултууд): Тодорхой, богино хариулт шаарддаг. Баримт батлах, тодорхой мэдээлэл цуглуулах үед ашиглана.",
      "Open-ended questions (Нээлттэй асуултууд): Оролцогчийг дэлгэрэнгүй хариулахыг уриалсан асуултууд. Үзэл бодол, хандлага, системийн талаарх ерөнхий ойлголтыг мэдэхийг хүссэн үед ашиглана.",
      "Probing questions (Тодруулах асуултууд): Өмнөх хариултыг илүү гүнзгийрүүлж, тодорхой болгох асуултууд (Жишээ нь: Яагаад?, Үүнийг жишээгээр тайлбарлаж болох уу?). Хариулт ойлгомжгүй байх эсвэл илүү дэлгэрэнгүй мэдээлэл хэрэгтэй үед ашиглана."
    ]
  },
  { 
    id: 12,
    title: 'Асуулт 12',
    question: 'Unstructured interview ба Structured interview-ийн ялгаа юу вэ? Аль аргыг ямар үед ашиглах вэ?',
    answer: [
      "Unstructured interview (Бүтэцлэгдээгүй ярилцлага) нь урьдчилан бэлдсэн асуулт багатай, чөлөөтэй яриа хэлбэрээр өрнөдөг. Шинжилгээний эхний шатанд, асуудлыг ерөнхийд нь ойлгох, шинэ санаа олох үед ашиглана.",
      "Structured interview (Бүтэцлэгдсэн ярилцлага) нь урьдчилан бэлтгэсэн тодорхой асуултуудын дагуу явагддаг. Тодорхой мэдээлэл цуглуулах, цуглуулсан мэдээллийг баталгаажуулах, шинжилгээний сүүлийн шатуудад ашиглана."
    ]
  },
  { 
    id: 13,
    title: 'Асуулт 13',
    question: 'Top-down ба Bottom-up ярилцлагын хандлагын ялгаа юу вэ? Аль хандлагыг ямар үед ашиглах вэ?',
    answer: [
      "Top-down (Дээрээс доош) нь ерөнхий асуултуудаас эхэлж, аажмаар нарийн деталь руу шилждэг. Системийн ерөнхий зорилго, стратегийг ойлгоход тохиромжтой. Ихэвчлэн өндөр түвшний менежерүүдтэй ярилцахад ашигладаг.",
      "Bottom-up (Доороос дээш) нь нарийн деталь, тодорхой асуултуудаас эхэлж, ерөнхий зураглал руу шилжинэ. Процессын техникийн нарийн ширийнийг мэдэх шаардлагатай үед, гүйцэтгэх түвшний ажилтнуудтай ярилцахад тохиромжтой."
    ]
  },
  { 
    id: 14,
    title: 'Асуулт 14',
    question: 'Ярилцлага болон JAD session-д оролцогчдыг хэрхэн сонгодог вэ?',
    answer: [
      "1. Мэдлэг (Knowledge): Системийн болон бизнесийн процессын талаар сайн мэддэг байх.",
      "2. Нөлөөлөл (Influence): Шинэ систем нэвтрэхэд хамгийн их нөлөөлөлд өртөх хүмүүс эсвэл шийдвэр гаргах эрх мэдэлтэй хүмүүс.",
      "3. Төлөөлөл (Representation): Байгууллагын янз бүрийн түвшин болон өөр өөр хэлтэс нэгжүүдийн төлөөлөл оролцох ёстой.",
      "4. JAD session-ий хувьд: Идэвхтэй оролцож чадах гол хэрэглэгчид болон асуудлыг шууд шийдэх эрх бүхий менежерүүдийг сонгох нь чухал байдаг. Түүнчлэн чиглүүлэгч (facilitator) болон тэмдэглэл хөтлөгч (scribe) заавал байх ёстой."
    ]
  },
  { 
    id: 22,
    title: 'Асуулт 22',
    question: 'Document analysis гэж юу вэ?',
    answer: [
      "Document analysis нь байгууллагад байгаа баримт бичгүүдийг (тайлан, маягт, дүрэм журам, гарын авлага гэх мэт) судалж одоогийн (as-is) системийг ойлгох арга юм.",
      "Энэ нь системийн албан ёсны бүтэц, үйл ажиллагааг тодорхойлоход ашиглагддаг."
    ]
  },
  { 
    id: 23,
    title: 'Асуулт 23',
    question: 'Formal system ба Informal system-ийн ялгаа юу вэ? Document analysis эдгээрийг ойлгоход хэрхэн тусалдаг вэ?',
    answer: [
      "Formal system нь албан ёсоор батлагдсан журам, дүрэм, маягтад тулгуурласан систем юм.",
      "Informal system нь бодит амьдрал дээр хүмүүсийн хэрэгжүүлдэг, заримдаа албан ёсны дүрмээс зөрдөг практик ажиллагаа юм.",
      "Document analysis нь formal системийг баримтаар ойлгуулж, харин маягтын зөрүү, нэмэлт өөрчлөлт зэргээр informal системийн ялгааг илрүүлэхэд тусалдаг."
    ]
  },
  { 
    id: 24,
    title: 'Асуулт 24',
    question: 'Мэдээлэл цуглуулахад observation ашиглахын гол талууд юу вэ?',
    answer: [
      "Бодит үйл явцыг шууд ажиглах боломж олгодог.",
      "Ярилцлага, асуулгын мэдээллийн үнэн зөвийг шалгахад ашигтай.",
      "Ажлын орчин, зан төлөв, эрх мэдлийн талаар ойлголт өгдөг.",
      "Гэхдээ хүмүүс ажиглагдаж байгаагаа мэдвэл зан үйлээ өөрчилж болзошгүй."
    ]
  },
  { 
    id: 25,
    title: 'Асуулт 25',
    question: 'Мэдээлэл цуглуулах аргыг сонгоход ашиглах хүчин зүйлсийг тайлбарла.',
    answer: [
      "Мэдээллийн төрөл (as-is, to-be, сайжруулалт).",
      "Мэдээллийн гүн (дэлгэрэнгүй, шалтгаан тайлбар авах боломж).",
      "Мэдээллийн хүрээ (олон эх сурвалж хамруулах чадвар).",
      "Мэдээлэл нэгтгэх боломж.",
      "Хэрэглэгчийн оролцоо.",
      "Өртөг ба хугацаа."
    ]
  },
  { 
    id: 26,
    title: 'Асуулт 26',
    question: 'Concept map нь уламжлалт текстэн шаардлагын баримт бичгээс ямар давуу талтай вэ?',
    answer: [
      "Шаардлагуудын хоорондын холбоог графикаар тодорхой харуулдаг.",
      "Функционал ба функционал бус шаардлагын уялдаа ил тод болдог.",
      "Нэмэлт шаардлага илрүүлэх, ойлголтыг сайжруулахад дэмжлэг үзүүлдэг."
    ]
  },
  { 
  id: 27,
  title: 'Асуулт 27',
  question: 'Story cards болон Task lists ашиглахын давуу талууд юу вэ?',
  answer: [
    "Story cards-ийн давуу тал:",
    "• Нэг шаардлагыг нэг карт дээр төвлөрүүлж ойлгомжтой болгодог.",
    "• Хөнгөн жинтэй, амархан шинэчлэгддэг.",
    "• Эрэмбэлэх болон эрсдэлийг үнэлэхэд тохиромжтой.",

    "Task lists-ийн давуу тал:",
    "• Нэг шаардлагыг хэрэгжүүлэх тодорхой алхмуудыг задалж өгдөг.",
    "• Ажлын хэмжээг үнэлэхэд тусалдаг.",
    "• Багийн гишүүдийн хооронд ажлыг хуваарилахад дэмжлэг үзүүлдэг."
  ]
  },
  { 
    id: 28,
    title: 'Асуулт 28',
    question: 'System proposal-д ихэвчлэн ямар мэдээлэл багтдаг вэ?',
    answer: [
      "Executive summary.",
      "System request.",
      "Workplan.",
      "Feasibility analysis.",
      "Requirements definition.",
      "Функционал, структур, зан үйлийн загварууд."
    ]
  },
  { 
    id: 29,
    title: 'Асуулт 29',
    question: 'System proposal-ын Executive summary-ийн зорилго юу вэ?',
    answer: [
      "Төслийн хамгийн чухал мэдээллийг товч, нэг хуудсанд багтаан танилцуулах.",
      "Удирдлагад баримт бичгийн гол агуулгыг хурдан ойлгох боломж олгох.",
      "Ямар хэсгийг дэлгэрэнгүй унших шаардлагатайг шийдэхэд дэмжлэг үзүүлэх."
    ]
  },
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
