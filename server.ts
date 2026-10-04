import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const GM_SYSTEM_PROMPT = `[Role & Objective]
คุณคือ "Game Master (GM) และผู้ควบคุมระบบ (The System)" ประจำเกม Text-based RPG มีหน้าที่เล่าเรื่อง บรรยายฉาก ควบคุม NPC สัตว์ประหลาด และตอบสนองต่อการกระทำของผู้เล่นอย่างสมจริง มีชั้นเชิง และไหลลื่นตามเส้นเรื่อง

[Phase 1: เริ่มต้นเรื่องราว (Setup Phase)]
ในข้อความแรก ให้ต้อนรับผู้เล่นเข้าสู่ "พื้นที่สีขาวว่างเปล่าหลังความตาย" แล้วให้สิทธิ์ผู้เล่นกำหนด 3 ข้อด้วยตัวเอง:
1. โลกที่ต้องการไปเกิดใหม่ (เช่น ดาร์กแฟนตาซี, ไซไฟ/ไซเบอร์พังก์, ยุคซอมบี้วันสิ้นโลก, โลกอนิเมะ/หนัง หรือโลกสมมุติใดๆ)
2. ตัวตนและสถานะเริ่มต้น (เพศ, อายุ, รูปลักษณ์, สรีระ, เผ่าพันธุ์, นิสัย)
3. พลังพิเศษ / สกิลเริ่มต้น / หน้าที่ของระบบที่ตัวเองต้องการเลือก
*เมื่อผู้เล่นตอบครบทั้ง 3 ข้อ จึงค่อยเริ่มบรรยายฉากเปิดการเกิดใหม่เข้าสู่เนื้อเรื่องจริงอย่างอลังการและดื่มด่ำ*

[Tone & Writing Style]
- เล่าเรื่องสไตล์นิยาย/บทโรลเพลย์ บรรยายเห็นภาพ มีมิติ อารมณ์ และประสาทสัมผัสครบถ้วน (แสง สี กลิ่น เสียง สัมผัส)
- ใช้ภาษาธรรมชาติ บทสนทนาลื่นไหล ไม่ประดิษฐ์คำทางการจนแข็งทื่อ
- "มีคำหยาบคาย/คำสบถได้ตามอารมณ์ของตัวละครและสถานการณ์" เช่น คำด่าเวลาโมโห, ศัตรูกวนประสาท, บทสนทนาดิบๆ ของพวกนักเลงหรือทหารรับจ้าง
- ฉากต่อสู้ ดาร์ก ดิบ เลือดสาด และลุ้นระทึกตามสมควร

[Mature & 18+ Handling (แนวทางการจัดการฉากผู้ใหญ่และความสัมพันธ์)]
1. ปรับระดับความละเอียดตามที่ผู้เล่นพิมพ์ (Match the User's Pace):
   - หากเนื้อเรื่องดำเนินไปถึงฉากความสัมพันธ์ลึกซึ้ง/18+ แต่ผู้เล่น "ไม่ได้พิมพ์ลงรายละเอียดการกระทำ" (เช่น พิมพ์แค่พาเข้าห้อง, มีอะไรกัน, หรือข้ามฉาก): ให้บรรยายเพียงมู้ด อารมณ์ บรรยากาศ สัมผัสสั้นๆ พอให้เห็นภาพความสัมพันธ์ แล้วค่อยตัดภาพ (Fade to black) หรือเดินเรื่องต่อทันที ไม่ต้องยัดเยียดบทบรรยายทางกายภาพที่เยิ่นเย้อเกินไป
   - หากผู้เล่น "เป็นฝ่ายพิมพ์การกระทำละเอียดชัดเจน": ให้บรรยายตอบรับตามระดับที่ผู้เล่นเปิดประเด็นไว้ บรรยายอารมณ์ความรู้สึกและปฏิกิริยาของตัวละครให้สมจริง แล้วดึงผลลัพธ์กลับเข้าสู่เนื้อเรื่องหลัก
2. ความสัมพันธ์และเสน่ห์ของตัวละคร (Romance & Chemistry): บรรยายเสน่ห์ สรีระ ทรวดทรง หรือความดึงดูดทางเพศของตัวละครได้ตามความเหมาะสมของบริบท

[Rules for Consistency & Memory (กฎห้ามลืมบท)]
1. ห้ามหลุดคาแรคเตอร์: ห้ามตอบในฐานะผู้ช่วย AI (เช่น "มีอะไรให้ช่วยอีกไหม") ให้สวมบทบาทเป็น GM และระบบตลอดเวลา
2. ห้ามแย่งผู้เล่นเล่น (No Godmoding): บรรยายผลกระทบ สภาพแวดล้อม และปฏิกิริยาของ NPC แล้วส่งจังหวะให้ผู้เล่นตัดสินใจเสมอ ไม่ตัดสินใจแทนตัวละครผู้เล่นในการกระทำสำคัญ
3. ระบบกล่องสถานะ (Status Box): แนบกล่องสรุปสั้นๆ ท้ายข้อความเสมอเมื่อมีเหตุการณ์สำคัญ หรือเมื่อสถานะผู้เล่นเปลี่ยน เพื่อล็อกความจำของระบบ เช่น:
-----------------------------
[ ข้อมูลสถานะ ]
• ชื่อ/ตัวตน: ...
• ระดับ/พลัง: ...
• HP / MP / สถานะผิดปกติ: ...
• ไอเทม/สกิลสำคัญ: ...
• สถานที่/เป้าหมายปัจจุบัน: ...
-----------------------------

[UI Sync Requirement]
ในตอนท้ายสุดของข้อความหลังจากกล่องสถานะ ให้แนบแท็กคอมเมนต์ JSON พิเศษเพื่อให้อินเตอร์เฟซของเกมซิงค์สถานะตัวละครและปุ่มทางเลือกได้อย่างสมบูรณ์แบบ รูปแบบดังนี้:
<!--SYSTEM_SYNC:{"name":"...","race":"...","title":"...","level":1,"hp":100,"maxHp":100,"mp":50,"maxMp":50,"location":"...","dangerLevel":"Safe|Low|Medium|High|Deadly","skills":["สกิล 1","สกิล 2"],"inventory":["ไอเทม 1"],"objective":"เป้าหมายปัจจุบัน","suggestedActions":["ทางเลือกที่ 1","ทางเลือกที่ 2","ทางเลือกที่ 3"]}-->
(หมายเหตุ: อย่าลืมปิดแท็ก <!--SYSTEM_SYNC:...--> ให้ถูกต้อง และรักษาค่าตัวเลข/ข้อมูลให้สอดคล้องกับเนื้อเรื่อง)`;

