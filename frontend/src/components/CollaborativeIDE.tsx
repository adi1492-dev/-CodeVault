'use client';

import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  FileCode, 
  Users, 
  Settings, 
  Share2, 
  MessageSquare, 
  Terminal as TerminalIcon, 
  Play, 
  Save, 
  File, 
  ChevronRight, 
  ChevronDown,
  Globe,
  Code,
  Layout,
  Cpu,
  Monitor,
  MoreVertical,
  X,
  Send,
  Plus,
  Trash2,
  FolderOpen,
  Activity,
  Wand2,
  AlertCircle,
  Info,
  CheckCircle2
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  color: string;
}

interface Message {
  user: string;
  text: string;
  time: string;
}

interface FileData {
  id: string;
  name: string;
  language: string;
}

interface CollaborativeIDEProps {
  roomId: string;
  userName: string;
  onExit: () => void;
}

const DEFAULT_FILES: FileData[] = [
  { id: '1', name: 'main.c', language: 'c' },
  { id: '2', name: 'App.java', language: 'java' },
  { id: '3', name: 'script.py', language: 'python' },
  { id: '4', name: 'index.html', language: 'html' },
  { id: '5', name: 'styles.css', language: 'css' },
];

const INITIAL_CODE: Record<string, string> = {
  'main.c': '#include <stdio.h>\n\nint main() {\n    printf("Hello from Collaborative C!\\n");\n    return 0;\n}',
  'App.java': 'public class App {\n    public static void main(String[] args) {\n        System.out.println("Java Collaboration Active");\n    }\n}',
  'script.py': 'import sys\n# Try numpy if available\ntry:\n    import numpy as np\n    print(f"NumPy version: {np.__version__}")\nexcept:\n    print("NumPy not found, but Python is running!")\n\nprint("Hello from Collaborative Python!")',
  'index.html': '<!DOCTYPE html>\n<html>\n<body>\n  <h1>Live Web Collab</h1>\n</body>\n</html>',
  'styles.css': 'body {\n  background: #0d0d0d;\n  color: white;\n}',
};

