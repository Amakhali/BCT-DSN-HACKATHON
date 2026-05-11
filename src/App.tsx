import { useState } from "react";
import { UserProfile, ItemMetadata, SimulationResult, RecommendationResult } from "./types";
import { DEMO_PROFILES, DEMO_ITEMS } from "./constants";
import { simulateUserReview, generatePersona, getRecommendations } from "./services/geminiService";
import { 
  User, 
  Package, 
  Sparkles, 
  History, 
  Plus, 
  Trash2, 
  Play, 
  Loader2, 
  AlertCircle,
  Star,
  ChevronRight,
  Database,
  Cpu,
  RefreshCw,
  LayoutGrid,
  MessagesSquare,
  Search,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";

type TaskType = "A" | "B";

export default function App() {
  const [profiles, setProfiles] = useState<UserProfile[]>(DEMO_PROFILES);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile>(DEMO_PROFILES[0]);
  const [targetItem, setTargetItem] = useState<ItemMetadata>(DEMO_ITEMS[0]);
  const [currentTask, setCurrentTask] = useState<TaskType>("A");
  const [isSimulating, setIsSimulating] = useState(false);
  const [isGeneratingPersona, setIsGeneratingPersona] = useState(false);
  const [personaTheme, setPersonaTheme] = useState("");
  const [resultA, setResultA] = useState<SimulationResult | null>(null);
  const [resultB, setResultB] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [context, setContext] = useState("");

  const handleSimulateTaskA = async () => {
    setIsSimulating(true);
    setResultA(null);
    setError(null);
    try {
      const data = await simulateUserReview(selectedProfile, targetItem, context);
      setResultA(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSimulateTaskB = async () => {
    setIsSimulating(true);
    setResultB(null);
    setError(null);
    try {
      const data = await getRecommendations(selectedProfile, DEMO_ITEMS, context);
      setResultB(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsSimulating(false);
    }
  };

  const handleGeneratePersona = async () => {
    if (!personaTheme) return;
    setIsGeneratingPersona(true);
    setError(null);
    try {
      const newPersona = await generatePersona(personaTheme);
      setProfiles(prev => [...prev, newPersona]);
      setSelectedProfile(newPersona);
      setPersonaTheme("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate persona");
    } finally {
      setIsGeneratingPersona(false);
    }
  };

  const addReviewToHistory = () => {
    const newProfile = { ...selectedProfile };
    newProfile.history.push({
      id: Date.now().toString(),
      itemName: "New Item",
      rating: 5,
      content: "Sample review content...",
    });
    setSelectedProfile(newProfile);
    // Sync back to profiles list
    setProfiles(profiles.map(p => p.name === newProfile.name ? newProfile : p));
  };

  const removeReview = (id: string) => {
    const newProfile = { ...selectedProfile };
    newProfile.history = newProfile.history.filter(r => r.id !== id);
    setSelectedProfile(newProfile);
    setProfiles(profiles.map(p => p.name === newProfile.name ? newProfile : p));
  };

  const updateReview = (id: string, field: string, value: any) => {
    const newProfile = { ...selectedProfile };
    const review = newProfile.history.find(r => r.id === id);
    if (review) {
      (review as any)[field] = value;
      setSelectedProfile(newProfile);
      setProfiles(profiles.map(p => p.name === newProfile.name ? newProfile : p));
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 p-6 lg:p-8 flex flex-col gap-6 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-sm flex items-center justify-center font-bold text-white uppercase italic tracking-tighter">PM</div>
          <h1 className="text-xl font-bold tracking-tighter uppercase whitespace-nowrap">
            PersonaMind <span className="text-indigo-500 font-mono tracking-normal">2.0</span>
          </h1>
        </div>
        <nav className="flex gap-4">
          <button 
            onClick={() => setCurrentTask("A")}
            className={`label-micro px-4 py-2 rounded transition-all flex items-center gap-2 ${currentTask === "A" ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-500 hover:bg-white/10"}`}
          >
            <MessagesSquare className="w-3 h-3" />
            Task A: Modeling
          </button>
          <button 
            onClick={() => setCurrentTask("B")}
            className={`label-micro px-4 py-2 rounded transition-all flex items-center gap-2 ${currentTask === "B" ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-500 hover:bg-white/10"}`}
          >
            <Search className="w-3 h-3" />
            Task B: Recommendation
          </button>
        </nav>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-grow">
        
        {/* User Hero - 8 Cols */}
        <div className="md:col-span-8 bento-card bento-card-gradient relative overflow-hidden flex flex-col justify-center min-h-[300px]">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <User className="w-48 h-48" />
          </div>
          <div className="relative z-10 w-full max-w-3xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <span className="label-micro text-indigo-400">Current Modeling Persona</span>
              </div>
              <div className="flex items-center gap-2">
                 <input 
                  type="text" 
                  placeholder="Theme (e.g. Anime Fan)" 
                  value={personaTheme}
                  onChange={(e) => setPersonaTheme(e.target.value)}
                  className="bg-black/40 border border-white/5 rounded px-3 py-1 text-[10px] font-mono focus:outline-none focus:border-indigo-500 w-40"
                />
                <button 
                  onClick={handleGeneratePersona}
                  disabled={isGeneratingPersona || !personaTheme}
                  className="label-micro px-3 py-1 bg-white/10 hover:bg-white text-white hover:text-black rounded transition-all disabled:opacity-20 flex items-center gap-1"
                >
                  {isGeneratingPersona ? <RefreshCw className="w-3 h-3 animate-spin"/> : <Cpu className="w-3 h-3"/>}
                  Generate
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end gap-6 mb-4">
              <div className="flex-grow">
                <h2 className="text-2xl font-light text-slate-400 mb-1">Simulating Behavioral Path:</h2>
                <h3 className="text-4xl md:text-5xl font-bold italic text-white uppercase tracking-tighter">
                  {selectedProfile.name}
                </h3>
              </div>
              <select 
                className="bg-black border border-white/10 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-indigo-500 mb-2 min-w-[200px]"
                onChange={(e) => {
                  const p = profiles.find(p => p.name === e.target.value);
                  if (p) setSelectedProfile(p);
                }}
                value={selectedProfile.name}
              >
                {profiles.map(p => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
            
            <textarea 
              className="w-full bg-transparent border-none p-0 text-sm text-slate-400 focus:ring-0 resize-none min-h-[60px]"
              rows={2}
              value={selectedProfile.bio}
              onChange={(e) => {
                const newP = {...selectedProfile, bio: e.target.value};
                setSelectedProfile(newP);
                setProfiles(profiles.map(p => p.name === newP.name ? newP : p));
              }}
            />
          </div>
        </div>

        {/* Target Item Selection - 4 Cols */}
        <div className="md:col-span-4 bento-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2 h-2 rounded-full ${currentTask === "A" ? "bg-emerald-500" : "bg-indigo-500"} animate-pulse`}></div>
              <span className="label-micro text-slate-500">{currentTask === "A" ? "Target Stimulus" : "Recommendation Logic"}</span>
            </div>
            
            {currentTask === "A" && (
              <>
                <label className="label-micro block mb-1">Inference Target</label>
                <select 
                  className="w-full bg-black border border-white/10 p-3 rounded font-mono text-[11px] text-indigo-400 mb-4 focus:outline-none appearance-none"
                  onChange={(e) => setTargetItem(DEMO_ITEMS.find(i => i.name === e.target.value) || DEMO_ITEMS[0])}
                  value={targetItem.name}
                >
                  {DEMO_ITEMS.map(i => (
                    <option key={i.name} value={i.name}>{i.name}</option>
                  ))}
                </select>
                <div className="space-y-1">
                   <p className="text-sm font-bold text-white tracking-tight">{targetItem.name}</p>
                   <p className="text-xs text-slate-500 line-clamp-2 italic mb-4">{targetItem.description}</p>
                </div>
              </>
            )}

            {currentTask === "B" && (
              <div className="mb-4">
                <h4 className="text-sm font-bold text-white mb-2">Candidate Pool</h4>
                <div className="space-y-2 max-h-[120px] overflow-y-auto scrollbar-none">
                  {DEMO_ITEMS.map((item, idx) => (
                    <div key={idx} className="p-2 border border-white/5 rounded bg-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-mono truncate mr-2">{item.name}</span>
                      <span className="text-[9px] text-slate-500">{item.category}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-white/5">
              <label className="label-micro block mb-1 opacity-50">Contextual Nuance</label>
              <input 
                type="text"
                value={context}
                placeholder={currentTask === "A" ? "e.g. Rainy day..." : "e.g. User is looking for a gift..."}
                className="w-full bg-black/30 border border-white/5 rounded px-2 py-1.5 text-[10px] focus:outline-none focus:border-indigo-500 text-slate-300 italic"
                onChange={(e) => setContext(e.target.value)}
              />
            </div>
          </div>
          
          <button 
            onClick={currentTask === "A" ? handleSimulateTaskA : handleSimulateTaskB}
            disabled={isSimulating}
            className="w-full btn-bento mt-6 flex items-center justify-center gap-2"
          >
            {isSimulating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                {currentTask === "A" ? "EXECUTE SIMULATION" : "GENERATE RECOMMENDATIONS"}
              </>
            )}
          </button>
        </div>

        {/* Behavioral History - 4 Cols */}
        <div className="md:col-span-4 bento-card flex flex-col h-full max-h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="label-micro flex items-center gap-2">
              <History className="w-3 h-3" /> Training History
            </h3>
            <button 
              onClick={addReviewToHistory}
              className="p-1 hover:text-indigo-400 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3 overflow-y-auto pr-2 scrollbar-none flex-grow">
            {selectedProfile.history.map((review, idx) => (
              <div key={review.id || idx} className="p-3 bg-white/5 rounded border border-white/5 group relative transition-all hover:bg-white/10">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-indigo-500 font-bold">PT_{idx+1}</span>
                    <input 
                      className="bg-transparent border-none p-0 text-[11px] font-bold focus:ring-0 text-white w-full"
                      value={review.itemName}
                      onChange={(e) => updateReview(review.id, "itemName", e.target.value)}
                    />
                  </div>
                  <button onClick={() => removeReview(review.id)} className="opacity-0 group-hover:opacity-100 text-red-400 transition-opacity">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <textarea 
                  className="w-full bg-transparent border-none p-0 text-[10px] text-slate-400 focus:ring-0 resize-none h-12 italic"
                  value={review.content}
                  onChange={(e) => updateReview(review.id, "content", e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Main Output / Visualization - 8 Cols */}
        <div className="md:col-span-8 flex flex-col gap-4">
          
          {/* Result Card */}
          <div className="flex-grow bento-card border-none bg-gradient-to-br from-slate-900 to-black relative overflow-hidden flex flex-col">
            <AnimatePresence mode="wait">
              {((currentTask === "A" && !resultA) || (currentTask === "B" && !resultB)) && !isSimulating && !error && (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  className="flex-grow flex flex-col items-center justify-center text-center p-8"
                >
                  <Sparkles className="w-12 h-12 mb-4 text-slate-700" />
                  <p className="label-micro mb-2">Neural Link Idle</p>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Awaiting Execution Prompt</p>
                </motion.div>
              )}

              {isSimulating && (
                <motion.div 
                   key="loading"
                   className="flex-grow flex flex-col items-center justify-center p-8"
                >
                  <div className="w-16 h-1 bg-indigo-500/20 rounded-full overflow-hidden mb-4">
                    <motion.div 
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-full h-full bg-indigo-500" 
                    />
                  </div>
                  <p className="label-micro animate-pulse">
                    {currentTask === "A" ? "Inferring Behavioral Nuance..." : "Ranking Candidate Pool..."}
                  </p>
                  <div className="mt-4 flex gap-4">
                    <span className="text-[9px] font-mono opacity-30">ENCODING_TEXT</span>
                    <span className="text-[9px] font-mono opacity-30">MAPPING_SENTIMENT</span>
                    <span className="text-[9px] font-mono opacity-30">WEIGHTING_HISTORY</span>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div 
                 key="error"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="flex-grow flex flex-col items-center justify-center text-center text-red-400 p-8"
                >
                  <AlertCircle className="w-10 h-10 mb-4" />
                   <p className="label-micro mb-2 text-red-500">Processing Interrupted</p>
                  <p className="text-sm font-mono">{error}</p>
                </motion.div>
              )}

              {currentTask === "A" && resultA && (
                <motion.div 
                  key="resultA"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-grow flex flex-col h-full"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < resultA.rating ? "text-indigo-400 fill-indigo-400" : "text-slate-700"}`} 
                        />
                      ))}
                      <span className="ml-2 text-xs font-bold text-indigo-400 font-mono tracking-tighter">{resultA.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 underline decoration-indigo-500 decoration-2 underline-offset-4">Synthetic User Response</span>
                    </div>
                  </div>
                  
                  <div className="flex-grow mb-8">
                    <p className="text-2xl md:text-3xl font-light italic text-white leading-snug">
                      "{resultA.review}"
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/5 h-[160px] overflow-hidden">
                    <h4 className="label-micro text-indigo-400 mb-3 flex items-center gap-2">
                       <ChevronRight className="w-3 h-3" /> Behavioral Invariant Logic
                    </h4>
                    <div className="text-[11px] text-slate-400 leading-relaxed font-mono overflow-y-auto max-h-[120px] scrollbar-none">
                       <ReactMarkdown>{resultA.reasoning}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentTask === "B" && resultB && (
                <motion.div 
                  key="resultB"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-grow flex flex-col h-full"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="label-micro text-indigo-400 flex items-center gap-2">
                       <ChevronRight className="w-3 h-3" /> Recursive Recommendation Logic
                    </h4>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 underline decoration-indigo-500 decoration-2 underline-offset-4">Ranked Retrieval</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 overflow-y-auto max-h-[300px] scrollbar-none pr-2">
                    {resultB.recommendations.map((rec, i) => (
                      <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl block">
                         <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-mono text-indigo-500 font-bold">REC_0{i+1}</span>
                            <span className="text-[10px] font-mono text-emerald-400 font-bold">{rec.matchScore}% MATCH</span>
                         </div>
                         <h5 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                           {rec.item.name}
                           <ArrowRight className="w-3 h-3 text-indigo-400" />
                         </h5>
                         <p className="text-[10px] text-slate-400 italic leading-relaxed">
                           {rec.reasoning}
                         </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <h4 className="label-micro text-emerald-400 mb-3 flex items-center gap-2">
                       <Cpu className="w-3 h-3" /> Multiturn Reasoning Trace
                    </h4>
                    <div className="text-[11px] text-slate-400 leading-relaxed font-mono overflow-y-auto max-h-[80px] scrollbar-none">
                       <ReactMarkdown>{resultB.analysis}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Metrics - 2 Smaller Cards */}
          <div className="grid grid-cols-2 gap-4 h-20">
            <div className="bento-card border-indigo-500/20 flex flex-col justify-center items-center text-center p-2">
                <div className="text-xl font-black text-white">{currentTask === "A" ? "89%" : "91%"}</div>
                <p className="label-micro opacity-60 text-[8px]">{currentTask === "A" ? "Tone Fidelity" : "Retrieval Precision"}</p>
            </div>
            <div className="bento-card border-emerald-500/20 flex flex-col justify-center items-center text-center p-2">
                <div className="text-xl font-black text-emerald-400 uppercase tracking-tighter italic">Valid</div>
                <p className="label-micro opacity-60 text-[8px]">Behavioral Integrity</p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="flex justify-between items-center text-[10px] uppercase tracking-widest text-slate-600 font-bold pt-4 border-t border-white/5">
        <div>SYS_NODE_0x7F2A // USER_MODELING_TASK_{currentTask}</div>
        <div className="flex items-center gap-4">
           <span>Model: gemini-3-flash</span>
           <span className="text-indigo-500 opacity-60">Status: Optimized</span>
        </div>
      </footer>
    </div>
  );
}
