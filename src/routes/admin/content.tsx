import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save, Plus, Edit2, Loader2, FileText, Layout } from "lucide-react";
import { store, auth, type BlogPost } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/content")({
  component: AdminContentBlocksManager,
});

function AdminContentBlocksManager() {
  const [activeTab, setActiveTab] = useState<"homepage" | "blog">("homepage");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Home Hero Form Fields
  const [heroEyebrowEn, setHeroEyebrowEn] = useState("");
  const [heroEyebrowKa, setHeroEyebrowKa] = useState("");
  const [heroEyebrowRu, setHeroEyebrowRu] = useState("");
  const [heroTitle1En, setHeroTitle1En] = useState("");
  const [heroTitle1Ka, setHeroTitle1Ka] = useState("");
  const [heroTitle1Ru, setHeroTitle1Ru] = useState("");
  const [heroTitle2En, setHeroTitle2En] = useState("");
  const [heroTitle2Ka, setHeroTitle2Ka] = useState("");
  const [heroTitle2Ru, setHeroTitle2Ru] = useState("");
  const [heroDescEn, setHeroDescEn] = useState("");
  const [heroDescKa, setHeroDescKa] = useState("");
  const [heroDescRu, setHeroDescRu] = useState("");

  // Marquee Banner Fields
  const [marqueeItems, setMarqueeItems] = useState<{ ka: string; en: string; ru: string }[]>([]);

  // Blog Posts Fields
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  
  // Blog Post Form Fields
  const [postTitleEn, setPostTitleEn] = useState("");
  const [postTitleKa, setPostTitleKa] = useState("");
  const [postTitleRu, setPostTitleRu] = useState("");
  const [postSlug, setPostSlug] = useState("");
  const [postCoverImage, setPostCoverImage] = useState("");
  const [postExcerptEn, setPostExcerptEn] = useState("");
  const [postExcerptKa, setPostExcerptKa] = useState("");
  const [postExcerptRu, setPostExcerptRu] = useState("");
  const [postContentEn, setPostContentEn] = useState("");
  const [postContentKa, setPostContentKa] = useState("");
  const [postContentRu, setPostContentRu] = useState("");
  const [postStatus, setPostStatus] = useState<"draft" | "published">("published");

  const loadData = () => {
    // Load Home Hero
    const heroBlock = store.getContentBlock("home_hero");
    if (heroBlock?.data) {
      const d = heroBlock.data;
      setHeroEyebrowEn(d.eyebrow?.en || "");
      setHeroEyebrowKa(d.eyebrow?.ka || "");
      setHeroEyebrowRu(d.eyebrow?.ru || "");
      setHeroTitle1En(d.title_1?.en || "");
      setHeroTitle1Ka(d.title_1?.ka || "");
      setHeroTitle1Ru(d.title_1?.ru || "");
      setHeroTitle2En(d.title_2?.en || "");
      setHeroTitle2Ka(d.title_2?.ka || "");
      setHeroTitle2Ru(d.title_2?.ru || "");
      setHeroDescEn(d.description?.en || "");
      setHeroDescKa(d.description?.ka || "");
      setHeroDescRu(d.description?.ru || "");
    }
    // Load Marquee
    const marqueeBlock = store.getContentBlock("marquee_notices");
    if (marqueeBlock?.data?.items) {
      setMarqueeItems(marqueeBlock.data.items);
    }
    // Load Blog Posts
    setBlogPosts(store.getBlogPosts());
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const user = auth.getUser();
    if (!user) { setSaving(false); return; }
    store.updateContentBlock(user, "home_hero", {
      eyebrow: { en: heroEyebrowEn, ka: heroEyebrowKa, ru: heroEyebrowRu },
      title_1: { en: heroTitle1En, ka: heroTitle1Ka, ru: heroTitle1Ru },
      title_2: { en: heroTitle2En, ka: heroTitle2Ka, ru: heroTitle2Ru },
      description: { en: heroDescEn, ka: heroDescKa, ru: heroDescRu },
    });
    setSaving(false);
  };

  const handleSaveMarquee = () => {
    setSaving(true);
    const user = auth.getUser();
    if (!user) { setSaving(false); return; }
    store.updateContentBlock(user, "marquee_notices", { items: marqueeItems });
    setSaving(false);
  };

  const openAddPost = () => {
    setEditingPost({
      id: "",
      title: { en: "", ka: "", ru: "" },
      slug: "",
      excerpt: { en: "", ka: "", ru: "" },
      content: { en: "", ka: "", ru: "" },
      coverImage: "",
      status: "published",
    });
    setPostTitleEn("");
    setPostTitleKa("");
    setPostTitleRu("");
    setPostSlug("");
    setPostCoverImage("");
    setPostExcerptEn("");
    setPostExcerptKa("");
    setPostExcerptRu("");
    setPostContentEn("");
    setPostContentKa("");
    setPostContentRu("");
    setPostStatus("published");
  };

  const openEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setPostTitleEn(post.title.en);
    setPostTitleKa(post.title.ka);
    setPostTitleRu(post.title.ru);
    setPostSlug(post.slug);
    setPostCoverImage(post.coverImage);
    setPostExcerptEn(post.excerpt.en);
    setPostExcerptKa(post.excerpt.ka);
    setPostExcerptRu(post.excerpt.ru);
    setPostContentEn(post.content.en);
    setPostContentKa(post.content.ka);
    setPostContentRu(post.content.ru);
    setPostStatus(post.status);
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    setSaving(true);
    const user = auth.getUser();
    if (!user) { setSaving(false); return; }

    const postData = {
      title: { en: postTitleEn, ka: postTitleKa, ru: postTitleRu },
      slug: postSlug,
      coverImage: postCoverImage || "/src/assets/craft.jpg",
      excerpt: { en: postExcerptEn, ka: postExcerptKa, ru: postExcerptRu },
      content: { en: postContentEn, ka: postContentKa, ru: postContentRu },
      status: postStatus,
    };

    if (editingPost.id) {
      store.updateBlogPost(user, editingPost.id, postData);
    } else {
      store.createBlogPost(user, {
        id: `post-${Date.now()}`,
        authorId: user.id,
        publishedAt: postStatus === "published" ? new Date().toISOString() : undefined,
        ...postData,
      });
    }
    setEditingPost(null);
    setSaving(false);
    loadData();
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        <p className="text-xs text-neutral-500 mt-3 tracking-widest uppercase">Loading CMS database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold">Content Management</h1>
        <p className="text-[12px] text-neutral-500 mt-1">Manage static copywriting, notices, and blog journals.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E1E3E5] gap-4 text-xs font-semibold uppercase tracking-wider">
        <button
          onClick={() => { setActiveTab("homepage"); setEditingPost(null); }}
          className={`pb-3 flex items-center gap-2 border-b-2 px-1 transition-colors cursor-pointer ${
            activeTab === "homepage"
              ? "border-neutral-950 text-neutral-950"
              : "border-transparent text-neutral-400 hover:text-neutral-900"
          }`}
        >
          <Layout className="h-3.5 w-3.5" /> Homepage CMS
        </button>
        <button
          onClick={() => setActiveTab("blog")}
          className={`pb-3 flex items-center gap-2 border-b-2 px-1 transition-colors cursor-pointer ${
            activeTab === "blog"
              ? "border-neutral-950 text-neutral-950"
              : "border-transparent text-neutral-400 hover:text-neutral-900"
          }`}
        >
          <FileText className="h-3.5 w-3.5" /> Journal Posts
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "homepage" ? (
        <div className="space-y-6">
          {/* Hero form */}
          <form onSubmit={handleSaveHero} className="bg-white border border-[#E1E3E5] p-6 rounded-sm space-y-6 text-xs">
            <div className="flex items-center justify-between border-b border-[#F0F1F2] pb-3">
              <h3 className="font-serif text-lg font-semibold">Hero Customization</h3>
              <button
                type="submit"
                disabled={saving}
                className="bg-neutral-950 text-white text-[10px] tracking-wider uppercase font-semibold px-4 py-2 hover:bg-neutral-850 flex items-center gap-2 cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" /> {saving ? "Saving..." : "Save Hero"}
              </button>
            </div>

            {/* Eyebrows */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-neutral-500 font-semibold mb-1">Eyebrow (English)</label>
                <input
                  type="text"
                  required
                  value={heroEyebrowEn}
                  onChange={(e) => setHeroEyebrowEn(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm"
                />
              </div>
              <div>
                <label className="block text-neutral-500 font-semibold mb-1">Eyebrow (Georgian)</label>
                <input
                  type="text"
                  required
                  value={heroEyebrowKa}
                  onChange={(e) => setHeroEyebrowKa(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm font-sans"
                />
              </div>
              <div>
                <label className="block text-neutral-500 font-semibold mb-1">Eyebrow (Russian)</label>
                <input
                  type="text"
                  required
                  value={heroEyebrowRu}
                  onChange={(e) => setHeroEyebrowRu(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm"
                />
              </div>
            </div>

            {/* Title Part 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-neutral-500 font-semibold mb-1">Heading Row 1 (English)</label>
                <input
                  type="text"
                  required
                  value={heroTitle1En}
                  onChange={(e) => setHeroTitle1En(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm"
                />
              </div>
              <div>
                <label className="block text-neutral-500 font-semibold mb-1">Heading Row 1 (Georgian)</label>
                <input
                  type="text"
                  required
                  value={heroTitle1Ka}
                  onChange={(e) => setHeroTitle1Ka(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm font-sans"
                />
              </div>
              <div>
                <label className="block text-neutral-500 font-semibold mb-1">Heading Row 1 (Russian)</label>
                <input
                  type="text"
                  required
                  value={heroTitle1Ru}
                  onChange={(e) => setHeroTitle1Ru(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm"
                />
              </div>
            </div>

            {/* Title Part 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-neutral-500 font-semibold mb-1">Heading Row 2 (English)</label>
                <input
                  type="text"
                  required
                  value={heroTitle2En}
                  onChange={(e) => setHeroTitle2En(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm"
                />
              </div>
              <div>
                <label className="block text-neutral-500 font-semibold mb-1">Heading Row 2 (Georgian)</label>
                <input
                  type="text"
                  required
                  value={heroTitle2Ka}
                  onChange={(e) => setHeroTitle2Ka(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm font-sans"
                />
              </div>
              <div>
                <label className="block text-neutral-500 font-semibold mb-1">Heading Row 2 (Russian)</label>
                <input
                  type="text"
                  required
                  value={heroTitle2Ru}
                  onChange={(e) => setHeroTitle2Ru(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm"
                />
              </div>
            </div>

            {/* Hero Description */}
            <div className="space-y-4">
              <div>
                <label className="block text-neutral-500 font-semibold mb-1">Subdescription (English)</label>
                <textarea
                  required
                  rows={2}
                  value={heroDescEn}
                  onChange={(e) => setHeroDescEn(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm"
                />
              </div>
              <div>
                <label className="block text-neutral-500 font-semibold mb-1">Subdescription (Georgian)</label>
                <textarea
                  required
                  rows={2}
                  value={heroDescKa}
                  onChange={(e) => setHeroDescKa(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm font-sans"
                />
              </div>
              <div>
                <label className="block text-neutral-500 font-semibold mb-1">Subdescription (Russian)</label>
                <textarea
                  required
                  rows={2}
                  value={heroDescRu}
                  onChange={(e) => setHeroDescRu(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm"
                />
              </div>
            </div>
          </form>

          {/* Marquee Banner Forms */}
          <div className="bg-white border border-[#E1E3E5] p-6 rounded-sm space-y-6 text-xs">
            <div className="flex items-center justify-between border-b border-[#F0F1F2] pb-3">
              <div>
                <h3 className="font-serif text-lg font-semibold">Marquee notices</h3>
                <p className="text-[10px] text-neutral-400 mt-0.5">Top scrolling banner lines.</p>
              </div>
              <button
                type="button"
                onClick={handleSaveMarquee}
                disabled={saving}
                className="bg-neutral-950 text-white text-[10px] tracking-wider uppercase font-semibold px-4 py-2 hover:bg-neutral-850 flex items-center gap-2 cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" /> {saving ? "Saving..." : "Save Notices"}
              </button>
            </div>

            <div className="space-y-4">
              {marqueeItems.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-neutral-50 p-4 border border-[#E1E3E5] rounded-sm">
                  <div>
                    <label className="block text-neutral-500 font-semibold mb-1">Notice {index + 1} (EN)</label>
                    <input
                      type="text"
                      value={item.en}
                      onChange={(e) => {
                        const updated = [...marqueeItems];
                        updated[index].en = e.target.value;
                        setMarqueeItems(updated);
                      }}
                      className="w-full px-3 py-2 bg-white border border-[#E1E3E5] rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 font-semibold mb-1">Notice {index + 1} (KA)</label>
                    <input
                      type="text"
                      value={item.ka}
                      onChange={(e) => {
                        const updated = [...marqueeItems];
                        updated[index].ka = e.target.value;
                        setMarqueeItems(updated);
                      }}
                      className="w-full px-3 py-2 bg-white border border-[#E1E3E5] rounded-sm font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 font-semibold mb-1">Notice {index + 1} (RU)</label>
                    <input
                      type="text"
                      value={item.ru}
                      onChange={(e) => {
                        const updated = [...marqueeItems];
                        updated[index].ru = e.target.value;
                        setMarqueeItems(updated);
                      }}
                      className="w-full px-3 py-2 bg-white border border-[#E1E3E5] rounded-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Blog TAB */
        <div className="space-y-6">
          {!editingPost ? (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={openAddPost}
                  className="bg-neutral-950 text-white text-[11px] tracking-wider uppercase font-semibold px-4 py-2.5 rounded-sm hover:bg-neutral-850 flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> New Post
                </button>
              </div>

              {/* Blog Posts list */}
              <div className="bg-white border border-[#E1E3E5] rounded-sm overflow-hidden">
                {blogPosts.length === 0 ? (
                  <p className="text-neutral-500 text-center py-20 text-xs">No blog articles published.</p>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#E1E3E5] bg-neutral-50 text-neutral-400 font-semibold uppercase tracking-wider">
                        <th className="py-3 px-4">Article Title</th>
                        <th className="py-3 px-4">Slug</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0F1F2]">
                      {blogPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-neutral-50">
                          <td className="py-4 px-4">
                            <p className="font-semibold text-neutral-900">{post.title.en}</p>
                            <p className="text-[10px] text-neutral-400 mt-0.5">ქარ: {post.title.ka}</p>
                          </td>
                          <td className="py-4 px-4 font-mono text-neutral-600">/{post.slug}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-0.5 rounded-sm font-semibold uppercase tracking-wider text-[9px] ${
                              post.status === "published"
                                ? "bg-green-50 text-green-700"
                                : "bg-neutral-100 text-neutral-600"
                            }`}>
                              {post.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => openEditPost(post)}
                              className="p-1.5 hover:bg-neutral-100 hover:text-neutral-950 rounded text-neutral-500 transition-colors"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          ) : (
            /* Editing / Creating blog post form */
            <form onSubmit={handleSavePost} className="bg-white border border-[#E1E3E5] p-6 rounded-sm space-y-6 text-xs">
              <div className="flex items-center justify-between border-b border-[#F0F1F2] pb-3">
                <h3 className="font-serif text-lg font-semibold">
                  {editingPost.id ? `Edit "${editingPost.title.en}"` : "New Blog Post"}
                </h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingPost(null)}
                    className="px-4 py-2 border border-[#E1E3E5] text-neutral-600 hover:bg-neutral-50 rounded-sm font-semibold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-neutral-950 text-white text-[10px] tracking-wider uppercase font-semibold px-4 py-2 hover:bg-neutral-850 flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="h-3.5 w-3.5" /> {saving ? "Saving..." : "Save Post"}
                  </button>
                </div>
              </div>

              {/* Title */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-500 font-semibold mb-1">Title (EN)</label>
                  <input
                    type="text"
                    required
                    value={postTitleEn}
                    onChange={(e) => setPostTitleEn(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 font-semibold mb-1">Title (KA)</label>
                  <input
                    type="text"
                    required
                    value={postTitleKa}
                    onChange={(e) => setPostTitleKa(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm font-sans"
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 font-semibold mb-1">Title (RU)</label>
                  <input
                    type="text"
                    required
                    value={postTitleRu}
                    onChange={(e) => setPostTitleRu(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm"
                  />
                </div>
              </div>

              {/* Slug, Cover image, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-500 font-semibold mb-1">Slug URL</label>
                  <input
                    type="text"
                    required
                    value={postSlug}
                    onChange={(e) => setPostSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ""))}
                    placeholder="e.g. lost-in-lost-wax"
                    className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 font-semibold mb-1">Cover Image Link</label>
                  <input
                    type="text"
                    value={postCoverImage}
                    onChange={(e) => setPostCoverImage(e.target.value)}
                    placeholder="e.g. /src/assets/craft.jpg"
                    className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 font-semibold mb-1">Publishing Status</label>
                  <select
                    value={postStatus}
                    onChange={(e) => setPostStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Excerpts */}
              <div className="space-y-4">
                <h3 className="font-serif font-semibold text-[13px] border-b border-[#F0F1F2] pb-1">Excerpts</h3>
                <div>
                  <label className="block text-neutral-500 font-semibold mb-1">Excerpt (English)</label>
                  <input
                    type="text"
                    value={postExcerptEn}
                    onChange={(e) => setPostExcerptEn(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 font-semibold mb-1">Excerpt (Georgian)</label>
                  <input
                    type="text"
                    value={postExcerptKa}
                    onChange={(e) => setPostExcerptKa(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm font-sans"
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 font-semibold mb-1">Excerpt (Russian)</label>
                  <input
                    type="text"
                    value={postExcerptRu}
                    onChange={(e) => setPostExcerptRu(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm"
                  />
                </div>
              </div>

              {/* Main Content */}
              <div className="space-y-4">
                <h3 className="font-serif font-semibold text-[13px] border-b border-[#F0F1F2] pb-1">Article Body Text</h3>
                <div>
                  <label className="block text-neutral-500 font-semibold mb-1">Content (English)</label>
                  <textarea
                    rows={8}
                    required
                    value={postContentEn}
                    onChange={(e) => setPostContentEn(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 font-semibold mb-1">Content (Georgian)</label>
                  <textarea
                    rows={8}
                    required
                    value={postContentKa}
                    onChange={(e) => setPostContentKa(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm font-sans text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 font-semibold mb-1">Content (Russian)</label>
                  <textarea
                    rows={8}
                    required
                    value={postContentRu}
                    onChange={(e) => setPostContentRu(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent border border-[#E1E3E5] rounded-sm font-mono text-[11px]"
                  />
                </div>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
