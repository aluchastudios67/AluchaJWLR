import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth-helper";

export const Route = createFileRoute("/api/content")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const key = url.searchParams.get("key");

        if (key) {
          const block = db.getContentBlockByKey(key);
          return new Response(JSON.stringify({ block: block || null }), {
            headers: { "Content-Type": "application/json" },
          });
        }

        const blocks = db.getContentBlocks();
        const posts = db.getRaw().blogPosts.filter((p) => p.status === "published");
        
        return new Response(JSON.stringify({ blocks, blogPosts: posts }), {
          headers: { "Content-Type": "application/json" },
        });
      },
      POST: async ({ request }) => {
        const user = getAuthenticatedUser(request);
        if (!user) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const body = await request.json();
          const { key, data, blogPost } = body;

          // If updating blog post
          if (blogPost) {
            const dbRaw = db.getRaw();
            const { id, title, slug, content, excerpt, coverImage, status } = blogPost;
            
            if (!title || !slug || !content) {
              return new Response(JSON.stringify({ error: "Missing blog parameters" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
              });
            }

            let postIdx = dbRaw.blogPosts.findIndex((p) => p.id === id || p.slug === slug);
            const postItem = {
              id: id || `post-${Date.now()}`,
              title,
              slug,
              content,
              excerpt: excerpt || { en: "", ka: "", ru: "" },
              coverImage: coverImage || "/placeholder.jpg",
              status: status || "published",
              authorId: user.id,
              publishedAt: status === "published" ? new Date().toISOString() : undefined,
              createdAt: postIdx !== -1 ? dbRaw.blogPosts[postIdx].createdAt : new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            if (postIdx !== -1) {
              dbRaw.blogPosts[postIdx] = postItem;
            } else {
              dbRaw.blogPosts.push(postItem);
            }

            db.saveRaw(dbRaw);
            db.log(user.id, user.name, "SAVE_BLOG_POST", "BlogPost", postItem.id, `Blog post "${postItem.title.en}" saved.`);
            return new Response(JSON.stringify({ blogPost: postItem }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          // Otherwise save Content Block
          if (!key || !data) {
            return new Response(
              JSON.stringify({ error: "Missing required block parameters" }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          const savedBlock = db.saveContentBlock(user.id, user.name, key, data);
          return new Response(JSON.stringify({ block: savedBlock }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("Error saving content details:", error);
          return new Response(JSON.stringify({ error: "Server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
