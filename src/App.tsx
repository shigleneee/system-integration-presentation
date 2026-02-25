/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Monitor, 
  X,
  ChevronRight,
  Trophy,
  Workflow
} from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';
import { generateOfficeImage, generateQuestions } from './services/gemini';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Question {
  id: number;
  title: string;
  question: string;
  answer: string[];
  x: number;
  y: number;
  found: boolean;
  zone: string;
}

const ZONES = [
  { name: 'Ширээ', x: [20, 50], y: [40, 70] },
  { name: 'Кофены хэсэг', x: [70, 90], y: [60, 85] },
  { name: 'Самбар', x: [5, 25], y: [15, 45] },
  { name: 'Сервер', x: [75, 95], y: [10, 50] },
  { name: 'Номын тавиур', x: [40, 70], y: [10, 35] },
];

// ─────────────────────────────────────────────
// E-Zaal SDLC Inline Component
// ─────────────────────────────────────────────

const C = {
  bg: '#07090f', surface: '#0c1220', border: '#182030', border2: '#1e3050',
  text: '#c8d8f0', muted: '#4a6880', dim: '#243040',
  p1: '#4fc3f7', p2: '#66bb6a', p3: '#ffa726',
  p4: '#ab47bc', p5: '#ef5350', p6: '#26c6da',
};

type CV = 'blue'|'green'|'orange'|'purple'|'red'|'cyan';
const CS: Record<CV, React.CSSProperties> = {
  blue:   { background:'#0a1f30', color:C.p1, border:'1px solid #1a3a50' },
  green:  { background:'#0a1f0a', color:C.p2, border:'1px solid #1a3a1a' },
  orange: { background:'#1f1a0a', color:C.p3, border:'1px solid #3a2a0a' },
  purple: { background:'#1a0a1f', color:C.p4, border:'1px solid #3a1a3a' },
  red:    { background:'#1f0a0a', color:C.p5, border:'1px solid #3a1a1a' },
  cyan:   { background:'#0a1a1f', color:C.p6, border:'1px solid #1a3a3a' },
};

const Chip: React.FC<{ label:string; variant:CV }> = ({ label, variant }) => (
  <span style={{ ...CS[variant], display:'inline-block', padding:'2px 8px', borderRadius:4,
    fontSize:'0.58rem', fontFamily:"'IBM Plex Mono',monospace", margin:'2px 2px 2px 0' }}>
    {label}
  </span>
);

const OBox: React.FC<{ items:string[]; title?:string }> = ({ items, title='Гаралт (Outputs)' }) => (
  <div style={{ background:'#090e18', border:`1px solid ${C.border2}`, borderRadius:6, padding:'10px 12px', marginTop:8 }}>
    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'0.55rem', color:C.muted,
      letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:6 }}>{title}</div>
    {items.map((item, i) => (
      <div key={i} style={{ fontSize:'0.63rem', color:'#7a9ab5', padding:'2px 0',
        borderBottom: i<items.length-1 ? `1px solid ${C.border}` : 'none', lineHeight:1.4 }}>
        <span style={{ color:C.dim, fontSize:'0.55rem' }}>→ </span>{item}
      </div>
    ))}
  </div>
);

const Dot: React.FC<{ color:string }> = ({ color }) => (
  <div style={{ width:5,height:5,borderRadius:'50%',border:`1.5px solid ${color}`,flexShrink:0,marginTop:5 }} />
);

const It: React.FC<{ label?:string; text:React.ReactNode; color:string }> = ({ label, text, color }) => (
  <div style={{ display:'flex', gap:8, marginBottom:8, alignItems:'flex-start' }}>
    <Dot color={color} />
    <div style={{ fontSize:'0.68rem', color:'#8aaac8', lineHeight:1.55 }}>
      {label && <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'0.58rem',
        color:C.muted, display:'block', marginBottom:1 }}>{label}</span>}
      {text}
    </div>
  </div>
);

const CT: React.FC<{ children:React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'0.58rem', letterSpacing:'0.12em',
    textTransform:'uppercase', color:C.muted, marginBottom:10, paddingBottom:6,
    borderBottom:`1px solid ${C.border2}` }}>{children}</div>
);

const G3: React.FC<{ children:React.ReactNode }> = ({ children }) => (
  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>{children}</div>
);

interface PhaseData {
  num:string; name:string; tagline:string; tag:string; icon:string;
  color:string; numBg:string; tagBorder:string; body:React.ReactNode;
}

