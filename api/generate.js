// api/generate.js
import OpenAI from "openai";

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

export default async function handler(req, res) {
  try {
    const { menu } = req.query;
    const prompt = map[menu] || "soft noisy dreamy minimal gallery image";
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // gpt-image-1으로 1024 이미지를 base64로 생성
    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const b64 = result.data?.[0]?.b64_json;
    if (!b64) return res.status(502).json({ error: "no_image" });

    const dataUrl = `data:image/png;base64,${b64}`;
    res.status(200).json({ url: dataUrl, prompt, menu });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "generation_failed" });
  }
}
