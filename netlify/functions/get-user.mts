import { getStore } from "@netlify/blobs";

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email");

  if (!email) {
    return new Response(JSON.stringify({ error: "Email required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const emailKey = email.toLowerCase().trim().replace(/[^a-z0-9@._-]/g, '');
    const store = getStore("users");
    const user = await store.get(emailKey, { type: "json" });

    if (!user) {
      return new Response(JSON.stringify({ found: false }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ 
      found: true,
      user: {
        email: user.email,
        name: user.name,
        location: user.location
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Get user error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export const config = {
  path: "/.netlify/functions/get-user"
};