const PHASES: PhaseData[] = [
  {
    num:'01', name:'Төлөвлөлт', tag:'Суурь үе шат', icon:'🎯', color:C.p1,
    numBg:'#0a1f30', tagBorder:'#1a3a50',
    tagline:'Системийн зорилго, хамрах хүрээ, боломжийн үнэлгээг тодорхойлох үе шат',
    body:(
      <G3>
        <div>
          <CT>📋 Зорилго & Хамрах хүрээ</CT>
          <It color={C.p1} label="Системийн зорилго" text="Улаанбаатар хотын заалнуудыг нэг платформд нэгтгэж, хэрэглэгчдэд захиалга хийх боломж олгох" />
          <It color={C.p1} label="Хамрах хүрээ" text="Цаг захиалах, байршил харьцуулах, үнэ шалгах, онлайн төлбөр хийх" />
          <It color={C.p1} label="Зах зээлийн давуу тал" text='Хэрэглэгчийн "search cost"-ыг бууруулсан нэгдсэн aggregation шийдэл' />
          <OBox items={['System Request баримт бичиг','Feasibility Analysis тайлан','Workplan / Ажлын хуваарь']} />
        </div>
        <div>
          <CT>👥 Stakeholder тодорхойлох</CT>
          <It color={C.p1} label="Дотоод оролцогчид" text={<><Chip label="Төслийн эзэн" variant="blue"/><Chip label="IT баг" variant="blue"/><Chip label="Системийн Админ" variant="blue"/><Chip label="Маркетинг баг" variant="blue"/></>} />
          <It color={C.p1} label="Гадаад оролцогчид" text={<><Chip label="Хэрэглэгч" variant="orange"/><Chip label="Заалны эзэд" variant="green"/><Chip label="QPay/Monpay" variant="orange"/><Chip label="E-Barimt" variant="purple"/><Chip label="БТСУХ" variant="cyan"/></>} />
          <It color={C.p1} label="Технологийн нийлүүлэгчид" text={<><Chip label="AWS/GCloud" variant="cyan"/><Chip label="SMS/Email" variant="cyan"/></>} />
        </div>
        <div>
          <CT>🔍 Feasibility шинжилгээ</CT>
          <It color={C.p1} label="Техникийн боломж" text="QPay, Monpay, E-Barimt API бэлэн. Cloud hosting дэд бүтэц бий." />
          <It color={C.p1} label="Зохион байгуулалтын боломж" text="Спорт заалнуудыг платформд нэгтгэх сонирхол өндөр." />
          <It color={C.p1} label="Хуулийн боломж" text="E-Barimt, НӨАТ, Хувийн мэдээлэл хамгаалах хуульд нийцэх шаардлага тодорхой." />
          <It color={C.p1} label="Цагийн тооцоо" text="MVP: 3–4 сар. Бүрэн систем: 6–8 сар." />
        </div>
      </G3>
    ),
  },
  {
    num:'02', name:'Шинжилгээ', tag:'Шаардлага цуглуулах', icon:'🔬', color:C.p2,
    numBg:'#0a1f0a', tagBorder:'#1a3a1a',
    tagline:'Функциональ болон функциональ бус шаардлагуудыг нарийвчлан тодорхойлох үе шат',
    body:(
      <G3>
        <div>
          <CT>⚙️ Functional Requirements</CT>
          {[['FR-01','Бүртгэл / нэвтрэх / профайл удирдах'],['FR-02','Заал хайх, шүүх (төрөл, байршил, үнэ, цаг)'],
            ['FR-03','Заалны цаг захиалах (3 алхам)'],['FR-04','Захиалга / Онлайн төлбөрийн процесс'],
            ['FR-05','Заалны байршлыг газрын зураг дээр харах'],['FR-06','Сэтгэгдэл, үнэлгээ бичих функц'],
            ['FR-07','Спортын төрлөөр шүүх — Сагсан, Гар, Хөл бөмбөг гэх мэт'],
            ['FR-08','Спортын сургалтын мэдээлэл харах, бүртгүүлэх'],
          ].map(([l,t])=><It key={l} color={C.p2} label={l} text={t}/>)}
        </div>
        <div>
          <CT>📊 Non-Functional Requirements</CT>
          <It color={C.p2} label="Гүйцэтгэл" text="Хайх/захиалахад <2 секундэд хариу. 1,000+ зэрэг хандалтад гацахгүй." />
          <It color={C.p2} label="Бэлэн байдал" text="365/24/7 — 99.9% uptime. 1 цагт сэргэх." />
          <It color={C.p2} label="Аюулгүй байдал" text="PCI DSS, SSL/TLS. Өгөгдөл Encryption-аар хадгалагдана." />
          <It color={C.p2} label="Хэрэглэхэд хялбар" text="3 алхмын intuitive захиалга. Responsive Design." />
          <It color={C.p2} label="Өргөжөх боломж" text="10x нэмэгдэхэд Horizontal Scaling-аар архитектур өөрчлөлтгүй." />
          <It color={C.p2} label="Хууль / Стандарт" text="Хувийн мэдээлэл хамгаалах хууль. E-Barimt НӨАТ автоматжуулалт." />
        </div>
        <div>
          <CT>🗺️ Use Case & Stakeholder</CT>
          <It color={C.p2} label="Хэрэглэгч" text="Заал хайх → Цаг захиалах → Онлайн төлбөр → И-баримт авах" />
          <It color={C.p2} label="Заалны эзэн" text="Цаг, үнэ оруулах → Захиалгын тайлан → Орлогын тайлан" />
          <It color={C.p2} label="Системийн Админ" text="Эрх удирдах → Серверийг хянах → Заал нэмэх/устгах" />
          <It color={C.p2} label="Гадаад систем" text="QPay/Monpay API → E-Barimt API → SMS/Email мэдэгдэл" />
          <OBox items={['Requirements Definition баримт','Use Case диаграм','System Proposal']} />
        </div>
      </G3>
    ),
  },
  {
    num:'03', name:'Design — Дизайн', tag:'Архитектур & UI', icon:'🎨', color:C.p3,
    numBg:'#1f1a0a', tagBorder:'#3a2a0a',
    tagline:'Системийн архитектур, өгөгдлийн бүтэц, UI/UX загварыг гаргах үе шат',
    body:(
      <G3>
        <div>
          <CT>🖥️ UI/UX Дизайн</CT>
          <It color={C.p3} label="3 алхмын захиалга урсгал" text="Нэвтрэх → Заал сонгох → Цаг/төлбөр баталгаажуулах" />
          <It color={C.p3} label="Responsive Design" text="Mobile-first — утас, таблет, PC дэлгэц бүрт зөв харагдах" />
          <It color={C.p3} label="Байршлын харьцуулалт" text="Байршил, үнэ, цагийн хуваарийг нэг дэлгэцэн дээр харьцуулах" />
          <It color={C.p3} label="Хайлтын шүүлтүүр" text="Спортын төрөл, байршил, үнийн хязгаар" />
        </div>
        <div>
          <CT>🏗️ Системийн Архитектур</CT>
          <It color={C.p3} label="Horizontal Scaling" text="10x өсөхөд архитектурын өөрчлөлтгүйгээр даах бүтэц" />
          <It color={C.p3} label="Cloud Infrastructure" text="AWS / Google Cloud. 99.9% uptime хангах." />
          <It color={C.p3} label="API Gateway дизайн" text="QPay, Monpay, SocialPay. E-Barimt. SMS мэдэгдлийн API." />
          <It color={C.p3} label="DB бүтэц" text="Хэрэглэгч, заал, захиалга, гүйлгээ хүснэгтүүд. Encryption-тэй." />
        </div>
        <div>
          <CT>🔒 Аюулгүй байдлын дизайн</CT>
          <It color={C.p3} label="Төлбөрийн аюулгүй байдал" text="PCI DSS стандарт, SSL/TLS протокол бүрэн хэрэгжүүлэх" />
          <It color={C.p3} label="Өгөгдлийн шифрлэлт" text="Утасны дугаар, нууц үг DB-д Encryption хэлбэрээр" />
          <It color={C.p3} label="Хандалтын эрх" text="Role-based: Хэрэглэгч / Vendor / Админ тус бүр өөр эрхтэй" />
          <It color={C.p3} label="Cloud Backup" text="Захиалга, гүйлгээний мэдээллийг өдөр бүр автоматаар нөөцлөх" />
          <OBox items={['Wireframe / Prototype','DB Schema диаграм','API дизайн баримт','Архитектурын диаграм']} />
        </div>
      </G3>
    ),
  },
  {
    num:'04', name:'Implementation — Хөгжүүлэлт', tag:'Кодлох & Интеграц', icon:'💻', color:C.p4,
    numBg:'#1a0a1f', tagBorder:'#3a1a3a',
    tagline:'Системийг бодит код болгон хөгжүүлж, гадаад системүүдтэй холбох үе шат',
    body:(
      <G3>
        <div>
          <CT>🖼️ Frontend хөгжүүлэлт</CT>
          <It color={C.p4} label="Хайлт & Шүүлтүүр" text="Спортын төрөл, байршил, үнэ, цагаар хайх UI" />
          <It color={C.p4} label="Захиалгын урсгал" text="3 алхмын intuitive flow: Заал → Цаг → Баталгаажуулалт" />
          <It color={C.p4} label="Байршлын харьцуулалт" text="Хэрэглэгчид ойр заалнуудыг газрын зурагтай харуулах" />
          <It color={C.p4} label="Vendor Portal" text="Заалны эзэд цаг, үнэ, мэдээлэл оруулах, тайлан харах дэлгэц" />
        </div>
        <div>
          <CT>⚡ Backend & API Интеграц</CT>
          <It color={C.p4} label="QPay / Monpay / SocialPay" text="Төлбөрийн гарцуудтай API интеграц. Гүйлгээг баталгаажуулах логик." />
          <It color={C.p4} label="E-Barimt API" text="Гүйлгээ бүрд НӨАТ-ын баримт автоматаар үүсгэх." />
          <It color={C.p4} label="SMS / Email мэдэгдэл" text="Захиалга баталгаажсан үед автоматаар мэдэгдэл илгээх." />
          <It color={C.p4} label="Cloud Deployment" text="AWS / GCloud. Auto-scaling тохируулах." />
        </div>
        <div>
          <CT>👤 Хөгжүүлэлтийн баг & Үүрэг</CT>
          <It color={C.p4} label="ИТ инженерүүд" text="Код бичих, өгөгдлийн сангийн бүтэц болон аюулгүй байдлыг хангах" />
          <It color={C.p4} label="Системийн Админ" text="Эрх удирдах, серверийн ажиллагааг хянах, алдаа засварлах" />
          <It color={C.p4} label="Маркетинг баг" text="Шинэ спорт заалнуудыг системд нэгтгэх, vendor onboarding хийх" />
          <OBox items={['Working system','API интеграцийн баримт','Admin panel','Vendor portal']} />
        </div>
      </G3>
    ),
  },
  {
    num:'05', name:'Testing — Тест', tag:'Чанарын баталгаа', icon:'🧪', color:C.p5,
    numBg:'#1f0a0a', tagBorder:'#3a1a1a',
    tagline:'Non-functional шаардлагуудыг баталгаажуулах, алдаа илрүүлэх үе шат',
    body:(
      <G3>
        <div>
          <CT>⚡ Гүйцэтгэлийн тест</CT>
          <It color={C.p5} label="Response Time тест" text="Захиалах товч дарахад 2 секундэд хариу өгч байгаа эсэхийг шалгах" />
          <It color={C.p5} label="Load Test" text="1,000+ хэрэглэгч зэрэг хандахад систем гацахгүй эсэхийг шалгах" />
          <It color={C.p5} label="Peak Load симуляц" text="Ажлын цаг дуусах үеийн ачааллыг дуурайлган туршиж, тогтвортой байдлыг шалгах" />
        </div>
        <div>
          <CT>🔐 Аюулгүй байдлын тест</CT>
          <It color={C.p5} label="PCI DSS шалгалт" text="Төлбөрийн гүйлгээ PCI DSS стандартад нийцэж байгаа эсэхийг баталгаажуулах" />
          <It color={C.p5} label="Encryption тест" text="Хэрэглэгчийн утасны дугаар, нууц үг зөв шифрлэгдсэн эсэхийг шалгах" />
          <It color={C.p5} label="Role-based access тест" text="Зөвхөн эрх бүхий админ санхүүгийн тайланд хандах эрхтэй байгааг шалгах" />
          <It color={C.p5} label="SSL/TLS тест" text="Бүх API холболт шифрлэгдсэн протоколоор явагдаж байгааг шалгах" />
        </div>
        <div>
          <CT>👥 Хэрэглэгчийн тест (UAT)</CT>
          <It color={C.p5} label="3 алхмын захиалга UAT" text="Бодит хэрэглэгчид 3 алхмын дотор захиалга дуусгаж чадаж байгаа эсэхийг туршах" />
          <It color={C.p5} label="Responsive тест" text="iOS, Android, таблет, PC дэлгэц дээр зөв харагдаж байгааг шалгах" />
          <It color={C.p5} label="E-Barimt интеграц тест" text="Гүйлгээ бүрд НӨАТ-ын баримт зөв үүсгэгдэж байгааг шалгах" />
          <It color={C.p5} label="Backup сэргээлтийн тест" text="Систем унасан тохиолдолд 1 цагийн дотор сэргэх эсэхийг туршах" />
          <OBox items={['Test report — алдааны жагсаалт','UAT баталгаажуулалт','Security audit тайлан']} />
        </div>
      </G3>
    ),
  },
  {
    num:'06', name:'Maintenance — Засвар үйлчилгээ', tag:'Тасралтгүй үйл ажиллагаа', icon:'🔧', color:C.p6,
    numBg:'#0a1a1f', tagBorder:'#1a3a3a',
    tagline:'Системийг байнга ажиллуулах, сайжруулах, өргөжүүлэх үе шат',
    body:(
      <G3>
        <div>
          <CT>🖥️ Системийн ажиллагаа</CT>
          <It color={C.p6} label="99.9% Uptime" text="365/24/7 тасралтгүй ажиллагаа хангах. Серверийг байнга хянах." />
          <It color={C.p6} label="Өдөр бүрийн Backup" text="Захиалга, төлбөрийн мэдээллийг автоматаар Cloud Backup хийх." />
          <It color={C.p6} label="Техникийн алдаа засварлах" text="Гарсан техникийн алдааг шуурхай засварлах." />
        </div>
        <div>
          <CT>📈 Өргөжүүлэлт & Сайжруулалт</CT>
          <It color={C.p6} label="Шинэ заал нэмэх" text="Маркетинг баг шинэ спорт заалнуудыг тасралтгүй системд нэгтгэж байх." />
          <It color={C.p6} label="Horizontal Scaling" text="Хэрэглэгч болон заалны тоо 10x нэмэгдэхэд архитектур өөрчлөлтгүйгээр даах." />
          <It color={C.p6} label="Dynamic Pricing" text='Vendor-уудад оргил/сул цагийн шинжилгээ хийж "Уян хатан үнийн тариф" тогтооход туслах.' />
          <It color={C.p6} label="Business Intelligence" text="Захиалгын тайлан, гүйлгээний мэдээлэлд суурилсан шийдвэр гаргалтыг дэмжих." />
        </div>
        <div>
          <CT>💬 Хэрэглэгчийн санал & Хууль</CT>
          <It color={C.p6} label="Хэрэглэгчийн санал" text="Үнэлгээ, сэтгэгдлийн мэдээллийг ашиглан системийг байнга сайжруулах." />
          <It color={C.p6} label="Хуулийн шинэчлэлт" text="МУ-ын Хувийн мэдээлэл хамгаалах хуульд гарах өөрчлөлтүүдийг дагаж шинэчлэх." />
          <It color={C.p6} label="E-Barimt шинэчлэлт" text="Татварын системийн API өөрчлөлтийг тасралтгүй дагах." />
          <It color={C.p6} label="БТСУХ бодлогын уялдаа" text="Нийтийн биеийн тамирыг дэмжих бодлогод нийцсэн байдлаа хадгалах." />
          <OBox title="Тасралтгүй гаралт" items={['Системийн гүйцэтгэлийн тайлан','Шинэ версийн release','Vendor onboarding тайлан','Хэрэглэгчийн сэтгэл ханамжийн тайлан']} />
        </div>
      </G3>
    ),
  },
];

