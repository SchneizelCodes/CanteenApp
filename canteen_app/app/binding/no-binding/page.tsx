"use client";

import { useState } from "react";
import Link from "next/link";

export default function NoBindingPage() {
  const [error, setError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{ studentNo: number; studentName: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    // 1. Read strings directly from form data dictionary (Request.Form equivalent)
    const rawStudentNo = formData.get("StudentNo") as string;
    const rawStudentName = formData.get("StudentName") as string;

    // 2. int.TryParse equivalent check
    const parsedStudentNo = parseInt(rawStudentNo, 10);
    if (isNaN(parsedStudentNo) || String(parsedStudentNo) !== rawStudentNo.trim()) {
      setError("Student number must be a whole number.");
      return;
    }

    setSubmittedData({
      studentNo: parsedStudentNo,
      studentName: rawStudentName || "",
    });
  }

  return (
    <div className="max-w-md mx-auto p-6 font-sans">
      <Link href="/binding" className="text-sm text-orange-400 hover:underline mb-4 inline-block">
        ← Back to Binding Hub
      </Link>
      <h2 className="text-2xl font-bold mb-2 text-white">Task B1: No Binding</h2>
      <p className="text-sm text-slate-400 mb-6">
        Manual extraction from raw form collection (<code className="text-orange-300">Request.Form</code>) with explicit string parsing and custom validation.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Student No</label>
          <input
            name="StudentNo"
            placeholder="e.g. 20240012"
            className="w-full border border-white/10 p-2.5 rounded-lg text-sm bg-black/40 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Student Name</label>
          <input
            name="StudentName"
            placeholder="e.g. Juan Dela Cruz"
            className="w-full border border-white/10 p-2.5 rounded-lg text-sm bg-black/40 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#f26522] hover:bg-[#ea580c] text-white py-2.5 rounded-lg font-medium transition shadow-lg shadow-orange-500/20"
        >
          Submit Form
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-950/50 border border-red-500/50 text-red-300 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Styled header displaying manual parsed output */}
      {submittedData && (
        <div className="mt-6 p-4 rounded-xl bg-purple-950/40 border border-purple-500/40">
          <div className="text-xs uppercase font-semibold text-purple-400 mb-1">Manual Extraction Result:</div>
          <h4 className="text-purple-300 font-bold text-lg">
            Submitted: {submittedData.studentNo} - {submittedData.studentName}
          </h4>
        </div>
      )}
    </div>
  );
}