import { getStore } from "@netlify/blobs";

const POCKETBASE_URL = "http://192.241.180.69:8090";
const POCKETBASE_COLLECTION = "groove_pal_waitlist";

async function getPocketBaseToken(): Promise<string | null> {
  try {
    const resp = await fetch(`${POCKETBASE_URL}/api/collections/users/auth-with-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identity: "groovepal-service@kaihamil.com",
        password: "dRPSVxBLrJ6l9rl"
      })
    });
    
    if (!resp.ok) {
      console.error("PocketBase auth failed:", await resp.text());
      return null;
    }
    
    const data = await resp.json();
    return data.token;
  } catch (error) {
    console.error("PocketBase auth error:", error);
    return null;
  }
}

async function createWaitlistEntry(token: string, userData: any) {
  try {
    const resp = await fetch(`${POCKETBASE_URL}/api/collections/${POCKETBASE_COLLECTION}/records`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(userData)
    });
    
    if (!resp.ok) {
      const error = await resp.text();
      console.error("PocketBase create failed:", error);
      throw new Error(`PocketBase error: ${error}`);
    }
    
    return await resp.json();
  } catch (error) {
    console.error("Create entry error:", error);
    throw error;
  }
}

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

    const normalizedEmail = email.toLowerCase().trim();
    const now = new Date().toISOString();
    
    // Get PocketBase token
    const pbToken = await getPocketBaseToken();
    
    if (!pbToken) {
      return new Response(JSON.stringify({ error: "Service authentication failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Parse location into city/state if possible
    let city = null;
    let state = null;
    if (location) {
      const parts = location.split(",").map((p: string) => p.trim());
      if (parts.length >= 2) {
        city = parts[0];
        state = parts[1];
      } else {
        city = location;
      }
    }
    
    // Create entry in PocketBase
    const waitlistData = {
      email: normalizedEmail,
      first_name: name || null,
      city: city,
      state: state,
      source: "website",
      referrer: null,
      converted: false,
      signed_up_at: now,
      notes: `Migrated from Netlify Blobs on ${now}`
    };
    
    const pbRecord = await createWaitlistEntry(pbToken, waitlistData);
    
    // Also maintain legacy Netlify Blobs storage (dual-write during migration)
    const store = getStore("users");
    const emailKey = normalizedEmail.replace(/[^a-z0-9@._-]/g, '_');
    
    const legacyUser = {
      email: normalizedEmail,
      name: name || null,
      location: location || null,
      pocketbase_id: pbRecord.id,
      createdAt: now,
      updatedAt: now
    };
    
    await store.setJSON(emailKey, legacyUser);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Added to waitlist",
      user: { 
        email: normalizedEmail, 
        name: name || null, 
        location: location || null,
        pocketbase_id: pbRecord.id
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Signup error:", error);
    return new Response(JSON.stringify({ error: "Server error", details: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
