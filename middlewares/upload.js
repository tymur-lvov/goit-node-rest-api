import multer from 'multer';
import path from 'node:path';

const destination = path.resolve('temp');

const storage = multer.diskStorage({
  destination,
  filename: (req, file, callback) => {
    const uniquePreffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePreffix}_${file.originalname}`;

    callback(null, filename);
  },
});

const upload = multer({
  storage,
});

export default upload;
