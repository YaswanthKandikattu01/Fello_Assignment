import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import analyzeRoutes from './routes/analyze.js';
import { initializeAI } from './services/ai-agent.js';

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const aiInitialized = initializeAI(process.env.GEMINI_API_KEY);

app.use('/api/analyze', analyzeRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    aiEnabled: aiInitialized,
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/api/config', (req, res) => {
  res.json({
    aiEnabled: aiInitialized,
    features: {
      visitorAnalysis: true,
      companyLookup: true,
      batchProcessing: true,
      techStackDetection: true,
      aiIntelligence: aiInitialized
    }
  });
});

app.post('/api/config/apikey', (req, res) => {
  const { apiKey } = req.body;
  if (!apiKey) {
    return res.status(400).json({ error: 'API key is required' });
  }
  const success = initializeAI(apiKey);
  res.json({ success, aiEnabled: success });
});

app.listen(PORT, () => {
  console.log(`\n🚀 AI Account Intelligence Server running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   AI Engine: ${aiInitialized ? '✅ Gemini AI Connected' : '⚠️  No API key - using fallback intelligence'}`);
  console.log(`\n   Set GEMINI_API_KEY in .env for full AI capabilities\n`);
});
