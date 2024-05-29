import UserModel from '../models/User.js'

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message, senderId } = req.body

    const receiver = await UserModel.findById(receiverId)
    if (!receiver) {
      return res.status(404).json({ message: 'Получатель не найден' })
    }

    const newMessage = {
      senderId,
      receiverId,
      message,
      timestamp: new Date()
    }

    const senderData = await UserModel.findById(senderId)
    const senderChats = senderData.chats || {}
    const senderChatCurrentMessages = senderChats[receiverId] || []

    const receiverData = await UserModel.findById(receiverId)
    const receiverChats = receiverData.chats || {}
    const receiverChatCurrentMessages = receiverChats[senderId] || []
    senderData.set({
      chats: {
        ...senderChats,
        [receiverId]: [...senderChatCurrentMessages, newMessage]
      }
    })
    receiverData.set({
      chats: {
        ...receiverChats,
        [senderId]: [...receiverChatCurrentMessages, newMessage]
      }
    })

    await senderData.save()
    await receiverData.save()

    res.status(201).json(newMessage)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Ошибка при отправке сообщения' })
  }
}

export const getMessages = async (req, res) => {
  try {
    const userId = req.userId
    const user = await UserModel.findById(userId)
      .select('messages')
      .populate('messages.senderId', 'fullName')
      .populate('messages.receiverId', 'fullName')

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    res.json({ messages: user.messages })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Ошибка при получении сообщений' })
  }
}
