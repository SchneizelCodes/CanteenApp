import Link from "next/link";
import { menuCatalog } from "@/data/menuData";

interface MenuPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const resolvedParams = await searchParams;
  const rawCategory = resolvedParams.category?.trim();
  const pageTitle = "QCU Canteen Menu Catalog";

  // Task A4: Case-insensitive simple binding filter (?category=...)
  const filteredItems = rawCategory
    ? menuCatalog.filter(
        (item) => item.category.toLowerCase() === rawCategory.toLowerCase()
      )
    : menuCatalog;

  const categories = [
    { label: "All Items", value: "" },
    { label: "Meals", value: "Meals" },
    { label: "Drinks", value: "Drinks" },
    { label: "Snacks", value: "Snacks" },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/" className="text-xs uppercase tracking-wider text-orange-400 hover:text-orange-300">
            ← Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mt-2">
            {pageTitle}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Part A: Data Modeling with encapsulated student discounts (10% OFF) &amp; Query String Simple Binding.
          </p>
        </div>
        <Link
          href="/binding/complex-binding"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#f26522] hover:bg-[#ea580c] text-white text-sm font-semibold transition shadow-lg shadow-orange-500/20"
        >
          Pre-Order Meal Now ↗
        </Link>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap items-center gap-2 mb-8 p-1.5 rounded-2xl bg-white/5 border border-white/10 w-fit">
        {categories.map((cat) => {
          const isActive =
            (!rawCategory && cat.value === "") ||
            (rawCategory && rawCategory.toLowerCase() === cat.value.toLowerCase());
          const href = cat.value ? `/menu?category=${cat.value}` : "/menu";

          return (
            <Link
              key={cat.label}
              href={href}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? "bg-[#f26522] text-white shadow-md shadow-orange-500/25"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat.label}
            </Link>
          );
        })}
      </div>

      {/* Tabular menu interface */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-slate-400">
              <th className="py-4 px-4 font-semibold">ID</th>
              <th className="py-4 px-4 font-semibold">Item Name</th>
              <th className="py-4 px-4 font-semibold">Category</th>
              <th className="py-4 px-4 font-semibold">Regular Price</th>
              <th className="py-4 px-4 font-semibold text-emerald-400">
                Student Price (10% off)
              </th>
              <th className="py-4 px-4 font-semibold">Availability</th>
              <th className="py-4 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {filteredItems.map((item) => {
              const discountedPrice = item.getDiscountedPrice(10);
              return (
                <tr key={item.id} className="hover:bg-white/[0.04] transition">
                  <td className="py-4 px-4 text-slate-400 font-mono text-xs">#{item.id}</td>
                  <td className="py-4 px-4 font-medium text-white">
                    {item.name}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/10 text-slate-300">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-400">₱{item.price.toFixed(2)}</td>
                  <td className="py-4 px-4 font-bold text-emerald-400">
                    ₱{discountedPrice.toFixed(2)}
                  </td>
                  <td className="py-4 px-4">
                    {item.isAvailable ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                        Sold out
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    {item.isAvailable ? (
                      <Link
                        href="/binding/complex-binding"
                        className="text-xs font-semibold text-orange-400 hover:text-orange-300 hover:underline"
                      >
                        Order →
                      </Link>
                    ) : (
                      <span className="text-xs text-slate-500 cursor-not-allowed">Unavailable</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-8 p-4 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <span>
          Showing <strong>{filteredItems.length}</strong> items in catalog (Filter: {rawCategory ? `"${rawCategory}"` : "All"}).
        </span>
        <span className="text-slate-400">
          Domain Logic: <code className="text-orange-300">MenuItem.GetDiscountedPrice(10)</code> computes discounted value.
        </span>
      </div>
    </div>
  );
}