import UserModel from '../models/User.js';

export const sendMessage = async (req, res) => {
   try {
      const { receiverId, message, senderId } = req.body;

      const receiver = await UserModel.findById(receiverId);
      if (!receiver) {
         return res.status(404).json({ message: 'Получатель не найден' });
      }

      const newMessage = {
         senderId,
         receiverId,
         message,
         timestamp: new Date(),
      };

      // Сохраняем сообщение у обоих пользователей
      const senderUpdate = await UserModel.findByIdAndUpdate(
         senderId,
         { $push: { messages: newMessage } },
         { new: true },
      );
      const receiverUpdate = await UserModel.findByIdAndUpdate(
         receiverId,
         { $push: { messages: newMessage } },
         { new: true },
      );

      console.log('Sender Update:', senderUpdate); // Логирование обновления отправителя
      console.log('Receiver Update:', receiverUpdate); // Логирование обновления получателя

      res.status(201).json(newMessage);
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Ошибка при отправке сообщения' });
   }
};

export const getMessages = async (req, res) => {
   try {
      const userId = req.userId;
      const user = await UserModel.findById(userId)
         .select('messages')
         .populate('messages.senderId', 'fullName')
         .populate('messages.receiverId', 'fullName');

      if (!user) {
         return res.status(404).json({ message: 'Пользователь не найден' });
      }

      res.json({ messages: user.messages });
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Ошибка при получении сообщений' });
   }
};
