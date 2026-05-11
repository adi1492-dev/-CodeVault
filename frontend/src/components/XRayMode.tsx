'use client';

import React from 'react';
import { X, Cpu, Zap, Box } from 'lucide-react';

interface XRayModeProps {
  tokens: any[];
  ast: string;
  onClose: () => void;
}

const XRayMode: React.FC<XRayModeProps> = ({ tokens, ast, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="flex flex-col h-full p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
              <Cpu size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">🔬 X-Ray Mode Active</h2>
              <p className="text-white/50">Inspecting Custom Compiler Internal State</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 overflow-hidden">
          {/* Token Stream */}
          <div className="flex flex-col glass rounded-2xl overflow-hidden border border-blue-500/20">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-blue-500/5">
              <div className="flex items-center gap-2 text-blue-400 font-semibold">
                <Zap size={18} />
                <span>Lexer Token Stream</span>
              </div>
              <span className="text-xs text-white/40">{tokens?.length || 0} tokens generated</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-2">
              {tokens?.map((t, i) => (
                <div key={i} className="flex gap-4 p-2 rounded hover:bg-white/5 transition-colors">
                  <span className="text-white/20">[{String(i).padStart(3, '0')}]</span>
                  <span className="text-blue-400 w-24">{t.Type}</span>
                  <span className="text-white/80">{t.Literal}</span>
                  <span className="ml-auto text-white/20">L{t.Line}:C{t.Column}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AST Visualization */}
          <div className="flex flex-col glass rounded-2xl overflow-hidden border border-purple-500/20">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-purple-500/5">
              <div className="flex items-center gap-2 text-purple-400 font-semibold">
                <Box size={18} />
                <span>Abstract Syntax Tree (AST)</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <pre className="text-xs text-purple-300 font-mono">
                {ast ? ast : "// No AST data available"}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XRayMode;
