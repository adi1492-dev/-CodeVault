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
  Send
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

interface CollaborativeIDEProps {
  roomId: string;
  userName: string;
  onExit: () => void;
}

const LANGUAGES = [
  { id: 'c', name: 'C', icon: 'C' },
  { id: 'cpp', name: 'C++', icon: 'C++' },
  { id: 'java', name: 'Java', icon: 'Java' },
  { id: 'html', name: 'HTML', icon: 'HTML' },
  { id: 'css', name: 'CSS', icon: 'CSS' },
  { id: 'javascript', name: 'JavaScript', icon: 'JS' },
];

const MOCK_FILES = [
  { id: '1', name: 'main.c', language: 'c' },
  { id: '2', name: 'utils.cpp', language: 'cpp' },
  { id: '3', name: 'App.java', language: 'java' },
  { id: '4', name: 'index.html', language: 'html' },
  { id: '5', name: 'styles.css', language: 'css' },
  { id: '6', name: 'script.js', language: 'javascript' },
];

export default function CollaborativeIDE({ roomId, userName, onExit }: CollaborativeIDEProps) {
  const [code, setCode] = useState('// Welcome to CampusCore Collaborative Lab\n// Join your peers and start coding together!');
  const [language, setLanguage] = useState('c');
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
  const [activeFile, setActiveFile] = useState(MOCK_FILES[0]);
  const [socketStatus, setSocketStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to Room WebSocket
    const ws = new WebSocket(`ws://localhost:8080/ws/collaborative/${roomId}`);
    socketRef.current = ws;

    ws.onopen = () => {
      setSocketStatus('connected');
      // Announce arrival
      ws.send(JSON.stringify({
        type: 'CHAT',
        user: 'System',
        text: `${userName} joined the session.`
      }));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'CODE_SYNC') {
        if (msg.code !== undefined) setCode(msg.code);
        if (msg.language) setLanguage(msg.language);
      } else if (msg.type === 'INIT_DATA') {
        if (msg.data && msg.data.code) setCode(msg.data.code);
        if (msg.data && msg.data.language) setLanguage(msg.data.language);
      } else if (msg.type === 'CHAT') {
        setMessages(prev => [...prev, { user: msg.user, text: msg.text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      }
    };

    ws.onclose = () => setSocketStatus('disconnected');

    return () => {
      ws.close();
    };
  }, [roomId, userName]);

  const handleCodeChange = (newCode: string | undefined) => {
    const val = newCode || '';
    setCode(val);
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'CODE_SYNC',
        code: val,
        language: language
      }));
    }
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'CODE_SYNC',
        code: code,
        language: lang
      }));
    }
  };

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const msg = {
      type: 'CHAT',
      user: userName,
      text: chatInput
    };
    
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(msg));
    }
    
    setMessages(prev => [...prev, { 
      user: userName, 
      text: chatInput, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }]);
    setChatInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0d0d] text-slate-300 flex flex-col font-sans overflow-hidden">
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
                className="w-7 h-7 rounded-full border-2 border-[#1a1a1a] flex items-center justify-center text-[10px] font-bold text-white shadow-lg"
                style={{ backgroundColor: p.color }}
                title={p.name}
              >
                {p.name.charAt(0)}
              </div>
            ))}
            <div className="w-7 h-7 rounded-full border-2 border-[#1a1a1a] bg-white/10 flex items-center justify-center text-[10px] font-bold text-slate-400">
              +0
            </div>
          </div>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold transition-all shadow-lg shadow-indigo-600/20">
            <Share2 size={12} />
            <span>COPY LINK</span>
          </button>
          
          <button 
            onClick={onExit}
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex grow overflow-hidden">
        {/* Left Sidebar (Explorer) */}
        {isSidebarOpen && (
          <aside className="w-64 border-right border-white/10 bg-[#151515] flex flex-col shrink-0 overflow-hidden border-r border-white/10">
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Explorer</span>
              <button className="p-1 hover:bg-white/5 rounded text-slate-500"><MoreVertical size={12} /></button>
            </div>
            <div className="grow overflow-y-auto py-2">
              <div className="px-3 flex items-center gap-1 text-[10px] font-bold text-slate-400 mb-2">
                <ChevronDown size={12} />
                <span>WORKSPACE</span>
              </div>
              <div className="space-y-0.5">
                {MOCK_FILES.map(file => (
                  <button 
                    key={file.id}
                    onClick={() => {
                      setActiveFile(file);
                      handleLanguageChange(file.language);
                    }}
                    className={`w-full px-6 py-1.5 flex items-center gap-2 text-[11px] transition-colors ${activeFile.id === file.id ? 'bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-600' : 'text-slate-400 hover:bg-white/5'}`}
                  >
                    <FileCode size={14} className={activeFile.id === file.id ? 'text-indigo-400' : 'text-slate-500'} />
                    <span>{file.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-white/10 space-y-4">
              <div className="space-y-2">
                <span className="text-[9px] font-bold text-slate-600 uppercase block tracking-wider">Language Engine</span>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => handleLanguageChange(lang.id)}
                      className={`px-2 py-1.5 rounded-lg border text-[9px] font-bold transition-all ${language === lang.id ? 'bg-indigo-600/20 border-indigo-600/40 text-indigo-400' : 'bg-black/20 border-white/5 text-slate-500 hover:border-white/10'}`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Editor Wrapper */}
        <div className="grow flex flex-col min-w-0 bg-[#0d0d0d]">
          {/* Tabs Bar */}
          <div className="h-9 bg-[#1a1a1a] flex items-center overflow-x-auto no-scrollbar border-b border-white/5">
            <div className={`px-4 h-full flex items-center gap-2 text-[11px] font-medium border-r border-white/5 bg-[#0d0d0d] text-indigo-400 border-t-2 border-t-indigo-600`}>
              <FileCode size={12} />
              <span>{activeFile.name}</span>
              <button className="ml-2 p-0.5 hover:bg-white/10 rounded"><X size={10} /></button>
            </div>
            <div className={`px-4 h-full flex items-center gap-2 text-[11px] font-medium border-r border-white/5 text-slate-500 hover:bg-white/[0.02] cursor-pointer`}>
              <File size={12} />
              <span>Syllabus.md</span>
            </div>
          </div>

          {/* Editor Container */}
          <div className="grow relative">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
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
              <div className="flex items-center gap-1 hover:bg-white/10 px-2 h-full cursor-pointer uppercase">
                <span>Spaces: 4</span>
              </div>
              <div className="flex items-center gap-1 hover:bg-white/10 px-2 h-full cursor-pointer uppercase">
                <span>{language}</span>
              </div>
              <div className="flex items-center gap-1 hover:bg-white/10 px-2 h-full cursor-pointer">
                <Monitor size={10} />
                <span>Connected</span>
              </div>
            </div>
          </footer>
        </div>

        {/* Right Sidebar (Chat & Presence) */}
        {isChatOpen && (
          <aside className="w-80 border-l border-white/10 bg-[#151515] flex flex-col shrink-0 overflow-hidden">
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={14} className="text-indigo-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-200">Room Chat</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-1 hover:bg-white/5 rounded text-slate-500"><X size={12} /></button>
            </div>
            
            <div className="grow overflow-y-auto p-4 space-y-4 flex flex-col-reverse">
              {/* Messages in reverse for automatic bottom alignment */}
              <div className="space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex flex-col space-y-1 ${m.user === userName ? 'items-end' : ''}`}>
                    <div className="flex items-center justify-between gap-2 w-full">
                      <span className={`text-[10px] font-bold ${m.user === 'System' ? 'text-indigo-400' : 'text-white'}`}>{m.user}</span>
                      <span className="text-[8px] text-slate-600">{m.time}</span>
                    </div>
                    <div className={`p-2 rounded-xl text-xs leading-relaxed max-w-[90%] ${m.user === userName ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white/5 text-slate-300 rounded-tl-none'}`}>
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

            <div className="p-4 border-t border-white/10 bg-black/20">
              <span className="text-[9px] font-bold text-slate-600 uppercase block mb-3">Participants in session</span>
              <div className="space-y-2">
                {participants.map(p => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="text-xs text-slate-300">{p.name}</span>
                    </div>
                    <span className="text-[8px] text-emerald-500 font-bold uppercase tracking-tighter">Online</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
