import multer from 'multer';
import slugify from 'slugify';

const uploadMemory = multer({
  storage: multer.memoryStorage(),
});

const uploadDisk = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '@/uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, slugify(file.originalname + '-' + Date.now()));
    },
  }),
});

export { uploadDisk, uploadMemory };
