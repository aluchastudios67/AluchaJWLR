import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Edit2, Archive, Search, X, Loader2 } from "lucide-react";
import { store, auth, type Product } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/products")({
  component: AdminProductsManager,
});

interface VariantInput {
  name: string;
  sku: string;
  inventoryQuantity: number;
  price?: number;
}

function AdminProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Edit / Add Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form Fields
  const [nameEn, setNameEn] = useState("");
  const [nameKa, setNameKa] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [category, setCategory] = useState("Rings");
  const [price, setPrice] = useState(0);
  const [sku, setSku] = useState("");
  const [materialEn, setMaterialEn] = useState("");
  const [materialKa, setMaterialKa] = useState("");
  const [materialRu, setMaterialRu] = useState("");
  const [storyEn, setStoryEn] = useState("");
  const [storyKa, setStoryKa] = useState("");
  const [storyRu, setStoryRu] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState<"active" | "draft">("active");
  const [tracksInventory, setTracksInventory] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  
  // Variants (Size mapping)
  const [variantsList, setVariantsList] = useState<VariantInput[]>([
    { name: "Size XS", sku: "", inventoryQuantity: 10 },
    { name: "Size S", sku: "", inventoryQuantity: 15 },
    { name: "Size M", sku: "", inventoryQuantity: 20 },
    { name: "Size L", sku: "", inventoryQuantity: 25 },
  ]);

  const [saving, setSaving] = useState(false);

  const loadProducts = () => {
    setProducts(store.getProducts());
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setNameEn("");
    setNameKa("");
    setNameRu("");
    setCategory("Rings");
    setPrice(0);
    setSku("");
    setMaterialEn("");
    setMaterialKa("");
    setMaterialRu("");
    setStoryEn("");
    setStoryKa("");
    setStoryRu("");
    setImage("");
    setStatus("active");
    setTracksInventory(true);
    setIsFeatured(false);
    setTagsInput("");
    
    // Default variants
    setVariantsList([
      { name: "Size XS", sku: "", inventoryQuantity: 10 },
      { name: "Size S", sku: "", inventoryQuantity: 15 },
      { name: "Size M", sku: "", inventoryQuantity: 20 },
      { name: "Size L", sku: "", inventoryQuantity: 25 },
    ]);

    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setNameEn(p.name.en);
    setNameKa(p.name.ka);
    setNameRu(p.name.ru);
    setCategory(p.category);
    setPrice(p.price);
    setSku(p.sku);
    setMaterialEn(p.material.en);
    setMaterialKa(p.material.ka);
    setMaterialRu(p.material.ru);
    setStoryEn(p.story.en);
    setStoryKa(p.story.ka);
    setStoryRu(p.story.ru);
    setImage(p.image);
    setStatus(p.status === "active" ? "active" : "draft");
    setTracksInventory(p.tracksInventory);
    setIsFeatured(p.isFeatured);
    setTagsInput(p.tags.join(", "));
    
    // Load variants if present
    if (p.variants && p.variants.length > 0) {
      setVariantsList(p.variants);
    } else {
      setVariantsList([
        { name: "Size XS", sku: `${p.sku}-XS`, inventoryQuantity: 10 },
        { name: "Size S", sku: `${p.sku}-S`, inventoryQuantity: 15 },
        { name: "Size M", sku: `${p.sku}-M`, inventoryQuantity: 20 },
        { name: "Size L", sku: `${p.sku}-L`, inventoryQuantity: 25 },
      ]);
    }

    setIsModalOpen(true);
  };

  const handleSkuAutofill = (baseSku: string) => {
    setSku(baseSku);
    // Autofill variants SKUs based on base SKU
    setVariantsList((prev) =>
      prev.map((v) => {
        const suffix = v.name.split(" ").pop() || "";
        return {
          ...v,
          sku: baseSku ? `${baseSku}-${suffix}` : "",
        };
      })
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const user = auth.getUser();
    if (!user) { setSaving(false); return; }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    const productData = {
      name: { en: nameEn, ka: nameKa, ru: nameRu },
      category: category as Product["category"],
      price: Number(price),
      image: image || "/src/assets/product-1.jpg",
      material: { en: materialEn, ka: materialKa, ru: materialRu },
      story: { en: storyEn, ka: storyKa, ru: storyRu },
      sku,
      tracksInventory,
      tags,
      isFeatured,
      status,
    };

    if (editingProduct) {
      store.updateProduct(user, editingProduct.id, productData);
    } else {
      const newId = `prod-${Date.now()}`;
      store.createProduct(user, { id: newId, ...productData });
      // Also seed default variants
      variantsList.forEach((v, idx) => {
        store.createVariant(user, {
          id: `var-${newId}-${idx}`,
          productId: newId,
          name: v.name,
          price: Number(price),
          sku: v.sku || `${sku}-${v.name.split(" ").pop()}`,
          inventoryQuantity: Number(v.inventoryQuantity),
        });
      });
    }

    setIsModalOpen(false);
    setSaving(false);
    loadProducts();
  };

  const handleArchive = (id: string) => {
    if (!confirm("Archive this product? It will be hidden from the storefront.")) return;
    const user = auth.getUser();
    if (!user) return;
    store.deleteProduct(user, id);
    loadProducts();
  };

  // Filter products client-side for smoother UI
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold">Products</h1>
          <p className="text-[12px] text-neutral-500 mt-1">Add, update, and manage inventory.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-neutral-950 text-white text-[11px] tracking-wider uppercase font-semibold px-4 py-2.5 rounded-sm hover:bg-neutral-850 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" /> Add Product
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white border border-[#E1E3E5] p-4 rounded-sm flex flex-col md:flex-row gap-4 items-center justify-between text-xs">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-transparent border border-[#E1E3E5] rounded-sm focus:outline-none focus:border-neutral-900"
          />
        </div>
        <div className="flex w-full md:w-auto items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Rings">Rings</option>
            <option value="Necklaces">Necklaces</option>
            <option value="Earrings">Earrings</option>
            <option value="Bracelets">Bracelets</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#E1E3E5] rounded-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            <p className="text-xs text-neutral-500 mt-3 tracking-widest uppercase">Loading...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-neutral-500 text-xs">
            No products found matching filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E1E3E5] bg-neutral-50 text-neutral-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Image</th>
                  <th className="py-3 px-4 font-semibold">Product Name</th>
                  <th className="py-3 px-4 font-semibold">SKU</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold text-right">Price</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-4 font-semibold text-center">Featured</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F1F2]">
                {filteredProducts.map((p) => {
                  const variants = store.getVariantsByProduct(p.id);
                  const stockSum = variants.reduce((sum, v) => sum + v.inventoryQuantity, 0);
                  return (
                    <tr key={p.id} className="hover:bg-neutral-50">
                      <td className="py-3 px-4">
                        <img
                          src={p.image}
                          alt={p.name.en}
                          className="h-10 w-10 object-cover bg-neutral-100 border border-neutral-200"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-neutral-900">{p.name.en}</p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">ქარ: {p.name.ka}</p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">Stock: <span className="font-semibold">{stockSum} units</span></p>
                      </td>
                      <td className="py-3 px-4 font-mono text-neutral-600">{p.sku}</td>
                      <td className="py-3 px-4 text-neutral-500">{p.category}</td>
                      <td className="py-3 px-4 text-right font-medium text-neutral-950">${p.price}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-sm font-semibold tracking-wider uppercase text-[9px] ${
                          p.status === "active"
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-sm font-bold">{p.isFeatured ? "★" : "☆"}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(p)}
                            title="Edit"
                            className="p-1.5 hover:bg-neutral-100 hover:text-neutral-950 rounded text-neutral-500 transition-colors"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleArchive(p.id)}
                            title="Archive"
                            className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded text-neutral-500 transition-colors"
                          >
                            <Archive className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-neutral-900/40 animate-fade-in" onClick={() => setIsModalOpen(false)}>
          <div
            className="w-full max-w-2xl bg-white h-full overflow-y-auto flex flex-col p-6 shadow-2xl font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E1E3E5] pb-4 mb-6">
              <h2 className="font-serif text-lg font-semibold uppercase tracking-wider">
                {editingProduct ? `Edit "${editingProduct.name.en}"` : "Add New Product"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-950">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="flex-1 space-y-6 text-xs pb-12">
              {/* Product Names */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-500 uppercase tracking-wider mb-1">Name (English)</label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-500 uppercase tracking-wider mb-1">Name (Georgian)</label>
                  <input
                    type="text"
                    required
                    value={nameKa}
                    onChange={(e) => setNameKa(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm font-sans"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-500 uppercase tracking-wider mb-1">Name (Russian)</label>
                  <input
                    type="text"
                    required
                    value={nameRu}
                    onChange={(e) => setNameRu(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm"
                  />
                </div>
              </div>

              {/* Category, Base SKU, Price */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-500 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm"
                  >
                    <option value="Rings">Rings</option>
                    <option value="Necklaces">Necklaces</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Bracelets">Bracelets</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-neutral-500 uppercase tracking-wider mb-1">Base SKU</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => handleSkuAutofill(e.target.value)}
                    placeholder="e.g. AL-AUR-RG"
                    className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-500 uppercase tracking-wider mb-1">Base Price ($)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm font-mono"
                  />
                </div>
              </div>

              {/* Product Stories */}
              <div className="space-y-3">
                <h3 className="font-serif font-semibold text-[13px] border-b border-[#F0F1F2] pb-1">Product Story</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-neutral-500 font-semibold mb-1">English Story</label>
                    <textarea
                      required
                      rows={2}
                      value={storyEn}
                      onChange={(e) => setStoryEn(e.target.value)}
                      className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 font-semibold mb-1">Georgian Story</label>
                    <textarea
                      required
                      rows={2}
                      value={storyKa}
                      onChange={(e) => setStoryKa(e.target.value)}
                      className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 font-semibold mb-1">Russian Story</label>
                    <textarea
                      required
                      rows={2}
                      value={storyRu}
                      onChange={(e) => setStoryRu(e.target.value)}
                      className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Materials */}
              <div className="space-y-3">
                <h3 className="font-serif font-semibold text-[13px] border-b border-[#F0F1F2] pb-1">Materials</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-neutral-500 font-semibold mb-1">English Material</label>
                    <input
                      type="text"
                      required
                      value={materialEn}
                      onChange={(e) => setMaterialEn(e.target.value)}
                      className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 font-semibold mb-1">Georgian Material</label>
                    <input
                      type="text"
                      required
                      value={materialKa}
                      onChange={(e) => setMaterialKa(e.target.value)}
                      className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 font-semibold mb-1">Russian Material</label>
                    <input
                      type="text"
                      required
                      value={materialRu}
                      onChange={(e) => setMaterialRu(e.target.value)}
                      className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Details & SEO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-500 uppercase tracking-wider mb-1">Image Link (URL)</label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="e.g. /src/assets/product-1.jpg"
                    className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-500 uppercase tracking-wider mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. rings, featured, gold"
                    className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-neutral-50 p-4 border border-[#E1E3E5] rounded-sm">
                <label className="flex items-center gap-2 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tracksInventory}
                    onChange={(e) => setTracksInventory(e.target.checked)}
                    className="rounded-sm border-neutral-300"
                  />
                  <span>Track Inventory</span>
                </label>
                <label className="flex items-center gap-2 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded-sm border-neutral-300"
                  />
                  <span>Featured Product</span>
                </label>
                <div className="col-span-2 flex items-center justify-between gap-3">
                  <span className="font-semibold text-neutral-500 uppercase tracking-wider">Status:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStatus("active")}
                      className={`px-3 py-1.5 rounded-sm border uppercase font-semibold text-[10px] tracking-wider transition-colors ${
                        status === "active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "border-[#E1E3E5] text-neutral-500"
                      }`}
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus("draft")}
                      className={`px-3 py-1.5 rounded-sm border uppercase font-semibold text-[10px] tracking-wider transition-colors ${
                        status === "draft"
                          ? "bg-neutral-900 text-white border-neutral-950"
                          : "border-[#E1E3E5] text-neutral-500"
                      }`}
                    >
                      Draft
                    </button>
                  </div>
                </div>
              </div>

              {/* Variants inventory details */}
              <div className="space-y-3">
                <h3 className="font-serif font-semibold text-[13px] border-b border-[#F0F1F2] pb-1">Variants & Stock Allocation</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-neutral-50 p-4 border border-[#E1E3E5] rounded-sm">
                  {variantsList.map((variant, index) => (
                    <div key={variant.name} className="space-y-1">
                      <p className="font-semibold text-neutral-700">{variant.name}</p>
                      <div className="flex flex-col gap-1.5">
                        <input
                          type="text"
                          required
                          placeholder="SKU"
                          value={variant.sku}
                          onChange={(e) => {
                            const updated = [...variantsList];
                            updated[index].sku = e.target.value;
                            setVariantsList(updated);
                          }}
                          className="px-2 py-1 bg-white border border-[#E1E3E5] rounded-sm font-mono text-[11px]"
                        />
                        <input
                          type="number"
                          required
                          placeholder="Inventory"
                          value={variant.inventoryQuantity}
                          onChange={(e) => {
                            const updated = [...variantsList];
                            updated[index].inventoryQuantity = Number(e.target.value);
                            setVariantsList(updated);
                          }}
                          className="px-2 py-1 bg-white border border-[#E1E3E5] rounded-sm font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Controls */}
              <div className="flex justify-end gap-3 border-t border-[#E1E3E5] pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E1E3E5] text-neutral-600 hover:bg-neutral-50 rounded-sm font-semibold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-neutral-950 text-white px-5 py-2.5 rounded-sm hover:bg-neutral-850 flex items-center gap-2 font-semibold uppercase tracking-wider cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
