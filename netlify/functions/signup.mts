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

    // For MVP: Store in environment or log
    // In production: Use a real database
    const now = new Date().toISOString();
    
    const user = {
      email: email.toLowerCase().trim(),
      name: name || null,
      location: location || null,
      createdAt: now
    };
    
    // Log to Netlify function logs (viewable in dashboard)
    console.log("NEW_SIGNUP:", JSON.stringify(user));
    
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
