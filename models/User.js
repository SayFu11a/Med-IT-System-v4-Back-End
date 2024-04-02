import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
   {
      fullName: {
         type: String,
         required: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
      },
      passwordHash: {
         type: String,
         required: true,
      },
      avatarUrl: String,
      patient: {
         type: Boolean,
         default: false, // Значение по умолчанию - false, если не указано иное
         required: false,
      },
   },
   {
      timestamps: true,
   },
);

export default mongoose.model('User', UserSchema);
