'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Play, Send, ChevronLeft, Shield, Clock, HardDrive, CheckCircle2, XCircle, Zap } from 'lucide-react';
import Link from 'next/link';
import CodeEditor from '@/components/CodeEditor';
import XRayMode from '@/components/XRayMode';
import { getProblem, submitCode } from '@/lib/api';

const ProblemPage = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState<any>(null);
  const [code, setCode] = useState('');
  const [isXRayOpen, setIsXRayOpen] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      getProblem(id as string).then(res => {
        setProblem(res.data);
        setCode(res.data.starter_code);
      });
    }
  }, [id]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await submitCode(Number(id), code);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (!problem) return <div className="p-8">Loading problem...</div>;

  return (
    <main className="min-h-screen bg-black text-white p-6 lg:p-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <Link href="/problems" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6 group">
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Problems</span>
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                problem.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' : 
                problem.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 
                'bg-red-500/20 text-red-400'
              }`}>
                {problem.difficulty}
              </span>
              <h1 className="text-4xl font-black">{problem.title}</h1>
            </div>
            <p className="text-xl text-white/60">{problem.description}</p>
          </div>

          <div className="flex items-center gap-6 glass p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-blue-400">
              <Clock size={20} />
              <span className="font-semibold">{problem.time_limit_ms}ms Limit</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex items-center gap-2 text-purple-400">
              <HardDrive size={20} />
              <span className="font-semibold">{problem.memory_limit_kb / 1024}MB Memory</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Editor Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield size={20} className="text-blue-400" />
              <span>Secure C Sandbox</span>
            </h3>
            <button 
              onClick={() => setIsXRayOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all font-bold border border-blue-500/20"
            >
              <Zap size={18} />
              X-RAY MODE
            </button>
          </div>

          <CodeEditor code={code} onChange={(v) => setCode(v || '')} />

          <div className="flex items-center gap-4 pt-4">
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
            >
              <Send size={24} />
              {loading ? 'GRADING...' : 'SUBMIT FOR GRADING'}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-8">
          <h3 className="text-xl font-bold tracking-tight">Grading Results</h3>
          
          {!result ? (
            <div className="glass rounded-3xl p-12 text-center space-y-4">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                <Play className="text-white/20 ml-1" size={32} />
              </div>
              <p className="text-white/40">Run your code to see results</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right duration-500">
              <div className="glass rounded-3xl p-8 border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <CheckCircle2 size={80} />
                </div>
                <p className="text-white/50 font-bold uppercase tracking-widest text-xs mb-1">Final Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-blue-400">{result.score}</span>
                  <span className="text-2xl text-white/30 font-bold">/ {result.score}</span>
                </div>
              </div>

              <div className="space-y-4">
                {result.test_results?.map((tr: any, idx: number) => (
                  <div key={idx} className={`glass rounded-2xl p-6 border ${tr.passed ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {tr.passed ? <CheckCircle2 className="text-green-400" /> : <XCircle className="text-red-400" />}
                        <span className="font-bold">Test Case #{idx + 1}</span>
                      </div>
                      <span className={`font-black ${tr.passed ? 'text-green-400' : 'text-red-400'}`}>
                        +{tr.weight} pts
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                      <div className="space-y-2">
                        <p className="text-white/30 uppercase">Input</p>
                        <div className="bg-black/40 p-2 rounded">{tr.input || '(none)'}</div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-white/30 uppercase">Expected</p>
                        <div className="bg-black/40 p-2 rounded">{tr.expected}</div>
                      </div>
                      <div className="col-span-2 space-y-2 pt-2">
                        <p className="text-white/30 uppercase">Actual Output</p>
                        <div className={`p-2 rounded ${tr.passed ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                          {tr.actual || '(no output)'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {isXRayOpen && result && (
        <XRayMode 
          tokens={result.tokens || []} 
          ast={result.ast || ''} 
          onClose={() => setIsXRayOpen(false)} 
        />
      )}
    </main>
  );
};

export default ProblemPage;
