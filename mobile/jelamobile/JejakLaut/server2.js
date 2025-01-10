import express from 'express';
import multer from 'multer';
import path from 'path';
import cors from 'cors'; // Impor cors
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5001;

// Gunakan middleware CORS
app.use(cors({
  origin: [
    'http://', // React Web
    'exp://', // React Native Expo
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Endpoint contoh untuk komunikasi dengan server FastAPI
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server Express untuk React Web dan React Native Expo sudah berjalan!' });
});

// Mulai server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});