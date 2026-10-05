"use client";

import { useState } from "react";
import Link from "next/link";
import { StudentModel } from "@/models/StudentModel";

export default function ClassBindingPage() {
  // Preserving submitted data across submissions to prevent data loss
  const [formData, setFormData] = useState<StudentModel>(new StudentModel(0, "", ""));
  const [boundStudent, setBoundStudent] = useState<StudentModel | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Emulates ASP.NET MVC Class / Object Binding: public IActionResult ClassBinding(StudentModel student)
  function handleClassBinding(model: StudentModel) {
    if (!model.studentNo || isNaN(model.studentNo) || model.studentNo <= 0) {
      setError("Valid Student Number is required for StudentModel binding.");
      return;
    }
    if (!model.studentName.trim()) {
      setError("Student Name is required for StudentModel binding.");
      return;
    }
    setError(null);
    setBoundStudent(model);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    // Form inputs automatically populate the class properties
    const model = new StudentModel(
      Number(fd.get("studentNo")),
      String(fd.get("studentName") ?? ""),
      String(fd.get("program") ?? "")
    );

    // Keep data in state to preserve within input fields across submissions
    setFormData(model);
    handleClassBinding(model);
  }

  return (
    <div className="max-w-md mx-auto p-6 font-sans">
      <Link href="/binding" className="text-sm text-orange-400 hover:underline mb-4 inline-block">
        ← Back to Binding Hub
      </Link>
      <h2 className="text-2xl font-bold mb-2 text-white">Task B3: Class / Object Binding</h2>
      <p className="text-sm text-slate-400 mb-6">
        Demonstrates strongly typed object binding (<code className="text-orange-300">StudentModel</code>) and preserves field values across submissions.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1">Student No</label>
          <input
            name="studentNo"
            type="number"
            value={formData.studentNo === 0 ? "" : formData.studentNo}
            onChange={(e) => setFormData({ ...formData, studentNo: Number(e.target.value) })}
            placeholder="e.g. 20241001"
            className="w-full border border-white/10 p-2.5 rounded-lg text-sm bg-black/40 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1">Student Name</label>
          <input
            name="studentName"
            type="text"
            value={formData.studentName}
            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
            placeholder="e.g. Maria Santos"
            className="w-full border border-white/10 p-2.5 rounded-lg text-sm bg-black/40 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1">Program</label>
          <input
            name="program"
            type="text"
            value={formData.program}
            onChange={(e) => setFormData({ ...formData, program: e.target.value })}
            placeholder="e.g. BSCS"
            className="w-full border border-white/10 p-2.5 rounded-lg text-sm bg-black/40 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#f26522] hover:bg-[#ea580c] text-white font-semibold py-3 rounded-lg transition shadow-lg shadow-orange-500/20"
        >
          Submit StudentModel
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-950/50 border border-red-500/50 text-red-300 rounded-lg text-sm">
          {error}
        </div>
      )}

      {boundStudent && (
        <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl space-y-1">
          <div className="text-xs uppercase font-semibold text-orange-400 mb-2">Bound StudentModel Instance</div>
          <p className="text-sm text-slate-200"><strong>StudentNo:</strong> {boundStudent.studentNo}</p>
          <p className="text-sm text-slate-200"><strong>StudentName:</strong> {boundStudent.studentName}</p>
          <p className="text-sm text-slate-200"><strong>Program:</strong> {boundStudent.program || "None"}</p>
          <p className="text-xs text-emerald-400 mt-2">✓ Form state retained in inputs to prevent data loss.</p>
        </div>
      )}
    </div>
  );
}