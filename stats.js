export async function onRequestGet(context) {
  if (!context.env.DB) return Response.json({ error: "DB binding is missing" }, {status:500});
  const row = await context.env.DB.prepare("SELECT COUNT(*) AS count FROM notes").first();
  return Response.json({ notes: row?.count ?? 0 });
}
