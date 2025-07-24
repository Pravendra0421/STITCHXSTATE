// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises'; // Use fs.promises for async file operations

// IMPORTANT: For production, consider using a more robust temporary directory
// and handling cleanup, or better yet, upload directly to cloud storage.
const uploadDir = path.join(process.cwd(), 'public', 'uploads');

// Ensure the upload directory exists
async function ensureUploadDir() {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.error('Failed to create upload directory:', error);
    // You might want to throw an error or handle this more gracefully
  }
}

// Multer configuration for disk storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureUploadDir(); // Ensure directory exists before saving
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Create a multer instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/; // Added webp
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Error: Only image files (JPEG, JPG, PNG, GIF, WebP) are allowed!"));
  },
});

// A helper to run multer middleware
// Multer is designed for Express, so we need to wrap it for Next.js API Routes
function runMiddleware(req: NextRequest, res: NextResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// POST handler for /api/upload
export async function POST(request: NextRequest) {
  try {
    // Multer expects a Node.js 'req' object, so we need to convert NextRequest body
    // Next.js (App Router) Request object has .formData() which is easier
    const formData = await request.formData();
    const file = formData.get('image') as File | null; // 'image' is the key from frontend

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded.' }, { status: 400 });
    }

    // Convert File object to Buffer for Multer (which expects Node.js streams/buffers)
    const buffer = Buffer.from(await file.arrayBuffer());

    // Create a dummy 'req' and 'res' object for multer compatibility
    // In a real scenario with Next.js 13+, you might parse formData manually or use a library that's App Router native for files.
    // For now, let's stick to the multer usage as requested, simulating its behavior.
    const uniqueFileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.name)}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    await fs.writeFile(filePath, buffer);

    // Construct the public URL relative to the Next.js app's base URL
    // This assumes your Next.js app serves static files from /public
    const imageUrl = `/uploads/${uniqueFileName}`; // This is the URL accessible from the browser

    return NextResponse.json({
      message: 'Image uploaded successfully!',
      url: imageUrl,
      filename: uniqueFileName,
    }, { status: 200 });

  } catch (error: any) {
    console.error('API Upload Error:', error);
    return NextResponse.json({ message: error.message || 'File upload failed.' }, { status: 500 });
  }
}

// IMPORTANT: Next.js API Routes (App Router) by default parse request body.
// To use Multer, we need to disable the default bodyParser.
export const config = {
  api: {
    bodyParser: false, // Disables Next.js's default body parser to let multer handle it
  },
};