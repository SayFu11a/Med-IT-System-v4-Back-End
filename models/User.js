import mongoose from 'mongoose'

const UserMessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})

const UserMessageSchemaNew = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})

const UserHealthRecordSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  symptoms: {
    type: Map,
    of: Boolean
  }
})

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    avatarUrl: String,
    healthRecords: [UserHealthRecordSchema],
    patient: {
      type: Boolean,
      default: false, // Значение по умолчанию - false, если не указано иное
      required: false
    },
    chats:  { type: Object, of: UserMessageSchemaNew },
    messages: [UserMessageSchema]
  },
  {
    timestamps: true
  }
)

export default mongoose.model('User', UserSchema)
