import { getStore } from "@netlify/blobs";

export default async function handler(req: Request) {
  // Simple auth check - use a secret param for now
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");
  
  // Set this in Netlify env vars as ADMIN_SECRET
  const adminSecret = process.env.ADMIN_SECRET || "groovepal2026";
  
  if (secret !== adminSecret) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const store = getStore("users");
    const { blobs } = await store.list();
    
    const users = [];
    for (const blob of blobs) {
      try {
        const user = await store.get(blob.key, { type: "json" });
        if (user) {
          users.push(user);
        }
      } catch (e) {
        // Skip invalid entries
      }
    }
    
    // Sort by createdAt descending
    users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return new Response(JSON.stringify({ 
      count: users.length,
      users 
    }, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("List users error:", error);
    return new Response(JSON.stringify({ error: "Server error", details: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