const FLOW_STEPS = [
  { label:'01 Planning',       bg:'#0a1f30', color:C.p1, border:'#1a3a50' },
  { label:'02 Analysis',       bg:'#0a1f0a', color:C.p2, border:'#1a3a1a' },
  { label:'03 Design',         bg:'#1f1a0a', color:C.p3, border:'#3a2a0a' },
  { label:'04 Implementation', bg:'#1a0a1f', color:C.p4, border:'#3a1a3a' },
  { label:'05 Testing',        bg:'#1f0a0a', color:C.p5, border:'#3a1a1a' },
  { label:'06 Maintenance',    bg:'#0a1a1f', color:C.p6, border:'#1a3a3a' },
];

const CONNECTORS = [
  'Planning дуусч Analysis эхэлнэ',
  'Analysis дуусч Design эхэлнэ',
  '▼ Design дуусч Implementation эхэлнэ',
  '▼ Implementation дуусч Testing эхэлнэ',
  '▼ Testing дуусч Maintenance эхэлнэ',
];

function EZaalDiagram() {
  const [open, setOpen] = useState<Record<number,boolean>>(
    Object.fromEntries(PHASES.map((_,i)=>[i,false]))
  );
  const toggle = (i:number) => setOpen(p=>({...p,[i]:!p[i]}));

  return (
    <div style={{ background:C.bg, color:C.text, fontFamily:"'IBM Plex Sans',sans-serif",
      minHeight:'100%', padding:'32px 24px 48px', overflowY:'auto' }}>

      {/* Header */}
      <div style={{ textAlign:'center', marginBottom:40 }}>
        <h1 style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'1.6rem', letterSpacing:'0.25em',
          color:C.p1, textTransform:'uppercase', margin:0 }}>E-Zaal</h1>
        <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'0.7rem', color:C.muted,
          marginTop:6, letterSpacing:'0.14em' }}>
          // Software Development Life Cycle — Дэлгэрэнгүй үе шатууд
        </div>
        <div style={{ width:80, height:2,
          background:`linear-gradient(90deg,transparent,${C.p1},transparent)`,
          margin:'12px auto 0' }} />
      </div>

      {/* Flow Bar */}
      <div style={{ maxWidth:1060, margin:'0 auto 28px', display:'flex', alignItems:'center',
        overflowX:'auto', paddingBottom:4, gap:0 }}>
        {FLOW_STEPS.map((s,i)=>(
          <div key={i} style={{ display:'flex', alignItems:'center', flex:1, minWidth:0 }}>
            <div style={{ flex:1, minWidth:90, textAlign:'center', padding:'7px 4px',
              fontFamily:"'IBM Plex Mono',monospace", fontSize:'0.55rem', letterSpacing:'0.07em',
              textTransform:'uppercase', borderRadius:4,
              background:s.bg, color:s.color, border:`1px solid ${s.border}` }}>
              {s.label}
            </div>
            {i<FLOW_STEPS.length-1 && (
              <div style={{ color:C.dim, fontSize:'0.9rem', flexShrink:0, padding:'0 2px' }}>▸</div>
            )}
          </div>
        ))}
      </div>

      {/* Phases */}
      <div style={{ maxWidth:1060, margin:'0 auto', display:'flex', flexDirection:'column', gap:2 }}>
        {PHASES.map((ph,i)=>(
          <div key={i}>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`,
              borderLeft:`3px solid ${ph.color}`, borderRadius:10, overflow:'hidden' }}>

              {/* Phase Header — clickable */}
              <div onClick={()=>toggle(i)} style={{ display:'grid',
                gridTemplateColumns:'52px 1fr auto', alignItems:'center', cursor:'pointer' }}>
                <div style={{ background:ph.numBg, color:ph.color, minHeight:56,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:"'IBM Plex Mono',monospace", fontSize:'0.95rem', fontWeight:600 }}>
                  {ph.num}
                </div>
                <div style={{ padding:'14px 16px', display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:'1.3rem', flexShrink:0 }}>{ph.icon}</span>
                  <div>
                    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'0.75rem',
                      fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:ph.color }}>
                      {ph.name}
                    </div>
                    <div style={{ fontSize:'0.62rem', color:C.muted, marginTop:2 }}>{ph.tagline}</div>
                  </div>
                </div>
                <div style={{ padding:'0 16px', flexShrink:0, display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'0.52rem',
                    padding:'3px 10px', borderRadius:20, letterSpacing:'0.08em', whiteSpace:'nowrap',
                    background:ph.numBg, color:ph.color, border:`1px solid ${ph.tagBorder}` }}>
                    {ph.tag}
                  </span>
                  <span style={{ color:C.muted, fontSize:'0.65rem' }}>{open[i]?'▲':'▼'}</span>
                </div>
              </div>

              {/* Phase Body */}
              {open[i] && (
                <div style={{ padding:'0 16px 16px 68px' }}>
                  {ph.body}
                </div>
              )}
            </div>

            {/* Connector */}
            {i<PHASES.length-1 && (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
                height:26, color:C.dim }}>
                <div style={{ flex:1, height:1, background:C.border, maxWidth:'40%' }} />
                <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'0.52rem',
                  color:C.dim, padding:'0 10px', letterSpacing:'0.07em' }}>
                  {CONNECTORS[i]}
                </span>
                <div style={{ flex:1, height:1, background:C.border, maxWidth:'40%' }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ maxWidth:1060, margin:'36px auto 0', textAlign:'center',
        fontFamily:"'IBM Plex Mono',monospace", fontSize:'0.55rem', color:C.dim, letterSpacing:'0.08em' }}>
        E-Zaal System · SDLC Detailed Document · 2025
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main App
// ─────────────────────────────────────────────

export default function App() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerPage, setAnswerPage] = useState(0);
  const [foundCount, setFoundCount] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [isBoardFocused, setIsBoardFocused] = useState(false);
  const [showMasterImage, setShowMasterImage] = useState(false);
  const [masterTab, setMasterTab] = useState<'diagram-a'|'diagram-b'|'sdlc'>('sdlc');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setAnswerPage(0); }, [selectedQuestion]);

  useEffect(() => {
    async function init() {
      try {
        const [img, qs] = await Promise.all([generateOfficeImage(), generateQuestions()]);
        if (img) setImageUrl(img);
        const enrichedQuestions = qs.map((q: any, index: number) => {
          const zone = ZONES[index % ZONES.length];
          return { ...q, id: index,
            x: zone.x[0] + Math.random() * (zone.x[1] - zone.x[0]),
            y: zone.y[0] + Math.random() * (zone.y[1] - zone.y[0]),
            found: false, zone: zone.name };
        });
        setQuestions(enrichedQuestions);
      } catch (error) {
        console.error("Failed to initialize:", error);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleHotspotClick = (q: Question) => {
    setSelectedQuestion(q);
    setFocusedIndex(q.id);
    setIsBoardFocused(false);
    setShowAnswer(false);
    if (!q.found) {
      setQuestions(questions.map(item => item.id === q.id ? { ...item, found: true } : item));
      setFoundCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    const nextIndex = focusedIndex === null ? 0 : (focusedIndex + 1) % questions.length;
    handleHotspotClick(questions[nextIndex]);
  };

  const handlePrev = () => {
    const prevIndex = focusedIndex === null ? questions.length - 1 : (focusedIndex - 1 + questions.length) % questions.length;
    handleHotspotClick(questions[prevIndex]);
  };

  const resetView = () => { setFocusedIndex(null); setIsBoardFocused(false); setSelectedQuestion(null); };

  const focusMainBoard = () => {
    setFocusedIndex(null); setIsBoardFocused(true);
    setSelectedQuestion(null); setShowMasterImage(true);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-neutral-950 flex flex-col items-center justify-center text-white font-sans">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mb-4" />
        <p className="text-emerald-500 font-mono tracking-widest animate-pulse">BOOTING ENVIRONMENT...</p>
      </div>
    );
  }

  const zoomScale = isBoardFocused ? 2.5 : (focusedIndex !== null ? 3.5 : 1);
  const targetX = isBoardFocused ? 15 : (focusedIndex !== null ? questions[focusedIndex].x : 50);
  const targetY = isBoardFocused ? 30 : (focusedIndex !== null ? questions[focusedIndex].y : 50);
  const zoomX = (50 - targetX) * zoomScale;
  const zoomY = (50 - targetY) * zoomScale;

  const TABS: { key: typeof masterTab; label: string }[] = [
    { key: 'sdlc',      label: '📋 E-Zaal SDLC' },
    { key: 'diagram-a', label: '⬡ Logic Flow A' },
    { key: 'diagram-b', label: '⬡ Architecture B' },
  ];

  return (
    <div className="fixed inset-0 bg-neutral-950 overflow-hidden font-sans text-white">
      {/* Background Image Container */}
      <div ref={containerRef} className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
        <motion.div 
          animate={{ scale: zoomScale, x: `${zoomX}%`, y: `${zoomY}%` }}
          transition={{ duration: 1, ease: [0.175, 0.885, 0.32, 1.275] }}
          className="relative aspect-video w-full max-w-7xl shadow-2xl shadow-emerald-500/10 rounded-2xl overflow-hidden border border-white/10"
        >
          {imageUrl ? (
            <img src={imageUrl} alt="Office Environment" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
              <p className="text-neutral-500">Failed to load environment</p>
            </div>
          )}

          {/* Hotspots */}
          <div className="absolute inset-0 pointer-events-none">
            {questions.map((q) => (
              <motion.button key={q.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: focusedIndex === q.id ? 1.5 : 1, opacity: q.found ? 0.8 : 0.4 }}
                whileHover={{ scale: 1.2, opacity: 1 }}
                onClick={() => handleHotspotClick(q)}
                className={cn(
                  "absolute w-6 h-6 -ml-3 -mt-3 rounded-full pointer-events-auto transition-colors z-10",
                  q.found ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "bg-blue-500/50 hover:bg-blue-400",
                  focusedIndex === q.id && "ring-4 ring-white ring-offset-2 ring-offset-neutral-900"
                )}
                style={{ left: `${q.x}%`, top: `${q.y}%` }}
              >
                <div className="absolute inset-0 animate-ping rounded-full bg-inherit opacity-20" />
                {q.found && <CheckCircle2 className="w-full h-full p-1 text-white" />}
              </motion.button>
            ))}
          </div>

          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-neutral-950/40 via-transparent to-neutral-950/20" />
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 right-8 flex gap-4">
        <button onClick={focusMainBoard}
          className={cn(
            "flex items-center gap-2 px-6 py-4 bg-neutral-900/80 backdrop-blur-md border rounded-2xl transition-all group",
            isBoardFocused ? "border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "border-white/10 text-white hover:bg-neutral-800"
          )}>
          <Workflow className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="font-mono text-sm uppercase tracking-widest font-bold">Диаграм үзэх</span>
        </button>
        
        <div className="h-14 w-px bg-white/10 self-center mx-2" />

        <button onClick={handlePrev}
          className="p-4 bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-neutral-800 transition-colors group">
          <ChevronRight className="w-6 h-6 rotate-180 group-hover:-translate-x-1 transition-transform" />
        </button>
        <button onClick={resetView}
          className={cn(
            "px-6 py-4 bg-neutral-900/80 backdrop-blur-md border rounded-2xl transition-all font-mono text-sm uppercase tracking-widest",
            focusedIndex === null && !isBoardFocused ? "border-blue-500 text-blue-500" : "border-white/10 text-white hover:bg-neutral-800"
          )}>
          Өрөөг харах
        </button>
        <button onClick={handleNext}
          className="p-4 bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-neutral-800 transition-colors group">
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Header */}
      <div className="absolute top-8 left-8 pointer-events-none">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          className="bg-neutral-900/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl pointer-events-auto">
          <h1 className="text-2xl font-bold tracking-tight mb-1 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Систем интегрейшн ба архитектур
          </h1>
          <p className="text-neutral-400 text-sm font-mono uppercase tracking-widest">Семинарын ажил 2</p>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }}
                animate={{ width: `${(foundCount / Math.max(questions.length, 1)) * 100}%` }}
                className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>
            <span className="text-xs font-mono text-emerald-500">{foundCount}/{questions.length} ОЛДСОН</span>
          </div>
        </motion.div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-8 left-8 pointer-events-none hidden lg:block">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex gap-3 pointer-events-auto">
          {ZONES.map((zone) => (
            <div key={zone.name} className="px-4 py-2 bg-neutral-900/60 backdrop-blur-sm border border-white/5 rounded-full text-xs font-medium text-neutral-300 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />{zone.name}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Question Modal */}
      <AnimatePresence>
        {selectedQuestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-neutral-900 border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <span className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-2 block">СЕМИНАР 2 АСУУЛТУУД</span>
                    <h2 className="text-2xl font-bold text-white">{selectedQuestion.title}</h2>
                  </div>
                  <button onClick={() => setSelectedQuestion(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <X className="w-6 h-6 text-neutral-500" />
                  </button>
                </div>
                <div className="space-y-6">
                  <div className="bg-neutral-800/50 p-8 rounded-2xl border border-white/5">
                    <p className="text-xl text-neutral-200 leading-relaxed">{selectedQuestion.question}</p>
                  </div>
                  <AnimatePresence mode="wait">
                    {!showAnswer ? (
                      <motion.button key="reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setShowAnswer(true)}
                        className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 group">
                        ХАРИУЛТ <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    ) : (
                      <motion.div key="answer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-2xl">
                        <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest mb-3 block">Хариулт</span>
                        {(() => {
                          const parts = selectedQuestion.answer;
                          const current = parts[answerPage];
                          return (
                            <div className="space-y-6">
                              <p className="text-xl font-bold text-emerald-400 leading-relaxed whitespace-pre-wrap">{current}</p>
                              {parts.length > 1 && (
                                <div className="flex items-center justify-between pt-4">
                                  <button onClick={() => setAnswerPage(p => Math.max(0, p-1))} disabled={answerPage===0}
                                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30">Өмнөх</button>
                                  <span className="text-xs font-mono text-emerald-500">{answerPage+1} / {parts.length}</span>
                                  <button onClick={() => setAnswerPage(p => Math.min(parts.length-1, p+1))} disabled={answerPage===parts.length-1}
                                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30">Дараах</button>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="bg-neutral-950/50 px-8 py-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-xs text-neutral-500 font-mono">ID: {selectedQuestion.id.toString().padStart(2,'0')}</span>
                <button onClick={() => setSelectedQuestion(null)} className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Терминал хаах</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Master / Diagram Modal (3-tab) ── */}
      <AnimatePresence>
        {showMasterImage && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full bg-neutral-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
              style={{ maxWidth: masterTab === 'sdlc' ? 1100 : 960, maxHeight: '90vh' }}>

              {/* Tab Bar */}
              <div className="flex items-center gap-1 px-6 pt-5 pb-0 border-b border-white/5">
                {TABS.map(t => (
                  <button key={t.key} onClick={() => setMasterTab(t.key)}
                    className={cn(
                      "px-5 py-2.5 rounded-t-xl text-xs font-mono uppercase tracking-widest transition-all border-b-2",
                      masterTab === t.key
                        ? "bg-white/5 text-emerald-400 border-emerald-500"
                        : "text-neutral-500 border-transparent hover:text-neutral-300 hover:bg-white/5"
                    )}>
                    {t.label}
                  </button>
                ))}
                {/* Close */}
                <button onClick={() => setShowMasterImage(false)}
                  className="ml-auto p-2 bg-neutral-950/50 hover:bg-neutral-800 rounded-full text-white transition-all border border-white/10 group">
                  <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div key={masterTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }} className="flex-1 overflow-y-auto">

                  {masterTab === 'sdlc' && <EZaalDiagram />}

                  {(masterTab === 'diagram-a' || masterTab === 'diagram-b') && (
                    <div className="p-8 h-full">
                      <div className="relative w-full rounded-2xl overflow-hidden border border-white/5 bg-neutral-950/50"
                        style={{ height: '60vh' }}>
                        <img
                          src={masterTab === 'diagram-a'
                            ? "https://picsum.photos/seed/diagram-1/1280/720"
                            : "https://picsum.photos/seed/diagram-2/1280/720"}
                          alt={`System Diagram ${masterTab}`}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-6 left-6 px-4 py-2 bg-neutral-950/50 backdrop-blur-md rounded-lg border border-white/10">
                          <p className={cn("text-xs font-mono uppercase tracking-widest font-bold",
                            masterTab === 'diagram-a' ? "text-emerald-400" : "text-blue-400")}>
                            {masterTab === 'diagram-a' ? "Logic Flow A" : "Architecture B"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Footer */}
              <div className="px-8 py-3 bg-neutral-950/50 border-t border-white/5 flex items-center justify-between shrink-0">
                <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Диаграм зураглал, ICSI314</p>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-75" />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Intro Overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-neutral-950 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
                className="mb-8 inline-flex p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20">
                <Monitor className="w-12 h-12 text-emerald-500" />
              </motion.div>
              <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold mb-4">
                Систем интегрейшн ба архитектур
              </motion.h2>
              <motion.h3>Лаб №2: Системийн шаардлага болон Use-Case тодорхойлох</motion.h3>
              <br />
              <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                className="text-neutral-500 mb-10 leading-relaxed">
                Дашренчин.Эрд (23B1NUM1789)<br />
                Хүслэн.Ган (24B1NUM3032)<br />
                Эгшиглэн.Нар (23B1NUM1728)<br />
                Нямжаргал.Тэг (20B1NUM2614)
              </motion.p>
              <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setShowIntro(false)}
                className="px-12 py-4 bg-white text-neutral-950 font-bold rounded-full hover:bg-emerald-400 transition-colors">
                ЭХЛЭХ
              </motion.button>
            </div>
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Celebration */}
      <AnimatePresence>
        {foundCount === questions.length && foundCount > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 z-[110] bg-emerald-500 flex items-center justify-center p-4">
            <div className="text-center text-neutral-950">
              <Trophy className="w-24 h-24 mx-auto mb-8" />
              <h2 className="text-6xl font-black mb-4 uppercase italic">Семинарын ажил дууслаа.</h2>
              <p className="text-xl font-medium mb-12 opacity-80">Бататгах 29 асуултад амжилттай хариуллаа.</p>
              <button onClick={() => window.location.reload()}
                className="px-12 py-4 bg-neutral-950 text-white font-bold rounded-full hover:bg-neutral-800 transition-colors">
                Системийг дахин эхлүүлэх
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
