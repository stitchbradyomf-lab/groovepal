import { getStore } from "@netlify/blobs";

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const body = await req.json();
    const { email, name, location } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: "Email required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Normalize email as key
    const emailKey = email.toLowerCase().trim().replace(/[^a-z0-9@._-]/g, '');
    
    const store = getStore("users");
    
    // Check if user exists
    const existing = await store.get(emailKey, { type: "json" });
    
    const now = new Date().toISOString();
    
    if (existing) {
      // Update existing user
      const updated = {
        ...existing,
        name: name || existing.name,
        location: location || existing.location,
        updatedAt: now
      };
      await store.setJSON(emailKey, updated);
      
      return new Response(JSON.stringify({ 
        success: true, 
        returning: true,
        user: { email: updated.email, name: updated.name, location: updated.location }
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Create new user
    const user = {
      email: email.toLowerCase().trim(),
      name: name || null,
      location: location || null,
      createdAt: now,
      updatedAt: now,
      records: []
    };
    
    await store.setJSON(emailKey, user);
    
    return new Response(JSON.stringify({ 
      success: true, 
      returning: false,
      user: { email: user.email, name: user.name, location: user.location }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Signup error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export const config = {
  path: "/.netlify/functions/signup"
};