async function generateGMStory(contents: any[]): Promise<string> {
  const models = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
  let lastErr: any = null;

  for (const model of models) {
    // Retry each model up to 2 times on transient capacity errors (503/429)
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: GM_SYSTEM_PROMPT,
            temperature: 0.85,
            topP: 0.95,
          },
        });
        if (res && res.text) {
          return res.text;
        }
      } catch (err: any) {
        lastErr = err;
        const status =
          err?.status || err?.statusCode || (String(err?.message || '').includes('503') ? 503 : 0);

        // If 503, 429, or 500, backoff briefly before retrying or switching models
        if (attempt < 2 && (status === 503 || status === 429 || status === 500)) {
          await new Promise((resolve) => setTimeout(resolve, 600 * attempt));
          continue;
        }
        // Move to the next model on persistent failure
        break;
      }
    }
  }

  throw lastErr || new Error('Game Master system is temporarily unavailable. Please retry.');
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Chat Endpoint with robust streaming and no SDK buffer artifacts
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const { messages } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required' });
      }

      // Format messages for @google/genai
      const contents = messages.map((m: { role: string; content: string }) => {
        return {
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        };
      });

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const fullText = await generateGMStory(contents);

      // Stream text in fast, fluid phrase chunks to give authentic RPG typewriter feel
      const words = fullText.split(/(\s+|\n+)/);
      let batch = '';
      for (let i = 0; i < words.length; i++) {
        batch += words[i];
        if (batch.length >= 20 || i === words.length - 1) {
          res.write(`data: ${JSON.stringify({ chunk: batch })}\n\n`);
          batch = '';
          await new Promise((r) => setTimeout(r, 12));
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (err: any) {
      console.error('Chat error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: err.message || 'Internal server error' });
      } else {
        res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
        res.end();
      }
    }
  });

  // TTS Endpoint for GM voice narration
  app.post('/api/tts', async (req: Request, res: Response) => {
    try {
      const { text, voice = 'Fenrir' } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Text is required' });
      }

      // Strip out markdown or status tags for clean speech synthesis
      const cleanText = text
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/\[\s*ข้อมูลสถานะ[\s\S]*?\]/g, '')
        .replace(/[-*#_`>]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 800);

      const ttsModels = ['gemini-3.8-flash-lite-tts', 'gemini-3.8-flash-tts'];
      let base64Audio: string | null = null;

      for (const ttsModel of ttsModels) {
        try {
          const response = await ai.models.generateContent({
            model: ttsModel,
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: cleanText,
                    speechMetadata: {
                      style: 'Deep, dramatic, charismatic RPG Game Master and System overseer',
                    },
                  },
                ],
              },
            ],
            config: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: voice || 'Fenrir' },
                },
              },
            },
          });

          base64Audio =
            response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
          if (base64Audio) break;
        } catch {
          // Fall back to alternate TTS model
        }
      }

      if (base64Audio) {
        res.json({ audio: base64Audio });
      } else {
        res.status(503).json({ error: 'TTS is temporarily busy' });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to synthesize speech' });
    }
  });

  // Dice roll helper endpoint
  app.post('/api/dice', (req: Request, res: Response) => {
    const { dice = 'd20', modifier = 0, skill = 'Action' } = req.body;
    let sides = 20;
    if (dice === 'd100') sides = 100;
    else if (dice === 'd6') sides = 6;
    else if (dice === 'd12') sides = 12;

    const roll = Math.floor(Math.random() * sides) + 1;
    const total = roll + (Number(modifier) || 0);

    let outcome = 'Normal';
    if (sides === 20) {
      if (roll === 20) outcome = 'Critical Success (สำเร็จขั้นวิกฤต/ปาฏิหาริย์!)';
      else if (roll === 1) outcome = 'Critical Failure (ล้มเหลวขั้นวิกฤต/หายนะ!)';
      else if (total >= 15) outcome = 'Great Success (สำเร็จอย่างงดงาม)';
      else if (total >= 10) outcome = 'Success (สำเร็จ)';
      else outcome = 'Failure (ล้มเหลว)';
    }

    res.json({
      dice,
      sides,
      roll,
      modifier,
      total,
      outcome,
      timestamp: new Date().toISOString(),
    });
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'The System RPG Server' });
  });

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
