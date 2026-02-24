/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Monitor, 
  Coffee, 
  FileText, 
  Server, 
  Book, 
  Search, 
  CheckCircle2, 
  X,
  ChevronRight,
  Trophy,
  Info,
  Workflow
} from 'lucide-react';
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
  { name: 'Desk', x: [20, 50], y: [40, 70] },
  { name: 'Coffee Station', x: [70, 90], y: [60, 85] },
  { name: 'Whiteboard', x: [5, 25], y: [15, 45] },
  { name: 'Server Rack', x: [75, 95], y: [10, 50] },
  { name: 'Bookshelf', x: [40, 70], y: [10, 35] },
];

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
  const [masterImageIndex, setMasterImageIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  function splitAnswer(text: string, maxLength = 350) {
   const chunks: string[] = [];
   for (let i = 0; i < text.length; i += maxLength) {
     chunks.push(text.slice(i, i + maxLength));
   }
  return chunks;
}

  useEffect(() => {
    setAnswerPage(0);
  }, [selectedQuestion]);

  useEffect(() => {
    async function init() {
      try {
        const [img, qs] = await Promise.all([
          generateOfficeImage(),
          generateQuestions()
        ]);
        
        if (img) setImageUrl(img);
        
        // Distribute questions into zones
        const enrichedQuestions = qs.map((q: any, index: number) => {
          const zone = ZONES[index % ZONES.length];
          return {
            ...q,
            id: index,
            x: zone.x[0] + Math.random() * (zone.x[1] - zone.x[0]),
            y: zone.y[0] + Math.random() * (zone.y[1] - zone.y[0]),
            found: false,
            zone: zone.name
          };
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
      const updated = questions.map(item => 
        item.id === q.id ? { ...item, found: true } : item
      );
      setQuestions(updated);
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

  const resetView = () => {
    setFocusedIndex(null);
    setIsBoardFocused(false);
    setSelectedQuestion(null);
  };

  const focusMainBoard = () => {
    setFocusedIndex(null);
    setIsBoardFocused(true);
    setSelectedQuestion(null);
    setShowMasterImage(true);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-neutral-950 flex flex-col items-center justify-center text-white font-sans">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mb-4"
        />
        <p className="text-emerald-500 font-mono tracking-widest animate-pulse">BOOTING ENVIRONMENT...</p>
      </div>
    );
  }

  // Calculate transform for zoom
  const zoomScale = isBoardFocused ? 2.5 : (focusedIndex !== null ? 3.5 : 1);
  
  const targetX = isBoardFocused 
    ? 15 
    : (focusedIndex !== null ? questions[focusedIndex].x : 50);
    
  const targetY = isBoardFocused 
    ? 30 
    : (focusedIndex !== null ? questions[focusedIndex].y : 50);

  const zoomX = (50 - targetX) * zoomScale;
  const zoomY = (50 - targetY) * zoomScale;

  return (
    <div className="fixed inset-0 bg-neutral-950 overflow-hidden font-sans text-white">
      {/* Background Image Container */}
      <div 
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center p-4 md:p-8"
      >
        <motion.div 
          animate={{ 
            scale: zoomScale,
            x: `${zoomX}%`,
            y: `${zoomY}%`
          }}
          transition={{ 
            duration: 1, 
            ease: [0.175, 0.885, 0.32, 1.275] // Bouncy/Gentle easing
          }}
          className="relative aspect-video w-full max-w-7xl shadow-2xl shadow-emerald-500/10 rounded-2xl overflow-hidden border border-white/10"
        >
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="Office Environment" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
              <p className="text-neutral-500">Failed to load environment</p>
            </div>
          )}

          {/* Hotspots Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {questions.map((q) => (
              <motion.button
                key={q.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: focusedIndex === q.id ? 1.5 : 1, 
                  opacity: q.found ? 0.8 : 0.4 
                }}
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

          {/* Vignette & Gradients */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-neutral-950/40 via-transparent to-neutral-950/20" />
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 right-8 flex gap-4">
        <button 
          onClick={focusMainBoard}
          className={cn(
            "flex items-center gap-2 px-6 py-4 bg-neutral-900/80 backdrop-blur-md border rounded-2xl transition-all group",
            isBoardFocused ? "border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "border-white/10 text-white hover:bg-neutral-800"
          )}
          title="Focus Main Board"
        >
          <Workflow className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="font-mono text-sm uppercase tracking-widest font-bold">Master</span>
        </button>
        
        <div className="h-14 w-px bg-white/10 self-center mx-2" />

        <button 
          onClick={handlePrev}
          className="p-4 bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-neutral-800 transition-colors group"
        >
          <ChevronRight className="w-6 h-6 rotate-180 group-hover:-translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={resetView}
          className={cn(
            "px-6 py-4 bg-neutral-900/80 backdrop-blur-md border rounded-2xl transition-all font-mono text-sm uppercase tracking-widest",
            focusedIndex === null && !isBoardFocused ? "border-blue-500 text-blue-500" : "border-white/10 text-white hover:bg-neutral-800"
          )}
        >
          World Map
        </button>
        <button 
          onClick={handleNext}
          className="p-4 bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-neutral-800 transition-colors group"
        >
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* UI Overlays */}
      <div className="absolute top-8 left-8 pointer-events-none">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-neutral-900/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl pointer-events-auto"
        >
          <h1 className="text-2xl font-bold tracking-tight mb-1 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Cyberpunk Dev Sanctuary
          </h1>
          <p className="text-neutral-400 text-sm font-mono uppercase tracking-widest">
            Interactive 3D Environment
          </p>
          
          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(foundCount / questions.length) * 100}%` }}
                className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              />
            </div>
            <span className="text-xs font-mono text-emerald-500">
              {foundCount}/{questions.length} FOUND
            </span>
          </div>
        </motion.div>
      </div>

      {/* Legend / Zones */}
      <div className="absolute bottom-8 left-8 pointer-events-none hidden lg:block">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex gap-3 pointer-events-auto"
        >
          {ZONES.map((zone) => (
            <div 
              key={zone.name}
              className="px-4 py-2 bg-neutral-900/60 backdrop-blur-sm border border-white/5 rounded-full text-xs font-medium text-neutral-300 flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              {zone.name}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Question Modal */}
      <AnimatePresence>
        {selectedQuestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-neutral-900 border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <span className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-2 block">
                      {selectedQuestion.zone} СЕМИНАР 3
                    </span>
                    <h2 className="text-2xl font-bold text-white">{selectedQuestion.title}</h2>
                  </div>
                  <button 
                    onClick={() => setSelectedQuestion(null)}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-neutral-500" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="bg-neutral-800/50 p-8 rounded-2xl border border-white/5">
                    <p className="text-xl text-neutral-200 leading-relaxed">
                      {selectedQuestion.question}
                    </p>
                  </div>

                  <AnimatePresence mode="wait">
                    {!showAnswer ? (
                      <motion.button
                        key="reveal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowAnswer(true)}
                        className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 group"
                      >
                        АСУУЛТЫН ХАРИУЛТ
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    ) : (
                      <motion.div
                        key="answer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-2xl"
                    >
                      <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest mb-3 block">
                        Answer
                      </span>
                   {(() => {
  const parts = selectedQuestion.answer;
  const current = parts[answerPage];

  return (
    <div className="space-y-6">
      <p className="text-xl font-bold text-emerald-400 leading-relaxed whitespace-pre-wrap">
        {current}
      </p>

      {parts.length > 1 && (
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={() => setAnswerPage(p => Math.max(0, p - 1))}
            disabled={answerPage === 0}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30"
          >
            Өмнөх
          </button>

          <span className="text-xs font-mono text-emerald-500">
            {answerPage + 1} / {parts.length}
          </span>

          <button
            onClick={() =>
              setAnswerPage(p => Math.min(parts.length - 1, p + 1))
            }
            disabled={answerPage === parts.length - 1}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30"
          >
            Дараах
          </button>
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
                <span className="text-xs text-neutral-500 font-mono">
                  ID: {selectedQuestion.id.toString().padStart(2, '0')}
                </span>
                <button 
                  onClick={() => setSelectedQuestion(null)}
                  className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                >
                  Close Terminal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Master Image Modal */}
      <AnimatePresence>
        {showMasterImage && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full bg-neutral-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
            >
              <div className="relative h-[70vh] group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={masterImageIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full h-full p-8"
                  >
                    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/5 bg-neutral-950/50">
                      <img 
                        src={masterImageIndex === 0 
                          ? "https://picsum.photos/seed/diagram-1/1280/720" 
                          : "https://picsum.photos/seed/diagram-2/1280/720"
                        } 
                        alt={`System Diagram ${masterImageIndex + 1}`} 
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-6 left-6 px-4 py-2 bg-neutral-950/50 backdrop-blur-md rounded-lg border border-white/10">
                        <p className={cn(
                          "text-xs font-mono uppercase tracking-widest font-bold",
                          masterImageIndex === 0 ? "text-emerald-400" : "text-blue-400"
                        )}>
                          {masterImageIndex === 0 ? "Logic Flow A" : "Architecture B"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Carousel Controls */}
                <div className="absolute inset-y-0 left-4 flex items-center">
                  <button 
                    onClick={() => setMasterImageIndex(prev => (prev === 0 ? 1 : 0))}
                    className="p-3 bg-neutral-950/50 hover:bg-neutral-950/80 backdrop-blur-md rounded-full text-white transition-all border border-white/10 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-6 h-6 rotate-180" />
                  </button>
                </div>
                <div className="absolute inset-y-0 right-4 flex items-center">
                  <button 
                    onClick={() => setMasterImageIndex(prev => (prev === 0 ? 1 : 0))}
                    className="p-3 bg-neutral-950/50 hover:bg-neutral-950/80 backdrop-blur-md rounded-full text-white transition-all border border-white/10 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <button 
                onClick={() => setShowMasterImage(false)}
                className="absolute top-6 right-6 p-3 bg-neutral-950/50 hover:bg-neutral-950/80 backdrop-blur-md rounded-full text-white transition-all border border-white/10 group z-10"
              >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
              </button>
              
              <div className="px-8 py-4 bg-neutral-950/50 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Master System Documentation // V2.4.0</p>
                  <div className="flex gap-1">
                    {[0, 1].map(i => (
                      <div 
                        key={i}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-all",
                          masterImageIndex === i ? "bg-emerald-500 w-4" : "bg-neutral-700"
                        )}
                      />
                    ))}
                  </div>
                </div>
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
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-neutral-950 flex items-center justify-center p-4"
          >
            <div className="max-w-2xl w-full text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8 inline-flex p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20"
              >
                <Monitor className="w-12 h-12 text-emerald-500" />
              </motion.div>
              
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                Welcome to the Sanctuary
              </motion.h2>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-neutral-400 text-lg mb-12 leading-relaxed"
              >
                Explore this high-fidelity isometric environment. Hidden within the artifacts of this modern engineer's office are <span className="text-emerald-400 font-bold">29 technical challenges</span>. Find them all to master the sanctuary.
              </motion.p>
              
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowIntro(false)}
                className="px-12 py-4 bg-white text-neutral-950 font-bold rounded-full hover:bg-emerald-400 transition-colors"
              >
                ENTER ENVIRONMENT
              </motion.button>
            </div>
            
            {/* Background decorative elements */}
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
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[110] bg-emerald-500 flex items-center justify-center p-4"
          >
            <div className="text-center text-neutral-950">
              <Trophy className="w-24 h-24 mx-auto mb-8" />
              <h2 className="text-6xl font-black mb-4 uppercase italic">Sanctuary Mastered</h2>
              <p className="text-xl font-medium mb-12 opacity-80">You have successfully uncovered all 29 hidden secrets.</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-12 py-4 bg-neutral-950 text-white font-bold rounded-full hover:bg-neutral-800 transition-colors"
              >
                REBOOT SYSTEM
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
