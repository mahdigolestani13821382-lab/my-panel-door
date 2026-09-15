export async function onRequestGet(context) {
  if (!context.env.DB) return Response.json({ error: "DB binding is missing" }, {status:500});
  const result = await context.env.DB.prepare("SELECT id, text, created_at FROM notes ORDER BY id DESC").all();
  return Response.json({ notes: result.results || [] });
}

export async function onRequestPost(context) {
  if (!context.env.DB) return Response.json({ error: "DB binding is missing" }, {status:500});
  const body = await context.request.json().catch(()=>null);
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  if (!text || text.length > 1000) return Response.json({ error: "Invalid text" }, {status:400});
  const result = await context.env.DB.prepare(
    "INSERT INTO notes (text, created_at) VALUES (?, datetime('now'))"
  ).bind(text).run();
  return Response.json({ ok: true, id: result.meta?.last_row_id });
}

export async function onRequestDelete(context) {
  if (!context.env.DB) return Response.json({ error: "DB binding is missing" }, {status:500});
  const id = Number(new URL(context.request.url).searchParams.get("id"));
  if (!Number.isInteger(id)) return Response.json({ error: "Invalid id" }, {status:400});
  await context.env.DB.prepare("DELETE FROM notes WHERE id = ?").bind(id).run();
  return Response.json({ ok: true });
}
