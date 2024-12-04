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
  origin: 'http://localhost:5173', // Ganti dengan origin frontend Anda
}));

// Konfigurasi multer untuk menyimpan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/gambar')); // Folder untuk menyimpan gambar
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Menyimpan dengan nama unik
  }
});

const upload = multer({ storage: storage });

// Endpoint untuk upload gambar
app.post('/upload', upload.single('image'), (req, res) => {
  res.json({ imageUrl: `/gambar/${req.file.filename}` }); // Mengembalikan URL gambar
});

app.use(express.static('public')); // Menyajikan file statis dari folder public

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});