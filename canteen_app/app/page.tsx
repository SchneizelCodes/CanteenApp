"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { menuCatalog } from "@/data/menuData";
import { MenuItem } from "@/models/MenuItem";
import { StudentModel } from "@/models/StudentModel";
import { PreOrderModel } from "@/models/PreOrderModel";

function MainContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category")?.trim() || "";

  // Part A state: Category filtering (Simple Binding simulation & local toggle)
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);

  // Synchronize category if url parameter exists
  const activeCategory = (selectedCategory || urlCategory).trim();

  // Part A Filter logic (Case-insensitive matching)
  const filteredMenuItems = useMemo(() => {
    if (!activeCategory || activeCategory.toLowerCase() === "all") {
      return menuCatalog;
    }
    return menuCatalog.filter(
      (item) => item.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [activeCategory]);

  // Part B state: active model binding tab
  const [activeBindingTab, setActiveBindingTab] = useState<
    "no-binding" | "simple-binding" | "class-binding" | "complex-binding"
  >("complex-binding");

  // --- Task B1: No Binding State ---
  const [b1StudentNo, setB1StudentNo] = useState("20241011");
  const [b1StudentName, setB1StudentName] = useState("Maria Clara");
  const [b1Error, setB1Error] = useState<string | null>(null);
  const [b1Result, setB1Result] = useState<{ studentNo: number; studentName: string } | null>(null);

  function handleB1Submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setB1Error(null);
    const fd = new FormData(e.currentTarget);

    // 1. Inspect raw strings directly from request collection (Request.Form equivalent)
    const rawStudentNo = fd.get("StudentNo") as string;
    const rawStudentName = fd.get("StudentName") as string;

    // 2. int.TryParse equivalent validation
    const parsedStudentNo = parseInt(rawStudentNo, 10);
    if (isNaN(parsedStudentNo) || String(parsedStudentNo) !== rawStudentNo?.trim()) {
      setB1Error("Invalid Student Number: Must be a valid whole integer.");
      return;
    }

    setB1Result({
      studentNo: parsedStudentNo,
      studentName: rawStudentName || "",
    });
  }

  // --- Task B2: Simple Binding State ---
  const [b2StudentNo, setB2StudentNo] = useState("20242022");
  const [b2StudentName, setB2StudentName] = useState("Crisostomo Ibarra");
  const [b2Result, setB2Result] = useState<{ studentNo: number; studentName: string } | null>(null);

  function handleSimpleBindingAction(StudentNo: number, StudentName: string) {
    setB2Result({ studentNo: StudentNo, studentName: StudentName });
  }

  function handleB2Submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const studentNo = Number(fd.get("StudentNo"));
    const studentName = String(fd.get("StudentName") ?? "");
    handleSimpleBindingAction(studentNo, studentName);
  }

  // --- Task B3: Class / Object Binding State (Preserving submitted data in inputs) ---
  const [b3FormData, setB3FormData] = useState<StudentModel>(
    new StudentModel(20243033, "Elias Salcedo", "BSIT")
  );
  const [b3BoundModel, setB3BoundModel] = useState<StudentModel | null>(null);
  const [b3Error, setB3Error] = useState<string | null>(null);

  function handleB3Submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setB3Error(null);
    const fd = new FormData(e.currentTarget);

    // Automatically populates the class properties
    const model = new StudentModel(
      Number(fd.get("studentNo")),
      String(fd.get("studentName") ?? ""),
      String(fd.get("program") ?? "")
    );

    if (!model.studentNo || isNaN(model.studentNo) || model.studentNo <= 0) {
      setB3Error("Student number must be greater than 0.");
      return;
    }
    if (!model.studentName.trim()) {
      setB3Error("Student name cannot be empty.");
      return;
    }

    // Preserve submitted values in inputs
    setB3FormData(model);
    setB3BoundModel(model);
  }

  // --- Task B4: Complex Binding State (Nested Models & Aggregation) ---
  const [b4SelectedItemId, setB4SelectedItemId] = useState<number>(menuCatalog[0].id);
  const [b4Quantity, setB4Quantity] = useState<number>(2);
  const [b4StudentNo, setB4StudentNo] = useState<string>("20244044");
  const [b4StudentName, setB4StudentName] = useState<string>("Juan Dela Cruz");
  const [b4Program, setB4Program] = useState<string>("BSIT");
  const [b4Summary, setB4Summary] = useState<string | null>(
    "Pre-order for Juan Dela Cruz (BSIT): 2 × Chicken Adobo = ₱130.00"
  );
  const [b4Error, setB4Error] = useState<string | null>(null);

  function handleB4Submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setB4Error(null);
    const fd = new FormData(e.currentTarget);

    // Read dot notation fields: Student.StudentNo, Student.StudentName, Student.Program, Item.Id, Quantity
    const sNo = Number(fd.get("Student.StudentNo"));
    const sName = String(fd.get("Student.StudentName") ?? "");
    const sProg = String(fd.get("Student.Program") ?? "");
    const qty = Number(fd.get("Quantity"));
    const itemId = Number(fd.get("Item.Id"));

    if (!sNo || sNo <= 0) {
      setB4Error("Please provide a valid Student Number.");
      return;
    }
    if (!sName.trim()) {
      setB4Error("Student Name is required.");
      return;
    }
    if (isNaN(qty) || qty < 1 || qty > 20) {
      setB4Error("Quantity must be between 1 and 20.");
      return;
    }

    const selectedItem = menuCatalog.find((m) => m.id === itemId) ?? null;
    const student = new StudentModel(sNo, sName, sProg);
    const order = new PreOrderModel(qty, student, selectedItem);

    // Safe null checks
    if (!order.student || !order.item) {
      setB4Error("Order incomplete: missing student or menu item selection.");
      return;
    }

    // Encapsulated domain logic call: order.getTotal()
    const total = order.getTotal();

    // Required format: Pre-order for Juan Dela Cruz (BSIT): 2 × Chicken Adobo = ₱130.00
    setB4Summary(
      `Pre-order for ${order.student.studentName} (${order.student.program || "Student"}): ${order.quantity} × ${order.item.name} = ₱${total.toFixed(2)}`
    );
  }

  // Pre-select item from menu table for quick order
  function selectItemForPreOrder(item: MenuItem) {
    setB4SelectedItemId(item.id);
    setActiveBindingTab("complex-binding");
    const preorderSection = document.getElementById("pre-order-lab");
    if (preorderSection) {
      preorderSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-slate-100 flex flex-col font-sans selection:bg-[#f26522] selection:text-white">
      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION BAR (Matching screenshot: Savorelle brand, links, Order Now) */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0b0c0e]/85 border-b border-white/[0.07] px-6 sm:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl tracking-tight text-white group-hover:text-orange-400 transition-colors">
              Quezon City University
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-white/10 text-orange-400 border border-orange-500/20">
              QCU Canteen
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm text-slate-300 font-medium">
            <a href="#hero" className="hover:text-white transition-colors">
              Home
            </a>
            <a href="#menu" className="hover:text-white transition-colors">
              Menu
            </a>
            <a href="#pre-order-lab" className="hover:text-white transition-colors">
              Pre-Order
            </a>
            <a href="#binding-hub" className="hover:text-white transition-colors">
              Binding Lab
            </a>
            <a href="#architecture" className="hover:text-white transition-colors">
              Architecture
            </a>
          </nav>

          {/* Action Button: Pill with circular arrow badge (Goes to Part A Menu) */}
          <a
            href="#menu"
            className="group inline-flex items-center gap-2.5 bg-[#f26522] hover:bg-[#ff7332] text-black font-semibold text-sm pl-5 pr-2 py-2 rounded-full transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
          >
            <span>Order Now</span>
            <span className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs group-hover:rotate-45 transition-transform duration-300">
              ↗
            </span>
          </a>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION (Faithful recreation of the user's uploaded screenshot) */}
      {/* ========================================================================= */}
      <section
        id="hero"
        className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-28 px-6 sm:px-12"
      >
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines, Arrow Doodle, Subtitle, CTA & Floating Features Card */}
          <div className="lg:col-span-6 flex flex-col justify-center z-10">
            {/* Serif Main Headline with Hand-Drawn Loop Arrow */}
            <div className="relative mb-6">
              {/* Curved Doodle Arrow pointing to the food plate */}
              <div className="absolute -top-10 left-52 sm:left-64 pointer-events-none select-none hidden sm:block">
                <svg
                  width="130"
                  height="55"
                  viewBox="0 0 130 55"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="opacity-80 text-white"
                >
                  <path
                    d="M 5 35 C 30 10, 45 4, 60 16 C 72 26, 68 45, 52 38 C 42 33, 48 15, 75 18 C 95 20, 110 24, 122 28"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="none"
                  />
                  {/* Arrowhead */}
                  <path
                    d="M 116 22 L 124 28 L 115 34"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal tracking-tight text-white leading-[1.08]">
                Savor Every <br />
                Moment with <br />
                <span className="text-[#f26522] italic font-serif">Every Bite</span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-slate-300/90 text-base sm:text-lg font-light leading-relaxed max-w-xl mb-8">
              Experience gourmet university dining crafted with passion, fresh ingredients, and unforgettable flavors for Quezon City University. Enjoy automatic 10% student discounts and explore our live Model Binding laboratory.
            </p>

            {/* Primary Action Button */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <a
                href="#menu"
                className="group inline-flex items-center gap-3 bg-[#f26522] hover:bg-[#ff7332] text-black font-semibold text-base pl-6 pr-2.5 py-3 rounded-full transition-all duration-300 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40"
              >
                <span>Reserve Your Table</span>
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm group-hover:rotate-45 transition-transform duration-300">
                  ↗
                </span>
              </a>

              <a
                href="#pre-order-lab"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm transition"
              >
                <span>Explore Binding Lab</span>
                <span className="text-orange-400">→</span>
              </a>
            </div>

            {/* Floating Glassmorphic Features Card (From Screenshot) */}
            <div className="backdrop-blur-xl bg-[#131417]/85 border border-white/10 rounded-3xl p-6 shadow-2xl max-w-lg">
              <div className="space-y-5">
                {/* Item 1: Special Events / Student Privileges */}
                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shrink-0 group-hover:bg-amber-500/10 transition">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white group-hover:text-orange-400 transition">
                      Special Events &amp; 10% Student Discount
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Encapsulated domain calculation directly inside MenuItem domain model.
                    </p>
                  </div>
                </div>

                {/* Item 2: Chef's Experience */}
                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-200 shrink-0 group-hover:bg-white/10 transition">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white group-hover:text-orange-400 transition">
                      Chef&apos;s Experience &amp; Daily Menu
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Meals, Drinks, and Snacks with real-time stock availability.
                    </p>
                  </div>
                </div>

                {/* Item 3: Teriyaki Wings */}
                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-orange-400 shrink-0 group-hover:bg-orange-500/10 transition">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.527.82-1.173 1.986-1.574 3.08-1.077 2.946-.68 5.617 1.155 7.155.195.163.426.31.687.432.222.104.46.18.708.232a5.952 5.952 0 001.218.064c1.696-.068 3.256-.887 4.23-2.213.974-1.326 1.189-3.03.585-4.63-.58-1.536-1.85-2.73-3.137-3.528-.407-.253-.822-.486-1.23-.7a8.47 8.47 0 00-.77-.387zM8.5 9.5a1 1 0 00-1-1c-1.34 0-2.48.9-2.82 2.16-.17.63-.16 1.3.03 1.94.39 1.34 1.5 2.37 2.87 2.7.35.08.7.1 1.05.07.28-.02.55-.07.82-.16a1 1 0 10-.62-1.9 3.003 3.003 0 01-1.35-.55 3.01 3.01 0 01-.98-1.55 3.01 3.01 0 01.12-1.43c.15-.55.57-.96 1.1-.98.43-.02.78-.4 1-.8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white group-hover:text-orange-400 transition">
                      Teriyaki Wings &amp; Chicken Adobo
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Crispy, saucy campus favorites with a hint of toasted sesame.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High Quality Circular Food Plate Presentation */}
          <div className="lg:col-span-6 flex justify-center items-center relative">
            <div className="relative flex items-center justify-center">
              {/* Outer soft ambient halo */}
              <div className="absolute -inset-8 bg-gradient-to-tr from-orange-600/25 via-amber-500/10 to-transparent blur-3xl rounded-full" />

              {/* Circular Plate Frame */}
              <div className="relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] lg:w-[520px] lg:h-[520px] rounded-full p-2 bg-gradient-to-b from-white/10 via-black to-[#101114] shadow-[0_20px_60px_rgba(0,0,0,0.9)] border border-white/10 group">
                <div className="w-full h-full rounded-full overflow-hidden relative bg-black flex items-center justify-center">
                  {/* Using the user's uploaded hero image, centered directly on the plate */}
                  <img
                    src="/savorelle-hero.png"
                    alt="Teriyaki Glazed Chicken Wings on Dark Plate"
                    className="w-[200%] max-w-none h-[180%] object-cover object-[80%_48%] -translate-x-[26%] -translate-y-[10%] filter contrast-105 brightness-105 transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Inner subtle rim shadow */}
                  <div className="absolute inset-0 rounded-full shadow-inner pointer-events-none ring-1 ring-white/10" />
                </div>

                {/* Floating Dish Badge Tag */}
                <div className="absolute -bottom-2 -left-2 sm:bottom-4 sm:left-4 backdrop-blur-xl bg-[#141518]/90 border border-white/15 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <div>
                    <div className="text-xs font-semibold text-white">Daily Campus Special</div>
                    <div className="text-[11px] text-orange-400 font-mono">
                      Adobo &amp; Wings · ₱65.00 (₱58.50 Student)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PART A: THE MENU SYSTEM (Data Modeling & Simple Binding) */}
      {/* ========================================================================= */}
      <section
        id="menu"
        className="py-20 px-6 sm:px-12 border-t border-white/[0.08] bg-[#0e0f13]/60 relative scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  Part A
                </span>
                <span className="text-xs text-slate-400 uppercase tracking-widest">
                  Catalog &amp; Discount Calculation
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                QCU Canteen Daily Menu
              </h2>
              <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
                Demonstrates encapsulated domain model logic via{" "}
                <code className="text-orange-300 font-mono">MenuItem.GetDiscountedPrice(10)</code>{" "}
                and category filtering using Simple Query Parameter Binding (
                <code className="text-orange-300 font-mono">?category=...</code>).
              </p>
            </div>

            {/* Direct Link to Standalone Menu Route */}
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 text-xs font-semibold text-orange-400 hover:text-orange-300 transition group"
            >
              <span>Open Dedicated Menu Page</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* Filtering via Simple Binding (?category=...) */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-2">
              Filter by Category:
            </span>
            {["All", "Meals", "Drinks", "Snacks"].map((cat) => {
              const isSelected =
                (!activeCategory && cat === "All") ||
                (activeCategory && activeCategory.toLowerCase() === cat.toLowerCase()) ||
                (!activeCategory && cat.toLowerCase() === "all");

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === "All" ? "" : cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isSelected
                      ? "bg-[#f26522] text-black shadow-lg shadow-orange-500/20 font-bold"
                      : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Tabular Menu Interface */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#121317]/80 backdrop-blur-xl shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-xs uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-6 font-semibold">ID</th>
                    <th className="py-4 px-6 font-semibold">Item Name</th>
                    <th className="py-4 px-6 font-semibold">Category</th>
                    <th className="py-4 px-6 font-semibold">Original Price</th>
                    <th className="py-4 px-6 font-semibold text-emerald-400">
                      Student Price (10% Off)
                    </th>
                    <th className="py-4 px-6 font-semibold">Availability</th>
                    <th className="py-4 px-6 font-semibold text-right">Order Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filteredMenuItems.map((item) => {
                    const discountedPrice = item.getDiscountedPrice(10);
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-white/[0.04] transition-colors group"
                      >
                        <td className="py-4 px-6 text-slate-400 font-mono text-xs">#{item.id}</td>
                        <td className="py-4 px-6 font-medium text-white group-hover:text-orange-300 transition-colors">
                          {item.name}
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/10 text-slate-300 border border-white/5">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-300">₱{item.price.toFixed(2)}</td>
                        <td className="py-4 px-6 font-bold text-emerald-400">
                          ₱{discountedPrice.toFixed(2)}
                        </td>
                        <td className="py-4 px-6">
                          {item.isAvailable ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                              Sold out
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          {item.isAvailable ? (
                            <button
                              onClick={() => selectItemForPreOrder(item)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-[#f26522] text-orange-400 hover:text-black font-semibold text-xs transition-all border border-orange-500/20"
                            >
                              <span>Pre-Order</span>
                              <span>↗</span>
                            </button>
                          ) : (
                            <span className="text-xs text-slate-500 italic">Unavailable</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer Summary of Domain Logic */}
            <div className="p-4 bg-black/40 border-t border-white/5 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                <span>
                  Showing <strong>{filteredMenuItems.length}</strong> items across 3 distinct categories with available &amp; sold-out items.
                </span>
              </div>
              <div className="font-mono text-slate-300">
                Encapsulated Method: <span className="text-emerald-400">item.GetDiscountedPrice(10)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PART B: PRE-ORDER SYSTEM (Four Model Binding Implementations) */}
      {/* ========================================================================= */}
      <section
        id="pre-order-lab"
        className="py-20 px-6 sm:px-12 border-t border-white/[0.08] relative"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Part B
                </span>
                <span className="text-xs text-slate-400 uppercase tracking-widest">
                  Model Binding Architectural Lab
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Pre-Order Model Binding Lab
              </h2>
              <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
                Compare four distinct client-to-server data mapping patterns side-by-side: from raw form extraction to composite nested domain model binding.
              </p>
            </div>

            <Link
              href="/binding"
              className="inline-flex items-center gap-2 text-xs font-semibold text-orange-400 hover:text-orange-300 transition group"
            >
              <span>View Central Binding Navigation Hub</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* Model Binding Variation Switcher / Central Tabs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {[
              {
                id: "no-binding",
                title: "1. No Binding",
                sub: "Manual Extraction (Request.Form)",
                badge: "Task B1",
              },
              {
                id: "simple-binding",
                title: "2. Simple Binding",
                sub: "Primitive Parameters (int, string)",
                badge: "Task B2",
              },
              {
                id: "class-binding",
                title: "3. Class / Object",
                sub: "Strongly Typed StudentModel",
                badge: "Task B3",
              },
              {
                id: "complex-binding",
                title: "4. Complex Binding",
                sub: "Nested PreOrderModel & Aggregation",
                badge: "Task B4",
              },
            ].map((tab) => {
              const isActive = activeBindingTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveBindingTab(
                      tab.id as "no-binding" | "simple-binding" | "class-binding" | "complex-binding"
                    )
                  }
                  className={`text-left p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                    isActive
                      ? "bg-[#181a20] border-orange-500 shadow-xl shadow-orange-500/10 ring-1 ring-orange-500/50"
                      : "bg-[#101115] border-white/10 hover:border-white/20 text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isActive
                          ? "bg-orange-500 text-black font-semibold"
                          : "bg-white/10 text-slate-400"
                      }`}
                    >
                      {tab.badge}
                    </span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-orange-400" />}
                  </div>
                  <div>
                    <div
                      className={`font-semibold text-sm ${
                        isActive ? "text-white" : "text-slate-300"
                      }`}
                    >
                      {tab.title}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 leading-snug">{tab.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Form Panel based on activeBindingTab */}
          <div className="backdrop-blur-xl bg-[#121317]/90 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
            {/* ----------------------------------------------------------------- */}
            {/* VARIATION 1: NO BINDING (Manual Extraction) */}
            {/* ----------------------------------------------------------------- */}
            {activeBindingTab === "no-binding" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-6 space-y-4">
                  <div className="border-b border-white/10 pb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">
                        Task B1: No Binding (Manual Extraction)
                      </h3>
                      <Link
                        href="/binding/no-binding"
                        className="text-xs text-orange-400 hover:underline"
                      >
                        Full Standalone Route ↗
                      </Link>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Inspects HTTP Request directly, extracts raw strings from{" "}
                      <code className="text-orange-300">Request.Form</code>, manually validates using{" "}
                      <code className="text-orange-300">int.TryParse</code>, and renders output in a styled header.
                    </p>
                  </div>

                  <form onSubmit={handleB1Submit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Student Number (Request.Form[&quot;StudentNo&quot;])
                      </label>
                      <input
                        name="StudentNo"
                        value={b1StudentNo}
                        onChange={(e) => setB1StudentNo(e.target.value)}
                        placeholder="e.g. 20241011"
                        className="w-full border border-white/10 p-3 rounded-xl text-sm bg-black/40 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Student Name (Request.Form[&quot;StudentName&quot;])
                      </label>
                      <input
                        name="StudentName"
                        value={b1StudentName}
                        onChange={(e) => setB1StudentName(e.target.value)}
                        placeholder="e.g. Maria Clara"
                        className="w-full border border-white/10 p-3 rounded-xl text-sm bg-black/40 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#f26522] hover:bg-[#ea580c] text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-orange-500/20"
                    >
                      Process Manual Extraction (POST)
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-6 bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col justify-between h-full">
                  <div>
                    <div className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2">
                      Server-Side Execution &amp; Output Header
                    </div>
                    {b1Error ? (
                      <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-sm">
                        <strong>Manual Validation Error:</strong> {b1Error}
                      </div>
                    ) : b1Result ? (
                      <div className="p-5 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-2">
                        <div className="text-[11px] uppercase tracking-wider text-purple-400 font-semibold">
                          Styled Header Output:
                        </div>
                        {/* Task B1: Styled header displaying parsed output */}
                        <h4 className="text-purple-300 font-bold text-xl">
                          Submitted: {b1Result.studentNo} - {b1Result.studentName}
                        </h4>
                        <div className="text-xs text-slate-400 pt-2 border-t border-purple-500/20">
                          ✓ Successfully parsed via <code className="text-purple-300">int.TryParse()</code> from raw HTTP Form values.
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-500 text-sm italic border border-dashed border-white/10 rounded-xl">
                        Submit the form to inspect manual request extraction.
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400 font-mono">
                    <span className="text-orange-400">ASP.NET MVC Equivalent:</span>
                    <pre className="mt-1 p-2 rounded bg-black/60 text-slate-300 overflow-x-auto text-[11px]">
{`[HttpPost]
public IActionResult ManualOrder() {
  string rawId = Request.Form["StudentNo"];
  if (!int.TryParse(rawId, out int id)) { /* handle error */ }
  return View();
}`}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* VARIATION 2: SIMPLE BINDING (Primitive Parameter Extraction) */}
            {/* ----------------------------------------------------------------- */}
            {activeBindingTab === "simple-binding" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-6 space-y-4">
                  <div className="border-b border-white/10 pb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">
                        Task B2: Simple Binding (Primitive Parameters)
                      </h3>
                      <Link
                        href="/binding/simple-binding"
                        className="text-xs text-orange-400 hover:underline"
                      >
                        Full Standalone Route ↗
                      </Link>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Maps form inputs directly into primitive action method signatures (
                      <code className="text-orange-300">int StudentNo</code>,{" "}
                      <code className="text-orange-300">string StudentName</code>) using automatic type casting.
                    </p>
                  </div>

                  <form onSubmit={handleB2Submit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Student No (maps to: int StudentNo)
                      </label>
                      <input
                        name="StudentNo"
                        value={b2StudentNo}
                        onChange={(e) => setB2StudentNo(e.target.value)}
                        placeholder="20242022"
                        className="w-full border border-white/10 p-3 rounded-xl text-sm bg-black/40 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Student Name (maps to: string StudentName)
                      </label>
                      <input
                        name="StudentName"
                        value={b2StudentName}
                        onChange={(e) => setB2StudentName(e.target.value)}
                        placeholder="Crisostomo Ibarra"
                        className="w-full border border-white/10 p-3 rounded-xl text-sm bg-black/40 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#f26522] hover:bg-[#ea580c] text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-orange-500/20"
                    >
                      Submit Primitive Signature
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-6 bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col justify-between h-full">
                  <div>
                    <div className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2">
                      Extracted Primitive Signatures
                    </div>
                    {b2Result ? (
                      <div className="p-5 rounded-xl bg-blue-950/40 border border-blue-500/40 space-y-3">
                        <div className="text-[11px] uppercase tracking-wider text-blue-400 font-semibold">
                          Binding Handler Results:
                        </div>
                        <div className="font-mono text-sm space-y-1 text-slate-200">
                          <p>
                            <span className="text-slate-400">int StudentNo:</span>{" "}
                            {isNaN(b2Result.studentNo) ? (
                              <span className="text-amber-400 font-bold">0 (Binding Failure)</span>
                            ) : (
                              <strong className="text-white">{b2Result.studentNo}</strong>
                            )}
                          </p>
                          <p>
                            <span className="text-slate-400">string StudentName:</span>{" "}
                            <strong className="text-white">&quot;{b2Result.studentName}&quot;</strong>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-500 text-sm italic border border-dashed border-white/10 rounded-xl">
                        Submit parameters to test primitive method binding.
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400 font-mono">
                    <span className="text-orange-400">ASP.NET MVC Method Signature:</span>
                    <pre className="mt-1 p-2 rounded bg-black/60 text-slate-300 overflow-x-auto text-[11px]">
{`[HttpPost]
public IActionResult SimpleBinding(int StudentNo, string StudentName) {
  // Model binder maps input names to parameters
  return View();
}`}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* VARIATION 3: CLASS / OBJECT BINDING */}
            {/* ----------------------------------------------------------------- */}
            {activeBindingTab === "class-binding" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-6 space-y-4">
                  <div className="border-b border-white/10 pb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">
                        Task B3: Class / Object Binding
                      </h3>
                      <Link
                        href="/binding/class-binding"
                        className="text-xs text-orange-400 hover:underline"
                      >
                        Full Standalone Route ↗
                      </Link>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Accepts a strongly typed <code className="text-orange-300">StudentModel</code>, automatically populates class properties, and preserves user input state across submissions to prevent data loss.
                    </p>
                  </div>

                  <form onSubmit={handleB3Submit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Student No (studentNo property)
                      </label>
                      <input
                        name="studentNo"
                        type="number"
                        value={b3FormData.studentNo === 0 ? "" : b3FormData.studentNo}
                        onChange={(e) =>
                          setB3FormData(
                            new StudentModel(
                              Number(e.target.value),
                              b3FormData.studentName,
                              b3FormData.program
                            )
                          )
                        }
                        placeholder="20243033"
                        className="w-full border border-white/10 p-3 rounded-xl text-sm bg-black/40 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Student Name (studentName property)
                      </label>
                      <input
                        name="studentName"
                        value={b3FormData.studentName}
                        onChange={(e) =>
                          setB3FormData(
                            new StudentModel(
                              b3FormData.studentNo,
                              e.target.value,
                              b3FormData.program
                            )
                          )
                        }
                        placeholder="Elias Salcedo"
                        className="w-full border border-white/10 p-3 rounded-xl text-sm bg-black/40 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Program (program property)
                      </label>
                      <input
                        name="program"
                        value={b3FormData.program}
                        onChange={(e) =>
                          setB3FormData(
                            new StudentModel(
                              b3FormData.studentNo,
                              b3FormData.studentName,
                              e.target.value
                            )
                          )
                        }
                        placeholder="BSIT"
                        className="w-full border border-white/10 p-3 rounded-xl text-sm bg-black/40 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#f26522] hover:bg-[#ea580c] text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-orange-500/20"
                    >
                      Bind into StudentModel
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-6 bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col justify-between h-full">
                  <div>
                    <div className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2">
                      Strongly Typed StudentModel Instance
                    </div>

                    {b3Error ? (
                      <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-sm">
                        {b3Error}
                      </div>
                    ) : b3BoundModel ? (
                      <div className="p-5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-3">
                        <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold">
                          Class Binding Successful:
                        </div>
                        <div className="space-y-1 text-sm font-mono text-slate-200">
                          <p>
                            <span className="text-slate-400">StudentNo:</span>{" "}
                            {b3BoundModel.studentNo}
                          </p>
                          <p>
                            <span className="text-slate-400">StudentName:</span>{" "}
                            {b3BoundModel.studentName}
                          </p>
                          <p>
                            <span className="text-slate-400">Program:</span>{" "}
                            {b3BoundModel.program || "N/A"}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-emerald-500/20 text-xs text-emerald-300">
                          ✓ State retained in input elements across submits to avoid data loss.
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-500 text-sm italic border border-dashed border-white/10 rounded-xl">
                        Submit form to create and view StudentModel binding.
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400 font-mono">
                    <span className="text-orange-400">Strongly Typed Controller Signature:</span>
                    <pre className="mt-1 p-2 rounded bg-black/60 text-slate-300 overflow-x-auto text-[11px]">
{`[HttpPost]
public IActionResult ClassBinding(StudentModel student) {
  // Properties populated automatically from input fields
  return View(student); // preserves values
}`}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* VARIATION 4: COMPLEX BINDING (Nested Models & Aggregation) */}
            {/* ----------------------------------------------------------------- */}
            {activeBindingTab === "complex-binding" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-5">
                  <div className="border-b border-white/10 pb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">
                        Task B4: Complex Binding (Nested Models)
                      </h3>
                      <Link
                        href="/binding/complex-binding"
                        className="text-xs text-orange-400 hover:underline"
                      >
                        Full Standalone Route ↗
                      </Link>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Maps form inputs into composite <code className="text-orange-300">PreOrderModel</code> using dot notation (
                      <code className="text-orange-300">Student.StudentName</code>,{" "}
                      <code className="text-orange-300">Item.Id</code>) and delegates total calculation to domain model method{" "}
                      <code className="text-orange-300">order.getTotal()</code>.
                    </p>
                  </div>

                  <form onSubmit={handleB4Submit} className="space-y-4">
                    {/* Nested Student Model Section */}
                    <fieldset className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
                      <legend className="text-xs uppercase font-semibold text-orange-400 px-2 tracking-wider">
                        Child Object: Student (Student.*)
                      </legend>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Student.StudentNo
                          </label>
                          <input
                            name="Student.StudentNo"
                            type="number"
                            value={b4StudentNo}
                            onChange={(e) => setB4StudentNo(e.target.value)}
                            required
                            className="w-full border border-white/10 p-2.5 rounded-lg text-xs bg-black/60 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Student.StudentName
                          </label>
                          <input
                            name="Student.StudentName"
                            value={b4StudentName}
                            onChange={(e) => setB4StudentName(e.target.value)}
                            required
                            className="w-full border border-white/10 p-2.5 rounded-lg text-xs bg-black/60 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Student.Program
                          </label>
                          <input
                            name="Student.Program"
                            value={b4Program}
                            onChange={(e) => setB4Program(e.target.value)}
                            required
                            className="w-full border border-white/10 p-2.5 rounded-lg text-xs bg-black/60 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </fieldset>

                    {/* Nested MenuItem Selection & Quantity */}
                    <fieldset className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
                      <legend className="text-xs uppercase font-semibold text-orange-400 px-2 tracking-wider">
                        Order Details (Item.* &amp; Quantity)
                      </legend>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Menu Item (Item.Id)
                          </label>
                          <select
                            name="Item.Id"
                            value={b4SelectedItemId}
                            onChange={(e) => setB4SelectedItemId(Number(e.target.value))}
                            className="w-full border border-white/10 p-2.5 rounded-lg text-xs bg-black/60 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                          >
                            {menuCatalog.map((item) => (
                              <option
                                key={item.id}
                                value={item.id}
                                disabled={!item.isAvailable}
                                className="bg-slate-900 text-white"
                              >
                                {item.name} ({item.category}) - ₱{item.price.toFixed(2)}{" "}
                                {item.isAvailable ? "" : "[Sold out]"}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Quantity (1 - 20)
                          </label>
                          <input
                            name="Quantity"
                            type="number"
                            min={1}
                            max={20}
                            value={b4Quantity}
                            onChange={(e) => setB4Quantity(Number(e.target.value))}
                            required
                            className="w-full border border-white/10 p-2.5 rounded-lg text-xs bg-black/60 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono"
                          />
                        </div>
                      </div>
                    </fieldset>

                    <button
                      type="submit"
                      className="w-full bg-[#f26522] hover:bg-[#ea580c] text-white font-semibold py-3.5 rounded-xl transition shadow-xl shadow-orange-500/20"
                    >
                      Submit Complex Pre-Order
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-5 bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col justify-between h-full">
                  <div>
                    <div className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2">
                      Composite PreOrderModel Result
                    </div>

                    {b4Error ? (
                      <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-sm">
                        {b4Error}
                      </div>
                    ) : b4Summary ? (
                      <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold">
                            Formatted Order Summary:
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Valid Order
                          </span>
                        </div>

                        {/* Required exact format example: Pre-order for Juan Dela Cruz (BSIT): 2 × Chicken Adobo = ₱130.00 */}
                        <div className="p-3 bg-black/40 rounded-xl border border-emerald-500/20">
                          <h4 className="text-emerald-300 font-bold text-base leading-snug">
                            {b4Summary}
                          </h4>
                        </div>

                        <div className="text-xs text-slate-300 space-y-1 font-mono">
                          <div className="text-[11px] text-slate-400 uppercase">
                            Model Properties:
                          </div>
                          <div>Student: {b4StudentName} ({b4Program})</div>
                          <div>Selected ID: #{b4SelectedItemId}</div>
                          <div>Total Computed: order.getTotal()</div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-500 text-sm italic border border-dashed border-white/10 rounded-xl">
                        Submit form to compute total and create nested model.
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400 font-mono">
                    <span className="text-orange-400">Encapsulated Calculation:</span>
                    <pre className="mt-1 p-2 rounded bg-black/60 text-slate-300 overflow-x-auto text-[11px]">
{`public double GetTotal() {
  if (Item == null) return 0;
  return Quantity * Item.Price;
}`}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ARCHITECTURAL SHOWCASE: SEPARATION OF CONCERNS & MODEL BINDING MATRIX */}
      {/* ========================================================================= */}
      <section
        id="architecture"
        className="py-20 px-6 sm:px-12 border-t border-white/[0.08] bg-[#0c0d10]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
              Comparative Analysis
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-3">
              Web Framework Model Binding Patterns
            </h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Model binding bridges incoming client HTTP payloads with server domain structures. Below is how our four implementations compare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold font-mono text-purple-400 uppercase mb-2">
                  Pattern 1
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Binding</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Manual inspection of <code className="text-purple-300">Request.Form</code> strings with procedural type conversions (e.g. <code className="text-purple-300">int.TryParse</code>).
                </p>
                <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400">⚠</span> High boilerplate code
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400">⚠</span> Manual parsing validation
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span> Total control over raw input
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5">
                <Link
                  href="/binding/no-binding"
                  className="text-xs font-semibold text-orange-400 hover:underline"
                >
                  Explore Task B1 →
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold font-mono text-blue-400 uppercase mb-2">
                  Pattern 2
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Simple Binding</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Direct primitive parameter mapping (<code className="text-blue-300">int StudentNo</code>, <code className="text-blue-300">string StudentName</code>) directly in action signatures.
                </p>
                <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span> Clean handler signatures
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span> Automatic primitive casting
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400">⚠</span> Difficult with large schemas
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5">
                <Link
                  href="/binding/simple-binding"
                  className="text-xs font-semibold text-orange-400 hover:underline"
                >
                  Explore Task B2 →
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold font-mono text-emerald-400 uppercase mb-2">
                  Pattern 3
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Class / Object</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Strongly typed <code className="text-emerald-300">StudentModel</code> binding where inputs automatically populate class fields and preserve state across form submits.
                </p>
                <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span> Strongly typed safety
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span> Input state retention
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span> Encapsulates domain fields
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5">
                <Link
                  href="/binding/class-binding"
                  className="text-xs font-semibold text-orange-400 hover:underline"
                >
                  Explore Task B3 →
                </Link>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold font-mono text-orange-400 uppercase mb-2">
                  Pattern 4
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Complex Binding</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Aggregates child models into composite <code className="text-orange-300">PreOrderModel</code> using dot notation and executes encapsulated business rules like <code className="text-orange-300">order.getTotal()</code>.
                </p>
                <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span> Hierarchical aggregation
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span> Null-safe domain calculation
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span> Production architecture standard
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5">
                <Link
                  href="/binding/complex-binding"
                  className="text-xs font-semibold text-orange-400 hover:underline"
                >
                  Explore Task B4 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CENTRAL NAVIGATION HUB MODAL / FOOTER LINKS */}
      {/* ========================================================================= */}
      <div id="binding-hub" className="py-12 px-6 sm:px-12 border-t border-white/[0.08] bg-[#090a0c]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-serif text-lg font-bold text-white">
              Central Model Binding Navigation Hub
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Direct access to dedicated test suites and standalone route implementations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/menu"
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 border border-white/10 transition"
            >
              Part A: Menu Catalog
            </Link>
            <Link
              href="/binding/no-binding"
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 border border-white/10 transition"
            >
              Task B1: No Binding
            </Link>
            <Link
              href="/binding/simple-binding"
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 border border-white/10 transition"
            >
              Task B2: Simple Binding
            </Link>
            <Link
              href="/binding/class-binding"
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 border border-white/10 transition"
            >
              Task B3: Class Binding
            </Link>
            <Link
              href="/binding/complex-binding"
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 border border-white/10 transition"
            >
              Task B4: Complex Binding
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. FOOTER */}
      {/* ========================================================================= */}
      <footer className="py-8 px-6 sm:px-12 border-t border-white/[0.05] bg-[#070809] text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-slate-300 font-semibold">Savorelle</span>
            <span>·</span>
            <span>Quezon City University CanteenApp</span>
          </div>
          <div>
            Educational Laboratory Platform for ASP.NET MVC / Modern Web Model Binding Architecture.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0b0c0e] text-slate-100 flex items-center justify-center font-sans">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="text-sm text-slate-400 font-serif">Loading Savorelle QCU Canteen...</div>
          </div>
        </div>
      }
    >
      <MainContent />
    </Suspense>
  );
}