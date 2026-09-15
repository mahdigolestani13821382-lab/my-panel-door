export async function onRequestGet(context) {
  const out = { ok: true, d1: false, kv: false };
  try {
    if (context.env.DB) {
      await context.env.DB.prepare("SELECT 1").first();
      out.d1 = true;
    }
  } catch {}
  try {
    if (context.env.KV) {
      await context.env.KV.get("__health_check__");
      out.kv = true;
    }
  } catch {}
  return Response.json(out);
}