export default function CollaborativeIDE({ roomId, userName, onExit }: CollaborativeIDEProps) {
  const [files, setFiles] = useState<Record<string, string>>(INITIAL_CODE);
  const [fileList, setFileList] = useState<FileData[]>(DEFAULT_FILES);
  const [activeFile, setActiveFile] = useState<FileData>(DEFAULT_FILES[0]);
  
  const [terminalOutput, setTerminalOutput] = useState<string[]>(["Welcome to CampusCore Terminal v2.0", "System ready. Click 'RUN' to execute code."]);
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 'me', name: userName, color: '#4F46E5' },
    { id: 'p1', name: 'Ananya S.', color: '#10B981' },
    { id: 'p2', name: 'Ramesh K.', color: '#F59E0B' },
  ]);
  const [messages, setMessages] = useState<Message[]>([
    { user: 'System', text: `You joined room ${roomId}`, time: 'now' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [socketStatus, setSocketStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  // Analysis State
  const [analysisResults, setAnalysisResults] = useState<{level: string, line: number, message: string, code: string}[]>([]);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll terminal
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname;
    const ws = new WebSocket(`${protocol}//${host}:8080/ws/collaborative/${roomId}`);
    socketRef.current = ws;

    ws.onopen = () => {
      setSocketStatus('connected');
      ws.send(JSON.stringify({
        type: 'CHAT',
        user: 'System',
        text: `${userName} joined the session.`
      }));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'CODE_SYNC') {
        if (msg.fileName && msg.code !== undefined) {
          setFiles(prev => ({ ...prev, [msg.fileName]: msg.code }));
        }
      } else if (msg.type === 'INIT_DATA') {
        if (msg.data && msg.data.files) {
          setFiles(prev => ({ ...prev, ...msg.data.files }));
        }
      } else if (msg.type === 'CHAT') {
        setMessages(prev => [...prev, { user: msg.user, text: msg.text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      } else if (msg.type === 'TERMINAL_DATA') {
        setTerminalOutput(prev => [...prev, msg.text]);
      } else if (msg.type === 'ANALYSIS_RESULTS') {
        setAnalysisResults(msg.results || []);
        setIsAnalyzing(false);
        setIsAnalysisOpen(true);
        setTerminalOutput(prev => [...prev, `\n[Analyzer] Analysis complete. Found ${msg.results?.length || 0} issues.`]);
      } else if (msg.type === 'CODE_FIXED') {
        if (msg.code) {
          setFiles(prev => ({ ...prev, [activeFile.name]: msg.code }));
          setTerminalOutput(prev => [...prev, `\n[System] Code auto-fixed successfully.`]);
        }
      }
    };

    ws.onclose = () => setSocketStatus('disconnected');
    return () => ws.close();
  }, [roomId, userName]);

  const handleCodeChange = (newCode: string | undefined) => {
    const val = newCode || '';
    setFiles(prev => ({ ...prev, [activeFile.name]: val }));
    
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'CODE_SYNC',
        fileName: activeFile.name,
        code: val,
        language: activeFile.language
      }));
    }
  };

  const handleRunCode = () => {
    if (activeFile.language === 'html') {
      const blob = new Blob([files[activeFile.name]], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTerminalOutput(prev => [...prev, `\n[System] Opened HTML live preview in a new tab.`]);
      setIsTerminalOpen(true);
      return;
    }

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      setTerminalOutput(prev => [...prev, `\n[Executing ${activeFile.name}...]`]);
      setIsTerminalOpen(true);
      socketRef.current.send(JSON.stringify({
        type: 'RUN_CODE',
        fileName: activeFile.name,
        code: files[activeFile.name],
        language: activeFile.language
      }));
    }
  };

  const handleAnalyzeCode = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      setIsAnalyzing(true);
      setIsAnalysisOpen(true);
      setIsChatOpen(false); // Close chat to make room for analysis
      setTerminalOutput(prev => [...prev, `\n[Analyzer] Scanning code for potential issues...`]);
      socketRef.current.send(JSON.stringify({
        type: 'ANALYZE_CODE',
        language: activeFile.language,
        code: files[activeFile.name]
      }));
    }
  };

  const handleFixCode = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      setTerminalOutput(prev => [...prev, `\n[System] Applying automated repairs...`]);
      socketRef.current.send(JSON.stringify({
        type: 'FIX_CODE',
        language: activeFile.language,
        code: files[activeFile.name]
      }));
    }
  };

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = { type: 'CHAT', user: userName, text: chatInput };
    if (socketRef.current?.readyState === WebSocket.OPEN) socketRef.current.send(JSON.stringify(msg));
    setMessages(prev => [...prev, { user: userName, text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setChatInput('');
  };

  const addNewFile = () => {
    const name = prompt("Enter file name (e.g. index.js):");
    if (!name) return;
    const ext = name.split('.').pop();
    let lang = 'javascript';
    if (ext === 'c') lang = 'c';
    if (ext === 'cpp') lang = 'cpp';
    if (ext === 'java') lang = 'java';
    if (ext === 'py') lang = 'python';
    if (ext === 'html') lang = 'html';
    if (ext === 'css') lang = 'css';

    const newFile = { id: Date.now().toString(), name, language: lang };
    setFileList(prev => [...prev, newFile]);
    setFiles(prev => ({ ...prev, [name]: '' }));
    setActiveFile(newFile);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0d0d0d] text-slate-300 flex flex-col font-sans overflow-hidden">
      {/* Top Header Bar */}
      <header className="h-12 border-b border-white/10 bg-[#1a1a1a] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
              <Cpu size={14} className="text-white" />
            </div>
            <span className="text-xs font-bold text-white uppercase tracking-widest">Collaborative Pro IDE</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 font-mono">Room:</span>
            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/10 text-indigo-400 font-bold">{roomId}</span>
          </div>
          <div className={`w-2 h-2 rounded-full ${socketStatus === 'connected' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} title={socketStatus} />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 mr-4">
            {participants.map(p => (
              <div 
                key={p.id} 
                className="w-7 h-7 rounded-full border-2 border-[#1a1a1a] flex items-center justify-center text-[10px] font-bold text-white shadow-lg transition-transform hover:scale-110 cursor-pointer"
                style={{ backgroundColor: p.color }}
                title={p.name}
              >
                {p.name.charAt(0)}
              </div>
            ))}
          </div>

          <button onClick={handleRunCode} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black transition-all shadow-lg shadow-emerald-600/20 active:scale-95">
            <Play size={12} fill="currentColor" />
            <span>RUN</span>
          </button>

          <button 
            onClick={handleAnalyzeCode}
            disabled={isAnalyzing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 text-[10px] font-bold transition-all border border-indigo-500/20 ${isAnalyzing ? 'animate-pulse' : ''}`}
          >
            <Activity size={12} />
            <span>ANALYZE</span>
          </button>

          {activeFile.language === 'c' && (
            <button 
              onClick={handleFixCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[10px] font-bold transition-all border border-amber-500/20"
            >
              <Wand2 size={12} />
              <span>FIX</span>
            </button>
          )}

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-bold transition-all border border-white/10">
            <Save size={12} />
            <span>SAVE</span>
          </button>
          
          <button 
            onClick={onExit}
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all ml-2"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex grow overflow-hidden">
        {/* Left Sidebar (Explorer) */}
        {isSidebarOpen && (
          <aside className="w-60 border-r border-white/10 bg-[#151515] flex flex-col shrink-0 overflow-hidden">
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Explorer</span>
              <button onClick={addNewFile} className="p-1 hover:bg-white/5 rounded text-indigo-400" title="New File">
                <Plus size={14} />
              </button>
            </div>
            <div className="grow overflow-y-auto py-2">
              <div className="px-3 flex items-center gap-1 text-[10px] font-bold text-slate-400 mb-2">
                <ChevronDown size={12} />
                <span>WORKSPACE</span>
              </div>
              <div className="space-y-0.5">
                {fileList.map(file => (
                  <button 
                    key={file.id}
                    onClick={() => setActiveFile(file)}
                    className={`w-full px-6 py-1.5 flex items-center gap-2 text-[11px] transition-colors group ${activeFile.id === file.id ? 'bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-600' : 'text-slate-400 hover:bg-white/5'}`}
                  >
                    <FileCode size={14} className={activeFile.id === file.id ? 'text-indigo-400' : 'text-slate-500'} />
                    <span className="truncate">{file.name}</span>
                    {fileList.length > 1 && (
                      <Trash2 size={10} className="ml-auto opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all" onClick={(e) => {
                        e.stopPropagation();
                        setFileList(prev => prev.filter(f => f.id !== file.id));
                      }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* Editor Wrapper */}
        <div className="grow flex flex-col min-w-0 bg-[#0d0d0d]">
          {/* Tabs Bar */}
          <div className="h-9 bg-[#1a1a1a] flex items-center overflow-x-auto no-scrollbar border-b border-white/5">
            {fileList.map(file => (
              <div 
                key={file.id}
                onClick={() => setActiveFile(file)}
                className={`px-4 h-full flex items-center gap-2 text-[11px] font-medium border-r border-white/5 cursor-pointer transition-all ${activeFile.id === file.id ? 'bg-[#0d0d0d] text-indigo-400 border-t-2 border-t-indigo-600' : 'text-slate-500 hover:bg-white/[0.02]'}`}
              >
                <FileCode size={12} />
                <span>{file.name}</span>
                <button className="ml-2 p-0.5 hover:bg-white/10 rounded opacity-0 group-hover:opacity-100"><X size={10} /></button>
              </div>
            ))}
          </div>

          {/* Editor Container */}
          <div className="grow relative">
            <Editor
              height="100%"
              language={activeFile.language}
              theme="vs-dark"
              value={files[activeFile.name] || ''}
              onChange={handleCodeChange}
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                padding: { top: 20, bottom: 20 },
                roundedSelection: true,
                scrollBeyondLastLine: false,
                cursorSmoothCaretAnimation: "on",
                smoothScrolling: true,
                bracketPairColorization: { enabled: true },
                formatOnPaste: true,
                formatOnType: true,
                lineNumbers: "on",
                glyphMargin: true,
                folding: true,
                selectionHighlight: true,
                overviewRulerBorder: false,
                hideCursorInOverviewRuler: true,
                renderLineHighlight: "all",
                scrollbar: {
                  vertical: 'visible',
                  horizontal: 'visible',
                  useShadows: false,
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10
                }
              }}
            />
          </div>

          {/* Terminal Section */}
          {isTerminalOpen && (
            <div className="h-48 border-t border-white/10 bg-[#0a0a0a] flex flex-col shrink-0">
              <div className="h-8 border-b border-white/5 bg-[#151515] flex items-center justify-between px-3 shrink-0">
                <div className="flex items-center gap-2">
                  <TerminalIcon size={12} className="text-emerald-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Integrated Terminal</span>
                </div>
                <button onClick={() => setIsTerminalOpen(false)} className="p-1 hover:bg-white/5 rounded text-slate-500"><X size={12} /></button>
              </div>
              <div 
                ref={terminalRef}
                className="grow p-3 font-mono text-[11px] overflow-y-auto whitespace-pre-wrap selection:bg-indigo-500/30 custom-scrollbar"
              >
                {terminalOutput.map((line, i) => (
                  <div key={i} className="mb-0.5">{line}</div>
                ))}
                <div className="animate-pulse inline-block w-2 h-4 bg-white/20 ml-1 translate-y-1" />
              </div>
            </div>
          )}

          {/* Footer Status Bar */}
          <footer className="h-6 bg-indigo-600 text-white flex items-center justify-between px-3 text-[10px] font-bold shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 hover:bg-white/10 px-2 h-full cursor-pointer">
                <Globe size={10} />
                <span>Main</span>
              </div>
              <div className="flex items-center gap-1">
                <span>UTF-8</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsTerminalOpen(!isTerminalOpen)}
                className="flex items-center gap-1 hover:bg-white/10 px-2 h-full cursor-pointer transition-colors"
              >
                <TerminalIcon size={10} />
                <span>TERMINAL</span>
              </button>
              <div className="flex items-center gap-1 hover:bg-white/10 px-2 h-full cursor-pointer uppercase">
                <span>{activeFile.language}</span>
              </div>
              <div className="flex items-center gap-1">
                <Monitor size={10} />
                <span>{socketStatus === 'connected' ? 'Connected' : 'Syncing...'}</span>
              </div>
            </div>
          </footer>
        </div>

        {/* Right Sidebar (Chat & Presence) */}
        {isChatOpen && (
          <aside className="w-72 border-l border-white/10 bg-[#151515] flex flex-col shrink-0 overflow-hidden">
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={14} className="text-indigo-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-200">Room Chat</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-1 hover:bg-white/5 rounded text-slate-500"><X size={12} /></button>
            </div>
            
            <div className="grow overflow-y-auto p-4 space-y-4 flex flex-col-reverse">
              <div className="space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex flex-col space-y-1 ${m.user === userName ? 'items-end' : ''}`}>
                    <div className="flex items-center justify-between gap-2 w-full">
                      <span className={`text-[10px] font-bold ${m.user === 'System' ? 'text-indigo-400' : 'text-white'}`}>{m.user}</span>
                      <span className="text-[8px] text-slate-600">{m.time}</span>
                    </div>
                    <div className={`p-2 rounded-xl text-xs leading-relaxed max-w-[95%] ${m.user === userName ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg' : 'bg-white/5 text-slate-300 rounded-tl-none'}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-white/10">
              <form onSubmit={sendChatMessage} className="relative">
                <input 
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 pl-3 pr-10 text-xs focus:outline-none focus:border-indigo-600 transition-all"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-300 p-1">
                  <Send size={14} />
                </button>
              </form>
            </div>
          </aside>
        )}

        {/* Right Sidebar (Analysis) */}
        {isAnalysisOpen && (
          <aside className="w-72 border-l border-white/10 bg-[#151515] flex flex-col shrink-0 overflow-hidden">
            <div className="p-3 border-b border-white/10 flex items-center justify-between bg-indigo-500/5">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-indigo-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-200">Analysis Results</span>
              </div>
              <button onClick={() => setIsAnalysisOpen(false)} className="p-1 hover:bg-white/5 rounded text-slate-500"><X size={12} /></button>
            </div>
            
            <div className="grow overflow-y-auto p-4 space-y-3">
              {analysisResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center space-y-2">
                  <CheckCircle2 size={32} className="text-emerald-500/50" />
                  <p className="text-[10px] text-slate-500 font-bold uppercase">No Issues Found</p>
                  <p className="text-[9px] text-slate-600">Your code follows basic syntactic and structural rules.</p>
                </div>
              ) : (
                analysisResults.map((res, i) => (
                  <div key={i} className={`p-3 rounded-xl border ${
                    res.level === 'error' ? 'bg-red-500/5 border-red-500/20 text-red-300' : 
                    res.level === 'warning' ? 'bg-amber-500/5 border-amber-500/20 text-amber-300' : 
                    'bg-indigo-500/5 border-indigo-500/20 text-indigo-300'
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      {res.level === 'error' ? <AlertCircle size={14} /> : <Info size={14} />}
                      <span className="text-[10px] font-black uppercase tracking-wider">{res.level}</span>
                      {res.line > 0 && <span className="ml-auto text-[9px] font-mono opacity-50">Line {res.line}</span>}
                    </div>
                    <p className="text-[11px] leading-relaxed font-medium mb-2">{res.message}</p>
                    <div className="p-1.5 bg-black/40 rounded-lg font-mono text-[9px] opacity-70 border border-white/5">
                      Issue: {res.code}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-white/10 bg-black/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Diagnostic Coverage</span>
              </div>
              <p className="text-[9px] text-slate-500 leading-relaxed italic">
                Scanning for: Syntax Errors, Memory Leaks, Unsafe Functions, and Header Mappings.
              </p>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
