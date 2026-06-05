import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Edit2, X, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { store, auth, type Collection, type Product } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/collections")({
  component: AdminCollectionsManager,
});

function AdminCollectionsManager() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  // Form fields
  const [nameEn, setNameEn] = useState("");
  const [nameKa, setNameKa] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descKa, setDescKa] = useState("");
  const [descRu, setDescRu] = useState("");
  const [slug, setSlug] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [collectionProductIds, setCollectionProductIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    setCollections(store.getCollections());
    setAllProducts(store.getProducts());
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingCollection(null);
    setNameEn("");
    setNameKa("");
    setNameRu("");
    setDescEn("");
    setDescKa("");
    setDescRu("");
    setSlug("");
    setIsFeatured(false);
    setCollectionProductIds([]);
    setIsModalOpen(true);
  };

  const openEditModal = (c: Collection) => {
    setEditingCollection(c);
    setNameEn(c.name.en);
    setNameKa(c.name.ka);
    setNameRu(c.name.ru);
    setDescEn(c.description.en);
    setDescKa(c.description.ka);
    setDescRu(c.description.ru);
    setSlug(c.slug);
    setIsFeatured(c.isFeatured);
    setCollectionProductIds(c.productIds || []);
    setIsModalOpen(true);
  };

  const toggleProductInCollection = (productId: string) => {
    setCollectionProductIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const moveProductOrder = (index: number, direction: "up" | "down") => {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= collectionProductIds.length) return;

    setCollectionProductIds((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[nextIndex];
      updated[nextIndex] = temp;
      return updated;
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const user = auth.getUser();
    if (!user) { setSaving(false); return; }

    const updates = {
      name: { en: nameEn, ka: nameKa, ru: nameRu },
      description: { en: descEn, ka: descKa, ru: descRu },
      slug,
      isFeatured,
      productIds: collectionProductIds,
    };

    if (editingCollection) {
      store.updateCollection(user, editingCollection.id, updates);
    }
    // Note: creating new collections is not yet supported in the seed store
    setIsModalOpen(false);
    setSaving(false);
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold">Collections</h1>
          <p className="text-[12px] text-neutral-500 mt-1">Manage product groupings and ordering.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-neutral-950 text-white text-[11px] tracking-wider uppercase font-semibold px-4 py-2.5 rounded-sm hover:bg-neutral-850 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" /> Create Collection
        </button>
      </div>

      {/* Collections List */}
      <div className="bg-white border border-[#E1E3E5] rounded-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            <p className="text-xs text-neutral-500 mt-3 tracking-widest uppercase">Loading collections...</p>
          </div>
        ) : collections.length === 0 ? (
          <div className="py-20 text-center text-neutral-500 text-xs">
            No collections defined. Create one to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E1E3E5] bg-neutral-50 text-neutral-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Collection Name</th>
                  <th className="py-3 px-4 font-semibold">Slug</th>
                  <th className="py-3 px-4 font-semibold">Description</th>
                  <th className="py-3 px-4 text-center font-semibold">Products</th>
                  <th className="py-3 px-4 text-center font-semibold">Featured</th>
                  <th className="py-3 px-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F1F2]">
                {collections.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50">
                    <td className="py-4 px-4">
                      <p className="font-semibold text-neutral-900">{c.name.en}</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">ქარ: {c.name.ka}</p>
                    </td>
                    <td className="py-4 px-4 font-mono text-neutral-600">/{c.slug}</td>
                    <td className="py-4 px-4 text-neutral-500 max-w-xs truncate">{c.description.en}</td>
                    <td className="py-4 px-4 text-center font-medium text-neutral-700">{c.productIds?.length || 0}</td>
                    <td className="py-4 px-4 text-center font-bold">{c.isFeatured ? "★" : "☆"}</td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => openEditModal(c)}
                        className="p-1.5 hover:bg-neutral-100 hover:text-neutral-950 rounded text-neutral-500 transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-neutral-900/40 animate-fade-in" onClick={() => setIsModalOpen(false)}>
          <div
            className="w-full max-w-2xl bg-white h-full overflow-y-auto flex flex-col p-6 shadow-2xl font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E1E3E5] pb-4 mb-6">
              <h2 className="font-serif text-lg font-semibold uppercase tracking-wider">
                {editingCollection ? `Edit Collection "${editingCollection.name.en}"` : "Create Collection"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-950">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="flex-1 space-y-6 text-xs pb-12">
              {/* Names */}
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

              {/* Slug, Featured Toggle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-500 uppercase tracking-wider mb-1">Slug</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ""))}
                    placeholder="e.g. spring-edit"
                    className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm font-mono"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded-sm border-neutral-300"
                    />
                    <span>Featured Collection (Display on homepage)</span>
                  </label>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-3">
                <h3 className="font-serif font-semibold text-[13px] border-b border-[#F0F1F2] pb-1">Descriptions</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-neutral-500 font-semibold mb-1">English Description</label>
                    <textarea
                      required
                      rows={2}
                      value={descEn}
                      onChange={(e) => setDescEn(e.target.value)}
                      className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 font-semibold mb-1">Georgian Description</label>
                    <textarea
                      required
                      rows={2}
                      value={descKa}
                      onChange={(e) => setDescKa(e.target.value)}
                      className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 font-semibold mb-1">Russian Description</label>
                    <textarea
                      required
                      rows={2}
                      value={descRu}
                      onChange={(e) => setDescRu(e.target.value)}
                      className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Product Assignments & Ordering */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {/* Available Products */}
                <div className="border border-[#E1E3E5] rounded-sm p-4 flex flex-col h-72">
                  <h3 className="font-serif font-semibold text-[13px] mb-3">All Catalog Products</h3>
                  <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                    {allProducts.map((p) => {
                      const isAssigned = collectionProductIds.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => toggleProductInCollection(p.id)}
                          className={`w-full text-left px-3 py-2 border rounded-sm flex items-center justify-between transition-colors ${
                            isAssigned
                              ? "bg-neutral-900 text-white border-neutral-950"
                              : "bg-white border-[#E1E3E5] hover:bg-neutral-50"
                          }`}
                        >
                          <span>{p.name.en}</span>
                          <span className="text-[10px] opacity-75 font-mono">{p.category}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Ordered Assigned Products */}
                <div className="border border-[#E1E3E5] rounded-sm p-4 flex flex-col h-72">
                  <h3 className="font-serif font-semibold text-[13px] mb-3">Selected Products (Sortable)</h3>
                  <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                    {collectionProductIds.length === 0 ? (
                      <p className="text-[11px] text-neutral-400 py-10 text-center">No products assigned yet.</p>
                    ) : (
                      collectionProductIds.map((pId, idx) => {
                        const product = allProducts.find((p) => p.id === pId);
                        return (
                          <div key={pId} className="px-3 py-2 bg-[#F6F6F7] border border-[#E1E3E5] rounded-sm flex items-center justify-between">
                            <span className="font-medium truncate max-w-[150px]">{product ? product.name.en : pId}</span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => moveProductOrder(idx, "up")}
                                className="p-1 hover:bg-neutral-200 disabled:opacity-30 rounded text-neutral-600"
                              >
                                <ArrowUp className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === collectionProductIds.length - 1}
                                onClick={() => moveProductOrder(idx, "down")}
                                className="p-1 hover:bg-neutral-200 disabled:opacity-30 rounded text-neutral-600"
                              >
                                <ArrowDown className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleProductInCollection(pId)}
                                className="p-1 hover:bg-red-50 text-red-600 rounded ml-1"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
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
                    "Save Collection"
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
