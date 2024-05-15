import express from 'express';
import mongoose from 'mongoose';

import cors from 'cors';
import multer from 'multer';
import { registerValidation, loginValidation, postCreateValidation } from './validations/auth.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';
import { UserController, PostController } from './controllers/index.js';

mongoose
   .connect(
      'mongodb+srv://admin1:wwwwww@cluster0.okaofvn.mongodb.net/blog?retryWrites=true&w=majority',
   )
   .then(() => console.log('DB ok'))
   .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
   destination: (_, __, cb) => {
      cb(null, 'uploads');
   },
   filename: (_, file, cb) => {
      // Уникальное имя файла для избежания конфликтов
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${file.originalname}-${uniqueSuffix}`, { encoding: 'utf-8' });
   },
});

const documentUpload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Маршрут для загрузки документа Word
app.post('/uploadDocument', checkAuth, documentUpload.single('document'), (req, res) => {
   // Возвращаем URL загруженного документа
   res.json({
      url: `/uploads/${req.file.filename}`,
   });
});

// Остальные маршруты без изменений
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);
app.post('/upload', checkAuth, documentUpload.single('image'), (req, res) => {
   res.json({
      url: `/uploads/${req.file.filename}`,
   });
});
app.get('/tags', PostController.getLastTags);
app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
   '/posts/:id',
   checkAuth,
   postCreateValidation,
   handleValidationErrors,
   PostController.update,
);

app.listen(4444, (err) => {
   if (err) {
      return console.log(err);
   }
   console.log('Server OK');
});
