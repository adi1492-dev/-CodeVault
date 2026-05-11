'use client';

import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string | undefined) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange }) => {
  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl">
      <Editor
        height="100%"
        defaultLanguage="c"
        theme="vs-dark"
        value={code}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          padding: { top: 16, bottom: 16 },
          roundedSelection: true,
          scrollBeyondLastLine: false,
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
