import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';

export const register = async (req, res) => {
   try {
      const password = req.body.password.toString(); //  было req.body.passwordtoString()
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const doc = new UserModel({
         email: req.body.email,
         fullName: req.body.fullName,
         avatarUrl: req.body.avatarUrl,
         passwordHash: hash,
      });

      const user = await doc.save();

      const token = jwt.sign(
         {
            _id: user._id,
         },
         'secret123',
         {
            expiresIn: '30d',
         },
      );

      const { passwordHash, ...userData } = user._doc;

      res.json({
         ...userData,
         token,
      }); // только один ответ может быть
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Не удалось зарегистрироваться',
      });
   }
};

export const login = async (req, res) => {
   try {
      const user = await UserModel.findOne({ email: req.body.email });

      if (!user) {
         return res.status(404).json({
            message: 'Пользователь не найден',
         });
      }

      const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

      if (!isValidPass) {
         return res.status(400).json({
            message: 'Неверный логин или пароль',
         });
      }

      const token = jwt.sign(
         {
            _id: user._id,
         },
         'secret123',
         {
            expiresIn: '30d',
         },
      );

      const { passwordHash, ...userData } = user._doc;

      res.json({
         ...userData,
         token,
      }); // только один ответ может быть
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Не удалось авторизоваться',
      });
   }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find()
    res.json(users);

 } catch (err) {
    console.log(err);
    res.status(500).json({
       message: 'Нет доступа',
    });
 }
}


export const getMe = async (req, res) => {
   try {
      const user = await UserModel.findById(req.userId);

      if (!user) {
         return res.status(404).json({
            message: 'Пользователь не найден',
         });
      }
      const { passwordHash, ...userData } = user._doc;

      res.json(userData);
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Нет доступа',
      });
   }
};

export const addHealthRecord = async (req, res) => {
   try {
      const { date, symptoms } = req.body;
      const user = await UserModel.findById(req.userId);
      if (!user) {
         return res.status(404).json({ message: 'Пользователь не найден' });
      }
      // Добавление новой записи о самочувствии
      user.healthRecords.push({ date, symptoms });
      await user.save();
      res.status(201).json(user);
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Ошибка при добавлении записи о самочувствии' });
   }
};

export const getHealthRecords = async (req, res) => {
   try {
      const user = await UserModel.findById(req.userId);
      if (!user) {
         return res.status(404).json({ message: 'Пользователь не найден' });
      }
      res.json(user.healthRecords);
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Ошибка при получении записей о самочувствии' });
   }
};
