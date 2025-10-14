// api/generate.js
export const config = { runtime: "edge" };

const map = {
  espresso: "espresso mood, messy girl rock chaos, warm amber film still",
  americano: "minimal city subway, thread, neon moody blue light",
  matcha: "green tea calm clarity, japanese garden sunlight",
  cappuccino: "vintage LP, sepia cozy foam, warm tone",
  strawberry: "pink pilates princess, highteen vibe, glossy candy light"
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
        size: "1024x1024"
      }),
    });

    const json = await resp.json();
    const b64 = json?.data?.[0]?.b64_json;
    const url = b64 ? `data:image/png;base64,${b64}` : json?.data?.[0]?.url;

    return new Response(JSON.stringify({ url, menu, prompt }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
