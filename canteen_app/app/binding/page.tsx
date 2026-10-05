import Link from "next/link";

export default function BindingIndexPage() {
  const variations = [
    {
      step: "Task B1",
      name: "No Binding (Manual Extraction)",
      desc: "Direct inspection of Request.Form collection strings with manual int.TryParse type parsing and validation error handling.",
      href: "/binding/no-binding",
      badge: "Manual Parsing",
    },
    {
      step: "Task B2",
      name: "Simple Binding (Primitive Parameters)",
      desc: "Form input names directly map to discrete primitive parameter signatures (int StudentNo, string StudentName) without collection iteration.",
      href: "/binding/simple-binding",
      badge: "Primitives",
    },
    {
      step: "Task B3",
      name: "Class / Object Binding",
      desc: "Accepts strongly typed StudentModel object, automatically binds properties, and preserves form values across submissions.",
      href: "/binding/class-binding",
      badge: "StudentModel",
    },
    {
      step: "Task B4",
      name: "Complex Binding (Nested Aggregation)",
      desc: "Binds nested dot-notation fields into composite PreOrderModel (aggregating StudentModel & MenuItem) with encapsulated GetTotal() logic.",
      href: "/binding/complex-binding",
      badge: "Nested PreOrder",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 font-sans">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/" className="text-xs uppercase tracking-wider text-orange-400 hover:text-orange-300">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-serif font-bold text-white mt-2">Part B: Model Binding Lab</h1>
          <p className="text-sm text-slate-400 mt-1">
            Comparative architectural platform exploring client-to-server data mapping patterns in web frameworks.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {variations.map((v) => (
          <Link
            key={v.href}
            href={v.href}
            className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-white/[0.08] transition group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  {v.step}
                </span>
                <span className="text-xs text-slate-400 font-mono">{v.badge}</span>
              </div>
              <h2 className="text-lg font-semibold text-white group-hover:text-orange-400 transition mb-2">
                {v.name}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {v.desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center text-xs font-semibold text-orange-400 group-hover:translate-x-1 transition-transform">
              Launch Interactive Demo →
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 p-5 rounded-2xl bg-black/40 border border-white/10 text-xs text-slate-400 leading-relaxed">
        <strong className="text-slate-200">Architectural Note:</strong> In traditional ASP.NET MVC and modern API frameworks, model binders bridge the gap between raw HTTP requests and strongly typed application domain objects. Compare how each technique handles type conversion, validation, null safety, and encapsulation.
      </div>
    </div>
  );
}