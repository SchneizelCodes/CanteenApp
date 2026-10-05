"use client";

import { useState } from "react";
import Link from "next/link";

export default function SimpleBindingPage() {
  const [result, setResult] = useState<{ studentNo: number; studentName: string } | null>(null);

  // Emulates public ActionResult SimpleBinding(int StudentNo, string StudentName)
  function handleSimpleBinding(StudentNo: number, StudentName: string) {
    setResult({ studentNo: StudentNo, studentName: StudentName });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    // Primitive casting directly from exact matching parameter names
    const studentNo = Number(fd.get("StudentNo"));
    const studentName = String(fd.get("StudentName") ?? "");

    handleSimpleBinding(studentNo, studentName);
  }

  return (
    <div className="max-w-md mx-auto p-6 font-sans">
      <Link href="/binding" className="text-sm text-orange-400 hover:underline mb-4 inline-block">
        ← Back to Binding Hub
      </Link>
      <h2 className="text-2xl font-bold mb-2 text-white">Task B2: Simple Binding</h2>
      <p className="text-sm text-slate-400 mb-6">
        Maps form inputs directly to discrete primitive parameter signatures (<code className="text-orange-300">int StudentNo</code>, <code className="text-orange-300">string StudentName</code>).
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Student No</label>
          <input
            name="StudentNo"
            placeholder="e.g. 20240987"
            className="w-full border border-white/10 p-2.5 rounded-lg text-sm bg-black/40 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Student Name</label>
          <input
            name="StudentName"
            placeholder="e.g. Andrea Cruz"
            className="w-full border border-white/10 p-2.5 rounded-lg text-sm bg-black/40 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#f26522] hover:bg-[#ea580c] text-white py-2.5 rounded-lg font-medium transition shadow-lg shadow-orange-500/20"
        >
          Submit Parameters
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl space-y-1">
          <div className="text-xs uppercase font-semibold text-orange-400 mb-2">Extracted Primitive Parameters:</div>
          <p className="text-sm text-slate-200">
            <strong>StudentNo:</strong>{" "}
            {isNaN(result.studentNo) ? (
              <span className="text-amber-400 font-mono">0 / NaN (Binding Failed to parse int)</span>
            ) : (
              result.studentNo
            )}
          </p>
          <p className="text-sm text-slate-200"><strong>StudentName:</strong> {result.studentName}</p>
        </div>
      )}
    </div>
  );
}