export default async function handler(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email");

  if (!email) {
    return new Response(JSON.stringify({ error: "Email required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  // For MVP: Always return not found (no persistence yet)
  // Returning users will need to re-enter info
  // In production: Query real database
  
  return new Response(JSON.stringify({ found: false }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}

export const config = {
  path: "/.netlify/functions/get-user"
};
