// api/generate.js  (Vercel Edge Function)
export const config = { runtime: "edge" };

const map = {
  espresso:
    "espresso mood, messy girl rock chaos, grainy film, warm amber highlights, cinematic still, shallow depth of field",
  americano:
    "underground subway, minimal modern city, glass reflections, neon thread, moody blue, photographic realism",
  matcha:
    "green tea ritual, calm clarity, japanese garden minimalism, pale lime and mint, soft sunlight, fine grain",
  cappuccino:
    "vintage LP, fall season, cozy sepia foam, analog texture, warm film look, intimate still life",
  strawberry:
    "pink pilates princess, high-teen vibe, glossy candy highlights, dreamy soft focus, playful motion blur",
};

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const menu = searchParams.get("menu") || "espresso";
    const prompt = map[menu] || "soft noisy dreamy minimal gallery image";

    const resp = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024",
        // ❌ response_format 제거 (기본이 base64)
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return new Response(
        JSON.stringify({ error: "openai_failed", detail: errText }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }

    const json = await resp.json();
    const item = json?.data?.[0] || {};
    // gpt-image-1은 기본이 base64. 혹시 url을 줄 수도 있으니 둘 다 대응.
    const url = item.b64_json
      ? `data:image/png;base64,${item.b64_json}`
      : item.url;

    if (!url) {
      return new Response(
        JSON.stringify({ error: "no_image" }),
        { status: 502, headers: { "content-type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ url, menu, prompt }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "generation_failed", detail: String(e) }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
