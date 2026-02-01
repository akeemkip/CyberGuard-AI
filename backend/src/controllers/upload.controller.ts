import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { logger } from '../utils/logger';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// File filter for images only
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'];

  const ext = path.extname(file.originalname).toLowerCase();

  // Check both MIME type and file extension for security
  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    // Additional security: Reject files with double extensions or suspicious patterns
    const filename = file.originalname.toLowerCase();
    const suspiciousPatterns = ['.php', '.exe', '.sh', '.bat', '.cmd', '.js', '.html', '.htm'];
    const hasSuspiciousPattern = suspiciousPatterns.some(pattern => filename.includes(pattern));

    if (hasSuspiciousPattern) {
      cb(new Error('Invalid file name. File appears to contain executable content.'));
    } else {
      cb(null, true);
    }
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WebP, SVG, and ICO images are allowed.'));
  }
};

// Configure multer upload
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1, // Only one file per request
    fields: 10, // Limit number of fields
    parts: 20 // Limit number of parts
  }
});

// Upload image endpoint
export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Additional validation: Check file size after upload
    if (req.file.size === 0) {
      // Delete the empty file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Uploaded file is empty' });
    }

    // Additional validation: Check minimum file size (1KB to prevent placeholder attacks)
    if (req.file.size < 1024) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'File too small. Minimum size is 1KB' });
    }

    // Construct the URL for the uploaded file
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    res.json({
      message: 'File uploaded successfully',
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error: unknown) {
    // Clean up file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    logger.error('Upload error:', errorMessage);
    res.status(500).json({ error: 'Failed to upload file', message: errorMessage });
  }
};

// Delete uploaded image
export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;

    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({ error: 'Filename is required' });
    }

    // Sanitize filename to prevent directory traversal
    const sanitizedFilename = path.basename(filename as string);
    const filePath = path.join(uploadsDir, sanitizedFilename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    res.json({ message: 'File deleted successfully' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    logger.error('Delete error:', errorMessage);
    res.status(500).json({ error: 'Failed to delete file', message: errorMessage });
  }
};
